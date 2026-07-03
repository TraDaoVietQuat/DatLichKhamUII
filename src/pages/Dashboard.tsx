import { useEffect, useRef, useState } from 'react';
import { Calendar, CheckCircle2, XCircle, Clock, TrendingUp, TrendingDown, Download, MoreHorizontal, User, ArrowUpRight } from 'lucide-react';
import LineChart from '../components/LineChart';
import DonutChart from '../components/DonutChart';

/* ─── Data ─── */
const stats = [
  { label: 'Tổng lượt đặt', val: 1284, change: '+12.5%', up: true,  icon: Calendar,      accent: '#0ea5e9', light: '#f0f9ff' },
  { label: 'Hoàn thành',    val: 1091, change: '+8.2%',  up: true,  icon: CheckCircle2,  accent: '#10b981', light: '#f0fdf4' },
  { label: 'Đã hủy',        val: 73,   change: '-3.1%',  up: false, icon: XCircle,       accent: '#f43f5e', light: '#fff1f2' },
  { label: 'Đang chờ',      val: 120,  change: '+5.4%',  up: true,  icon: Clock,         accent: '#f59e0b', light: '#fffbeb' },
];

const trend30 = [42,58,51,73,89,76,95,88,102,115,98,124,108,132,118,145,128,155,138,162,148,171,158,180,165,192,175,204,188,212];
const trendLbl = ['1/6','','','','','','','','','','','','','','','','','','','','','','','','','','','','','1/7'];

const donutSegs = [
  { value: 248, color: '#0ea5e9', label: 'Tim mạch' },
  { value: 212, color: '#14b8a6', label: 'Nội tổng quát' },
  { value: 196, color: '#818cf8', label: 'Da liễu' },
  { value: 178, color: '#fb923c', label: 'Tai Mũi Họng' },
  { value: 155, color: '#4ade80', label: 'Tiêu hóa' },
  { value: 134, color: '#f472b6', label: 'Xương khớp' },
];

const specialties = [
  { name: 'Tim mạch',     count: 248, pct: 88, color: '#0ea5e9' },
  { name: 'Nội tổng quát', count: 212, pct: 75, color: '#14b8a6' },
  { name: 'Da liễu',      count: 196, pct: 70, color: '#818cf8' },
  { name: 'Tai Mũi Họng', count: 178, pct: 63, color: '#fb923c' },
  { name: 'Tiêu hóa',     count: 155, pct: 55, color: '#4ade80' },
  { name: 'Xương khớp',   count: 134, pct: 48, color: '#f472b6' },
];

const peakData = [
  { h: '7h', v: 28 }, { h: '8h', v: 65 }, { h: '9h', v: 95 },
  { h: '10h', v: 82 }, { h: '11h', v: 56 }, { h: '12h', v: 22 },
  { h: '13h', v: 30 }, { h: '14h', v: 68 }, { h: '15h', v: 80 },
  { h: '16h', v: 60 }, { h: '17h', v: 38 },
];
const maxPeak = Math.max(...peakData.map(d => d.v));

const recentRows = [
  { id: 'APT-0841', name: 'Nguyễn Văn An',    doc: 'BS. Trần Minh Khoa',  spec: 'Tim mạch',     time: '08:30 · 03/07', status: 'done' },
  { id: 'APT-0842', name: 'Lê Thị Bình',      doc: 'BS. Nguyễn Thu Hà',   spec: 'Da liễu',      time: '09:00 · 03/07', status: 'wait' },
  { id: 'APT-0843', name: 'Phạm Quốc Cường',  doc: 'BS. Đỗ Văn Long',     spec: 'Tiêu hóa',     time: '10:15 · 03/07', status: 'done' },
  { id: 'APT-0844', name: 'Hoàng Thị Dung',   doc: 'BS. Lê Thị Mai',      spec: 'Tai Mũi Họng', time: '11:00 · 03/07', status: 'cancel' },
  { id: 'APT-0845', name: 'Vũ Minh Đức',      doc: 'BS. Phạm Anh Tuấn',   spec: 'Nội tổng quát',time: '14:00 · 03/07', status: 'wait' },
];
const statusCfg = {
  done:   { label: 'Hoàn thành', bg: '#f0fdf4', color: '#16a34a', ring: '#bbf7d0' },
  wait:   { label: 'Chờ xác nhận', bg: '#fffbeb', color: '#d97706', ring: '#fde68a' },
  cancel: { label: 'Đã hủy',    bg: '#fff1f2', color: '#e11d48', ring: '#fecdd3' },
};

