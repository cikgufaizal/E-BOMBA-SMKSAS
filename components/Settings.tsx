import React, { useState } from 'react';
import { CheckCircle2, RefreshCw, Lock, Shield, Link, AlertTriangle, Copy, ExternalLink, School, MapPin, Type, Database, Check, XCircle } from 'lucide-react';
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
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'none' | 'success' | 'fail'>('none');

  const CORRECT_PASSWORD = 'CEB1003';

  const GS_CODE = `/**
 * SISTEM PENGURUSAN KADET BOMBA PROFESSIONAL - CLOUD BRIDGE v7.5
 */
const DB_SHEET = "RAW_DATABASE";
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(DB_SHEET);
    if (!sheet) return createJsonResponse({ status: "EMPTY" });
    var data = sheet.getRange(1, 1).getValue();
    return ContentService.createTextOutput(data).setMimeType(ContentService.MimeType.JSON);
  } catch (err) { return createJsonResponse({ status: "ERROR" }); }
}
function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    if (contents.test) return ContentService.createTextOutput("CONNECTED");
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var dbSheet = ss.getSheetByName(DB_SHEET) || ss.insertSheet(DB_SHEET);
    dbSheet.clear().getRange(1, 1).setValue(e.postData.contents);
    return ContentService.createTextOutput("SUCCESS");
  } catch (err) { return ContentService.createTextOutput("ERROR"); }
}
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}`;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) setIsAuthorized(true);
    else { alert("Kata laluan salah!"); setPassword(''); }
  };

  const handleTestConnection = async () => {
    if (!sheetUrl) return alert("Sila masukkan URL API terlebih dahulu.");
    setIsTesting(true);
    setTestResult('none');
    
    try {
      const response = await fetch(sheetUrl, {
        method: 'POST',
        mode: 'no-cors', // Kerana Apps Script redirection
        body: JSON.stringify({ test: true })
      });
      // Kerana mode no-cors tak bagi baca response body, kita anggap success jika tiada exception
      setTestResult('success');
      alert("Isyarat dihantar! Jika kod GS anda betul, data akan mula masuk.");
    } catch (err) {
      setTestResult('fail');
      alert("Sambungan Gagal. Sila semak URL API anda.");
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    const updatedSettings = { 
      ...data.settings,
      sheetUrl,
      schoolName,
      clubName,
      address,
      autoSync: true
    };
    
    updateData({ settings: updatedSettings });
    const success = await saveData({ ...data, settings: updatedSettings });
    setIsSaving(false);
    alert("Semua tetapan telah disimpan secara lokal.");
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl text-center">
          <Lock className="w-12 h-12 text-red-600 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-white uppercase italic mb-8">Admin Panel</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="MASUKKAN KATA LALUAN" className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-center text-white" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
            <Button type="submit" className="w-full h-14 uppercase tracking-widest font-black">Masuk Pintu Utama</Button>
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
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Kawalan Admin Cloud</h2>
        </div>
        <Button variant="secondary" onClick={() => setIsAuthorized(false)}>Keluar Admin</Button>
      </div>

      <FormCard title="Konfigurasi Google Apps Script (Cloud Storage)">
        <div className="space-y-6">
          <div className="p-6 bg-red-950/10 border border-red-900/20 rounded-2xl flex gap-4">
            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
            <p className="text-xs text-slate-400 italic">
              Tampal URL Web App (berakhir dengan /exec) untuk membolehkan sistem menyelaraskan data ke Google Sheets secara automatik.
            </p>
          </div>
          
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Link className="w-3 h-3 text-red-600" /> Web App URL (API Cloud)
            </label>
            <div className="flex gap-2">
              <input 
                className="flex-1 px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-red-500 text-sm font-mono focus:border-red-600 outline-none transition-all"
                placeholder="https://script.google.com/macros/s/XXXXX/exec"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
              />
              <Button onClick={handleTestConnection} variant="secondary" className={`h-14 px-6 ${testResult === 'success' ? 'border-emerald-500 text-emerald-500' : ''}`}>
                {isTesting ? <RefreshCw className="animate-spin w-4 h-4" /> : testResult === 'success' ? <Check className="w-4 h-4" /> : <Database className="w-4 h-4" />}
                {isTesting ? 'Uji...' : 'Uji API'}
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
             <Button onClick={() => { navigator.clipboard.writeText(GS_CODE); alert("Kod disalin!"); }} variant="secondary" className="flex-1 h-12">
               <Copy className="w-4 h-4" /> Salin Kod GS
             </Button>
             <Button onClick={handleSaveAll} disabled={isSaving} className="flex-1 h-12">
               {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
               Simpan URL Cloud
             </Button>
          </div>
        </div>
      </FormCard>

      <FormCard title="Profil Rasmi Sekolah & Unit">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Nama Sekolah" icon={<School className="w-4 h-4" />} value={schoolName} onChange={(e: any) => setSchoolName(e.target.value)} />
          <Input label="Nama Unit / Persatuan" icon={<Type className="w-4 h-4" />} value={clubName} onChange={(e: any) => setClubName(e.target.value)} />
          <div className="md:col-span-2">
            <Input label="Alamat Surat-Menyurat" icon={<MapPin className="w-4 h-4" />} value={address} onChange={(e: any) => setAddress(e.target.value)} />
          </div>
          <div className="md:col-span-2 pt-6">
            <Button onClick={handleSaveAll} className="w-full h-16 shadow-2xl shadow-red-900/40">
              KEMASKINI SEMUA MAKLUMAT
            </Button>
          </div>
        </div>
      </FormCard>
    </div>
  );
};

export default Settings;