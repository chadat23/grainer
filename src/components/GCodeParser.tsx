'use client';

import { useEffect, useState } from 'react';

export interface GCodeCommand {
  type: 'G0' | 'G1';
  x?: number;
  y?: number;
  z?: number;
  e?: number;
}

export function parseGCode(content: string): GCodeCommand[] {
  const lines = content.split('\n');
  return lines.map(line => {
    // Remove comments and trim whitespace
    const cleanLine = line.split(';')[0].trim();
    if (!cleanLine) return null;

    // Split the line into command and parameters
    const parts = cleanLine.split(' ');
    if (parts.length === 0) return null;

    const command = parts[0];
    if (!command.startsWith('G0') && !command.startsWith('G1')) return null;

    // Parse parameters
    const result: GCodeCommand = {
      type: command.startsWith('G0') ? 'G0' : 'G1'
    };

    // Process parameters if they exist
    for (let i = 1; i < parts.length; i++) {
      const param = parts[i];
      if (!param || param.length < 2) continue;

      const key = param[0].toLowerCase();
      const value = Number(param.slice(1));
      if (!isNaN(value)) {
        result[key as 'x' | 'y' | 'z' | 'e'] = value;
      }
    }

    return result;
  }).filter((line): line is GCodeCommand => line !== null);
}

export default function GCodeParser() {
  const [parsedGCode, setParsedGCode] = useState<GCodeCommand[]>([]);

  useEffect(() => {
    const fetchAndParseGCode = async () => {
      try {
        const response = await fetch('/api/gcode');
        const content = await response.text();
        const parsed = parseGCode(content);
        setParsedGCode(parsed);
        //console.log('Parsed G-code:', parsed);
      } catch (error) {
        console.error('Error reading G-code file:', error);
      }
    };

    fetchAndParseGCode();
  }, []);

  return null; // This component doesn't render anything
} 