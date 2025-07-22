export function tempInterpolate(temp1: number, temp2: number, t: number): number {
  if (temp1 === temp2) {
    return temp1;
  }

  const logt1 = Math.log(temp1);
  const logt2 = Math.log(temp2);

  const interpolatedLogT = logt1 * (1-t) + logt2 * t;
  const interpolatedTemp = Math.exp(interpolatedLogT);
  return interpolatedTemp;
}