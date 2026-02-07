import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, CloudLightning, RefreshCw, WifiOff, AlertCircle } from 'lucide-react';
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

  /**
   * Fungsi Utama: Tarik data dari Google Sheet
   */
  const pullFromCloud = useCallback(async (isInitial = false) => {
    if (!isInitial) setSyncStatus('syncing');
    else setIsLoading(true);
    
    const cloudData = await fetchDataFromCloud();
    
    if (cloudData) {
      setData(cloudData);
      setSyncStatus('success');
      setError(null);
    } else {
      setSyncStatus('error');
      if (isInitial) {
        setError("Gagal menyambung ke Cloud. Sila pastikan URL API betul dan benarkan 'Third-party Cookies' pada pelayar anda.");
      }
    }
    
    if (isInitial) {
      setTimeout(() => setIsLoading(false), 1500);
    }
    
    setTimeout(() => setSyncStatus('idle'), 3000);
  }, []);

  // Jalankan fetch setiap kali aplikasi dibuka
  useEffect(() => {
    pullFromCloud(true);
  }, [pullFromCloud]);

  /**
   * Fungsi Utama: Simpan data ke Google Sheet
   */
  const handleUpdateData = async (newData: Partial<SystemData>) => {
    const updated = { ...data, ...newData, lastUpdated: Date.now() };
    setData(updated); // Kemaskini UI serta-merta (Optimistic Update)

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
      {/* CLOUD INITIALIZATION OVERLAY */}
      {isLoading && (
        <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center p-10">
          <div className="relative mb-12">
            <div className="w-32 h-32 border-4 border-red-600/10 border-t-red-600 rounded-full animate-spin"></div>
            <CloudLightning className="w-12 h-12 text-red-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          
          <div className="text-center space-y-6 max-w-md">
            <h2 className="text-sm font-black text-white uppercase tracking-[0.6em] animate-pulse">Establishing Live Cloud Link</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
              Sistem sedang menarik pangkalan data terkini dari Google Sheets untuk peranti anda.
            </p>
            
            {error && (
              <div className="mt-8 p-6 bg-red-600/10 border border-red-600/20 rounded-[2rem] flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <p className="text-[10px] font-black text-red-200 uppercase leading-relaxed tracking-widest text-center">
                  {error}
                </p>
                <button 
                  onClick={() => pullFromCloud(true)}
                  className="px-8 py-3 bg-red-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-500 transition-all"
                >
                  <RefreshCw className="w-3 h-3" /> Cuba Lagi
                </button>
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
        {activeTab === 'settings' && <Settings data={data} updateData={handleUpdateData} onForcePull={() => pullFromCloud(false)} />}
      </Layout>
    </>
  );
};

export default App;