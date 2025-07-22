export class SeedableRandom {
  private _seed: number;
  private readonly _m: number;
  private readonly _a: number;
  private readonly _c: number;

  constructor(seed?: number) {
    this._m = 2 ** 31 - 1; // A common large prime number
    this._a = 16807;       // A common multiplier
    this._c = 0;           // Often 0 for multiplicative LCGs

    this._seed = seed != null ? this.normalizeSeed(seed) : this.generateInitialSeed();
  }

  private normalizeSeed(seed: number): number {
    let normalized = Math.floor(Math.abs(seed));
    if (normalized === 0) {
      normalized = 1; // Avoid seed 0 for specific LCG properties
    }
    return normalized % this._m;
  }

  private generateInitialSeed(): number {
    return Math.floor(Date.now() * Math.random()) % this._m;
  }

  public next(): number {
    this._seed = (this._a * this._seed + this._c) % this._m;
    return this._seed / this._m;
  }

  public getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Generates a normally distributed random number using the Box-Muller transform
   * @param mean - The mean of the normal distribution
   * @param standardDeviation - The standard deviation of the normal distribution
   * @returns A random number from a normal distribution with the specified mean and standard deviation
   */
  public nextNormal(mean: number = 0, standardDeviation: number = 1): number {
    // Box-Muller transform to convert uniform random numbers to normal distribution
    const u1 = this.next();
    const u2 = this.next();
    
    // Avoid log(0) which would cause issues
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    
    // Transform to the desired mean and standard deviation
    return mean + standardDeviation * z0;
  }

  /**
   * Generates a random number from a normal distribution and clamps it to a specified range
   * @param mean - The mean of the normal distribution
   * @param standardDeviation - The standard deviation of the normal distribution
   * @param min - The minimum allowed value
   * @param max - The maximum allowed value
   * @returns A random number from a normal distribution, clamped to the specified range
   */
  public nextNormalClamped(mean: number, standardDeviation: number, min: number, max: number): number {
    const value = this.nextNormal(mean, standardDeviation);
    return Math.max(min, Math.min(max, value));
  }

  public nextNormalTempClamped(temp: number, standardDeviation: number, minTemp: number, maxTemp: number): number {
    return this.nextNormalClamped(temp, standardDeviation, minTemp, maxTemp);
  }

  public nextNormalColorClamped(color: number, standardDeviation: number, min: number, max: number): number {
    const r = (color >> 16) & 0xFF;
    const g = (color >> 8) & 0xFF;
    const b = color & 0xFF;

    const scaleFactor = this.nextNormalClamped(1, standardDeviation, min, max);

    const rValue = Math.max(0, Math.min(255, r * scaleFactor));
    const gValue = Math.max(0, Math.min(255, g * scaleFactor));
    const bValue = Math.max(0, Math.min(255, b * scaleFactor));

    return (rValue << 16) | (gValue << 8) | bValue;
  }
}