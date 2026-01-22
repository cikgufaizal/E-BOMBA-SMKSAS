
import React, { useState } from 'react';
// Added missing 'Database' icon to the lucide-react imports
import { CheckCircle2, RefreshCw, Lock, Shield, Link, AlertTriangle, Copy, ExternalLink, School, MapPin, Type, Database } from 'lucide-react';
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
  const [address, setAddress] = useState(data.settings?.address || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showGSCode, setShowGSCode] = useState(false);

  const CORRECT_PASSWORD = 'CEB1003';

  const GS_CODE = `/**
 * SISTEM PENGURUSAN KADET BOMBA PROFESSIONAL - CLOUD BRIDGE v7.0
 * -----------------------------------------------------------------------------
 */
const DB_SHEET = "RAW_DATABASE";
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(DB_SHEET);
    if (!sheet) return createJsonResponse({ status: "EMPTY" });
    var data = sheet.getRange(1, 1).getValue();
    if (!data) return createJsonResponse({ status: "EMPTY" });
    return ContentService.createTextOutput(data).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return createJsonResponse({ status: "ERROR", message: err.toString() });
  }
}
function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) return ContentService.createTextOutput("NO_DATA");
    var contents = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var dbSheet = ss.getSheetByName(DB_SHEET) || ss.insertSheet(DB_SHEET);
    dbSheet.clear().getRange(1, 1).setValue(e.postData.contents);
    if (contents.students) updateSheet(ss, 'AHLI', ['NAMA', 'NO KP', 'TING.', 'KELAS', 'JANTINA', 'KAUM'], contents.students.map(s => [s.nama, s.noKP, s.tingkatan, s.kelas, s.jantina, s.kaum]));
    if (contents.teachers) updateSheet(ss, 'GURU', ['NAMA', 'JAWATAN', 'TEL'], contents.teachers.map(t => [t.nama, t.jawatan, t.telefon]));
    return ContentService.createTextOutput("SUCCESS");
  } catch (err) {
    return ContentService.createTextOutput("ERROR: " + err.toString());
  }
}
function updateSheet(ss, name, headers, rows) {
  var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setBackground('#b91c1c').setFontColor('white').setFontWeight('bold');
  if (rows.length > 0) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows).setBorder(true, true, true, true, true, true);
  sheet.autoResizeColumns(1, headers.length);
}
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}`;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) setIsAuthorized(true);
    else { alert("Kata laluan salah!"); setPassword(''); }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(GS_CODE);
    alert("Kod Google Apps Script telah disalin! Sila tampal di Google Sheets anda.");
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    const updatedSettings = { 
      ...data.settings,
      sheetUrl,
      schoolName,
      clubName,
      address,
      lastSync: new Date().toISOString(),
      autoSync: true
    };
    
    updateData({ settings: updatedSettings });
    const success = await saveData({ ...data, settings: updatedSettings });
    setIsSaving(false);
    alert(success || !sheetUrl ? "Tetapan berjaya disimpan!" : "Gagal menyambung ke Cloud. Sila semak URL API.");
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl text-center">
          <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-600/20">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase italic mb-2">Panel Admin</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8">Sahkan Identiti Untuk Akses Tetapan</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="MASUKKAN KATA LALUAN" 
              className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-center text-white font-bold tracking-[0.3em] focus:border-red-600 outline-none transition-all" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              autoFocus 
            />
            <Button type="submit" className="w-full h-14 uppercase tracking-widest font-black">Buka Pintu Akses</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-red-600 rounded-2xl shadow-lg shadow-red-900/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Kawalan Utama Sistem</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Konfigurasi Cloud & Maklumat Rasmi</p>
          </div>
        </div>
        <Button variant="secondary" onClick={() => setIsAuthorized(false)} className="px-8">Keluar Admin</Button>
      </div>

      {/* KOTAK KHAS API URL */}
      <FormCard title="Penyambungan Database Cloud (Google Sheets)">
        <div className="space-y-6">
          <div className="p-6 bg-red-950/10 border border-red-900/20 rounded-2xl flex gap-4">
            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
            <div className="space-y-2">
              <p className="text-sm text-slate-200 font-bold uppercase tracking-tight">PENTING: Hubungkan ke Google Sheets</p>
              <p className="text-xs text-slate-400 leading-relaxed italic">
                Sila masukkan URL Web App (berakhir dengan /exec) yang anda dapat daripada "Deploy" kod Apps Script di Google Sheets. Ini membolehkan data cikgu disimpan secara selamat di awan.
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-1">
              <Link className="w-3 h-3 text-red-600" /> Web App URL (API Cloud)
            </label>
            <div className="relative group">
              <input 
                className="w-full px-6 py-5 bg-slate-950 border border-slate-800 rounded-2xl text-red-500 text-sm font-mono focus:border-red-600 outline-none transition-all pr-12 shadow-inner"
                placeholder="https://script.google.com/macros/s/XXXXX/exec"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
              />
              <div className="absolute right-4 top-5 opacity-20 group-hover:opacity-100 transition-opacity">
                <Database className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-4">
             <Button onClick={copyToClipboard} variant="secondary" className="flex-1 h-14 border-slate-800">
               <Copy className="w-4 h-4" /> Salin Kod code.gs
             </Button>
             <Button 
               onClick={() => window.open('https://script.google.com/home', '_blank')} 
               variant="secondary" 
               className="flex-1 h-14 border-slate-800"
             >
               <ExternalLink className="w-4 h-4" /> Buka Google Apps Script
             </Button>
          </div>
        </div>
      </FormCard>

      <FormCard title="Profil Rasmi Unit Kadet Bomba">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Nama Sekolah" 
            icon={<School className="w-4 h-4" />}
            value={schoolName} 
            onChange={(e: any) => setSchoolName(e.target.value)} 
          />
          <Input 
            label="Nama Unit / Persatuan" 
            icon={<Type className="w-4 h-4" />}
            value={clubName} 
            onChange={(e: any) => setClubName(e.target.value)} 
          />
          <div className="md:col-span-2">
            <Input 
              label="Alamat Sekolah / Surat-Menyurat" 
              icon={<MapPin className="w-4 h-4" />}
              value={address} 
              onChange={(e: any) => setAddress(e.target.value)} 
            />
          </div>
          <div className="md:col-span-2 pt-6">
            <Button onClick={handleSaveAll} disabled={isSaving} className="w-full h-16 shadow-2xl shadow-red-900/40">
              {isSaving ? <RefreshCw className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
              <span className="text-base font-black uppercase tracking-[0.1em]">Kemaskini & Sahkan Semua Tetapan</span>
            </Button>
          </div>
        </div>
      </FormCard>
    </div>
  );
};

export default Settings;
