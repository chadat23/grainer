import { describe, it, expect } from '@jest/globals';
import CommandParser, { makePoint, calcAngle, calcPoint } from '../CommandParser';
import { ToolPath, Vertex } from '@/types/spatial';
import { GCodeCommand, LinearMovementCommand, ArcMovementCommand } from '@/types/gcode';

describe('ToolPathParser', () => {
  it('should parse all commands', () => {
    const gcode = `
      ; G0 command
      G0 X10 Y20 Z3

      G0 X20 Y40
      G1 X20 Y30 Z4 E1.5

      ; G1 command

      G1 X2 Y3 E1
      G2 X5 Y6 I5.4686 J-2.4686 E1.3

      G3 X2 Y3 I2.4686 J-5.4686 E0.5
      G2 P1 I2.4686 J-5.4686 E0.5
      G3 P1 I2.4686 J-5.4686 E0.5
    `;
    // TODO: maybe remove the filter, don't know what makes the most sense
    const result = CommandParser({ gcode }).filter(toolPath => toolPath.isExtrusion);
    expect(result).toHaveLength(56);
    // G1 X20 Y30 Z4 E1.5
    expect(result[0]).toEqual({ start: { x: 20, y: 40, z: 3 }, end: { x: 20, y: 30, z: 4 }, isExtrusion: true });
    // G1 X2 Y3 E1
    expect(result[1]).toEqual({ start: { x: 20, y: 30, z: 4 }, end: { x: 2, y: 3, z: 4 }, isExtrusion: true });
    // G2 X5 Y6 I5.4686 J-2.4686 R3
    expect(result[2].start).toEqual({ x: 2, y: 3, z: 4 });
    expect(result[2].end.x).toBeCloseTo(2.747, 3);
    expect(result[2].end.y).toBeCloseTo(4.233, 3);
    expect(result[2].end.z).toBeCloseTo(4, 3);
    expect(result[2].isExtrusion).toBe(true);
    expect(result[3].start.x).toBeCloseTo(2.747, 3);
    expect(result[3].start.y).toBeCloseTo(4.233, 3);
    expect(result[3].start.z).toBeCloseTo(4, 3);
    expect(result[3].end.x).toBeCloseTo(3.767, 3);
    expect(result[3].end.y).toBeCloseTo(5.253, 3);
    expect(result[3].end.z).toBeCloseTo(4, 3);
    expect(result[3].isExtrusion).toBe(true);
    expect(result[4].start.x).toBeCloseTo(3.767, 3);
    expect(result[4].start.y).toBeCloseTo(5.253, 3);
    expect(result[4].start.z).toBeCloseTo(4, 3);
    expect(result[4].end).toEqual({ x: 5, y: 6, z: 4 });
    expect(result[4].isExtrusion).toBe(true);
    expect(result[5].start).toEqual({ x: 5, y: 6, z: 4 });
    expect(result[5].end.x).toBeCloseTo(3.767, 3);
    expect(result[5].end.y).toBeCloseTo(5.253, 3);
    expect(result[5].end.z).toBeCloseTo(4, 3);
    expect(result[5].isExtrusion).toBe(true);
    // G3 X2 Y3 I2.4686 J-5.4686 E0.5
    expect(result[6].start.x).toBeCloseTo(3.767, 3);
    expect(result[6].start.y).toBeCloseTo(5.253, 3);
    expect(result[6].start.z).toBeCloseTo(4, 3);
    expect(result[6].end.x).toBeCloseTo(2.747, 3);
    expect(result[6].end.y).toBeCloseTo(4.233, 3);
    expect(result[6].end.z).toBeCloseTo(4, 3);
    expect(result[6].isExtrusion).toBe(true);
    expect(result[7].start.x).toBeCloseTo(2.747, 3);
    expect(result[7].start.y).toBeCloseTo(4.233, 3);
    expect(result[7].start.z).toBeCloseTo(4, 3);
    expect(result[7].end).toEqual({ x: 2, y: 3, z: 4 });
    expect(result[7].isExtrusion).toBe(true);
    // G3 P1 I2.4686 J-5.4686 E0.5
    expect(result[8].start).toEqual({ x: 2, y: 3, z: 4 });
    expect(result[8].end.x).toBeCloseTo(3.499);
    expect(result[8].end.y).toBeCloseTo(3.453, 3);
    expect(result[8].end.z).toBeCloseTo(4, 3);
    expect(result[8].isExtrusion).toBe(true);
    expect(result[9].start.x).toBeCloseTo(3.499, 3);
    expect(result[9].start.y).toBeCloseTo(3.453, 3);
    expect(result[9].start.z).toBeCloseTo(4, 3);
    expect(result[9].end.x).toBeCloseTo(5.065, 3);
    expect(result[9].end.y).toBeCloseTo(3.502, 3);
    expect(result[9].end.z).toBeCloseTo(4, 3);
    expect(result[9].isExtrusion).toBe(true);
    expect(result[10].start.x).toBeCloseTo(5.065, 3);
    expect(result[10].start.y).toBeCloseTo(3.502, 3);
    expect(result[10].start.z).toBeCloseTo(4, 3);
    expect(result[10].end.x).toBeCloseTo(6.590, 3);
    expect(result[10].end.y).toBeCloseTo(3.144, 3);
    expect(result[10].end.z).toBeCloseTo(4, 3);
    expect(result[10].isExtrusion).toBe(true);
    expect(result[11].start.x).toBeCloseTo(6.590, 3);
    expect(result[11].start.y).toBeCloseTo(3.144, 3);
    expect(result[11].start.z).toBeCloseTo(4, 3);
    expect(result[11].end.x).toBeCloseTo(7.970, 3);
    expect(result[11].end.y).toBeCloseTo(2.404, 3);
    expect(result[11].end.z).toBeCloseTo(4, 3);
    expect(result[11].isExtrusion).toBe(true);
    expect(result[12].start.x).toBeCloseTo(7.970, 3);
    expect(result[12].start.y).toBeCloseTo(2.404, 3);
    expect(result[12].start.z).toBeCloseTo(4, 3);
    expect(result[12].end.x).toBeCloseTo(9.112, 3);
    expect(result[12].end.y).toBeCloseTo(1.331, 3);
    expect(result[12].end.z).toBeCloseTo(4, 3);
    expect(result[12].isExtrusion).toBe(true);
    expect(result[13].start.x).toBeCloseTo(9.112, 3);
    expect(result[13].start.y).toBeCloseTo(1.331, 3);
    expect(result[13].start.z).toBeCloseTo(4, 3);
    expect(result[13].end.x).toBeCloseTo(9.937, 3);
    expect(result[13].end.y).toBeCloseTo(0, 3);
    expect(result[13].end.z).toBeCloseTo(4, 3);
    expect(result[13].isExtrusion).toBe(true);
    expect(result[14].start.x).toBeCloseTo(9.937, 3);
    expect(result[14].start.y).toBeCloseTo(0, 3);
    expect(result[14].start.z).toBeCloseTo(4, 3);
    expect(result[14].end.x).toBeCloseTo(10.390, 3);
    expect(result[14].end.y).toBeCloseTo(-1.499, 3);
    expect(result[14].end.z).toBeCloseTo(4, 3);
    expect(result[14].isExtrusion).toBe(true);
    expect(result[15].start.x).toBeCloseTo(10.390, 3);
    expect(result[15].start.y).toBeCloseTo(-1.499, 3);
    expect(result[15].start.z).toBeCloseTo(4, 3);
    expect(result[15].end.x).toBeCloseTo(10.439, 3);
    expect(result[15].end.y).toBeCloseTo(-3.065, 3);
    expect(result[15].end.z).toBeCloseTo(4, 3);
    expect(result[15].isExtrusion).toBe(true);
    expect(result[16].start.x).toBeCloseTo(10.439, 3);
    expect(result[16].start.y).toBeCloseTo(-3.065, 3);
    expect(result[16].start.z).toBeCloseTo(4, 3);
    expect(result[16].end.x).toBeCloseTo(10.081, 3);
    expect(result[16].end.y).toBeCloseTo(-4.590, 3);
    expect(result[16].end.z).toBeCloseTo(4, 3);
    expect(result[16].isExtrusion).toBe(true);
    expect(result[17].start.x).toBeCloseTo(10.081, 3);
    expect(result[17].start.y).toBeCloseTo(-4.590, 3);
    expect(result[17].start.z).toBeCloseTo(4, 3);
    expect(result[17].end.x).toBeCloseTo(9.341, 3);
    expect(result[17].end.y).toBeCloseTo(-5.970, 3);
    expect(result[17].end.z).toBeCloseTo(4, 3);
    expect(result[17].isExtrusion).toBe(true);
    expect(result[18].start.x).toBeCloseTo(9.341, 3);
    expect(result[18].start.y).toBeCloseTo(-5.970, 3);
    expect(result[18].start.z).toBeCloseTo(4, 3);
    expect(result[18].end.x).toBeCloseTo(8.268, 3);
    expect(result[18].end.y).toBeCloseTo(-7.112, 3);
    expect(result[18].end.z).toBeCloseTo(4, 3);
    expect(result[18].isExtrusion).toBe(true);
    expect(result[19].start.x).toBeCloseTo(8.268, 3);
    expect(result[19].start.y).toBeCloseTo(-7.112, 3);
    expect(result[19].start.z).toBeCloseTo(4, 3);
    expect(result[19].end.x).toBeCloseTo(6.937, 3);
    expect(result[19].end.y).toBeCloseTo(-7.937, 3);
    expect(result[19].end.z).toBeCloseTo(4, 3);
    expect(result[19].isExtrusion).toBe(true);
    expect(result[20].start.x).toBeCloseTo(6.937, 3);
    expect(result[20].start.y).toBeCloseTo(-7.937, 3);
    expect(result[20].start.z).toBeCloseTo(4, 3);
    expect(result[20].end.x).toBeCloseTo(5.438, 3);
    expect(result[20].end.y).toBeCloseTo(-8.39, 3);
    expect(result[20].end.z).toBeCloseTo(4, 3);
    expect(result[20].isExtrusion).toBe(true);
    expect(result[21].start.x).toBeCloseTo(5.438, 3);
    expect(result[21].start.y).toBeCloseTo(-8.39, 3);
    expect(result[21].start.z).toBeCloseTo(4, 3);
    expect(result[21].end.x).toBeCloseTo(3.872, 3);
    expect(result[21].end.y).toBeCloseTo(-8.439, 3);
    expect(result[21].end.z).toBeCloseTo(4, 3);
    expect(result[21].isExtrusion).toBe(true);
    expect(result[22].start.x).toBeCloseTo(3.872, 3);
    expect(result[22].start.y).toBeCloseTo(-8.439, 3);
    expect(result[22].start.z).toBeCloseTo(4, 3);
    expect(result[22].end.x).toBeCloseTo(2.347, 3);
    expect(result[22].end.y).toBeCloseTo(-8.081, 3);
    expect(result[22].end.z).toBeCloseTo(4, 3);
    expect(result[22].isExtrusion).toBe(true);
    expect(result[23].start.x).toBeCloseTo(2.347, 3);
    expect(result[23].start.y).toBeCloseTo(-8.081, 3);
    expect(result[23].start.z).toBeCloseTo(4, 3);
    expect(result[23].end.x).toBeCloseTo(0.967, 3);
    expect(result[23].end.y).toBeCloseTo(-7.341, 3);
    expect(result[23].end.z).toBeCloseTo(4, 3);
    expect(result[23].isExtrusion).toBe(true);
    expect(result[24].start.x).toBeCloseTo(0.967, 3);
    expect(result[24].start.y).toBeCloseTo(-7.341, 3);
    expect(result[24].start.z).toBeCloseTo(4, 3);
    expect(result[24].end.x).toBeCloseTo(-0.175, 3);
    expect(result[24].end.y).toBeCloseTo(-6.268, 3);
    expect(result[24].end.z).toBeCloseTo(4, 3);
    expect(result[24].isExtrusion).toBe(true);
    expect(result[25].start.x).toBeCloseTo(-0.175, 3);
    expect(result[25].start.y).toBeCloseTo(-6.268, 3);
    expect(result[25].start.z).toBeCloseTo(4, 3);
    expect(result[25].end.x).toBeCloseTo(-1, 3);
    expect(result[25].end.y).toBeCloseTo(-4.937, 3);
    expect(result[25].end.z).toBeCloseTo(4, 3);
    expect(result[25].isExtrusion).toBe(true);
    expect(result[26].start.x).toBeCloseTo(-1, 3);
    expect(result[26].start.y).toBeCloseTo(-4.937, 3);
    expect(result[26].start.z).toBeCloseTo(4, 3);
    expect(result[26].end.x).toBeCloseTo(-1.453, 3);
    expect(result[26].end.y).toBeCloseTo(-3.438, 3);
    expect(result[26].end.z).toBeCloseTo(4, 3);
    expect(result[26].isExtrusion).toBe(true);
    expect(result[27].start.x).toBeCloseTo(-1.453, 3);
    expect(result[27].start.y).toBeCloseTo(-3.438, 3);
    expect(result[27].start.z).toBeCloseTo(4, 3);
    expect(result[27].end.x).toBeCloseTo(-1.502, 3);
    expect(result[27].end.y).toBeCloseTo(-1.872, 3);
    expect(result[27].end.z).toBeCloseTo(4, 3);
    expect(result[27].isExtrusion).toBe(true);
    expect(result[28].start.x).toBeCloseTo(-1.502, 3);
    expect(result[28].start.y).toBeCloseTo(-1.872, 3);
    expect(result[28].start.z).toBeCloseTo(4, 3);
    expect(result[28].end.x).toBeCloseTo(-1.144, 3);
    expect(result[28].end.y).toBeCloseTo(-0.347, 3);
    expect(result[28].end.z).toBeCloseTo(4, 3);
    expect(result[28].isExtrusion).toBe(true);
    expect(result[29].start.x).toBeCloseTo(-1.144, 3);
    expect(result[29].start.y).toBeCloseTo(-0.347, 3);
    expect(result[29].start.z).toBeCloseTo(4, 3);
    expect(result[29].end.x).toBeCloseTo(-0.404, 3);
    expect(result[29].end.y).toBeCloseTo(1.033, 3);
    expect(result[29].end.z).toBeCloseTo(4, 3);
    expect(result[29].isExtrusion).toBe(true);
    expect(result[30].start.x).toBeCloseTo(-0.404, 3);
    expect(result[30].start.y).toBeCloseTo(1.033, 3);
    expect(result[30].start.z).toBeCloseTo(4, 3);
    expect(result[30].end.x).toBeCloseTo(0.669, 3);
    expect(result[30].end.y).toBeCloseTo(2.175, 3);
    expect(result[30].end.z).toBeCloseTo(4, 3);
    expect(result[30].isExtrusion).toBe(true);
    expect(result[31].start.x).toBeCloseTo(0.669, 3);
    expect(result[31].start.y).toBeCloseTo(2.175, 3);
    expect(result[31].start.z).toBeCloseTo(4, 3);
    expect(result[31].end.x).toBeCloseTo(2, 3);
    expect(result[31].end.y).toBeCloseTo(3, 3);
    expect(result[31].end.z).toBeCloseTo(4, 3);
    expect(result[31].isExtrusion).toBe(true);
    // G3 P1 I2.4686 J-5.4686 E0.5
    expect(result[32].start.x).toBeCloseTo(2, 3);
    expect(result[32].start.y).toBeCloseTo(3, 3);
    expect(result[32].start.z).toBeCloseTo(4, 3);
    expect(result[32].end.x).toBeCloseTo(0.669, 3);
    expect(result[32].end.y).toBeCloseTo(2.175, 3);
    expect(result[32].end.z).toBeCloseTo(4, 3);
    expect(result[32].isExtrusion).toBe(true);
    expect(result[33].start.x).toBeCloseTo(0.669, 3);
    expect(result[33].start.y).toBeCloseTo(2.175, 3);
    expect(result[33].start.z).toBeCloseTo(4, 3);
    expect(result[33].end.x).toBeCloseTo(-0.404, 3);
    expect(result[33].end.y).toBeCloseTo(1.033, 3);
    expect(result[33].end.z).toBeCloseTo(4, 3);
    expect(result[33].isExtrusion).toBe(true);
    expect(result[34].start.x).toBeCloseTo(-0.404, 3);
    expect(result[34].start.y).toBeCloseTo(1.033, 3);
    expect(result[34].start.z).toBeCloseTo(4, 3);
    expect(result[34].end.x).toBeCloseTo(-1.144, 3);
    expect(result[34].end.y).toBeCloseTo(-0.347, 3);
    expect(result[34].end.z).toBeCloseTo(4, 3);
    expect(result[34].isExtrusion).toBe(true);
    expect(result[35].start.x).toBeCloseTo(-1.144, 3);
    expect(result[35].start.y).toBeCloseTo(-0.347, 3);
    expect(result[35].start.z).toBeCloseTo(4, 3);
    expect(result[35].end.x).toBeCloseTo(-1.502, 3);
    expect(result[35].end.y).toBeCloseTo(-1.872, 3);
    expect(result[35].end.z).toBeCloseTo(4, 3);
    expect(result[35].isExtrusion).toBe(true);
    expect(result[36].start.x).toBeCloseTo(-1.502, 3);
    expect(result[36].start.y).toBeCloseTo(-1.872, 3);
    expect(result[36].start.z).toBeCloseTo(4, 3);
    expect(result[36].end.x).toBeCloseTo(-1.453, 3);
    expect(result[36].end.y).toBeCloseTo(-3.438, 3);
    expect(result[36].end.z).toBeCloseTo(4, 3);
    expect(result[36].isExtrusion).toBe(true);
    expect(result[37].start.x).toBeCloseTo(-1.453, 3);
    expect(result[37].start.y).toBeCloseTo(-3.438, 3);
    expect(result[37].start.z).toBeCloseTo(4, 3);
    expect(result[37].end.x).toBeCloseTo(-1, 3);
    expect(result[37].end.y).toBeCloseTo(-4.937, 3);
    expect(result[37].end.z).toBeCloseTo(4, 3);
    expect(result[37].isExtrusion).toBe(true);
    expect(result[38].start.x).toBeCloseTo(-1, 3);
    expect(result[38].start.y).toBeCloseTo(-4.937, 3);
    expect(result[38].start.z).toBeCloseTo(4, 3);
    expect(result[38].end.x).toBeCloseTo(-0.175, 3);
    expect(result[38].end.y).toBeCloseTo(-6.268, 3);
    expect(result[38].end.z).toBeCloseTo(4, 3);
    expect(result[38].isExtrusion).toBe(true);
    expect(result[39].start.x).toBeCloseTo(-0.175, 3);
    expect(result[39].start.y).toBeCloseTo(-6.268, 3);
    expect(result[39].start.z).toBeCloseTo(4, 3);
    expect(result[39].end.x).toBeCloseTo(0.967, 3);
    expect(result[39].end.y).toBeCloseTo(-7.341, 3);
    expect(result[39].end.z).toBeCloseTo(4, 3);
    expect(result[39].isExtrusion).toBe(true);
    expect(result[40].start.x).toBeCloseTo(0.967, 3);
    expect(result[40].start.y).toBeCloseTo(-7.341, 3);
    expect(result[40].start.z).toBeCloseTo(4, 3);
    expect(result[40].end.x).toBeCloseTo(2.347, 3);
    expect(result[40].end.y).toBeCloseTo(-8.081, 3);
    expect(result[40].end.z).toBeCloseTo(4, 3);
    expect(result[40].isExtrusion).toBe(true);
    expect(result[41].start.x).toBeCloseTo(2.347, 3);
    expect(result[41].start.y).toBeCloseTo(-8.081, 3);
    expect(result[41].start.z).toBeCloseTo(4, 3);
    expect(result[41].end.x).toBeCloseTo(3.872, 3);
    expect(result[41].end.y).toBeCloseTo(-8.439, 3);
    expect(result[41].end.z).toBeCloseTo(4, 3);
    expect(result[41].isExtrusion).toBe(true);
    expect(result[42].start.x).toBeCloseTo(3.872, 3);
    expect(result[42].start.y).toBeCloseTo(-8.439, 3);
    expect(result[42].start.z).toBeCloseTo(4, 3);
    expect(result[42].end.x).toBeCloseTo(5.438, 3);
    expect(result[42].end.y).toBeCloseTo(-8.39, 3);
    expect(result[42].end.z).toBeCloseTo(4, 3);
    expect(result[42].isExtrusion).toBe(true);
    expect(result[43].start.x).toBeCloseTo(5.438, 3);
    expect(result[43].start.y).toBeCloseTo(-8.39, 3);
    expect(result[43].start.z).toBeCloseTo(4, 3);
    expect(result[43].end.x).toBeCloseTo(6.937, 3);
    expect(result[43].end.y).toBeCloseTo(-7.937, 3);
    expect(result[43].end.z).toBeCloseTo(4, 3);
    expect(result[43].isExtrusion).toBe(true);
    expect(result[44].start.x).toBeCloseTo(6.937, 3);
    expect(result[44].start.y).toBeCloseTo(-7.937, 3);
    expect(result[44].start.z).toBeCloseTo(4, 3);
    expect(result[44].end.x).toBeCloseTo(8.268, 3);
    expect(result[44].end.y).toBeCloseTo(-7.112, 3);
    expect(result[44].end.z).toBeCloseTo(4, 3);
    expect(result[44].isExtrusion).toBe(true);
    expect(result[45].start.x).toBeCloseTo(8.268, 3);
    expect(result[45].start.y).toBeCloseTo(-7.112, 3);
    expect(result[45].start.z).toBeCloseTo(4, 3);
    expect(result[45].end.x).toBeCloseTo(9.341, 3);
    expect(result[45].end.y).toBeCloseTo(-5.97, 3);
    expect(result[45].end.z).toBeCloseTo(4, 3);
    expect(result[45].isExtrusion).toBe(true);
    expect(result[46].start.x).toBeCloseTo(9.341, 3);
    expect(result[46].start.y).toBeCloseTo(-5.97, 3);
    expect(result[46].start.z).toBeCloseTo(4, 3);
    expect(result[46].end.x).toBeCloseTo(10.081, 3);
    expect(result[46].end.y).toBeCloseTo(-4.59, 3);
    expect(result[46].end.z).toBeCloseTo(4, 3);
    expect(result[46].isExtrusion).toBe(true);
    expect(result[47].start.x).toBeCloseTo(10.081, 3);
    expect(result[47].start.y).toBeCloseTo(-4.59, 3);
    expect(result[47].start.z).toBeCloseTo(4, 3);
    expect(result[47].end.x).toBeCloseTo(10.439, 3);
    expect(result[47].end.y).toBeCloseTo(-3.065, 3);
    expect(result[47].end.z).toBeCloseTo(4, 3);
    expect(result[47].isExtrusion).toBe(true);
    expect(result[48].start.x).toBeCloseTo(10.439, 3);
    expect(result[48].start.y).toBeCloseTo(-3.065, 3);
    expect(result[48].start.z).toBeCloseTo(4, 3);
    expect(result[48].end.x).toBeCloseTo(10.390, 3);
    expect(result[48].end.y).toBeCloseTo(-1.499, 3);
    expect(result[48].end.z).toBeCloseTo(4, 3);
    expect(result[48].isExtrusion).toBe(true);
    expect(result[49].start.x).toBeCloseTo(10.390, 3);
    expect(result[49].start.y).toBeCloseTo(-1.499, 3);
    expect(result[49].start.z).toBeCloseTo(4, 3);
    expect(result[49].end.x).toBeCloseTo(9.937, 3);
    expect(result[49].end.y).toBeCloseTo(0, 3);
    expect(result[49].end.z).toBeCloseTo(4, 3);
    expect(result[49].isExtrusion).toBe(true);
    expect(result[50].start.x).toBeCloseTo(9.937, 3);
    expect(result[50].start.y).toBeCloseTo(0, 3);
    expect(result[50].start.z).toBeCloseTo(4, 3);
    expect(result[50].end.x).toBeCloseTo(9.112, 3);
    expect(result[50].end.y).toBeCloseTo(1.331, 3);
    expect(result[50].end.z).toBeCloseTo(4, 3);
    expect(result[50].isExtrusion).toBe(true);
    expect(result[51].start.x).toBeCloseTo(9.112, 3);
    expect(result[51].start.y).toBeCloseTo(1.331, 3);
    expect(result[51].start.z).toBeCloseTo(4, 3);
    expect(result[51].end.x).toBeCloseTo(7.97, 3);
    expect(result[51].end.y).toBeCloseTo(2.404, 3);
    expect(result[51].end.z).toBeCloseTo(4, 3);
    expect(result[51].isExtrusion).toBe(true);
    expect(result[52].start.x).toBeCloseTo(7.97, 3);
    expect(result[52].start.y).toBeCloseTo(2.404, 3);
    expect(result[52].start.z).toBeCloseTo(4, 3);
    expect(result[52].end.x).toBeCloseTo(6.59, 3);
    expect(result[52].end.y).toBeCloseTo(3.144, 3);
    expect(result[52].end.z).toBeCloseTo(4, 3);
    expect(result[52].isExtrusion).toBe(true);
    expect(result[53].start.x).toBeCloseTo(6.59, 3);
    expect(result[53].start.y).toBeCloseTo(3.144, 3);
    expect(result[53].start.z).toBeCloseTo(4, 3);
    expect(result[53].end.x).toBeCloseTo(5.065, 3);
    expect(result[53].end.y).toBeCloseTo(3.502, 3);
    expect(result[53].end.z).toBeCloseTo(4, 3);
    expect(result[53].isExtrusion).toBe(true);
    expect(result[54].start.x).toBeCloseTo(5.065, 3);
    expect(result[54].start.y).toBeCloseTo(3.502, 3);
    expect(result[54].start.z).toBeCloseTo(4, 3);
    expect(result[54].end.x).toBeCloseTo(3.499, 3);
    expect(result[54].end.y).toBeCloseTo(3.453, 3);
    expect(result[54].end.z).toBeCloseTo(4, 3);
    expect(result[54].isExtrusion).toBe(true);
    expect(result[55].start.x).toBeCloseTo(3.499, 3);
    expect(result[55].start.y).toBeCloseTo(3.453, 3);
    expect(result[55].start.z).toBeCloseTo(4, 3);
    expect(result[55].end.x).toBeCloseTo(2, 3);
    expect(result[55].end.y).toBeCloseTo(3, 3);
    expect(result[55].end.z).toBeCloseTo(4, 3);
    expect(result[55].isExtrusion).toBe(true);
  });
});

