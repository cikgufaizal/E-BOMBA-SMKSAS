import React, { useState } from 'react';
import { Plus, Trash2, Printer, Search, Edit2, X } from 'lucide-react';
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
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredStudents = data.students.filter(s => 
    s.nama.toLowerCase().includes(search.toLowerCase()) && 
    (!data.committees.some(c => c.studentId === s.id) || (editingId && data.committees.find(c => c.id === editingId)?.studentId === s.id))
  ).slice(0, 5);

  const saveAJK = () => {
    if (!selectedStudent) return;
    
    if (editingId) {
      const updatedCommittees = data.committees.map(c => 
        c.id === editingId ? { ...c, studentId: selectedStudent.id, jawatan: jawatan } : c
      );
      updateData({ committees: updatedCommittees });
      setEditingId(null);
    } else {
      const newAJK: CommitteeMember = {
        id: crypto.randomUUID(),
        studentId: selectedStudent.id,
        jawatan: jawatan
      };
      updateData({ committees: [...data.committees, newAJK] });
    }
    
    setSelectedStudent(null);
    setSearch('');
  };

  const startEdit = (ajk: CommitteeMember) => {
    const student = data.students.find(s => s.id === ajk.studentId);
    if (student) {
      setEditingId(ajk.id);
      setSelectedStudent(student);
      setJawatan(ajk.jawatan);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setSelectedStudent(null);
    setSearch('');
    setJawatan(JawatanAJK.Pengerusi);
  };

  const getStudentInfo = (id: string) => data.students.find(s => s.id === id);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-200 uppercase tracking-tighter">Struktur Organisasi</h2>
        {!editingId && (
          <Button onClick={onPrint} variant="success">
            <Printer className="w-4 h-4" />
            Cetak Carta
          </Button>
        )}
      </div>

      <FormCard title={editingId ? "Kemaskini Jawatan AJK" : "Lantik AJK Baharu"}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-2 relative">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Cari / Tukar Ahli</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-slate-200"
                placeholder="Taip nama ahli..."
                value={selectedStudent ? selectedStudent.nama : search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedStudent(null);
                }}
              />
            </div>
            {search && !selectedStudent && (
              <div className="absolute z-50 w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
                {filteredStudents.length > 0 ? filteredStudents.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStudent(s)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-800 transition-colors border-b border-slate-800 last:border-0"
                  >
                    <p className="font-bold text-sm text-slate-200 uppercase">{s.nama}</p>
                    <p className="text-[10px] text-slate-500 font-bold">TING. {s.tingkatan} • {s.noKP}</p>
                  </button>
                )) : (
                  <p className="px-4 py-3 text-sm text-slate-500 italic">Tiada ahli ditemui</p>
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

          <div className="md:col-span-2 flex gap-3">
            <Button onClick={saveAJK} className="flex-1" disabled={!selectedStudent}>
              {editingId ? <><Edit2 className="w-4 h-4" /> Kemaskini Jawatan</> : <><Plus className="w-4 h-4" /> Lantik Jawatan</>}
            </Button>
            {editingId && (
              <Button variant="secondary" onClick={cancelEdit}>
                <X className="w-4 h-4" /> Batal
              </Button>
            )}
          </div>
        </div>
      </FormCard>

      <Table
        headers={['Bil', 'Nama AJK', 'Jawatan', 'Ting/Kelas', 'Tindakan']}
        data={data.committees.sort((a, b) => {
           const order = Object.values(JawatanAJK);
           return order.indexOf(a.jawatan) - order.indexOf(b.jawatan);
        })}
        renderRow={(ajk: CommitteeMember, idx: number) => {
          const student = getStudentInfo(ajk.studentId);
          if (!student) return null;
          return (
            <tr key={ajk.id} className="hover:bg-slate-900/50">
              <td className="px-6 py-4 text-xs font-bold text-slate-600">{idx + 1}</td>
              <td className="px-6 py-4">
                <p className="font-bold text-slate-200 uppercase">{student.nama}</p>
                <p className="text-[10px] text-slate-500 font-bold">{student.noKP}</p>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-red-900/20 text-red-500 text-[10px] font-black rounded-md border border-red-800/20 uppercase tracking-widest">
                  {ajk.jawatan}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-black text-slate-400 tracking-tighter">
                {student.tingkatan} {student.kelas}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => startEdit(ajk)} className="p-2 text-slate-500 hover:text-emerald-500 transition-colors">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  {deletingId === ajk.id ? (
                    <InlineConfirm onConfirm={() => updateData({ committees: data.committees.filter(c => c.id !== ajk.id) })} onCancel={() => setDeletingId(null)} />
                  ) : (
                    <button onClick={() => setDeletingId(ajk.id)} className="text-slate-500 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          );
        }}
      />
    </div>
  );
};

export default AJKManager;