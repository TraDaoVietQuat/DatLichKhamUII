import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, XCircle, FileText, Check, X, CalendarDays, ChevronRight, Search, Filter } from 'lucide-react';

const STATUS = {
  pending:   { label: 'Chờ xác nhận', color: '#f59e0b', bg: '#fffbeb', ring: '#fde68a', dot: '#f59e0b' },
  confirmed: { label: 'Đã xác nhận',  color: '#0d9488', bg: '#f0fdfa', ring: '#99f6e4', dot: '#0d9488' },
  done:      { label: 'Hoàn thành',   color: '#6366f1', bg: '#eef2ff', ring: '#c7d2fe', dot: '#6366f1' },
  cancelled: { label: 'Đã hủy',       color: '#f43f5e', bg: '#fff1f2', ring: '#fecdd3', dot: '#f43f5e' },
};
type StatusKey = keyof typeof STATUS;

const APPOINTMENTS = [
  { id:1, patient:'Ngô Thị Hạnh',   avatar:'NH', color:'#0d9488', time:'10:00', date:'2026-07-04', reason:'Khám tim định kỳ',     status:'confirmed' as StatusKey, slot:'Sáng' },
  { id:2, patient:'Phạm Thị Dung',  avatar:'PD', color:'#f59e0b', time:'08:00', date:'2026-07-06', reason:'Đau ngực, khó thở',     status:'pending'   as StatusKey, slot:'Sáng' },
  { id:3, patient:'Trần Văn Khoa',  avatar:'TK', color:'#6366f1', time:'09:30', date:'2026-07-02', reason:'Tái khám sau phẫu thuật',status:'cancelled' as StatusKey, slot:'Sáng' },
  { id:4, patient:'Ngô Thị Hạnh',   avatar:'NH', color:'#0d9488', time:'10:30', date:'2026-07-01', reason:'Huyết áp cao',           status:'cancelled' as StatusKey, slot:'Sáng' },
  { id:5, patient:'Ngô Thị Hạnh',   avatar:'NH', color:'#0d9488', time:'11:00', date:'2026-07-02', reason:'Kiểm tra huyết áp',      status:'done'      as StatusKey, slot:'Sáng' },
  { id:6, patient:'Trần Văn Khoa',  avatar:'TK', color:'#6366f1', time:'09:00', date:'2026-07-02', reason:'Khám tim lần đầu',       status:'done'      as StatusKey, slot:'Sáng' },
  { id:7, patient:'Ngô Thị Hạnh',   avatar:'NH', color:'#0d9488', time:'08:30', date:'2026-06-13', reason:'Siêu âm tim',            status:'done'      as StatusKey, slot:'Sáng' },
  { id:8, patient:'Phạm Thị Dung',  avatar:'PD', color:'#f59e0b', time:'08:00', date:'2026-06-13', reason:'Điện tim EKG',           status:'done'      as StatusKey, slot:'Sáng' },
];

const FILTERS: { key: StatusKey | 'all'; label: string }[] = [
  { key: 'all',       label: 'Tất cả' },
  { key: 'pending',   label: 'Chờ xác nhận' },
  { key: 'confirmed', label: 'Đã xác nhận' },
  { key: 'done',      label: 'Hoàn thành' },
  { key: 'cancelled', label: 'Đã hủy' },
];

function formatDate(d: string) {
  const dt = new Date(d);
  return dt.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
}

function groupByDate(appts: typeof APPOINTMENTS) {
  const map = new Map<string, typeof APPOINTMENTS>();
  appts.forEach(a => {
    if (!map.has(a.date)) map.set(a.date, []);
    map.get(a.date)!.push(a);
  });
  return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
}

