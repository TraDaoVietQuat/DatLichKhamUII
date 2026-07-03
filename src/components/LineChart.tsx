import { useEffect, useState } from 'react';

interface Props {
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
}

export default function LineChart({ data, labels = [], color = '#38bdf8', height = 160 }: Props) {
  const [progress, setProgress] = useState(0);
  const uid = `lc${Math.random().toString(36).slice(2, 7)}`;
  const W = 560, H = height, pad = { t: 12, r: 12, b: 28, l: 12 };
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;

  const pts = data.map((v, i) => ({
    x: pad.l + (i / (data.length - 1)) * iw,
    y: pad.t + (1 - (v - min) / range) * ih,
  }));

  const curve = pts.reduce((acc, p, i) => {
    if (i === 0) return `M${p.x},${p.y}`;
    const pp = pts[i - 1];
    const cx = (pp.x + p.x) / 2;
    return `${acc} C${cx},${pp.y} ${cx},${p.y} ${p.x},${p.y}`;
  }, '');

  const area = `${curve} L${pts.at(-1)!.x},${H - pad.b} L${pts[0].x},${H - pad.b} Z`;

  useEffect(() => { const t = setTimeout(() => setProgress(1), 80); return () => clearTimeout(t); }, []);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height }} className="overflow-visible">
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <filter id={`g${uid}`}>
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* horizontal grid lines */}
        {[0.25, 0.5, 0.75].map((f, i) => (
          <line key={i} x1={pad.l} x2={W - pad.r}
            y1={pad.t + f * ih} y2={pad.t + f * ih}
            stroke="rgba(0,0,0,0.04)" strokeWidth="1" strokeDasharray="4 4" />
        ))}
      </defs>

      {/* Grid */}
      {[0.25, 0.5, 0.75].map((f, i) => (
        <line key={i} x1={pad.l} x2={W - pad.r}
          y1={pad.t + f * ih} y2={pad.t + f * ih}
          stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
      ))}

      {/* Area */}
      <path d={area} fill={`url(#${uid})`}
        style={{ opacity: progress, transition: 'opacity 1s ease 0.4s' }} />

      {/* Line */}
      <path d={curve} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
        filter={`url(#g${uid})`}
        strokeDasharray="2000" strokeDashoffset={progress ? 0 : 2000}
        style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(.4,0,.2,1)' }} />

      {/* Last dot with pulse */}
      {progress === 1 && (
        <>
          <circle cx={pts.at(-1)!.x} cy={pts.at(-1)!.y} r="6" fill={color} opacity="0.2">
            <animate attributeName="r" values="4;9;4" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx={pts.at(-1)!.x} cy={pts.at(-1)!.y} r="4" fill={color} stroke="white" strokeWidth="2" />
        </>
      )}

      {/* X labels */}
      {labels.map((lbl, i) => lbl && (
        <text key={i}
          x={pad.l + (i / (data.length - 1)) * iw} y={H - 6}
          textAnchor="middle" fontSize="10" fill="rgba(100,116,139,0.7)"
          style={{ fontFamily: 'Inter,sans-serif' }}>
          {lbl}
        </text>
      ))}
    </svg>
  );
}
