'use client';

import { useEffect, useState } from 'react';
import { GCodeCommand } from '@/types/gcode';
import { parseGCode } from './GCodeParser';

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

export default function MovementParser({ gcode }: { gcode: string }): Path[] {
  try {
    console.log('MovementParser received gcode:', gcode.length, 'characters');
    const parsedGCode = parseGCode(gcode);
    console.log('Parsed G-code commands:', parsedGCode.length);

    const currentPosition: Point = { x: 0, y: 0, z: 0, e: 0 };
    const paths: Path[] = [];

    parsedGCode.forEach((command) => {
      if (command.type === 'G0' || command.type === 'G1') {
        const start: Point = { ...currentPosition };
        
        // Update position based on command parameters
        if (command.x !== undefined) currentPosition.x = command.x;
        if (command.y !== undefined) currentPosition.y = command.y;
        if (command.z !== undefined) currentPosition.z = command.z;
        if (command.e !== undefined) {
            currentPosition.e = command.e;
        } else {
            currentPosition.e = 0;
        }

        const end: Point = { ...currentPosition };
        if (command.e !== undefined && command.e > 0) {
          paths.push({ start, end });
        }
      }
    });

    console.log('Generated paths:', paths.length);
    return paths;
  } catch (err) {
    console.error('Error in MovementParser:', err);
    throw err;
  }
}