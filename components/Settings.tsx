import React, { useState } from 'react';
import { CheckCircle2, RefreshCw, Lock, ShieldCheck, School, Shield, Edit3, Image as ImageIcon, MapPin, Hash } from 'lucide-react';
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
  const [logoUrl, setLogoUrl] = useState(data.settings?.logoUrl || '');
  const [schoolName, setSchoolName] = useState(data.settings?.schoolName || 'SMK SULTAN AHMAD SHAH');
  const [clubName, setClubName] = useState(data.settings?.clubName || 'KADET BOMBA');
  const [address, setAddress] = useState(data.settings?.address || 'Jalan Sultan Ahmad Shah, 25200 Kuantan');
  const [isSaving, setIsSaving] = useState(false);

  const CORRECT_PASSWORD = 'CEB1003';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthorized(true);
    } else {
      alert("Kata laluan salah!");
      setPassword('');
    }
  };

  const handleSaveBranding = async () => {
    setIsSaving(true);
    const updatedSettings = { 
      ...data.settings,
      logoUrl: logoUrl,
      schoolName: schoolName,
      clubName: clubName,
      address: address,
      lastSync: new Date().toISOString() 
    };
    
    updateData({ settings: updatedSettings });
    await saveData({ ...data, settings: updatedSettings });
    setIsSaving(false);
    alert("Identiti unit telah dikemaskini dan diselaraskan ke database cloud.");
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center animate-in fade-in zoom-in duration-500">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl text-center space-y-8">
          <div className="inline-flex p-5 bg-red-600/10 rounded-full border border-red-600/20">
            <Lock className="w-10 h-10 text-red-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Admin Panel</h2>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Akses Konfigurasi Identiti</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-center text-white focus:ring-2 focus:ring-red-600 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <Button type="submit" className="w-full h-14">
              <ShieldCheck className="w-5 h-5" /> Masuk Panel
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800">
         <div className="flex items-center gap-6">
            <div className="p-4 bg-red-600 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.3)]">
               <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
               <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Identiti & Branding</h2>
               <p className="text-emerald-500 text-sm font-bold uppercase tracking-widest mt-1">Akses Database: Aktif (Cloud)</p>
            </div>
         </div>
         <Button variant="secondary" onClick={() => setIsAuthorized(false)}>
            <Lock className="w-4 h-4" /> Keluar
         </Button>
      </div>

      <div className="grid grid-cols-1 gap-10">
        <FormCard title="Tetapan Visual & Maklumat Rasmi">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-red-500 mb-2">
                  <School className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest">Maklumat Sekolah</span>
                </div>
                <Input label="Nama Institusi" value={schoolName} onChange={(e: any) => setSchoolName(e.target.value)} />
                <Input label="Nama Unit / Kelab" value={clubName} onChange={(e: any) => setClubName(e.target.value)} />
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-red-500 mb-2">
                  <ImageIcon className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest">Media & Logo</span>
                </div>
                <Input label="URL Logo (Direct Link)" placeholder="https://..." value={logoUrl} onChange={(e: any) => setLogoUrl(e.target.value)} />
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center min-h-[100px]">
                   {logoUrl ? (
                     <img src={logoUrl} alt="Preview" className="h-16 object-contain" onError={() => alert("Pautan logo tidak sah!")} />
                   ) : (
                     <p className="text-[10px] text-slate-600 font-bold uppercase">Tiada Logo Ditetapkan</p>
                   )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 text-red-500 mb-2">
                <MapPin className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Alamat Rasmi</span>
              </div>
              <textarea 
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 focus:ring-2 focus:ring-red-600 transition-all outline-none h-24 text-sm"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Masukkan alamat sekolah..."
              />
            </div>

            <Button onClick={handleSaveBranding} disabled={isSaving} className="w-full h-14">
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Kemaskini Semua Identiti
            </Button>
          </div>
        </FormCard>

        <div className="bg-red-950/10 p-6 rounded-3xl border border-red-900/20 flex gap-4 items-start">
           <Edit3 className="w-6 h-6 text-red-500 shrink-0" />
           <div>
              <h4 className="text-white font-black text-xs uppercase tracking-widest mb-1">Nota Penting</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed italic">
                Perubahan pada bahagian ini akan dikemaskini secara automatik pada semua komputer yang mengakses pautan Vercel ini. Database Cloud dilaraskan secara pusat.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;