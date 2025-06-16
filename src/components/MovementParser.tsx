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
      if (command.command === 'G0' || command.command === 'G1') {
        const start: Point = { ...currentPosition };
        
        // Update position based on command parameters
        if (command.parameters.X !== undefined) currentPosition.x = command.parameters.X;
        if (command.parameters.Y !== undefined) currentPosition.y = command.parameters.Y;
        if (command.parameters.Z !== undefined) currentPosition.z = command.parameters.Z;
        if (command.parameters.E !== undefined) currentPosition.e = command.parameters.E;

        const end: Point = { ...currentPosition };
        if (command.parameters.E !== undefined && command.parameters.E > 0) {
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
}