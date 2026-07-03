import { useEffect, useRef, useState } from 'react';
import { Search, Plus, Star, Phone, Mail, Calendar, Users, Award, X, ChevronRight } from 'lucide-react';

const DOCS = [
  { id:1, name:'Trần Minh Khoa', degree:'PGS.TS.BS', spec:'Tim mạch', exp:12, rating:4.9, pts:1240, room:'P.204', phone:'0901 234 567', email:'khoa.tran@medbook.vn', ini:'TK', from:'#0ea5e9', to:'#0369a1', tag:'Chuyên gia hàng đầu', active:true },
  { id:2, name:'Nguyễn Thu Hà',   degree:'TS.BS',    spec:'Da liễu',      exp:8,  rating:4.8, pts:980,  room:'P.115', phone:'0912 345 678', email:'ha.nguyen@medbook.vn', ini:'NH', from:'#f472b6', to:'#be185d', tag:'Được yêu thích',   active:true },
  { id:3, name:'Đỗ Văn Long',     degree:'GS.TS.BS', spec:'Tiêu hóa',     exp:15, rating:4.7, pts:1560, room:'P.308', phone:'0923 456 789', email:'long.do@medbook.vn',   ini:'DL', from:'#34d399', to:'#059669', tag:'Nhiều kinh nghiệm', active:true },
  { id:4, name:'Lê Thị Mai',      degree:'TS.BS',    spec:'Tai Mũi Họng', exp:10, rating:4.9, pts:1102, room:'P.107', phone:'0934 567 890', email:'mai.le@medbook.vn',    ini:'LM', from:'#fbbf24', to:'#d97706', tag:'Đặt lịch nhiều',   active:true },
  { id:5, name:'Phạm Anh Tuấn',   degree:'BS.CKI',   spec:'Nội tổng quát',exp:6,  rating:4.6, pts:780,  room:'P.211', phone:'0945 678 901', email:'tuan.pham@medbook.vn', ini:'PT', from:'#a78bfa', to:'#7c3aed', tag:'Bác sĩ trẻ',       active:true },
  { id:6, name:'Hoàng Bảo Châu',  degree:'PGS.BS',   spec:'Xương khớp',   exp:11, rating:4.8, pts:934,  room:'P.316', phone:'0956 789 012', email:'chau.hoang@medbook.vn',ini:'HC', from:'#2dd4bf', to:'#0f766e', tag:'Chuyên gia',        active:false },
];
type Doc = typeof DOCS[0];

