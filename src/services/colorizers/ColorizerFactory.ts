import { BaseColorizer } from './BaseColorizer';
import { LayerColorizer } from './LayerColorizer';

export type ColorizerType = 'layer' | 'radial' | 'temperature';

export class ColorizerFactory {
  static createColorizer(type: ColorizerType): BaseColorizer {
    switch (type) {
      case 'layer':
        return new LayerColorizer();
      case 'radial':
        // TODO: Implement RadialColorizer
        throw new Error('RadialColorizer not yet implemented');
      case 'temperature':
        // TODO: Implement TemperatureColorizer
        throw new Error('TemperatureColorizer not yet implemented');
      default:
        throw new Error(`Unknown colorizer type: ${type}`);
    }
  }
} 