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

    var height = -10;

    var step = 0;
    var interpolationHeight = -1;

    var currentColor = lightColor;
    var lastColor = lightColor;
    var nextColor = darkColor;

    // Calculate colors for each command
    input.commands.forEach((command) => {
      if (command.toolPath) {
        // Calculate color for this path (same logic as before)
        //console.log("command.toolPath.start.z", command.toolPath.start.z);
        //console.log("height", height);
        if (command.toolPath.start.z > height) {
          height = height < 0 ? 0 : height;
          step = (step + 1) % 4;
          switch (step) {
            case 0:
              height += rng.nextNormalClamped(lightNominalWidth, lightWidthStandardDeviation, 0, 1e6);
              currentColor = lightColor;
              break;
            case 1:
              height += rng.nextNormalClamped(transitionNominalWidth, transitionStandardDeviation, 0, 1e6);
              lastColor = lightColor;
              nextColor =  rng.nextNormalColorClamped(darkColor, scaledDarkColorDeviation, 0, darkColor);
              interpolationHeight = command.toolPath.start.z;
              break;
            case 2:
              height += rng.nextNormalClamped(darkNominalWidth, darkWidthStandardDeviation, 0, 1e6);
              currentColor = nextColor;
              break;
            case 3:
              height += rng.nextNormalClamped(transitionNominalWidth, transitionStandardDeviation, 0, 1e6);
              lastColor = currentColor;
              nextColor = lightColor;
              break;
          }
        }
        switch (step) {
          case 0:
            lineColors.set(command.lineNumber, currentColor);
            break;
          case 1:
            const factor1 = (command.toolPath.start.z - interpolationHeight) / (height - interpolationHeight);
            currentColor = colorInterpolate(lastColor, nextColor, Math.max(0, Math.min(1, factor1)));
            lineColors.set(command.lineNumber, currentColor);
            break;
          case 2:
            //currentColor = rng.nextNormalColorClamped(darkColor, scaledDarkColorDeviation, 0, darkColor);
            lineColors.set(command.lineNumber, currentColor);
            break;
          case 3:
            const factor3 = (command.toolPath.start.z - interpolationHeight) / (height - interpolationHeight);
            currentColor = colorInterpolate(lastColor, nextColor, Math.max(0, Math.min(1, factor3)));
            lineColors.set(command.lineNumber, currentColor);
            break;
        }
      }
    });

    return { lineColors };
  }
} 