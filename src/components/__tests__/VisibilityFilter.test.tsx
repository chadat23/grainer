import { describe, it, expect } from '@jest/globals';
import { ToolPath, Vertex } from '@/types/command';
import { aboutEqual, isAdjacent, findToolPathLoops, perimeterLoops } from '../VisibilityFilter';

describe('perimeterLoops', () => {
  it('should return the outermost and innermost loops', () => {
    const loops: ToolPath[][] = [[
      { start: { x: 0, y: 0, z: 0 }, end: { x: 8, y: 0, z: 0 }, isExtrusion: true },
      { start: { x: 8, y: 0, z: 0 }, end: { x: 8, y: 8, z: 0 }, isExtrusion: true },
      { start: { x: 8, y: 8, z: 0 }, end: { x: 0, y: 8, z: 0 }, isExtrusion: true },
      { start: { x: 0, y: 8, z: 0 }, end: { x: 0, y: 0, z: 0 }, isExtrusion: true },
    ], [
      { start: { x: 1, y: 1, z: 0 }, end: { x: 2, y: 1, z: 0 }, isExtrusion: true },
      { start: { x: 2, y: 1, z: 0 }, end: { x: 2, y: 2, z: 0 }, isExtrusion: true },
      { start: { x: 2, y: 2, z: 0 }, end: { x: 1, y: 2, z: 0 }, isExtrusion: true },
      { start: { x: 1, y: 2, z: 0 }, end: { x: 1, y: 1, z: 0 }, isExtrusion: true },
    ], [
      { start: { x: 3, y: 1, z: 0 }, end: { x: 6, y: 1, z: 0 }, isExtrusion: true },
      { start: { x: 6, y: 1, z: 0 }, end: { x: 6, y: 4, z: 0 }, isExtrusion: true },
      { start: { x: 6, y: 4, z: 0 }, end: { x: 3, y: 4, z: 0 }, isExtrusion: true },
      { start: { x: 3, y: 4, z: 0 }, end: { x: 3, y: 1, z: 0 }, isExtrusion: true },
    ], [
      { start: { x: 4, y: 2, z: 0 }, end: { x: 5, y: 2, z: 0 }, isExtrusion: true },
      { start: { x: 5, y: 2, z: 0 }, end: { x: 5, y: 3, z: 0 }, isExtrusion: true },
      { start: { x: 5, y: 3, z: 0 }, end: { x: 4, y: 3, z: 0 }, isExtrusion: true },
      { start: { x: 4, y: 3, z: 0 }, end: { x: 4, y: 2, z: 0 }, isExtrusion: true },
    ]];

    const { outermost, innermost } = {
      outermost: [
        { start: { x: 0, y: 0, z: 0 }, end: { x: 8, y: 0, z: 0 }, isExtrusion: true },
        { start: { x: 8, y: 0, z: 0 }, end: { x: 8, y: 8, z: 0 }, isExtrusion: true },
        { start: { x: 8, y: 8, z: 0 }, end: { x: 0, y: 8, z: 0 }, isExtrusion: true },
        { start: { x: 0, y: 8, z: 0 }, end: { x: 0, y: 0, z: 0 }, isExtrusion: true },
      ],
      innermost: [[
        { start: { x: 1, y: 1, z: 0 }, end: { x: 2, y: 1, z: 0 }, isExtrusion: true },
        { start: { x: 2, y: 1, z: 0 }, end: { x: 2, y: 2, z: 0 }, isExtrusion: true },
        { start: { x: 2, y: 2, z: 0 }, end: { x: 1, y: 2, z: 0 }, isExtrusion: true },
        { start: { x: 1, y: 2, z: 0 }, end: { x: 1, y: 1, z: 0 }, isExtrusion: true },
      ], [
        { start: { x: 4, y: 2, z: 0 }, end: { x: 5, y: 2, z: 0 }, isExtrusion: true },
        { start: { x: 5, y: 2, z: 0 }, end: { x: 5, y: 3, z: 0 }, isExtrusion: true },
        { start: { x: 5, y: 3, z: 0 }, end: { x: 4, y: 3, z: 0 }, isExtrusion: true },
        { start: { x: 4, y: 3, z: 0 }, end: { x: 4, y: 2, z: 0 }, isExtrusion: true },
      ]]
    };

    const { outermost: actualOutermost, innermost: actualInnermost } = perimeterLoops(loops, 0.00001);

    expect(actualOutermost).toEqual(outermost);
    expect(actualInnermost).toHaveLength(2);
    expect(actualInnermost[0]).toEqual(innermost[0]);
    expect(actualInnermost[1]).toEqual(innermost[1]);
  });
});

