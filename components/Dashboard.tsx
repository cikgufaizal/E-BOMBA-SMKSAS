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
  Pie,
} from 'recharts';
import { 
  Users, 
  Award, 
  TrendingUp,
  Activity,
  Zap,
  Target,
  ChevronRight
} from 'lucide-react';
import { SystemData, Jantina, Kaum } from '../types';

interface DashboardProps {
  data: SystemData;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const totalStudents = data.students.length;
  const totalAJK = data.committees.length;
  const totalActivities = data.activities.length;

  const getGenderData = () => {
    const male = data.students.filter(s => String(s.jantina).toUpperCase() === Jantina.Lelaki).length;
    const female = data.students.filter(s => String(s.jantina).toUpperCase() === Jantina.Perempuan).length;
    return [
      { name: 'Lelaki', value: male, color: '#3b82f6' }, 
      { name: 'Perempuan', value: female, color: '#f43f5e' }, 
    ];
  };

  const getRaceData = () => {
    return Object.values(Kaum).map(race => ({
      name: race, 
      count: data.students.filter(s => s.kaum === race).length
    })).filter(r => r.count > 0);
  };

  const RACE_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#8b5cf6', '#06b6d4'];

  return (
    <div className="space-y-8 pb-12">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0f172a]/40 backdrop-blur-2xl border border-white/5 p-8 md:p-12 shadow-2xl group animate-enter transform transition-all hover:border-white/10">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 bg-red-600/20 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 text-[9px] font-black uppercase tracking-[0.3em] animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <Zap className="w-3 h-3" /> Live Command Active
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-white/5 text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-slate-800 transition-colors">
              <Target className="w-3 h-3" /> SMK Sultan Ahmad Shah
            </div>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter italic mb-6 leading-none drop-shadow-2xl">
            CENTRAL<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 drop-shadow-[0_0_35px_rgba(239,68,68,0.6)] animate-gradient-x">
               INTELLIGENCE
            </span>
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <p className="text-slate-400 text-sm leading-relaxed max-w-2xl font-medium border-l-2 border-red-600/30 pl-4">
               Sistem pengurusan taktikal Kadet Bomba yang dihubungkan secara terus ke Cloud. 
               Semua log data diproses dalam <span className="text-white font-bold">Masa Nyata (Real-time)</span> untuk ketepatan operasi maksimum.
            </p>
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Jumlah Keahlian', val: totalStudents, icon: Users, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', shadow: 'shadow-red-900/20' },
          { label: 'Unit Jawatankuasa', val: totalAJK, icon: Award, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', shadow: 'shadow-orange-900/20' },
          { label: 'Log Operasi', val: totalActivities, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', shadow: 'shadow-emerald-900/20' },
          { label: 'Kadar Keaktifan', val: '98%', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', shadow: 'shadow-blue-900/20' }
        ].map((s, i) => (
          <div 
            key={i} 
            className={`glass-panel rounded-[2rem] p-8 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500 cursor-default animate-enter hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] border border-transparent hover:${s.border}`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className={`w-14 h-14 ${s.bg} rounded-2xl flex items-center justify-center mb-6 ${s.color} transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg ${s.shadow}`}>
              <s.icon className="w-7 h-7" />
            </div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 group-hover:text-slate-300 transition-colors">{s.label}</p>
            <h3 className="text-5xl font-black text-white tracking-tighter tabular-nums drop-shadow-md">{s.val}</h3>
            
            {/* Hover Shine Effect */}
            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:animate-[shine_1s_ease-in-out]"></div>
            
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 duration-300">
               <ChevronRight className={`w-6 h-6 ${s.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel rounded-[2.5rem] p-10 animate-enter stagger-2 border border-white/[0.05] hover:border-white/[0.1] transition-all duration-500 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[80px] rounded-full"></div>
          
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest italic flex items-center gap-2">
                 <div className="w-1.5 h-4 bg-red-600 rounded-full shadow-[0_0_10px_#ef4444]"></div> Komposisi Kaum
              </h3>
              <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 pl-3.5">Analisis Data Semasa</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_#ef4444]"></div>
          </div>
          <div className="h-[280px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getRaceData()} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} dy={10} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', color: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" radius={[8, 8, 8, 8]} barSize={50} animationDuration={1500} animationEasing="ease-out">
                  {getRaceData().map((entry, index) => (
                    <Cell 
                        key={`cell-${index}`} 
                        fill={RACE_COLORS[index % RACE_COLORS.length]} 
                        fillOpacity={0.9} 
                        className="transition-all duration-300 hover:opacity-100 hover:brightness-110 cursor-pointer stroke-2 stroke-transparent hover:stroke-white/20"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel rounded-[2.5rem] p-10 flex flex-col justify-between animate-enter stagger-3 border border-white/[0.05] hover:border-white/[0.1] transition-all duration-500 shadow-2xl relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-900/10 to-transparent"></div>
          
          <div className="text-center relative z-10">
            <h3 className="text-xs font-black text-white uppercase tracking-widest italic mb-2">Demografi Jantina</h3>
            <div className="w-8 h-1 bg-red-600 mx-auto rounded-full shadow-[0_0_10px_#ef4444]"></div>
          </div>
          <div className="h-[220px] relative z-10 my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getGenderData()}
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={6}
                  animationDuration={1500}
                  animationEasing="ease-out"
                >
                  {getGenderData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity stroke-2 stroke-transparent hover:stroke-white/20" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col animate-in zoom-in duration-700">
                <span className="text-4xl font-black text-white drop-shadow-lg">{totalStudents}</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Total</span>
            </div>
          </div>
          <div className="space-y-4 pt-6 border-t border-white/5 relative z-10">
            {getGenderData().map((g, i) => (
              <div key={i} className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full transition-transform group-hover:scale-150 shadow-[0_0_8px_currentColor]" style={{ backgroundColor: g.color, color: g.color }}></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">{g.name}</span>
                </div>
                <span className="text-xs font-black text-white bg-white/5 px-3 py-1 rounded-lg border border-white/5 group-hover:border-white/20 transition-all">{g.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;