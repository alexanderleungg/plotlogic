import { parse } from "mathjs";

export type Params = Record<string, number>;

export function compileExpr(expr: string) {
  try {
    const node = parse(expr);
    return (x: number, y: number, params: Params) =>
      node.evaluate({ x, y, ...params }) as number;
  } catch {
    return () => 0; // safe fallback while typing
  }
}
