import React, { useState, useEffect, useCallback } from 'react';
import { Terminal, Shield, Cpu, Activity, Zap } from 'lucide-react';
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
  const [loadingText, setLoadingText] = useState("SYSTEM BOOT");
  const [userRole, setUserRole] = useState<UserRole | null>(null); // State User Role
  
  const [printConfig, setPrintConfig] = useState<{ isOpen: boolean; type: ReportType | null; targetId?: string }>({
    isOpen: false,
    type: null
  });

  // Simulasi Loading yang Padu
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingProgress(0);
      const texts = ["INITIALIZING KERNEL", "LOADING ASSETS", "CONNECTING TO DATABASE", "DECRYPTING SECURE FILES", "ESTABLISHING UPLINK", "SYSTEM READY"];
      let textIdx = 0;

      interval = setInterval(() => {
        setLoadingProgress(prev => {
          const increment = Math.random() * 5;
          const next = prev + increment;
          if (next > 20 && textIdx === 0) { setLoadingText(texts[1]); textIdx++; }
          if (next > 40 && textIdx === 1) { setLoadingText(texts[2]); textIdx++; }
          if (next > 60 && textIdx === 2) { setLoadingText(texts[3]); textIdx++; }
          if (next > 80 && textIdx === 3) { setLoadingText(texts[4]); textIdx++; }
          if (next > 95 && textIdx === 4) { setLoadingText(texts[5]); textIdx++; }
          
          return next < 99 ? next : 99;
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
        if (isInitial) setTimeout(() => setIsLoading(false), 800); // Sedikit delay untuk tunjuk 100%
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

  // --- 1. TACTICAL LOADING SCREEN (PADU GILE) ---
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#020617] flex flex-col items-center justify-center p-8 overflow-hidden font-mono">
        {/* Background Animation */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        
        <div className="relative z-10 w-full max-w-lg space-y-10">
          {/* Central Logo with Glitch */}
          <div className="flex flex-col items-center mb-10">
             <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full border-4 border-red-600/30 border-t-red-500 border-r-red-500 animate-spin-slow absolute inset-0"></div>
                <div className="w-24 h-24 bg-red-600/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/5">
                   <Shield className="w-10 h-10 text-red-500 animate-pulse" />
                </div>
             </div>
             <h1 className="text-4xl font-black text-white italic tracking-tighter glitch-text">
                E-BOMBA <span className="text-red-600">OS</span>
             </h1>
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.5em] mt-2 animate-pulse">
                Tactical Command System
             </p>
          </div>

          {/* Progress Bar High Tech */}
          <div className="space-y-3">
             <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest font-mono">
                <span className="text-red-500 flex items-center gap-2"><Activity className="w-3 h-3" /> {loadingText}</span>
                <span className="text-white tabular-nums">{Math.floor(loadingProgress)}%</span>
             </div>
             <div className="h-2 w-full bg-slate-900 border border-slate-800 rounded-none overflow-hidden relative">
                <div 
                  className="h-full bg-red-600 relative transition-all duration-75 ease-out shadow-[0_0_15px_#ef4444]"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
             </div>
             {/* Decorative Code Lines */}
             <div className="h-10 overflow-hidden text-[9px] font-mono text-slate-600 leading-tight opacity-60">
                <p>&gt; MOUNTING_VOLUMES... OK</p>
                <p>&gt; CHECKING_INTEGRITY... OK</p>
                <p>&gt; BYPASSING_PROXY... DONE</p>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. UNIFIED LOGIN SCREEN ---
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
        
        {/* Pass userRole ke Settings untuk Auto-Unlock */}
        {activeTab === 'settings' && userRole === 'ADMIN' && <Settings data={data} updateData={handleUpdateData} onForcePull={() => pullData()} userRole={userRole} />}
      </div>
    </Layout>
  );
};

export default App;