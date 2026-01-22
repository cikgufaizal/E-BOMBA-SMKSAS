
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
  Legend
} from 'recharts';
import { 
  Users, 
  GraduationCap, 
  Award, 
  CalendarCheck,
  TrendingUp,
  Activity
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
    const male = data.students.filter(s => s.jantina === Jantina.Lelaki).length;
    const female = data.students.filter(s => s.jantina === Jantina.Perempuan).length;
    return [
      { name: 'LELAKI', count: male, percentage: totalStudents ? ((male / totalStudents) * 100).toFixed(1) : 0 },
      { name: 'PEREMPUAN', count: female, percentage: totalStudents ? ((female / totalStudents) * 100).toFixed(1) : 0 },
    ];
  };

  const getRaceData = () => {
    return Object.values(Kaum).map(race => {
      const count = data.students.filter(s => s.kaum === race).length;
      return { 
        name: race, 
        count, 
        percentage: totalStudents ? ((count / totalStudents) * 100).toFixed(1) : 0 
      };
    });
  };

  const getFormData = () => {
    return ['1', '2', '3', '4', '5'].map(form => {
      const count = data.students.filter(s => s.tingkatan === form).length;
      return { 
        name: `T${form}`, 
        count,
        percentage: totalStudents ? ((count / totalStudents) * 100).toFixed(1) : 0
      };
    });
  };

  const COLORS = ['#dc2626', '#b45309', '#0f766e', '#4338ca', '#7e22ce', '#be123c'];

  const StatCard = ({ title, value, icon: Icon, gradient }: any) => (
    <div className={`relative overflow-hidden rounded-3xl p-8 bg-slate-900 border border-slate-800 shadow-2xl transition-all duration-300 hover:border-red-900/50 group`}>
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 group-hover:text-red-500 transition-colors">{title}</p>
          <h3 className="text-4xl font-black text-white tracking-tighter">{value}</h3>
        </div>
        <div className={`p-4 rounded-2xl bg-slate-950 border border-slate-800 group-hover:scale-110 group-hover:border-red-600/30 transition-all duration-500`}>
          <Icon className="w-6 h-6 text-slate-400 group-hover:text-red-600" />
        </div>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-500">
        <Icon className="w-40 h-40 text-white" />
      </div>
      <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 bg-red-600`}></div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Guru Penasihat" value={totalTeachers} icon={GraduationCap} />
        <StatCard title="Kekuatan Anggota" value={totalStudents} icon={Users} />
        <StatCard title="Barisan AJK" value={totalCommittees} icon={Award} />
        <StatCard title="Operasi Aktiviti" value={totalActivities} icon={Activity} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gender Chart */}
        <div className="bg-slate-900/40 backdrop-blur-md p-8 rounded-[2rem] shadow-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-red-600 rounded-full"></div>
               <h3 className="font-black text-white uppercase text-xs tracking-widest">Komposisi Jantina</h3>
            </div>
            <TrendingUp className="w-4 h-4 text-slate-600" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getGenderData()} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} stroke="#475569" fontSize={10} fontWeight="bold" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                  itemStyle={{ color: '#f1f5f9' }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={32}>
                  {getGenderData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#dc2626' : '#991b1b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Race Chart */}
        <div className="bg-slate-900/40 backdrop-blur-md p-8 rounded-[2rem] shadow-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-amber-600 rounded-full"></div>
               <h3 className="font-black text-white uppercase text-xs tracking-widest">Taburan Etnik</h3>
            </div>
            <TrendingUp className="w-4 h-4 text-slate-600" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getRaceData()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} fontWeight="bold" />
                <YAxis stroke="#475569" fontSize={10} fontWeight="bold" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={40}>
                  {getRaceData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Form Chart */}
        <div className="bg-slate-900/40 backdrop-blur-md p-8 rounded-[2rem] shadow-2xl border border-slate-800 lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-slate-400 rounded-full"></div>
               <h3 className="font-black text-white uppercase text-xs tracking-widest">Analisis Keahlian Mengikut Tingkatan</h3>
            </div>
            <TrendingUp className="w-4 h-4 text-slate-600" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getFormData()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} fontWeight="bold" />
                <YAxis stroke="#475569" fontSize={10} fontWeight="bold" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar dataKey="count" fill="#b91c1c" radius={[12, 12, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
