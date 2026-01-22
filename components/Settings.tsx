import React, { useState } from 'react';
import { CheckCircle2, RefreshCw, Lock, ShieldCheck, School, Shield, Database, Link, AlertTriangle } from 'lucide-react';
import { SystemData } from '../types';
import { FormCard, Input, Button } from './CommonUI';
import { saveData } from '../utils/storage';

interface Props {
  data: SystemData;
  updateData: (newData: Partial<SystemData>) => void;
}

const Settings: React.FC<Props> = ({ data, updateData }) => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [sheetUrl, setSheetUrl] = useState(data.settings?.sheetUrl || '');
  const [schoolName, setSchoolName] = useState(data.settings?.schoolName || '');
  const [clubName, setClubName] = useState(data.settings?.clubName || '');
  const [isSaving, setIsSaving] = useState(false);

  const CORRECT_PASSWORD = 'CEB1003';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) setIsAuthorized(true);
    else { alert("Kata laluan salah!"); setPassword(''); }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    const updatedSettings = { 
      ...data.settings,
      sheetUrl,
      schoolName,
      clubName,
      lastSync: new Date().toISOString() 
    };
    
    updateData({ settings: updatedSettings });
    const success = await saveData({ ...data, settings: updatedSettings });
    setIsSaving(false);
    if (success || !sheetUrl) alert("Tetapan berjaya disimpan!");
    else alert("Gagal menyambung ke Cloud. Sila semak URL API.");
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl text-center">
          <Lock className="w-12 h-12 text-red-600 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-white uppercase italic mb-8">Admin Panel</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="KATA LALUAN" className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-center text-white" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
            <Button type="submit" className="w-full h-14">Masuk Panel</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Shield className="w-8 h-8 text-red-600" />
          <h2 className="text-2xl font-black text-white uppercase italic">Konfigurasi Sistem</h2>
        </div>
        <Button variant="secondary" onClick={() => setIsAuthorized(false)}>Keluar</Button>
      </div>

      <FormCard title="Penyambungan Database Cloud (API)">
        <div className="space-y-6">
          <div className="p-4 bg-amber-950/20 border border-amber-900/30 rounded-2xl flex gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
            <p className="text-[11px] text-amber-200/70 italic">
              Masukkan URL Web App (berakhir dengan /exec) yang anda dapat daripada Google Apps Script untuk membolehkan data disimpan secara automatik ke Google Sheets.
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Link className="w-3 h-3" /> Web App URL (Google Apps Script)
            </label>
            <input 
              className="w-full px-4 py-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm font-mono focus:border-red-600 outline-none"
              placeholder="https://script.google.com/macros/s/XXXXX/exec"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
            />
          </div>
        </div>
      </FormCard>

      <FormCard title="Maklumat Rasmi Unit">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Nama Sekolah" value={schoolName} onChange={(e: any) => setSchoolName(e.target.value)} />
          <Input label="Nama Unit/Kelab" value={clubName} onChange={(e: any) => setClubName(e.target.value)} />
          <div className="md:col-span-2 pt-4">
            <Button onClick={handleSaveAll} disabled={isSaving} className="w-full h-14">
              {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              SIMPAN & SINKRONIKASI
            </Button>
          </div>
        </div>
      </FormCard>
    </div>
  );
};

export default Settings;