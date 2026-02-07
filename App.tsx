import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck } from 'lucide-react';
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
  
  // State Print
  const [printConfig, setPrintConfig] = useState<{ isOpen: boolean; type: ReportType | null; targetId?: string }>({
    isOpen: false,
    type: null
  });

  const pullFromCloud = useCallback(async (isInitial = false) => {
    if (!isInitial) setSyncStatus('syncing');
    
    const cloudData = await fetchDataFromCloud();
    
    if (cloudData) {
      const cloudTime = cloudData.lastUpdated || 0;
      // Gunakan loadData() terkini untuk perbandingan tepat
      const currentLocal = loadData();
      const localTime = currentLocal.lastUpdated || 0;

      // SYNC LOGIC:
      // 1. Jika data cloud lebih baru (laptop lain update)
      // 2. ATAU jika lokal kosong (laptop baru/incognito)
      if (cloudTime > localTime || currentLocal.students.length === 0) {
        setData(cloudData);
        saveData(cloudData);
        setSyncStatus('success');
      } else {
        setSyncStatus('idle');
      }
    } else {
      // Jika fail tarik data semasa startup, jangan terus error (mungkin sheet baru)
      if (!isInitial) setSyncStatus('error');
    }
    
    if (isInitial) setIsInitializing(false);
    setTimeout(() => setSyncStatus('idle'), 2000);
  }, []);

  useEffect(() => {
    pullFromCloud(true);
  }, [pullFromCloud]);

  // Auto-sync setiap 2 minit jika ada perubahan di cloud (laptop lain)
  useEffect(() => {
    const interval = setInterval(() => {
      pullFromCloud(false);
    }, 120000); 
    return () => clearInterval(interval);
  }, [pullFromCloud]);

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
        <div className="fixed inset-0 z-[200] bg-brand-dark flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 border-2 border-red-600/10 border-t-red-600 rounded-full animate-spin"></div>
            <ShieldCheck className="w-8 h-8 text-red-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="mt-8 text-[10px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Establishing Cloud Handshake...</h2>
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