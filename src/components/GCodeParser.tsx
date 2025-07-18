'use client';

import { GCodeCommand, LinearMovementCommand, ArcMovementCommand, TemperatureCommand } from '@/types/gcode';
import { useEffect, useState } from 'react';

export function parseGCode(content: string): GCodeCommand[] {
  const lines = content.split('\n');
  const commands: GCodeCommand[] = [];
  
  lines.forEach((line, lineIndex) => {
    // Use 1-based line numbering to match file line numbers
    const lineNumber = lineIndex + 1;
    
    // Remove comments and trim whitespace
    const cleanLine = line.split(';')[0].trim();
    
    // Skip empty lines but still count them in line numbers
    if (!cleanLine) return;

    // Split the line into command and parameters
    const parts = cleanLine.split(' ');
    if (parts.length === 0) return;

    const command = parts[0];
    if (command !== 'G0' && command !== 'G1' && command !== 'G2' && command !== 'G3' && command !== 'M104' && command !== 'M109') return;

    // Parse parameters
    let result: LinearMovementCommand | ArcMovementCommand | TemperatureCommand;
    
    if (command === 'G0' || command === 'G1') {
      result = { 
        command: command as "G0" | "G1", 
        parameters: {},
        lineNumber: lineNumber
      };
    } else if (command === 'G2' || command === 'G3') {
      result = { 
        command: command as "G2" | "G3", 
        parameters: {},
        lineNumber: lineNumber
      };
    } else if (command === 'M104' || command === 'M109') {
      result = { 
        command: command as "M104" | "M109", 
        parameters: {},
        lineNumber: lineNumber
      };
    } else {
      // This should never happen due to the earlier check, but TypeScript needs this
      return;
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

    commands.push(result);
  });

  return commands;
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