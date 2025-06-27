import { describe, it, expect } from '@jest/globals';
import MovementParser, { makePoint, calcAngle, calcPoint } from '../MovementParser';
import { Line, Point } from '@/types/spacial';
import { GCodeCommand, LinearMovementCommand, ArcMovementCommand } from '@/types/gcode';

//describe('MovementParser', () => {
//  it('should parse multiple G1 commands with extrusion', () => {
//    const gcode = `
//      G1 X10 Y20 Z3 E1.5
//      G1 X20 Y30 Z4 E2.0
//      G1 Y35 E2.0
//    `;
//    const result = MovementParser({ gcode });
//    
//    expect(result).toHaveLength(2);
//    expect(result[0]).toEqual({
//      start: { x: 10, y: 20, z: 3 },
//      end: { x: 20, y: 30, z: 4 },
//      isExtrusion: true
//    });
//    expect(result[1]).toEqual({
//      start: { x: 20, y: 30, z: 4 },
//      end: { x: 20, y: 35, z: 4 },
//      isExtrusion: true
//    });
//  });
//
//  it('should handle mixed G0 and G1 commands', () => {
//    const gcode = `
//      G0 X5 Y5 Z0
//      G1 Y10
//      G1 X10 E1.0
//      G0 X15 Y15
//      G1 X20 Y25 E2.0
//    `;
//    const result = MovementParser({ gcode });
//    
//    expect(result).toHaveLength(4);
//    expect(result[0]).toEqual({ start: { x: 5, y: 5, z: 0 }, end: { x: 5, y: 10, z: 0 }, isExtrusion: false });
//    expect(result[1]).toEqual({ start: { x: 5, y: 10, z: 0 }, end: { x: 10, y: 10, z: 0 }, isExtrusion: true });
//    expect(result[2]).toEqual({ start: { x: 10, y: 10, z: 0 }, end: { x: 15, y: 15, z: 0 }, isExtrusion: false });
//    expect(result[3]).toEqual({ start: { x: 15, y: 15, z: 0 }, end: { x: 20, y: 25, z: 0 }, isExtrusion: true });
//  });
//
//  it('should handle G-code with comments', () => {
//    const gcode = `
//      G0 X5 Y5 Z0
//      G1 Y10
//      ; This is a comment
//      G1 X10 E1.0
//      G0 X15 Y15
//      G1 X20 Y25 E2.0
//    `;
//    const result = MovementParser({ gcode });
//    
//    expect(result).toHaveLength(4);
//    expect(result[0]).toEqual({ start: { x: 5, y: 5, z: 0 }, end: { x: 5, y: 10, z: 0 }, isExtrusion: false });
//    expect(result[1]).toEqual({ start: { x: 5, y: 10, z: 0 }, end: { x: 10, y: 10, z: 0 }, isExtrusion: true });
//    expect(result[2]).toEqual({ start: { x: 10, y: 10, z: 0 }, end: { x: 15, y: 15, z: 0 }, isExtrusion: false });
//    expect(result[3]).toEqual({ start: { x: 15, y: 15, z: 0 }, end: { x: 20, y: 25, z: 0 }, isExtrusion: true });
// 
//  });
//
//  it('should handle invalid G-code gracefully', () => {
//    const gcode = `
//      G1 X10 Y20 Z0 E1.5
//      INVALID_COMMAND
//      G1 X20 Y30 Z0 E2.0
//    `;
//    const result = MovementParser({ gcode });
//    
//    expect(result).toHaveLength(1);
//    expect(result[0]).toEqual({ start: { x: 10, y: 20, z: 0 }, end: { x: 20, y: 30, z: 0 }, isExtrusion: true });
//  });
//});

