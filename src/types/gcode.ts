// Base interface for all G-code commands
export interface GCodeCommand {
  command: string;
  parameters: Record<string, number | string | boolean | undefined>;
  lineNumber: number;
}

// Movement commands (G0, G1)
export interface LinearMovementCommand extends GCodeCommand {
  command: 'G0' | 'G1';
  parameters: {
    x?: number;
    y?: number;
    z?: number;
    e?: number;
    f?: number;
    [key: string]: number | string | boolean | undefined;
  };
}

// Movement commands (G2, G3)
export interface ArcMovementCommand extends GCodeCommand {
  command: 'G2' | 'G3';
  parameters: {
    x?: number;
    y?: number;
    z?: number;
    i?: number;
    j?: number;
    r?: number;
    p?: number;
    e?: number;
    f?: number;
    [key: string]: number | string | boolean | undefined;
  };
}

// Temperature commands (M104, M109)
// TODO: make work for stuff other than S such as T and P
export interface TemperatureCommand extends GCodeCommand {
  command: 'M104' | 'M109';
  parameters: {
    s?: number;  // Set temperature
    [key: string]: number | string | boolean | undefined;
  };
}

// Type guard functions to check command types
export function isLinearMovementCommand(cmd: GCodeCommand): cmd is LinearMovementCommand {
  return cmd.command === 'G0' || cmd.command === 'G1';
}

export function isArcMovementCommand(cmd: GCodeCommand): cmd is ArcMovementCommand {
  return cmd.command === 'G2' || cmd.command === 'G3';
}

export function isMovementCommand(cmd: GCodeCommand): cmd is LinearMovementCommand | ArcMovementCommand {
  return isLinearMovementCommand(cmd) || isArcMovementCommand(cmd);
}

export function isTemperatureCommand(cmd: GCodeCommand): cmd is TemperatureCommand {
  return cmd.command === 'M104' || cmd.command === 'M109';
}
