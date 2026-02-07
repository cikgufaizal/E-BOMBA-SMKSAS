import React, { useState, useEffect, useCallback } from 'react';
import { Database, RefreshCw, WifiOff, ShieldAlert, Cpu } from 'lucide-react';
import { createEmptyData, fetchDataFromCloud, saveDataToCloud } from './utils/storage';
import { SystemData, ReportType } from './types';

// Components
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [printConfig, setPrintConfig] = useState<{ isOpen: boolean; type: ReportType | null; targetId?: string }>({
    isOpen: false,
    type: null
  });

  const pullData = useCallback(async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    setSyncStatus('syncing');
    setError(null);

    try {
      const result = await fetchDataFromCloud();
      if (result) {
        setData(result);
        setSyncStatus('success');
        if (isInitial) setIsLoading(false);
      } else {
        // Jika cloud kosong atau ralat, kita teruskan dengan data kosong yang selamat
        console.warn("Cloud data empty or failed, using local fallback.");
        if (isInitial) setIsLoading(false);
      }
    } catch (err) {
      console.error("Critical Pull Error:", err);
      setSyncStatus('error');
      if (isInitial) {
        setError("Handshake Gagal. Sistem menggunakan mod Kecemasan.");
        setIsLoading(false); // Pastikan loading tamat walaupun ralat
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

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-[200] bg-[#020617] flex flex-col items-center justify-center p-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.05)_0%,transparent_70%)]"></div>
          
          <div className="relative mb-16">
            <div className="w-32 h-32 border-4 border-white/5 border-t-red-600 rounded-[2.5rem] animate-[spin_1.5s_linear_infinite] shadow-[0_0_30px_rgba(239,68,68,0.2)]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <Cpu className="w-12 h-12 text-red-600 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse" />
            </div>
          </div>
          
          <div className="text-center space-y-8 max-w-sm relative z-10">
            <h2 className="text-[12px] font-black text-white uppercase tracking-[0.6em] mb-2">Syncing Command Center</h2>
            <div className="h-1 w-48 bg-white/5 mx-auto rounded-full overflow-hidden">
               <div className="h-full bg-red-600 animate-[shimmer_2s_infinite_linear] w-[60%]"></div>
            </div>
          </div>
        </div>
      )}

      <Layout 
        data={data} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        syncStatus={syncStatus} 
        onSync={() => pullData()}
      >
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {activeTab === 'dashboard' && <Dashboard data={data} />}
          {activeTab === 'pendaftaran' && <PendaftaranIndex data={data} updateData={handleUpdateData} onPrint={(id, type = 'PENDAFTARAN') => setPrintConfig({ isOpen: true, type: type as ReportType, targetId: id })} />}
          {activeTab === 'guru' && <GuruManager data={data} updateData={handleUpdateData} />}
          {activeTab === 'ahli' && <AhliManager data={data} updateData={handleUpdateData} onPrint={() => setPrintConfig({ isOpen: true, type: 'AHLI' })} />}
          {activeTab === 'ajk' && <AJKManager data={data} updateData={handleUpdateData} onPrint={() => setPrintConfig({ isOpen: true, type: 'AJK' })} />}
          {activeTab === 'kehadiran' && <KehadiranManager data={data} updateData={handleUpdateData} onPrint={() => setPrintConfig({ isOpen: true, type: 'KEHADIRAN' })} />}
          {activeTab === 'aktiviti' && <AktivitiManager data={data} updateData={handleUpdateData} onPrint={(id) => setPrintConfig({ isOpen: true, type: 'AKTIVITI', targetId: id })} />}
          {activeTab === 'rancangan' && <RancanganManager data={data} updateData={handleUpdateData} />}
          {activeTab === 'settings' && <Settings data={data} updateData={handleUpdateData} onForcePull={() => pullData()} />}
        </div>
      </Layout>
    </>
  );
};

export default App;