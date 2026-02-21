import React, { useState, useEffect } from 'react';
import { Shield, Lock, Power, Zap, ScanLine, Activity } from 'lucide-react';
import { UserRole, SystemData } from '../types';

interface Props {
  onLogin: (role: UserRole) => void;
  data?: SystemData;
}

const LoginScreen: React.FC<Props> = ({ onLogin, data }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [bootSequence, setBootSequence] = useState<string[]>([]);

  // Simulation of boot text
  useEffect(() => {
    const lines = [
      "SYSTEM_INIT...", 
      "LOADING_KERNEL_V4.2...", 
      "ESTABLISHING_SECURE_LINK...",
      "READY_FOR_AUTH"
    ];
    let delay = 0;
    lines.forEach((line, index) => {
      setTimeout(() => {
        setBootSequence(prev => [...prev, line]);
      }, delay);
      delay += 300;
    });
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    // Artificial Delay for effect
    setTimeout(() => {
      const code = password.trim(); // Case sensitive for custom passwords? Or keep it simple. Let's trim.
      
      // Default Passwords
      const defaultAdmin = 'CEB1003';
      const defaultGuru = 'GURU';
      const defaultBomba = 'JBPM';

      // Get from settings or fallback
      const adminPwd = data?.settings?.adminPassword || defaultAdmin;
      const guruPwd = data?.settings?.guruPassword || defaultGuru;
      const bombaPwd = data?.settings?.bombaPassword || defaultBomba;

      if (code === adminPwd) {
        onLogin('ADMIN');
      } else if (code === guruPwd) {
        onLogin('GURU');
      } else if (code === bombaPwd) {
        onLogin('BOMBA');
      } else {
        // Also check default hardcoded if settings fail (safety net)
        if (code === defaultAdmin) onLogin('ADMIN');
        else if (code === defaultGuru) onLogin('GURU');
        else if (code === defaultBomba) onLogin('BOMBA');
        else {
            setError('ACCESS DENIED: INVALID CREDENTIALS');
            setIsVerifying(false);
            setPassword('');
        }
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-mono selection:bg-red-500/30 selection:text-white">
      {/* Dynamic Background FX */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] animate-[pulse_10s_infinite]"></div>
      
      {/* Rotating Cyber Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-red-900/20 rounded-full animate-[spin_60s_linear_infinite] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-dashed border-red-500/10 rounded-full animate-[spin_40s_linear_infinite_reverse] pointer-events-none"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md animate-enter">
        {/* Header HUD */}
        <div className="flex justify-between items-end mb-4 opacity-70">
           <div className="text-[9px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-3 h-3 animate-pulse" /> E-BOMBA SECURE NET
           </div>
           <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
              V 2.0.1
           </div>
        </div>

        {/* Card */}
        <div className="bg-[#0f172a]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-10 shadow-2xl relative overflow-hidden group">
          
          <div className="text-center mb-10 relative">
             <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-900 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.4)] relative border border-white/10">
                <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-3xl animate-spin-slow"></div>
                <Shield className="w-10 h-10 text-white animate-pulse" />
             </div>
             <h1 className="text-4xl font-black text-white italic tracking-tighter mb-2 glitch-text cursor-default">
               E-BOMBA <span className="text-red-500">OS</span>
             </h1>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em]">Central Command Login</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6 relative z-10">
             <div className="space-y-2 group">
                <div className="relative">
                   <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                      {isVerifying ? (
                        <ScanLine className="w-5 h-5 text-red-500 animate-spin" />
                      ) : (
                        <Lock className="w-5 h-5 text-slate-500 group-focus-within:text-red-500 transition-colors" />
                      )}
                   </div>
                   <input 
                      type="text" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="ENTER ACCESS CODE"
                      disabled={isVerifying}
                      autoFocus
                      className={`w-full bg-slate-950/80 border-2 ${error ? 'border-red-500 animate-shake' : 'border-slate-800 focus:border-red-600'} rounded-2xl py-4 pl-14 pr-6 text-white font-black tracking-[0.2em] outline-none transition-all placeholder:text-slate-700 uppercase`}
                   />
                   {/* Corner Accents */}
                   <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 rounded-tl-lg"></div>
                   <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 rounded-br-lg"></div>
                </div>
                
                {/* Boot Text */}
                <div className="h-6 overflow-hidden">
                   {error ? (
                     <p className="text-[10px] font-bold text-red-500 text-center bg-red-950/30 rounded py-1 border border-red-500/20">{error}</p>
                   ) : (
                     <p className="text-[9px] font-mono text-slate-600 text-center uppercase tracking-widest animate-pulse">
                        {isVerifying ? "VERIFYING ENCRYPTION KEYS..." : bootSequence[bootSequence.length - 1]}
                     </p>
                   )}
                </div>
             </div>
             
             <button 
               type="submit"
               disabled={isVerifying || !password}
               className="w-full py-4 bg-red-600 hover:bg-red-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all relative overflow-hidden btn-shine shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_40px_rgba(239,68,68,0.6)] active:scale-95 flex items-center justify-center gap-3"
             >
                {isVerifying ? 'AUTHENTICATING...' : <><Power className="w-4 h-4" /> INITIALIZE SYSTEM</>}
             </button>
          </form>

          {/* Footer Decor */}
          <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center opacity-50">
             <div className="flex gap-1">
                <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
             </div>
             <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                Authorized Personnel Only
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;