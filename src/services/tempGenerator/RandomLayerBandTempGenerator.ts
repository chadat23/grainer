import { Command } from '@/types/command';
import { BaseTempGenerator, TempGeneratorInput, TempGeneratorOutput } from './BaseTempGenerator';
import { SeedableRandom } from '@/utils/random';
import { tempInterpolate } from '@/utils/temps';

export class RandomLayerBandTempGenerator extends BaseTempGenerator {
  calculateTemps(input: TempGeneratorInput): TempGeneratorOutput {
    const lineTemps = new Map<number, number>();
    
    const lightNominalWidth = input.lightNominalWidth || 10;
    const lightWidthStandardDeviation = input.lightWidthStandardDeviation || 3;
    const darkNominalWidth = input.darkNominalWidth || 1;
    const darkWidthStandardDeviation = input.darkWidthStandardDeviation || 1;
    const darkTempDeviation = input.darkTempDeviation !== undefined ? input.darkTempDeviation : 50; // Use input value or default to 50
    const transitionNominalWidth = input.transitionNominalWidth || 2;
    const transitionStandardDeviation = input.transitionStandardDeviation || 0.5;
    const lightTemp = input.minTemp || 170;
    const darkNominalTemp = input.nominalDarkTemp || 250;
    const maxDarkTemp = input.maxDarkTemp || 300;

    const seed = input.seed || 2; // Use the seed from input
    const rng = new SeedableRandom(seed);

    const maxHeight = input.commands.reduce((max, command) => Math.max(max, command.toolPath?.start.z || 0), 0);
    var heights: [number, number, number, number, number][] = [];
    // band start z, band end z, band start temp, band end temp, band start color
    heights.push([0, rng.nextNormalClamped(lightNominalWidth, lightWidthStandardDeviation, 0, 1e6), 0, lightTemp, 0]);
    while (heights[heights.length - 1][0] < maxHeight) {
      // Light to dark transition
      heights.push([
        heights[heights.length - 1][1],
        heights[heights.length - 1][1] + rng.nextNormalClamped(transitionNominalWidth, transitionStandardDeviation, 0, 1e6),
        heights[heights.length - 1][3],
        0,
        rng.nextNormalClamped(darkNominalTemp, darkTempDeviation, lightTemp, maxDarkTemp)
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
        lightTemp,
      ]);
      // Light
      heights.push([
        heights[heights.length - 1][1],
        heights[heights.length - 1][1] + rng.nextNormalClamped(lightNominalWidth, lightWidthStandardDeviation, 0, 1e6),
        0,
        lightTemp,
        0,
      ]);
    };

    input.commands.forEach((command) => {
      if (command.toolPath && command.toolPath.start.z > 0) {
        for (const [index, height] of heights.entries()) {
          if (command.toolPath.start.z >= height[0] && command.toolPath.start.z < height[1]) {
            switch (index % 4) {
              case 0:
                lineTemps.set(command.lineNumber, height[3]);
                break;
              case 1: {
                const factor1 = (command.toolPath.start.z - height[0]) / (height[1] - height[0]);
                lineTemps.set(command.lineNumber, tempInterpolate(height[2], height[4], Math.max(0, Math.min(1, factor1))));
                break;
              }
              case 2:
                lineTemps.set(command.lineNumber, height[3]);
                break;
              case 3: {
                const factor3 = (command.toolPath.start.z - height[0]) / (height[1] - height[0]);
                lineTemps.set(command.lineNumber, tempInterpolate(height[2], height[4], Math.max(0, Math.min(1, factor3))));
                break;
              }
            }
            break;
          }
        }
      }
    });

    return { lineTemps };
  }
} 