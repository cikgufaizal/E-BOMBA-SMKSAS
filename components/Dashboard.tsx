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
  AreaChart,
  Area
} from 'recharts';
import { 
  Users, 
  Award, 
  ShieldCheck,
  TrendingUp,
  Activity,
  Zap,
  Target
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
    <div className="space-y-8">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0f172a]/40 backdrop-blur-2xl border border-white/5 p-12 shadow-2xl group">
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full transition-transform duration-1000 group-hover:scale-125"></div>
        
        <div className="relative z-10">
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 text-[9px] font-black uppercase tracking-[0.3em]">
              <Zap className="w-3 h-3 animate-pulse" /> Live Command Active
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-white/5 text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">
              <Target className="w-3 h-3" /> SMK Sultan Ahmad Shah
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic mb-6 leading-none">
            CENTRAL<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]">
               INTELLIGENCE
            </span>
          </h1>
          
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl font-medium">
            Sistem pengurusan taktikal Kadet Bomba yang dihubungkan secara terus ke Cloud. 
            Semua log data diproses dalam <span className="text-white font-bold">Masa Nyata (Real-time)</span> untuk ketepatan operasi.
          </p>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Jumlah Keahlian', val: totalStudents, icon: Users, color: 'text-red-500', bg: 'bg-red-500/10' },
          { label: 'Unit Jawatankuasa', val: totalAJK, icon: Award, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Log Operasi', val: totalActivities, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Trend Keaktifan', val: '94%', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' }
        ].map((s, i) => (
          <div key={i} className="glass-panel rounded-[2rem] p-8 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
            <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center mb-6 ${s.color} transition-transform duration-500 group-hover:rotate-12`}>
              <s.icon className="w-6 h-6" />
            </div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">{s.label}</p>
            <h3 className="text-5xl font-black text-white tracking-tighter">{s.val}</h3>
            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/[0.02] rounded-full"></div>
          </div>
        ))}
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel rounded-[2.5rem] p-10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest italic">Komposisi Kaum Anggota</h3>
              <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Data Taktikal Terkini</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getRaceData()} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                />
                <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={40}>
                  {getRaceData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={RACE_COLORS[index % RACE_COLORS.length]} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel rounded-[2.5rem] p-10 flex flex-col justify-between">
          <div className="text-center">
            <h3 className="text-xs font-black text-white uppercase tracking-widest italic mb-2">Demografi Jantina</h3>
            <div className="w-8 h-1 bg-red-600 mx-auto rounded-full"></div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getGenderData()}
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {getGenderData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 pt-4 border-t border-white/5">
            {getGenderData().map((g, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: g.color }}></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{g.name}</span>
                </div>
                <span className="text-xs font-black text-white">{g.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;