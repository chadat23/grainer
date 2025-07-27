'use client';

import { useState } from 'react';

export default function HomeDebug() {
  console.log('HomeDebug component rendering - START');
  const [count, setCount] = useState(0);
  
  console.log('HomeDebug component rendering - END');
  
  return (
    <main className="flex h-screen w-full bg-gray-900 text-white">
      <div className="w-1/3 p-6 space-y-6">
        <h1 className="text-2xl font-bold">Debug Page</h1>
        <p>This is a debug page to test basic rendering.</p>
        <button 
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Count: {count}
        </button>
        <div className="space-y-2">
          <label htmlFor="testInput" className="block text-sm font-medium text-gray-300">
            Test Input
          </label>
          <input
            type="text"
            id="testInput"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            placeholder="Type something..."
          />
        </div>
      </div>
      <div className="w-2/3 h-full bg-gray-800 flex items-center justify-center">
        <p className="text-white">Debug viewer area</p>
      </div>
    </main>
  );
} 