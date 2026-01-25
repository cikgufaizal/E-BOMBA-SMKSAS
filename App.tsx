
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, Users, UserSquare2, GraduationCap, CalendarCheck, 
  Activity as ActivityIcon, ClipboardList, Settings as SettingsIcon,
  Menu, X, RefreshCw, ShieldCheck, Loader2, Circle, FileText
} from 'lucide-react';
import { loadData, saveData, fetchDataFromCloud, saveDataToCloud } from './utils/storage';
import { SystemData, ReportType } from './types';
import { CLOUD_API_URL } from './constants';

import Dashboard from './components/Dashboard';
import GuruManager from './components/GuruManager';
import AhliManager from './components/AhliManager';
import AJKManager from './components/AJKManager';
import KehadiranManager from './components/KehadiranManager';
import AktivitiManager from './components/AktivitiManager';
import RancanganManager from './components/RancanganManager';
import PendaftaranManager from './components/PendaftaranManager';
import PrintPreview from './components/PrintPreview';
import Settings from './components/Settings';

type Tab = 'dashboard' | 'guru' | 'ahli' | 'ajk' | 'kehadiran' | 'aktiviti' | 'rancangan' | 'settings' | 'pendaftaran';

const App: React.FC = () => {
  const [data, setData] = useState<SystemData>(loadData());
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error' | 'success'>('idle');
  const [isInitializing, setIsInitializing] = useState(true);
  
  const [printConfig, setPrintConfig] = useState<{ isOpen: boolean; type: ReportType | null; targetId?: string }>({
    isOpen: false,
    type: null
  });

  const pullFromCloud = useCallback(async (isInitial = false) => {
    if (!isInitial) setSyncStatus('syncing');
    const cloudData = await fetchDataFromCloud();
    
    if (cloudData) {
      const cloudTime = cloudData.lastUpdated || 0;
      const localTime = data.lastUpdated || 0;

      if (cloudTime > localTime || data.students.length === 0) {
        setData(cloudData);
        saveData(cloudData);
        setSyncStatus('success');
      } else {
        setSyncStatus('idle');
      }
    } else {
      setSyncStatus('error');
    }
    
    if (isInitial) setIsInitializing(false);
    setTimeout(() => setSyncStatus('idle'), 2000);
  }, [data.lastUpdated, data.students.length]);

  useEffect(() => {
    pullFromCloud(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      pullFromCloud(false);
    }, 60000); 
    return () => clearInterval(interval);
  }, [pullFromCloud]);

  const handleUpdateData = async (newData: Partial<SystemData>) => {
    const updated = { ...data, ...newData, lastUpdated: Date.now() };
    setData(updated);
    saveData(updated); 

    setSyncStatus('syncing');
    const res = await saveDataToCloud(updated);
    setSyncStatus(res.success ? 'success' : 'error');
    setTimeout(() => setSyncStatus('idle'), 2000);
  };

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

  if (printConfig.isOpen && printConfig.type) {
    return (
      <PrintPreview 
        type={printConfig.type} 
        data={data} 
        targetId={printConfig.targetId}
        onClose={() => setPrintConfig({ isOpen: false, type: null })} 
      />
    );
  }

  return (
    <div className="flex h-screen bg-brand-dark text-slate-200 overflow-hidden font-sans selection:bg-red-500/30">
      {/* INITIAL LOAD OVERLAY */}
      {isInitializing && (
        <div className="fixed inset-0 z-[100] bg-brand-dark flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 border-2 border-red-600/10 border-t-red-600 rounded-full animate-spin"></div>
            <ShieldCheck className="w-8 h-8 text-red-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="mt-8 text-[10px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Initializing Security Systems...</h2>
        </div>
      )}

      {/* TOP PROGRESS BAR SYNC */}
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
                setActiveTab(item.id as Tab);
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
                {syncStatus === 'syncing' ? 'Cloud Syncing...' : 'Encrypted Link Active'}
              </span>
           </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
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
             <button onClick={() => pullFromCloud()} className="p-4 bg-white/[0.03] border border-white/[0.05] rounded-2xl text-slate-400 hover:text-red-500 hover:border-red-500/30 transition-all group active:scale-90">
                <RefreshCw className={`w-5 h-5 ${syncStatus === 'syncing' ? 'animate-spin text-red-500' : 'group-hover:rotate-180 duration-700'}`} />
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar scroll-smooth">
          <div className="max-w-7xl mx-auto pb-20 animate-slide-up">
            {activeTab === 'dashboard' && <Dashboard data={data} />}
            {activeTab === 'pendaftaran' && <PendaftaranManager data={data} updateData={handleUpdateData} onPrint={(id) => setPrintConfig({ isOpen: true, type: 'PENDAFTARAN', targetId: id })} />}
            {activeTab === 'guru' && <GuruManager data={data} updateData={handleUpdateData} />}
            {activeTab === 'ahli' && <AhliManager data={data} updateData={handleUpdateData} onPrint={() => setPrintConfig({ isOpen: true, type: 'AHLI' })} />}
            {activeTab === 'ajk' && <AJKManager data={data} updateData={handleUpdateData} onPrint={() => setPrintConfig({ isOpen: true, type: 'AJK' })} />}
            {activeTab === 'kehadiran' && <KehadiranManager data={data} updateData={handleUpdateData} onPrint={() => setPrintConfig({ isOpen: true, type: 'KEHADIRAN' })} />}
            {activeTab === 'aktiviti' && <AktivitiManager data={data} updateData={handleUpdateData} onPrint={(id) => setPrintConfig({ isOpen: true, type: 'AKTIVITI', targetId: id })} />}
            {activeTab === 'rancangan' && <RancanganManager data={data} updateData={handleUpdateData} />}
            {activeTab === 'settings' && <Settings data={data} updateData={handleUpdateData} onForcePull={() => pullFromCloud(false)} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
