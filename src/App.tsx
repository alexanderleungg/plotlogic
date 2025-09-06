// src/App.tsx
import { useState, useCallback } from "react";
import * as THREE from "three";
import type { Params } from "./math/parser";

import Canvas3D from "./components/Canvas3D";
import SurfaceMesh from "./components/SurfaceMesh";
import ControlsPanel from "./components/ControlsPanel";
import VectorField from "./components/VectorField";
import VectorFieldPanel from "./components/VectorFieldPanel";

export default function App() {
  // ----- Tabs -----
  const [tab, setTab] = useState<"surface" | "vector">("surface");

  // ----- Surface state -----
  const [expr, setExpr] = useState("a*x^2 - b*y^2");
  const [params, setParams] = useState<Params>({ a: 1, b: 1 });

  // Stable handler to avoid debounce loops
  const handleSurfaceChange = useCallback((e: string, p: Params) => {
    setExpr(e);
    setParams(p);
  }, []);

  // ----- Vector field state -----
  const [vf, setVf] = useState<(x: number, y: number) => THREE.Vector2>(
    () => (x: number, y: number) => new THREE.Vector2(-y, x) // rotation field
  );
  const [normalize, setNormalize] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="px-6 py-4 border-b bg-white">
        <h1 className="text-2xl font-semibold">PlotLogic</h1>
        <p className="text-sm text-gray-500">Interactive 3D math visualizer</p>
      </header>

      {/* Tabs */}
      <div className="px-6 py-2 space-x-2">
        <button
          className={`border px-3 py-1 rounded ${tab === "surface" ? "bg-gray-200" : ""}`}
          onClick={() => setTab("surface")}
        >
          Surface
        </button>
        <button
          className={`border px-3 py-1 rounded ${tab === "vector" ? "bg-gray-200" : ""}`}
          onClick={() => setTab("vector")}
        >
          Vector Field
        </button>
      </div>

      {/* Main layout */}
      <main className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Canvas3D>
            {tab === "surface" && (
              <SurfaceMesh expr={expr} params={params} steps={80} />
            )}

            {tab === "vector" && (
              // VectorField expects `f` and `normalize`
              <VectorField f={vf} normalize={normalize} />
            )}
          </Canvas3D>
        </div>

        <div>
          {tab === "surface" && (
            <ControlsPanel onChange={handleSurfaceChange} />
          )}

          {tab === "vector" && (
            // VectorFieldPanel reports both the function and the normalize toggle
            <VectorFieldPanel
              onChange={(f, n) => {
                setVf(() => f);     // store function by reference (avoids re-renders)
                setNormalize(n);
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
