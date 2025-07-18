import { Command } from '@/types/command';
import { BaseColorizer, ColorizerInput, ColorizerOutput } from './BaseColorizer';
import { SeedableRandom } from '@/utils/random';
import { colorInterpolate } from '@/utils/color';

export class LayerColorizer extends BaseColorizer {
  calculateColors(input: ColorizerInput): ColorizerOutput {
    const lineColors = new Map<number, number>();
    
    const lightNominalWidth = input.lightNominalWidth || 10;
    const lightWidthStandardDeviation = input.lightWidthStandardDeviation || 3;
    const darkNominalWidth = input.darkNominalWidth || 1;
    const darkWidthStandardDeviation = input.darkWidthStandardDeviation || 1;
    const darkColorDeviation = 0.2; // Much smaller deviation
    const transitionNominalWidth = input.transitionNominalWidth || 2;
    const transitionStandardDeviation = input.transitionStandardDeviation || 0.5;

    // Convert minColor string to hex number for the light color
    const lightColor = parseInt(input.minColor.replace('#', ''), 16);
    // Convert maxColor string to hex number for the dark color
    const darkColor = parseInt(input.maxColor.replace('#', ''), 16);
    const scaledDarkColorDeviation = darkColorDeviation; // Use the deviation directly
    
    const seed = input.seed || 2; // Use the seed from input
    const rng = new SeedableRandom(seed);

    const maxHeight = input.commands.reduce((max, command) => Math.max(max, command.toolPath?.start.z || 0), 0);
    var heights: [number, number, number, number, number][] = [];
    heights.push([0, rng.nextNormalClamped(lightNominalWidth, lightWidthStandardDeviation, 0, 1e6), 0, lightColor, 0]);
    while (heights[heights.length - 1][0] < maxHeight) {
      // Light to dark transition
      heights.push([
        heights[heights.length - 1][1],
        heights[heights.length - 1][1] + rng.nextNormalClamped(transitionNominalWidth, transitionStandardDeviation, 0, 1e6),
        heights[heights.length - 1][3],
        0,
        rng.nextNormalColorClamped(darkColor, scaledDarkColorDeviation, 0, darkColor)
      ]);
      // Dark
      heights.push([
        heights[heights.length - 1][1],
        heights[heights.length - 1][1] + rng.nextNormalClamped(darkNominalWidth, darkWidthStandardDeviation, 0, 1e6),
        0,
        heights[heights.length - 1][4],
        0,
      ]);
      // Dark to light transition
      heights.push([
        heights[heights.length - 1][1],
        heights[heights.length - 1][1] + rng.nextNormalClamped(transitionNominalWidth, transitionStandardDeviation, 0, 1e6),
        heights[heights.length - 1][3],
        0,
        lightColor,
      ]);
      // Light
      heights.push([
        heights[heights.length - 1][1],
        heights[heights.length - 1][1] + rng.nextNormalClamped(lightNominalWidth, lightWidthStandardDeviation, 0, 1e6),
        0,
        lightColor,
        0,
      ]);
    };

    input.commands.forEach((command) => {
      if (command.toolPath && command.toolPath.start.z > 0) {
        for (const [index, height] of heights.entries()) {
          if (command.toolPath.start.z >= height[0] && command.toolPath.start.z < height[1]) {
            switch (index % 4) {
              case 0:
                lineColors.set(command.lineNumber, height[3]);
                break;
              case 1: {
                const factor1 = (command.toolPath.start.z - height[0]) / (height[1] - height[0]);
                lineColors.set(command.lineNumber, colorInterpolate(height[2], height[4], Math.max(0, Math.min(1, factor1))));
                break;
              }
              case 2:
                lineColors.set(command.lineNumber, height[3]);
                break;
              case 3: {
                const factor3 = (command.toolPath.start.z - height[0]) / (height[1] - height[0]);
                lineColors.set(command.lineNumber, colorInterpolate(height[2], height[4], Math.max(0, Math.min(1, factor3))));
                break;
              }
            }
            break;
          }
        }
      }
    });

    return { lineColors };
  }
} 