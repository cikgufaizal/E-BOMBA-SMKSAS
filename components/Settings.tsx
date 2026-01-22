
import React, { useState } from 'react';
import { CheckCircle2, RefreshCw, Lock, Shield, Link, AlertTriangle, Database, UploadCloud, DownloadCloud, FileDown, FileUp } from 'lucide-react';
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'CEB1003') setIsAuthorized(true);
    else { alert("Akses Ditolak!"); setPassword(''); }
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Nama Sekolah" value={schoolName} onChange={(e: any) => setSchoolName(e.target.value)} />
          <Input label="Nama Unit" value={clubName} onChange={(e: any) => setClubName(e.target.value)} />
          <div className="md:col-span-2">
            <Input label="Alamat Surat-Menyurat" value={address} onChange={(e: any) => setAddress(e.target.value)} />
          </div>
          <Button onClick={() => { updateData({ settings: { ...data.settings, schoolName, clubName, address } as any }); alert("Profil dikemaskini."); }} className="md:col-span-2 h-14">Save Global Profile</Button>
        </div>
      </FormCard>
    </div>
  );
};

export default Settings;
