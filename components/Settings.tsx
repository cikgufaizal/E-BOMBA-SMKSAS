
import React, { useState } from 'react';
import { Cloud, Copy, CheckCircle2, RefreshCw, Activity, HelpCircle, Lock, ShieldCheck, Share2, Image as ImageIcon, School, Code2 } from 'lucide-react';
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
  const [schoolName, setSchoolName] = useState(data.settings?.schoolName || 'SMK SULTAN AHMAD SHAH');
  const [clubName, setClubName] = useState(data.settings?.clubName || 'KADET BOMBA');
  const [address, setAddress] = useState(data.settings?.address || 'Jalan Sultan Ahmad Shah, 25200 Kuantan');
  
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [testing, setTesting] = useState(false);

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

  const handleSaveAll = async () => {
    setTesting(true);
    const success = url ? await testCloudConnection(url) : true;
    setTesting(false);
    
    updateData({ 
      settings: { 
        ...data.settings,
        sheetUrl: url, 
        logoUrl: logoUrl,
        schoolName: schoolName,
        clubName: clubName,
        address: address,
        autoSync: !!url,
        lastSync: new Date().toISOString() 
      } 
    });
    alert("Semua tetapan identiti dan cloud telah disimpan.");
  };

  const copyMasterLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const configData = { url, logoUrl, schoolName, clubName, address };
    const configKey = btoa(JSON.stringify(configData));
    const masterLink = `${baseUrl}?config=${configKey}`;
    navigator.clipboard.writeText(masterLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    alert("Pautan Master disalin!");
  };

  const copyGASCode = () => {
    const scriptCode = `/**
 * SISTEM PENGURUSAN KADET BOMBA PROFESSIONAL - CLOUD BRIDGE v3.2
 * -----------------------------------------------------------
 */
const SHEET_BACKUP = "DB_BACKUP";

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_BACKUP);
    if (!sheet) return ContentService.createTextOutput(JSON.stringify({error: "No data"})).setMimeType(ContentService.MimeType.JSON);
    var data = sheet.getRange(1, 1).getValue();
    return ContentService.createTextOutput(data).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({error: err.message})).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var backupSheet = ss.getSheetByName(SHEET_BACKUP) || ss.insertSheet(SHEET_BACKUP);
    backupSheet.getRange(1, 1).setValue(JSON.stringify(contents));
    backupSheet.getRange(1, 2).setValue("Last Sync: " + new Date().toLocaleString());

    updateSheet(ss, 'DATA_AHLI', ['ID', 'Nama', 'No KP', 'Tingkatan', 'Kelas', 'Jantina', 'Kaum'], (contents.students || []).map(s => [s.id, s.nama, s.noKP, s.tingkatan, s.kelas, s.jantina, s.kaum]));
    updateSheet(ss, 'DATA_GURU', ['ID', 'Nama', 'Jawatan', 'Telefon'], (contents.teachers || []).map(t => [t.id, t.nama, t.jawatan, t.telefon]));
    updateSheet(ss, 'DATA_AKTIVITI', ['Tarikh', 'Masa', 'Aktiviti', 'Tempat', 'Ulasan'], (contents.activities || []).map(a => [a.tarikh, a.masa, a.nama, a.tempat, a.ulasan]));
    updateSheet(ss, 'RANCANGAN_TAHUNAN', ['Bulan', 'Program', 'Tempat', 'Catatan'], (contents.annualPlans || []).map(p => [p.bulan, p.program, p.tempat, p.catatan]));
    
    var ajkRows = (contents.committees || []).map(c => {
      var student = (contents.students || []).find(s => s.id === c.studentId);
      return [c.jawatan, student ? student.nama : 'N/A', student ? student.tingkatan : '-', student ? student.kelas : '-'];
    });
    updateSheet(ss, 'STRUKTUR_ORGANISASI', ['Jawatan', 'Nama Ahli', 'Tingkatan', 'Kelas'], ajkRows);
    
    var attRows = (contents.attendances || []).map(a => [a.tarikh, a.presents ? a.presents.length : 0, contents.students ? contents.students.length : 0]);
    updateSheet(ss, 'LOG_KEHADIRAN', ['Tarikh', 'Bil Hadir', 'Jumlah Ahli'], attRows);

    return ContentService.createTextOutput("SUCCESS").setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("ERROR: " + err.message).setMimeType(ContentService.MimeType.TEXT);
  }
}

function updateSheet(ss, sheetName, headers, rows) {
  var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#b91c1c').setFontColor('#ffffff');
  if (rows && rows.length > 0) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);
}`;
    navigator.clipboard.writeText(scriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
    alert("Kod v3.2 Disalin! Paste dalam Apps Script Google Sheet anda.");
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
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Masukkan kata laluan untuk konfigurasi</p>
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
               <School className="w-8 h-8 text-white" />
            </div>
            <div>
               <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Konfigurasi Identiti</h2>
               <p className="text-emerald-500 text-sm font-bold uppercase tracking-widest mt-1">Status: Master Admin</p>
            </div>
         </div>
         <Button variant="secondary" onClick={() => setIsAuthorized(false)}>
            <Lock className="w-4 h-4" /> Tutup Panel
         </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <FormCard title="1. Maklumat Rasmi Sekolah">
          <div className="space-y-5">
            <div className="flex items-center gap-4 mb-2">
               <div className="w-16 h-16 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
                  {logoUrl ? <img src={logoUrl} alt="Preview" className="w-full h-full object-contain" /> : <ImageIcon className="w-6 h-6 text-slate-700" />}
               </div>
               <Input 
                  placeholder="Pautan Logo (.png/.jpg)" 
                  value={logoUrl}
                  onChange={(e: any) => setLogoUrl(e.target.value)}
                  className="flex-1"
               />
            </div>
            <Input label="Nama Sekolah (Huruf Besar)" value={schoolName} onChange={(e: any) => setSchoolName(e.target.value)} />
            <Input label="Nama Unit/Kelab" value={clubName} onChange={(e: any) => setClubName(e.target.value)} />
            <Input label="Alamat & Poskod" value={address} onChange={(e: any) => setAddress(e.target.value)} />
          </div>
        </FormCard>

        <div className="space-y-8">
          <FormCard title="2. Pangkalan Data Cloud">
            <div className="space-y-6">
               <Input 
                 label="Google Web App URL" 
                 placeholder="https://script.google.com/macros/s/.../exec" 
                 value={url}
                 onChange={(e: any) => setUrl(e.target.value)}
               />
               <Button onClick={handleSaveAll} disabled={testing} className="w-full py-4">
                 {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                 Simpan Semua Konfigurasi
               </Button>
               
               <div className="pt-4 border-t border-slate-800 space-y-3">
                  <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Toolbox Pentadbir</p>
                  <Button onClick={copyGASCode} variant="secondary" className="w-full border-emerald-900/30 text-emerald-500">
                     <Code2 className="w-4 h-4" /> {copiedScript ? 'Kod Script v3.2 Disalin!' : 'Salin Kod Apps Script v3.2'}
                  </Button>
                  <Button onClick={copyMasterLink} variant="secondary" className="w-full border-dashed border-slate-700">
                     <Share2 className="w-4 h-4" /> {copiedLink ? 'Pautan Master Disalin!' : 'Salin Pautan Master'}
                  </Button>
               </div>
            </div>
          </FormCard>

          <div className="bg-emerald-950/10 border border-emerald-900/20 p-6 rounded-[1.5rem] space-y-3">
            <div className="flex items-center gap-2 text-emerald-500">
               <HelpCircle className="w-4 h-4" />
               <h3 className="font-black text-[10px] uppercase tracking-[0.2em]">Tips Profesional</h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Pastikan anda <b>Redeploy</b> Web App anda di Google Sheets sebagai <b>New Version</b> setiap kali menukar kod di sana.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
