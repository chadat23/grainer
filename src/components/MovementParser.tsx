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
    //const paths: Path[] = [];
    const points: Point[] = [];
    var lastPoint: Point = { x: 0, y: 0, z: 0, e: 0 };

    parsedGCode.forEach((command) => {
      if (command.type === 'G0' || command.type === 'G1') {
        const start: Point = { ...currentPosition };
        // Update position based on command parameters
        if (command.x !== undefined) {
            currentPosition.x = command.x;
        }
        if (command.y !== undefined) {
            currentPosition.y = command.y;
        }
        if (command.z !== undefined) {
            currentPosition.z = command.z;
        }
        if (command.e !== undefined) {
            currentPosition.e = command.e;
        } else {
            currentPosition.e = 0;
        }
        points.push({ ...currentPosition });
      }
    });

    const nozzleDiameter = 0.4;
    const delta = nozzleDiameter / 4;
    const exteriorPaths = filterExteriorPaths(points.slice(10, -1), delta);

    console.log("exteriorPaths", exteriorPaths.length);

    return exteriorPaths;
  } catch (err) {
    console.error('Error in MovementParser:', err);
    throw err;
  }
}

function filterExteriorPaths(points: Point[], delta: number): Path[] {
    var loops: Path[][] = [];
    var paths: Path[] = [];
    var lastG0: Point = { x: 0, y: 0, z: 0, e: 0 };
    var lastWasG0 = true;

    for (var i = 1; i < points.length; i++) {
        const point = points[i];
        if (point.e > 0 && point.z > 0.15 && point.z < 0.25) {
            paths.push({ start: points[i - 1], end: point });
        }
    }

    var provisionalLoop: Point[] = [];
    for (const point of points) {
        // TODO: placeholder for now, need to figure out how to tell innermost from outermost
        if (point.z < 0.35 || point.z > 0.45) {
            continue;
        }
        if (point.e === 0) {
            if (provisionalLoop.length > 0) {
                if (aboutEqual(provisionalLoop[0], provisionalLoop[provisionalLoop.length - 1], delta)) {
                    console.log("provisionalLoop", provisionalLoop);
                    const loop: Path[] = [];
                    for (var i = 0; i < provisionalLoop.length - 1; i++) {
                        loop.push({ start: provisionalLoop[i], end: provisionalLoop[i + 1] });
                    }
                    loops.push(loop);
                }
                provisionalLoop = [];
            }
            lastG0 = point;
            lastWasG0 = true;
        } else {
            if (lastWasG0) {
                if (lastG0.x === point.x && lastG0.y === point.y) {
                    continue;
                }
                provisionalLoop.push(lastG0);
            }
            provisionalLoop.push(point);
            lastWasG0 = false;
        }
    }
    console.log("loops", loops);
    const {outermost, innermost} = innermostLoops(loops, delta);
    console.log("outermost", outermost);
    paths.push(...outermost);
    return paths;
}

// TODO: need to figure out the return conditions, how to tell innermost from outermost
function innermostLoops(loops: Path[][], delta: number): {outermost: Path[], innermost: Path[][]} {
    var countInside: number[] = [];
    for (const loop of loops) {
        var countInsideLoop = 0;
        for (const otherLoop of loops) {
            var adjacent = 0;
            for (const path of otherLoop) {
                if (isAdjacent(loop[0].start, path)) {
                    adjacent++;
                }
            }
            if (adjacent % 2 > 0) {
                countInsideLoop++;
            }
        }
        countInside.push(countInsideLoop);
    }

    var outermost: Path[] = [];
    var outermostCount = -1;
    var innermost: Path[][] = [];
    for (var i = 0; i < countInside.length; i++) {
        if (countInside[i] > outermostCount) {
            outermost = loops[i];
            outermostCount = countInside[i];
        }
        if (countInside[i] == 0) {
            innermost.push(loops[i]);
        }
    }
    console.log("outermost", outermost);
    console.log("innermost", innermost);
    return {outermost, innermost};
}

function isAdjacent(point: Point, path: Path): boolean {
    if (point.y === path.start.y) {
        return true;
    }
    if (point.y === path.end.y) {
        return false;
    }
    
    // if both points are below the path, it's not adjacent
    const minY = Math.min(path.start.y, path.end.y); 
    if (minY > point.y && minY > point.y) {
        return false;
    }

    // if both points are above the path, it's not adjacent
    const maxY = Math.max(path.start.y, path.end.y);
    if (maxY < point.y && maxY < point.y) {
        return false;
    }

    // if one point is above and one is below, it's adjacent
    const slope = (path.end.y - path.start.y) / (path.end.x - path.start.x);
    const yIntercept = path.start.y - slope * path.start.x;
    const x = (point.y - yIntercept) / slope;
    if (x < point.x) {
        return true;
    }
    return false;
}

function aboutEqual(point1: Point, point2: Point, delta: number): boolean {
    return Math.abs(point1.x - point2.x) < delta && Math.abs(point1.y - point2.y) < delta;
}