/* ── Tilt card ── */
function TiltCard({ children, className='', style={} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const fn = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateZ(6px)`;
    el.style.boxShadow = `${-x*20}px ${y*20}px 48px rgba(0,0,0,0.1)`;
  };
  const reset = () => { if (ref.current) { ref.current.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateZ(0)'; ref.current.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; } };
  return (
    <div ref={ref} onMouseMove={fn} onMouseLeave={reset} className={`transition-[box-shadow] duration-300 ${className}`}
      style={{ transformStyle: 'preserve-3d', transition: 'transform .18s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', ...style }}>
      {children}
    </div>
  );
}

/* ── Detail drawer ── */
function Drawer({ doc, onClose }: { doc: Doc; onClose: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 10); return () => clearTimeout(t); }, []);
  const close = () => { setShow(false); setTimeout(onClose, 300); };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" style={{ opacity: show ? 1 : 0, transition: 'opacity .3s' }} onClick={close} />
      {/* Panel */}
      <div className="relative ml-auto w-96 h-full bg-white shadow-2xl flex flex-col"
        style={{ transform: show ? 'translateX(0)' : 'translateX(100%)', transition: 'transform .3s cubic-bezier(.4,0,.2,1)' }}>
        {/* Header band */}
        <div className="h-32 relative overflow-hidden shrink-0"
          style={{ background: `linear-gradient(135deg,${doc.from},${doc.to})` }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '20px 20px' }} />
          <button onClick={close} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all">
            <X size={14} />
          </button>
          {/* Avatar */}
          <div className="absolute -bottom-8 left-6 w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-xl"
            style={{ background: `linear-gradient(135deg,${doc.from},${doc.to})`, border: '3px solid white' }}>
            {doc.ini}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pt-12 pb-6">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="text-lg font-black text-slate-900">{doc.name}</h2>
              <p className="text-slate-400 text-sm">{doc.degree} · {doc.spec}</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold mt-1" style={{ background: `${doc.from}15`, color: doc.from }}>
              {doc.tag}
            </span>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1.5 mt-3 mb-5">
            {[1,2,3,4,5].map(s => <Star key={s} size={14} className={s <= Math.round(doc.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'} />)}
            <span className="text-sm font-bold text-slate-700 ml-1">{doc.rating}</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Award,    val: `${doc.exp} năm`, lbl: 'Kinh nghiệm' },
              { icon: Users,    val: doc.pts.toLocaleString(), lbl: 'Bệnh nhân' },
              { icon: Calendar, val: doc.room, lbl: 'Phòng khám' },
            ].map(({ icon: Icon, val, lbl }) => (
              <div key={lbl} className="rounded-xl p-3 text-center border border-slate-100 bg-slate-50">
                <Icon size={14} className="text-slate-400 mx-auto mb-1" />
                <p className="text-sm font-bold text-slate-800">{val}</p>
                <p className="text-xs text-slate-400">{lbl}</p>
              </div>
            ))}
          </div>

          {/* Contact */}
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Liên hệ</h3>
          <div className="space-y-2 mb-6">
            <a href={`tel:${doc.phone}`} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-sky-200 hover:bg-sky-50 transition-all group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${doc.from}15` }}>
                <Phone size={13} style={{ color: doc.from }} />
              </div>
              <span className="text-sm text-slate-700 group-hover:text-sky-700">{doc.phone}</span>
            </a>
            <a href={`mailto:${doc.email}`} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-sky-200 hover:bg-sky-50 transition-all group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${doc.from}15` }}>
                <Mail size={13} style={{ color: doc.from }} />
              </div>
              <span className="text-sm text-slate-700 group-hover:text-sky-700">{doc.email}</span>
            </a>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50">
            <span className="text-sm font-medium text-slate-700">Trạng thái</span>
            <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${doc.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${doc.active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              {doc.active ? 'Đang hoạt động' : 'Nghỉ tạm thời'}
            </span>
          </div>
        </div>

        <div className="px-6 pb-6 shrink-0">
          <button className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: `linear-gradient(135deg,${doc.from},${doc.to})` }}>
            Đặt lịch khám
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Doctor card ── */
function DocCard({ doc, i, onClick }: { doc: Doc; i: number; onClick: () => void }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), 80 + i * 60); return () => clearTimeout(t); }, [i]);

  return (
    <TiltCard
      className={`rounded-2xl bg-white border border-slate-200 cursor-pointer overflow-hidden anim-enter-up`}
      style={{ opacity: vis ? 1 : 0, animationDelay: `${i * 60}ms` }}
    >
      <div onClick={onClick} className="p-5">
        {/* Top */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center text-white text-sm font-black shadow-md"
              style={{ background: `linear-gradient(135deg,${doc.from},${doc.to})` }}>
              {doc.ini}
              {doc.active && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-tight">{doc.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{doc.degree}</p>
            </div>
          </div>
          <ChevronRight size={15} className="text-slate-300 mt-1 shrink-0" />
        </div>

        {/* Specialty tag */}
        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full mb-4"
          style={{ background: `${doc.from}12`, color: doc.from }}>
          {doc.spec}
        </span>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { val: `${doc.exp}n`, lbl: 'Kinh nghiệm' },
            { val: doc.pts.toLocaleString(), lbl: 'Bệnh nhân' },
            { val: doc.room, lbl: 'Phòng' },
          ].map(({ val, lbl }) => (
            <div key={lbl} className="text-center bg-slate-50 rounded-xl py-2">
              <p className="text-sm font-bold text-slate-800">{val}</p>
              <p className="text-xs text-slate-400">{lbl}</p>
            </div>
          ))}
        </div>

        {/* Rating row */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={11} className={s <= Math.round(doc.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'} />
            ))}
            <span className="text-xs font-bold text-slate-600 ml-1">{doc.rating}</span>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{ background: `${doc.from}10`, color: doc.from }}>
            {doc.tag}
          </span>
        </div>
      </div>
    </TiltCard>
  );
}

/* ── Page ── */
export default function Doctors() {
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<Doc | null>(null);
  const [filter, setFilter] = useState('Tất cả');
  const filters = ['Tất cả', 'Tim mạch', 'Da liễu', 'Tiêu hóa', 'Nội tổng quát'];

  const shown = DOCS.filter(d => {
    const matchQ = d.name.toLowerCase().includes(q.toLowerCase()) || d.spec.toLowerCase().includes(q.toLowerCase());
    const matchF = filter === 'Tất cả' || d.spec === filter;
    return matchQ && matchF;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur-sm border-b border-slate-200 px-8 py-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-black text-slate-900">Đội ngũ bác sĩ</h1>
            <p className="text-slate-400 text-sm mt-0.5">{DOCS.length} bác sĩ · {DOCS.filter(d=>d.active).length} đang hoạt động</p>
          </div>
          <button className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-sky-200 hover:shadow-md">
            <Plus size={15} />Thêm bác sĩ
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={e=>setQ(e.target.value)}
              placeholder="Tìm bác sĩ, chuyên khoa..."
              className="pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 w-56 transition-all" />
          </div>
          <div className="flex gap-1.5">
            {filters.map(f => (
              <button key={f} onClick={()=>setFilter(f)}
                className={`text-xs px-3.5 py-2 rounded-xl font-semibold transition-all ${f===filter?'bg-sky-500 text-white shadow-sm':'bg-white border border-slate-200 text-slate-500 hover:border-sky-300 hover:text-sky-600'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="px-8 py-6 grid grid-cols-3 gap-4">
        {shown.map((d, i) => <DocCard key={d.id} doc={d} i={i} onClick={()=>setSelected(d)} />)}
      </div>

      {/* Drawer */}
      {selected && <Drawer doc={selected} onClose={()=>setSelected(null)} />}
    </div>
  );
}
