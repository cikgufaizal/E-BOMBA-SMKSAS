import React, { useState, useEffect, useCallback } from 'react';
import { Terminal, Shield } from 'lucide-react';
import { createEmptyData, fetchDataFromCloud, saveDataToCloud } from './utils/storage';
import { SystemData, ReportType, UserRole } from './types';

// Components
import LoginScreen from './components/LoginScreen';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import BombaDashboard from './components/BombaDashboard'; // New Component

// School Modules
import GuruManager from './components/GuruManager';
import AhliManager from './components/AhliManager';
import AJKManager from './components/AJKManager';
import KehadiranManager from './components/KehadiranManager';
import AktivitiManager from './components/AktivitiManager';
import RancanganManager from './components/RancanganManager';
import PendaftaranIndex from './components/pendaftaran/PendaftaranIndex';
import PrintContainer from './components/print/PrintContainer';
import Settings from './components/Settings';

type Tab = 'dashboard' | 'guru' | 'ahli' | 'ajk' | 'kehadiran' | 'aktiviti' | 'rancangan' | 'settings' | 'pendaftaran';

const App: React.FC = () => {
  const [data, setData] = useState<SystemData>(createEmptyData());
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error' | 'success'>('idle');
  
  // States untuk Flow Sistem
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [userRole, setUserRole] = useState<UserRole | null>(null); // State User Role
  
  const [printConfig, setPrintConfig] = useState<{ isOpen: boolean; type: ReportType | null; targetId?: string }>({
    isOpen: false,
    type: null
  });

  // Simulasi Progress Bar supaya nampak "Real"
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingProgress(0);
      interval = setInterval(() => {
        setLoadingProgress(prev => {
          const increment = Math.max(0.5, (95 - prev) / 15);
          return prev + increment < 98 ? prev + increment : 98;
        });
      }, 50);
    } else {
      setLoadingProgress(100);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const pullData = useCallback(async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    setSyncStatus('syncing');

    try {
      const result = await fetchDataFromCloud();
      if (result) {
        setData(result);
        setSyncStatus('success');
        if (isInitial) setIsLoading(false);
      } else {
        console.warn("Cloud data empty or failed, using local fallback.");
        if (isInitial) setIsLoading(false);
      }
    } catch (err) {
      console.error("Critical Pull Error:", err);
      setSyncStatus('error');
      if (isInitial) {
        setIsLoading(false); 
      }
    } finally {
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  }, []);

  useEffect(() => {
    pullData(true);
  }, [pullData]);

  const handleUpdateData = async (newData: Partial<SystemData>) => {
    // 1. Update local state segera (Optimistic Update)
    const updated = { ...data, ...newData, lastUpdated: Date.now() };
    setData(updated); 
    
    // 2. Hantar ke Cloud di latar belakang
    setSyncStatus('syncing');
    try {
      const res = await saveDataToCloud(updated);
      setSyncStatus(res.success ? 'success' : 'error');
    } catch (e) {
      setSyncStatus('error');
    }
    setTimeout(() => setSyncStatus('idle'), 2000);
  };

  // --- PRINT OVERLAY ---
  if (printConfig.isOpen && printConfig.type) {
    return (
      <PrintContainer 
        type={printConfig.type} 
        data={data} 
        targetId={printConfig.targetId}
        onClose={() => setPrintConfig({ isOpen: false, type: null })} 
      />
    );
  }

  // --- 1. TACTICAL LOADING SCREEN ---
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#020617] flex flex-col items-center justify-center p-8 overflow-hidden font-mono">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="absolute inset-0 bg-radial-gradient(circle_at_center,rgba(239,68,68,0.1)_0%,transparent_70%)"></div>

        <div className="relative z-10 w-full max-w-lg space-y-8">
          <div className="flex items-center gap-4 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="w-16 h-16 bg-red-600/10 border border-red-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse">
                <Shield className="w-8 h-8 text-red-500" />
             </div>
             <div>
                <h1 className="text-3xl font-black text-white italic tracking-tighter">E-BOMBA <span className="text-red-600">OS</span></h1>
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                   <Terminal className="w-3 h-3" /> System Boot Sequence
                </p>
             </div>
          </div>

          <div className="space-y-2">
             <div className="flex justify-between items-end text-xs font-bold uppercase tracking-widest text-slate-400">
                <span>Loading Core Modules...</span>
                <span className="text-red-500 text-2xl font-black tabular-nums">{Math.floor(loadingProgress)}%</span>
             </div>
             <div className="h-3 w-full bg-slate-900 border border-slate-800 rounded-full overflow-hidden relative shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-red-800 via-red-600 to-red-500 relative transition-all duration-100 ease-out flex items-center justify-end"
                  style={{ width: `${loadingProgress}%` }}
                >
                   <div className="h-full w-1 bg-white shadow-[0_0_15px_white] opacity-80"></div>
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] animate-[shimmer_2s_infinite]"></div>
             </div>
             <div className="flex justify-between text-[9px] font-mono text-slate-600 uppercase mt-2">
                <span>Memory: OK</span>
                <span>Database: SYNCING</span>
                <span>Security: ACTIVE</span>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. LOGIN SCREEN (ACCESS CONTROL) ---
  if (!userRole) {
    return <LoginScreen onLogin={setUserRole} />;
  }

  // --- 3A. BOMBA DASHBOARD (VIEW ONLY) ---
  if (userRole === 'BOMBA') {
    return (
      <BombaDashboard 
        data={data}
        updateData={handleUpdateData} // Masih boleh update jika nak key-in No Keahlian
        onPrint={(id, type) => setPrintConfig({ isOpen: true, type: type, targetId: id })}
        onLogout={() => setUserRole(null)}
      />
    );
  }

  // --- 3B. SCHOOL DASHBOARD (ADMIN & GURU) ---
  return (
    <Layout 
      data={data} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      syncStatus={syncStatus} 
      onSync={() => pullData()}
      userRole={userRole} // PASS USER ROLE KE LAYOUT
    >
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {activeTab === 'dashboard' && <Dashboard data={data} />}
        {activeTab === 'pendaftaran' && userRole === 'ADMIN' && <PendaftaranIndex data={data} updateData={handleUpdateData} onPrint={(id, type = 'PENDAFTARAN') => setPrintConfig({ isOpen: true, type: type as ReportType, targetId: id })} />}
        {activeTab === 'guru' && <GuruManager data={data} updateData={handleUpdateData} />}
        {activeTab === 'ahli' && <AhliManager data={data} updateData={handleUpdateData} onPrint={() => setPrintConfig({ isOpen: true, type: 'AHLI' })} />}
        {activeTab === 'ajk' && <AJKManager data={data} updateData={handleUpdateData} onPrint={() => setPrintConfig({ isOpen: true, type: 'AJK' })} />}
        {activeTab === 'kehadiran' && <KehadiranManager data={data} updateData={handleUpdateData} onPrint={() => setPrintConfig({ isOpen: true, type: 'KEHADIRAN' })} />}
        {activeTab === 'aktiviti' && <AktivitiManager data={data} updateData={handleUpdateData} onPrint={(id) => setPrintConfig({ isOpen: true, type: 'AKTIVITI', targetId: id })} />}
        {activeTab === 'rancangan' && <RancanganManager data={data} updateData={handleUpdateData} />}
        {activeTab === 'settings' && userRole === 'ADMIN' && <Settings data={data} updateData={handleUpdateData} onForcePull={() => pullData()} />}
      </div>
    </Layout>
  );
};

export default App;