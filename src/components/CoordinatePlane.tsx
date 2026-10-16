export type Point = { x: number; y: number; label: string }

export function CoordinatePlane({ points, stage = 3, triangle = false }: { points: Point[]; stage?: number; triangle?: boolean }) {
  const px = (x: number) => 180 + x * 21
  const py = (y: number) => 180 - y * 21
  return <svg className="coordinate-plane" viewBox="0 0 360 360" role="img" aria-label={`Coordinate plane. ${points.map(p => p.label).join('; ')}.${stage < 3 ? ' Plotting in progress.' : ''}`}>
    <title>{points.map(p => p.label).join('; ')}</title>
    {Array.from({ length: 15 }, (_, i) => i - 7).map(n => <g key={n}><line x1={px(n)} x2={px(n)} y1="24" y2="336" className="grid-line" /><line y1={py(n)} y2={py(n)} x1="24" x2="336" className="grid-line" />{n !== 0 && n % 2 === 0 && <><text x={px(n)} y="196" className="axis-number" textAnchor="middle">{n}</text><text x="165" y={py(n) + 4} className="axis-number" textAnchor="end">{n}</text></>}</g>)}
    <path d="M 24 180 H 338 m -6 -4 6 4 -6 4 M 180 338 V 24 m -4 6 4 -6 4 6" className="axis-line" fill="none" /><text x="339" y="170" className="axis-letter">x</text><text x="191" y="25" className="axis-letter">y</text><text x="168" y="197" className="axis-number">0</text>
    <g className="quadrant-label"><text x="300" y="58">I</text><text x="48" y="58">II</text><text x="43" y="319">III</text><text x="298" y="319">IV</text></g>
    {triangle && points.length >= 2 && stage >= 2 && <path d={`M ${px(points[0].x)} ${py(points[0].y)} H ${px(points[1].x)} V ${py(points[1].y)} Z`} className="triangle-path" />}
    {points.map((p, i) => <g key={p.label} className={i % 2 ? 'plot-point secondary' : 'plot-point'}>{stage >= 1 && <path d={`M 180 180 H ${px(p.x)}${stage >= 2 ? ` V ${py(p.y)}` : ''}`} className="plot-guide" />}{stage >= 2 && <><circle cx={px(p.x)} cy={py(p.y)} r="10" className="point-halo" /><circle cx={px(p.x)} cy={py(p.y)} r="4.5" className="point-dot" /><text x={px(p.x) + (p.x > 3 ? -10 : 10)} y={py(p.y) - 14} textAnchor={p.x > 3 ? 'end' : 'start'} className="point-label">{p.label}</text></>}</g>)}
  </svg>
}
