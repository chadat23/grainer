export interface Vertex {
  x: number;
  y: number;
  z: number;
}

export interface ToolPath {
  start: Vertex;
  end: Vertex;
  isExtrusion: boolean;
}
