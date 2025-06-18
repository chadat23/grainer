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
const sliderStart = 2;
const sliderEnd = 5;

export default function Home() {
  const [paths, setPaths] = useState<Path[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [baseColor, setBaseColor] = useState('#DEB887'); // Default tan color
  const [accentColor, setAccentColor] = useState('#A52A2A'); // Default tan color
  const [accentSliders, setAccentSliders] = useState([{ accentNumb: 1, accentStart: sliderStart, accentEnd: sliderEnd}]);

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

  const addAccentSlider = () => {
    setAccentSliders([
      ...accentSliders,
      { accentNumb: accentSliders.length + 1, accentStart: sliderStart, accentEnd: sliderEnd }
    ]);
  };

  const handleSliderChange = (accentNumb: number, sliderNumb: number, newValue: string) => {
    setAccentSliders(
      accentSliders.map((slider) => 
        slider.accentNumb === accentNumb 
          ? { 
              ...slider, 
              ...(sliderNumb === 1 ? { accentStart: parseFloat(newValue) } : { accentEnd: parseFloat(newValue) })
            } 
          : slider
      )
    );
  };

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
        <div className="space-y-4 pt-6">
          <h3 className="text-lg font-medium text-gray-300">Accent Settings</h3>
          {accentSliders.map((slider) => (
            <div key={slider.accentNumb} className="space-y-3 border-t border-gray-700 pt-4">
              <div className="flex items-center space-x-3">
                <label
                  htmlFor={`slider1-${slider.accentNumb}`}
                  className="w-24 text-sm font-medium text-gray-400"
                >
                  Accent {slider.accentNumb} Start
                </label>
                <input
                  type="range"
                  id={`slider1-${slider.accentNumb}`}
                  min="0"
                  max="100"
                  value={slider.accentStart}
                  onChange={(e) =>
                    handleSliderChange(slider.accentNumb, 1, e.target.value)
                  }
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-blue-500"
                />
                <input
                  type="number"
                  value={slider.accentStart}
                  onChange={(e) =>
                    handleSliderChange(slider.accentNumb, 1, e.target.value)
                  }
                  className="w-20 p-1 text-center bg-gray-700 border border-gray-600 rounded text-sm"
                />
              </div>
              <div className="flex items-center space-x-3">
                <label
                  htmlFor={`slider2-${slider.accentNumb}`}
                  className="w-24 text-sm font-medium text-gray-400"
                >
                  Accent {slider.accentNumb} End
                </label>
                <input
                  type="range"
                  id={`slider2-${slider.accentNumb}`}
                  min="0"
                  max="100"
                  value={slider.accentEnd}
                  onChange={(e) =>
                    handleSliderChange(slider.accentNumb, 2, e.target.value)
                  }
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-blue-500"
                />
                <input
                  type="number"
                  value={slider.accentEnd}
                  onChange={(e) =>
                    handleSliderChange(slider.accentNumb, 2, e.target.value)
                  }
                  className="w-20 p-1 text-center bg-gray-700 border border-gray-600 rounded text-sm"
                />
              </div>
            </div>
          ))}
          <button
            onClick={addAccentSlider}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Add Accent
          </button>
        </div>
      </div>
      <div className="w-2/3 h-full">
        <GCodeViewer paths={paths} baseColor={baseColor} accentColor={accentColor} cameraPoint={cameraPoint} lookAtPoint={lookAtPoint} accentSliders={accentSliders}/>
      </div>
    </main>
  );
}
