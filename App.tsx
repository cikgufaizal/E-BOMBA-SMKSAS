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
      const localTime = data.lastUpdated || 0;

      if (cloudTime > localTime || data.students.length === 0) {
        setData(cloudData);
        saveData(cloudData);
        setSyncStatus('success');
      } else {
        setSyncStatus('idle');
      }
    } else {
      setSyncStatus('error');
    }
    
    if (isInitial) setIsInitializing(false);
    setTimeout(() => setSyncStatus('idle'), 2000);
  }, [data.lastUpdated, data.students.length]);

  useEffect(() => {
    pullFromCloud(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      pullFromCloud(false);
    }, 60000); 
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

  // --- LOGIC UTAMA FIX PRINT ---
  // Jika sedang print, kita pulangkan PrintContainer SAHAJA.
  // Layout Dashboard TIDAK AKAN WUJUD dalam DOM.
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

  // Paparan Biasa (Dashboard)
  return (
    <>
      {isInitializing && (
        <div className="fixed inset-0 z-[200] bg-brand-dark flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 border-2 border-red-600/10 border-t-red-600 rounded-full animate-spin"></div>
            <ShieldCheck className="w-8 h-8 text-red-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="mt-8 text-[10px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Initializing Security Systems...</h2>
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