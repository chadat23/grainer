'use client';

import { useState, useEffect } from 'react';
import GCodeViewer from '@/components/GCodeViewer';
import CommandParser from '@/components/CommandParser';
import { perimeterLoops, findToolPathLoops } from '@/components/VisibilityFilter';
import { Command, ToolPath, Vertex } from '@/types/command';

const cameraVertex: Vertex = { x: 150, y: 150, z: 150 };
const lookAtVertex: Vertex = { x: 0, y: 0, z: 0 };
const sliderTemp = 200;
const sliderMinTemp = 170;
const sliderMaxTemp = 250;
const sliderLayer = 1;
const sliderMinLayer = 1;
const sliderMaxLayer = 100;

export default function Home() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [minColor, setMinColor] = useState('#F6C488'); // Default tan color
  const [maxColor, setMaxColor] = useState('#7D3D16'); // Default tan color
  const [lightNominalWidth, setLightNominalWidth] = useState(10); // Default light nominal width
  const [lightWidthStandardDeviation, setLightWidthStandardDeviation] = useState(3); // Default light width standard deviation
  const [darkNominalWidth, setDarkNominalWidth] = useState(1); // Default dark nominal width
  const [darkWidthStandardDeviation, setDarkWidthStandardDeviation] = useState(1); // Default dark width standard deviation
  const [transitionNominalWidth, setTransitionNominalWidth] = useState(2); // Default transition nominal width
  const [transitionStandardDeviation, setTransitionStandardDeviation] = useState(0.5); // Default transition standard deviation
  const [seed, setSeed] = useState(0); // Default seed value

  useEffect(() => {
    const fetchGCode = async () => {
      try {
        const response = await fetch('/api/gcode');
        
        if (!response.ok) {
          console.error('Failed to fetch G-code:', response.status, response.statusText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        const newCommands = CommandParser({ gcode: text });
        setCommands(newCommands);
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
          <label htmlFor="minColor" className="block text-sm font-medium text-gray-300">
            Minimum Temperature Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              id="minColor"
              value={minColor}
              onChange={(e) => setMinColor(e.target.value)}
              className="h-10 w-20 rounded cursor-pointer"
            />
            <span className="text-sm text-gray-400">{minColor}</span>
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="maxColor" className="block text-sm font-medium text-gray-300">
            Maximum Temperature Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              id="maxColor"
              value={maxColor}
              onChange={(e) => setMaxColor(e.target.value)}
              className="h-10 w-20 rounded cursor-pointer"
            />
            <span className="text-sm text-gray-400">{maxColor}</span>
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="lightNominalWidth" className="block text-sm font-medium text-gray-300">
            Light Nominal Width
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              id="lightNominalWidth"
              min="1"
              max="100"
              value={lightNominalWidth}
              onChange={(e) => setLightNominalWidth(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-blue-500"
            />
            <input
              type="number"
              value={lightNominalWidth}
              onChange={(e) => setLightNominalWidth(parseFloat(e.target.value))}
              className="w-20 p-1 text-center bg-gray-700 border border-gray-600 rounded text-sm"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="lightWidthStandardDeviation" className="block text-sm font-medium text-gray-300">
            Light Width Standard Deviation
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              id="lightWidthStandardDeviation"
              min="0.1"
              max="10"
              step="0.1"
              value={lightWidthStandardDeviation}
              onChange={(e) => setLightWidthStandardDeviation(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-blue-500"
            />
            <input
              type="number"
              value={lightWidthStandardDeviation}
              onChange={(e) => setLightWidthStandardDeviation(parseFloat(e.target.value))}
              className="w-20 p-1 text-center bg-gray-700 border border-gray-600 rounded text-sm"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="darkNominalWidth" className="block text-sm font-medium text-gray-300">
            Dark Nominal Width
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              id="darkNominalWidth"
              min="0.1"
              max="20"
              step="0.1"
              value={darkNominalWidth}
              onChange={(e) => setDarkNominalWidth(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-blue-500"
            />
            <input
              type="number"
              value={darkNominalWidth}
              onChange={(e) => setDarkNominalWidth(parseFloat(e.target.value))}
              className="w-20 p-1 text-center bg-gray-700 border border-gray-600 rounded text-sm"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="darkWidthStandardDeviation" className="block text-sm font-medium text-gray-300">
            Dark Width Standard Deviation
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              id="darkWidthStandardDeviation"
              min="0.1"
              max="10"
              step="0.1"
              value={darkWidthStandardDeviation}
              onChange={(e) => setDarkWidthStandardDeviation(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-blue-500"
            />
            <input
              type="number"
              value={darkWidthStandardDeviation}
              onChange={(e) => setDarkWidthStandardDeviation(parseFloat(e.target.value))}
              className="w-20 p-1 text-center bg-gray-700 border border-gray-600 rounded text-sm"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="transitionNominalWidth" className="block text-sm font-medium text-gray-300">
            Transition Nominal Width
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              id="transitionNominalWidth"
              min="0.1"
              max="10"
              step="0.1"
              value={transitionNominalWidth}
              onChange={(e) => setTransitionNominalWidth(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-blue-500"
            />
            <input
              type="number"
              value={transitionNominalWidth}
              onChange={(e) => setTransitionNominalWidth(parseFloat(e.target.value))}
              className="w-20 p-1 text-center bg-gray-700 border border-gray-600 rounded text-sm"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="transitionStandardDeviation" className="block text-sm font-medium text-gray-300">
            Transition Standard Deviation
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              id="transitionStandardDeviation"
              min="0.1"
              max="5"
              step="0.1"
              value={transitionStandardDeviation}
              onChange={(e) => setTransitionStandardDeviation(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-blue-500"
            />
            <input
              type="number"
              value={transitionStandardDeviation}
              onChange={(e) => setTransitionStandardDeviation(parseFloat(e.target.value))}
              className="w-20 p-1 text-center bg-gray-700 border border-gray-600 rounded text-sm"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="seed" className="block text-sm font-medium text-gray-300">
            Seed
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              id="seed"
              min="1"
              max="1000"
              step="1"
              value={seed}
              onChange={(e) => setSeed(parseInt(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-blue-500"
            />
            <input
              type="number"
              value={seed}
              onChange={(e) => setSeed(parseInt(e.target.value))}
              className="w-20 p-1 text-center bg-gray-700 border border-gray-600 rounded text-sm"
            />
          </div>
        </div>

      </div>
      <div className="w-2/3 h-full">
        <GCodeViewer 
          commands={commands} 
          colorizerType="layer"
          minColor={minColor} 
          maxColor={maxColor} 
          lightNominalWidth={lightNominalWidth}
          lightWidthStandardDeviation={lightWidthStandardDeviation}
          darkNominalWidth={darkNominalWidth}
          darkWidthStandardDeviation={darkWidthStandardDeviation}
          transitionNominalWidth={transitionNominalWidth}
          transitionStandardDeviation={transitionStandardDeviation}
          seed={seed}
          cameraVertex={cameraVertex} 
          lookAtVertex={lookAtVertex} 
        />
      </div>
    </main>
  );
}
