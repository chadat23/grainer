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

const cameraPoint: Point = { x: 150, y: 150, z: 150, e: 0 };
const lookAtPoint: Point = { x: 0, y: 0, z: 0, e: 0 };

export default function Home() {
  const [paths, setPaths] = useState<Path[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [baseColor, setBaseColor] = useState('#DEB887'); // Default tan color
  const [accentColor, setAccentColor] = useState('#A52A2A'); // Default tan color

  useEffect(() => {
    console.log("page useEffect called");
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
      <div className="w-1/3 p-6 space-y-6">
        <div className="space-y-2">
          <label htmlFor="baseColor" className="block text-sm font-medium text-gray-300">
            Base Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              id="baseColor"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="h-10 w-20 rounded cursor-pointer"
            />
            <span className="text-sm text-gray-400">{baseColor}</span>
          </div>
        </div>
         <div className="space-y-2">
          <label htmlFor="accentColor" className="block text-sm font-medium text-gray-300">
            Accent Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              id="accentColor"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="h-10 w-20 rounded cursor-pointer"
            />
            <span className="text-sm text-gray-400">{accentColor}</span>
          </div>
        </div>
      </div>
      <div className="w-2/3 h-full">
        <GCodeViewer paths={paths} baseColor={baseColor} accentColor={accentColor} cameraPoint={cameraPoint} lookAtPoint={lookAtPoint}/>
      </div>
    </main>
  );
}
