import React, { useState } from 'react';
import { Shield, Flame, Lock, ChevronRight, GraduationCap } from 'lucide-react';
import { UserRole } from '../types';

interface Props {
  onLogin: (role: UserRole) => void;
}

const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<'SCHOOL' | 'BOMBA' | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedRole === 'SCHOOL') {
      if (password === 'CEB1003') {
        onLogin('ADMIN');
      } else if (password === 'GURU') {
        onLogin('GURU');
      } else {
        setError('KOD AKSES TIDAK SAH');
      }
    } else if (selectedRole === 'BOMBA') {
      if (password === 'JBPM') {
        onLogin('BOMBA');
      } else {
        setError('KOD AKSES BALAI TIDAK SAH');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-mono">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 blur-[120px] rounded-full -mr-40 -mt-40 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
           <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter mb-2">
             E-BOMBA <span className="text-red-600">OS</span>
           </h1>
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.5em]">Secure Command Terminal</p>
        </div>

        {!selectedRole ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
            {/* SCHOOL CARD */}
            <button 
              onClick={() => { setSelectedRole('SCHOOL'); setError(''); }}
              className="group relative h-80 bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 rounded-[2.5rem] p-8 flex flex-col items-center justify-center transition-all hover:bg-slate-900 hover:shadow-[0_0_50px_rgba(59,130,246,0.2)]"
            >
               <div className="w-24 h-24 bg-blue-900/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-blue-500/20 group-hover:border-blue-500">
                  <GraduationCap className="w-10 h-10 text-blue-500" />
               </div>
               <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Unit Sekolah</h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center px-8">
                  Akses Guru & Pentadbir<br/>(Kata Laluan: CEB1003 / GURU)
               </p>
               <div className="absolute bottom-8 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                  Log Masuk <ChevronRight className="w-3 h-3" />
               </div>
            </button>

            {/* BOMBA CARD */}
            <button 
              onClick={() => { setSelectedRole('BOMBA'); setError(''); }}
              className="group relative h-80 bg-slate-900/50 border border-slate-800 hover:border-red-500/50 rounded-[2.5rem] p-8 flex flex-col items-center justify-center transition-all hover:bg-slate-900 hover:shadow-[0_0_50px_rgba(239,68,68,0.2)]"
            >
               <div className="w-24 h-24 bg-red-900/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-red-500/20 group-hover:border-red-500">
                  <Flame className="w-10 h-10 text-red-500" />
               </div>
               <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Balai Bomba</h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center px-8">
                  Akses Pegawai (JBPM)<br/>Semakan & Cetakan Dokumen
               </p>
               <div className="absolute bottom-8 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-[10px] font-black text-red-500 uppercase tracking-widest">
                  Log Masuk <ChevronRight className="w-3 h-3" />
               </div>
            </button>
          </div>
        ) : (
          <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
             <div className="bg-slate-900/80 border border-slate-700 p-8 rounded-[2rem] shadow-2xl backdrop-blur-xl">
                <button 
                  onClick={() => { setSelectedRole(null); setPassword(''); }}
                  className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white mb-6 flex items-center gap-2"
                >
                   &larr; Kembali
                </button>
                
                <div className="flex flex-col items-center mb-8">
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${selectedRole === 'SCHOOL' ? 'bg-blue-600/10 text-blue-500' : 'bg-red-600/10 text-red-500'}`}>
                      <Lock className="w-8 h-8" />
                   </div>
                   <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                      {selectedRole === 'SCHOOL' ? 'Akses Unit Sekolah' : 'Akses Balai Bomba'}
                   </h3>
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">KOD KESELAMATAN</label>
                      <input 
                        type="password" 
                        autoFocus
                        className={`w-full bg-slate-950 border ${error ? 'border-red-500 text-red-500' : 'border-slate-700 text-white'} rounded-xl px-6 py-4 text-center font-black tracking-[0.5em] text-lg outline-none focus:border-white transition-all`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••"
                      />
                      {error && <p className="text-[9px] font-bold text-red-500 text-center animate-pulse">{error}</p>}
                   </div>
                   
                   <button 
                     type="submit"
                     className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 ${
                        selectedRole === 'SCHOOL' 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20' 
                        : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20'
                     }`}
                   >
                      Sahkan Akses
                   </button>
                </form>
             </div>
          </div>
        )}

        <div className="absolute bottom-8 left-0 right-0 text-center">
            <p className="text-[9px] text-slate-700 font-bold uppercase tracking-[0.3em]">
               Restricted Access • Authorized Personnel Only
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;