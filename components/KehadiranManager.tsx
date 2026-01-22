
import React, { useState } from 'react';
import { Calendar, Trash2, Printer, CheckCircle, RotateCcw, Save } from 'lucide-react';
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-800">Log Kehadiran</h2>
        <Button onClick={onPrint} variant="success">
          <Printer className="w-4 h-4" /> Cetak Rumusan 12 Bulan
        </Button>
      </div>

      {!isTakingAttendance ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormCard title="Ambil Kehadiran Baharu">
            <div className="space-y-4">
              <Input type="date" label="Pilih Tarikh" value={tarikh} onChange={(e: any) => setTarikh(e.target.value)} />
              <Button onClick={startAttendance} className="w-full">
                <Calendar className="w-4 h-4" /> Mula Sesi Kehadiran
              </Button>
            </div>
          </FormCard>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-700">Rumusan Rekod</h3>
            <Table
              headers={['Tarikh', 'Hadir', '%', 'Tindakan']}
              data={data.attendances.sort((a,b) => b.tarikh.localeCompare(a.tarikh))}
              renderRow={(att: Attendance) => (
                <tr key={att.id}>
                  <td className="px-6 py-3 text-sm font-bold text-slate-700">{att.tarikh}</td>
                  <td className="px-6 py-3 text-sm">{att.presents.length}/{data.students.length}</td>
                  <td className="px-6 py-3">
                    <span className="font-bold text-blue-600">
                      {data.students.length ? Math.round((att.presents.length / data.students.length) * 100) : 0}%
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    {deletingId === att.id ? (
                      <InlineConfirm onConfirm={() => deleteRecord(att.id)} onCancel={() => setDeletingId(null)} />
                    ) : (
                      <button onClick={() => setDeletingId(att.id)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </td>
                </tr>
              )}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
          <div className="p-6 bg-slate-50 border-b flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800">Menanda Kehadiran</h3>
              <p className="text-sm text-slate-500">Tarikh: {tarikh} • Hadir: {attendanceList.length}/{data.students.length}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={markAll} variant="secondary"><CheckCircle className="w-4 h-4" /> Hadir Semua</Button>
              <Button onClick={resetAll} variant="secondary"><RotateCcw className="w-4 h-4" /> Reset</Button>
              <Button onClick={saveAttendance} variant="primary"><Save className="w-4 h-4" /> Simpan Log</Button>
            </div>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {data.students.sort((a,b) => a.nama.localeCompare(b.nama)).map(s => {
              const isPresent = attendanceList.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggleAttendance(s.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                    isPresent ? 'bg-emerald-50 border-emerald-500 shadow-sm' : 'bg-white border-slate-200'
                  }`}
                >
                  <div>
                    <p className={`text-sm font-bold ${isPresent ? 'text-emerald-800' : 'text-slate-800'}`}>{s.nama}</p>
                    <p className="text-[10px] text-slate-500 uppercase">{s.tingkatan} {s.kelas}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isPresent ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
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
