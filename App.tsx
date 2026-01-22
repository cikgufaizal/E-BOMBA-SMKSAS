import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  GraduationCap, 
  CalendarCheck, 
  Activity as ActivityIcon, 
  ClipboardList, 
  Settings as SettingsIcon,
  Menu,
  X,
  Loader2,
  RefreshCw,
  Wifi,
  WifiOff,
  Clock
} from 'lucide-react';
import { loadData, saveData, fetchDataFromCloud } from './utils/storage';
import { SystemData, ReportType } from './types';
import { SCHOOL_INFO } from './constants';

// Internal Components
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
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSynced, setLastSynced] = useState<string>(new Date().toLocaleTimeString());
  const [printConfig, setPrintConfig] = useState<{ isOpen: boolean; type: ReportType | null; targetId?: string }>({
    isOpen: false,
    type: null
  });

  // Gunakan Ref untuk mengelakkan dependency loop dalam useEffect
  const dataRef = useRef<SystemData>(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const syncWithCloud = useCallback(async (isManual: boolean = false) => {
    const currentData = dataRef.current;
    const url = currentData.settings?.sheetUrl;
    
    // Abaikan jika URL masih placeholder
    if (!url || url.includes('SILA_GANTI')) {
      if (isManual) alert("Sila masukkan URL Web App di dalam kod (utils/storage.ts) terlebih dahulu.");
      return;
    }

    setSyncStatus('syncing');
    try {
      const cloudData = await fetchDataFromCloud(url);
      
      if (cloudData) {
        setData(cloudData);
        setSyncStatus('success');
        setLastSynced(new Date().toLocaleTimeString());
        if (isManual) alert("Data berjaya dikemaskini dari Cloud!");
      } else {
        // Jika cloud kosong, hantar data sedia ada ke cloud
        const success = await saveData(currentData);
        setSyncStatus(success ? 'success' : 'error');
      }
    } catch (err) {
      setSyncStatus('error');
    } finally {
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  }, []);

  // Effect 1: Inisialisasi Aplikasi (Hanya Sekali)
  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true);
      await syncWithCloud();
      setIsLoading(false);
    };
    initApp();
  }, [syncWithCloud]);

  // Effect 2: Auto-Sync Berkala
  useEffect(() => {
    const interval = setInterval(() => {
      syncWithCloud();
    }, 180000); // Setiap 3 minit
    
    return () => clearInterval(interval);
  }, [syncWithCloud]);

  const handleUpdateData = async (newData: Partial<SystemData>) => {
    const updated = { ...data, ...newData };
    setData(updated);
    
    // Simpan ke LocalStorage segera
    localStorage.setItem('ekelab_data_v1', JSON.stringify(updated));
    
    // Cuba simpan ke Cloud di belakang tab
    const url = updated.settings?.sheetUrl;
    if (url && !url.includes('SILA_GANTI')) {
      setSyncStatus('syncing');
      const success = await saveData(updated);
      setSyncStatus(success ? 'success' : 'error');
      if (success) setLastSynced(new Date().toLocaleTimeString());
      setTimeout(() => setSyncStatus('idle'), 2000);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Analitik', icon: LayoutDashboard },
    { id: 'guru', label: 'Guru Pembimbing', icon: GraduationCap },
    { id: 'ahli', label: 'Pangkalan Data Ahli', icon: Users },
    { id: 'ajk', label: 'Struktur Organisasi', icon: UserSquare2 },
    { id: 'kehadiran', label: 'Sistem Kehadiran', icon: CalendarCheck },
    { id: 'aktiviti', label: 'Log Aktiviti', icon: ActivityIcon },
    { id: 'rancangan', label: 'Rancangan Tahunan', icon: ClipboardList },
    { id: 'settings', label: 'Papan Kawalan Admin', icon: SettingsIcon },
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
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
          <p className="text-white font-black uppercase tracking-widest animate-pulse">Menghubungkan Database Cloud...</p>
        </div>
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-30
        w-80 bg-slate-900 shadow-2xl border-r border-slate-800 transform transition-all duration-500
        flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-24'}
      `}>
        <div className="p-6 border-b border-slate-800/50 bg-gradient-to-br from-red-950/20 to-slate-900">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl shadow-lg flex items-center justify-center transition-colors duration-500 ${syncStatus === 'error' ? 'bg-amber-600' : 'bg-red-600'}`}>
               {syncStatus === 'error' ? <WifiOff className="w-5 h-5 text-white" /> : <Wifi className="w-5 h-5 text-white animate-pulse" />}
            </div>
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden text-slate-400">
              <X className="w-7 h-7" />
            </button>
          </div>
          <div className={`${!isSidebarOpen && 'md:hidden'}`}>
            <h2 className="font-black text-lg leading-tight tracking-tighter text-white uppercase italic">
              {data.settings?.clubName || SCHOOL_INFO.clubName}
            </h2>
            <div className="flex items-center gap-2 mt-1">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
               <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] opacity-80">Cloud Live</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as Tab);
                if (window.innerWidth < 768) setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300
                ${activeTab === item.id 
                  ? `bg-red-600/10 text-red-500 border border-red-600/20` 
                  : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300 border border-transparent'}
              `}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className={`font-bold text-xs uppercase tracking-widest whitespace-nowrap ${!isSidebarOpen && 'md:hidden'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="p-6 space-y-3">
          <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800 flex items-center gap-3">
             <Clock className="w-3 h-3 text-slate-600" />
             <div>
                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Update Terakhir</p>
                <p className="text-[10px] font-bold text-slate-400">{lastSynced}</p>
             </div>
          </div>
          <button 
            onClick={() => syncWithCloud(true)}
            disabled={syncStatus === 'syncing'}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between hover:border-red-600/40 transition-all group"
          >
            <span className="text-[9px] font-black uppercase text-slate-500 group-hover:text-red-500 tracking-widest">Segar Data Manual</span>
            <RefreshCw className={`w-3 h-3 ${syncStatus === 'syncing' ? 'animate-spin text-red-500' : 'text-slate-600'}`} />
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#020617]">
        <header className="h-20 bg-slate-950/50 backdrop-blur-md border-b border-slate-800/50 flex items-center justify-between px-8 shrink-0 relative z-10">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2.5 hover:bg-slate-900 rounded-xl text-slate-400">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-black text-white uppercase tracking-tighter">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl items-center gap-3">
                <div className="flex -space-x-2">
                   <div className="w-6 h-6 rounded-full bg-red-600 border-2 border-slate-900 flex items-center justify-center text-[8px] font-bold">G</div>
                   <div className="w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-[8px] font-bold">A</div>
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Multi-User Ready</span>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <Dashboard data={data} />}
            {activeTab === 'guru' && <GuruManager data={data} updateData={handleUpdateData} />}
            {activeTab === 'ahli' && <AhliManager data={data} updateData={handleUpdateData} onPrint={() => setPrintConfig({ isOpen: true, type: 'AHLI' })} />}
            {activeTab === 'ajk' && <AJKManager data={data} updateData={handleUpdateData} onPrint={() => setPrintConfig({ isOpen: true, type: 'AJK' })} />}
            {activeTab === 'kehadiran' && <KehadiranManager data={data} updateData={handleUpdateData} onPrint={() => setPrintConfig({ isOpen: true, type: 'KEHADIRAN' })} />}
            {activeTab === 'aktiviti' && <AktivitiManager data={data} updateData={handleUpdateData} onPrint={(id) => setPrintConfig({ isOpen: true, type: 'AKTIVITI', targetId: id })} />}
            {activeTab === 'rancangan' && <RancanganManager data={data} updateData={handleUpdateData} />}
            {activeTab === 'settings' && <Settings data={data} updateData={handleUpdateData} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;