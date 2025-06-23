'use client';

import { useEffect, useState } from 'react';
import { GCodeCommand } from '@/types/gcode';
import { parseGCode } from './GCodeParser';
import { Line, Point } from '@/types/spacial';

export default function MovementParser({ gcode }: { gcode: string }): Line[] {
  const radsPerArcSegment = 2 * 3.2415 / 24;
  
  try {
    const parsedGCode = parseGCode(gcode);

    var lines: Line[] = [];
    //var radDelta = radsPerArcSegment / 10;
    var lastPoint = makePoint({ x: 0, y: 0, z: 0 }, parsedGCode[0], radsPerArcSegment)[0];

    parsedGCode.slice(1).forEach((command) => {
        const nextPoint = makePoint(lastPoint, command, radsPerArcSegment);
        var e = false;
        if (command.parameters.e !== undefined && typeof command.parameters.e === 'number' && command.parameters.e > 0) {
            e = true;
        }
        if (nextPoint.length === 1) {
            lines.push({ start: lastPoint, end: nextPoint[0], isExtrusion: e });
            lastPoint = nextPoint[0];
        } else {
            for (const point of nextPoint) {
                lines.push({ start: lastPoint, end: point, isExtrusion: e });
                lastPoint = point;
            }
        }
    });

    //console.log("lines", lines);
    //return lines.filter(line => line.isExtrusion === true);
    return lines;
  } catch (err) {
    console.error('Error in MovementParser:', err);
    throw err;
  }
}

function makePoint(lastPoint: Point, command: GCodeCommand, radsPerArcSegment: number): Point[] {
    var nextPoint: Point = { ...lastPoint };
    switch (command.command) {
        case 'G0': {
            if (command.parameters.x !== undefined && typeof command.parameters.x === 'number') {
                nextPoint.x = command.parameters.x;
            } 
            if (command.parameters.y !== undefined && typeof command.parameters.y === 'number') {
                nextPoint.y = command.parameters.y;
            }
            if (command.parameters.z !== undefined && typeof command.parameters.z === 'number') {
                nextPoint.z = command.parameters.z;
            }
            return [nextPoint];
        }
        case 'G1': {
            if (command.parameters.x !== undefined && typeof command.parameters.x === 'number') {
                nextPoint.x = command.parameters.x;
            } 
            if (command.parameters.y !== undefined && typeof command.parameters.y === 'number') {
                nextPoint.y = command.parameters.y;
            }
            if (command.parameters.z !== undefined && typeof command.parameters.z === 'number') {
                nextPoint.z = command.parameters.z;
            }
            var e = false;
            if (command.parameters.e !== undefined && typeof command.parameters.e === 'number' && command.parameters.e > 0) {
                e = true;  
            }
            return [nextPoint];
        }
        case 'G2': {
            // Clockwise arc
            var i = 0;
            var j = 0;
            var e = false;
            if (command.parameters.x !== undefined && typeof command.parameters.x === 'number') {
                nextPoint.x = command.parameters.x;
            }
            if (command.parameters.y !== undefined && typeof command.parameters.y === 'number') {
                nextPoint.y = command.parameters.y;
            }
            if (command.parameters.i !== undefined && typeof command.parameters.i === 'number') {
                i = command.parameters.i;
            }
            if (command.parameters.j !== undefined && typeof command.parameters.j === 'number') {
                j = command.parameters.j;
            }
            if (command.parameters.e !== undefined && typeof command.parameters.e === 'number' && command.parameters.e > 0) {
                e = true;  
            }
            var angle = calcAngle(lastPoint, nextPoint, i, j);
            var points: Point[] = [];
            while (angle > 2 * radsPerArcSegment) {
                const intermediatePoint = calcPoint(lastPoint, i, j, radsPerArcSegment);
                intermediatePoint.z = lastPoint.z;
                points.push(intermediatePoint);
                lastPoint.x = intermediatePoint.x;
                lastPoint.y = intermediatePoint.y;
                angle = calcAngle( lastPoint, nextPoint, i, j);
            }
            points.push(nextPoint);
            return points;
        }
        case 'G3': {
            // Counter-clockwise arc
            var i = 0;
            var j = 0;
            var e = false;
            if (command.parameters.x !== undefined && typeof command.parameters.x === 'number') {
                nextPoint.x = command.parameters.x;
            }
            if (command.parameters.y !== undefined && typeof command.parameters.y === 'number') {
                nextPoint.y = command.parameters.y;
            }
            if (command.parameters.i !== undefined && typeof command.parameters.i === 'number') {
                i = command.parameters.i;
            }
            if (command.parameters.j !== undefined && typeof command.parameters.j === 'number') {
                j = command.parameters.j;
            }
            if (command.parameters.e !== undefined && typeof command.parameters.e === 'number' && command.parameters.e > 0) {
                e = true;  
            }
            var angle = calcAngle(lastPoint, nextPoint, i, j);
            var points: Point[] = [];
            while (angle > 2 * radsPerArcSegment) {
                const intermediatePoint = calcPoint(lastPoint, i, j, radsPerArcSegment);
                intermediatePoint.z = lastPoint.z;
                points.push(intermediatePoint);
                lastPoint.x = intermediatePoint.x;
                lastPoint.y = intermediatePoint.y;
                angle = calcAngle( lastPoint, nextPoint, i, j);
            }
            points.push(nextPoint);
            return points;
        }
    }
    return [];
}

