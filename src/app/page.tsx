'use client';

import { useState, useEffect } from 'react';
import { parseGCode } from '@/components/GCodeParser';
import GCodeViewer from '@/components/GCodeViewer';

interface Point {
  x: number;
  y: number;
  z: number;
  e: number;
}

interface Path {
  start: Point;
  end: Point;
}

export default function Home() {
  const [paths, setPaths] = useState<Path[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGCode = async () => {
      try {
        console.log('Fetching G-code file...');
        const response = await fetch('/api/gcode');
        
        if (!response.ok) {
          console.error('Failed to fetch G-code:', response.status, response.statusText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        console.log('G-code file loaded successfully, length:', text.length);
        console.log('First 200 characters of G-code:', text.substring(0, 200));
        
        // Parse G-code and generate paths
        const commands = parseGCode(text);
        console.log('Parsed commands:', commands.length);
        console.log('First few commands:', commands.slice(0, 5));

        const currentPosition: Point = { x: 0, y: 0, z: 0, e: 0 };
        const newPaths: Path[] = [];

        commands.forEach((command, index) => {
          if (command.type === 'G0' || command.type === 'G1') {
            const start: Point = { ...currentPosition };
            
            // Update position based on command parameters
            if (command.x !== undefined) currentPosition.x = command.x;
            if (command.y !== undefined) currentPosition.y = command.y;
            if (command.z !== undefined) currentPosition.z = command.z;
            if (command.e !== undefined) currentPosition.e = command.e;

            const end: Point = { ...currentPosition };
            newPaths.push({ start, end });

            if (index < 5) {
              console.log(`Path ${index}:`, { start, end });
            }
          }
        });

        console.log('Generated paths:', newPaths.length);
        if (newPaths.length > 0) {
          console.log('First path:', newPaths[0]);
          console.log('Last path:', newPaths[newPaths.length - 1]);
        }
        setPaths(newPaths);
      } catch (err) {
        console.error('Error loading G-code:', err);
        setError(err instanceof Error ? err.message : 'Failed to load G-code file');
      }
    };

    fetchGCode();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700">{error}</p>
          <pre className="mt-4 p-4 bg-gray-200 rounded overflow-auto">
            {error}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <GCodeViewer paths={paths} />
    </main>
  );
}