describe('findToolPathLoops', () => {
  it('should return an empty array since there are no loops, all jogs', () => {
    const toolPaths: ToolPath[] = [
      { start: { x: 0, y: 0, z: 0 }, end: { x: 1, y: 0, z: 0 }, isExtrusion: false },
      { start: { x: 1, y: 0, z: 0 }, end: { x: 1, y: 1, z: 0 }, isExtrusion: false },
      { start: { x: 1, y: 1, z: 0 }, end: { x: 0, y: 1, z: 0 }, isExtrusion: false },
      { start: { x: 0, y: 1, z: 0 }, end: { x: 0, y: 0, z: 0 }, isExtrusion: false },
    ];
    const loops: ToolPath[][] = [];
    expect(findToolPathLoops(toolPaths)).toEqual(loops);
  });

  it('should return itself since its just a loop', () => {
    const toolPaths: ToolPath[] = [
      { start: { x: 0, y: 0, z: 0 }, end: { x: 1, y: 0, z: 0 }, isExtrusion: true },
      { start: { x: 1, y: 0, z: 0 }, end: { x: 1, y: 1, z: 0 }, isExtrusion: true },
      { start: { x: 1, y: 1, z: 0 }, end: { x: 0, y: 1, z: 0 }, isExtrusion: true },
      { start: { x: 0, y: 1, z: 0 }, end: { x: 0, y: 0, z: 0 }, isExtrusion: true },
    ];
    const loops: ToolPath[][] = [[
      { start: { x: 0, y: 0, z: 0 }, end: { x: 1, y: 0, z: 0 }, isExtrusion: true },
      { start: { x: 1, y: 0, z: 0 }, end: { x: 1, y: 1, z: 0 }, isExtrusion: true },
      { start: { x: 1, y: 1, z: 0 }, end: { x: 0, y: 1, z: 0 }, isExtrusion: true },
      { start: { x: 0, y: 1, z: 0 }, end: { x: 0, y: 0, z: 0 }, isExtrusion: true },
    ]];
    expect(findToolPathLoops(toolPaths)).toEqual(loops);
  });

  it('should strip the leading jog', () => {
    const toolPaths: ToolPath[] = [
      { start: { x: 1, y: 0, z: 0 }, end: { x: 0, y: 0, z: 0 }, isExtrusion: false },
      { start: { x: 0, y: 0, z: 0 }, end: { x: 1, y: 0, z: 0 }, isExtrusion: true },
      { start: { x: 1, y: 0, z: 0 }, end: { x: 1, y: 1, z: 0 }, isExtrusion: true },
      { start: { x: 1, y: 1, z: 0 }, end: { x: 0, y: 1, z: 0 }, isExtrusion: true },
      { start: { x: 0, y: 1, z: 0 }, end: { x: 0, y: 0, z: 0 }, isExtrusion: true },
    ];
    const loops: ToolPath[][] = [[
      { start: { x: 0, y: 0, z: 0 }, end: { x: 1, y: 0, z: 0 }, isExtrusion: true },
      { start: { x: 1, y: 0, z: 0 }, end: { x: 1, y: 1, z: 0 }, isExtrusion: true },
      { start: { x: 1, y: 1, z: 0 }, end: { x: 0, y: 1, z: 0 }, isExtrusion: true },
      { start: { x: 0, y: 1, z: 0 }, end: { x: 0, y: 0, z: 0 }, isExtrusion: true },
    ]];
    expect(findToolPathLoops(toolPaths)).toEqual(loops);
  });

  it('should strip the trailing jog', () => {
    const toolPaths: ToolPath[] = [
      { start: { x: 1, y: 0, z: 0 }, end: { x: 0, y: 0, z: 0 }, isExtrusion: false },
      { start: { x: 0, y: 0, z: 0 }, end: { x: 1, y: 0, z: 0 }, isExtrusion: true },
      { start: { x: 1, y: 0, z: 0 }, end: { x: 1, y: 1, z: 0 }, isExtrusion: true },
      { start: { x: 1, y: 1, z: 0 }, end: { x: 0, y: 1, z: 0 }, isExtrusion: true },
      { start: { x: 0, y: 1, z: 0 }, end: { x: 0, y: 0, z: 0 }, isExtrusion: true },
      { start: { x: 0, y: 0, z: 0 }, end: { x: 0, y: 0, z: 2 }, isExtrusion: false },
    ];
    const loops: ToolPath[][] = [[
      { start: { x: 0, y: 0, z: 0 }, end: { x: 1, y: 0, z: 0 }, isExtrusion: true },
      { start: { x: 1, y: 0, z: 0 }, end: { x: 1, y: 1, z: 0 }, isExtrusion: true },
      { start: { x: 1, y: 1, z: 0 }, end: { x: 0, y: 1, z: 0 }, isExtrusion: true },
      { start: { x: 0, y: 1, z: 0 }, end: { x: 0, y: 0, z: 0 }, isExtrusion: true },
    ]];
    expect(findToolPathLoops(toolPaths)).toEqual(loops);
  });

  it('should ignore the trailing random extrusions', () => {
    const toolPaths: ToolPath[] = [
      { start: { x: 1, y: 0, z: 0 }, end: { x: 0, y: 0, z: 0 }, isExtrusion: false },
      { start: { x: 0, y: 0, z: 0 }, end: { x: 8, y: 0, z: 0 }, isExtrusion: true },
      { start: { x: 8, y: 0, z: 0 }, end: { x: 8, y: 8, z: 0 }, isExtrusion: true },
      { start: { x: 8, y: 8, z: 0 }, end: { x: 0, y: 8, z: 0 }, isExtrusion: true },
      { start: { x: 0, y: 8, z: 0 }, end: { x: 0, y: 0, z: 0 }, isExtrusion: true },
      { start: { x: 0, y: 0, z: 0 }, end: { x: 1, y: 1, z: 0 }, isExtrusion: false },
      { start: { x: 1, y: 1, z: 0 }, end: { x: 2, y: 1, z: 0 }, isExtrusion: true },
      { start: { x: 2, y: 1, z: 0 }, end: { x: 2, y: 2, z: 0 }, isExtrusion: true },
    ];
    const loops: ToolPath[][] = [[
      { start: { x: 0, y: 0, z: 0 }, end: { x: 8, y: 0, z: 0 }, isExtrusion: true },
      { start: { x: 8, y: 0, z: 0 }, end: { x: 8, y: 8, z: 0 }, isExtrusion: true },
      { start: { x: 8, y: 8, z: 0 }, end: { x: 0, y: 8, z: 0 }, isExtrusion: true },
      { start: { x: 0, y: 8, z: 0 }, end: { x: 0, y: 0, z: 0 }, isExtrusion: true },
    ]];
    expect(findToolPathLoops(toolPaths)).toEqual(loops);
  });

  it('should ignore the trailing random extrusions, and add additional loops', () => {
    const toolPaths: ToolPath[] = [
      { start: { x: 1, y: 0, z: 0 }, end: { x: 0, y: 0, z: 0 }, isExtrusion: false },
      { start: { x: 0, y: 0, z: 0 }, end: { x: 8, y: 0, z: 0 }, isExtrusion: true },
      { start: { x: 8, y: 0, z: 0 }, end: { x: 8, y: 8, z: 0 }, isExtrusion: true },
      { start: { x: 8, y: 8, z: 0 }, end: { x: 0, y: 8, z: 0 }, isExtrusion: true },
      { start: { x: 0, y: 8, z: 0 }, end: { x: 0, y: 0, z: 0 }, isExtrusion: true },
      { start: { x: 0, y: 0, z: 0 }, end: { x: 1, y: 1, z: 0 }, isExtrusion: false },
      { start: { x: 1, y: 1, z: 0 }, end: { x: 2, y: 1, z: 0 }, isExtrusion: true },
      { start: { x: 2, y: 1, z: 0 }, end: { x: 2, y: 2, z: 0 }, isExtrusion: true },
      { start: { x: 2, y: 2, z: 0 }, end: { x: 1, y: 2, z: 0 }, isExtrusion: true },
      { start: { x: 1, y: 2, z: 0 }, end: { x: 1, y: 1, z: 0 }, isExtrusion: true },
      { start: { x: 1, y: 1, z: 0 }, end: { x: 1, y: 4, z: 0 }, isExtrusion: false },
      { start: { x: 1, y: 4, z: 0 }, end: { x: 4, y: 4, z: 0 }, isExtrusion: true },
      { start: { x: 4, y: 4, z: 0 }, end: { x: 4, y: 2, z: 0 }, isExtrusion: true },
      { start: { x: 4, y: 2, z: 0 }, end: { x: 3, y: 1, z: 0 }, isExtrusion: false },
      { start: { x: 3, y: 1, z: 0 }, end: { x: 6, y: 1, z: 0 }, isExtrusion: true },
      { start: { x: 6, y: 1, z: 0 }, end: { x: 6, y: 4, z: 0 }, isExtrusion: true },
      { start: { x: 6, y: 4, z: 0 }, end: { x: 3, y: 4, z: 0 }, isExtrusion: true },
      { start: { x: 3, y: 4, z: 0 }, end: { x: 3, y: 1, z: 0 }, isExtrusion: true },
      { start: { x: 3, y: 1, z: 0 }, end: { x: 4, y: 2, z: 0 }, isExtrusion: false },
      { start: { x: 4, y: 2, z: 0 }, end: { x: 5, y: 2, z: 0 }, isExtrusion: true },
      { start: { x: 5, y: 2, z: 0 }, end: { x: 5, y: 3, z: 0 }, isExtrusion: true },
      { start: { x: 5, y: 3, z: 0 }, end: { x: 4, y: 3, z: 0 }, isExtrusion: true },
      { start: { x: 4, y: 3, z: 0 }, end: { x: 4, y: 2, z: 0 }, isExtrusion: true },
    ];
    const loops: ToolPath[][] = [[
      { start: { x: 0, y: 0, z: 0 }, end: { x: 8, y: 0, z: 0 }, isExtrusion: true },
      { start: { x: 8, y: 0, z: 0 }, end: { x: 8, y: 8, z: 0 }, isExtrusion: true },
      { start: { x: 8, y: 8, z: 0 }, end: { x: 0, y: 8, z: 0 }, isExtrusion: true },
      { start: { x: 0, y: 8, z: 0 }, end: { x: 0, y: 0, z: 0 }, isExtrusion: true },
    ], [
      { start: { x: 1, y: 1, z: 0 }, end: { x: 2, y: 1, z: 0 }, isExtrusion: true },
      { start: { x: 2, y: 1, z: 0 }, end: { x: 2, y: 2, z: 0 }, isExtrusion: true },
      { start: { x: 2, y: 2, z: 0 }, end: { x: 1, y: 2, z: 0 }, isExtrusion: true },
      { start: { x: 1, y: 2, z: 0 }, end: { x: 1, y: 1, z: 0 }, isExtrusion: true },
    ], [
      { start: { x: 3, y: 1, z: 0 }, end: { x: 6, y: 1, z: 0 }, isExtrusion: true },
      { start: { x: 6, y: 1, z: 0 }, end: { x: 6, y: 4, z: 0 }, isExtrusion: true },
      { start: { x: 6, y: 4, z: 0 }, end: { x: 3, y: 4, z: 0 }, isExtrusion: true },
      { start: { x: 3, y: 4, z: 0 }, end: { x: 3, y: 1, z: 0 }, isExtrusion: true },
    ], [
      { start: { x: 4, y: 2, z: 0 }, end: { x: 5, y: 2, z: 0 }, isExtrusion: true },
      { start: { x: 5, y: 2, z: 0 }, end: { x: 5, y: 3, z: 0 }, isExtrusion: true },
      { start: { x: 5, y: 3, z: 0 }, end: { x: 4, y: 3, z: 0 }, isExtrusion: true },
      { start: { x: 4, y: 3, z: 0 }, end: { x: 4, y: 2, z: 0 }, isExtrusion: true },
    ]];
    expect(findToolPathLoops(toolPaths)).toEqual(loops);
  });
});

