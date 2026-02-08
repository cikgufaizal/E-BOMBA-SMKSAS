import React, { useState, useRef } from 'react';
import { CheckCircle2, RefreshCw, Lock, Shield, Search, UploadCloud, DownloadCloud, FileDown, FileUp, Image as ImageIcon, AlertTriangle, Loader2 } from 'lucide-react';
import { SystemData } from '../types';
import { FormCard, Input, Button } from './CommonUI';
import { saveDataToCloud, fetchDataFromCloud } from '../utils/storage';
import { CLOUD_API_URL } from '../constants';
import { compressImage } from '../utils/imageUtils';

interface Props {
  data: SystemData;
  updateData: (newData: Partial<SystemData>) => void;
  onForcePull: () => void;
}

const Settings: React.FC<Props> = ({ data, updateData, onForcePull }) => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [schoolName, setSchoolName] = useState(data.settings?.schoolName || '');
  const [address, setAddress] = useState(data.settings?.address || '');
  const [logoUrl, setLogoUrl] = useState(data.settings?.logoUrl || '');
  const [bombaLogoUrl, setBombaLogoUrl] = useState(data.settings?.bombaLogoUrl || '');

  const schoolLogoInputRef = useRef<HTMLInputElement>(null);
  const bombaLogoInputRef = useRef<HTMLInputElement>(null);

  const dataSize = JSON.stringify(data).length;
  const isOverLimit = dataSize > 500000; // 500k as safe warning limit for multi-row storage

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'CEB1003') setIsAuthorized(true);
    else { alert("Akses Ditolak!"); setPassword(''); }
  };

  const pushToCloud = async () => {
    setIsSaving(true);
    const res = await saveDataToCloud(data);
    setIsSaving(false);
    alert(res.message);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'school' | 'bomba') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      // Auto compress to 300KB
      const compressed = await compressImage(file, 300);
      if (type === 'school') setLogoUrl(compressed);
      else setBombaLogoUrl(compressed);
    } catch (err) {
      console.error("Ralat memproses logo:", err);
      alert("Gagal memproses gambar.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl text-center">
          <Lock className="w-12 h-12 text-red-600 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-white uppercase italic mb-8">Admin Access Only</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="ENTER ADMIN KEY" className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-center text-white font-black" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
            <Button type="submit" className="w-full h-14">AUTHORIZE</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in">
      <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 flex justify-between items-center shadow-xl">
        <div className="flex items-center gap-5">
          <Shield className="w-8 h-8 text-red-600" />
          <div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">System Intelligence Core</h2>
            <div className="flex items-center gap-2 mt-1">
              <p className={`text-[9px] font-black uppercase tracking-widest ${isOverLimit ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>
                Payload Size: {dataSize.toLocaleString()} / 1,000,000 chars
              </p>
              {isOverLimit && <AlertTriangle className="w-3 h-3 text-red-500" />}
            </div>
          </div>
        </div>
        <Button variant="secondary" onClick={() => setIsAuthorized(false)}>Secured Exit</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormCard title="Cloud Synchronization">
           <div className="space-y-4">
              <Button onClick={onForcePull} variant="secondary" className="w-full">
                <DownloadCloud className="w-4 h-4" /> Pull From Cloud
              </Button>
              <Button onClick={pushToCloud} className="w-full" disabled={isSaving}>
                {isSaving ? <RefreshCw className="animate-spin w-4 h-4" /> : <UploadCloud className="w-4 h-4" />} Push To Cloud
              </Button>
           </div>
        </FormCard>

        <FormCard title="Local Data Control">
          <div className="space-y-4">
            <Button onClick={() => {
              const dataStr = JSON.stringify(data, null, 2);
              const blob = new Blob([dataStr], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `BACKUP_KADET_BOMBA_${new Date().toISOString().split('T')[0]}.json`;
              link.click();
            }} variant="success" className="w-full">
              <FileDown className="w-4 h-4" /> Export JSON
            </Button>
            <input type="file" className="hidden" id="import-json" onChange={(e: any) => {
              const reader = new FileReader();
              reader.onload = (event: any) => {
                try {
                  const imported = JSON.parse(event.target.result);
                  if (confirm("Gantikan semua data sedia ada?")) updateData(imported);
                } catch (err) { alert("Format fail tidak sah."); }
              };
              reader.readAsText(e.target.files[0]);
            }} accept=".json" />
            <Button onClick={() => document.getElementById('import-json')?.click()} variant="secondary" className="w-full">
              <FileUp className="w-4 h-4" /> Import JSON
            </Button>
          </div>
        </FormCard>
      </div>

      <FormCard title="Official Branding">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Logo Sekolah</label>
               {isProcessing && <span className="text-[9px] text-red-500 font-bold animate-pulse">Memproses...</span>}
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-950/50 border border-white/[0.05] rounded-[2rem]">
              <div className="w-20 h-20 bg-slate-900 rounded-2xl border-2 border-dashed border-slate-800 flex items-center justify-center overflow-hidden">
                {logoUrl ? <img src={logoUrl} className="w-full h-full object-contain p-2" /> : <ImageIcon className="w-6 h-6 text-slate-700" />}
              </div>
              <input type="file" ref={schoolLogoInputRef} onChange={(e) => handleLogoUpload(e, 'school')} className="hidden" accept="image/*" />
              <Button variant="secondary" onClick={() => schoolLogoInputRef.current?.click()} className="flex-1 py-3 text-[9px]" disabled={isProcessing}>Pilih Fail</Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Logo Bomba</label>
               {isProcessing && <span className="text-[9px] text-red-500 font-bold animate-pulse">Memproses...</span>}
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-950/50 border border-white/[0.05] rounded-[2rem]">
              <div className="w-20 h-20 bg-slate-900 rounded-2xl border-2 border-dashed border-slate-800 flex items-center justify-center overflow-hidden">
                {bombaLogoUrl ? <img src={bombaLogoUrl} className="w-full h-full object-contain p-2" /> : <ImageIcon className="w-6 h-6 text-slate-700" />}
              </div>
              <input type="file" ref={bombaLogoInputRef} onChange={(e) => handleLogoUpload(e, 'bomba')} className="hidden" accept="image/*" />
              <Button variant="secondary" onClick={() => bombaLogoInputRef.current?.click()} className="flex-1 py-3 text-[9px]" disabled={isProcessing}>Pilih Fail</Button>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <Input label="Nama Institusi" value={schoolName} onChange={(e: any) => setSchoolName(e.target.value)} />
            <Input label="Alamat Rasmi" value={address} onChange={(e: any) => setAddress(e.target.value)} />
          </div>

          <Button 
            onClick={() => {
              updateData({ settings: { ...data.settings, schoolName, address, logoUrl, bombaLogoUrl } as any });
              alert("Tetapan disimpan secara lokal. Sila Push ke Cloud.");
            }} 
            className="md:col-span-2 h-14"
            disabled={isProcessing}
          >
            {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /> Sedang Memproses Gambar...</> : 'Sahkan Perubahan Profil'}
          </Button>
        </div>
      </FormCard>
    </div>
  );
};

export default Settings;
