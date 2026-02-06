import React, { useState } from 'react';
import { Printer, Trash2, Upload, AlertTriangle, Search, Edit2 } from 'lucide-react';
import { SystemData, Student, Jantina, Kaum } from '../types';
import { FormCard, Input, Select, Button, Table, InlineConfirm } from './CommonUI';
import { FORMS } from '../constants';
import CsvImportModal from './common/CsvImportModal';

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

  const saveAhli = () => {
    if (!formData.nama || !formData.noKP) return;
    const cleanKP = formData.noKP.replace(/[^0-9]/g, '');
    
    if (editingId) {
      const updatedStudents = data.students.map(s => s.id === editingId ? { ...s, ...formData, noKP: cleanKP } as Student : s);
      updateData({ students: updatedStudents });
      setEditingId(null);
    } else {
      const isDuplicate = data.students.find(s => s.noKP === cleanKP);
      if (isDuplicate) {
        alert(`AMARAN: Pelajar dengan No KP ${cleanKP} sudah wujud (${isDuplicate.nama}). Sila gunakan fungsi Edit.`);
        return;
      }
      const newAhli: Student = {
        id: crypto.randomUUID(),
        nama: formData.nama.toUpperCase().trim(),
        noKP: cleanKP,
        tingkatan: formData.tingkatan!,
        kelas: formData.kelas?.toUpperCase().trim() || '-',
        jantina: formData.jantina as Jantina,
        kaum: formData.kaum as Kaum
      };
      updateData({ students: [...data.students, newAhli] });
    }
    setFormData({ nama: '', noKP: '', tingkatan: '1', kelas: '', jantina: Jantina.Lelaki, kaum: Kaum.Melayu });
  };

  const handleImport = (rows: string[][]) => {
    let updatedCount = 0;
    let addedCount = 0;
    const studentMap = new Map<string, Student>(data.students.map(s => [s.noKP, s]));

    rows.forEach(row => {
      if (!row[0] || row[0].trim() === '') return;
      const nama = row[0].trim().toUpperCase();
      const noKP = (row[1] || '').replace(/[^0-9]/g, '');
      const ting = (row[2] || '1').trim();
      const kelas = (row[3] || '-').trim().toUpperCase();
      
      const genderInput = (row[4] || '').trim().toUpperCase();
      let finalGender = Jantina.Lelaki;
      const pKeywords = ['P', 'PEREMPUAN', 'W', 'WANITA', 'GIRL', 'FEMALE'];
      const isEvenKP = noKP.length > 0 && parseInt(noKP.slice(-1)) % 2 === 0;
      if (pKeywords.some(k => genderInput.startsWith(k)) || isEvenKP) {
        finalGender = Jantina.Perempuan;
      }

      const kaumInput = (row[5] || 'MELAYU').trim().toUpperCase();
      let finalKaum = Kaum.Melayu;
      if (kaumInput.includes('CIN')) finalKaum = Kaum.Cina;
      else if (kaumInput.includes('IND')) finalKaum = Kaum.India;
      else if (kaumInput.includes('ASLI')) finalKaum = Kaum.OrangAsli;
      else if (kaumInput.length > 0 && kaumInput !== 'MELAYU') finalKaum = Kaum.LainLain;

      const studentData: Student = {
        id: studentMap.get(noKP)?.id || crypto.randomUUID(),
        nama, noKP, tingkatan: ting, kelas, jantina: finalGender, kaum: finalKaum
      };

      if (studentMap.has(noKP)) updatedCount++;
      else addedCount++;
      studentMap.set(noKP, studentData);
    });

    updateData({ students: Array.from(studentMap.values()) });
    setShowImport(false);
    alert(`IMPORT SELESAI:\n✅ ${addedCount} Ditambah\n🔄 ${updatedCount} Dikemaskini`);
  };

  const clearAllStudents = () => {
    if (confirm("AMARAN: Ini akan memadam SEMUA ahli. Teruskan?")) {
      updateData({ students: [], committees: [] });
    }
  };

  const filteredStudents = data.students.filter(s => 
    s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || s.noKP.includes(searchTerm)
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-8 gap-6">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Pengurusan Keahlian</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Smart Deduplication Active</p>
        </div>
        {!editingId && (
          <div className="flex flex-wrap gap-3">
            {data.students.length > 0 && (
              <Button variant="danger" onClick={clearAllStudents} className="px-6">
                <AlertTriangle className="w-4 h-4" /> Reset DB
              </Button>
            )}
            <Button variant="secondary" onClick={() => setShowImport(true)}>
              <Upload className="w-4 h-4" /> Import CSV
            </Button>
            <Button onClick={onPrint} variant="success" className="px-8">
              <Printer className="w-4 h-4" /> Cetak Senarai
            </Button>
          </div>
        )}
      </div>

      <CsvImportModal 
        isOpen={showImport} 
        onClose={() => setShowImport(false)} 
        onImport={handleImport} 
        title="Import Ahli (Auto-Detect)"
        notes={<p className="text-[10px] text-slate-400">Column: Nama, No KP, Tingkatan, Kelas, Jantina (Auto), Kaum</p>}
      />

      {editingId || !showImport ? (
        <FormCard title={editingId ? "Kemaskini Maklumat Ahli" : "Pendaftaran Ahli Baru"}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input label="Nama Penuh" value={formData.nama} onChange={(e: any) => setFormData({...formData, nama: e.target.value})} />
            <Input label="No. KP" placeholder="Tanpa tanda -" value={formData.noKP} onChange={(e: any) => setFormData({...formData, noKP: e.target.value})} />
            <Select label="Tingkatan" value={formData.tingkatan} onChange={(e: any) => setFormData({...formData, tingkatan: e.target.value})} options={FORMS.map(f => ({ value: f, label: `TINGKATAN ${f}` }))} />
            <Input label="Kelas" value={formData.kelas} onChange={(e: any) => setFormData({...formData, kelas: e.target.value})} />
            <Select label="Jantina" value={formData.jantina} onChange={(e: any) => setFormData({...formData, jantina: e.target.value})} options={Object.values(Jantina).map(j => ({ value: j, label: j }))} />
            <Select label="Kaum" value={formData.kaum} onChange={(e: any) => setFormData({...formData, kaum: e.target.value})} options={Object.values(Kaum).map(k => ({ value: k, label: k }))} />
            <div className="md:col-span-3 flex gap-4 pt-4">
              <Button onClick={saveAhli} className="flex-1 h-14">{editingId ? 'Simpan Perubahan' : 'Daftar Ahli'}</Button>
              {editingId && <Button variant="secondary" onClick={() => { setEditingId(null); setFormData({ nama: '', noKP: '', tingkatan: '1', kelas: '', jantina: Jantina.Lelaki, kaum: Kaum.Melayu }); }} className="h-14">Batal</Button>}
            </div>
          </div>
        </FormCard>
      ) : null}

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
            <td className="px-8 py-5">
              <div className="font-black text-white uppercase text-sm tracking-tight">{student.nama}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">{student.kaum}</div>
            </td>
            <td className="px-8 py-5 text-sm text-slate-500 font-mono tracking-tighter">{student.noKP}</td>
            <td className="px-8 py-5">
              <span className="px-3 py-1 bg-red-600/10 text-red-500 text-[10px] font-black rounded-lg border border-red-600/20 uppercase">{student.tingkatan} {student.kelas}</span>
            </td>
            <td className="px-8 py-5">
              <span className={`px-3 py-1 text-[9px] font-black rounded-full border uppercase tracking-widest ${student.jantina === Jantina.Perempuan ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                {student.jantina}
              </span>
            </td>
            <td className="px-8 py-5 flex items-center gap-3">
              <button onClick={() => { setEditingId(student.id); setFormData(student); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-2.5 bg-slate-800/50 rounded-xl text-slate-500 hover:text-emerald-500 transition-all"><Edit2 className="w-4 h-4" /></button>
              {deletingId === student.id ? (
                <InlineConfirm onConfirm={() => { updateData({ students: data.students.filter(s => s.id !== student.id) }); setDeletingId(null); }} onCancel={() => setDeletingId(null)} />
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