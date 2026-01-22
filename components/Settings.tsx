import React, { useState } from 'react';
import { Cloud, Copy, CheckCircle2, RefreshCw, Activity, HelpCircle, Lock, ShieldCheck, Share2, Image as ImageIcon } from 'lucide-react';
import { SystemData } from '../types';
import { FormCard, Input, Button } from './CommonUI';
import { testCloudConnection } from '../utils/storage';

interface Props {
  data: SystemData;
  updateData: (newData: Partial<SystemData>) => void;
}

const Settings: React.FC<Props> = ({ data, updateData }) => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [url, setUrl] = useState(data.settings?.sheetUrl || '');
  const [logoUrl, setLogoUrl] = useState(data.settings?.logoUrl || '');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [testing, setTesting] = useState(false);

  const CORRECT_PASSWORD = 'CEB1003';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthorized(true);
    } else {
      alert("Kata laluan salah! Akses dinafikan.");
      setPassword('');
    }
  };

  const googleScriptCode = `
/**
 * SISTEM PENGURUSAN KADET BOMBA - CLOUD BRIDGE v3.0
 */
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('DB_BACKUP');
  var data = sheet ? sheet.getRange(1, 1).getValue() : "{}";
  return ContentService.createTextOutput(data).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Simpan Backup Raw Data
    var backupSheet = ss.getSheetByName('DB_BACKUP') || ss.insertSheet('DB_BACKUP');
    backupSheet.clear();
    backupSheet.getRange(1, 1).setValue(JSON.stringify(data));
    
    // Kemaskini Tab Ahli
    updateSheet(ss, 'DATA_AHLI', ['ID', 'Nama', 'No KP', 'Tingkatan', 'Kelas', 'Jantina', 'Kaum'], (data.students || []).map(s => [
      s.id, s.nama, s.noKP, s.tingkatan, s.kelas, s.jantina, s.kaum
    ]));
    
    return ContentService.createTextOutput("SUCCESS").setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("ERROR: " + err.message).setMimeType(ContentService.MimeType.TEXT);
  }
}

function updateSheet(ss, sheetName, headers, rows) {
  var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#f3f4f6');
  if (rows && rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
  sheet.setFrozenRows(1);
}
  `.trim();

  const handleSaveConfig = async () => {
    if (url && !url.startsWith('https://script.google.com')) {
      alert("Pautan Google Web App tidak sah.");
      return;
    }
    
    setTesting(true);
    const success = url ? await testCloudConnection(url) : true;
    setTesting(false);
    
    updateData({ 
      settings: { 
        ...data.settings,
        sheetUrl: url, 
        logoUrl: logoUrl,
        autoSync: !!url,
        lastSync: new Date().toISOString() 
      } 
    });
    alert("Konfigurasi disimpan secara kekal.");
  };

  const copyMasterLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const configKey = btoa(JSON.stringify({ url, logoUrl }));
    const masterLink = `${baseUrl}?config=${configKey}`;
    navigator.clipboard.writeText(masterLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    alert("Pautan Master disalin! Ia mengandungi tetapan Cloud & Logo.");
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center animate-in fade-in zoom-in duration-500">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl text-center space-y-8">
          <div className="inline-flex p-5 bg-red-600/10 rounded-full border border-red-600/20">
            <Lock className="w-10 h-10 text-red-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Akses Terkunci</h2>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Sila masukkan kata laluan pentadbir</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Kata Laluan..."
              className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-center text-white focus:ring-2 focus:ring-red-600 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <Button type="submit" className="w-full h-14">
              <ShieldCheck className="w-5 h-5" /> Buka Kunci
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800">
         <div className="flex items-center gap-6">
            <div className="p-4 bg-red-600 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.3)]">
               <Cloud className="w-8 h-8 text-white" />
            </div>
            <div>
               <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Tetapan Enterprise</h2>
               <p className="text-emerald-500 text-sm font-bold uppercase tracking-widest mt-1">Status: Pentadbir Diizinkan</p>
            </div>
         </div>
         <Button variant="secondary" onClick={() => setIsAuthorized(false)}>
            <Lock className="w-4 h-4" /> Kunci Semula
         </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <FormCard title="1. Identiti Sekolah">
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-20 h-20 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden">
                  {logoUrl ? <img src={logoUrl} alt="Preview" className="w-full h-full object-contain" /> : <ImageIcon className="w-8 h-8 text-slate-700" />}
               </div>
               <div>
                  <h4 className="text-sm font-bold text-white uppercase">Pratonton Logo</h4>
                  <p className="text-xs text-slate-500">Logo akan muncul di sidebar & laporan.</p>
               </div>
            </div>
            <Input 
              label="Pautan Logo Sekolah (URL)" 
              placeholder="https://link-ke-gambar-logo.png" 
              value={logoUrl}
              onChange={(e: any) => setLogoUrl(e.target.value)}
            />
            <Button onClick={handleSaveConfig} variant="success" className="w-full">
               Simpan Logo Sahaja
            </Button>
          </div>
        </FormCard>

        <div className="space-y-8">
          <FormCard title="2. Diagnosis & Cloud">
            <div className="space-y-6">
               <Input 
                 label="Pautan Web App (Deployment URL)" 
                 placeholder="https://script.google.com/macros/s/.../exec" 
                 value={url}
                 onChange={(e: any) => setUrl(e.target.value)}
               />
               <Button onClick={handleSaveConfig} disabled={testing} className="w-full py-4">
                 {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                 Uji & Simpan Semua Tetapan
               </Button>
               
               {data.settings?.sheetUrl && (
                 <div className="pt-4 border-t border-slate-800">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-3">Pautan Master (Cloud + Logo)</p>
                    <Button onClick={copyMasterLink} variant="secondary" className="w-full border-dashed border-slate-600">
                       <Share2 className="w-4 h-4" /> {copiedLink ? 'Disalin!' : 'Salin Pautan Master'}
                    </Button>
                 </div>
               )}
            </div>
          </FormCard>
        </div>

        <FormCard title="3. Kod Skrip Google">
          <div className="space-y-6">
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 relative group">
               <pre className="text-[10px] text-emerald-500 font-mono overflow-x-auto h-64 leading-relaxed">
                 {googleScriptCode}
               </pre>
               <Button 
                onClick={() => {
                  navigator.clipboard.writeText(googleScriptCode);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }} 
                variant="secondary" 
                className="absolute top-4 right-4 py-2 px-3"
              >
                 {copiedCode ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
               </Button>
            </div>
          </div>
        </FormCard>

        <div className="bg-rose-950/20 border border-rose-900/30 p-6 rounded-[1.5rem] space-y-4 h-fit">
            <div className="flex items-center gap-3 text-rose-500">
               <HelpCircle className="w-5 h-5" />
               <h3 className="font-black text-xs uppercase tracking-widest">Peringatan Penting</h3>
            </div>
            <ul className="space-y-3 text-[11px] text-slate-400 font-medium">
               <li className="flex gap-3">
                  <span className="text-rose-500 font-bold">●</span>
                  <span>Gunakan pautan gambar logo yang berakhir dengan .png atau .jpg</span>
               </li>
               <li className="flex gap-3">
                  <span className="text-rose-500 font-bold">●</span>
                  <span>Set <b>"Who has access"</b> kepada <b>"Anyone"</b> dalam Google Script.</span>
               </li>
               <li className="flex gap-3">
                  <span className="text-rose-500 font-bold">●</span>
                  <span>Simpan <b>Pautan Master</b> untuk buka di peranti lain bersama logo sekolah.</span>
               </li>
            </ul>
        </div>
      </div>
    </div>
  );
};

export default Settings;