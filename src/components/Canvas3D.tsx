// src/components/Canvas3D.tsx
import { useMemo, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

export default function Canvas3D({ children }: { children: ReactNode }) {
  const grid = useMemo(() => new THREE.GridHelper(10, 10), []);

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden border">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 55 }}
        frameloop="demand"     // only render when invalidated
        resize={{ scroll: false }}
        dpr={1}
        style={{ display: "block" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 3, 2]} intensity={1} />

        {/* everything below is static unless children change */}
        <group matrixAutoUpdate={false}>
          <primitive object={grid} />
          {children}
        </group>
      </Canvas>
    </div>
  );
}
