import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, UserSquare2, GraduationCap, CalendarCheck, 
  Activity as ActivityIcon, ClipboardList, Settings as SettingsIcon,
  Menu, X, RefreshCw, Circle, FileText, ShieldCheck 
} from 'lucide-react';
import { SystemData } from '../types';

interface LayoutProps {
  data: SystemData;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  syncStatus: 'idle' | 'syncing' | 'error' | 'success';
  onSync: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ 
  data, activeTab, setActiveTab, syncStatus, onSync, children 
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'pendaftaran', label: 'Pendaftaran Dokumen', icon: FileText },
    { id: 'guru', label: 'Direktori Pegawai', icon: GraduationCap },
    { id: 'ahli', label: 'Database Anggota', icon: Users },
    { id: 'ajk', label: 'Struktur Taktikal', icon: UserSquare2 },
    { id: 'kehadiran', label: 'Log Kehadiran', icon: CalendarCheck },
    { id: 'aktiviti', label: 'Rekod Operasi', icon: ActivityIcon },
    { id: 'rancangan', label: 'Pelan Tahunan', icon: ClipboardList },
    { id: 'settings', label: 'Sistem Core', icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
      {/* GLOBAL HUD OVERLAY */}
      <div className="fixed inset-0 pointer-events-none border-[20px] border-white/[0.01] z-[100]"></div>

      {/* SIDEBAR TACTICAL */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-[#020617] border-r border-white/[0.05] flex flex-col transform transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'}`}>
        <div className="p-8 shrink-0">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#020617]"></div>
              </div>
              <div className={`${!isSidebarOpen && 'md:hidden'} transition-all duration-300`}>
                <h2 className="font-black text-lg tracking-tighter leading-none text-white italic">
                  E-BOMBA <span className="text-red-600">OS</span>
                </h2>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Command Hub v10.4</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden text-slate-400"><X /></button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-2">
          {menuItems.map((item, idx) => (
            <button 
              key={item.id} 
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 768) setSidebarOpen(false);
              }} 
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all group relative ${activeTab === item.id ? 'bg-red-600/10 text-white shadow-inner' : 'text-slate-500 hover:bg-white/[0.03] hover:text-slate-300'}`}
              style={{ transitionDelay: `${idx * 20}ms` }}
            >
              <item.icon className={`w-5 h-5 shrink-0 transition-all duration-500 ${activeTab === item.id ? 'text-red-500 scale-110 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'group-hover:text-slate-300'}`} />
              <span className={`font-bold text-[10px] uppercase tracking-[0.2em] whitespace-nowrap ${!isSidebarOpen && 'md:hidden'}`}>{item.label}</span>
              {activeTab === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-red-600 rounded-r-full shadow-[0_0_15px_#ef4444]"></div>
              )}
            </button>
          ))}
        </nav>
        
        <div className="p-8 border-t border-white/[0.05] bg-black/20">
           <div className={`flex items-center gap-4 ${!isSidebarOpen && 'md:justify-center'}`}>
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_#ef4444]"></div>
              <div className={`${!isSidebarOpen && 'md:hidden'}`}>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">System Link</p>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Secured / Online</p>
              </div>
           </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 px-8 flex items-center justify-between border-b border-white/[0.05] bg-[#020617]/80 backdrop-blur-xl z-20">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2.5 bg-white/[0.03] border border-white/[0.05] rounded-lg text-slate-400 hover:bg-white/[0.07] transition-all">
              <Menu className="w-5 h-5" />
            </button>
            <div className="h-8 w-px bg-white/[0.05]"></div>
            <div>
              <p className="text-[8px] font-black text-red-600 uppercase tracking-[0.4em] mb-1">Status Report</p>
              <h1 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                {menuItems.find(i => i.id === activeTab)?.label}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="hidden sm:flex flex-col items-end">
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Network Health</span>
                <span className="text-[10px] font-black text-emerald-500 uppercase flex items-center gap-2">
                   {syncStatus === 'syncing' ? 'Syncing...' : 'Stable'}
                   <div className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${syncStatus === 'syncing' ? 'animate-ping' : ''}`}></div>
                </span>
             </div>
             <button onClick={onSync} className="relative p-3 bg-slate-900 border border-white/[0.05] rounded-xl text-slate-400 hover:text-red-500 hover:border-red-500/30 transition-all active:scale-95 group">
                <RefreshCw className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin text-red-500' : 'group-hover:rotate-180 duration-500'}`} />
                {syncStatus === 'syncing' && <div className="absolute inset-0 bg-red-600/5 animate-pulse rounded-xl"></div>}
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 relative scroll-smooth">
          {/* BACKGROUND DECORATION */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full -mr-40 -mt-40 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/5 blur-[100px] rounded-full -ml-20 -mb-20 pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto relative z-10 animate-slide-up">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;