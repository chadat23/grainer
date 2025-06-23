'use client';

import { GCodeCommand, LinearMovementCommand, ArcMovementCommand } from '@/types/gcode';
import { useEffect, useState } from 'react';

//interface BaseCommand {
//    code: "G0" | "G1" | "G2" | "G3";
//    x?: number;
//    y?: number;
//    z?: number;
//    e: boolean;
//}
//
//interface LinearCommand extends BaseCommand {
//    code: "G0" | "G1";
//}
//
//interface ArcCommand extends BaseCommand {
//    code: "G2" | "G3";
//    i?: number;
//    j?: number;
//    r?: number;
//}

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
    if (command !== 'G0' && command !== 'G1' && command !== 'G2' && command !== 'G3') return null;

    // Parse parameters
    let result: LinearMovementCommand | ArcMovementCommand;
    
    if (command === 'G0' || command === 'G1') {
      result = { command: command as "G0" | "G1", parameters: {} };
    } else {
      result = { command: command as "G2" | "G3", parameters: {} };
    }

    // Process parameters if they exist
    for (let i = 1; i < parts.length; i++) {
      const param = parts[i];
      if (!param || param.length < 2) continue;

      const key = param[0].toLowerCase();
      const value = Number(param.slice(1));
      if (!isNaN(value)) {
        result.parameters[key] = value;
      }
    }

    return result;
  }).filter((line): line is LinearMovementCommand | ArcMovementCommand => line !== null);
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
      } catch (error) {
        console.error('Error reading G-code file:', error);
      }
    };

    fetchAndParseGCode();
  }, []);

  return null; // This component doesn't render anything
} 