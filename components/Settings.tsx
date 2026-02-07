import React, { useState, useRef } from 'react';
import { CheckCircle2, RefreshCw, Lock, Shield, Search, UploadCloud, DownloadCloud, FileDown, FileUp, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { SystemData } from '../types';
import { FormCard, Input, Button } from './CommonUI';
import { saveDataToCloud, fetchDataFromCloud } from '../utils/storage';
import { CLOUD_API_URL } from '../constants';

interface Props {
  data: SystemData;
  updateData: (newData: Partial<SystemData>) => void;
  onForcePull: () => void;
}

const Settings: React.FC<Props> = ({ data, updateData, onForcePull }) => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [debugResult, setDebugResult] = useState<string | null>(null);
  
  const [schoolName, setSchoolName] = useState(data.settings?.schoolName || '');
  const [clubName, setClubName] = useState(data.settings?.clubName || '');
  const [address, setAddress] = useState(data.settings?.address || '');
  const [logoUrl, setLogoUrl] = useState(data.settings?.logoUrl || '');
  const [bombaLogoUrl, setBombaLogoUrl] = useState(data.settings?.bombaLogoUrl || '');

  const schoolLogoInputRef = useRef<HTMLInputElement>(null);
  const bombaLogoInputRef = useRef<HTMLInputElement>(null);

  const dataSize = JSON.stringify(data).length;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'CEB1003') setIsAuthorized(true);
    else { alert("Akses Ditolak!"); setPassword(''); }
  };

  const runDiagnostics = async () => {
    setDebugResult("Mengesahkan sambungan...");
    const res = await fetchDataFromCloud();
    if (res) {
      setDebugResult(`BERJAYA: Awan responsif. Saiz pangkalan data: ${JSON.stringify(res).length} aksara.`);
    } else {
      setDebugResult("GAGAL: Google Script tidak memulangkan data yang sah.");
    }
  };

  const pushToCloud = async () => {
    setIsSaving(true);
    const res = await saveDataToCloud(data);
    setIsSaving(false);
    alert(res.message);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'school' | 'bomba') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        alert("Saiz fail terlalu besar! Had 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'school') setLogoUrl(reader.result as string);
        else setBombaLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
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
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Data Size: {dataSize} / 1,000,000 chars</p>
          </div>
        </div>
        <Button variant="secondary" onClick={() => setIsAuthorized(false)}>Secured Exit</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormCard title="Cloud Handshake (Chunking)">
           <div className="space-y-4">
              <Button onClick={onForcePull} variant="secondary" className="w-full">
                <DownloadCloud className="w-4 h-4" /> Pull From Cloud
              </Button>
              <Button onClick={pushToCloud} className="w-full" disabled={isSaving}>
                {isSaving ? <RefreshCw className="animate-spin w-4 h-4" /> : <UploadCloud className="w-4 h-4" />} Push To Cloud
              </Button>
              <div className="mt-4 pt-4 border-t border-white/5">
                <button onClick={runDiagnostics} className="w-full py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-red-500 transition-colors flex items-center justify-center gap-2">
                  <Search className="w-3 h-3" /> Jalankan Diagnostik Sambungan
                </button>
                {debugResult && (
                  <div className="mt-3 p-4 bg-slate-950 rounded-xl border border-white/5 text-center">
                    <p className="text-[9px] font-bold text-red-400 uppercase tracking-wider">{debugResult}</p>
                  </div>
                )}
              </div>
           </div>
        </FormCard>

        <FormCard title="Local Backup (Offline)">
          <div className="space-y-4">
            <Button onClick={() => {
              const dataStr = JSON.stringify(data, null, 2);
              const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
              const link = document.createElement('a');
              link.setAttribute('href', dataUri);
              link.setAttribute('download', `BACKUP_KADET_BOMBA_${Date.now()}.json`);
              link.click();
            }} variant="success" className="w-full">
              <FileDown className="w-4 h-4" /> Download Backup
            </Button>
            <input type="file" className="hidden" id="import-json" onChange={(e: any) => {
              const reader = new FileReader();
              reader.readAsText(e.target.files[0], "UTF-8");
              reader.onload = (event: any) => {
                try {
                  const imported = JSON.parse(event.target.result);
                  if (confirm("Overwrite current data?")) updateData(imported);
                } catch (err) { alert("Invalid file."); }
              };
            }} accept=".json" />
            <Button onClick={() => document.getElementById('import-json')?.click()} variant="secondary" className="w-full">
              <FileUp className="w-4 h-4" /> Restore Backup
            </Button>
          </div>
        </FormCard>
      </div>

      <FormCard title="Profil Global & Logo">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Logo Sekolah</label>
            <div className="flex items-center gap-4 p-4 bg-slate-950/50 border border-white/[0.05] rounded-[2rem]">
              <div className="w-20 h-20 bg-slate-900 rounded-2xl border-2 border-dashed border-slate-800 flex items-center justify-center overflow-hidden">
                {logoUrl ? <img src={logoUrl} className="w-full h-full object-contain p-2" /> : <ImageIcon className="w-6 h-6 text-slate-700" />}
              </div>
              <input type="file" ref={schoolLogoInputRef} onChange={(e) => handleLogoUpload(e, 'school')} className="hidden" />
              <Button variant="secondary" onClick={() => schoolLogoInputRef.current?.click()} className="flex-1 py-3 text-[9px]">Tukar Logo</Button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Logo Bomba</label>
            <div className="flex items-center gap-4 p-4 bg-slate-950/50 border border-white/[0.05] rounded-[2rem]">
              <div className="w-20 h-20 bg-slate-900 rounded-2xl border-2 border-dashed border-slate-800 flex items-center justify-center overflow-hidden">
                {bombaLogoUrl ? <img src={bombaLogoUrl} className="w-full h-full object-contain p-2" /> : <ImageIcon className="w-6 h-6 text-slate-700" />}
              </div>
              <input type="file" ref={bombaLogoInputRef} onChange={(e) => handleLogoUpload(e, 'bomba')} className="hidden" />
              <Button variant="secondary" onClick={() => bombaLogoInputRef.current?.click()} className="flex-1 py-3 text-[9px]">Tukar Logo</Button>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <Input label="Nama Institusi" value={schoolName} onChange={(e: any) => setSchoolName(e.target.value)} />
            <Input label="Alamat Rasmi" value={address} onChange={(e: any) => setAddress(e.target.value)} />
          </div>

          <Button 
            onClick={() => {
              updateData({ settings: { ...data.settings, schoolName, clubName, address, logoUrl, bombaLogoUrl, sheetUrl: CLOUD_API_URL } as any });
              alert("Profil dikemaskini.");
            }} 
            className="md:col-span-2 h-14"
          >
            Update Official Profile
          </Button>
        </div>
      </FormCard>

      <FormCard title="Factory Reset">
          <div className="p-8 bg-red-950/20 border border-red-900/40 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex items-center gap-6">
                <AlertTriangle className="w-10 h-10 text-red-600" />
                <div>
                   <h4 className="font-black text-white uppercase text-sm mb-1">Padam Semua Data</h4>
                   <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest leading-relaxed">Operasi ini akan memadam semua data kekal di Cloud.</p>
                </div>
             </div>
             <Button variant="danger" onClick={() => {
               if (prompt("Type 'RESET' to confirm:") === 'RESET') {
                 updateData({ teachers: [], students: [], committees: [], attendances: [], activities: [], annualPlans: [], lastUpdated: Date.now() });
                 alert("Sistem telah direset.");
               }
             }} className="w-full md:w-auto h-14">RESET SYSTEM</Button>
          </div>
      </FormCard>
    </div>
  );
};

export default Settings;