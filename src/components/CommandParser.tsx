'use client';

import { useEffect, useState } from 'react';
import { GCodeCommand, isMovementCommand } from '@/types/gcode';
import { parseGCode } from './GCodeParser';
import { Command, ToolPath, Vertex } from '@/types/command';
import { isTemperatureCommand } from '@/types/gcode';

const radsPerArcSegment = 2 * Math.PI / 24;
  
export default function CommandParser({ gcode }: { gcode: string }): Command[] {
  try {
    const parsedGCode = parseGCode(gcode);
    var commands: Command[] = [];
    var lastPoint: Vertex = { x: 0, y: 0, z: 0 };

    for (const command of parsedGCode) {
        if (isTemperatureCommand(command)) {
            if (command.parameters.s !== undefined && typeof command.parameters.s === 'number') {
                commands.push({
                    lineNumber: command.lineNumber,
                    setTemp: {
                        s: command.parameters.s
                    }
                });
            }
        }
        if (isMovementCommand(command)) {
            const nextPoint = makePoint(lastPoint, command);
            var e = false;
            if (command.parameters.e !== undefined && typeof command.parameters.e === 'number' && command.parameters.e > 0) {
                e = true;
            }
            if (nextPoint.length === 1) {
                commands.push({
                    lineNumber: command.lineNumber,
                    toolPath: { start: lastPoint, end: nextPoint[0], isExtrusion: e }
                });
                lastPoint = nextPoint[0];
            } else {
                for (const point of nextPoint) {
                    commands.push({
                        lineNumber: command.lineNumber,
                        toolPath: { start: lastPoint, end: point, isExtrusion: e }
                    });
                    lastPoint = {...point};
                }
            }
        }
    }

    return commands;
  } catch (err) {
    console.error('Error in MovementParser:', err);
    throw err;
  }
}

export function makePoint(lastPoint: Vertex, command: GCodeCommand): Vertex[] {
    var nextPoint: Vertex = { ...lastPoint };
    switch (command.command) {
        case 'G0': {
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
            return [nextPoint];
        }
        case 'G2': {
            // Clockwise arc
        }
        case 'G3': {
            // TODO: Make it handle when a Radius is specified
            var arcLastPoint: Vertex = { ...lastPoint };
            const cw = command.command === 'G2' ? true : false;
            // G3 is Counter-clockwise arc
            var i = 0;
            var j = 0;
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
            // if there's a P, it can be ignored since x and y are already set
            const centerPoint: Vertex = { x: arcLastPoint.x + i, y: arcLastPoint.y + j, z: arcLastPoint.z };
            var points: Vertex[] = [];
            // Angle is positive for ccw, negative for cw
            var angle = command.parameters.p === undefined ? calcAngle(arcLastPoint, centerPoint, nextPoint, cw) : 2 * Math.PI * (cw ? -1 : 1);

            const steps = Math.ceil(Math.abs(angle) / radsPerArcSegment);
            const stepSize = angle / steps;
            for (var k = 0; k < steps - 1; k++) {
                const intermediatePoint = calcPoint(arcLastPoint, centerPoint, stepSize);
                points.push(intermediatePoint);
                arcLastPoint.x = intermediatePoint.x;
                arcLastPoint.y = intermediatePoint.y;
                angle = calcAngle( arcLastPoint, centerPoint, nextPoint, cw);
            }
            points.push(nextPoint);
            return points;
        }
    }
    return [];
}

// Calculate a point on a circle given a start point, center point, end point, and angle
export function calcPoint(start: Vertex, center: Vertex, angle: number): Vertex {
    const r = Math.sqrt((center.x - start.x)**2 + (center.y - start.y)**2);
    var startAngle = Math.atan((start.y - center.y) / (start.x - center.x))
    if (start.x < center.x && center.y < start.y) {
        // quadrant 2
        startAngle += Math.PI;
    } else if (start.x < center.x && start.y < center.y) {
        // quadrant 3
        startAngle += Math.PI;
    } else if (center.x < start.x && start.y < center.y) {
        // quadrant 4
        startAngle += 2 * Math.PI;
    }
    const endAngle = startAngle + angle ;
    const x = center.x + r * Math.cos(endAngle);
    const y = center.y + r * Math.sin(endAngle);
    return { x: x, y: y, z: start.z};
}

export function calcAngle(start: Vertex, center: Vertex, end: Vertex, cw: boolean): number {
    var startAngle = Math.atan((start.y - center.y) / (start.x - center.x));
    if (start.x < center.x && center.y < start.y) {
        // quadrant 2
        startAngle += Math.PI;
    } else if (start.x < center.x && start.y < center.y) {
        // quadrant 3
        startAngle += Math.PI;
    } else if (center.x < start.x && start.y < center.y) {
        // quadrant 4
        startAngle += 2 * Math.PI;
    }
    var endAngle = Math.atan((end.y - center.y) / (end.x - center.x));
    if (end.x < center.x && center.y < end.y) {
        // quadrant 2
        endAngle += Math.PI;
    } else if (end.x < center.x && end.y < center.y) {
        // quadrant 3
        endAngle += Math.PI;
    } else if (center.x < end.x && end.y < center.y) {
        // quadrant 4
        endAngle += 2 * Math.PI;
    }
    var angle = endAngle - startAngle;
    if (cw && angle > 0) {
        return angle - 2 * Math.PI;
    } else if (!cw && angle < 0) {
        return 2 * Math.PI + angle;
    }
    return angle;
}
