import { points, type Line } from "@/lib/slope";
export default function Graph({ line, hint }: { line: Line; hint: boolean }) {
  const scale = (x: number) => 24 + (x + 10) * 20;
  const vertical = (y: number) => scale(-y);
  const pairs = points(line),
    a = pairs[Math.floor((pairs.length - 1) / 2)],
    b = pairs[Math.floor((pairs.length - 1) / 2) + 1];
  return (
    <svg
      className="slope-graph"
      viewBox="0 0 448 448"
      role="img"
      aria-label="Coordinate grid from negative ten to ten, with a line. Identify two grid intersections to find its slope."
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
    </svg>
  );
}
