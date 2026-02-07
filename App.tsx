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
        throw new Error("API RESPONSE NULL");
      }
    } catch (err) {
      setSyncStatus('error');
      if (isInitial) {
        setError("Sambungan pangkalan data gagal. Sistem beralih ke mod Offline.");
      }
    } finally {
      if (!isInitial) setTimeout(() => setSyncStatus('idle'), 3000);
    }
  }, []);

  useEffect(() => {
    pullData(true);
  }, [pullData]);

  const handleUpdateData = async (newData: Partial<SystemData>) => {
    const updated = { ...data, ...newData, lastUpdated: Date.now() };
    setData(updated); 
    setSyncStatus('syncing');
    const res = await saveDataToCloud(updated);
    setSyncStatus(res.success ? 'success' : 'error');
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
          {/* BACKGROUND EFFECTS */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.05)_0%,transparent_70%)]"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff05 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          
          <div className="relative mb-16 group">
            <div className="w-32 h-32 border-4 border-white/5 border-t-red-600 rounded-[2.5rem] animate-[spin_1.5s_linear_infinite] shadow-[0_0_30px_rgba(239,68,68,0.2)]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <Cpu className="w-12 h-12 text-red-600 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse" />
            </div>
            <div className="absolute -inset-4 border border-red-600/10 rounded-[3rem] animate-ping opacity-20"></div>
          </div>
          
          <div className="text-center space-y-8 max-w-sm relative z-10">
            <div>
               <h2 className="text-[12px] font-black text-white uppercase tracking-[0.6em] mb-2">Initialize Core</h2>
               <div className="h-1 w-48 bg-white/5 mx-auto rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 animate-[shimmer_2s_infinite_linear] w-[60%]"></div>
               </div>
            </div>
            
            {error ? (
              <div className="p-10 glass-panel rounded-[3rem] border-red-500/20 space-y-6">
                <WifiOff className="w-10 h-10 text-red-500 mx-auto" />
                <p className="text-[11px] text-red-200 font-black uppercase tracking-widest">{error}</p>
                <div className="flex flex-col gap-3">
                  <button onClick={() => pullData(true)} className="w-full py-5 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-red-900/40 flex items-center justify-center gap-3">
                    <RefreshCw className="w-4 h-4" /> Retry Handshake
                  </button>
                  <button onClick={() => setIsLoading(false)} className="w-full py-5 bg-slate-800 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">
                    Bypass to Local Mode
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                 <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] leading-relaxed animate-pulse">
                    Membaca tab DATA_GURU, DATA_AHLI dan DATA_AKTIVITI...
                 </p>
                 <p className="text-[8px] font-mono text-slate-700 uppercase tracking-widest">Encrypting WebSocket Connection [OK]</p>
              </div>
            )}
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