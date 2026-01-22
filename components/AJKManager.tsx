
import React, { useState } from 'react';
import { Plus, Trash2, Printer, Search } from 'lucide-react';
import { SystemData, CommitteeMember, JawatanAJK, Student } from '../types';
import { FormCard, Select, Button, Table, InlineConfirm } from './CommonUI';

interface Props {
  data: SystemData;
  updateData: (newData: Partial<SystemData>) => void;
  onPrint: () => void;
}

const AJKManager: React.FC<Props> = ({ data, updateData, onPrint }) => {
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [jawatan, setJawatan] = useState<JawatanAJK>(JawatanAJK.Pengerusi);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredStudents = data.students.filter(s => 
    s.nama.toLowerCase().includes(search.toLowerCase()) && 
    !data.committees.some(c => c.studentId === s.id)
  ).slice(0, 5);

  const addAJK = () => {
    if (!selectedStudent) return;
    const newAJK: CommitteeMember = {
      id: crypto.randomUUID(),
      studentId: selectedStudent.id,
      jawatan: jawatan
    };
    updateData({ committees: [...data.committees, newAJK] });
    setSelectedStudent(null);
    setSearch('');
  };

  const getStudentInfo = (id: string) => data.students.find(s => s.id === id);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-800">Carta Organisasi AJK</h2>
        <Button onClick={onPrint} variant="success">
          <Printer className="w-4 h-4" />
          Cetak Carta
        </Button>
      </div>

      <FormCard title="Lantik AJK Baharu">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-2 relative">
            <label className="text-sm font-semibold text-slate-700">Cari Ahli</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Taip nama ahli..."
                value={selectedStudent ? selectedStudent.nama : search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedStudent(null);
                }}
              />
            </div>
            {search && !selectedStudent && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
                {filteredStudents.length > 0 ? filteredStudents.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStudent(s)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                  >
                    <p className="font-bold text-sm text-slate-800">{s.nama}</p>
                    <p className="text-xs text-slate-500">{s.noKP} • Ting. {s.tingkatan}</p>
                  </button>
                )) : (
                  <p className="px-4 py-3 text-sm text-slate-400">Tiada ahli ditemui</p>
                )}
              </div>
            )}
          </div>

          <Select 
            label="Pilih Jawatan"
            value={jawatan}
            onChange={(e: any) => setJawatan(e.target.value)}
            options={Object.values(JawatanAJK).map(j => ({ value: j, label: j }))}
          />

          <div className="md:col-span-2">
            <Button onClick={addAJK} className="w-full" disabled={!selectedStudent}>
              <Plus className="w-4 h-4" /> Lantik Jawatan
            </Button>
          </div>
        </div>
      </FormCard>

      <Table
        headers={['Bil', 'Nama AJK', 'Jawatan', 'Ting/Kelas', 'Tindakan']}
        data={data.committees.sort((a, b) => {
           // Basic sorting by hierarchy - in a real app would use an index
           return a.jawatan.localeCompare(b.jawatan);
        })}
        renderRow={(ajk: CommitteeMember, idx: number) => {
          const student = getStudentInfo(ajk.studentId);
          if (!student) return null;
          return (
            <tr key={ajk.id} className="hover:bg-slate-50">
              <td className="px-6 py-4 text-xs font-bold text-slate-400">{idx + 1}</td>
              <td className="px-6 py-4">
                <p className="font-bold text-slate-800">{student.nama}</p>
                <p className="text-xs text-slate-500">{student.noKP}</p>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[11px] font-bold rounded-md uppercase tracking-wide">
                  {ajk.jawatan}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-slate-600">
                {student.tingkatan} {student.kelas}
              </td>
              <td className="px-6 py-4">
                {deletingId === ajk.id ? (
                  <InlineConfirm onConfirm={() => updateData({ committees: data.committees.filter(c => c.id !== ajk.id) })} onCancel={() => setDeletingId(null)} />
                ) : (
                  <button onClick={() => setDeletingId(ajk.id)} className="text-slate-300 hover:text-red-500">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </td>
            </tr>
          );
        }}
      />
    </div>
  );
};

export default AJKManager;
