import { BaseTempGenerator } from './BaseTempGenerator';
import { RandomLayerBandTempGenerator } from './RandomLayerBandTempGenerator';

export type TempGeneratorType = 'layer' | 'radial' | 'temperature';

export class TempGeneratorFactory {
  static createTempGenerator(type: TempGeneratorType): BaseTempGenerator {
    switch (type) {
      case 'layer':
        return new RandomLayerBandTempGenerator();
      case 'radial':
        // TODO: Implement RadialColorizer
        throw new Error('RadialColorizer not yet implemented');
      case 'temperature':
        // TODO: Implement TemperatureColorizer
        throw new Error('TemperatureColorizer not yet implemented');
      default:
        throw new Error(`Unknown temp generator type: ${type}`);
    }
  }
} 