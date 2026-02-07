import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, AlertCircle, Wifi } from 'lucide-react';
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

  // Fungsi Tarik Data yang Ringkas & Padat
  const pullData = async (isInitial = false) => {
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
        throw new Error("Gagal menarik data. Sila semak internet atau Deployment Google Script.");
      }
    } catch (err) {
      setSyncStatus('error');
      if (isInitial) {
        setError("Sistem gagal menghubungi pangkalan data Cloud. Pastikan Deployment diset kepada 'Anyone'.");
      }
    } finally {
      // Tunggu kejap baru tutup loading untuk UX yang lancar
      if (!isInitial) setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  useEffect(() => {
    pullData(true);
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
          <div className="relative mb-10">
            <div className="w-20 h-20 border-4 border-red-600/10 border-t-red-600 rounded-full animate-spin"></div>
            <Database className="w-8 h-8 text-red-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="text-center space-y-5 max-w-sm">
            <h2 className="text-[10px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Menghubungkan Database...</h2>
            {error ? (
              <div className="p-6 bg-red-600/10 border border-red-600/20 rounded-3xl space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <AlertCircle className="w-6 h-6 text-red-500 mx-auto" />
                <p className="text-[9px] text-red-300 font-bold uppercase leading-relaxed tracking-wider">{error}</p>
                <div className="flex flex-col gap-2">
                  <button onClick={() => pullData(true)} className="px-6 py-3 bg-red-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                    <RefreshCw className="w-3 h-3" /> Cuba Lagi
                  </button>
                  <button onClick={() => setIsLoading(false)} className="px-6 py-3 bg-slate-800 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest">
                    Guna Data Tempatan
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em] leading-relaxed">Sila tunggu sebentar sementara sistem memuatkan data terkini dari Google Sheets.</p>
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
        {activeTab === 'dashboard' && <Dashboard data={data} />}
        {activeTab === 'pendaftaran' && <PendaftaranIndex data={data} updateData={handleUpdateData} onPrint={(id, type = 'PENDAFTARAN') => setPrintConfig({ isOpen: true, type: type as ReportType, targetId: id })} />}
        {activeTab === 'guru' && <GuruManager data={data} updateData={handleUpdateData} />}
        {activeTab === 'ahli' && <AhliManager data={data} updateData={handleUpdateData} onPrint={() => setPrintConfig({ isOpen: true, type: 'AHLI' })} />}
        {activeTab === 'ajk' && <AJKManager data={data} updateData={handleUpdateData} onPrint={() => setPrintConfig({ isOpen: true, type: 'AJK' })} />}
        {activeTab === 'kehadiran' && <KehadiranManager data={data} updateData={handleUpdateData} onPrint={() => setPrintConfig({ isOpen: true, type: 'KEHADIRAN' })} />}
        {activeTab === 'aktiviti' && <AktivitiManager data={data} updateData={handleUpdateData} onPrint={(id) => setPrintConfig({ isOpen: true, type: 'AKTIVITI', targetId: id })} />}
        {activeTab === 'rancangan' && <RancanganManager data={data} updateData={handleUpdateData} />}
        {activeTab === 'settings' && <Settings data={data} updateData={handleUpdateData} onForcePull={() => pullData()} />}
      </Layout>
    </>
  );
};

export default App;
