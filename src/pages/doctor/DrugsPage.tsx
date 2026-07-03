import { useState } from 'react';
import { Search, Pill, AlertCircle, ChevronRight, Star } from 'lucide-react';

const DRUGS = [
  { id:1,  name:'Aspirin 100mg',         group:'Tim mạch',    form:'Viên nén',   unit:'mg',  dose:'1 viên/ngày',  note:'Uống sau ăn sáng',   featured:true,  rating:4.8, warnings:['Thận trọng với người dạ dày', 'Không dùng trước phẫu thuật'] },
  { id:2,  name:'Atorvastatin 20mg',      group:'Tim mạch',    form:'Viên nén',   unit:'mg',  dose:'1 viên/tối',   note:'Uống cùng bữa tối',   featured:true,  rating:4.7, warnings:['Theo dõi men gan'] },
  { id:3,  name:'Amlodipine 5mg',         group:'Huyết áp',    form:'Viên nén',   unit:'mg',  dose:'1 viên/ngày',  note:'Uống buổi sáng',      featured:false, rating:4.6, warnings:['Không ngừng đột ngột'] },
  { id:4,  name:'Metoprolol 50mg',        group:'Tim mạch',    form:'Viên nén',   unit:'mg',  dose:'1 viên x 2/ngày', note:'Cách 12 giờ',      featured:false, rating:4.5, warnings:['Không dùng hen suyễn'] },
  { id:5,  name:'Omeprazole 20mg',        group:'Tiêu hóa',    form:'Viên nang',  unit:'mg',  dose:'1 viên trước ăn', note:'Uống trước ăn 30ph', featured:true,  rating:4.9, warnings:[] },
  { id:6,  name:'Metformin 500mg',        group:'Tiểu đường',  form:'Viên nén',   unit:'mg',  dose:'1 viên x 2/ngày', note:'Sau bữa ăn',        featured:false, rating:4.7, warnings:['Kiểm tra thận định kỳ'] },
  { id:7,  name:'Paracetamol 500mg',      group:'Giảm đau',    form:'Viên nén',   unit:'mg',  dose:'1-2 viên/lần', note:'Cách nhau 6 giờ',     featured:true,  rating:4.9, warnings:['Tối đa 8 viên/ngày', 'Thận trọng khi dùng cùng rượu'] },
  { id:8,  name:'Losartan 50mg',          group:'Huyết áp',    form:'Viên nén',   unit:'mg',  dose:'1 viên/ngày',  note:'Uống cùng giờ mỗi ngày', featured:false, rating:4.6, warnings:['Chống chỉ định mang thai'] },
];

const GROUPS = ['Tất cả', 'Tim mạch', 'Huyết áp', 'Tiêu hóa', 'Tiểu đường', 'Giảm đau'];

const GROUP_COLORS: Record<string,{bg:string;color:string}> = {
  'Tim mạch':   { bg:'#fff1f2', color:'#f43f5e' },
  'Huyết áp':   { bg:'#eff6ff', color:'#3b82f6' },
  'Tiêu hóa':   { bg:'#f0fdf4', color:'#22c55e' },
  'Tiểu đường': { bg:'#fffbeb', color:'#f59e0b' },
  'Giảm đau':   { bg:'#fdf4ff', color:'#a855f7' },
};

function DrugCard({ d, i }: { d: typeof DRUGS[0]; i: number }) {
  const [expanded, setExpanded] = useState(false);
  const gc = GROUP_COLORS[d.group] ?? { bg:'#f8fafc', color:'#64748b' };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
      style={{ animationDelay: `${i * 40}ms` }}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: gc.bg }}>
              <Pill size={18} style={{ color: gc.color }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-900">{d.name}</p>
                {d.featured && <Star size={12} className="fill-amber-400 text-amber-400" />}
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold mt-0.5 inline-block"
                style={{ background: gc.bg, color: gc.color }}>{d.group}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            {d.rating}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-400 mb-0.5">Dạng bào chế</p>
            <p className="text-sm font-semibold text-slate-700">{d.form}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-400 mb-0.5">Liều dùng</p>
            <p className="text-sm font-semibold text-slate-700">{d.dose}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-teal-50 border border-teal-100 mb-3">
          <AlertCircle size={12} className="text-teal-600 shrink-0" />
          <p className="text-xs text-teal-700 font-medium">{d.note}</p>
        </div>

        {d.warnings.length > 0 && (
          <div>
            <button onClick={() => setExpanded(e => !e)} className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold hover:text-amber-700 transition-colors">
              <AlertCircle size={12} />
              {d.warnings.length} lưu ý quan trọng
              <ChevronRight size={12} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
            </button>
            {expanded && (
              <ul className="mt-2 space-y-1">
                {d.warnings.map((w, wi) => (
                  <li key={wi} className="flex items-start gap-2 text-xs text-amber-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DrugsPage() {
  const [q, setQ] = useState('');
  const [group, setGroup] = useState('Tất cả');

  const shown = DRUGS.filter(d => {
    const mQ = !q || d.name.toLowerCase().includes(q.toLowerCase()) || d.group.toLowerCase().includes(q.toLowerCase());
    const mG = group === 'Tất cả' || d.group === group;
    return mQ && mG;
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-7">
        <h1 className="text-2xl font-black text-slate-900">Tra cứu thuốc</h1>
        <p className="text-slate-400 text-sm mt-1">Tìm kiếm thông tin thuốc, liều dùng và lưu ý lâm sàng.</p>
      </div>

      {/* Search hero */}
      <div className="relative mb-7 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage:'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize:'24px 24px' }} />
        <div className="relative">
          <p className="text-white/80 text-sm mb-3">Tìm kiếm nhanh</p>
          <div className="relative max-w-lg">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={e => setQ(e.target.value)}
              placeholder="Tên thuốc, hoạt chất, nhóm điều trị..."
              className="w-full pl-12 pr-5 py-4 text-sm bg-white rounded-xl outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
              style={{ fontSize: 15 }} />
          </div>
          <p className="text-white/50 text-xs mt-3">{DRUGS.length} thuốc trong cơ sở dữ liệu</p>
        </div>
      </div>

      {/* Group filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {GROUPS.map(g => {
          const gc = g !== 'Tất cả' ? (GROUP_COLORS[g] ?? { bg:'#f8fafc', color:'#64748b' }) : { bg:'#0d9488', color:'#fff' };
          const active = group === g;
          return (
            <button key={g} onClick={() => setGroup(g)}
              className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 hover:scale-105"
              style={{
                background: active ? (g === 'Tất cả' ? '#0d9488' : gc.bg) : 'white',
                color: active ? (g === 'Tất cả' ? '#fff' : gc.color) : '#64748b',
                borderColor: active ? (g === 'Tất cả' ? '#0d9488' : gc.color) : '#e2e8f0',
              }}>
              {g}
            </button>
          );
        })}
      </div>

      {/* Results */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-slate-500 font-medium">Tìm thấy <span className="font-bold text-slate-800">{shown.length}</span> thuốc</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {shown.map((d, i) => <DrugCard key={d.id} d={d} i={i} />)}
        {shown.length === 0 && (
          <div className="col-span-2 text-center py-16 text-slate-400">
            <Pill size={36} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">Không tìm thấy thuốc phù hợp</p>
            <p className="text-sm mt-1">Thử từ khóa khác</p>
          </div>
        )}
      </div>
    </div>
  );
}
