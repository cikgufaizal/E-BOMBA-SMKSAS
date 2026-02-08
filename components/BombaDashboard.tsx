import React from 'react';
import { LogOut, ShieldCheck } from 'lucide-react';
import { SystemData, ReportType } from '../types';
import PendaftaranIndex from './pendaftaran/PendaftaranIndex';
import Dashboard from './Dashboard';

interface Props {
  data: SystemData;
  onLogout: () => void;
  onPrint: (id: string | undefined, type: ReportType) => void;
  updateData: (newData: Partial<SystemData>) => void; // Perlu untuk update No Keahlian jika Bomba nak isi
}

const BombaDashboard: React.FC<Props> = ({ data, onLogout, onPrint, updateData }) => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans flex flex-col">
      {/* HEADER BOMBA */}
      <header className="h-24 bg-slate-900/50 border-b border-white/[0.05] backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-50">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)]">
               <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
               <h1 className="text-xl font-black text-white italic tracking-tighter uppercase">PORTAL BOMBA</h1>
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Modul Semakan Dokumen</p>
            </div>
         </div>
         
         <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">ID Log Masuk</p>
               <p className="text-xs font-black text-red-500 uppercase">JBPM (Pegawai Balai)</p>
            </div>
            <div className="h-8 w-px bg-slate-700"></div>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-all text-[10px] font-black uppercase tracking-widest"
            >
               <LogOut className="w-4 h-4" /> Keluar
            </button>
         </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
         <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
            
            {/* WELCOME BANNER */}
            <div className="bg-gradient-to-r from-red-900/20 to-slate-900 border border-red-500/20 rounded-[2rem] p-8 flex items-center justify-between">
               <div>
                  <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Selamat Datang, Tuan.</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wide leading-relaxed max-w-2xl">
                     Sistem ini memaparkan data pendaftaran dari Unit Kadet Bomba sekolah. Tuan boleh menyemak senarai nama dan mencetak dokumen berkaitan untuk simpanan balai.
                  </p>
               </div>
            </div>

            {/* DASHBOARD STATS */}
            <Dashboard data={data} />

            {/* MODUL DOKUMEN (READ ONLY) */}
            <div className="bg-slate-900/30 border border-white/[0.05] rounded-[2.5rem] p-8">
               <PendaftaranIndex 
                 data={data} 
                 updateData={updateData} 
                 onPrint={onPrint} 
                 isReadOnly={true} // PROPS BARU: MOD READ ONLY
               />
            </div>

         </div>
      </main>
      
      {/* FOOTER */}
      <footer className="py-6 text-center border-t border-white/[0.05]">
         <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em]">
            E-Bomba OS • Sistem Pengurusan Kadet • Versi Bomba 1.0
         </p>
      </footer>
    </div>
  );
};

export default BombaDashboard;