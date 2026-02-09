import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, UserSquare2, GraduationCap, CalendarCheck, 
  Activity as ActivityIcon, ClipboardList, Settings as SettingsIcon,
  Menu, X, RefreshCw, Circle, FileText, ShieldCheck, Power
} from 'lucide-react';
import { SystemData, UserRole } from '../types';

interface LayoutProps {
  data: SystemData;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  syncStatus: 'idle' | 'syncing' | 'error' | 'success';
  onSync: () => void;
  children: React.ReactNode;
  userRole: UserRole;
}

const Layout: React.FC<LayoutProps> = ({ 
  data, activeTab, setActiveTab, syncStatus, onSync, children, userRole 
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'pendaftaran', label: 'Pendaftaran Dokumen', icon: FileText, hidden: userRole === 'GURU' }, 
    { id: 'guru', label: 'Direktori Pegawai', icon: GraduationCap },
    { id: 'ahli', label: 'Database Anggota', icon: Users },
    { id: 'ajk', label: 'Struktur Taktikal', icon: UserSquare2 },
    { id: 'kehadiran', label: 'Log Kehadiran', icon: CalendarCheck },
    { id: 'aktiviti', label: 'Rekod Operasi', icon: ActivityIcon },
    { id: 'rancangan', label: 'Pelan Tahunan', icon: ClipboardList },
    { id: 'settings', label: 'Sistem Core', icon: SettingsIcon, hidden: userRole === 'GURU' }, 
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans selection:bg-red-500/30 selection:text-white">
      {/* GLOBAL HUD OVERLAY - Vignette Effect */}
      <div className="fixed inset-0 pointer-events-none z-[100] rounded-[30px] hidden md:block shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"></div>

      {/* SIDEBAR TACTICAL */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-[#020617]/90 backdrop-blur-xl border-r border-white/[0.05] flex flex-col transform transition-all duration-500 cubic-bezier(0.2, 0, 0, 1) ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'} shadow-2xl`}>
        <div className="p-8 shrink-0">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative group cursor-pointer shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-900 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.8)] group-hover:scale-110 group-hover:rotate-3 border border-red-500/30">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#020617] animate-pulse"></div>
              </div>
              <div className={`${!isSidebarOpen && 'md:hidden'} transition-all duration-300`}>
                <h2 className="font-black text-lg tracking-tighter leading-none text-white italic whitespace-nowrap group">
                  E-BOMBA <span className="text-red-600 group-hover:text-red-500 transition-colors">OS</span>
                </h2>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1 whitespace-nowrap">
                  {userRole === 'ADMIN' ? 'ADMIN CONSOLE' : 'GURU ACCESS'}
                </p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden text-slate-400 hover:text-white transition-colors"><X /></button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-2 custom-scrollbar">
          {menuItems.filter(item => !item.hidden).map((item, idx) => (
            <button 
              key={item.id} 
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 768) setSidebarOpen(false);
              }} 
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden btn-press ${activeTab === item.id ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-[0_10px_30px_-10px_rgba(239,68,68,0.6)] border border-red-500/50' : 'text-slate-500 hover:bg-white/[0.05] hover:text-slate-200 border border-transparent'}`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {activeTab === item.id && (
                 <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shine_3s_infinite]"></div>
              )}
              <item.icon className={`w-5 h-5 shrink-0 transition-all duration-300 ${activeTab === item.id ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110'}`} />
              <span className={`font-bold text-[10px] uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-300 ${!isSidebarOpen && 'md:hidden'}`}>{item.label}</span>
              
              {activeTab === item.id && (
                <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white] animate-pulse md:hidden lg:block"></div>
              )}
            </button>
          ))}
        </nav>
        
        <div className="p-6 border-t border-white/[0.05] bg-black/20 backdrop-blur-sm mt-2">
           <div className={`flex items-center gap-4 ${!isSidebarOpen && 'md:justify-center'}`}>
              <div className="relative">
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]"></div>
                 <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
              </div>
              <div className={`${!isSidebarOpen && 'md:hidden'}`}>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">System Link</p>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">Secured / Online</p>
              </div>
           </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-[#020617]">
        {/* Dynamic Background Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/10 blur-[150px] rounded-full -mr-40 -mt-40 pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full -ml-20 -mb-20 pointer-events-none animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>

        <header className="h-20 px-6 md:px-10 flex items-center justify-between border-b border-white/[0.05] bg-[#020617]/80 backdrop-blur-xl z-20 sticky top-0 transition-all duration-300">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2.5 bg-white/[0.03] border border-white/[0.05] rounded-xl text-slate-400 hover:bg-white/[0.07] hover:text-white transition-all btn-press">
              <Menu className="w-5 h-5" />
            </button>
            <div className="h-8 w-px bg-white/[0.1]"></div>
            <div className="animate-in slide-in-from-left-4 fade-in duration-500">
              <p className="text-[8px] font-black text-red-500 uppercase tracking-[0.4em] mb-1">Active Module</p>
              <h1 className="text-sm md:text-base font-black text-white uppercase tracking-[0.2em] shadow-black drop-shadow-lg">
                {menuItems.find(i => i.id === activeTab)?.label || 'System Core'}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="hidden sm:flex flex-col items-end animate-in slide-in-from-right-4 fade-in duration-500 stagger-1">
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Network Status</span>
                <span className={`text-[10px] font-black uppercase flex items-center gap-2 ${syncStatus === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>
                   {syncStatus === 'syncing' ? 'UPLOADING...' : syncStatus === 'error' ? 'CONNECTION LOST' : 'CONNECTED'}
                   <div className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'error' ? 'bg-red-500' : 'bg-emerald-500'} ${syncStatus === 'syncing' ? 'animate-ping' : ''} shadow-[0_0_10px_currentColor]`}></div>
                </span>
             </div>
             <button onClick={onSync} className={`relative p-3 bg-slate-900 border border-white/[0.05] rounded-xl text-slate-400 hover:text-white hover:border-red-500/50 hover:bg-red-500/10 transition-all btn-press group ${syncStatus === 'syncing' ? 'cursor-wait' : ''}`}>
                <RefreshCw className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin text-red-500' : 'group-hover:rotate-180 duration-700 ease-in-out'}`} />
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative scroll-smooth custom-scrollbar">
          {/* CONTENT AREA WITH ANIMATION KEY */}
          <div key={activeTab} className="max-w-7xl mx-auto relative z-10 animate-enter pb-20">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;