'use client';

import { useEffect, useState } from 'react';
import { GCodeCommand } from '@/types/gcode';
import { parseGCode } from './GCodeParser';

interface G0 {
  x: number;
  y: number;
  z: number;
}

interface G1 {
  x: number;
  y: number;
  z: number;
  e: boolean;
}

interface G2 {
  x: number;
  y: number;
  z: number;
  i: number;
  j: number;
  r: number;
  e: boolean;
}

interface G3 {
  x: number;
  y: number;
  z: number;
  i: number;
  j: number;
  r: number;
  e: boolean;
}

enum CodeType {
  G0 = 'G0',
  G1 = 'G1',
  G2 = 'G2',
  G3 = 'G3',
}

interface Path {
  start: Point;
  end: Point;
}

export default function MovementParser({ gcode }: { gcode: string }): Path[] {
  try {
    const parsedGCode = parseGCode(gcode);

    const currentPosition: Code = { type: CodeType.G0, x: 0, y: 0, z: 0, e: 0 };
    //const paths: Path[] = [];
    const points: Code[] = [];
    var lastPoint: Code = { type: CodeType.G0, x: 0, y: 0, z: 0, e: 0 };

    parsedGCode.forEach((command) => {
      if (command.type === 'G0' || command.type === 'G1' || command.type === 'G2' || command.type === 'G3') {
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
            currentPosition.e = command.e > 0 ? true : false;
        } else {
            currentPosition.e = false;
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
    const hashable = 1000;  // multiplier to make the z-axis easily hashable
    const validScaledPoints: Point[] = [];
    for (const point of points) {
        if (point.z > 0) {
            validScaledPoints.push({
                ...point,
                z: Math.floor(point.z * hashable)
            });
        }
    }

    var loops: Map<number, Path[][]> = new Map();
    var lastJog: {z: number, point: Point} = {z: 0, point: {x: 0, y: 0, z: 0, e: 0}};
    var lastWasJog: {z: number, wasJog: boolean} = {z: 0, wasJog: false};
    var outputPaths: Path[] = [];

    var minExtrudedZ = 1000000;
    for (const point of validScaledPoints) {
        if (point.z < minExtrudedZ && point.e) {
            minExtrudedZ = point.z;
        }
    }
    console.log("minExtrudedZ", minExtrudedZ);

    var lastPoint: Point = { x: 0, y: 0, z: 0, e: false };
    var provisionalLoop: Path[] = [];

    // Skip past some setup stuff
    var firstMinExtrudedZ = 0;
    for (const point of validScaledPoints) {
        if (point.z == minExtrudedZ) {
            break;
        }
        firstMinExtrudedZ++;
    }

    console.log("validScaledPoints", validScaledPoints);

    // Process the paths
    for (const point of validScaledPoints.slice(firstMinExtrudedZ, -1)) {
        if (minExtrudedZ == point.z) {
            if (point.e) {
                outputPaths.push({ start: lastJog.point, end: point });
            }
            lastJog = {z: point.z, point: point};
        }
        //} else if (point.e === 0 && point.z == 400) {
        ////} else if (point.e === 0) {
        //    if (provisionalLoop.length > 0) {
        //        if (aboutEqual(provisionalLoop[0].start, provisionalLoop[provisionalLoop.length - 1].end, delta)) {
        //            console.log("provisionalLoop", provisionalLoop);
        //            const loop: Path[] = [];
        //            for (var i = 0; i < provisionalLoop.length - 1; i++) {
        //                loop.push({ start: provisionalLoop[i].start, end: provisionalLoop[i + 1].end });
        //            }
        //            if (!loops.has(point.z)) {
        //                loops.set(point.z, [loop]);
        //            }
        //            loops.get(point.z)?.push(loop);
        //        }
        //        provisionalLoop = [];
        //    }
        //    lastJog.set(point.z, point);
        //    lastWasJog.set(point.z, true);
        //} else if (point.z == 400) {
        ////} else {
        //    if (lastWasJog.get(point.z)) {
        //        if (lastJog.get(point.z)?.x === point.x && lastJog.get(point.z)?.y === point.y) {
        //            // This is a purge, not a loop
        //            lastWasJog.set(point.z, false);
        //            continue;
        //        }
        //        provisionalLoop.push({ start: lastJog.get(point.z)!, end: point });
        //        //provisionalLoop.push({ start: lastJog.get(point.z)!, end: point });
        //    } else {
        //        provisionalLoop.push({ start: provisionalLoop[provisionalLoop.length - 1].end, end: point });
        //        //provisionalLoop.push({ end: provisionalLoop[provisionalLoop.length - 1].start, start: point });
        //    }
        //    lastWasJog.set(point.z, false);
        //}
    }

    for (const layer of loops.values()) {
        //const {outermost, innermost} = perimeterLoops(layer, delta);
        //outputPaths.push(...outermost);
        var i = 0;
        //for (const innermostLoop of layer) {
        for (const innermostLoop of layer) {
            //if (i !== 6) {
            //    console.log("skipping layer", i);
            //    console.log("innermost length", innermostLoop.length);
            //    continue;
            //}
            console.log("innermost", innermostLoop);
            console.log("innermost length", innermostLoop.length);
            for (const path of innermostLoop) {
                //console.log("path", path);
                outputPaths.push(path);
            }
            i++;
        }
    }
    console.log("outputPaths", outputPaths);

    // Unscale the paths
    const unscaledPaths = outputPaths.map(path => {
        return {
            start: {
                x: path.start.x,
                y: path.start.y,
                z: path.start.z / hashable,
                e: path.start.e
            },
            end: {
                x: path.end.x,
                y: path.end.y,
                z: path.end.z / hashable,
                e: path.end.e
            }
        }
    });
    return unscaledPaths;
}

// TODO: need to figure out the return conditions, how to tell innermost from outermost
function perimeterLoops(loops: Path[][], delta: number): {outermost: Path[], innermost: Path[][]} {
    var countInside: number[] = [];
    for (const loop of loops) {
        // TODO: stopgap
        if (loop.length == 0) {
            continue;
        }
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
    //if ('x' in point1 && 'x' in point2) {
    //    return Math.abs(point1.x - point2.x) < delta && Math.abs(point1.y - point2.y) < delta;
    //} else {
    //    console.log("aboutEqual", point1, point2, delta);
    //    return false;
    //}
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