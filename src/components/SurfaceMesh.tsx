import * as THREE from "three";
import { useMemo } from "react";
import { compileExpr, type Params } from "../math/parser";

type Range = { xmin: number; xmax: number; ymin: number; ymax: number };

export default function SurfaceMesh({
  expr,
  params,
  range = { xmin: -2, xmax: 2, ymin: -2, ymax: 2 },
  steps = 60,
}: {
  expr: string;
  params: Params;
  range?: Range;
  steps?: number;
}) {
  const geometry = useMemo(() => {
    const fn = compileExpr(expr);

    // sample grid
    const xs = Array.from({ length: steps }, (_, i) =>
      range.xmin + (i / (steps - 1)) * (range.xmax - range.xmin)
    );
    const ys = Array.from({ length: steps }, (_, j) =>
      range.ymin + (j / (steps - 1)) * (range.ymax - range.ymin)
    );

    // evaluate z and track min/max
    const z: number[][] = Array.from({ length: steps }, () => Array(steps).fill(0));
    let zmin = Infinity;
    let zmax = -Infinity;
    for (let i = 0; i < steps; i++) {
      for (let j = 0; j < steps; j++) {
        let v = fn(xs[i], ys[j], params);
        if (!Number.isFinite(v)) v = 0;
        z[i][j] = v;
        if (v < zmin) zmin = v;
        if (v > zmax) zmax = v;
      }
    }
    const span = zmax - zmin || 1;

    // build TRIANGLE LIST (no indices = fewer WebGL gotchas)
    const verts: number[] = [];
    const cols: number[] = [];

    const pushVertex = (x: number, y: number, zz: number) => {
      verts.push(x, zz, y); // map to (X, Y=height, Z)
      const t = (zz - zmin) / span; // 0..1
      const c = new THREE.Color().setHSL((1 - t) * 0.67, 0.9, 0.5); // blue→red
      cols.push(c.r, c.g, c.b);
    };

    for (let i = 0; i < steps - 1; i++) {
      for (let j = 0; j < steps - 1; j++) {
        const p00 = [xs[i], ys[j], z[i][j]] as const;
        const p10 = [xs[i + 1], ys[j], z[i + 1][j]] as const;
        const p01 = [xs[i], ys[j + 1], z[i][j + 1]] as const;
        const p11 = [xs[i + 1], ys[j + 1], z[i + 1][j + 1]] as const;

        // tri 1: p00, p10, p01
        pushVertex(...p00);
        pushVertex(...p10);
        pushVertex(...p01);

        // tri 2: p01, p10, p11
        pushVertex(...p01);
        pushVertex(...p10);
        pushVertex(...p11);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
    geo.computeVertexNormals();
    return geo;
  }, [expr, params, range.xmin, range.xmax, range.ymin, range.ymax, steps]);

  return (
    <mesh geometry={geometry}>
      <meshLambertMaterial vertexColors side={THREE.DoubleSide} />
    </mesh>
  );
}
