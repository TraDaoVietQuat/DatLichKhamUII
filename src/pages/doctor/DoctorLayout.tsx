import { useState } from 'react';
import { Activity, Calendar, Clock, Pill, LogOut, Bell, ChevronDown, User } from 'lucide-react';

const navLinks = [
  { label: 'Lịch hẹn',     href: 'appointments', icon: Calendar },
  { label: 'Lịch làm việc', href: 'schedule',     icon: Clock },
  { label: 'Tra cứu thuốc', href: 'drugs',         icon: Pill },
];

interface Props {
  page: string;
  onNav: (p: string) => void;
  children: React.ReactNode;
}

export default function DoctorLayout({ page, onNav, children }: Props) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: '#f8fafc' }}>
      {/* Top navbar */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center px-8 gap-8 sticky top-0 z-30 shadow-sm">
        {/* Brand */}
        <button onClick={() => onNav('appointments')} className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#0d9488,#0891b2)', boxShadow: '0 4px 14px rgba(13,148,136,0.4)' }}>
            <Activity size={16} className="text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-slate-900 text-sm font-black">MedBook</p>
            <p className="text-teal-600 text-xs font-medium">Đặt lịch thông minh</p>
          </div>
        </button>

        {/* Nav links */}
        <div className="flex items-center gap-1 flex-1">
          {navLinks.map(({ label, href, icon: Icon }) => {
            const active = page === href;
            return (
              <button key={href} onClick={() => onNav(href)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150"
                style={{
                  background: active ? 'rgba(13,148,136,0.08)' : 'transparent',
                  color: active ? '#0d9488' : '#64748b',
                  borderBottom: active ? '2px solid #0d9488' : '2px solid transparent',
                  borderRadius: active ? '10px 10px 0 0' : '10px',
                }}>
                <Icon size={15} strokeWidth={active ? 2.2 : 1.8} />
                {label}
              </button>
            );
          })}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
            <Bell size={16} className="text-slate-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" style={{ boxShadow: '0 0 6px rgba(244,63,94,.8)' }} />
          </button>

          <div className="relative">
            <button onClick={() => setProfileOpen(o => !o)}
              className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                style={{ background: 'linear-gradient(135deg,#0d9488,#0891b2)' }}>
                <User size={13} />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-none">Nguyễn Văn An</p>
                <p className="text-xs text-slate-400 mt-0.5">Bác sĩ tim mạch</p>
              </div>
              <ChevronDown size={13} className={`text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-800">Nguyễn Văn An</p>
                  <p className="text-xs text-slate-400">doctor@medbook.vn</p>
                </div>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  <User size={14} />Hồ sơ cá nhân
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-colors">
                  <LogOut size={14} />Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
