import { useEffect, useState } from 'react';
import { Plus, Users, Calendar, TrendingUp, Activity, Search, Edit2, Trash2 } from 'lucide-react';

const SPECS = [
  { id:1, name:'Tim mạch',      icon:'❤️',  color:'#f43f5e', docs:8,  apts:248, trend:'+15%', pct:88, desc:'Chẩn đoán và điều trị các bệnh tim mạch, mạch vành, suy tim.' },
  { id:2, name:'Nội tổng quát', icon:'🩺',  color:'#0ea5e9', docs:12, apts:212, trend:'+8%',  pct:75, desc:'Khám và điều trị bệnh nội khoa, kiểm tra sức khỏe tổng quát.' },
  { id:3, name:'Da liễu',       icon:'✨',  color:'#a855f7', docs:6,  apts:196, trend:'+22%', pct:70, desc:'Điều trị các bệnh về da, tóc, móng và thẩm mỹ da lâm sàng.' },
  { id:4, name:'Tai Mũi Họng',  icon:'👂',  color:'#f59e0b', docs:5,  apts:178, trend:'+11%', pct:63, desc:'Chuyên khoa tai, mũi, họng, thanh quản và vùng đầu cổ.' },
  { id:5, name:'Tiêu hóa',      icon:'💊',  color:'#10b981', docs:7,  apts:155, trend:'+6%',  pct:55, desc:'Chẩn đoán và điều trị bệnh dạ dày, đại tràng, gan mật.' },
  { id:6, name:'Xương khớp',    icon:'🦴',  color:'#8b5cf6', docs:5,  apts:134, trend:'+9%',  pct:48, desc:'Điều trị bệnh về xương, khớp, cột sống và vận động.' },
];

/* SVG ring */
function Ring({ pct, color, size=80, thick=8 }: { pct:number; color:string; size?:number; thick?:number }) {
  const [p, setP] = useState(0);
  const r = (size-thick)/2, cx=size/2, cy=size/2, circ=2*Math.PI*r;
  const dash = (p/100)*circ;
  useEffect(()=>{ const t=setTimeout(()=>setP(pct),200); return()=>clearTimeout(t); },[pct]);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{transform:'rotate(-90deg)'}}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={thick} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={thick}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ-dash}`}
        style={{transition:'stroke-dasharray 1.3s cubic-bezier(.34,1.56,.64,1)'}} />
    </svg>
  );
}

/* Spec card */
function SpecCard({ sp, i }: { sp:typeof SPECS[0]; i:number }) {
  const [vis, setVis] = useState(false);
  useEffect(()=>{ const t=setTimeout(()=>setVis(true),80+i*70); return()=>clearTimeout(t); },[i]);

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden card-tilt anim-enter-up cursor-default`}
      style={{ animationDelay: `${i*70}ms`, opacity: vis?1:0 }}>
      {/* Color bar top */}
      <div className="h-1 w-full" style={{background:`linear-gradient(90deg,${sp.color},${sp.color}66)`}} />

      <div className="p-6">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2 flex-shrink-0"
              style={{ background: `${sp.color}10`, borderColor: `${sp.color}20` }}>
              {sp.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{sp.name}</h3>
              <p className="text-slate-400 text-xs mt-1 max-w-[220px] leading-relaxed">{sp.desc}</p>
            </div>
          </div>

          {/* Ring */}
          <div className="relative flex-shrink-0 flex items-center justify-center">
            <Ring pct={sp.pct} color={sp.color} size={64} thick={7} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-black" style={{color:sp.color}}>{sp.pct}%</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 mb-4" />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { icon:Users,      val:sp.docs,             lbl:'Bác sĩ' },
            { icon:Calendar,   val:sp.apts,             lbl:'Lịch hẹn' },
            { icon:TrendingUp, val:sp.trend,            lbl:'Tăng trưởng' },
          ].map(({ icon:Icon, val, lbl }) => (
            <div key={lbl} className="text-center bg-slate-50 rounded-xl py-3 border border-slate-100">
              <Icon size={12} className="text-slate-400 mx-auto mb-1.5" />
              <p className={`text-sm font-bold ${lbl==='Tăng trưởng'?'text-emerald-600':'text-slate-800'}`}>{val}</p>
              <p className="text-xs text-slate-400 mt-0.5">{lbl}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
            style={{ background: `linear-gradient(135deg,${sp.color},${sp.color}cc)` }}>
            <Activity size={12} />Xem chi tiết
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:border-sky-300 hover:text-sky-500 transition-all">
            <Edit2 size={13} />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:border-rose-300 hover:text-rose-500 transition-all">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Specialties() {
  const [q, setQ] = useState('');
  const shown = SPECS.filter(s => s.name.toLowerCase().includes(q.toLowerCase()));
  const totalApts = SPECS.reduce((a,s)=>a+s.apts,0);
  const totalDocs = SPECS.reduce((a,s)=>a+s.docs,0);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur-sm border-b border-slate-200 px-8 py-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-black text-slate-900">Chuyên khoa</h1>
            <p className="text-slate-400 text-sm mt-0.5">{SPECS.length} chuyên khoa · {totalDocs} bác sĩ · {totalApts} lịch hẹn tháng này</p>
          </div>
          <button className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-sky-200 hover:shadow-md">
            <Plus size={15} />Thêm chuyên khoa
          </button>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label:'Tổng lịch hẹn',   val:totalApts, color:'#0ea5e9' },
            { label:'Tổng bác sĩ',     val:totalDocs, color:'#10b981' },
            { label:'Chuyên khoa',      val:SPECS.length,  color:'#8b5cf6' },
            { label:'Tăng trưởng tb.', val:'11.8%',   color:'#f59e0b' },
          ].map(({ label, val, color }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}12` }}>
                <TrendingUp size={14} style={{ color }} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">{val}</p>
                <p className="text-xs text-slate-400">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-8 pt-5 pb-1 flex items-center gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={e=>setQ(e.target.value)}
            placeholder="Tìm chuyên khoa..."
            className="pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 w-56 transition-all" />
        </div>
        <span className="text-sm text-slate-400">Hiển thị {shown.length}/{SPECS.length} chuyên khoa</span>
      </div>

      {/* Cards */}
      <div className="px-8 py-5 grid grid-cols-2 gap-4">
        {shown.map((sp, i) => <SpecCard key={sp.id} sp={sp} i={i} />)}
      </div>
    </div>
  );
}
