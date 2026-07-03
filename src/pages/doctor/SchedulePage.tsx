import { useEffect, useState } from 'react';
import { Calendar, Clock, Plus, Trash2, AlertCircle, Sun, Moon, CheckCircle2 } from 'lucide-react';

const HOLIDAYS = [
  { date: '2026-09-02', name: 'Quốc khánh' },
  { date: '2027-01-01', name: 'Tết dương lịch' },
  { date: '2027-04-30', name: 'Ngày Giải phóng miền Nam' },
  { date: '2027-05-01', name: 'Quốc tế lao động' },
  { date: '2027-09-02', name: 'Quốc khánh' },
];

const INIT_SHIFTS = [
  { id:1, date:'2026-05-04', start:'08:00', end:'11:30', booked:7,  total:7 },
  { id:2, date:'2026-05-05', start:'08:00', end:'11:30', booked:4,  total:7 },
  { id:3, date:'2026-05-06', start:'08:00', end:'11:30', booked:5,  total:7 },
  { id:4, date:'2026-05-07', start:'08:00', end:'11:30', booked:6,  total:7 },
  { id:5, date:'2026-05-08', start:'08:00', end:'11:30', booked:5,  total:7 },
  { id:6, date:'2026-05-09', start:'08:00', end:'11:30', booked:5,  total:7 },
  { id:7, date:'2026-07-04', start:'08:00', end:'11:30', booked:2,  total:8 },
  { id:8, date:'2026-07-05', start:'08:00', end:'11:30', booked:0,  total:8 },
  { id:9, date:'2026-07-10', start:'14:00', end:'17:00', booked:3,  total:6 },
];

