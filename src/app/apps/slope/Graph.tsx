"use client";
import { useState } from "react";
import { points, type Line } from "@/lib/slope";
export default function Graph({ line, hint }: { line: Line; hint: boolean }) {
  const [selected, setSelected] = useState<string[]>([]);
  function toggle(key: string) {
    setSelected((current) =>
      current.includes(key)
        ? current.filter((p) => p !== key)
        : [...current, key],
    );
  }
  const scale = (x: number) => 24 + (x + 10) * 20;
  const vertical = (y: number) => scale(-y);
  const pairs = points(line),
    a = pairs[Math.floor((pairs.length - 1) / 2)],
    b = pairs[Math.floor((pairs.length - 1) / 2) + 1];
  return (
    <>
      {" "}
      <svg
        className="slope-graph"
        viewBox="0 0 448 448"
        role="group"
        aria-label="Coordinate grid from negative ten to ten, with a line. Tap integer grid points on the line to show their coordinates. Tap a selected point again to hide them."
      >
        <defs>
          <clipPath id="slope-grid-clip">
            <rect x="24" y="24" width="400" height="400" />
          </clipPath>
        </defs>
        <rect x="24" y="24" width="400" height="400" fill="#fffdf8" />
        {Array.from({ length: 21 }, (_, i) => i - 10).map((n) => (
          <g key={n}>
            <path
              d={`M ${scale(n)} 24 V 424 M 24 ${vertical(n)} H 424`}
              stroke={n === 0 ? "#16334c" : "#d3dce0"}
              strokeWidth={n === 0 ? 1.8 : 1}
            />
            {n !== 0 && n % 2 === 0 && (
              <>
                <text
                  x={scale(n)}
                  y="240"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#385369"
                >
                  {n}
                </text>
                <text
                  x="216"
                  y={vertical(n) + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="#385369"
                >
                  {n}
                </text>
              </>
            )}
          </g>
        ))}
        <text x="432" y="219" fontSize="14" fill="#16334c">
          x
        </text>
        <text x="232" y="16" fontSize="14" fill="#16334c">
          y
        </text>
        <g clipPath="url(#slope-grid-clip)">
          <path
            d={`M ${scale(-10)} ${vertical(line.y + ((-10 - line.x) * line.rise) / line.run)} L ${scale(10)} ${vertical(line.y + ((10 - line.x) * line.rise) / line.run)}`}
            stroke="#187c8b"
            strokeWidth="3"
            fill="none"
          />
        </g>
        {hint && a && b && (
          <g>
            <path
              d={`M ${scale(a.x)} ${vertical(a.y)} H ${scale(b.x)} V ${vertical(b.y)}`}
              stroke="#ad6819"
              strokeWidth="2"
              strokeDasharray="5 4"
              fill="none"
            />
            {[a, b].map((p, i) => (
              <circle
                key={i}
                cx={scale(p.x)}
                cy={vertical(p.y)}
                r="5"
                fill="#ad6819"
                stroke="white"
                strokeWidth="2"
              />
            ))}
          </g>
        )}
        {pairs.map((p) => {
          const key = `${p.x},${p.y}`,
            active = selected.includes(key);
          const labelX = Math.max(61, Math.min(387, scale(p.x))),
            labelY =
              vertical(p.y) < 65 ? vertical(p.y) + 28 : vertical(p.y) - 18;
          return (
            <g key={key}>
              {active && (
                <g pointerEvents="none">
                  <rect
                    x={labelX - 35}
                    y={labelY - 13}
                    width="70"
                    height="22"
                    rx="4"
                    fill="#16334c"
                  />
                  <text
                    x={labelX}
                    y={labelY + 2}
                    textAnchor="middle"
                    fontSize="13"
                    fill="white"
                  >
                    ({p.x}, {p.y})
                  </text>
                  <circle
                    cx={scale(p.x)}
                    cy={vertical(p.y)}
                    r="5"
                    fill="#16334c"
                    stroke="white"
                    strokeWidth="2"
                  />
                </g>
              )}
              <circle
                className="slope-point-target"
                cx={scale(p.x)}
                cy={vertical(p.y)}
                r="9"
                fill="transparent"
                role="button"
                tabIndex={0}
                aria-label={`Point (${p.x}, ${p.y})`}
                aria-pressed={active}
                onClick={() => toggle(key)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle(key);
                  }
                }}
              />
            </g>
          );
        })}
      </svg>
      <p className="slope-selected" role="status">
        {selected.length
          ? `Selected: ${selected.map((p) => `(${p.replace(",", ", ")})`).join(" · ")}`
          : ""}
      </p>
    </>
  );
}
