export function colorInterpolate(color1: number, color2: number, t: number): number {
  const r1 = (color1 >> 16) & 0xFF;
  const g1 = (color1 >> 8) & 0xFF;
  const b1 = color1 & 0xFF;
  const r2 = (color2 >> 16) & 0xFF;
  const g2 = (color2 >> 8) & 0xFF;
  const b2 = color2 & 0xFF;
  
  // Convert to perceptually uniform space (gamma 2.2)
  const gamma = 2.2;
  const r1Linear = Math.pow(r1 / 255, gamma);
  const g1Linear = Math.pow(g1 / 255, gamma);
  const b1Linear = Math.pow(b1 / 255, gamma);
  const r2Linear = Math.pow(r2 / 255, gamma);
  const g2Linear = Math.pow(g2 / 255, gamma);
  const b2Linear = Math.pow(b2 / 255, gamma);
  
  // Interpolate in linear space
  const rLinear = r1Linear + (r2Linear - r1Linear) * t;
  const gLinear = g1Linear + (g2Linear - g1Linear) * t;
  const bLinear = b1Linear + (b2Linear - b1Linear) * t;
  
  // Convert back to sRGB space
  const r = Math.round(Math.pow(rLinear, 1/gamma) * 255);
  const g = Math.round(Math.pow(gLinear, 1/gamma) * 255);
  const b = Math.round(Math.pow(bLinear, 1/gamma) * 255);
  
  return (r << 16) | (g << 8) | b;
}