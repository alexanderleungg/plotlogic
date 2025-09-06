import { useMemo, type ReactElement } from "react";
import { Vector3, Color, Vector2 } from "three";

type Range = { xmin: number; xmax: number; ymin: number; ymax: number };

type VectorFieldProps = {
  f: (x: number, y: number) => Vector2;
  normalize: boolean;
  steps?: number;
  range?: Range;
};

export default function VectorField({
  f,
  normalize,
  steps = 15,
  range = { xmin: -2, xmax: 2, ymin: -2, ymax: 2 },
}: VectorFieldProps) {
  const arrows = useMemo<ReactElement[]>(() => {
    const arr: ReactElement[] = [];

    const dx = (range.xmax - range.xmin) / (steps - 1);
    const dy = (range.ymax - range.ymin) / (steps - 1);

    let id = 0;
    let maxMag = 1e-9;

    // precompute magnitudes to normalize by global max when not normalize=true
    const mags: number[][] = [];
    for (let j = 0; j < steps; j++) {
      mags[j] = [];
      for (let i = 0; i < steps; i++) {
        const x = range.xmin + i * dx;
        const y = range.ymin + j * dy;
        const v = f(x, y);
        const m = Math.hypot(v.x, v.y);
        mags[j][i] = m;
        if (m > maxMag) maxMag = m;
      }
    }

    for (let j = 0; j < steps; j++) {
      for (let i = 0; i < steps; i++) {
        const x = range.xmin + i * dx;
        const y = range.ymin + j * dy;

        const v = f(x, y);
        const mag = mags[j][i];

        // direction
        const dir = new Vector3(v.x, 0, v.y);
        if (dir.lengthSq() > 1e-12) dir.normalize();
        else dir.set(1, 0, 0); // arbitrary when zero vector

        // origin & length
        const origin = new Vector3(x, 0, y);
        const length = normalize ? 0.2 : 0.2 * (mag / maxMag || 1);

        // simple magnitude-based color (blue → red)
        const t = Math.min(1, mag / (maxMag || 1));
        const color = new Color().setHSL(0.67 * (1 - t), 0.9, 0.5); // 0.67≈blue → 0≈red

        arr.push(<arrowHelper key={id++} args={[dir, origin, length, color]} />);
      }
    }

    return arr;
  }, [
    f,
    normalize,
    steps,
    range.xmin,
    range.xmax,
    range.ymin,
    range.ymax,
  ]);

  return <group>{arrows}</group>;
}
