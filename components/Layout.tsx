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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pendaftaran', label: 'Pendaftaran Bomba', icon: FileText },
    { id: 'guru', label: 'Guru Pembimbing', icon: GraduationCap },
    { id: 'ahli', label: 'Pangkalan Ahli', icon: Users },
    { id: 'ajk', label: 'Struktur AJK', icon: UserSquare2 },
    { id: 'kehadiran', label: 'Log Kehadiran', icon: CalendarCheck },
    { id: 'aktiviti', label: 'Laporan Aktiviti', icon: ActivityIcon },
    { id: 'rancangan', label: 'Rancangan', icon: ClipboardList },
    { id: 'settings', label: 'Tetapan Admin', icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen bg-brand-dark text-slate-200 overflow-hidden font-sans selection:bg-red-500/30">
      {/* SYNC PROGRESS BAR */}
      {syncStatus === 'syncing' && (
        <div className="fixed top-0 left-0 right-0 h-0.5 bg-red-600/20 z-[100]">
          <div className="h-full bg-red-600 animate-[shimmer_1.5s_infinite_linear] w-[40%] shadow-[0_0_10px_#ef4444]"></div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-80 bg-slate-900 border-r border-white/[0.05] flex flex-col transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-24'}`}>
        <div className="p-10 shrink-0">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
               {data.settings?.logoUrl ? (
                 <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 bg-white/5 p-1 shadow-lg">
                   <img src={data.settings.logoUrl} alt="School Logo" className="w-full h-full object-contain" />
                 </div>
               ) : (
                 <div className="relative">
                   <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                   <div className="w-3 h-3 bg-red-600 rounded-full absolute inset-0 animate-ping opacity-75"></div>
                 </div>
               )}
               <span className={`text-[10px] font-black text-slate-500 uppercase tracking-widest ${!isSidebarOpen && 'md:hidden'}`}>System Online</span>
            </div>
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden text-slate-400 hover:text-white transition-colors"><X /></button>
          </div>
          
          <div className={`${!isSidebarOpen && 'md:hidden'} animate-slide-up`}>
            <div className="inline-block px-3 py-1 bg-red-600 text-[9px] font-black rounded-full mb-3 shadow-[0_0_15px_rgba(239,68,68,0.3)]">v10.0 CORE</div>
            <h2 className="font-extrabold text-2xl text-white tracking-tighter leading-none mb-4 italic">
              E-KADET<br/><span className="text-red-600 not-italic">BOMBA</span>
            </h2>
            <div className="space-y-1 border-l-2 border-red-600/20 pl-4 py-1">
              <p className="text-[10px] font-extrabold text-slate-300 uppercase tracking-tight">{data.settings?.schoolName || 'SMK SULTAN AHMAD SHAH'}</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Cameron Highlands</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 py-4 space-y-2 custom-scrollbar">
          {menuItems.map((item, idx) => (
            <button 
              key={item.id} 
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 768) setSidebarOpen(false);
              }} 
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group relative overflow-hidden ${activeTab === item.id ? 'bg-red-600 text-white shadow-[0_10px_30px_rgba(239,68,68,0.2)]' : 'text-slate-500 hover:bg-white/[0.03] hover:text-slate-300'}`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <item.icon className={`w-5 h-5 shrink-0 transition-transform duration-500 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-6'}`} />
              <span className={`font-black text-[10px] uppercase tracking-[0.15em] whitespace-nowrap ${!isSidebarOpen && 'md:hidden'}`}>{item.label}</span>
              {activeTab === item.id && <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/20"></div>}
            </button>
          ))}
        </nav>
        
        <div className="p-8 border-t border-white/[0.05] mt-auto">
           <div className={`flex items-center gap-4 ${!isSidebarOpen && 'md:justify-center'}`}>
              <div className={`w-2 h-2 rounded-full ${syncStatus === 'success' ? 'bg-emerald-500' : syncStatus === 'error' ? 'bg-amber-500' : 'bg-red-500 animate-pulse'}`}></div>
              <span className={`text-[9px] font-bold text-slate-600 uppercase tracking-widest ${!isSidebarOpen && 'md:hidden'}`}>
                {syncStatus === 'syncing' ? 'Cloud Syncing...' : 'Encrypted Link'}
              </span>
           </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden bg-brand-dark">
        <header className="h-24 px-10 flex items-center justify-between border-b border-white/[0.05] z-10 glass-panel">
          <div className="flex items-center gap-8">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-3 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] rounded-2xl text-slate-400 transition-all active:scale-90">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Current Module</p>
              <h1 className="text-xl font-extrabold text-white uppercase tracking-tighter italic">
                {menuItems.find(i => i.id === activeTab)?.label}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="hidden sm:flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Sync Health</span>
                <span className={`text-[10px] font-black uppercase flex items-center gap-2 ${syncStatus === 'error' ? 'text-amber-500' : 'text-emerald-500'}`}>
                   {syncStatus === 'syncing' ? 'Synchronizing...' : 'Healthy (99.9%)'}
                   <Circle className={`w-1.5 h-1.5 fill-current ${syncStatus === 'syncing' ? 'animate-pulse' : ''}`} />
                </span>
             </div>
             <div className="w-px h-8 bg-white/[0.05]"></div>
             <button onClick={onSync} className="p-4 bg-white/[0.03] border border-white/[0.05] rounded-2xl text-slate-400 hover:text-red-500 hover:border-red-500/30 transition-all group active:scale-90">
                <RefreshCw className={`w-5 h-5 ${syncStatus === 'syncing' ? 'animate-spin text-red-500' : 'group-hover:rotate-180 duration-700'}`} />
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar scroll-smooth">
          <div className="max-w-7xl mx-auto pb-20 animate-slide-up">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;