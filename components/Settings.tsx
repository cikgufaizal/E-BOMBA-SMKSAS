import React, { useState } from 'react';
import { CheckCircle2, RefreshCw, Lock, Shield, Link, AlertTriangle, Copy, School, MapPin, Type, Database, Check, UploadCloud, DownloadCloud } from 'lucide-react';
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
  const [sheetUrl, setSheetUrl] = useState(data.settings?.sheetUrl || '');
  const [schoolName, setSchoolName] = useState(data.settings?.schoolName || '');
  const [clubName, setClubName] = useState(data.settings?.clubName || '');
  const [address, setAddress] = useState(data.settings?.address || '');
  const [isSaving, setIsSaving] = useState(false);

  const CORRECT_PASSWORD = 'CEB1003';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) setIsAuthorized(true);
    else { alert("Kata laluan salah!"); setPassword(''); }
  };

  const handleSaveSettings = () => {
    const updatedSettings = { 
      ...data.settings,
      sheetUrl, schoolName, clubName, address,
      autoSync: true
    };
    updateData({ settings: updatedSettings });
    saveData({ ...data, settings: updatedSettings });
    alert("Tetapan Admin Disimpan!");
  };

  const handleForcePush = async () => {
    if (!sheetUrl) return alert("Sila masukkan URL API!");
    if (!confirm("Amaran: Data di Cloud (Google Sheets) akan digantikan dengan data Laptop ini. Teruskan?")) return;
    setIsSaving(true);
    const res = await saveDataToCloud(data);
    setIsSaving(false);
    alert(res.message);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl text-center">
          <Lock className="w-12 h-12 text-red-600 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-white uppercase italic mb-8">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="PASSWORD" className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-center text-white" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
            <Button type="submit" className="w-full h-14">VERIFY IDENTITY</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-5">
          <Shield className="w-8 h-8 text-red-600" />
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Enterprise Cloud Bridge</h2>
        </div>
        <Button variant="secondary" onClick={() => setIsAuthorized(false)}>Logout</Button>
      </div>

      <FormCard title="Manual Cloud Synchronization">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                 <DownloadCloud className="w-6 h-6 text-emerald-500" />
                 <h4 className="font-bold text-white uppercase text-xs">Tarik Data Cloud</h4>
              </div>
              <p className="text-[10px] text-slate-500">Ambil data terbaru dari Google Sheets dan kemaskini laptop ini.</p>
              <Button onClick={onForcePull} variant="secondary" className="w-full">Muat Turun Sekarang</Button>
           </div>
           <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                 <UploadCloud className="w-6 h-6 text-red-500" />
                 <h4 className="font-bold text-white uppercase text-xs">Tolak Data Ke Cloud</h4>
              </div>
              <p className="text-[10px] text-slate-500">Hantar data laptop ini untuk menggantikan data di Google Sheets.</p>
              <Button onClick={handleForcePush} disabled={isSaving} className="w-full">
                {isSaving ? <RefreshCw className="animate-spin w-4 h-4" /> : <UploadCloud className="w-4 h-4" />}
                Muat Naik Sekarang
              </Button>
           </div>
        </div>
      </FormCard>

      <FormCard title="API Configuration">
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Link className="w-3 h-3 text-red-600" /> Google Apps Script Web App URL
            </label>
            <input 
              className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-red-500 text-sm font-mono focus:border-red-600 outline-none transition-all"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
            />
          </div>
          <Button onClick={handleSaveSettings} className="w-full h-12">Simpan URL API</Button>
        </div>
      </FormCard>

      <FormCard title="Profil Rasmi Unit">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Sekolah" value={schoolName} onChange={(e: any) => setSchoolName(e.target.value)} />
          <Input label="Unit" value={clubName} onChange={(e: any) => setClubName(e.target.value)} />
          <div className="md:col-span-2">
            <Input label="Alamat" value={address} onChange={(e: any) => setAddress(e.target.value)} />
          </div>
          <Button onClick={handleSaveSettings} className="md:col-span-2 h-14">Kemaskini Profil</Button>
        </div>
      </FormCard>
    </div>
  );
};

export default Settings;