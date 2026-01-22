
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  LayoutDashboard, Users, UserSquare2, GraduationCap, CalendarCheck, 
  Activity as ActivityIcon, ClipboardList, Settings as SettingsIcon,
  Menu, X, RefreshCw, Wifi, WifiOff, Cloud, Database, AlertCircle, ShieldCheck
} from 'lucide-react';
import { loadData, saveData, fetchDataFromCloud, saveDataToCloud } from './utils/storage';
import { SystemData, ReportType } from './types';

import Dashboard from './components/Dashboard';
import GuruManager from './components/GuruManager';
import AhliManager from './components/AhliManager';
import AJKManager from './components/AJKManager';
import KehadiranManager from './components/KehadiranManager';
import AktivitiManager from './components/AktivitiManager';
import RancanganManager from './components/RancanganManager';
import PrintPreview from './components/PrintPreview';
import Settings from './components/Settings';

type Tab = 'dashboard' | 'guru' | 'ahli' | 'ajk' | 'kehadiran' | 'aktiviti' | 'rancangan' | 'settings';

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

  // FUNGSI UTAMA: Tarik data dari Cloud (WAJIB JALAN DULU)
  const pullFromCloud = useCallback(async (isManual = false) => {
    const url = data.settings?.sheetUrl;
    if (!url) {
      setIsInitializing(false);
      return;
    }

    setSyncStatus('syncing');
    const cloudData = await fetchDataFromCloud(url);
    
    if (cloudData) {
      const localTime = data.lastUpdated || 0;
      const cloudTime = cloudData.lastUpdated || 0;

      // HANYA UPDATE LOKAL jika data Cloud lebih baru atau laptop ni kosong
      if (cloudTime >= localTime || data.students.length === 0 || isManual) {
        setData(cloudData);
        saveData(cloudData);
        setSyncStatus('success');
        if (isManual) alert("BERJAYA: Data terbaru dari Cloud telah ditarik!");
      } else {
        setSyncStatus('idle');
        if (isManual) alert("INFO: Data Cloud sudah selari dengan Laptop.");
      }
    } else {
      setSyncStatus('error');
      if (isManual) alert("RALAT: Gagal tarik data Cloud. Periksa URL API cikgu.");
    }
    setIsInitializing(false);
    setTimeout(() => setSyncStatus('idle'), 3000);
  }, [data.settings?.sheetUrl, data.lastUpdated, data.students.length]);

  // Initial Sync: Wajib tarik data bila buka app
  useEffect(() => {
    pullFromCloud();
  }, []);

  const handleUpdateData = async (newData: Partial<SystemData>) => {
    // JANGAN UPDATE jika tengah initializing (untuk elak overwrite data kosong ke cloud)
    if (isInitializing) return;

    const updated = { 
      ...data, 
      ...newData, 
      lastUpdated: Date.now() 
    };
    
    setData(updated);
    saveData(updated); 

    // Auto-Sync ke Cloud
    if (updated.settings?.autoSync && updated.settings?.sheetUrl) {
      setSyncStatus('syncing');
      const res = await saveDataToCloud(updated);
      setSyncStatus(res.success ? 'success' : 'error');
      setTimeout(() => setSyncStatus('idle'), 2000);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'guru', label: 'Guru', icon: GraduationCap },
    { id: 'ahli', label: 'Ahli', icon: Users },
    { id: 'ajk', label: 'Struktur', icon: UserSquare2 },
    { id: 'kehadiran', label: 'Kehadiran', icon: CalendarCheck },
    { id: 'aktiviti', label: 'Log Aktiviti', icon: ActivityIcon },
    { id: 'rancangan', label: 'Rancangan', icon: ClipboardList },
    { id: 'settings', label: 'Admin', icon: SettingsIcon },
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
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      {/* LOADER SINKRONISASI KRITIKAL */}
      {isInitializing && data.settings?.sheetUrl && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-red-600/10 border-t-red-600 rounded-full animate-spin"></div>
            <ShieldCheck className="w-8 h-8 text-red-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="mt-8 text-lg font-black text-white uppercase italic tracking-widest animate-pulse">Menyelaras Data Cloud...</h2>
          <p className="mt-2 text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Jangan tutup laptop cikgu sebentar.</p>
        </div>
      )}

      {/* SIDEBAR DENGAN FIX SCROLL & LAYOUT */}
      <aside className={`fixed md:static inset-y-0 left-0 z-30 w-72 bg-slate-900 border-r border-slate-800 flex flex-col transform transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-24'}`}>
        {/* Sidebar Header */}
        <div className="p-8 border-b border-slate-800 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all ${syncStatus === 'success' ? 'bg-emerald-600 shadow-emerald-900/20' : syncStatus === 'error' ? 'bg-amber-600 shadow-amber-900/20' : 'bg-red-600 shadow-red-900/20'}`}>
               <Wifi className={`w-5 h-5 text-white ${syncStatus === 'syncing' ? 'animate-pulse' : ''}`} />
            </div>
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden text-slate-400 hover:text-white transition-colors"><X /></button>
          </div>
          <div className={`${!isSidebarOpen && 'md:hidden'} animate-in fade-in duration-500`}>
            <h2 className="font-black text-lg text-white uppercase italic tracking-tighter">E-KADET BOMBA</h2>
            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest opacity-80">PRO SYNC v9.0</p>
          </div>
        </div>

        {/* Sidebar Navigation - FIX SCROLLBAR HERE */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-1 custom-scrollbar scroll-smooth">
          {menuItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => {
                setActiveTab(item.id as Tab);
                if (window.innerWidth < 768) setSidebarOpen(false);
              }} 
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all border border-transparent group ${activeTab === item.id ? 'bg-red-600 text-white shadow-xl shadow-red-950/40 border-red-500' : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'}`}
            >
              <item.icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-white' : 'text-slate-500'}`} />
              <span className={`font-bold text-[11px] uppercase tracking-widest whitespace-nowrap transition-all ${!isSidebarOpen && 'md:hidden opacity-0 w-0'}`}>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className={`p-6 border-t border-slate-800 shrink-0 ${!isSidebarOpen && 'md:hidden'}`}>
           <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/50">
              <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Status Cloud</p>
              <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${syncStatus === 'success' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                 <span className="text-[9px] font-bold text-slate-400 uppercase">{syncStatus === 'success' ? 'Online & Synced' : syncStatus === 'syncing' ? 'Syncing...' : 'Disconnected'}</span>
              </div>
           </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#020617]">
        <header className="h-20 bg-slate-950/50 backdrop-blur-md border-b border-slate-800/50 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2.5 hover:bg-slate-900 rounded-xl text-slate-400 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-white uppercase tracking-tighter italic">
                {menuItems.find(i => i.id === activeTab)?.label}
              </h1>
              {syncStatus === 'success' && <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">● Cloud Bridge Active</span>}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
               onClick={() => pullFromCloud(true)} 
               disabled={syncStatus === 'syncing'}
               className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-900/50 transition-all disabled:opacity-50" 
               title="Refresh Data Dari Cloud"
             >
                <RefreshCw className={`w-5 h-5 ${syncStatus === 'syncing' ? 'animate-spin text-red-500' : ''}`} />
             </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar bg-[#020617] scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <Dashboard data={data} />}
            {activeTab === 'guru' && <GuruManager data={data} updateData={handleUpdateData} />}
            {activeTab === 'ahli' && <AhliManager data={data} updateData={handleUpdateData} onPrint={() => setPrintConfig({ isOpen: true, type: 'AHLI' })} />}
            {activeTab === 'ajk' && <AJKManager data={data} updateData={handleUpdateData} onPrint={() => setPrintConfig({ isOpen: true, type: 'AJK' })} />}
            {activeTab === 'kehadiran' && <KehadiranManager data={data} updateData={handleUpdateData} onPrint={() => setPrintConfig({ isOpen: true, type: 'KEHADIRAN' })} />}
            {activeTab === 'aktiviti' && <AktivitiManager data={data} updateData={handleUpdateData} onPrint={(id) => setPrintConfig({ isOpen: true, type: 'AKTIVITI', targetId: id })} />}
            {activeTab === 'rancangan' && <RancanganManager data={data} updateData={handleUpdateData} />}
            {activeTab === 'settings' && <Settings data={data} updateData={handleUpdateData} onForcePull={() => pullFromCloud(true)} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
