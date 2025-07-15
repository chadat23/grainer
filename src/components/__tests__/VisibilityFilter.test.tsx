import { describe, it, expect } from '@jest/globals';
import { ToolPath, Vertex } from '@/types/spatial';
import { aboutEqual, isAdjacent } from '../VisibilityFilter';

describe('VisibilityFilter', () => {
  it('should return true if the vertices are about equal', () => {
    const vertex1: Vertex = { x: 1, y: 2, z: 3 };
    const vertex2: Vertex = { x: 1.0001, y: 2.0001, z: 3.0001 };
    const delta = 0.001;
    expect(aboutEqual(vertex1, vertex2, delta)).toBe(true);
  });

  it('should return false if the vertices are not about equal', () => {
    const vertex1: Vertex = { x: 1, y: 2, z: 3 };
    const vertex2: Vertex = { x: 1.0001, y: 2.0001, z: 3.0001 };
    const delta = 0.00001;
    expect(aboutEqual(vertex1, vertex2, delta)).toBe(false);
  });

  it('should return true, vertex left of, adjascent to the start point of the tool path', () => {
    const vertex: Vertex = { x: 1, y: 2, z: 3 };
    const toolPath: ToolPath = { start: { x: 1, y: 2, z: 3 }, end: { x: 1, y: 3, z: 3 }, isExtrusion: true };
    expect(isAdjacent(vertex, toolPath)).toBe(true);
  });

  it('should return false, vertex left of, adjascent to the end point of the tool path', () => {
    const vertex: Vertex = { x: 1, y: 2, z: 3 };
    const toolPath: ToolPath = { start: { x: 1, y: 3, z: 3 }, end: { x: 1, y: 2, z: 3 }, isExtrusion: true };
    expect(isAdjacent(vertex, toolPath)).toBe(false);
  });
});