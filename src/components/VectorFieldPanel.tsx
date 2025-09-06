import { useState } from "react";
import * as THREE from "three";

type Props = {
  onChange: (f: (x: number, y: number) => THREE.Vector2, normalize: boolean) => void;
};

export default function VectorFieldPanel({ onChange }: Props) {
  const [normalize, setNormalize] = useState(false);

  function pickPreset(preset: "rotation" | "radial" | "saddle") {
    let fn: (x: number, y: number) => THREE.Vector2;
    switch (preset) {
      case "rotation":
        fn = (x, y) => new THREE.Vector2(-y, x);
        break;
      case "radial":
        fn = (x, y) => new THREE.Vector2(x, y);
        break;
      case "saddle":
        fn = (x, y) => new THREE.Vector2(x, -y);
        break;
      default:
        fn = () => new THREE.Vector2(0, 0);
    }
    onChange(fn, normalize);
  }

  return (
    <div className="p-4 border rounded space-y-3">
      <h2 className="text-lg font-medium">Vector Field Controls</h2>

      <div className="space-y-2">
        <button
          className="px-3 py-1 border rounded w-full hover:bg-gray-100"
          onClick={() => pickPreset("rotation")}
        >
          Rotation
        </button>
        <button
          className="px-3 py-1 border rounded w-full hover:bg-gray-100"
          onClick={() => pickPreset("radial")}
        >
          Radial
        </button>
        <button
          className="px-3 py-1 border rounded w-full hover:bg-gray-100"
          onClick={() => pickPreset("saddle")}
        >
          Saddle
        </button>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={normalize}
          onChange={(e) => {
            setNormalize(e.target.checked);
            onChange((x, y) => new THREE.Vector2(-y, x), e.target.checked);
          }}
        />
        Normalize vectors
      </label>
    </div>
  );
}
