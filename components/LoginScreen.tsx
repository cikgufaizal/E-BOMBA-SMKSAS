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
      {/* Dynamic Background FX */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] animate-[pulse_10s_infinite]"></div>
      
      {/* Animated Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/10 blur-[150px] rounded-full -mr-40 -mt-40 pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -ml-20 -mb-20 pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center mb-16 animate-enter">
           <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-900/50 border border-white/10 mb-6 backdrop-blur-sm shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <Shield className="w-8 h-8 text-red-600 mr-3 animate-pulse" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Official System Access</span>
           </div>
           <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter mb-4 drop-shadow-2xl">
             E-BOMBA <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">OS</span>
           </h1>
           <div className="flex items-center justify-center gap-4 opacity-70">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-slate-500"></div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.5em]">Secure Command Terminal</p>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-slate-500"></div>
           </div>
        </div>

        {!selectedRole ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-10 duration-700 stagger-1">
            {/* SCHOOL CARD */}
            <button 
              onClick={() => { setSelectedRole('SCHOOL'); setError(''); }}
              className="group relative h-80 bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 rounded-[2.5rem] p-8 flex flex-col items-center justify-center transition-all hover:bg-slate-900 hover:shadow-[0_0_50px_rgba(59,130,246,0.3)] hover:-translate-y-2 overflow-hidden"
            >
               <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               
               <div className="w-24 h-24 bg-blue-900/20 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-blue-500/20 group-hover:border-blue-500 shadow-lg shadow-blue-900/20 group-hover:shadow-blue-500/30">
                  <GraduationCap className="w-10 h-10 text-blue-500" />
               </div>
               
               <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2 relative z-10">Unit Sekolah</h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center px-8 relative z-10 group-hover:text-blue-200 transition-colors">
                  Akses Guru & Pentadbir<br/>(Kata Laluan: CEB1003 / GURU)
               </p>
               
               <div className="absolute bottom-8 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
                  Log Masuk <ChevronRight className="w-3 h-3" />
               </div>
            </button>

            {/* BOMBA CARD */}
            <button 
              onClick={() => { setSelectedRole('BOMBA'); setError(''); }}
              className="group relative h-80 bg-slate-900/40 border border-slate-800 hover:border-red-500/50 rounded-[2.5rem] p-8 flex flex-col items-center justify-center transition-all hover:bg-slate-900 hover:shadow-[0_0_50px_rgba(239,68,68,0.3)] hover:-translate-y-2 overflow-hidden"
            >
               <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

               <div className="w-24 h-24 bg-red-900/20 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-red-500/20 group-hover:border-red-500 shadow-lg shadow-red-900/20 group-hover:shadow-red-500/30">
                  <Flame className="w-10 h-10 text-red-500" />
               </div>
               
               <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2 relative z-10">Balai Bomba</h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center px-8 relative z-10 group-hover:text-red-200 transition-colors">
                  Akses Pegawai (JBPM)<br/>Semakan & Cetakan Dokumen
               </p>
               
               <div className="absolute bottom-8 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 flex items-center gap-2 text-[10px] font-black text-red-400 uppercase tracking-widest bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">
                  Log Masuk <ChevronRight className="w-3 h-3" />
               </div>
            </button>
          </div>
        ) : (
          <div className="max-w-md mx-auto animate-in zoom-in-95 duration-500">
             <div className="bg-slate-900/60 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-2xl relative overflow-hidden">
                {/* Glow Effect inside card */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${selectedRole === 'SCHOOL' ? 'from-blue-500 to-cyan-500' : 'from-red-500 to-orange-500'}`}></div>

                <button 
                  onClick={() => { setSelectedRole(null); setPassword(''); }}
                  className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white mb-8 flex items-center gap-2 transition-colors"
                >
                   &larr; Pilihan Unit
                </button>
                
                <div className="flex flex-col items-center mb-8">
                   <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_currentColor] animate-pulse-slow ${selectedRole === 'SCHOOL' ? 'bg-blue-600/20 text-blue-500 shadow-blue-500/20' : 'bg-red-600/20 text-red-500 shadow-red-500/20'}`}>
                      <Lock className="w-8 h-8" />
                   </div>
                   <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                      {selectedRole === 'SCHOOL' ? 'Akses Unit Sekolah' : 'Akses Balai Bomba'}
                   </h3>
                   <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Sila masukkan kod keselamatan</p>
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
                   <div className="space-y-2">
                      <input 
                        type="password" 
                        autoFocus
                        className={`w-full bg-slate-950/80 border-2 ${error ? 'border-red-500 text-red-500 animate-shake' : 'border-slate-800 text-white focus:border-white/50'} rounded-2xl px-6 py-5 text-center font-black tracking-[0.5em] text-xl outline-none transition-all placeholder:text-slate-800`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••"
                      />
                      {error && <p className="text-[9px] font-bold text-red-500 text-center animate-pulse bg-red-950/30 py-2 rounded-lg border border-red-500/20">{error}</p>}
                   </div>
                   
                   <button 
                     type="submit"
                     className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 btn-shine shadow-xl ${
                        selectedRole === 'SCHOOL' 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30' 
                        : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/30'
                     }`}
                   >
                      Sahkan Akses
                   </button>
                </form>
             </div>
          </div>
        )}

        <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em] opacity-50">
               Restricted Access • Authorized Personnel Only
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;