/* ─── Counter ─── */
function Counter({ to, delay = 0 }: { to: number; delay?: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const steps = 36, dt = 900 / steps;
      let i = 0;
      const id = setInterval(() => {
        i++; setV(Math.round(to * (i / steps)));
        if (i >= steps) { clearInterval(id); setV(to); }
      }, dt);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(t);
  }, [to, delay]);
  return <>{v.toLocaleString('vi')}</>;
}

/* ─── Tilt card ─── */
function TiltCard({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) scale(1.015)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = 'perspective(700px) rotateX(0) rotateY(0) scale(1)'; };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      className={`bg-white rounded-2xl border border-slate-200 cursor-default ${className}`}
      style={{ transition: 'transform .2s ease, box-shadow .2s ease', transformStyle: 'preserve-3d', ...style }}>
      {children}
    </div>
  );
}

/* ─── Animated progress bar ─── */
function AnimBar({ pct, color, delay }: { pct: number; color: string; delay: number }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), delay); return () => clearTimeout(t); }, [pct, delay]);
  return (
    <div className="h-2 rounded-full overflow-hidden" style={{ background: '#f1f5f9' }}>
      <div className="h-full rounded-full" style={{ width: `${w}%`, background: color, transition: `width 1s cubic-bezier(.34,1.56,.64,1) ${delay}ms` }} />
    </div>
  );
}

/* ─── Animated peak bar ─── */
function PeakBar({ v, max, h, i }: { v: number; max: number; h: string; i: number }) {
  const [ht, setHt] = useState(0);
  const isPeak = v === max;
  useEffect(() => { const t = setTimeout(() => setHt((v / max) * 100), 300 + i * 60); return () => clearTimeout(t); }, [v, max, i]);
  return (
    <div className="flex-1 flex flex-col items-center gap-1.5 group">
      <div className="w-full flex items-end" style={{ height: 96 }}>
        <div className="w-full rounded-t-lg overflow-hidden"
          style={{ height: `${ht}%`, transition: `height .9s cubic-bezier(.34,1.56,.64,1) ${300 + i * 60}ms`,
            background: isPeak ? 'linear-gradient(to top, #0284c7, #38bdf8)' : '#e2e8f0' }}
          onMouseEnter={(e) => !isPeak && ((e.currentTarget as HTMLDivElement).style.background = '#bae6fd')}
          onMouseLeave={(e) => !isPeak && ((e.currentTarget as HTMLDivElement).style.background = '#e2e8f0')}
        />
      </div>
      <span className={`text-xs ${isPeak ? 'text-sky-600 font-bold' : 'text-slate-400'}`}>{h}</span>
    </div>
  );
}

