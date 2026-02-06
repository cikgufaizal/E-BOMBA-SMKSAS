import React, { useState, useRef } from 'react';
import { CheckCircle2, RefreshCw, Lock, Shield, Link, AlertTriangle, Database, UploadCloud, DownloadCloud, FileDown, FileUp, Image as ImageIcon, Trash2 } from 'lucide-react';
import { SystemData } from '../types';
import { FormCard, Input, Button } from './CommonUI';
import { saveData, saveDataToCloud } from '../utils/storage';

interface Props {
  data: SystemData;
  updateData: (newData: Partial<SystemData>) => void;
  onForcePull: () => void;
}

const Settings: React.FC<Props> = ({ data, updateData, onForcePull }) => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  const [schoolName, setSchoolName] = useState(data.settings?.schoolName || '');
  const [clubName, setClubName] = useState(data.settings?.clubName || '');
  const [address, setAddress] = useState(data.settings?.address || '');
  
  // LOGO STATES
  const [logoUrl, setLogoUrl] = useState(data.settings?.logoUrl || '');
  const [bombaLogoUrl, setBombaLogoUrl] = useState(data.settings?.bombaLogoUrl || '');

  const [isSaving, setIsSaving] = useState(false);
  
  const schoolLogoInputRef = useRef<HTMLInputElement>(null);
  const bombaLogoInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'CEB1003') setIsAuthorized(true);
    else { alert("Akses Ditolak!"); setPassword(''); }
  };

  // GENERIC LOGO UPLOAD HANDLER (Max 2MB)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'school' | 'bomba') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Had 2MB
        alert("Saiz fail terlalu besar! Sila gunakan imej bawah 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'school') {
            setLogoUrl(reader.result as string);
        } else {
            setBombaLogoUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `BACKUP_BOMBA_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (e: any) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (event: any) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (confirm("Gantikan data sedia ada dengan fail backup ini?")) {
          updateData(imported);
          alert("Restore Berjaya!");
        }
      } catch (err) { alert("Format fail tidak sah!"); }
    };
  };

  const factoryReset = () => {
    if (confirm("AMARAN KRITIKAL: Adakah anda pasti mahu memadam SEMUA data sistem?\n\n(Guru, Pelajar, Kehadiran, Aktiviti akan dipadam kekal).\n\nTetapan Sekolah & URL Cloud akan dikekalkan.")) {
      if (prompt("Taip 'RESET' untuk sahkan operasi ini:") === 'RESET') {
        const emptyData: SystemData = {
          teachers: [],
          students: [],
          committees: [],
          attendances: [],
          activities: [],
          annualPlans: [],
          settings: data.settings, // KEKALKAN SETTINGS
          lastUpdated: Date.now()
        };
        updateData(emptyData);
        alert("Sistem telah direset sepenuhnya. Sedia untuk sesi baru.");
      } else {
        alert("Kod pengesahan salah. Batal.");
      }
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl text-center">
          <Lock className="w-12 h-12 text-red-600 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-white uppercase italic mb-8">Admin Restricted Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="ENTER ADMIN KEY" className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-center text-white font-black" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
            <Button type="submit" className="w-full h-14">AUTHORIZE SESSION</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in">
      <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-5">
          <Shield className="w-8 h-8 text-red-600" />
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">System Intelligence Core</h2>
        </div>
        <Button variant="secondary" onClick={() => setIsAuthorized(false)}>Secured Exit</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormCard title="Local Data Backup">
          <div className="space-y-4">
            <Button onClick={exportData} variant="success" className="w-full">
              <FileDown className="w-4 h-4" /> Export JSON Backup
            </Button>
            <div className="relative">
              <input type="file" className="hidden" id="import-json" onChange={importData} accept=".json" />
              <Button onClick={() => document.getElementById('import-json')?.click()} variant="secondary" className="w-full">
                <FileUp className="w-4 h-4" /> Import JSON Backup
              </Button>
            </div>
          </div>
        </FormCard>

        <FormCard title="Cloud Handshake">
           <div className="space-y-4">
              <Button onClick={onForcePull} variant="secondary" className="w-full">
                <DownloadCloud className="w-4 h-4" /> Manual Pull from Cloud
              </Button>
              <Button onClick={async () => { setIsSaving(true); const r = await saveDataToCloud(data); setIsSaving(false); alert(r.message); }} className="w-full">
                {isSaving ? <RefreshCw className="animate-spin w-4 h-4" /> : <UploadCloud className="w-4 h-4" />} Push Local to Cloud
              </Button>
           </div>
        </FormCard>
      </div>

      <FormCard title="Global Unit Profiles">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LOGO SEKOLAH */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Logo Sekolah (Header Sekolah)</label>
            <div className="flex items-center gap-4 p-4 bg-slate-950/50 border border-white/[0.05] rounded-[2rem]">
              <div className="w-24 h-24 bg-slate-900 rounded-2xl border-2 border-dashed border-slate-800 flex items-center justify-center overflow-hidden shrink-0 group relative">
                {logoUrl ? (
                  <>
                    <img src={logoUrl} alt="School Logo" className="w-full h-full object-contain p-2" />
                    <button 
                      onClick={() => setLogoUrl('')}
                      className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </>
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-700" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Max Size: 2MB</p>
                <input type="file" ref={schoolLogoInputRef} onChange={(e) => handleLogoUpload(e, 'school')} accept="image/*" className="hidden" />
                <Button variant="secondary" onClick={() => schoolLogoInputRef.current?.click()} className="w-full py-2 text-[10px]">
                  Upload Logo Sekolah
                </Button>
              </div>
            </div>
          </div>

          {/* LOGO BOMBA */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Logo Bomba (Header Bomba)</label>
            <div className="flex items-center gap-4 p-4 bg-slate-950/50 border border-white/[0.05] rounded-[2rem]">
              <div className="w-24 h-24 bg-slate-900 rounded-2xl border-2 border-dashed border-slate-800 flex items-center justify-center overflow-hidden shrink-0 group relative">
                {bombaLogoUrl ? (
                  <>
                    <img src={bombaLogoUrl} alt="Bomba Logo" className="w-full h-full object-contain p-2" />
                    <button 
                      onClick={() => setBombaLogoUrl('')}
                      className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </>
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-700" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Max Size: 2MB</p>
                <input type="file" ref={bombaLogoInputRef} onChange={(e) => handleLogoUpload(e, 'bomba')} accept="image/*" className="hidden" />
                <Button variant="secondary" onClick={() => bombaLogoInputRef.current?.click()} className="w-full py-2 text-[10px]">
                  Upload Logo Bomba
                </Button>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6 mt-4">
              <Input label="Nama Sekolah" value={schoolName} onChange={(e: any) => setSchoolName(e.target.value)} />
              <Input label="Nama Unit" value={clubName} onChange={(e: any) => setClubName(e.target.value)} />
              <Input label="Alamat Surat-Menyurat" value={address} onChange={(e: any) => setAddress(e.target.value)} />
          </div>

          <Button 
            onClick={() => { 
              updateData({ settings: { 
                  ...data.settings, 
                  schoolName, 
                  clubName, 
                  address, 
                  logoUrl, 
                  bombaLogoUrl, 
                  sheetUrl: data.settings?.sheetUrl || '' 
              } as any }); 
              alert("Profil & Logo dikemaskini."); 
            }} 
            className="md:col-span-2 h-14"
          >
            Kemaskini Profil Global
          </Button>
        </div>
      </FormCard>

      <FormCard title="Zon Bahaya (Danger Zone)">
          <div className="p-6 bg-red-950/20 border border-red-900/40 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex items-center gap-6">
                <div className="p-4 bg-red-600/10 rounded-2xl shrink-0">
                   <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <div>
                   <h4 className="font-black text-white uppercase text-sm tracking-widest mb-1">Factory Reset Sistem</h4>
                   <p className="text-[10px] text-red-400 font-bold uppercase leading-relaxed max-w-md">
                     Tindakan ini akan memadam SEMUA rekod (Ahli, Guru, Kehadiran, Aktiviti) secara kekal. 
                     Hanya Tetapan Sekolah akan dikekalkan. Sila Export Backup dahulu.
                   </p>
                </div>
             </div>
             <Button variant="danger" onClick={factoryReset} className="w-full md:w-auto px-8 h-14 shadow-none border-red-600/50 hover:bg-red-600">
                Lakukan Reset Penuh
             </Button>
          </div>
      </FormCard>
    </div>
  );
};

export default Settings;