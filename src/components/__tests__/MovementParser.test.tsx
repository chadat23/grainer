import { describe, it, expect } from '@jest/globals';
import MovementParser from '../MovementParser';
import { Line, Point } from '@/types/spacial';

describe('MovementParser', () => {
  it('should parse multiple G1 commands with extrusion', () => {
    const gcode = `
      G1 X10 Y20 Z3 E1.5
      G1 X20 Y30 Z4 E2.0
      G1 Y35 E2.0
    `;
    const result = MovementParser({ gcode });
    
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      start: { x: 10, y: 20, z: 3 },
      end: { x: 20, y: 30, z: 4 },
      isExtrusion: true
    });
    expect(result[1]).toEqual({
      start: { x: 20, y: 30, z: 4 },
      end: { x: 20, y: 35, z: 4 },
      isExtrusion: true
    });
  });

  it('should handle mixed G0 and G1 commands', () => {
    const gcode = `
      G0 X5 Y5 Z0
      G1 Y10
      G1 X10 E1.0
      G0 X15 Y15
      G1 X20 Y25 E2.0
    `;
    const result = MovementParser({ gcode });
    
    expect(result).toHaveLength(4);
    expect(result[0]).toEqual({ start: { x: 5, y: 5, z: 0 }, end: { x: 5, y: 10, z: 0 }, isExtrusion: false });
    expect(result[1]).toEqual({ start: { x: 5, y: 10, z: 0 }, end: { x: 10, y: 10, z: 0 }, isExtrusion: true });
    expect(result[2]).toEqual({ start: { x: 10, y: 10, z: 0 }, end: { x: 15, y: 15, z: 0 }, isExtrusion: false });
    expect(result[3]).toEqual({ start: { x: 15, y: 15, z: 0 }, end: { x: 20, y: 25, z: 0 }, isExtrusion: true });
  });

  it('should handle G-code with comments', () => {
    const gcode = `
      G0 X5 Y5 Z0
      G1 Y10
      ; This is a comment
      G1 X10 E1.0
      G0 X15 Y15
      G1 X20 Y25 E2.0
    `;
    const result = MovementParser({ gcode });
    
    expect(result).toHaveLength(4);
    expect(result[0]).toEqual({ start: { x: 5, y: 5, z: 0 }, end: { x: 5, y: 10, z: 0 }, isExtrusion: false });
    expect(result[1]).toEqual({ start: { x: 5, y: 10, z: 0 }, end: { x: 10, y: 10, z: 0 }, isExtrusion: true });
    expect(result[2]).toEqual({ start: { x: 10, y: 10, z: 0 }, end: { x: 15, y: 15, z: 0 }, isExtrusion: false });
    expect(result[3]).toEqual({ start: { x: 15, y: 15, z: 0 }, end: { x: 20, y: 25, z: 0 }, isExtrusion: true });
 
  });

  it('should handle invalid G-code gracefully', () => {
    const gcode = `
      G1 X10 Y20 Z0 E1.5
      INVALID_COMMAND
      G1 X20 Y30 Z0 E2.0
    `;
    const result = MovementParser({ gcode });
    
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ start: { x: 10, y: 20, z: 0 }, end: { x: 20, y: 30, z: 0 }, isExtrusion: true });
  });
}); 