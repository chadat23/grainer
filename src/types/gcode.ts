// Base interface for all G-code commands
export interface GCodeCommand {
  command: string;
  parameters: Record<string, number | string | boolean | undefined>;
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
export interface TemperatureCommand extends GCodeCommand {
  command: 'M104' | 'M109';
  parameters: {
    s?: number;  // Set temperature
    p?: number;  // Tool index
    [key: string]: number | string | boolean | undefined;
  };
}

// Fan commands (M106, M107)
export interface FanCommand extends GCodeCommand {
  command: 'M106' | 'M107';
  parameters: {
    s?: number;  // Fan speed
    p?: number;  // Fan index
    [key: string]: number | string | boolean | undefined;
  };
}

// Bed leveling commands (G29)
export interface BedLevelingCommand extends GCodeCommand {
  command: 'G29';
  parameters: {
    [key: string]: number | string | boolean | undefined;
  };
}

// Home commands (G28)
export interface HomeCommand extends GCodeCommand {
  command: 'G28';
  parameters: {
    x?: boolean;
    y?: boolean;
    z?: boolean;
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

export function isTemperatureCommand(cmd: GCodeCommand): cmd is TemperatureCommand {
  return cmd.command === 'M104' || cmd.command === 'M109';
}

export function isFanCommand(cmd: GCodeCommand): cmd is FanCommand {
  return cmd.command === 'M106' || cmd.command === 'M107';
}

export function isBedLevelingCommand(cmd: GCodeCommand): cmd is BedLevelingCommand {
  return cmd.command === 'G29';
}

export function isHomeCommand(cmd: GCodeCommand): cmd is HomeCommand {
  return cmd.command === 'G28';
} 