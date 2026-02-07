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
  LayoutDashboard,
  CloudCheck
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
      { name: 'Lelaki', value: male, color: '#3b82f6' }, 
      { name: 'Perempuan', value: female, color: '#ec4899' }, 
    ];
  };

  const getRaceData = () => {
    return Object.values(Kaum).map(race => ({
      name: race, 
      count: data.students.filter(s => s.kaum === race).length
    })).filter(r => r.count > 0);
  };

  const RACE_COLORS = ['#ef4444', '#f59e0b', '#10b981', '#6366f1', '#8b5cf6'];

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-white/5 p-10 md:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-red-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" />
              v11.1 CLOUD NATIVE
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-600/10 border border-emerald-600/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              Live Sheets Connection
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic mb-6 leading-tight">
            SELAMAT DATANG KE <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
               E-KADET BOMBA SMKSAS
            </span>
          </h1>
          
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl text-justify md:text-left">
            Sistem pengurusan unit beruniform yang dihubungkan terus ke Google Sheets. 
            Semua data adalah <span className="text-white font-bold">Masa Nyata (Real-time)</span>. 
            Pastikan anda mempunyai sambungan internet yang stabil untuk kelancaran sinkronisasi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/[0.05] rounded-[2rem] p-8 relative overflow-hidden group hover:border-red-500/30 transition-all shadow-xl">
           <div className="relative z-10">
              <div className="w-12 h-12 bg-red-600/20 rounded-2xl flex items-center justify-center mb-6 text-red-500">
                 <Users className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Jumlah Keahlian</p>
              <h3 className="text-5xl font-black text-white tracking-tighter">{totalStudents}</h3>
           </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/[0.05] rounded-[2rem] p-8 relative overflow-hidden group hover:border-amber-500/30 transition-all shadow-xl">
           <div className="relative z-10">
              <div className="w-12 h-12 bg-amber-600/20 rounded-2xl flex items-center justify-center mb-6 text-amber-500">
                 <Award className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Jawatankuasa</p>
              <h3 className="text-5xl font-black text-white tracking-tighter">{totalAJK}</h3>
           </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/[0.05] rounded-[2rem] p-6 shadow-xl flex flex-col justify-between">
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
           </div>
           <div className="flex justify-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                 <span className="text-[9px] font-bold text-slate-400 uppercase">Lelaki</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                 <span className="text-[9px] font-bold text-slate-400 uppercase">Perempuan</span>
              </div>
           </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/[0.05] rounded-[2rem] p-6 shadow-xl flex flex-col">
           <div className="flex-1 h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={getRaceData()} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={70} tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }} axisLine={false} tickLine={false} />
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