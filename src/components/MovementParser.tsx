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
    const parsedGCode = parseGCode(gcode);

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

    const exteriorPaths = filterExteriorPaths(paths);

    console.log("exteriorPaths", exteriorPaths.length);

    //return paths;
    return exteriorPaths;
  } catch (err) {
    console.error('Error in MovementParser:', err);
    throw err;
  }
}

function filterExteriorPaths(paths: Path[]): Path[] {
    var layerIndicies: Map<number, {z: number, layerStartIndex: number, layerEndIndex: number}> = new Map();

    var layerIndex = 0;
    var layerZ = paths[0].start.z;
    var layerStartIndex = 0;
    paths.forEach((path, index) => {
        if (path.start.z > layerZ) {
            layerIndicies.set(layerIndex, {z: layerZ, layerStartIndex: layerStartIndex, layerEndIndex: index - 1});
            layerIndex++;
            layerZ = path.start.z;
            layerStartIndex = index;
        } else if (index == paths.length - 1) {
            layerIndicies.set(layerIndex, {z: layerZ, layerStartIndex: layerStartIndex, layerEndIndex: index});
        }
    });
    console.log("layerIndicies", layerIndicies);

    var outputPaths: Path[] = [];
    layerIndex = 0;
    layerStartIndex = 0;
    var layerEndIndex = 0;
    var extrustions = 0;
    const firstLayerEndIndex = layerIndicies.get(0)?.layerEndIndex ?? 0;
    paths.forEach((path, index) => {
        // The first layer is by definition visible
       if (index < firstLayerEndIndex) {
            outputPaths.push(path);
            if (path.end.e > 0) {
                extrustions++;
            }
            console.log("first layer check", extrustions);
        } else {

        // Accounting in case we just hit a new layer
        if (path.start.z < (layerIndicies.get(layerIndex)?.z ?? 0)) {
            layerStartIndex = layerIndicies.get(layerIndex)?.layerStartIndex ?? 0;
            layerEndIndex = layerIndicies.get(layerIndex)?.layerEndIndex ?? 0;
        } else if (path.start.z > (layerIndicies.get(layerIndex)?.z ?? 0)) {
            layerStartIndex = layerIndicies.get(layerIndex)?.layerStartIndex ?? 0;
            layerEndIndex = layerIndicies.get(layerIndex)?.layerEndIndex ?? 0;
        }

        if (isInside(path, paths.slice(Math.max(layerStartIndex, index - 1), Math.min(layerEndIndex, index + 1)))) {
            outputPaths.push(path);
        }
        }
    });
    return outputPaths;
}

function isInside(path: Path, paths: Path[]): boolean {
    var negOneFound = false;
    var oneFound = false;
    for (const p of paths) {
        if (p == path) {
            continue;
        }
        if (reltivePosition(path.start, path.end, p) < -0.5) {
            negOneFound = true;
        }
        if (reltivePosition(path.start, path.end, p) > 0.5) {
            oneFound = true;
        }
        if (negOneFound && oneFound) { 
            return true;
        }
    }
    return false;
}

// -1 if it's to the left, 1 if it's to the right, 0 if they're not adjacent
function reltivePosition(point1: Point, point2: Point, path: Path): number {
    console.log(point1, point2, path);
    // if both points are below the path, it's not adjacent
    const minY = Math.min(path.start.y, path.end.y);
    if (minY > point1.y && minY > point2.y) {
        return 0;
    }

    // if both points are above the path, it's not adjacent
    const maxY = Math.max(path.start.y, path.end.y);
    if (maxY < point1.y && maxY < point2.y) {
        return 0;
    }

    // if one point is above and one is below, it's adjacent
    const slope = (path.end.y - path.start.y) / (path.end.x - path.start.x);
    const yIntercept = path.start.y - slope * path.start.x;
    if (minY < point1.y && point1.y < maxY) {
        const x = (point1.y - yIntercept) / slope;
        if (x < point1.x) {
            return -1;
        } else {
            return 1;
        }
    }
    const x = (point2.y - yIntercept) / slope;
    if (x < point2.x) {
        return -1;
    }
    return 1;
}
