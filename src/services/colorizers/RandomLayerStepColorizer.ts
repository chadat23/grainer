import { Command } from '@/types/command';
import { BaseColorizer, ColorizerInput, ColorizerOutput } from './BaseColorizer';
import { SeedableRandom } from '@/utils/random';

export class LayerColorizer extends BaseColorizer {
  calculateColors(input: ColorizerInput): ColorizerOutput {
    const lineColors = new Map<number, number>();

    const random = new SeedableRandom(7);
    console.log(random.next());
    console.log(random.next());
    console.log(random.next());
    
    // Calculate the min and max Z values
    //var maxHeight = new Map<number, number>();
    //input.commands.forEach((command) => {
    //  if (command.toolPath) {
    //    const height = maxHeight.get(command.toolPath.start.z) || 0;
    //    maxHeight.set(command.toolPath.start.z, height + 1);
    //  }
    //});
    //var maxZLayer = 0;
    //maxHeight.forEach((value, key) => {
    //  if (key > maxZLayer && value > 9) {
    //    maxZLayer = key;
    //  }
    //});
    //console.log("maxHeight", maxHeight);
    var provisionalMaxZ = 0;
    input.commands.forEach((command) => {
      if (command.toolPath) {
        if (command.toolPath.start.z > provisionalMaxZ) {
          provisionalMaxZ = command.toolPath.start.z;
        }
      }
    });
    const maxZLayer = (provisionalMaxZ - 100);
    const minZLayer = 0;

    const layerBand = Math.random() * (maxZLayer - minZLayer);

    // Calculate colors for each command
    input.commands.forEach((command) => {
      if (command.toolPath) {
        // Calculate color for this path (same logic as before)
        if (command.toolPath.start.z < layerBand) {
          lineColors.set(command.lineNumber, 0x99FF99);
        } else {
          lineColors.set(command.lineNumber, 0xA52A2A);
        }
      }
    });

    return { lineColors };
  }
} 