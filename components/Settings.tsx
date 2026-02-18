import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, RefreshCw, Lock, Shield, Search, UploadCloud, DownloadCloud, FileDown, FileUp, Image as ImageIcon, AlertTriangle, Loader2, Eraser, Trash, Unlock } from 'lucide-react';
import { SystemData, UserRole } from '../types';
import { FormCard, Input, Button } from './CommonUI';
import { saveDataToCloud, fetchDataFromCloud } from '../utils/storage';
import { CLOUD_API_URL } from '../constants';
import { compressImage } from '../utils/imageUtils';

interface Props {
  data: SystemData;
  updateData: (newData: Partial<SystemData>) => void;
  onForcePull: () => void;
  userRole?: UserRole; // Tambah prop userRole
}

const Settings: React.FC<Props> = ({ data, updateData, onForcePull, userRole }) => {
  const [password, setPassword] = useState('');
  // Jika UserRole adalah ADMIN (CEB1003), auto-authorize. Jika tidak, perlu password.
  const [isAuthorized, setIsAuthorized] = useState(userRole === 'ADMIN');
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [schoolName, setSchoolName] = useState(data.settings?.schoolName || '');
  const [address, setAddress] = useState(data.settings?.address || '');
  const [logoUrl, setLogoUrl] = useState(data.settings?.logoUrl || '');
  const [bombaLogoUrl, setBombaLogoUrl] = useState(data.settings?.bombaLogoUrl || '');

  const schoolLogoInputRef = useRef<HTMLInputElement>(null);
  const bombaLogoInputRef = useRef<HTMLInputElement>(null);

  const dataSize = JSON.stringify(data).length;
  const isOverLimit = dataSize > 500000;

  // Auto-authorize effect untuk memastikan jika user masuk sebagai ADMIN, mereka terus dapat akses
  useEffect(() => {
    if (userRole === 'ADMIN') {
      setIsAuthorized(true);
    }
  }, [userRole]);

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

  const handleSystemCleanup = () => {
    if (!confirm("AMARAN: Proses ini akan membuang rekod 'sampah' (Ghost Data). Teruskan?")) return;
    setIsProcessing(true);
    
    const validStudentIds = new Set(data.students.map(s => s.id));
    let cleanedAttendancesCount = 0;
    const cleanAttendances = data.attendances.map(att => {
      const originalCount = att.presents.length;
      const filteredPresents = att.presents.filter(id => validStudentIds.has(id));
      if (originalCount !== filteredPresents.length) cleanedAttendancesCount += (originalCount - filteredPresents.length);
      return { ...att, presents: filteredPresents };
    });

    const originalCommitteeCount = data.committees.length;
    const cleanCommittees = data.committees.filter(c => validStudentIds.has(c.studentId));
    const cleanedCommitteeCount = originalCommitteeCount - cleanCommittees.length;

    updateData({
      attendances: cleanAttendances,
      committees: cleanCommittees
    });

    setIsProcessing(false);
    alert(`PENYELENGGARAAN SELESAI:\n\n- ${cleanedAttendancesCount} rekod kehadiran hantu dibuang.\n- ${cleanedCommitteeCount} jawatan AJK tidak sah dibuang.`);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 animate-in zoom-in-95">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl text-center relative overflow-hidden">
          
          <Lock className="w-12 h-12 text-red-600 mx-auto mb-6 animate-pulse" />
          <h2 className="text-2xl font-black text-white uppercase italic mb-2">Restricted Area</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8">Authorisation Code Required</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="ENTER ADMIN KEY" className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-center text-white font-black tracking-[0.3em] outline-none focus:border-red-600 transition-all uppercase" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
            <Button type="submit" className="w-full h-14 shadow-[0_0_20px_rgba(239,68,68,0.3)]">UNLOCK SYSTEM</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 flex justify-between items-center shadow-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg">
             <Shield className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">System Intelligence Core</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase rounded border border-emerald-500/20 flex items-center gap-1">
                 <Unlock className="w-3 h-3" /> ACCESS GRANTED
              </span>
              <p className={`text-[9px] font-black uppercase tracking-widest ${isOverLimit ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>
                | Payload: {dataSize.toLocaleString()} bytes
              </p>
              {isOverLimit && <AlertTriangle className="w-3 h-3 text-red-500" />}
            </div>
          </div>
        </div>
        
        {/* Butang Exit hanya perlu jika user masuk MANUAL (bukan dari login screen), tapi since flow dah unified, kita boleh hide atau jadikan logout */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormCard title="Cloud Synchronization">
           <div className="space-y-4">
              <Button onClick={onForcePull} variant="secondary" className="w-full h-14 border-slate-700">
                <DownloadCloud className="w-4 h-4" /> Pull From Cloud
              </Button>
              <Button onClick={pushToCloud} className="w-full h-14 shadow-lg shadow-red-900/20" disabled={isSaving}>
                {isSaving ? <RefreshCw className="animate-spin w-4 h-4" /> : <UploadCloud className="w-4 h-4" />} Push To Cloud
              </Button>
           </div>
        </FormCard>

        <FormCard title="System Maintenance">
          <div className="space-y-4">
             <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                   <AlertTriangle className="w-4 h-4 text-red-500" />
                   <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest">Zon Bahaya</h4>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                   Gunakan fungsi ini untuk membuang data yang rosak atau tidak lagi relevan (Orphan Data Cleanup).
                </p>
             </div>
             <Button onClick={handleSystemCleanup} className="w-full h-14 bg-red-950/50 hover:bg-red-900 border-red-900 text-red-500 hover:text-white">
                <Eraser className="w-4 h-4" /> Lakukan Pembersihan (Cleanup)
             </Button>
          </div>
        </FormCard>
      </div>

      <FormCard title="Local Data Backup">
          <div className="space-y-4">
            <Button onClick={() => {
              const dataStr = JSON.stringify(data, null, 2);
              const blob = new Blob([dataStr], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `BACKUP_KADET_BOMBA_${new Date().toISOString().split('T')[0]}.json`;
              link.click();
            }} variant="success" className="w-full h-14">
              <FileDown className="w-4 h-4" /> Export Backup JSON
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
            <Button onClick={() => document.getElementById('import-json')?.click()} variant="secondary" className="w-full h-14">
              <FileUp className="w-4 h-4" /> Import Backup JSON
            </Button>
          </div>
        </FormCard>

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
            className="md:col-span-2 h-14 shadow-2xl"
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