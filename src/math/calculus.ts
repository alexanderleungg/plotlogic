import type { Params } from "./parser";

// central finite differences
export function partials(
  f: (x: number, y: number, p: Params) => number,
  x0: number,
  y0: number,
  p: Params,
  h = 1e-3
) {
  const dfdx = (f(x0 + h, y0, p) - f(x0 - h, y0, p)) / (2 * h);
  const dfdy = (f(x0, y0 + h, p) - f(x0, y0 - h, p)) / (2 * h);
  return { dfdx, dfdy };
}