describe('makePoint', () => {
  it('should parse G0 command', () => {
    const command: LinearMovementCommand = {
      command: 'G0',
      parameters: { x: 10, y: 20, z: 3 }
    };
    const result = makePoint({ x: 1, y: 2, z: 3 }, command);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ x: 10, y: 20, z: 3 });
  });

  it('should parse G1 command', () => {
    const command: LinearMovementCommand = {
      command: 'G1',
      parameters: { x: 10, y: 20, z: 3, e: 1.5 }
    };
    const result = makePoint({ x: 1, y: 2, z: 3 }, command);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ x: 10, y: 20, z: 3 });
  });

  it('should parse G2 command', () => {
    const command: ArcMovementCommand = {
      command: 'G2',
      parameters: { x: 5, y: 6, z: 4, i: 5.4686, j: -2.4686, r: 3 }
    };
    const result = makePoint({ x: 2, y: 3, z: 4 }, command);
    expect(result).toHaveLength(3);
    expect(result[0].x).toBeCloseTo(2.747, 3);
    expect(result[0].y).toBeCloseTo(4.233, 3);
    expect(result[0].z).toBeCloseTo(4, 3);
    expect(result[1].x).toBeCloseTo(3.767, 3);
    expect(result[1].y).toBeCloseTo(5.253, 3);
    expect(result[1].z).toBeCloseTo(4, 3);
    expect(result[2].x).toBeCloseTo(5, 3);
    expect(result[2].y).toBeCloseTo(6, 3);
    expect(result[2].z).toBeCloseTo(4, 3);
  });

  it('should parse G2 real command', () => {
    const command: ArcMovementCommand = {
      command: 'G2',
      parameters: { x: 5, y: 6, z: 4, i: 5.4686, j: -2.4686, r: 3 }
    };
    const result = makePoint({ x: 2, y: 3, z: 4 }, command);
    expect(result).toHaveLength(3);
    expect(result[0].x).toBeCloseTo(2.747, 3);
    expect(result[0].y).toBeCloseTo(4.233, 3);
    expect(result[0].z).toBeCloseTo(4, 3);
    expect(result[1].x).toBeCloseTo(3.767, 3);
    expect(result[1].y).toBeCloseTo(5.253, 3);
    expect(result[1].z).toBeCloseTo(4, 3);
    expect(result[2].x).toBeCloseTo(5, 3);
    expect(result[2].y).toBeCloseTo(6, 3);
    expect(result[2].z).toBeCloseTo(4, 3);
  });

  it('should parse G3 command', () => {
    const command: ArcMovementCommand = {
      command: 'G3',
      parameters: { x: 2, y: 3, z: 4, i: 2.4686, j: -5.4686, r: 3 }
    };
    const result = makePoint({ x: 5, y: 6, z: 4 }, command);
    expect(result).toHaveLength(3);
    expect(result[0].x).toBeCloseTo(3.767, 3);
    expect(result[0].y).toBeCloseTo(5.253, 3);
    expect(result[0].z).toBeCloseTo(4, 3);
    expect(result[1].x).toBeCloseTo(2.747, 3);
    expect(result[1].y).toBeCloseTo(4.233, 3);
    expect(result[1].z).toBeCloseTo(4, 3);
    expect(result[2].x).toBeCloseTo(2, 3);
    expect(result[2].y).toBeCloseTo(3, 3);
    expect(result[2].z).toBeCloseTo(4, 3);
  });
});

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