/* ── Animated card ── */
function ApptCard({ a, i }: { a: typeof APPOINTMENTS[0]; i: number }) {
  const [vis, setVis] = useState(false);
  const [acting, setActing] = useState<string | null>(null);
  const st = STATUS[a.status];
  useEffect(() => { const t = setTimeout(() => setVis(true), 60 + i * 50); return () => clearTimeout(t); }, [i]);

  const isToday = a.date === '2026-07-03';

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
      style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(12px)', transition: `opacity .5s ease ${i * 50}ms, transform .5s ease ${i * 50}ms, box-shadow .2s, translate .2s` }}>
      {/* Left color stripe by status */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: st.color }} />

      <div className="flex items-center gap-4 px-6 py-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-sm font-black shrink-0 shadow-sm"
          style={{ background: `linear-gradient(135deg,${a.color},${a.color}bb)` }}>
          {a.avatar}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-bold text-slate-900">{a.patient}</p>
            {isToday && <span className="text-xs px-1.5 py-0.5 rounded-md bg-teal-50 text-teal-700 font-semibold border border-teal-100">Hôm nay</span>}
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-2">
            <CalendarDays size={11} />
            {a.time} · {a.slot}
          </p>
          <p className="text-xs text-slate-500 mt-1 italic">"{a.reason}"</p>
        </div>

        {/* Status + Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ring-1"
            style={{ background: st.bg, color: st.color, ringColor: st.ring }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }} />
            {st.label}
          </span>

          {a.status === 'pending' && (
            <div className="flex gap-2">
              <button onClick={() => setActing('approve')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg,#0d9488,#0891b2)', boxShadow: '0 4px 12px rgba(13,148,136,0.3)' }}>
                <Check size={12} />Duyệt
              </button>
              <button onClick={() => setActing('reject')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-rose-200 text-rose-500 hover:bg-rose-50 transition-all">
                <X size={12} />Từ chối
              </button>
            </div>
          )}

          {a.status === 'confirmed' && (
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-teal-200 text-teal-700 hover:bg-teal-50 transition-all">
              <FileText size={12} />Ghi kết luận
            </button>
          )}

          {(a.status === 'done' || a.status === 'cancelled') && (
            <button className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 transition-all">
              <ChevronRight size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Confirmation modal inline */}
      {acting && (
        <div className="border-t border-slate-100 px-6 py-3 flex items-center justify-between"
          style={{ background: acting === 'approve' ? '#f0fdfa' : '#fff1f2' }}>
          <p className="text-sm font-medium" style={{ color: acting === 'approve' ? '#0d9488' : '#f43f5e' }}>
            {acting === 'approve' ? '✓ Xác nhận duyệt lịch hẹn này?' : '✗ Xác nhận từ chối lịch hẹn này?'}
          </p>
          <div className="flex gap-2">
            <button onClick={() => setActing(null)} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white transition-all">Hủy</button>
            <button onClick={() => setActing(null)} className="text-xs px-3 py-1.5 rounded-lg text-white font-bold transition-all"
              style={{ background: acting === 'approve' ? '#0d9488' : '#f43f5e' }}>
              Xác nhận
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AppointmentsPage() {
  const [filter, setFilter] = useState<StatusKey | 'all'>('all');
  const [q, setQ] = useState('');

  const counts = {
    all:       APPOINTMENTS.length,
    pending:   APPOINTMENTS.filter(a => a.status === 'pending').length,
    confirmed: APPOINTMENTS.filter(a => a.status === 'confirmed').length,
    done:      APPOINTMENTS.filter(a => a.status === 'done').length,
    cancelled: APPOINTMENTS.filter(a => a.status === 'cancelled').length,
  };

  const shown = APPOINTMENTS.filter(a => {
    const mF = filter === 'all' || a.status === filter;
    const mQ = !q || a.patient.toLowerCase().includes(q.toLowerCase());
    return mF && mQ;
  });
  const grouped = groupByDate(shown);
  const today = '2026-07-03';

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Page title */}
      <div className="mb-7">
        <h1 className="text-2xl font-black text-slate-900">Lịch hẹn của tôi</h1>
        <p className="text-slate-400 text-sm mt-1">Duyệt lịch hẹn và ghi kết luận sau khi khám.</p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-3 mb-7">
        {[
          { label:'Chờ xác nhận', val: counts.pending,   color:'#f59e0b', icon: Clock,        bg:'#fffbeb' },
          { label:'Đã xác nhận',  val: counts.confirmed, color:'#0d9488', icon: CheckCircle2,  bg:'#f0fdfa' },
          { label:'Hoàn thành',   val: counts.done,      color:'#6366f1', icon: CheckCircle2,  bg:'#eef2ff' },
          { label:'Đã hủy',       val: counts.cancelled, color:'#f43f5e', icon: XCircle,       bg:'#fff1f2' },
        ].map(({ label, val, color, icon: Icon, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
              <Icon size={18} style={{ color }} strokeWidth={2} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 leading-none">{val}</p>
              <p className="text-xs text-slate-400 mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150"
              style={{
                background: filter === f.key ? '#0d9488' : 'transparent',
                color: filter === f.key ? '#fff' : '#64748b',
              }}>
              {f.label}
              <span className="text-xs px-1.5 py-0.5 rounded-full"
                style={{ background: filter === f.key ? 'rgba(255,255,255,.2)' : '#f1f5f9', color: filter === f.key ? '#fff' : '#64748b', fontWeight: 700 }}>
                {counts[f.key as keyof typeof counts] ?? counts.all}
              </span>
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={e=>setQ(e.target.value)}
            placeholder="Tìm bệnh nhân..."
            className="pl-8 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 w-44 transition-all" />
        </div>
      </div>

      {/* Grouped list */}
      <div className="space-y-7">
        {grouped.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Filter size={32} className="mx-auto mb-3 opacity-40" />
            <p className="font-semibold">Không có lịch hẹn nào</p>
          </div>
        )}
        {grouped.map(([date, appts]) => (
          <div key={date}>
            {/* Date header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2">
                {date === today && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500 text-white font-bold">Hôm nay</span>
                )}
                <span className="text-sm font-bold text-slate-700 capitalize">{formatDate(date)}</span>
              </div>
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium">{appts.length} lịch</span>
            </div>
            <div className="space-y-3">
              {appts.map((a, i) => <ApptCard key={a.id} a={a} i={i} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
