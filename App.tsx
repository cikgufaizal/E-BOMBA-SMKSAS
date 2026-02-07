import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { loadData, saveData, fetchDataFromCloud, saveDataToCloud } from './utils/storage';
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
  const [data, setData] = useState<SystemData>(loadData());
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error' | 'success'>('idle');
  const [isInitializing, setIsInitializing] = useState(true);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  
  const [printConfig, setPrintConfig] = useState<{ isOpen: boolean; type: ReportType | null; targetId?: string }>({
    isOpen: false,
    type: null
  });

  const pullFromCloud = useCallback(async (isInitial = false) => {
    if (!isInitial) setSyncStatus('syncing');
    
    const cloudData = await fetchDataFromCloud();
    
    if (cloudData) {
      const currentLocal = loadData();
      const cloudTime = cloudData.lastUpdated || 0;
      const localTime = currentLocal.lastUpdated || 0;

      // PENTING: Ambil data Cloud jika:
      // 1. Data Cloud lebih baru (lastUpdated lebih besar)
      // 2. ATAU Local memang kosong (Laptop Baru / Incognito)
      if (cloudTime > localTime || currentLocal.students.length === 0) {
        setData(cloudData);
        saveData(cloudData);
        setSyncStatus('success');
      } else {
        setSyncStatus('idle');
      }
    } else {
      if (isInitial && data.students.length === 0) {
        setSyncMessage("Sistem gagal menarik data Cloud. Sila benarkan cookies atau log masuk akaun Google.");
      }
      setSyncStatus('error');
    }
    
    if (isInitial) {
      setTimeout(() => setIsInitializing(false), 2000);
    }
    
    setTimeout(() => {
      setSyncStatus('idle');
      if (!isInitial) setSyncMessage(null);
    }, 4000);
  }, [data.students.length]);

  useEffect(() => {
    pullFromCloud(true);
  }, []);

  const handleUpdateData = async (newData: Partial<SystemData>) => {
    const updated = { ...data, ...newData, lastUpdated: Date.now() };
    setData(updated);
    saveData(updated); 

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
      {isInitializing && (
        <div className="fixed inset-0 z-[200] bg-brand-dark flex flex-col items-center justify-center p-10">
          <div className="relative mb-10">
            <div className="w-28 h-28 border-2 border-red-600/10 border-t-red-600 rounded-full animate-spin"></div>
            <ShieldCheck className="w-10 h-10 text-red-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="text-center space-y-4">
            <h2 className="text-[12px] font-black text-white uppercase tracking-[0.5em] animate-pulse">Establishing Cloud Handshake</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Memuatkan pangkalan data dari Google Cloud...</p>
          </div>
          
          {syncMessage && (
             <div className="mt-12 max-w-sm text-center p-6 bg-amber-600/10 border border-amber-600/20 rounded-3xl flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
                <AlertCircle className="w-6 h-6 text-amber-500" />
                <p className="text-[10px] font-black text-amber-200 uppercase leading-relaxed tracking-widest">{syncMessage}</p>
                <button 
                  onClick={() => pullFromCloud(false)}
                  className="px-6 py-2 bg-amber-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2"
                >
                  <RefreshCw className="w-3 h-3" /> Cuba Lagi
                </button>
             </div>
          )}
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