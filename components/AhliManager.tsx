
import React, { useState } from 'react';
import { Plus, Trash2, Upload, Printer, Edit2, X, AlertTriangle, Search, Filter } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [csvText, setCsvText] = useState('');

  const saveAhli = () => {
    if (!formData.nama || !formData.noKP) return;
    if (editingId) {
      const updatedStudents = data.students.map(s => s.id === editingId ? { ...s, ...formData } as Student : s);
      updateData({ students: updatedStudents });
      setEditingId(null);
    } else {
      const newAhli: Student = {
        id: crypto.randomUUID(),
        nama: formData.nama.toUpperCase(),
        noKP: formData.noKP,
        tingkatan: formData.tingkatan!,
        kelas: formData.kelas?.toUpperCase() || '-',
        jantina: formData.jantina as Jantina,
        kaum: formData.kaum as Kaum
      };
      updateData({ students: [...data.students, newAhli] });
    }
    setFormData({ nama: '', noKP: '', tingkatan: '1', kelas: '', jantina: Jantina.Lelaki, kaum: Kaum.Melayu });
  };

  const handleImport = (rows: string[][]) => {
    const imported: Student[] = rows.map(row => {
      // Ambil data jantina dari kolum ke-5 (index 4)
      const rawGender = (row[4] || '').trim().toUpperCase();
      
      // Logik pengesan jantina yang lebih luas:
      // Jika ada huruf 'P' (P/Perempuan/p) atau 'W' (Wanita), tetapkan sebagai PEREMPUAN
      let finalGender = Jantina.Lelaki;
      if (rawGender.startsWith('P') || rawGender.startsWith('W') || rawGender === 'GIRL') {
        finalGender = Jantina.Perempuan;
      }

      return {
        id: crypto.randomUUID(),
        nama: (row[0] || 'N/A').trim().toUpperCase(),
        noKP: (row[1] || '-').trim(),
        tingkatan: (row[2] || '1').trim(),
        kelas: (row[3] || '-').trim().toUpperCase(),
        jantina: finalGender,
        kaum: (row[5] as Kaum) || Kaum.Melayu
      };
    });

    updateData({ students: [...data.students, ...imported] });
    setShowImport(false);
    setCsvText('');
    alert(`Berjaya import ${imported.length} orang ahli.`);
  };

  const clearAllStudents = () => {
    const userInput = window.prompt(`AMARAN!\n\nAnda akan memadam SEMUA (${data.students.length}) data ahli. Taip 'PADAM' untuk sahkan.`);
    if (userInput === 'PADAM') {
      updateData({ students: [], committees: [] });
      alert("Database dikosongkan.");
    }
  };

  const filteredStudents = data.students.filter(s => 
    s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.noKP.includes(searchTerm)
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-8 gap-6">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Pengurusan Keahlian</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Pangkalan Data Induk Unit</p>
        </div>
        {!editingId && (
          <div className="flex flex-wrap gap-3">
            {data.students.length > 0 && (
              <Button variant="danger" onClick={clearAllStudents} className="px-6">
                <AlertTriangle className="w-4 h-4" /> Padam Semua
              </Button>
            )}
            <Button variant="secondary" onClick={() => setShowImport(!showImport)}>
              <Upload className="w-4 h-4" /> Import CSV
            </Button>
            <Button onClick={onPrint} variant="success" className="px-8">
              <Printer className="w-4 h-4" /> Cetak Senarai
            </Button>
          </div>
        )}
      </div>

      {showImport && !editingId && (
        <FormCard title="Import Data CSV / Bulk Upload">
          <div className="space-y-4">
            <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-xl mb-4">
              <p className="text-[10px] text-red-500 font-black uppercase tracking-widest mb-1">Panduan Kolum CSV:</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase">1: Nama, 2: No KP, 3: Ting, 4: Kelas, 5: Jantina (P/L), 6: Kaum</p>
            </div>
            <textarea
              className="w-full h-32 p-4 bg-slate-950 border border-slate-800 rounded-2xl text-sm outline-none text-slate-200 focus:border-red-600 transition-all font-mono"
              placeholder="CONTOH: ALI BIN ABU, 080101141234, 4, MURNI, L, MELAYU"
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
            />
            <div className="flex gap-4">
              <Button onClick={() => handleImport(parseCSV(csvText))} className="flex-1 h-12">Proses Paste</Button>
              <div className="flex-1">
                <input type="file" accept=".csv" className="hidden" id="csv-student" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], handleImport)} />
                <Button variant="secondary" className="w-full h-12" onClick={() => document.getElementById('csv-student')?.click()}>Upload .CSV</Button>
              </div>
            </div>
          </div>
        </FormCard>
      )}

      {(!showImport || editingId) && (
        <FormCard title={editingId ? "Edit Maklumat Ahli" : "Pendaftaran Ahli Baru"}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input label="Nama Penuh" value={formData.nama} onChange={(e: any) => setFormData({...formData, nama: e.target.value})} />
            <Input label="No. Kad Pengenalan" value={formData.noKP} onChange={(e: any) => setFormData({...formData, noKP: e.target.value})} />
            <Select label="Tingkatan" value={formData.tingkatan} onChange={(e: any) => setFormData({...formData, tingkatan: e.target.value})} options={FORMS.map(f => ({ value: f, label: `TINGKATAN ${f}` }))} />
            <Input label="Kelas" value={formData.kelas} onChange={(e: any) => setFormData({...formData, kelas: e.target.value})} />
            <Select label="Jantina" value={formData.jantina} onChange={(e: any) => setFormData({...formData, jantina: e.target.value})} options={Object.values(Jantina).map(j => ({ value: j, label: j }))} />
            <Select label="Kaum" value={formData.kaum} onChange={(e: any) => setFormData({...formData, kaum: e.target.value})} options={Object.values(Kaum).map(k => ({ value: k, label: k }))} />
            <div className="md:col-span-3 flex gap-4 pt-4">
              <Button onClick={saveAhli} className="flex-1 h-14">{editingId ? 'Simpan' : 'Daftar'}</Button>
              {editingId && <Button variant="secondary" onClick={() => setEditingId(null)} className="h-14">Batal</Button>}
            </div>
          </div>
        </FormCard>
      )}

      <div className="mb-6 relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-red-500 transition-colors" />
        <input 
          type="text" 
          placeholder="CARI NAMA AHLI ATAU NO. KP..." 
          className="w-full pl-16 pr-8 py-5 bg-slate-900/40 backdrop-blur-xl border border-white/[0.05] rounded-[2rem] text-white font-black uppercase tracking-widest text-xs outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Table
        headers={['Bil', 'Nama Anggota', 'No. KP', 'Status Ting/Kelas', 'Gender', 'Aksi']}
        data={filteredStudents.sort((a,b) => a.nama.localeCompare(b.nama))}
        renderRow={(student: Student, idx: number) => (
          <tr key={student.id} className="group hover:bg-slate-900/50 transition-all border-b border-slate-800/30">
            <td className="px-8 py-5 text-xs font-black text-slate-600">{idx + 1}</td>
            <td className="px-8 py-5 font-black text-white uppercase text-sm tracking-tight">{student.nama}</td>
            <td className="px-8 py-5 text-sm text-slate-500 font-mono">{student.noKP}</td>
            <td className="px-8 py-5">
              <span className="px-3 py-1 bg-red-600/10 text-red-500 text-[10px] font-black rounded-lg border border-red-600/20 uppercase">{student.tingkatan} {student.kelas}</span>
            </td>
            <td className="px-8 py-5">
              <span className={`text-[10px] font-black uppercase tracking-widest ${student.jantina === Jantina.Perempuan ? 'text-orange-500' : 'text-slate-400'}`}>
                {student.jantina}
              </span>
            </td>
            <td className="px-8 py-5 flex items-center gap-3">
              <button onClick={() => { setEditingId(student.id); setFormData(student); }} className="p-2.5 bg-slate-800/50 rounded-xl text-slate-500 hover:text-emerald-500 transition-all"><Edit2 className="w-4 h-4" /></button>
              {deletingId === student.id ? (
                <InlineConfirm onConfirm={() => updateData({ students: data.students.filter(s => s.id !== student.id) })} onCancel={() => setDeletingId(null)} />
              ) : (
                <button onClick={() => setDeletingId(student.id)} className="p-2.5 bg-slate-800/50 rounded-xl text-slate-500 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
              )}
            </td>
          </tr>
        )}
      />
    </div>
  );
};

export default AhliManager;
