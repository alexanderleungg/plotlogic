import * as THREE from "three";
import { useMemo } from "react";
import { compileExpr, type Params } from "../math/parser";
import { partials } from "../math/calculus";

type Props = {
  expr: string;
  params: Params;
  point: { x: number; y: number }; // surface point coordinates (x,y)
  size?: number; // visible size of the plane square
};

export default function GradientPlane({ expr, params, point, size = 1.5 }: Props) {
  // f(x,y)
  const f = useMemo(() => compileExpr(expr), [expr]);

  // z0 and gradient at (x0,y0)
  const data = useMemo(() => {
    const { x, y } = point;
    const z0 = f(x, y, params);
    const { dfdx, dfdy } = partials(f, x, y, params);
    return { x, y, z0, dfdx, dfdy };
  }, [f, point.x, point.y, params.a, params.b]);

  // build a small plane tangent at (x0,y0)
  const plane = useMemo(() => {
    const { x, y, z0, dfdx, dfdy } = data;

    // plane: z ≈ z0 + dfdx*(X-x) + dfdy*(Y-y)
    // sample a square around (x,y) in the X–Y domain
    const half = size / 2;
    const cornersXY = [
      [x - half, y - half],
      [x + half, y - half],
      [x + half, y + half],
      [x - half, y + half],
    ];

    const positions = new Float32Array(4 * 3);
    let p = 0;
    for (const [X, Y] of cornersXY) {
      const Z = z0 + dfdx * (X - x) + dfdy * (Y - y);
      positions[p++] = X;
      positions[p++] = Z; // height mapped to Y in Three space
      positions[p++] = Y;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setIndex([0, 1, 2, 0, 2, 3]);
    geom.computeVertexNormals();

    // gradient arrow (∇f = <dfdx, dfdy, 0>) at (x,y,z0)
    const gradDir = new THREE.Vector3(dfdx, 0, dfdy);
    if (gradDir.lengthSq() > 0) gradDir.normalize();

    return { geom, origin: new THREE.Vector3(x, z0, y), gradDir };
  }, [data, size]);

  return (
    <group>
      {/* Tangent plane */}
      <mesh geometry={plane.geom}>
        <meshStandardMaterial color={"#ffd27f"} roughness={0.85} transparent opacity={0.7} />
      </mesh>

      {/* Gradient vector */}
      <arrowHelper args={[plane.gradDir, plane.origin, 0.8, new THREE.Color("#ff3b30")]} />

      {/* Point marker */}
      <mesh position={plane.origin}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color={"#ff3b30"} />
      </mesh>
    </group>
  );
}
