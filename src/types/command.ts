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

export interface SetTemp {
  s: number; // Temperature value
}

export interface Command {
  lineNumber: number;
  toolPath?: ToolPath;
  setTemp?: SetTemp;
}
