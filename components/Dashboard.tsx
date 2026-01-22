
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LabelList,
  LineChart,
  Line
} from 'recharts';
import { 
  Users, 
  GraduationCap, 
  Award, 
  Activity,
  Zap,
  ArrowUpRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { SystemData, Jantina, Kaum } from '../types';

interface DashboardProps {
  data: SystemData;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const totalStudents = data.students.length;
  const totalTeachers = data.teachers.length;
  const totalActivities = data.activities.length;
  const totalCommittees = data.committees.length;

  const getGenderData = () => {
    const male = data.students.filter(s => String(s.jantina).toUpperCase() === Jantina.Lelaki).length;
    const female = data.students.filter(s => String(s.jantina).toUpperCase() === Jantina.Perempuan).length;
    return [
      { name: 'LELAKI', count: male },
      { name: 'PEREMPUAN', count: female },
    ];
  };

  const getRaceData = () => {
    return Object.values(Kaum).map(race => ({
      name: race, 
      count: data.students.filter(s => s.kaum === race).length
    }));
  };

  const getFormData = () => {
    return ['1', '2', '3', '4', '5'].map(form => ({
      name: `TING. ${form}`, 
      count: data.students.filter(s => s.tingkatan === form).length
    }));
  };

  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#6366f1', '#a855f7', '#ec4899'];

  const StatCard = ({ title, value, icon: Icon }: any) => (
    <div className="relative group overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-white/[0.05] rounded-[2.5rem] p-10 transition-all duration-500 hover:border-red-500/30 hover:-translate-y-2 shadow-2xl">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
            <Icon className="w-6 h-6 text-red-600 group-hover:text-white" />
          </div>
          <ArrowUpRight className="w-5 h-5 text-slate-700 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0" />
        </div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">{title}</p>
        <h3 className="text-5xl font-extrabold text-white tracking-tighter leading-none">{value}</h3>
      </div>
      <div className="absolute -right-8 -bottom-8 opacity-[0.02] group-hover:opacity-[0.08] transition-all duration-700">
        <Icon className="w-48 h-48 rotate-12" />
      </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-red-500 mb-2">
            <Zap className="w-4 h-4 fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Command Center Analytics</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white tracking-tighter italic">UNIT PERFORMANCE <span className="text-slate-700 not-italic">OVERVIEW</span></h2>
        </div>
        <div className="flex gap-2">
           <div className="px-5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-[10px] font-black uppercase text-slate-500">System Ready</div>
           <div className="px-5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black uppercase text-emerald-500">Secure Link Active</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="GURU PEMBIMBING" value={totalTeachers} icon={GraduationCap} />
        <StatCard title="KEKUATAN ANGGOTA" value={totalStudents} icon={Users} />
        <StatCard title="BARISAN AJK" value={totalCommittees} icon={Award} />
        <StatCard title="OPERASI AKTIVITI" value={totalActivities} icon={Activity} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-slate-900/40 backdrop-blur-xl p-10 rounded-[3rem] border border-white/[0.05] shadow-2xl">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="font-extrabold text-white uppercase text-xs tracking-[0.2em] mb-1">KOMPOSISI JANTINA</h3>
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Visual data split for male/female</p>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/[0.05] flex items-center justify-center text-slate-500 font-mono text-[10px]">01</div>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getGenderData()} layout="vertical" margin={{ left: 20, right: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ffffff05" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#475569" fontSize={9} fontWeight="900" width={100} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#020617', border: '1px solid #ffffff10', borderRadius: '16px', fontSize: '10px' }} />
                  <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={45}>
                    {getGenderData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : '#fb923c'} />
                    ))}
                    <LabelList dataKey="count" position="right" fill="#ffffff" style={{ fontSize: '14px', fontWeight: '900' }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-slate-900/40 backdrop-blur-xl p-10 rounded-[3rem] border border-white/[0.05] shadow-2xl">
              <h3 className="font-extrabold text-white uppercase text-xs tracking-[0.2em] mb-8">TABURAN ETNIK</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getRaceData()}>
                    <XAxis dataKey="name" fontSize={8} fontWeight="900" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={25}>
                      {getRaceData().map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      <LabelList dataKey="count" position="top" fill="#64748b" style={{ fontSize: '10px', fontWeight: 'bold' }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl p-10 rounded-[3rem] border border-white/[0.05] shadow-2xl">
              <h3 className="font-extrabold text-white uppercase text-xs tracking-[0.2em] mb-8">TINGKATAN</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getFormData()}>
                    <XAxis dataKey="name" fontSize={9} fontWeight="900" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                    <Bar dataKey="count" fill="#ef4444" radius={[8, 8, 0, 0]} barSize={30}>
                       <LabelList dataKey="count" position="top" fill="#64748b" style={{ fontSize: '10px', fontWeight: 'bold' }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-red-600 to-red-900 p-8 rounded-[3rem] shadow-2xl text-white">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Health Metric</span>
            </div>
            <p className="text-xs font-bold opacity-70 uppercase mb-1">Avg. Attendance Rate</p>
            <h4 className="text-4xl font-black italic tracking-tighter mb-4">
              {data.attendances.length > 0 
                ? Math.round((data.attendances.reduce((acc, curr) => acc + (curr.presents.length / data.students.length), 0) / data.attendances.length) * 100)
                : 0}%
            </h4>
            <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
               <div className="bg-white h-full" style={{ width: '75%' }}></div>
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl p-10 rounded-[3rem] border border-white/[0.05] shadow-2xl flex-1">
            <h3 className="font-extrabold text-white uppercase text-xs tracking-[0.2em] mb-8 flex items-center gap-3">
              <Clock className="w-4 h-4 text-red-500" /> RECENT LOGS
            </h3>
            <div className="space-y-6">
              {data.activities.slice(-4).reverse().map((act) => (
                <div key={act.id} className="border-l-2 border-red-600/30 pl-4 py-1 group hover:border-red-600 transition-colors">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{act.tarikh}</p>
                  <p className="text-[11px] font-black text-white uppercase group-hover:text-red-500 transition-colors">{act.nama}</p>
                </div>
              ))}
              {data.activities.length === 0 && <p className="text-[10px] text-slate-600 font-bold uppercase italic">Tiada log aktiviti dikesan</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