//describe('makePoint', () => {
//  it('should parse G0 command', () => {
//    const command: LinearMovementCommand = {
//      command: 'G0',
//      parameters: { x: 10, y: 20, z: 3 }
//    };
//    const result = makePoint({ x: 1, y: 2, z: 3 }, command, 0.1);
//    
//    expect(result).toHaveLength(1);
//    expect(result[0]).toEqual({ x: 10, y: 20, z: 3 });
//  });
//
//  it('should parse G1 command', () => {
//    const command: LinearMovementCommand = {
//      command: 'G1',
//      parameters: { x: 10, y: 20, z: 3, e: 1.5 }
//    };
//    const result = makePoint({ x: 1, y: 2, z: 3 }, command, 0.1);
//    
//    expect(result).toHaveLength(1);
//    expect(result[0]).toEqual({ x: 10, y: 20, z: 3 });
//  });
//
//  it('should parse G2 command', () => {
//    // TODO: this needs to be worked through
//    const command: ArcMovementCommand = {
//      command: 'G2',
//      parameters: { x: 5, y: 6, z: 4, i: 5.469, j: -2.469, r: 3 }
//    };
//    const result = makePoint({ x: 2, y: 3, z: 4 }, command);
//    expect(result).toHaveLength(3);
//    expect(result[0].x).toBeCloseTo(2.747, 3);
//    expect(result[0].y).toBeCloseTo(4.233, 3);
//    expect(result[0].z).toBeCloseTo(4, 3);
//    expect(result[1].x).toBeCloseTo(3.766, 3);
//    expect(result[1].y).toBeCloseTo(5.253, 3);
//    expect(result[1].z).toBeCloseTo(4, 3);
//    expect(result[2].x).toBeCloseTo(5, 3);
//    expect(result[2].y).toBeCloseTo(6, 3);
//    expect(result[2].z).toBeCloseTo(4, 3);
//  });
//});

