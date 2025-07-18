import { Command } from '@/types/command';

export interface ColorizerInput {
  commands: Command[];
  accentSliders?: {
    accentNumb: number;
    accentLayer: number;
    accentTemp: number;
  }[];
  defaultColor?: string;
  minColor: string;
  maxColor: string;
  // Additional properties that different colorizers might need
  [key: string]: any;
}

export interface ColorizerOutput {
  lineColors: Map<number, number>; // lineNumber -> hex color
}

export abstract class BaseColorizer {
  abstract calculateColors(input: ColorizerInput): ColorizerOutput;
} 