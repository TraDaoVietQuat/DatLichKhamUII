import { useState } from 'react';
import { Bell, Search, ChevronDown, LayoutDashboard, Stethoscope } from 'lucide-react';

// Admin portal
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import Specialties from './pages/Specialties';

// Doctor portal
import DoctorLayout from './pages/doctor/DoctorLayout';
import AppointmentsPage from './pages/doctor/AppointmentsPage';
import SchedulePage from './pages/doctor/SchedulePage';
import DrugsPage from './pages/doctor/DrugsPage';

type Portal = 'admin' | 'doctor';

const adminLabels: Record<string,string> = {
  '/admin':             'Dashboard',
  '/admin/doctors':     'Bác sĩ',
  '/admin/specialties': 'Chuyên khoa',
  '/admin/appointments':'Lịch hẹn',
  '/admin/reports':     'Báo cáo',
  '/admin/settings':    'Cài đặt',
};

function AdminPortal() {
  const [page, setPage] = useState('/admin');
  const view = () => {
    switch (page) {
      case '/admin/doctors':     return <Doctors />;
      case '/admin/specialties': return <Specialties />;
      default:                   return <Dashboard />;
    }
  };
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar active={page} onNav={setPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">MedBook</span>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-800">{adminLabels[page]}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input placeholder="Tìm kiếm..." className="pl-8 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 w-40 transition-all focus:w-52" />
            </div>
            <button className="relative p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <Bell size={15} className="text-slate-500" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
            <div className="w-px h-5 bg-slate-200" />
            <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black" style={{ background:'linear-gradient(135deg,#38bdf8,#818cf8)' }}>QT</div>
              <span className="text-xs font-semibold text-slate-700 hidden sm:block">Quản trị viên</span>
              <ChevronDown size={12} className="text-slate-400" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-hidden flex">{view()}</main>
      </div>
    </div>
  );
}

function DoctorPortal() {
  const [page, setPage] = useState('appointments');
  const view = () => {
    switch (page) {
      case 'schedule': return <SchedulePage />;
      case 'drugs':    return <DrugsPage />;
      default:         return <AppointmentsPage />;
    }
  };
  return (
    <DoctorLayout page={page} onNav={setPage}>
      {view()}
    </DoctorLayout>
  );
}

/* ── Portal selector ── */
export default function App() {
  const [portal, setPortal] = useState<Portal>('doctor');

  return (
    <div className="relative">
      {/* Floating portal switcher */}
      <div className="fixed bottom-5 right-5 z-50">
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-2xl shadow-xl p-1">
          <button onClick={() => setPortal('doctor')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all"
            style={{ background: portal==='doctor' ? '#0d9488' : 'transparent', color: portal==='doctor' ? '#fff' : '#64748b' }}>
            <Stethoscope size={13} />Bác sĩ
          </button>
          <button onClick={() => setPortal('admin')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all"
            style={{ background: portal==='admin' ? '#0ea5e9' : 'transparent', color: portal==='admin' ? '#fff' : '#64748b' }}>
            <LayoutDashboard size={13} />Admin
          </button>
        </div>
      </div>

      {portal === 'admin' ? <AdminPortal /> : <DoctorPortal />}
    </div>
  );
}