/* ─── Dashboard ─── */
export default function Dashboard() {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden mx-8 mt-8 mb-6 rounded-2xl anim-scale-in"
        style={{ background: 'linear-gradient(135deg,#0c4a6e 0%,#0369a1 50%,#0284c7 100%)', minHeight: 168 }}>
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
        {/* Blobs */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full anim-blob" style={{ background: 'rgba(56,189,248,0.25)', filter: 'blur(40px)' }} />
        <div className="absolute -bottom-10 left-1/3 w-48 h-48 rounded-full anim-blob" style={{ background: 'rgba(2,132,199,0.3)', filter: 'blur(50px)', animationDelay: '-4s' }} />

        <div className="relative flex items-center justify-between h-full px-8 py-7">
          {/* Left */}
          <div className="text-white">
            <p className="text-sky-200 text-sm font-medium mb-2">Thứ Năm, 03 tháng 7, 2026</p>
            <h1 className="text-3xl font-black leading-tight">Dashboard quản trị</h1>
            <p className="text-sky-100/70 text-sm mt-2 max-w-xs">Tổng quan hoạt động đặt lịch khám bệnh của hệ thống.</p>
            <button className="mt-5 flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 transition-all backdrop-blur-sm">
              <Download size={13} />
              Xuất báo cáo
            </button>
          </div>

          {/* Right: mini sparkline preview */}
          <div className="hidden lg:block w-72 opacity-80">
            <div className="text-white/50 text-xs font-medium mb-2 text-right">Lượt đặt 30 ngày</div>
            <LineChart data={trend30} color="rgba(255,255,255,0.9)" height={80} />
          </div>
        </div>
      </div>

      <div className="px-8 pb-8 space-y-5">

        {/* ── Stats ── */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <TiltCard key={s.label} className={`anim-enter-up delay-${i + 1} p-5 shadow-sm`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.light }}>
                    <Icon size={18} style={{ color: s.accent }} strokeWidth={2} />
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${s.up ? 'text-emerald-700 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                    {s.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {s.change}
                  </span>
                </div>
                <p className="text-3xl font-black text-slate-900 tracking-tight">
                  <Counter to={s.val} delay={i * 80} />
                </p>
                <p className="text-slate-500 text-sm mt-1 font-medium">{s.label}</p>
              </TiltCard>
            );
          })}
        </div>

        {/* ── Chart row ── */}
        <div className="grid grid-cols-5 gap-4">
          {/* Line chart */}
          <div className="col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 anim-enter-up delay-2">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-base font-bold text-slate-800">Xu hướng 30 ngày qua</h2>
                <p className="text-slate-400 text-xs mt-0.5">Lượt đặt lịch theo ngày</p>
              </div>
              <div className="flex gap-1.5">
                {['7N','30N','3T'].map((l, i) => (
                  <button key={l} className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${i === 1 ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-100'}`}>{l}</button>
                ))}
              </div>
            </div>
            <div className="flex items-baseline gap-3 my-4">
              <span className="text-4xl font-black text-slate-900">212</span>
              <span className="text-emerald-600 text-sm font-bold flex items-center gap-1"><TrendingUp size={14} />+14.6%</span>
              <span className="text-slate-400 text-sm">hôm nay</span>
            </div>
            <LineChart data={trend30} labels={trendLbl} color="#0ea5e9" height={148} />
          </div>

          {/* Donut */}
          <div className="col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 anim-enter-up delay-3">
            <h2 className="text-base font-bold text-slate-800 mb-0.5">Phân bổ chuyên khoa</h2>
            <p className="text-slate-400 text-xs mb-5">Tháng 7, 2026</p>
            <div className="flex items-center gap-5">
              <DonutChart segments={donutSegs} size={130} thickness={20} center="1,123" sub="lượt đặt" />
              <div className="flex-1 space-y-2.5">
                {donutSegs.map(sg => (
                  <div key={sg.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: sg.color }} />
                      <span className="text-slate-600 text-xs">{sg.label}</span>
                    </div>
                    <span className="text-slate-800 text-xs font-bold">{sg.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom row ── */}
        <div className="grid grid-cols-5 gap-4">
          {/* Peak hours */}
          <div className="col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 anim-enter-up delay-3">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-slate-800">Giờ cao điểm</h2>
                <p className="text-slate-400 text-xs mt-0.5">Hôm nay</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <div className="flex gap-1.5 items-end" style={{ height: 112 }}>
              {peakData.map((d, i) => <PeakBar key={d.h} v={d.v} max={maxPeak} h={d.h} i={i} />)}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-400 font-medium">Giờ bận nhất</p>
                <p className="text-sm font-bold text-slate-800 mt-1">9:00 – 10:00</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Lượt / giờ</p>
                <p className="text-sm font-bold text-sky-600 mt-1">95 lượt</p>
              </div>
            </div>
          </div>

          {/* Specialty progress */}
          <div className="col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 anim-enter-up delay-4">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-slate-800">Lượt đặt theo chuyên khoa</h2>
                <p className="text-slate-400 text-xs mt-0.5">Tháng 7, 2026</p>
              </div>
              <button className="text-sky-500 hover:text-sky-600 text-xs font-semibold transition-colors">Xem tất cả <ArrowUpRight size={11} className="inline" /></button>
            </div>
            <div className="space-y-4">
              {specialties.map((sp, i) => (
                <div key={sp.name}>
                  <div className="flex justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: sp.color }} />
                      <span className="text-sm font-medium text-slate-700">{sp.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">{sp.count} lượt</span>
                      <span className="text-xs font-bold text-slate-600 w-8 text-right">{sp.pct}%</span>
                    </div>
                  </div>
                  <AnimBar pct={sp.pct} color={sp.color} delay={400 + i * 100} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden anim-enter-up delay-5">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-800">Lịch hẹn gần đây</h2>
              <p className="text-slate-400 text-xs mt-0.5">5 lịch hẹn mới nhất</p>
            </div>
            <button className="text-sky-500 hover:text-sky-600 text-xs font-semibold">Xem tất cả <ArrowUpRight size={11} className="inline" /></button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {['Mã lịch','Bệnh nhân','Bác sĩ','Chuyên khoa','Thời gian','Trạng thái',''].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentRows.map(row => {
                const st = statusCfg[row.status as keyof typeof statusCfg];
                return (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{row.id}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center shrink-0">
                          <User size={12} className="text-slate-400" />
                        </div>
                        <span className="text-sm font-semibold text-slate-800">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-slate-600">{row.doc}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-600">{row.spec}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">{row.time}</td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1"
                        style={{ background: st.bg, color: st.color, ringColor: st.ring }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.color }} />
                        {st.label}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"><MoreHorizontal size={14} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
