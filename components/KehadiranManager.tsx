import React, { useState } from 'react';
import { Calendar, Trash2, Printer, CheckCircle, RotateCcw, Save, Users } from 'lucide-react';
import { SystemData, Student, Attendance } from '../types';
import { FormCard, Input, Button, Table, InlineConfirm } from './CommonUI';

interface Props {
  data: SystemData;
  updateData: (newData: Partial<SystemData>) => void;
  onPrint: () => void;
}

const KehadiranManager: React.FC<Props> = ({ data, updateData, onPrint }) => {
  const [tarikh, setTarikh] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceList, setAttendanceList] = useState<string[]>([]);
  const [isTakingAttendance, setIsTakingAttendance] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const startAttendance = () => {
    const existing = data.attendances.find(a => a.tarikh === tarikh);
    if (existing) {
      setAttendanceList(existing.presents);
    } else {
      setAttendanceList([]);
    }
    setIsTakingAttendance(true);
  };

  const toggleAttendance = (studentId: string) => {
    setAttendanceList(prev => 
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  const markAll = () => setAttendanceList(data.students.map(s => s.id));
  const resetAll = () => setAttendanceList([]);

  const saveAttendance = () => {
    const existingIdx = data.attendances.findIndex(a => a.tarikh === tarikh);
    const newRecord: Attendance = { id: crypto.randomUUID(), tarikh, presents: attendanceList };
    
    let updated;
    if (existingIdx > -1) {
      updated = [...data.attendances];
      updated[existingIdx] = newRecord;
    } else {
      updated = [...data.attendances, newRecord];
    }
    
    updateData({ attendances: updated });
    setIsTakingAttendance(false);
  };

  const deleteRecord = (id: string) => {
    updateData({ attendances: data.attendances.filter(a => a.id !== id) });
    setDeletingId(null);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-black text-white uppercase tracking-tighter">Sistem Kehadiran Digital</h2>
        <Button onClick={onPrint} variant="success">
          <Printer className="w-4 h-4" /> Rumusan 12 Bulan
        </Button>
      </div>

      {!isTakingAttendance ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <FormCard title="Sesi Kehadiran Baru">
              <div className="space-y-6">
                <Input type="date" label="Pilih Tarikh" value={tarikh} onChange={(e: any) => setTarikh(e.target.value)} />
                <Button onClick={startAttendance} className="w-full h-14">
                  <Calendar className="w-5 h-5" /> Mula Menanda
                </Button>
              </div>
            </FormCard>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 mb-2 px-2">
               <div className="w-1 h-4 bg-red-600 rounded-full"></div>
               <h3 className="font-black text-xs text-slate-400 uppercase tracking-[0.2em]">Arkib Rekod Kehadiran</h3>
            </div>
            <Table
              headers={['Tarikh Aktiviti', 'Hadir', 'Peratus', 'Tindakan']}
              data={data.attendances.sort((a,b) => b.tarikh.localeCompare(a.tarikh))}
              renderRow={(att: Attendance) => (
                <tr key={att.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-200 uppercase tracking-tighter">{att.tarikh}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-400">
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3 text-red-500" />
                      {att.presents.length} / {data.students.length}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-black text-emerald-500 text-xs">
                      {data.students.length ? Math.round((att.presents.length / data.students.length) * 100) : 0}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {deletingId === att.id ? (
                      <InlineConfirm onConfirm={() => deleteRecord(att.id)} onCancel={() => setDeletingId(null)} />
                    ) : (
                      <button onClick={() => setDeletingId(att.id)} className="text-slate-600 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </td>
                </tr>
              )}
            />
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-800 overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="p-8 bg-slate-950 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
               <div className="w-12 h-12 bg-red-600/10 border border-red-600/20 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-red-600" />
               </div>
               <div>
                  <h3 className="font-black text-xl text-white uppercase tracking-tighter italic">Menanda Kehadiran</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Tarikh: {tarikh} • Status: {attendanceList.length}/{data.students.length}</p>
               </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={markAll} variant="secondary" className="h-12"><CheckCircle className="w-4 h-4" /> Hadir Semua</Button>
              <Button onClick={resetAll} variant="secondary" className="h-12"><RotateCcw className="w-4 h-4" /> Reset</Button>
              <Button onClick={saveAttendance} variant="primary" className="h-12"><Save className="w-4 h-4" /> Simpan Log</Button>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 bg-slate-900/50">
            {data.students.sort((a,b) => a.nama.localeCompare(b.nama)).map(s => {
              const isPresent = attendanceList.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggleAttendance(s.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 text-left group ${
                    isPresent 
                      ? 'bg-red-600/10 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.1)]' 
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <p className={`text-[11px] font-black uppercase truncate ${isPresent ? 'text-red-500' : 'text-slate-300'}`}>{s.nama}</p>
                    <p className="text-[9px] text-slate-500 font-bold mt-0.5">{s.tingkatan} {s.kelas}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-500 ${
                    isPresent ? 'bg-red-600 border-red-600 scale-110' : 'border-slate-800 group-hover:border-slate-600'
                  }`}>
                    {isPresent && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default KehadiranManager;