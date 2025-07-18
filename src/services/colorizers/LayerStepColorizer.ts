import { Command } from '@/types/command';
import { BaseColorizer, ColorizerInput, ColorizerOutput } from './BaseColorizer';

export class LayerColorizer extends BaseColorizer {
  calculateColors(input: ColorizerInput): ColorizerOutput {
    const lineColors = new Map<number, number>();
    
    // Calculate the min and max Z values
    var provisionalMinZ: number | undefined = undefined;
    var provisionalMaxZ: number | undefined = undefined;
    input.commands.forEach((command) => {
      if (command.toolPath) {
        if (provisionalMinZ === undefined || command.toolPath.start.z < provisionalMinZ) {
          provisionalMinZ = command.toolPath.start.z;
        }
        if (provisionalMaxZ === undefined || command.toolPath.start.z > provisionalMaxZ) {
          provisionalMaxZ = command.toolPath.start.z;
        }
      }
    });
    if (provisionalMinZ === undefined || provisionalMaxZ === undefined) {
      provisionalMinZ = 0;
      provisionalMaxZ = 1;
    }
    const minZ = provisionalMinZ!;
    const maxZ = provisionalMaxZ!;

    // Get the min and max temp from the accent sliders
    const minTemp = input.accentSliders.reduce((min, slider) => Math.min(min, slider.accentTemp), Infinity);
    const maxTemp = input.accentSliders.reduce((max, slider) => Math.max(max, slider.accentTemp), -Infinity);

    const defaultColorInt = parseInt(input.defaultColor.slice(1), 16);
    const minColorInt = parseInt(input.minColor.slice(1), 16);
    const maxColorInt = parseInt(input.maxColor.slice(1), 16);

    var accentIndex = 0;

    // Calculate colors for each command
    input.commands.forEach((command) => {
      if (command.toolPath) {
        // Calculate color for this path (same logic as before)
        let color = 0x99FF99;
        if (command.toolPath.start.z * 5 - 0.05 < input.accentSliders[accentIndex]?.accentLayer) {
          color = 0xA52A2A;
        }

        lineColors.set(command.lineNumber, color);
      }
    });

    return { lineColors };
  }
} 