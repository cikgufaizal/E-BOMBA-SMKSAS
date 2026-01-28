
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  Users, 
  Award, 
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';
import { SystemData, Jantina, Kaum } from '../types';

interface DashboardProps {
  data: SystemData;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const totalStudents = data.students.length;
  const totalAJK = data.committees.length;

  // Data Analisa Jantina
  const getGenderData = () => {
    const male = data.students.filter(s => String(s.jantina).toUpperCase() === Jantina.Lelaki).length;
    const female = data.students.filter(s => String(s.jantina).toUpperCase() === Jantina.Perempuan).length;
    return [
      { name: 'Lelaki', value: male, color: '#3b82f6' }, // Blue
      { name: 'Perempuan', value: female, color: '#ec4899' }, // Pink
    ];
  };

  // Data Analisa Kaum
  const getRaceData = () => {
    return Object.values(Kaum).map(race => ({
      name: race, 
      count: data.students.filter(s => s.kaum === race).length
    })).filter(r => r.count > 0); // Hanya tunjuk kaum yang ada ahli
  };

  // Warna untuk Carta Kaum
  const RACE_COLORS = ['#ef4444', '#f59e0b', '#10b981', '#6366f1', '#8b5cf6'];

  return (
    <div className="space-y-8 animate-slide-up">
      
      {/* 1. PENGENALAN SISTEM (HERO SECTION) */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-white/5 p-10 md:p-14 shadow-2xl">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-red-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 text-[10px] font-black uppercase tracking-widest mb-8">
            <ShieldCheck className="w-3 h-3" />
            Sistem Pengurusan Digital v10.0
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic mb-6 leading-tight">
            SELAMAT DATANG KE <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
               E-KADET BOMBA & PENYELAMAT
            </span>
          </h1>
          
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl text-justify md:text-left">
            Sistem ini dibangunkan khas untuk memudahkan pengurusan unit beruniform di sekolah. 
            Melalui papan pemuka ini, anda boleh memantau pendaftaran keahlian, struktur organisasi, 
            rekod kehadiran, dan laporan aktiviti secara berpusat dan sistematik.
          </p>

          <div className="mt-8 flex gap-4">
             <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-white/5">
                <LayoutDashboard className="w-4 h-4 text-slate-500" />
                <span className="text-[10px] font-bold text-slate-300 uppercase">Dashboard Pentadbir</span>
             </div>
          </div>
        </div>
      </div>

      {/* 2. EMPAT KAD ANALISA (GRID) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* KAD 1: JUMLAH AHLI */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/[0.05] rounded-[2rem] p-8 relative overflow-hidden group hover:border-red-500/30 transition-all shadow-xl">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Users className="w-24 h-24 text-red-500" />
           </div>
           <div className="relative z-10">
              <div className="w-12 h-12 bg-red-600/20 rounded-2xl flex items-center justify-center mb-6 text-red-500">
                 <Users className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Jumlah Keahlian</p>
              <h3 className="text-5xl font-black text-white tracking-tighter">{totalStudents}</h3>
              <p className="text-[10px] font-bold text-slate-600 mt-2 uppercase">Orang Pelajar Berdaftar</p>
           </div>
        </div>

        {/* KAD 2: JUMLAH AJK */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/[0.05] rounded-[2rem] p-8 relative overflow-hidden group hover:border-amber-500/30 transition-all shadow-xl">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Award className="w-24 h-24 text-amber-500" />
           </div>
           <div className="relative z-10">
              <div className="w-12 h-12 bg-amber-600/20 rounded-2xl flex items-center justify-center mb-6 text-amber-500">
                 <Award className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Jawatankuasa</p>
              <h3 className="text-5xl font-black text-white tracking-tighter">{totalAJK}</h3>
              <p className="text-[10px] font-bold text-slate-600 mt-2 uppercase">Orang AJK Dilantik</p>
           </div>
        </div>

        {/* KAD 3: ANALISA JANTINA */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/[0.05] rounded-[2rem] p-6 shadow-xl flex flex-col justify-between">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Analisa Jantina</h3>
           </div>
           <div className="h-[140px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={getGenderData()}
                       innerRadius={40}
                       outerRadius={60}
                       paddingAngle={5}
                       dataKey="value"
                       stroke="none"
                    >
                       {getGenderData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '10px' }}
                       itemStyle={{ color: '#fff' }}
                    />
                 </PieChart>
              </ResponsiveContainer>
              {/* Legend Kecil */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="text-center">
                    <span className="text-xs font-black text-slate-300">{totalStudents > 0 ? '100%' : '0%'}</span>
                 </div>
              </div>
           </div>
           <div className="flex justify-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                 <span className="text-[9px] font-bold text-slate-400 uppercase">Lelaki ({getGenderData()[0].value})</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                 <span className="text-[9px] font-bold text-slate-400 uppercase">Perempuan ({getGenderData()[1].value})</span>
              </div>
           </div>
        </div>

        {/* KAD 4: ANALISA KAUM */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/[0.05] rounded-[2rem] p-6 shadow-xl flex flex-col">
           <div className="mb-4">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Analisa Kaum</h3>
           </div>
           <div className="flex-1 h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={getRaceData()} layout="vertical" margin={{ left: 0, right: 30, top: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis 
                       dataKey="name" 
                       type="category" 
                       width={70} 
                       tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }} 
                       axisLine={false}
                       tickLine={false}
                    />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '10px', color: '#fff' }} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                       {getRaceData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={RACE_COLORS[index % RACE_COLORS.length]} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
