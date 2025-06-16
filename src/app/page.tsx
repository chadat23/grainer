'use client';

import { useState, useEffect } from 'react';
import GCodeViewer from '@/components/GCodeViewer';
import MovementParser from '@/components/MovementParser';

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
        const response = await fetch('/api/gcode');
        
        if (!response.ok) {
          console.error('Failed to fetch G-code:', response.status, response.statusText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        const newPaths = MovementParser({ gcode: text });
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
    <main className="flex h-screen w-full bg-gray-900 text-white">
      <div className="w-1/3">
        {/* Controls will go here */}
      </div>
      <div className="w-2/3 h-full">
        <GCodeViewer paths={paths} />
      </div>
    </main>
  );
}
