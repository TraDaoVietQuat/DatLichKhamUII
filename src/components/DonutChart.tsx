import { useEffect, useState } from 'react';

interface Seg { value: number; color: string; label: string; }

export default function DonutChart({
  segments, size = 140, thickness = 22, center = '', sub = '',
}: { segments: Seg[]; size?: number; thickness?: number; center?: string; sub?: string }) {
  const [p, setP] = useState(0);
  const r = (size - thickness) / 2, cx = size / 2, cy = size / 2, circ = 2 * Math.PI * r;
  const total = segments.reduce((s, sg) => s + sg.value, 0);

  useEffect(() => { const t = setTimeout(() => setP(1), 120); return () => clearTimeout(t); }, []);

  let offset = -(circ / 4); // start at top

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(0deg)' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={thickness} />
        {segments.map((sg, i) => {
          const pct = (sg.value / total) * p;
          const dash = circ * pct;
          const cur = offset;
          offset -= circ * (sg.value / total);
          return (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={sg.color} strokeWidth={thickness}
              strokeLinecap="butt"
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={cur}
              style={{ transition: `stroke-dasharray 1.3s cubic-bezier(.4,0,.2,1) ${i * 0.07}s` }}
            />
          );
        })}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{center}</span>
        {sub && <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{sub}</span>}
      </div>
    </div>
  );
}