function ShiftBar({ booked, total }: { booked: number; total: number }) {
  const [w, setW] = useState(0);
  const pct = Math.round((booked / total) * 100);
  const color = pct >= 100 ? '#f43f5e' : pct >= 70 ? '#f59e0b' : '#0d9488';
  useEffect(() => { const t = setTimeout(() => setW(pct), 200); return () => clearTimeout(t); }, [pct]);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${w}%`, background: color }} />
      </div>
      <span className="text-xs font-bold shrink-0" style={{ color }}>{booked}/{total}</span>
    </div>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' });
}
function formatHolidayDate(d: string) {
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/* ── Mini calendar month view ── */
function MiniCalendar({ shifts }: { shifts: typeof INIT_SHIFTS }) {
  const today = new Date('2026-07-03');
  const year = 2026, month = 6; // July = index 6
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const shiftDates = new Set(shifts.map(s => s.date));

  const cells: (number | null)[] = [];
  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const dayNames = ['T2','T3','T4','T5','T6','T7','CN'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800">Tháng 7, 2026</h3>
        <span className="text-xs text-teal-600 font-semibold bg-teal-50 px-2 py-0.5 rounded-full">
          {shifts.filter(s => s.date.startsWith('2026-07')).length} ca
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(d => <div key={d} className="text-center text-xs text-slate-400 font-semibold py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const dateStr = `2026-07-${String(d).padStart(2,'0')}`;
          const hasShift = shiftDates.has(dateStr);
          const isToday = d === 3;
          return (
            <div key={i} className="aspect-square flex flex-col items-center justify-center rounded-xl text-xs cursor-default transition-all"
              style={{
                background: isToday ? '#0d9488' : hasShift ? '#f0fdfa' : 'transparent',
                color: isToday ? '#fff' : hasShift ? '#0d9488' : '#334155',
                fontWeight: isToday || hasShift ? 700 : 400,
                border: hasShift && !isToday ? '1px solid #99f6e4' : isToday ? 'none' : '1px solid transparent',
              }}>
              {d}
              {hasShift && !isToday && <span className="w-1 h-1 rounded-full bg-teal-400 mt-0.5" />}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-3 h-3 rounded-full bg-teal-100 border border-teal-300 block" />Có ca khám</div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-3 h-3 rounded-full bg-teal-500 block" />Hôm nay</div>
      </div>
    </div>
  );
}

export default function SchedulePage() {
  const [date, setDate] = useState('');
  const [start, setStart] = useState('08:00');
  const [end, setEnd] = useState('11:30');
  const [isDayOff, setIsDayOff] = useState(false);
  const [session, setSession] = useState<'morning' | 'afternoon'>('morning');
  const [shifts, setShifts] = useState(INIT_SHIFTS);
  const [saved, setSaved] = useState(false);

  const upcoming = shifts.filter(s => s.date >= '2026-07-03').sort((a,b) => a.date.localeCompare(b.date));
  const past = shifts.filter(s => s.date < '2026-07-03').sort((a,b) => b.date.localeCompare(a.date));

  const handleSave = () => {
    if (!date) return;
    const newShift = { id: Date.now(), date, start: isDayOff ? '' : start, end: isDayOff ? '' : end, booked: 0, total: isDayOff ? 0 : 8 };
    setShifts(s => [...s, newShift]);
    setDate(''); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const delShift = (id: number) => setShifts(s => s.filter(sh => sh.id !== id));

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-7">
        <h1 className="text-2xl font-black text-slate-900">Lịch làm việc</h1>
        <p className="text-slate-400 text-sm mt-1">Thêm ca khám hoặc đánh dấu ngày nghỉ.</p>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* ── LEFT: Add form ── */}
        <div className="col-span-2 space-y-5">
          {/* Form card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-teal-50">
                <Plus size={16} className="text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Thêm ca khám</p>
                <p className="text-xs text-slate-400">hoặc đánh dấu ngày nghỉ</p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">Ngày</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="date" value={date} onChange={e => setDate(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 transition-all" />
                </div>
              </div>

              {/* Day off toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all"
                onClick={() => setIsDayOff(o => !o)}>
                <div className="flex items-center gap-3">
                  <AlertCircle size={15} className={isDayOff ? 'text-amber-500' : 'text-slate-400'} />
                  <span className="text-sm font-semibold text-slate-700">Ngày nghỉ</span>
                </div>
                <div className={`rounded-full relative transition-all duration-300 ${isDayOff ? 'bg-amber-400' : 'bg-slate-200'}`}
                  style={{ width: 40, height: 22 }}>
                  <div className="absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-all duration-300"
                    style={{ width: 18, height: 18, left: isDayOff ? 20 : 2 }} />
                </div>
              </div>

              {!isDayOff && (
                <>
                  {/* Session selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2">Ca khám</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'morning' as const, label: 'Buổi sáng', icon: Sun, time: '08:00 – 11:30' },
                        { key: 'afternoon' as const, label: 'Buổi chiều', icon: Moon, time: '13:00 – 17:00' },
                      ].map(({ key, label, icon: Icon, time }) => (
                        <button key={key} onClick={() => { setSession(key); setStart(key==='morning'?'08:00':'13:00'); setEnd(key==='morning'?'11:30':'17:00'); }}
                          className="flex flex-col items-center gap-1 p-3 rounded-xl border text-xs font-semibold transition-all"
                          style={{ background: session===key?'#f0fdfa':'transparent', borderColor: session===key?'#0d9488':'#e2e8f0', color: session===key?'#0d9488':'#64748b' }}>
                          <Icon size={15} />
                          <span>{label}</span>
                          <span className="font-normal opacity-70">{time}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom times */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2">Giờ bắt đầu</label>
                      <div className="relative">
                        <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="time" value={start} onChange={e => setStart(e.target.value)}
                          className="w-full pl-8 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2">Giờ kết thúc</label>
                      <div className="relative">
                        <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="time" value={end} onChange={e => setEnd(e.target.value)}
                          className="w-full pl-8 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Submit */}
              <button onClick={handleSave}
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ background: date ? 'linear-gradient(135deg,#0d9488,#0891b2)' : '#cbd5e1', cursor: date ? 'pointer' : 'not-allowed', boxShadow: date ? '0 8px 24px rgba(13,148,136,0.3)' : 'none' }}
                disabled={!date}>
                {saved ? <><CheckCircle2 size={15} />Đã lưu!</> : <><Plus size={15} />Lưu lịch</>}
              </button>
            </div>
          </div>

          {/* Holidays */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <p className="text-sm font-bold text-slate-800">Ngày lễ sắp tới</p>
              <p className="text-xs text-slate-400 mt-0.5">Theo lịch quốc gia</p>
            </div>
            <div className="p-2">
              {HOLIDAYS.map(h => (
                <div key={h.date} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold bg-rose-50 text-rose-500 shrink-0">
                    {new Date(h.date).getDate()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{h.name}</p>
                    <p className="text-xs text-slate-400">{formatHolidayDate(h.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Calendar + shift list ── */}
        <div className="col-span-3 space-y-5">
          <MiniCalendar shifts={shifts} />

          {/* Upcoming shifts */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">Ca sắp tới</p>
                <p className="text-xs text-slate-400 mt-0.5">{upcoming.length} ca khám</p>
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {upcoming.length === 0 && (
                <p className="text-center text-slate-400 text-sm py-10">Chưa có ca khám nào sắp tới</p>
              )}
              {upcoming.map((s, i) => (
                <ShiftRow key={s.id} s={s} i={i} onDelete={() => delShift(s.id)} />
              ))}
            </div>
          </div>

          {/* Past shifts */}
          {past.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-800">Ca đã qua</p>
                <p className="text-xs text-slate-400 mt-0.5">{past.length} ca khám</p>
              </div>
              <div className="divide-y divide-slate-50">
                {past.map((s, i) => <ShiftRow key={s.id} s={s} i={i} onDelete={() => delShift(s.id)} past />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ShiftRow({ s, i, onDelete, past=false }: { s: typeof INIT_SHIFTS[0]; i: number; onDelete: () => void; past?: boolean }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), 60 + i * 40); return () => clearTimeout(t); }, [i]);
  const pct = s.total ? Math.round((s.booked / s.total) * 100) : 0;

  return (
    <div className="px-6 py-4 flex items-center gap-4 transition-all hover:bg-slate-50/60"
      style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(8px)', transition: `opacity .4s ${i * 40}ms, transform .4s ${i * 40}ms` }}>
      {/* Date badge */}
      <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0"
        style={{ background: past ? '#f8fafc' : '#f0fdfa', border: `1px solid ${past ? '#e2e8f0' : '#99f6e4'}` }}>
        <span className="text-xs font-bold" style={{ color: past ? '#94a3b8' : '#0d9488' }}>
          {new Date(s.date).toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit'})}
        </span>
        <span className="text-xs" style={{ color: past ? '#cbd5e1' : '#5eead4' }}>
          {new Date(s.date).toLocaleDateString('vi-VN',{weekday:'short'})}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-bold text-slate-800">{s.start} – {s.end}</span>
          {!past && s.booked < s.total && <span className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full font-semibold">{s.total - s.booked} slot trống</span>}
          {!past && s.booked === s.total && <span className="text-xs text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full font-semibold">Đã đầy</span>}
        </div>
        <ShiftBar booked={s.booked} total={s.total} />
      </div>

      {/* Delete */}
      {!past && (
        <button onClick={onDelete} className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-all shrink-0">
          <Trash2 size={13} />
        </button>
      )}
    </div>
  );
}
