import React, { useState } from 'react';
import { Printer, Trash2, Upload, AlertTriangle, Search, Edit2, UserPlus, FileSpreadsheet } from 'lucide-react';
import { SystemData, Student, Jantina, Kaum } from '../types';
import { Button, Table, InlineConfirm } from './CommonUI';
import CsvImportModal from './common/CsvImportModal';
import MemberFormModal from './common/MemberFormModal';

interface Props {
  data: SystemData;
  updateData: (newData: Partial<SystemData>) => void;
  onPrint: () => void;
}

const AhliManager: React.FC<Props> = ({ data, updateData, onPrint }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleSaveStudent = (formData: Partial<Student>) => {
    const cleanKP = formData.noKP?.replace(/[^0-9]/g, '') || '';
    
    if (editingStudent) {
      // Edit Mode
      const updatedStudents = data.students.map(s => 
        s.id === editingStudent.id ? { ...s, ...formData, noKP: cleanKP } as Student : s
      );
      updateData({ students: updatedStudents });
    } else {
      // Add Mode
      const isDuplicate = data.students.find(s => s.noKP === cleanKP);
      if (isDuplicate) {
        alert(`AMARAN: Pelajar dengan No KP ${cleanKP} sudah wujud (${isDuplicate.nama}).`);
        return;
      }
      const newAhli: Student = {
        ...formData as Student,
        id: crypto.randomUUID(),
        nama: formData.nama?.toUpperCase().trim() || '',
        noKP: cleanKP,
        kelas: formData.kelas?.toUpperCase().trim() || '-',
        // Default values if missing
        health: formData.health || {
          asma: false, lelahTB: false, kencingManis: false, darahTinggi: false,
          penglihatan: false, pendengaran: false, kronikLain: false, kecacatan: ''
        }
      };
      updateData({ students: [...data.students, newAhli] });
    }
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
        nama, noKP, tingkatan: ting, kelas, jantina: finalGender, kaum: finalKaum,
        health: studentMap.get(noKP)?.health || {
          asma: false, lelahTB: false, kencingManis: false, darahTinggi: false,
          penglihatan: false, pendengaran: false, kronikLain: false, kecacatan: ''
        }
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
    <div className="animate-in fade-in duration-500 h-full flex flex-col">
      {/* Header Actions */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-8 gap-6">
        <div>
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Pangkalan Data Anggota</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
            Total Rekod: <span className="text-white">{data.students.length}</span> • Disahkan: <span className="text-emerald-500">{data.students.length}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-red-500 transition-colors" />
              <input 
                type="text" 
                placeholder="CARI NAMA / MYKAD..." 
                className="w-full md:w-64 pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold text-xs outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all uppercase placeholder:normal-case"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button onClick={handleOpenAdd} className="h-11 px-6 shadow-lg shadow-red-900/20">
              <UserPlus className="w-4 h-4" /> Tambah Ahli
            </Button>
            
            <Button variant="secondary" onClick={() => setShowImport(true)} className="h-11 w-11 p-0 flex items-center justify-center" title="Import CSV">
              <FileSpreadsheet className="w-4 h-4" />
            </Button>
            
            <Button onClick={onPrint} variant="success" className="h-11 w-11 p-0 flex items-center justify-center" title="Cetak Senarai">
              <Printer className="w-4 h-4" />
            </Button>
            
            {data.students.length > 0 && (
              <Button variant="danger" onClick={clearAllStudents} className="h-11 w-11 p-0 flex items-center justify-center" title="Reset Database">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
        </div>
      </div>

      {/* Main Table Area */}
      <div className="flex-1 overflow-hidden rounded-[2rem] border border-white/[0.05] shadow-2xl bg-slate-900/40 backdrop-blur-xl flex flex-col">
        <div className="overflow-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950/80 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                {['#', 'NAMA ANGGOTA', 'NO. MYKAD', 'TINGKATAN', 'JANTINA', 'KAUM', 'AKSI'].map((h, i) => (
                  <th key={i} className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/[0.05]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {filteredStudents.length > 0 ? filteredStudents.sort((a,b) => a.nama.localeCompare(b.nama)).map((student, idx) => (
                <tr key={student.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-xs font-black text-slate-600">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-200 uppercase text-xs tracking-tight group-hover:text-red-400 transition-colors">{student.nama}</div>
                    {student.noKeahlian && <div className="text-[9px] text-emerald-500 font-mono mt-0.5">{student.noKeahlian}</div>}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-mono tracking-tighter">{student.noKP}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-800 text-slate-400 text-[9px] font-bold rounded border border-slate-700 uppercase">
                      {student.tingkatan} {student.kelas}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">{student.jantina}</td>
                  <td className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">{student.kaum}</td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <button onClick={() => handleOpenEdit(student)} className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {deletingId === student.id ? (
                      <InlineConfirm onConfirm={() => { updateData({ students: data.students.filter(s => s.id !== student.id) }); setDeletingId(null); }} onCancel={() => setDeletingId(null)} />
                    ) : (
                      <button onClick={() => setDeletingId(student.id)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                      <UserPlus className="w-12 h-12 text-slate-600" />
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Tiada Data Dijumpai</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMPONENTS */}
      <CsvImportModal 
        isOpen={showImport} 
        onClose={() => setShowImport(false)} 
        onImport={handleImport} 
        title="Import Ahli Pukal (CSV)"
        notes={<p className="text-[10px] text-slate-400">Column Order: Nama, No KP, Tingkatan, Kelas, Jantina (Auto), Kaum</p>}
      />

      <MemberFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveStudent}
        initialData={editingStudent}
        mode={editingStudent ? 'EDIT' : 'ADD'}
      />
    </div>
  );
};

export default AhliManager;
