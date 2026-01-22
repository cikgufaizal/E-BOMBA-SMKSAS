import React, { useState, useEffect } from 'react';
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
  ShieldAlert,
  CloudOff,
  Globe,
  Loader2,
  // Added RefreshCw to imports
  RefreshCw
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
  const [isLoading, setIsLoading] = useState(false);
  const [printConfig, setPrintConfig] = useState<{ isOpen: boolean; type: ReportType | null; targetId?: string }>({
    isOpen: false,
    type: null
  });

  // Fungsi untuk muat turun data dari Awan
  const syncFromCloud = async (url: string) => {
    if (!url) return;
    setIsLoading(true);
    const cloudData = await fetchDataFromCloud(url);
    if (cloudData) {
      setData(cloudData);
      saveData(cloudData);
      console.log("Data awan berjaya diselaraskan.");
    }
    setIsLoading(false);
  };

  // Auto-Config via URL Master Link & Auto Sync on Load
  useEffect(() => {
    const initialize = async () => {
      const params = new URLSearchParams(window.location.search);
      const cloudKey = params.get('config');
      
      let currentUrl = data.settings?.sheetUrl;

      if (cloudKey) {
        try {
          const decoded = JSON.parse(atob(cloudKey));
          const updatedSettings = {
            ...data.settings,
            sheetUrl: decoded.url || data.settings?.sheetUrl || '', 
            logoUrl: decoded.logoUrl || data.settings?.logoUrl || '',
            schoolName: decoded.schoolName || data.settings?.schoolName || SCHOOL_INFO.name,
            clubName: decoded.clubName || data.settings?.clubName || SCHOOL_INFO.clubName,
            address: decoded.address || data.settings?.address || SCHOOL_INFO.address,
            autoSync: !!decoded.url 
          };
          
          const newData = { ...data, settings: updatedSettings };
          setData(newData);
          saveData(newData);
          currentUrl = decoded.url;
          
          window.history.replaceState({}, document.title, window.location.pathname);
          alert("Konfigurasi Master Diimport! Memulakan penyelarasan data...");
        } catch (e) {
          console.error("Gagal nyahkod pautan master");
        }
      }

      // Jika ada URL (dari local atau pautan master baru), tarik data
      if (currentUrl) {
        await syncFromCloud(currentUrl);
      }
    };

    initialize();
  }, []);

  // Simpan data setiap kali ada perubahan tempatan
  useEffect(() => {
    saveData(data);
  }, [data]);

  const updateData = (newData: Partial<SystemData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Analitik', icon: LayoutDashboard },
    { id: 'guru', label: 'Guru Pembimbing', icon: GraduationCap },
    { id: 'ahli', label: 'Pangkalan Data Ahli', icon: Users },
    { id: 'ajk', label: 'Struktur Organisasi', icon: UserSquare2 },
    { id: 'kehadiran', label: 'Sistem Kehadiran', icon: CalendarCheck },
    { id: 'aktiviti', label: 'Log Aktiviti', icon: ActivityIcon },
    { id: 'rancangan', label: 'Rancangan Tahunan', icon: ClipboardList },
    { id: 'settings', label: 'Konfigurasi Cloud', icon: SettingsIcon },
  ];

  const currentSchoolName = data.settings?.schoolName || SCHOOL_INFO.name;
  const currentClubName = data.settings?.clubName || SCHOOL_INFO.clubName;

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
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
          <p className="text-white font-black uppercase tracking-widest text-sm">Menyemak Data Awan...</p>
        </div>
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-30
        w-80 bg-slate-900 shadow-[20px_0_50px_rgba(0,0,0,0.5)] border-r border-slate-800 transform transition-all duration-500
        flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-24'}
      `}>
        <div className="p-6 flex flex-col gap-1 border-b border-slate-800/50 bg-gradient-to-br from-red-950/40 to-slate-900">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-slate-950 rounded-xl shadow-lg border border-red-600/20 flex items-center justify-center overflow-hidden">
              {data.settings?.logoUrl ? (
                <img src={data.settings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-red-600" />
              )}
            </div>
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden text-slate-400">
              <X className="w-7 h-7" />
            </button>
          </div>
          <div className={`${!isSidebarOpen && 'md:hidden'}`}>
            <h2 className="font-black text-xl leading-tight tracking-tighter text-white uppercase italic">
              {currentClubName}
            </h2>
            <p className="text-[10px] font-black text-red-500/80 uppercase tracking-widest mt-1">
              {currentSchoolName}
            </p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
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

        <div className="p-6 border-t border-slate-800/50">
          <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4">
            {isSidebarOpen ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${data.settings?.sheetUrl ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`}></div>
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.1em]">
                    {data.settings?.sheetUrl ? 'Cloud Connected' : 'Local Mode'}
                   </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                   <p className="text-sm font-bold text-slate-200 tracking-tighter italic uppercase">Enterprise V3.1</p>
                   {data.settings?.sheetUrl && (
                     <button onClick={() => syncFromCloud(data.settings!.sheetUrl)} className="text-red-500 hover:text-red-400">
                       {/* RefreshCw is now correctly imported */}
                       <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                     </button>
                   )}
                </div>
              </div>
            ) : (
              <div className="w-full text-center text-[10px] font-black text-red-600">PRO</div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#020617] relative">
        <header className="h-20 bg-slate-950/50 backdrop-blur-md border-b border-slate-800/50 flex items-center justify-between px-8 shrink-0 relative z-10">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2.5 hover:bg-slate-900 rounded-xl text-slate-400 hidden md:block">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-black text-white uppercase tracking-tighter">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-4">
             {data.settings?.sheetUrl ? (
               <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hidden sm:block">Cloud Active</span>
                 <Globe className="w-5 h-5 text-emerald-500" />
               </div>
             ) : <CloudOff className="w-5 h-5 text-slate-600" />}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 relative z-10">
          <div className="max-w-7xl mx-auto space-y-10">
            {activeTab === 'dashboard' && <Dashboard data={data} />}
            {activeTab === 'guru' && <GuruManager data={data} updateData={updateData} />}
            {activeTab === 'ahli' && <AhliManager data={data} updateData={updateData} onPrint={() => setPrintConfig({ isOpen: true, type: 'AHLI' })} />}
            {activeTab === 'ajk' && <AJKManager data={data} updateData={updateData} onPrint={() => setPrintConfig({ isOpen: true, type: 'AJK' })} />}
            {activeTab === 'kehadiran' && <KehadiranManager data={data} updateData={updateData} onPrint={() => setPrintConfig({ isOpen: true, type: 'KEHADIRAN' })} />}
            {activeTab === 'aktiviti' && <AktivitiManager data={data} updateData={updateData} onPrint={(id) => setPrintConfig({ isOpen: true, type: 'AKTIVITI', targetId: id })} />}
            {activeTab === 'rancangan' && <RancanganManager data={data} updateData={updateData} />}
            {activeTab === 'settings' && <Settings data={data} updateData={updateData} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;