import { Command } from '@/types/command';

export interface TempGeneratorInput {
  commands: Command[];
  accentSliders?: {
    accentNumb: number;
    accentLayer: number;
    accentTemp: number;
  }[];
  minTemp: number;
  nominalDarkTemp: number;
  maxDarkTemp: number;
  // Additional properties that different colorizers might need
  [key: string]: any;
}

export interface TempGeneratorOutput {
  lineTemps: Map<number, number>; // lineNumber -> temp
}

export abstract class BaseTempGenerator {
  abstract calculateTemps(input: TempGeneratorInput): TempGeneratorOutput;
} 