function calcAngle(start: Point, end: Point, i: number, j: number): number {
    const startAngle = Math.atan(j / i)
    const endAngle = Math.atan((end.y - (start.y - j)) / (end.x - (start.x - i)));
    return endAngle - startAngle;
}

function calcPoint(start: Point, i: number, j: number, angle: number): Point {
    const r = ((start.x - i)**2 + (start.y - j)**2)**0.5
    const startAngle = Math.atan(j / i)
    const endAngle = angle + startAngle;
    const x = i + r * Math.cos(endAngle);
    const y = j + r * Math.sin(endAngle);
    return { x: x, y: y, z: 0};
}

//function filterExteriorPaths(points: Point[], delta: number): Line[] {
//    const hashable = 1000;  // multiplier to make the z-axis easily hashable
//    const validScaledPoints: Point[] = [];
//    for (const point of points) {
//        if (point.z > 0) {
//            validScaledPoints.push({
//                ...point,
//                z: Math.floor(point.z * hashable)
//            });
//        }
//    }
//
//    var loops: Map<number, Path[][]> = new Map();
//    var lastJog: {z: number, point: Point} = {z: 0, point: {x: 0, y: 0, z: 0}};
//    var lastWasJog: {z: number, wasJog: boolean} = {z: 0, wasJog: false};
//    var outputPaths: Path[] = [];
//
//    var minExtrudedZ = 1000000;
//    for (const point of validScaledPoints) {
//        if (point.z < minExtrudedZ) {
//            minExtrudedZ = point.z;
//        }
//    }
//    console.log("minExtrudedZ", minExtrudedZ);
//
//    var lastPoint: Point = { x: 0, y: 0, z: 0 };
//    var provisionalLoop: Path[] = [];
//
//    // Skip past some setup stuff
//    var firstMinExtrudedZ = 0;
//    for (const point of validScaledPoints) {
//        if (point.z == minExtrudedZ) {
//            break;
//        }
//        firstMinExtrudedZ++;
//    }
//
//    console.log("validScaledPoints", validScaledPoints);
//
//    // Process the paths
//    for (const point of validScaledPoints.slice(firstMinExtrudedZ, -1)) {
//        if (minExtrudedZ == point.z) {
//            outputPaths.push({ start: lastJog.point, end: point });
//            lastJog = {z: point.z, point: point};
//        }
//    }
//
//    for (const layer of loops.values()) {
//        var i = 0;
//        for (const innermostLoop of layer) {
//            console.log("innermost", innermostLoop);
//            console.log("innermost length", innermostLoop.length);
//            for (const path of innermostLoop) {
//                outputPaths.push(path);
//            }
//            i++;
//        }
//    }
//    console.log("outputPaths", outputPaths);
//
//    // Unscale the paths
//    const unscaledPaths = outputPaths.map(path => {
//        return {
//            start: {
//                x: path.start.x,
//                y: path.start.y,
//                z: path.start.z / hashable
//            },
//            end: {
//                x: path.end.x,
//                y: path.end.y,
//                z: path.end.z / hashable
//            }
//        }
//    });
//    return unscaledPaths;
//}
//
//function perimeterLoops(loops: Path[][], delta: number): {outermost: Path[], innermost: Path[][]} {
//    var countInside: number[] = [];
//    for (const loop of loops) {
//        if (loop.length == 0) {
//            continue;
//        }
//        var countInsideLoop = 0;
//        for (const otherLoop of loops) {
//            var adjacent = 0;
//            for (const path of otherLoop) {
//                if (isAdjacent(loop[0].start, path)) {
//                    adjacent++;
//                }
//            }
//            if (adjacent % 2 > 0) {
//                countInsideLoop++;
//            }
//        }
//        countInside.push(countInsideLoop);
//    }
//
//    var outermost: Path[] = [];
//    var outermostCount = -1;
//    var innermost: Path[][] = [];
//    for (var i = 0; i < countInside.length; i++) {
//        if (countInside[i] > outermostCount) {
//            outermost = loops[i];
//            outermostCount = countInside[i];
//        }
//        if (countInside[i] == 0) {
//            innermost.push(loops[i]);
//        }
//    }
//    return {outermost, innermost};
//}
//
//function isAdjacent(point: Point, path: Path): boolean {
//    if (point.y === path.start.y) {
//        return true;
//    }
//    if (point.y === path.end.y) {
//        return false;
//    }
//    
//    const minY = Math.min(path.start.y, path.end.y); 
//    if (minY > point.y && minY > point.y) {
//        return false;
//    }
//
//    const maxY = Math.max(path.start.y, path.end.y);
//    if (maxY < point.y && maxY < point.y) {
//        return false;
//    }
//
//    const slope = (path.end.y - path.start.y) / (path.end.x - path.start.x);
//    const yIntercept = path.start.y - slope * path.start.x;
//    const x = (point.y - yIntercept) / slope;
//    if (x < point.x) {
//        return true;
//    }
//    return false;
//}
//
//function aboutEqual(point1: Point, point2: Point, delta: number): boolean {
//    return Math.abs(point1.x - point2.x) < delta && Math.abs(point1.y - point2.y) < delta;
//}
//