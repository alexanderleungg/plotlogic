import { useState, useEffect } from "react";
import type { Params } from "../math/parser";

export default function ControlsPanel({
  onChange,
}: {
  onChange: (expr: string, params: Params) => void;
}) {
  const [expr, setExpr] = useState("a*x^2 - b*y^2");
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);

  // Debounced update – only depends on expr, a, b
  useEffect(() => {
    const id = setTimeout(() => {
      onChange(expr, { a, b });
    }, 300);
    return () => clearTimeout(id);
  }, [expr, a, b]); // ✅ removed onChange from deps

  return (
    <div className="space-y-4">
      <h2 className="font-semibold">Surface Controls</h2>
      <input
        value={expr}
        onChange={(e) => setExpr(e.target.value)}
        className="w-full border rounded p-2"
      />
      <div>
        <label>a = {a.toFixed(2)}</label>
        <input
          type="range"
          min={-3}
          max={3}
          step={0.1}
          value={a}
          onChange={(e) => setA(parseFloat(e.target.value))}
        />
      </div>
      <div>
        <label>b = {b.toFixed(2)}</label>
        <input
          type="range"
          min={-3}
          max={3}
          step={0.1}
          value={b}
          onChange={(e) => setB(parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
}
