import { useState } from 'react';
import { LayoutDashboard, Users, Stethoscope, Calendar, BarChart2, Settings, LogOut, Activity, Dot } from 'lucide-react';

const nav = [
  { icon: LayoutDashboard, label: 'Dashboard',    href: '/admin' },
  { icon: Users,           label: 'Bác sĩ',       href: '/admin/doctors' },
  { icon: Stethoscope,     label: 'Chuyên khoa',  href: '/admin/specialties' },
  { icon: Calendar,        label: 'Lịch hẹn',     href: '/admin/appointments', badge: 5 },
  { icon: BarChart2,       label: 'Báo cáo',      href: '/admin/reports' },
  { icon: Settings,        label: 'Cài đặt',      href: '/admin/settings' },
];

export default function Sidebar({ active, onNav }: { active: string; onNav: (p: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <aside className="w-56 shrink-0 flex flex-col h-screen select-none" style={{ background: '#0d1117', borderRight: '1px solid rgba(255,255,255,0.05)' }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg,#38bdf8,#0284c7)', boxShadow: '0 4px 16px rgba(56,189,248,0.4)' }}>
          <Activity size={15} className="text-white" />
        </div>
        <div>
          <p className="text-white text-sm font-bold leading-none">MedBook</p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(148,163,184,0.5)' }}>Admin</p>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {nav.map(({ icon: Icon, label, href, badge }) => {
          const isActive = active === href;
          return (
            <button key={href} onClick={() => onNav(href)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 relative"
              style={{
                background: isActive ? 'rgba(56,189,248,0.1)' : hovered === href ? 'rgba(255,255,255,0.04)' : 'transparent',
                color: isActive ? '#38bdf8' : hovered === href ? 'rgba(255,255,255,0.8)' : 'rgba(148,163,184,0.6)',
                fontWeight: isActive ? 600 : 500,
              }}
              onMouseEnter={() => setHovered(href)}
              onMouseLeave={() => setHovered(null)}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r"
                  style={{ background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
              )}
              <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
              <span className="flex-1 text-left">{label}</span>
              {badge && (
                <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                  style={{ background: 'rgba(251,113,133,0.15)', color: '#fb7185', border: '1px solid rgba(251,113,133,0.25)' }}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User */}
      <div className="px-3 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl mt-3 cursor-pointer transition-all"
          style={{ background: 'rgba(255,255,255,0.03)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background: 'linear-gradient(135deg,#38bdf8,#818cf8)' }}>
            QT
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">Quản trị viên</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Dot size={10} className="text-emerald-400 -ml-1" />
              <p className="text-xs" style={{ color: 'rgba(148,163,184,0.45)' }}>Trực tuyến</p>
            </div>
          </div>
          <LogOut size={13} style={{ color: 'rgba(148,163,184,0.3)' }} />
        </div>
      </div>
    </aside>
  );
}