describe('VisibilityFilter', () => {
  // isAdjacent
  it('should return false, vertex above the tool path', () => {
    const vertex: Vertex = { x: 1, y: 3, z: 3 };
    const toolPath: ToolPath = { start: { x: 1, y: 2, z: 3 }, end: { x: 1, y: 0, z: 3 }, isExtrusion: true };
    expect(isAdjacent(vertex, toolPath)).toBe(false);
  });

  it('should return true, vertex left of/adjascent to the start point of the tool path', () => {
    const vertex: Vertex = { x: 0, y: 2, z: 3 };
    const toolPath: ToolPath = { start: { x: 1, y: 2, z: 3 }, end: { x: 1, y: 3, z: 3 }, isExtrusion: true };
    expect(isAdjacent(vertex, toolPath)).toBe(true);
  });

  it('should return false, vertex to the right of/adjascent to the start point of the tool path', () => {
    const vertex: Vertex = { x: 2, y: 2, z: 3 };
    const toolPath: ToolPath = { start: { x: 1, y: 2, z: 3 }, end: { x: 1, y: 3, z: 3 }, isExtrusion: true };
    expect(isAdjacent(vertex, toolPath)).toBe(false);
  });

  it('should return true, vertex to the left of/adjascent to the segment, vertical tool path', () => {
    const vertex: Vertex = { x: 0, y: 2.5, z: 3 };
    const toolPath: ToolPath = { start: { x: 1, y: 2, z: 3 }, end: { x: 1, y: 3, z: 3 }, isExtrusion: true };
    expect(isAdjacent(vertex, toolPath)).toBe(true);
  });

  it('should return false, vertex to the right of/adjascent to the segment, vertical tool path', () => {
    const vertex: Vertex = { x: 2, y: 2.5, z: 3 };
    const toolPath: ToolPath = { start: { x: 1, y: 2, z: 3 }, end: { x: 1, y: 3, z: 3 }, isExtrusion: true };
    expect(isAdjacent(vertex, toolPath)).toBe(false);
  });

  it('should return true, vertex to the left of/adjascent to the segment, positive slope tool path', () => {
    const vertex: Vertex = { x: 0, y: 2.5, z: 3 };
    const toolPath: ToolPath = { start: { x: 1, y: 2, z: 3 }, end: { x: 2, y: 3, z: 3 }, isExtrusion: true };
    expect(isAdjacent(vertex, toolPath)).toBe(true);
  });

  it('should return false, vertex to the right of/adjascent to the segment, positive slope tool path', () => {
    const vertex: Vertex = { x: 2, y: 2.5, z: 3 };
    const toolPath: ToolPath = { start: { x: 1, y: 2, z: 3 }, end: { x: 2, y: 3, z: 3 }, isExtrusion: true };
    expect(isAdjacent(vertex, toolPath)).toBe(false);
  });

  it('should return true, vertex to the left of/adjascent to the segment, negative slope tool path', () => {
    const vertex: Vertex = { x: 0, y: 2.5, z: 3 };
    const toolPath: ToolPath = { start: { x: 2, y: 2, z: 3 }, end: { x: 1, y: 3, z: 3 }, isExtrusion: true };
    expect(isAdjacent(vertex, toolPath)).toBe(true);
  });

  it('should return false, vertex to the right of/adjascent to the segment, negative slope tool path', () => {
    const vertex: Vertex = { x: 2, y: 2.5, z: 3 };
    const toolPath: ToolPath = { start: { x: 2, y: 2, z: 3 }, end: { x: 1, y: 3, z: 3 }, isExtrusion: true };
    expect(isAdjacent(vertex, toolPath)).toBe(false);
  });

  it('should return false, vertex left of, adjascent to the end point of the tool path', () => {
    const vertex: Vertex = { x: 1, y: 2, z: 3 };
    const toolPath: ToolPath = { start: { x: 1, y: 3, z: 3 }, end: { x: 1, y: 2, z: 3 }, isExtrusion: true };
    expect(isAdjacent(vertex, toolPath)).toBe(false);
  });

  // aboutEqual
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
});