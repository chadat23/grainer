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

//type SetTempTypes = "M104" | "M109";
const SetTempTypes = ["M104", "M109"] as const;
type SetTempType = (typeof SetTempTypes)[number];

export interface SetTemp {
  type: SetTempType;
  s: number; // Temperature value
}

export interface Command {
  lineNumber: number;
  toolPath?: ToolPath;
  setTemp?: SetTemp;
}
