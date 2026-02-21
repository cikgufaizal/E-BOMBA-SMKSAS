import React, { useState } from 'react';
import { LogOut, ShieldCheck, Menu, X, LayoutDashboard, FileText, Users, User, UserCheck } from 'lucide-react';
import { SystemData, ReportType, Jantina } from '../types';
import PendaftaranIndex from './pendaftaran/PendaftaranIndex';

interface Props {
  data: SystemData;
  onLogout: () => void;
  onPrint: (id: string | undefined, type: ReportType) => void;
  updateData: (newData: Partial<SystemData>) => void;
}

type BombaView = 'dashboard' | 'dokumentasi';

const BombaDashboard: React.FC<Props> = ({ data, onLogout, onPrint, updateData }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<BombaView>('dashboard');

  // Stats Calculation
  const totalAhli = data.students.length;
  const lelaki = data.students.filter(s => s.jantina === Jantina.Lelaki).length;
  const perempuan = data.students.filter(s => s.jantina === Jantina.Perempuan).length;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans flex flex-col">
      {/* HEADER BOMBA */}
      <header className="h-24 bg-slate-900/50 border-b border-white/[0.05] backdrop-blur-xl px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
         <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors md:hidden"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)]">
               <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
               <h1 className="text-xl font-black text-white italic tracking-tighter uppercase hidden md:block">PORTAL BOMBA</h1>
               <h1 className="text-lg font-black text-white italic tracking-tighter uppercase md:hidden">BOMBA</h1>
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] hidden md:block">Modul Semakan Dokumen & Analisis</p>
            </div>
         </div>
         
         <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">ID Log Masuk</p>
               <p className="text-xs font-black text-red-500 uppercase">JBPM (Pegawai Balai)</p>
            </div>
            <div className="h-8 w-px bg-slate-700 hidden md:block"></div>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-all text-[10px] font-black uppercase tracking-widest"
            >
               <LogOut className="w-4 h-4" /> <span className="hidden md:inline">Keluar</span>
            </button>
         </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside 
          className={`
            fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#0f172a] border-r border-white/[0.05] transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0 pt-24 md:pt-0
          `}
        >
          <div className="p-6 space-y-2">
            <button
              onClick={() => { setActiveView('dashboard'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'dashboard' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Dashboard</span>
            </button>
            <button
              onClick={() => { setActiveView('dokumentasi'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'dokumentasi' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Dokumentasi</span>
            </button>
          </div>
          
          {/* Mobile Close Button */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white md:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </aside>

        {/* OVERLAY FOR MOBILE */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* CONTENT */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-[#020617]">
           <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
              
              {activeView === 'dashboard' && (
                <div className="space-y-8">
                  {/* WELCOME BANNER */}
                  <div className="bg-gradient-to-r from-red-900/20 to-slate-900 border border-red-500/20 rounded-[2rem] p-8 flex items-center justify-between">
                     <div>
                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Selamat Datang, Tuan.</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wide leading-relaxed max-w-2xl">
                           Paparan ringkas statistik keanggotaan Kadet Bomba.
                        </p>
                     </div>
                  </div>

                  {/* SIMPLE STATS GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Ahli */}
                    <div className="bg-[#0f172a]/50 border border-white/5 rounded-[2rem] p-8 relative overflow-hidden group hover:border-red-500/30 transition-all">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-24 h-24 text-red-500" />
                      </div>
                      <div className="relative z-10">
                        <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4 text-red-500">
                          <Users className="w-6 h-6" />
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Jumlah Ahli</p>
                        <h3 className="text-5xl font-black text-white tracking-tighter">{totalAhli}</h3>
                      </div>
                    </div>

                    {/* Lelaki */}
                    <div className="bg-[#0f172a]/50 border border-white/5 rounded-[2rem] p-8 relative overflow-hidden group hover:border-blue-500/30 transition-all">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <User className="w-24 h-24 text-blue-500" />
                      </div>
                      <div className="relative z-10">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 text-blue-500">
                          <User className="w-6 h-6" />
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Lelaki</p>
                        <h3 className="text-5xl font-black text-white tracking-tighter">{lelaki}</h3>
                      </div>
                    </div>

                    {/* Perempuan */}
                    <div className="bg-[#0f172a]/50 border border-white/5 rounded-[2rem] p-8 relative overflow-hidden group hover:border-pink-500/30 transition-all">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <UserCheck className="w-24 h-24 text-pink-500" />
                      </div>
                      <div className="relative z-10">
                        <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-4 text-pink-500">
                          <UserCheck className="w-6 h-6" />
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Perempuan</p>
                        <h3 className="text-5xl font-black text-white tracking-tighter">{perempuan}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeView === 'dokumentasi' && (
                <div className="bg-slate-900/30 border border-white/[0.05] rounded-[2.5rem] p-4 md:p-8">
                   <div className="mb-6">
                      <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Dokumentasi & Rekod</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Semakan fail dan cetakan dokumen</p>
                   </div>
                   <PendaftaranIndex 
                     data={data} 
                     updateData={updateData} 
                     onPrint={onPrint} 
                     isReadOnly={true}
                   />
                </div>
              )}

           </div>
        </main>
      </div>
      
      {/* FOOTER */}
      <footer className="py-6 text-center border-t border-white/[0.05] bg-[#020617] relative z-50">
         <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em]">
            E-Bomba OS • Sistem Pengurusan Kadet • Versi Bomba 1.1
         </p>
      </footer>
    </div>
  );
};

export default BombaDashboard;