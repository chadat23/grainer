export function colorInterpolate(color1: number, color2: number, t: number): number {
  if (color1 === color2) {
    return color1;
  }

  const r1 = (color1 >> 16) & 0xFF;
  const g1 = (color1 >> 8) & 0xFF;
  const b1 = color1 & 0xFF;
  const r2 = (color2 >> 16) & 0xFF;
  const g2 = (color2 >> 8) & 0xFF;
  const b2 = color2 & 0xFF;

//  const r = Math.round(r1 + (r2 - r1) * t);
//  const g = Math.round(g1 + (g2 - g1) * t);
//  const b = Math.round(b1 + (b2 - b1) * t);

  const logr1 = Math.log(r1);
  const logg1 = Math.log(g1);
  const logb1 = Math.log(b1);
  const logr2 = Math.log(r2);
  const logg2 = Math.log(g2);
  const logb2 = Math.log(b2);
  
  const interpolatedLogR = logr1 * (1-t) + logr2 * t;
  const interpolatedLogG = logg1 * (1-t) + logg2 * t;
  const interpolatedLogB = logb1 * (1-t) + logb2 * t;
  
  const r = Math.round(Math.exp(interpolatedLogR));
  const g = Math.round(Math.exp(interpolatedLogG));
  const b = Math.round(Math.exp(interpolatedLogB));

  return (r << 16) | (g << 8) | b;
}