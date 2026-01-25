
import React, { useState } from 'react';
import { 
  UserPlus, ShieldAlert, Heart, Phone, Printer, 
  FileStack, FileText, Users, FileCheck, Search,
  ClipboardList, ChevronRight, CheckCircle2
} from 'lucide-react';
import { SystemData, Student, Jantina, Kaum, HealthStatus } from '../types';
import { FormCard, Input, Select, Button, Table } from './CommonUI';
import { FORMS } from '../constants';

interface Props {
  data: SystemData;
  updateData: (newData: Partial<SystemData>) => void;
  onPrint: (id: string, type?: any) => void;
}

type SubModule = 'DAFTAR' | 'LAMPIRAN_A' | 'LAMPIRAN_B' | 'LAMPIRAN_D' | 'LAMPIRAN_E' | 'LAMPIRAN_F';

const PendaftaranManager: React.FC<Props> = ({ data, updateData, onPrint }) => {
  const [currentView, setCurrentView] = useState<SubModule>('DAFTAR');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<Student>>({
    nama: '', noKP: '', noKeahlian: '', tingkatan: '1', kelas: '', umur: '', tahap: '1',
    jantina: Jantina.Lelaki, kaum: Kaum.Melayu, kumpulanDarah: 'A+', alamat: '',
    namaWaris: '', noKPWaris: '', telefonWaris: '', alamatWaris: '',
    health: {
      asma: false, lelahTB: false, kencingManis: false, darahTinggi: false,
      penglihatan: false, pendengaran: false, kronikLain: false, kecacatan: ''
    }
  });

  const [activeRegStep, setActiveRegStep] = useState(1);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleRegister = () => {
    if (!formData.nama || !formData.noKP) {
        alert("Sila lengkapkan Nama dan No KP!");
        return;
    }

    const cleanKP = formData.noKP.replace(/[^0-9]/g, '');
    const isDuplicate = data.students.find(s => s.noKP === cleanKP);
    
    if (isDuplicate) {
        alert("Rekod sudah wujud dalam sistem!");
        return;
    }

    const newStudent: Student = {
      id: crypto.randomUUID(),
      nama: formData.nama.toUpperCase().trim(),
      noKP: cleanKP,
      noKeahlian: formData.noKeahlian?.toUpperCase().trim() || '-',
      tingkatan: formData.tingkatan!,
      kelas: formData.kelas?.toUpperCase().trim() || '-',
      jantina: formData.jantina as Jantina,
      kaum: formData.kaum as Kaum,
      umur: formData.umur,
      tahap: formData.tahap,
      kumpulanDarah: formData.kumpulanDarah,
      alamat: formData.alamat?.toUpperCase(),
      namaWaris: formData.namaWaris?.toUpperCase(),
      noKPWaris: formData.noKPWaris?.replace(/[^0-9]/g, ''),
      telefonWaris: formData.telefonWaris,
      alamatWaris: formData.alamatWaris?.toUpperCase() || formData.alamat?.toUpperCase(),
      health: formData.health as HealthStatus
    };

    updateData({ students: [...data.students, newStudent] });
    setSuccessMessage(true);
    setTimeout(() => {
        setSuccessMessage(false);
        setFormData({
            nama: '', noKP: '', noKeahlian: '', tingkatan: '1', kelas: '', umur: '', tahap: '1',
            jantina: Jantina.Lelaki, kaum: Kaum.Melayu, 
            kumpulanDarah: 'A+', alamat: '', namaWaris: '', 
            noKPWaris: '', telefonWaris: '', alamatWaris: '',
            health: {
              asma: false, lelahTB: false, kencingManis: false, 
              darahTinggi: false, penglihatan: false, pendengaran: false, 
              kronikLain: false, kecacatan: ''
            }
        });
        setActiveRegStep(1);
        setCurrentView('LAMPIRAN_A'); // Terus ke senarai untuk cetak
    }, 2000);
  };

  const menuButtons = [
    { id: 'DAFTAR', label: 'Daftar Ahli', icon: UserPlus, color: 'bg-red-600' },
    { id: 'LAMPIRAN_A', label: 'Lampiran A', icon: FileText, color: 'bg-slate-800' },
    { id: 'LAMPIRAN_B', label: 'Lampiran B', icon: Heart, color: 'bg-slate-800' },
    { id: 'LAMPIRAN_D', label: 'Lampiran D', icon: FileCheck, color: 'bg-slate-800' },
    { id: 'LAMPIRAN_E', label: 'Lampiran E', icon: Users, color: 'bg-slate-800' },
    { id: 'LAMPIRAN_F', label: 'Lampiran F', icon: FileStack, color: 'bg-slate-800' },
  ];

  const filteredStudents = data.students.filter(s => 
    s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.noKP.includes(searchTerm)
  );

  return (
    <div className="animate-in fade-in duration-700">
      {/* HEADER & NAVIGASI */}
      <div className="mb-10">
        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-6">Hub Dokumentasi Bomba</h2>
        <div className="flex flex-wrap gap-3">
          {menuButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setCurrentView(btn.id as SubModule)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                currentView === btn.id 
                ? 'bg-red-600 text-white shadow-[0_10px_20px_rgba(239,68,68,0.3)] scale-105' 
                : 'bg-slate-900/50 text-slate-500 border border-white/[0.05] hover:bg-slate-800 hover:text-slate-300'
              }`}
            >
              <btn.icon className="w-4 h-4" />
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW: DAFTAR AHLI */}
      {currentView === 'DAFTAR' && (
        <div className="max-w-4xl mx-auto">
          <FormCard title="Pendaftaran Ahli Baru (Kemasukan Data Lampiran A & B)">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input label="Nama Penuh" value={formData.nama} onChange={(e: any) => setFormData({...formData, nama: e.target.value})} />
              <Input label="No. KP" placeholder="000000-00-0000" value={formData.noKP} onChange={(e: any) => setFormData({...formData, noKP: e.target.value})} />
              <Input label="No. Keahlian" placeholder="KB-001/2026" value={formData.noKeahlian} onChange={(e: any) => setFormData({...formData, noKeahlian: e.target.value})} />
              <Input label="Umur" type="number" value={formData.umur} onChange={(e: any) => setFormData({...formData, umur: e.target.value})} />
              <Select label="Tingkatan" value={formData.tingkatan} onChange={(e: any) => setFormData({...formData, tingkatan: e.target.value})} options={FORMS.map(f => ({ value: f, label: `TINGKATAN ${f}` }))} />
              <Input label="Kelas" value={formData.kelas} onChange={(e: any) => setFormData({...formData, kelas: e.target.value})} />
              <div className="md:col-span-2">
                <Input label="Alamat Tetap Ahli" value={formData.alamat} onChange={(e: any) => setFormData({...formData, alamat: e.target.value})} />
              </div>
              <div className="md:col-span-2 pt-6">
                 <Button onClick={handleRegister} className="w-full h-16 text-xs shadow-2xl">Daftar & Jana Rekod</Button>
              </div>
            </div>
          </FormCard>
          {successMessage && (
            <div className="bg-emerald-600 text-white p-6 rounded-3xl flex items-center gap-4 animate-in zoom-in">
              {/* Added missing CheckCircle2 component */}
              <CheckCircle2 />
              <span className="font-black uppercase text-xs tracking-widest">Berjaya! Membuka senarai Lampiran A...</span>
            </div>
          )}
        </div>
      )}

      {/* VIEW: LAMPIRAN A (TABEL NAMA PELAJAR) */}
      {currentView === 'LAMPIRAN_A' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/[0.05]">
            <div>
              <h3 className="font-black text-white uppercase tracking-tighter text-xl italic">Pengurusan Lampiran A</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Borang Maklumat Peribadi Individu</p>
            </div>
            <div className="relative group w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-red-500 transition-colors" />
              <input 
                type="text" 
                placeholder="CARI NAMA / NO KP..."
                className="w-full pl-12 pr-6 py-4 bg-slate-950 border border-white/[0.05] rounded-2xl text-xs font-black uppercase tracking-widest outline-none focus:border-red-600 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Table
            headers={['Bil', 'Nama Ahli (Lampiran A)', 'No. KP', 'Ting/Kelas', 'Aksi Cetak']}
            data={filteredStudents.sort((a,b) => a.nama.localeCompare(b.nama))}
            renderRow={(s: Student, idx: number) => (
              <tr key={s.id} className="hover:bg-slate-900/50 transition-colors border-b border-white/[0.02]">
                <td className="px-8 py-5 text-xs font-black text-slate-600">{idx + 1}</td>
                <td className="px-8 py-5">
                  <div className="font-black text-white uppercase text-xs tracking-tight">{s.nama}</div>
                  <div className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">Ahli Aktif</div>
                </td>
                <td className="px-8 py-5 text-xs font-mono text-slate-400">{s.noKP}</td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-slate-800 text-slate-400 text-[9px] font-black rounded-lg border border-white/[0.05]">{s.tingkatan} {s.kelas}</span>
                </td>
                <td className="px-8 py-5">
                  <button 
                    onClick={() => onPrint(s.id, 'PENDAFTARAN')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-all shadow-lg active:scale-95"
                  >
                    <Printer className="w-4 h-4" />
                    Cetak Lampiran A
                  </button>
                </td>
              </tr>
            )}
          />
        </div>
      )}

      {/* PLACEHOLDERS UNTUK LAMPIRAN LAIN (DEBUG 1-1 SETERUSNYA) */}
      {['LAMPIRAN_B', 'LAMPIRAN_D', 'LAMPIRAN_E', 'LAMPIRAN_F'].includes(currentView) && (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-900/40 rounded-[3rem] border-2 border-dashed border-white/[0.05]">
          <ClipboardList className="w-16 h-16 text-slate-700 mb-6" />
          <h3 className="text-xl font-black text-slate-500 uppercase tracking-widest">Modul {currentView.replace('_', ' ')}</h3>
          <p className="text-xs text-slate-600 font-bold uppercase mt-2">Sedia untuk debug 1-1 selepas Lampiran A selesai.</p>
        </div>
      )}
    </div>
  );
};

export default PendaftaranManager;
