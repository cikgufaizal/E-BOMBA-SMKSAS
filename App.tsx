
import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, CloudLightning, RefreshCw, WifiOff, AlertCircle, Database, CheckCircle } from 'lucide-react';
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
  const [retryCount, setRetryCount] = useState(0);
  
  const [printConfig, setPrintConfig] = useState<{ isOpen: boolean; type: ReportType | null; targetId?: string }>({
    isOpen: false,
    type: null
  });

  const pullFromCloud = useCallback(async (isInitial = false) => {
    if (!isInitial) setSyncStatus('syncing');
    else setIsLoading(true);
    
    console.log(`Sync memulakan (Initial: ${isInitial}, Cubaan: ${retryCount + 1})`);
    
    try {
      const cloudData = await fetchDataFromCloud();
      
      if (cloudData) {
        // Berjaya dapat data, update state segera
        setData(cloudData);
        setSyncStatus('success');
        setError(null);
        setIsLoading(false);
        console.log("Data berjaya diselaraskan!");
      } else {
        // Gagal dapat data
        setSyncStatus('error');
        if (isInitial && retryCount < 2) {
          // Auto retry up to 2 times
          console.warn("Gagal, mencuba semula secara automatik...");
          setRetryCount(prev => prev + 1);
          setTimeout(() => pullFromCloud(true), 1500);
        } else if (isInitial) {
          setError("Gagal menghubungi pangkalan data Cloud selepas beberapa cubaan. Sila semak sambungan internet atau URL API.");
          setIsLoading(false);
        }
      }
    } catch (e) {
      setSyncStatus('error');
      if (isInitial) setIsLoading(false);
    } finally {
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  }, [retryCount]);

  useEffect(() => {
    // Jalankan sync sebaik sahaja aplikasi dibuka
    pullFromCloud(true);
  }, []);

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
        <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center p-10">
          <div className="relative mb-12">
            <div className="w-32 h-32 border-4 border-red-600/10 border-t-red-600 rounded-full animate-spin"></div>
            <Database className="w-12 h-12 text-red-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          
          <div className="text-center space-y-6 max-w-md">
            <h2 className="text-sm font-black text-white uppercase tracking-[0.6em] animate-pulse">
              {retryCount > 0 ? `Retrying Sync (${retryCount}/3)...` : 'Connecting to Cloud...'}
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
              Sila tunggu sebentar. Sistem sedang menarik pangkalan data terkini dari Google Sheets anda.
            </p>
            
            {error && (
              <div className="mt-8 p-6 bg-amber-600/10 border border-amber-600/20 rounded-[2rem] flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
                <AlertCircle className="w-6 h-6 text-amber-500" />
                <p className="text-[10px] font-black text-amber-200 uppercase leading-relaxed tracking-widest text-center">
                  {error}
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => { setError(null); setIsLoading(false); }}
                    className="px-6 py-3 bg-slate-800 text-white rounded-xl text-[9px] font-black uppercase tracking-widest"
                  >
                    Guna Data Lokal
                  </button>
                  <button 
                    onClick={() => { setRetryCount(0); pullFromCloud(true); }}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2"
                  >
                    <RefreshCw className="w-3 h-3" /> Cuba Lagi
                  </button>
                </div>
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
        onSync={() => pullFromCloud()}
      >
        {activeTab === 'dashboard' && <Dashboard data={data} />}
        {activeTab === 'pendaftaran' && <PendaftaranIndex data={data} updateData={handleUpdateData} onPrint={(id, type = 'PENDAFTARAN') => setPrintConfig({ isOpen: true, type: type as ReportType, targetId: id })} />}
        {activeTab === 'guru' && <GuruManager data={data} updateData={handleUpdateData} />}
        {activeTab === 'ahli' && <AhliManager data={data} updateData={handleUpdateData} onPrint={() => setPrintConfig({ isOpen: true, type: 'AHLI' })} />}
        {activeTab === 'ajk' && <AJKManager data={data} updateData={handleUpdateData} onPrint={() => setPrintConfig({ isOpen: true, type: 'AJK' })} />}
        {activeTab === 'kehadiran' && <KehadiranManager data={data} updateData={handleUpdateData} onPrint={() => setPrintConfig({ isOpen: true, type: 'KEHADIRAN' })} />}
        {activeTab === 'aktiviti' && <AktivitiManager data={data} updateData={handleUpdateData} onPrint={(id) => setPrintConfig({ isOpen: true, type: 'AKTIVITI', targetId: id })} />}
        {activeTab === 'rancangan' && <RancanganManager data={data} updateData={handleUpdateData} />}
        {activeTab === 'settings' && <Settings data={data} updateData={handleUpdateData} onForcePull={() => { setRetryCount(0); pullFromCloud(false); }} />}
      </Layout>
    </>
  );
};

export default App;