describe('calcPoint', () => {
  it('quadrent 1, cw angle', () => {
    const result = calcPoint({ x: 1.5, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, -15*Math.PI/180);
    expect(result.x).toBeCloseTo(1.708, 3);
    expect(result.y).toBeCloseTo(0.578, 3);
    expect(result.z).toBeCloseTo(0, 3);
  });

  it('quadrent 1, ccw angle', () => {
    const result = calcPoint({ x: 1.5, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, 15*Math.PI/180);
    expect(result.x).toBeCloseTo(1.190, 3);
    expect(result.y).toBeCloseTo(1.354, 3);
    expect(result.z).toBeCloseTo(0, 3);
  });

  it('quadrent 2, cw angle', () => {
    const result = calcPoint({ x: -1.5, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, -15*Math.PI/180);
    expect(result.x).toBeCloseTo(-1.190, 3);
    expect(result.y).toBeCloseTo(1.354, 3);
    expect(result.z).toBeCloseTo(0, 3);
  });

  it('quadrent 2, ccw angle', () => {
    const result = calcPoint({ x: -1.5, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, 15*Math.PI/180);
    expect(result.x).toBeCloseTo(-1.708, 3);
    expect(result.y).toBeCloseTo(0.578, 3);
    expect(result.z).toBeCloseTo(0, 3);
  });

  it('quadrent 3, cw angle', () => {
    const result = calcPoint({ x: -1.5, y: -1, z: 0 }, { x: 0, y: 0, z: 0 }, -15*Math.PI/180);
    expect(result.x).toBeCloseTo(-1.708, 3);
    expect(result.y).toBeCloseTo(-0.578, 3);
    expect(result.z).toBeCloseTo(0, 3);
  });

  it('quadrent 3, ccw angle', () => {
    const result = calcPoint({ x: -1.5, y: -1, z: 0 }, { x: 0, y: 0, z: 0 }, 15*Math.PI/180);
    expect(result.x).toBeCloseTo(-1.190, 3);
    expect(result.y).toBeCloseTo(-1.354, 3);
    expect(result.z).toBeCloseTo(0, 3);
  });

  it('quadrent 4, cw angle', () => {
    const result = calcPoint({ x: 1.5, y: -1, z: 0 }, { x: 0, y: 0, z: 0 }, -15*Math.PI/180);
    expect(result.x).toBeCloseTo(1.190, 3);
    expect(result.y).toBeCloseTo(-1.354, 3);
    expect(result.z).toBeCloseTo(0, 3);
  });

  it('quadrent 4, ccw angle', () => {
    const result = calcPoint({ x: 1.5, y: -1, z: 0 }, { x: 0, y: 0, z: 0 }, 15*Math.PI/180);
    expect(result.x).toBeCloseTo(1.708, 3);
    expect(result.y).toBeCloseTo(-0.578, 3);
    expect(result.z).toBeCloseTo(0, 3);
  });
});

describe('calcAngle', () => {
// quadrant 1, quadrant 1
  it('quadrant 1, quadrant 1, short way around, ccw', () => {
    const result = calcAngle({ x: 3, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1.5, z: 0 }, false);
    expect(result).toBeCloseTo(37.9 * Math.PI/180, 3);
  });

  it('quadrant 1, quadrant 1, long way around, cw', () => {
    const result = calcAngle({ x: 3, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1.5, z: 0 }, true);
    expect(result).toBeCloseTo(-(360 - 37.9) * Math.PI/180, 3);
  });

  it('quadrant 1, quadrant 1, long way around, ccw', () => {
    const result = calcAngle({ x: 1, y: 1.5, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 3, y: 1, z: 0 }, false);
    expect(result).toBeCloseTo((360 - 37.9) * Math.PI/180, 3);
  });

  it('quadrant 1, quadrant 1, short way around, cw', () => {
    const result = calcAngle({ x: 1, y: 1.5, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 3, y: 1, z: 0 }, true);
    expect(result).toBeCloseTo(-37.9 * Math.PI/180, 3);
  });
// quadrant 1, quadrant 2
  it('quadrant 1, quadrant 2, ccw', () => {
    const result = calcAngle({ x: 3, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: -1, y: 1.5, z: 0 }, false);
    expect(result).toBeCloseTo(105.25 * Math.PI/180, 3);
  });

  it('quadrant 1, quadrant 2, cw', () => {
    const result = calcAngle({ x: 3, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: -1, y: 1.5, z: 0 }, true);
    expect(result).toBeCloseTo(-(360 - 105.25) * Math.PI/180, 3);
  });
// quadrant 1, quadrant 3
  it('quadrant 1, quadrant 3, ccw', () => {
    const result = calcAngle({ x: 3, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: -1, y: -1.5, z: 0 }, false);
    expect(result).toBeCloseTo((360 - 142.1) * Math.PI/180, 3);
  });

  it('quadrant 1, quadrant 3, cw', () => {
    const result = calcAngle({ x: 3, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: -1, y: -1.5, z: 0 }, true);
    expect(result).toBeCloseTo(-142.1 * Math.PI/180, 3);
  });
// quadrant 1, quadrant 4
  it('quadrant 1, quadrant 4, ccw', () => {
    const result = calcAngle({ x: 3, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: -1.5, z: 0 }, false);
    expect(result).toBeCloseTo((360 - 74.74) * Math.PI/180, 3);
  });

  it('quadrant 1, quadrant 4, cw', () => {
    const result = calcAngle({ x: 3, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: -1.5, z: 0 }, true);
    expect(result).toBeCloseTo(-74.74 * Math.PI/180, 3);
  });
// quadrant 2, quadrant 1
  it('quadrant 2, quadrant 1, ccw', () => {
    const result = calcAngle({ x: -3, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1.5, z: 0 }, false);
    expect(result).toBeCloseTo((360 - 105.25) * Math.PI/180, 3);
  });

  it('quadrant 2, quadrant 1, cw', () => {
    const result = calcAngle({ x: -3, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1.5, z: 0 }, true);
    expect(result).toBeCloseTo(-105.25 * Math.PI/180, 3);
  });
// quadrant 2, quadrant 2
  it('quadrant 2, quadrant 2, long way around, ccw', () => {
    const result = calcAngle({ x: -3, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: -1, y: 1.5, z: 0 }, false);
    expect(result).toBeCloseTo((360 - 37.87) * Math.PI/180, 3);
  });

  it('quadrant 2, quadrant 2, short way around, cw', () => {
    const result = calcAngle({ x: -3, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: -1, y: 1.5, z: 0 }, true);
    expect(result).toBeCloseTo(-37.87 * Math.PI/180, 3);
  });

  it('quadrant 2, quadrant 2, short way around, ccw', () => {
    const result = calcAngle({ x: -1, y: 1.5, z: 0 }, { x: 0, y: 0, z: 0 }, { x: -3, y: 1, z: 0 }, false);
    expect(result).toBeCloseTo(37.87 * Math.PI/180, 3);
  });

  it('quadrant 2, quadrant 1, long way around, cw', () => {
    const result = calcAngle({ x: -1, y: 1.5, z: 0 }, { x: 0, y: 0, z: 0 }, { x: -3, y: 1, z: 0 }, true);
    expect(result).toBeCloseTo(-(360 - 37.87) * Math.PI/180, 3);
  });
// quadrant 2, quadrant 3
  it('quadrant 2, quadrant 3, ccw', () => {
    const result = calcAngle({ x: -3, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: -1, y: -1.5, z: 0 }, false);
    expect(result).toBeCloseTo(74.74 * Math.PI/180, 3);
  });

  it('quadrant 2, quadrant 3, cw', () => {
    const result = calcAngle({ x: -3, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: -1, y: -1.5, z: 0 }, true);
    expect(result).toBeCloseTo(-(360 - 74.74) * Math.PI/180, 3);
  });
// quadrant 2, quadrant 4
  it('quadrant 2, quadrant 4, ccw', () => {
    const result = calcAngle({ x: -3, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: -1.5, z: 0 }, false);
    expect(result).toBeCloseTo(142.1 * Math.PI/180, 3);
  });

  it('quadrant 2, quadrant 4, cw', () => {
    const result = calcAngle({ x: -3, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: -1.5, z: 0 }, true);
    expect(result).toBeCloseTo(-(360 - 142.1) * Math.PI/180, 3);
  });
// quadrant 3, quadrant 1
  it('quadrant 3, quadrant 1, ccw', () => {
    const result = calcAngle({ x: -3, y: -1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1.5, z: 0 }, false);
    expect(result).toBeCloseTo((360 - 142.1) * Math.PI/180, 3);
  });

  it('quadrant 3, quadrant 1, cw', () => {
    const result = calcAngle({ x: -3, y: -1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1.5, z: 0 }, true);
    expect(result).toBeCloseTo(-142.1 * Math.PI/180, 3);
  });
// quadrant 3, quadrant 2
  it('quadrant 3, quadrant 2, ccw', () => {
    const result = calcAngle({ x: -3, y: -1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: -1, y: 1.5, z: 0 }, false);
    expect(result).toBeCloseTo((360 - 74.74) * Math.PI/180, 3);
  });

  it('quadrant 3, quadrant 2, cw', () => {
    const result = calcAngle({ x: -3, y: -1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: -1, y: 1.5, z: 0 }, true);
    expect(result).toBeCloseTo(-74.74 * Math.PI/180, 3);
  });
// quadrant 3, quadrant 3
  it('quadrant 3, quadrant 3, short way around, ccw', () => {
    const result = calcAngle({ x: -3, y: -1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: -1, y: -1.5, z: 0 }, false);
    expect(result).toBeCloseTo(37.87 * Math.PI/180, 3);
  });

  it('quadrant 3, quadrant 3, long way around, cw', () => {
    const result = calcAngle({ x: -3, y: -1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: -1, y: -1.5, z: 0 }, true);
    expect(result).toBeCloseTo(-(360 - 37.87) * Math.PI/180, 3);
  });

  it('quadrant 3, quadrant 3, long way around, ccw', () => {
    const result = calcAngle({ x: -1, y: -1.5, z: 0 }, { x: 0, y: 0, z: 0 }, { x: -3, y: -1, z: 0 }, false);
    expect(result).toBeCloseTo((360 - 37.87) * Math.PI/180, 3);
  });

  it('quadrant 3, quadrant 3, short way around, cw', () => {
    const result = calcAngle({ x: -1, y: -1.5, z: 0 }, { x: 0, y: 0, z: 0 }, { x: -3, y: -1, z: 0 }, true);
    expect(result).toBeCloseTo(-37.87 * Math.PI/180, 3);
  });
// quadrant 3, quadrant 4
  it('quadrant 3, quadrant 4, ccw', () => {
    const result = calcAngle({ x: -3, y: -1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: -1.5, z: 0 }, false);
    expect(result).toBeCloseTo(105.25 * Math.PI/180, 3);
  });

  it('quadrant 3, quadrant 4, cw', () => {
    const result = calcAngle({ x: -3, y: -1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: -1.5, z: 0 }, true);
    expect(result).toBeCloseTo(-(360 - 105.25) * Math.PI/180, 3);
  });
// quadrant 4, quadrant 1
  it('quadrant 4, quadrant 1, ccw', () => {
    const result = calcAngle({ x: 3, y: -1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1.5, z: 0 }, false);
    expect(result).toBeCloseTo(74.74 * Math.PI/180, 3);
  });

  it('quadrant 4, quadrant 1, cw', () => {
    const result = calcAngle({ x: 3, y: -1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1.5, z: 0 }, true);
    expect(result).toBeCloseTo(-(360 - 74.74) * Math.PI/180, 3);
  });
// quadrant 4, quadrant 2
  it('quadrant 4, quadrant 2, ccw', () => {
    const result = calcAngle({ x: 3, y: -1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: -1, y: 1.5, z: 0 }, false);
    expect(result).toBeCloseTo(142.1 * Math.PI/180, 3);
  });

  it('quadrant 4, quadrant 2, cw', () => {
    const result = calcAngle({ x: 3, y: -1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: -1, y: 1.5, z: 0 }, true);
    expect(result).toBeCloseTo(-(360 - 142.1) * Math.PI/180, 3);
  });
// quadrant 4, quadrant 3
  it('quadrant 4, quadrant 3, ccw', () => {
    const result = calcAngle({ x: 3, y: -1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: -1, y: -1.5, z: 0 }, false);
    expect(result).toBeCloseTo((360 - 105.25) * Math.PI/180, 3);
  });

  it('quadrant 4, quadrant 3, cw', () => {
    const result = calcAngle({ x: 3, y: -1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: -1, y: -1.5, z: 0 }, true);
    expect(result).toBeCloseTo(-105.25 * Math.PI/180, 3);
  });
// quadrant 4, quadrant 4
  it('quadrant 4, quadrant 4, long way around, ccw', () => {
    const result = calcAngle({ x: 3, y: -1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: -1.5, z: 0 }, false);
    expect(result).toBeCloseTo((360 - 37.87) * Math.PI/180, 3);
  });

  it('quadrant 4, quadrant 4, short way around, cw', () => {
    const result = calcAngle({ x: 3, y: -1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: -1.5, z: 0 }, true);
    expect(result).toBeCloseTo(-37.87 * Math.PI/180, 3);
  });

  it('quadrant 4, quadrant 4, short way around, ccw', () => {
    const result = calcAngle({ x: 1, y: -1.5, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 3, y: -1, z: 0 }, false);
    expect(result).toBeCloseTo(37.87 * Math.PI/180, 3);
  });

  it('quadrant 4, quadrant 4, long way around, cw', () => {
    const result = calcAngle({ x: 1, y: -1.5, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 3, y: -1, z: 0 }, true);
    expect(result).toBeCloseTo(-(360 - 37.87) * Math.PI/180, 3);
  });
});
