
import React, { useState } from 'react';
import { Cloud, Save, Copy, CheckCircle2, AlertCircle, ExternalLink, RefreshCw, Terminal, BookOpen, ShieldCheck, HelpCircle, Activity } from 'lucide-react';
import { SystemData } from '../types';
import { FormCard, Input, Button } from './CommonUI';
import { testCloudConnection } from '../utils/storage';

interface Props {
  data: SystemData;
  updateData: (newData: Partial<SystemData>) => void;
}

const Settings: React.FC<Props> = ({ data, updateData }) => {
  const [url, setUrl] = useState(data.settings?.sheetUrl || '');
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);

  const googleScriptCode = `
/**
 * SISTEM PENGURUSAN KADET BOMBA - CLOUD BRIDGE v2.0
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Simpan Backup Raw Data
    var backupSheet = ss.getSheetByName('DB_BACKUP') || ss.insertSheet('DB_BACKUP');
    backupSheet.clear();
    backupSheet.getRange(1, 1).setValue(JSON.stringify(data));
    
    // 2. Kemaskini Tab Ahli
    updateSheet(ss, 'DATA_AHLI', ['ID', 'Nama', 'No KP', 'Tingkatan', 'Kelas', 'Jantina', 'Kaum'], (data.students || []).map(s => [
      s.id, s.nama, s.noKP, s.tingkatan, s.kelas, s.jantina, s.kaum
    ]));
    
    // 3. Kemaskini Tab Guru
    updateSheet(ss, 'DATA_GURU', ['ID', 'Nama', 'Jawatan', 'Telefon'], (data.teachers || []).map(t => [
      t.id, t.nama, t.jawatan, t.telefon
    ]));

    // 4. Kemaskini Tab Aktiviti
    updateSheet(ss, 'DATA_AKTIVITI', ['Tarikh', 'Masa', 'Aktiviti', 'Tempat', 'Ulasan'], (data.activities || []).map(a => [
      a.tarikh, a.masa, a.nama, a.tempat, a.ulasan
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

  const handleTest = async () => {
    if (!url) return;
    setTesting(true);
    const success = await testCloudConnection(url);
    setTesting(false);
    if (success) {
      alert("Tahniah! Sambungan ke Google Cloud berjaya.");
      handleSave();
    } else {
      alert("Sambungan gagal. Pastikan URL betul dan 'Who has access' ditetapkan kepada 'Anyone'.");
    }
  };

  const handleSave = () => {
    if (!url.startsWith('https://script.google.com')) {
      alert("Sila masukkan URL Google Web App yang sah (bermula dengan script.google.com).");
      return;
    }
    updateData({ 
      settings: { 
        ...data.settings, 
        sheetUrl: url, 
        autoSync: true,
        lastSync: new Date().toISOString() 
      } 
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(googleScriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800">
         <div className="flex items-center gap-6">
            <div className="p-4 bg-red-600 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.3)]">
               <Cloud className="w-8 h-8 text-white" />
            </div>
            <div>
               <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Enterprise Cloud Bridge</h2>
               <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Status: {data.settings?.sheetUrl ? 'Sistem Aktif' : 'Mod Luar Talian'}</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <FormCard title="1. Kod Skrip Google">
          <div className="space-y-6">
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 relative group">
               <pre className="text-[11px] text-emerald-500 font-mono overflow-x-auto h-64 leading-relaxed">
                 {googleScriptCode}
               </pre>
               <Button onClick={copyToClipboard} variant="secondary" className="absolute top-4 right-4 py-2 px-3">
                 {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
               </Button>
            </div>
          </div>
        </FormCard>

        <div className="space-y-8">
          <FormCard title="2. Diagnosis & Pautan">
            <div className="space-y-6">
               <Input 
                 label="Pautan Web App (Deployment URL)" 
                 placeholder="https://script.google.com/macros/s/.../exec" 
                 value={url}
                 onChange={(e: any) => setUrl(e.target.value)}
               />
               <div className="flex gap-4">
                  <Button onClick={handleTest} disabled={testing} className="flex-1">
                    {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                    Uji Sambungan
                  </Button>
                  <Button onClick={handleSave} variant="secondary" className="flex-1">
                    <Save className="w-4 h-4" /> Simpan Sahaja
                  </Button>
               </div>
            </div>
          </FormCard>

          <div className="bg-rose-950/20 border border-rose-900/30 p-6 rounded-[1.5rem] space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
               <HelpCircle className="w-5 h-5" />
               <h3 className="font-black text-xs uppercase tracking-widest">Kenapa Deploy Gagal?</h3>
            </div>
            <ul className="space-y-3 text-[11px] text-slate-400 font-medium">
               <li className="flex gap-3">
                  <span className="text-rose-500 font-bold">●</span>
                  <span>Mesti set <b>"Who has access"</b> kepada <b>"Anyone"</b>. Jika set "Only myself", sistem ini tidak boleh hantar data.</span>
               </li>
               <li className="flex gap-3">
                  <span className="text-rose-500 font-bold">●</span>
                  <span>Mesti klik <b>"Advanced"</b> -> <b>"Go to [Project] (unsafe)"</b> semasa pertama kali deploy untuk beri izin.</span>
               </li>
               <li className="flex gap-3">
                  <span className="text-rose-500 font-bold">●</span>
                  <span>Pastikan URL berakhir dengan <b>/exec</b>. Jika berakhir dengan /edit, itu adalah URL editor, bukan pautan sistem.</span>
               </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
