import React, { useState } from 'react';
import { Plus, Trash2, Upload, Printer, Edit2, X } from 'lucide-react';
import { SystemData, Student, Jantina, Kaum } from '../types';
import { FormCard, Input, Select, Button, Table, InlineConfirm } from './CommonUI';
import { handleFileUpload, parseCSV } from '../utils/csvParser';
import { FORMS } from '../constants';

interface Props {
  data: SystemData;
  updateData: (newData: Partial<SystemData>) => void;
  onPrint: () => void;
}

const AhliManager: React.FC<Props> = ({ data, updateData, onPrint }) => {
  const [formData, setFormData] = useState<Partial<Student>>({
    nama: '', noKP: '', tingkatan: '1', kelas: '', jantina: Jantina.Lelaki, kaum: Kaum.Melayu
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [csvText, setCsvText] = useState('');

  const saveAhli = () => {
    if (!formData.nama || !formData.noKP) return;

    if (editingId) {
      const updatedStudents = data.students.map(s => 
        s.id === editingId ? { ...s, ...formData } as Student : s
      );
      updateData({ students: updatedStudents });
      setEditingId(null);
    } else {
      const newAhli: Student = {
        id: crypto.randomUUID(),
        nama: formData.nama,
        noKP: formData.noKP,
        tingkatan: formData.tingkatan!,
        kelas: formData.kelas || '-',
        jantina: formData.jantina as Jantina,
        kaum: formData.kaum as Kaum
      };
      updateData({ students: [...data.students, newAhli] });
    }
    setFormData({ nama: '', noKP: '', tingkatan: '1', kelas: '', jantina: Jantina.Lelaki, kaum: Kaum.Melayu });
  };

  const startEdit = (student: Student) => {
    setEditingId(student.id);
    setFormData({ ...student });
    setShowImport(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ nama: '', noKP: '', tingkatan: '1', kelas: '', jantina: Jantina.Lelaki, kaum: Kaum.Melayu });
  };

  const handleImport = (rows: string[][]) => {
    const imported: Student[] = rows.map(row => ({
      id: crypto.randomUUID(),
      nama: row[0] || 'N/A',
      noKP: row[1] || '-',
      tingkatan: row[2] || '1',
      kelas: row[3] || '-',
      jantina: (row[4]?.toUpperCase() === 'PEREMPUAN' ? Jantina.Perempuan : Jantina.Lelaki),
      kaum: (row[5] as Kaum) || Kaum.Melayu
    }));
    updateData({ students: [...data.students, ...imported] });
    setShowImport(false);
    setCsvText('');
  };

  const deleteAhli = (id: string) => {
    updateData({ students: data.students.filter(s => s.id !== id) });
    setDeletingId(null);
    if (editingId === id) cancelEdit();
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Pengurusan Keahlian</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Sistem Pangkalan Data Induk</p>
        </div>
        {!editingId && (
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowImport(!showImport)}>
              <Upload className="w-4 h-4" /> Import CSV
            </Button>
            <Button onClick={onPrint} variant="success" className="px-8 shadow-lg shadow-emerald-900/20">
              <Printer className="w-4 h-4" /> Cetak Senarai
            </Button>
          </div>
        )}
      </div>

      {showImport && !editingId && (
        <FormCard title="Import Data Dari CSV / Paste">
          <div className="space-y-4">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Susunan Kolum: Nama, No KP, Tingkatan, Kelas, Jantina, Kaum</p>
            <textarea
              className="w-full h-32 p-4 bg-slate-950 border border-slate-800 rounded-2xl text-sm outline-none text-slate-200 focus:border-red-600 transition-all font-mono"
              placeholder="Ali bin Abu, 080101141234, 4, Murni, LELAKI, MELAYU"
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => handleImport(parseCSV(csvText))} className="flex-1 h-12">Proses Data Paste</Button>
              <div className="flex-1">
                <input type="file" accept=".csv" className="hidden" id="csv-student" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], handleImport)} />
                <Button variant="secondary" className="w-full h-12" onClick={() => document.getElementById('csv-student')?.click()}>Upload Fail .CSV</Button>
              </div>
            </div>
          </div>
        </FormCard>
      )}

      {(!showImport || editingId) && (
        <FormCard title={editingId ? "Kemaskini Maklumat Ahli" : "Pendaftaran Ahli Baharu"}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input label="Nama Penuh (Huruf Besar)" value={formData.nama} onChange={(e: any) => setFormData({...formData, nama: e.target.value.toUpperCase()})} />
            <Input label="No. Kad Pengenalan" placeholder="000000-00-0000" value={formData.noKP} onChange={(e: any) => setFormData({...formData, noKP: e.target.value})} />
            <Select label="Tingkatan" value={formData.tingkatan} onChange={(e: any) => setFormData({...formData, tingkatan: e.target.value})} options={FORMS.map(f => ({ value: f, label: `TINGKATAN ${f}` }))} />
            <Input label="Nama Kelas" placeholder="Cth: MURNI" value={formData.kelas} onChange={(e: any) => setFormData({...formData, kelas: e.target.value.toUpperCase()})} />
            <Select label="Jantina" value={formData.jantina} onChange={(e: any) => setFormData({...formData, jantina: e.target.value})} options={Object.values(Jantina).map(j => ({ value: j, label: j }))} />
            <Select label="Etnik / Kaum" value={formData.kaum} onChange={(e: any) => setFormData({...formData, kaum: e.target.value})} options={Object.values(Kaum).map(k => ({ value: k, label: k }))} />
            <div className="md:col-span-3 flex gap-4 pt-4">
              <Button onClick={saveAhli} className="flex-1 h-14">
                {editingId ? <><Edit2 className="w-5 h-5" /> Simpan Perubahan</> : <><Plus className="w-5 h-5" /> Daftar Ahli</>}
              </Button>
              {editingId && (
                <Button variant="secondary" onClick={cancelEdit} className="h-14 px-10">Batal</Button>
              )}
            </div>
          </div>
        </FormCard>
      )}

      <Table
        headers={['Bil', 'Profil Anggota', 'No. KP', 'Status Ting/Kelas', 'Kategori', 'Aksi']}
        data={data.students.sort((a,b) => a.nama.localeCompare(b.nama))}
        renderRow={(student: Student, idx: number) => (
          <tr key={student.id} className="group hover:bg-slate-900/50 transition-all border-b border-slate-800/30 last:border-0">
            <td className="px-6 py-5 text-xs font-black text-slate-600">{idx + 1}</td>
            <td className="px-6 py-5">
              <p className="text-sm font-black text-white uppercase tracking-tight">{student.nama}</p>
            </td>
            <td className="px-6 py-5 text-sm text-slate-500 font-mono">{student.noKP}</td>
            <td className="px-6 py-5">
              <span className="px-3 py-1 bg-red-600/10 text-red-500 text-[10px] font-black rounded-lg border border-red-600/20 uppercase">
                {student.tingkatan} {student.kelas}
              </span>
            </td>
            <td className="px-6 py-5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{student.jantina} • {student.kaum}</p>
            </td>
            <td className="px-6 py-5">
              <div className="flex items-center gap-3">
                <button onClick={() => startEdit(student)} className="p-2.5 bg-slate-800/50 rounded-xl text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all">
                  <Edit2 className="w-4 h-4" />
                </button>
                {deletingId === student.id ? (
                  <InlineConfirm onConfirm={() => deleteAhli(student.id)} onCancel={() => setDeletingId(null)} />
                ) : (
                  <button onClick={() => setDeletingId(student.id)} className="p-2.5 bg-slate-800/50 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all"><Trash2 className="w-4 h-4" /></button>
                )}
              </div>
            </td>
          </tr>
        )}
      />
    </div>
  );
};

export default AhliManager;