//function filterExteriorPaths(paths: Path[]): Path[] {
//    var layerIndicies: Map<number, {z: number, layerStartIndex: number, layerEndIndex: number}> = new Map();
//    console.log("paths", paths);
//
//    var layerIndex = 0;
//    var layerZ = paths[5].start.z;
//    var layerStartIndex = 0;
//    const minZ = Math.min(...paths.map(p => p.start.z));
//    var passedJunk = false;
//    console.log("max z", Math.max(...paths.map(p => p.start.z)));
//    console.log("layerZ", layerZ);
//    paths.forEach((path, index) => {
//        if (!passedJunk && path.start.z == minZ) {
//            passedJunk = true;
//        }
//        //console.log("path.start.z", path.start.z);
//        if (path.start.z > layerZ && passedJunk) {
//            layerIndicies.set(layerIndex, {z: layerZ, layerStartIndex: layerStartIndex, layerEndIndex: index - 1});
//            layerIndex++;
//            layerZ = path.start.z;
//            layerStartIndex = index;
//        } else if (index == paths.length - 1 && passedJunk) {
//            layerIndicies.set(layerIndex, {z: layerZ, layerStartIndex: layerStartIndex, layerEndIndex: index});
//        }
//    });
//    console.log("layerIndicies", layerIndicies);
//
//    var outputPaths: Path[] = [];
//    layerIndex = 0;
//    layerStartIndex = 0;
//    var layerEndIndex = 0;
//    var extrustions = 0;
//    const firstLayerEndIndex = layerIndicies.get(0)?.layerEndIndex ?? 0;
//
//    // The first layer is by definition visible
//    var layerInfo = layerIndicies.get(0);
//    for (let index = layerInfo?.layerStartIndex ?? 0; index < (layerInfo?.layerEndIndex ?? 0); index++) {
//        const path = paths[index];
//        outputPaths.push(path);
//    }
//
//    // Process middle layers
//    for (let layerIdx = 1; layerIdx < layerIndicies.size - 1; layerIdx++) {
//        layerInfo = layerIndicies.get(layerIdx);
//        for (let pathIndex = layerInfo?.layerStartIndex ?? 0; pathIndex < (layerInfo?.layerEndIndex ?? 0); pathIndex++) {
//            const path = paths[pathIndex];
//            if (!isInside(path, paths)) {
//                outputPaths.push(path);
//            }
//        }
//    }
//
//    // The last layer is by definition visible
//    var layerInfo = layerIndicies.get(layerIndicies.size - 1);
//    for (let index = layerInfo?.layerStartIndex ?? 0; index < (layerInfo?.layerEndIndex ?? 0); index++) {
//        const path = paths[index];
//        outputPaths.push(path);
//    }
//    //// Process other layers
//    //for (let layerIdx = 1; layerIdx < layerIndicies.size; layerIdx++) {
//    //    const layerInfo = layerIndicies.get(layerIdx);
//    //    if (!layerInfo) continue;
//    //    
//    //    const layerPaths = paths.slice(layerInfo.layerStartIndex, layerInfo.layerEndIndex + 1);
//    //    const exteriorLayerPaths = layerPaths.filter(path => isExteriorPath(path, layerPaths));
//    //    outputPaths.push(...exteriorLayerPaths);
//    //}
//    return outputPaths;
//}
//
//function isInside(path: Path, paths: Path[]): boolean {
//    var negOneFound = false;
//    var oneFound = false;
//    for (const p of paths) {
//        if (p == path) {
//            continue;
//        }
//        if (reltivePosition(path.start, path.end, p) < -0.5) {
//            negOneFound = true;
//        }
//        if (reltivePosition(path.start, path.end, p) > 0.5) {
//            oneFound = true;
//        }
//        if (negOneFound && oneFound) { 
//            return true;
//        }
//    }
//    return false;
//}
//
//// -1 if it's to the left, 1 if it's to the right, 0 if they're not adjacent
//function reltivePosition(point1: Point, point2: Point, path: Path): number {
//    //console.log(point1, point2, path);
//    // if both points are below the path, it's not adjacent
//    const minY = Math.min(path.start.y, path.end.y);
//    if (minY > point1.y && minY > point2.y) {
//        return 0;
//    }
//
//    // if both points are above the path, it's not adjacent
//    const maxY = Math.max(path.start.y, path.end.y);
//    if (maxY < point1.y && maxY < point2.y) {
//        return 0;
//    }
//
//    // if one point is above and one is below, it's adjacent
//    const slope = (path.end.y - path.start.y) / (path.end.x - path.start.x);
//    const yIntercept = path.start.y - slope * path.start.x;
//    if (minY < point1.y && point1.y < maxY) {
//        const x = (point1.y - yIntercept) / slope;
//        if (x < point1.x) {
//            return -1;
//        } else {
//            return 1;
//        }
//    }
//    const x = (point2.y - yIntercept) / slope;
//    if (x < point2.x) {
//        return -1;
//    }
//    return 1;
//}
//
//function isExteriorPath(path: Path, layerPaths: Path[]): boolean {
//    // A path is exterior if it's not completely surrounded by other paths
//    // For now, let's use a simple heuristic: check if the path endpoints are near the boundary
//    
//    const tolerance = 2.0; // mm tolerance for "near boundary"
//    
//    // Get the bounding box of the layer
//    const minX = Math.min(...layerPaths.map(p => Math.min(p.start.x, p.end.x)));
//    const maxX = Math.max(...layerPaths.map(p => Math.max(p.start.x, p.end.x)));
//    const minY = Math.min(...layerPaths.map(p => Math.min(p.start.y, p.end.y)));
//    const maxY = Math.max(...layerPaths.map(p => Math.max(p.start.y, p.end.y)));
//    
//    // Check if either endpoint is near the boundary
//    const startNearBoundary = 
//        Math.abs(path.start.x - minX) < tolerance ||
//        Math.abs(path.start.x - maxX) < tolerance ||
//        Math.abs(path.start.y - minY) < tolerance ||
//        Math.abs(path.start.y - maxY) < tolerance;
//        
//    const endNearBoundary = 
//        Math.abs(path.end.x - minX) < tolerance ||
//        Math.abs(path.end.x - maxX) < tolerance ||
//        Math.abs(path.end.y - minY) < tolerance ||
//        Math.abs(path.end.y - maxY) < tolerance;
//    
//    return startNearBoundary || endNearBoundary;
//}
//