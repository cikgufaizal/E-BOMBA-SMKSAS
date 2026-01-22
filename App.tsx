import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  LayoutDashboard, Users, UserSquare2, GraduationCap, CalendarCheck, 
  Activity as ActivityIcon, ClipboardList, Settings as SettingsIcon,
  Menu, X, Loader2, RefreshCw, Wifi, WifiOff
} from 'lucide-react';
import { loadData, saveData, fetchDataFromCloud } from './utils/storage';
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
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');

  const syncRef = useRef(false);

  const performSync = useCallback(async (isManual = false) => {
    const url = data.settings?.sheetUrl;
    if (!url || !url.startsWith('https://script.google.com')) {
      if (isManual) alert("Sila tetapkan URL API di menu Settings Admin.");
      return;
    }

    setSyncStatus('syncing');
    const cloudData = await fetchDataFromCloud(url);
    if (cloudData) {
      setData(cloudData);
      setSyncStatus('idle');
      if (isManual) alert("Data berjaya diselaraskan!");
    } else {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  }, [data.settings?.sheetUrl]);

  useEffect(() => {
    if (!syncRef.current) {
      syncRef.current = true;
      performSync();
    }
  }, [performSync]);

  const handleUpdateData = (newData: Partial<SystemData>) => {
    const updated = { ...data, ...newData };
    setData(updated);
    saveData(updated);
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

  if (isLoading) return <div className="h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="animate-spin text-red-600 w-10 h-10" /></div>;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      <aside className={`fixed md:static inset-y-0 left-0 z-30 w-72 bg-slate-900 border-r border-slate-800 transform transition-all ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'}`}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${syncStatus === 'error' ? 'bg-amber-600' : 'bg-red-600'}`}>
             <Wifi className="w-4 h-4 text-white" />
          </div>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden"><X /></button>
        </div>
        <nav className="p-4 space-y-1">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as Tab)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-red-600/10 text-red-500' : 'text-slate-500 hover:bg-slate-800'}`}>
              <item.icon className="w-5 h-5" />
              <span className={`font-bold text-xs uppercase ${!isSidebarOpen && 'md:hidden'}`}>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-8">
          <h1 className="text-sm font-black text-white uppercase tracking-widest">{menuItems.find(i => i.id === activeTab)?.label}</h1>
          <button onClick={() => performSync(true)} className="p-2 hover:bg-slate-900 rounded-lg">
            <RefreshCw className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' && <Dashboard data={data} />}
          {activeTab === 'guru' && <GuruManager data={data} updateData={handleUpdateData} />}
          {activeTab === 'ahli' && <AhliManager data={data} updateData={handleUpdateData} onPrint={() => {}} />}
          {activeTab === 'ajk' && <AJKManager data={data} updateData={handleUpdateData} onPrint={() => {}} />}
          {activeTab === 'kehadiran' && <KehadiranManager data={data} updateData={handleUpdateData} onPrint={() => {}} />}
          {activeTab === 'aktiviti' && <AktivitiManager data={data} updateData={handleUpdateData} onPrint={() => {}} />}
          {activeTab === 'rancangan' && <RancanganManager data={data} updateData={handleUpdateData} />}
          {activeTab === 'settings' && <Settings data={data} updateData={handleUpdateData} />}
        </div>
      </main>
    </div>
  );
};

export default App;