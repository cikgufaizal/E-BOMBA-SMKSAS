
import React, { useState } from 'react';
import { 
  UserPlus, ShieldAlert, Heart, Phone, Printer, 
  FileStack, FileText, Users, FileCheck, Search,
  ClipboardList, CheckCircle2, Info, LayoutList
} from 'lucide-react';
import { SystemData, Student, Jantina, Kaum, HealthStatus } from '../types';
import { FormCard, Input, Select, Button, Table } from './CommonUI';
import { FORMS } from '../constants';

interface Props {
  data: SystemData;
  updateData: (newData: Partial<SystemData>) => void;
  onPrint: (id: string | undefined, type?: any) => void;
}

type SubModule = 'DAFTAR' | 'LAMPIRAN_A' | 'LAMPIRAN_B' | 'LAMPIRAN_D' | 'LAMPIRAN_E' | 'LAMPIRAN_F';

const PendaftaranManager: React.FC<Props> = ({ data, updateData, onPrint }) => {
  const [currentView, setCurrentView] = useState<SubModule>('LAMPIRAN_A');
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

  const [successMessage, setSuccessMessage] = useState(false);

  const handleRegister = () => {
    if (!formData.nama || !formData.noKP) {
        alert("Sila lengkapkan Nama dan No KP!");
        return;
    }

    const cleanKP = formData.noKP.replace(/[^0-9]/g, '');
    const newStudent: Student = {
      id: crypto.randomUUID(),
      nama: formData.nama.toUpperCase().trim(),
      noKP: cleanKP,
      noKeahlian: '', // Sentiasa kosong untuk pendaftaran baru mengikut arahan
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
        setCurrentView('LAMPIRAN_A');
    }, 1500);
  };

  const menuButtons = [
    { id: 'LAMPIRAN_A', label: 'Lampiran A', icon: FileText },
    { id: 'LAMPIRAN_F', label: 'Lampiran F', icon: FileStack },
    { id: 'DAFTAR', label: 'Daftar Ahli', icon: UserPlus },
    { id: 'LAMPIRAN_B', label: 'Lampiran B', icon: Heart },
    { id: 'LAMPIRAN_D', label: 'Lampiran D', icon: FileCheck },
    { id: 'LAMPIRAN_E', label: 'Lampiran E', icon: Users },
  ];

  const filteredStudents = data.students.filter(s => 
    s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.noKP.includes(searchTerm)
  );

  return (
    <div className="animate-in fade-in duration-700">
      {/* NAVIGASI HUB */}
      <div className="mb-10">
        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-6 flex items-center gap-4">
          <ShieldAlert className="text-red-600 w-8 h-8" />
          Hub Pengurusan Dokumentasi
        </h2>
        <div className="flex flex-wrap gap-2">
          {menuButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setCurrentView(btn.id as SubModule)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                currentView === btn.id 
                ? 'bg-red-600 text-white shadow-xl scale-105' 
                : 'bg-slate-900/50 text-slate-500 border border-white/[0.05] hover:bg-slate-800'
              }`}
            >
              <btn.icon className="w-4 h-4" />
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW: LAMPIRAN A (TABEL NAMA PELAJAR & BUTANG PRINT) */}
      {currentView === 'LAMPIRAN_A' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
             <div className="lg:col-span-2 bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/[0.05] flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="font-black text-white uppercase text-xl italic tracking-tighter">Senarai Semakan Kesihatan (Lampiran A)</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Klik butang cetak untuk menjana Borang A bagi setiap pelajar.</p>
                </div>
                <div className="relative group w-full md:w-80">
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
             <div className="bg-red-600/10 border border-red-600/20 p-8 rounded-[2.5rem] flex items-center gap-4">
                <Info className="w-8 h-8 text-red-600 shrink-0" />
                <p className="text-[9px] font-black text-slate-300 uppercase leading-relaxed tracking-wider">
                  Borang A mengandungi maklumat peribadi dan pengakuan kesihatan anggota.
                </p>
             </div>
          </div>

          <Table
            headers={['Bil', 'Nama Ahli', 'No. KP', 'Ting/Kelas', 'Tindakan Cetak']}
            data={filteredStudents.sort((a,b) => a.nama.localeCompare(b.nama))}
            renderRow={(s: Student, idx: number) => (
              <tr key={s.id} className="hover:bg-slate-900/50 transition-colors border-b border-white/[0.02] group">
                <td className="px-8 py-6 text-xs font-black text-slate-600">{idx + 1}</td>
                <td className="px-8 py-6">
                  <div className="font-black text-white uppercase text-xs tracking-tight group-hover:text-red-500 transition-colors">{s.nama}</div>
                </td>
                <td className="px-8 py-6 text-xs font-mono text-slate-400">{s.noKP}</td>
                <td className="px-8 py-6 uppercase font-black text-[10px] text-slate-500">{s.tingkatan} {s.kelas}</td>
                <td className="px-8 py-6">
                  <button 
                    onClick={() => onPrint(s.id, 'PENDAFTARAN')}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-all shadow-lg active:scale-95"
                  >
                    <Printer className="w-4 h-4" />
                    Print Lampiran A
                  </button>
                </td>
              </tr>
            )}
          />
        </div>
      )}

      {/* VIEW: LAMPIRAN F (SENARAI KOLEKTIF) */}
      {currentView === 'LAMPIRAN_F' && (
        <div className="space-y-6">
           <div className="bg-slate-900/40 p-10 rounded-[3rem] border border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-red-600 rounded-3xl flex items-center justify-center shadow-xl">
                   <LayoutList className="text-white w-8 h-8" />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Pendaftaran Kolektif (Lampiran F)</h3>
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Senarai induk anggota untuk pengesahan Jabatan Bomba.</p>
                </div>
              </div>
              <Button 
                onClick={() => onPrint(undefined, 'LAMPIRAN_F')} 
                className="h-16 px-10 shadow-2xl"
              >
                 <Printer className="w-5 h-5" /> Cetak Lampiran F (Kolektif)
              </Button>
           </div>

           <Table
            headers={['Bil', 'Nama Penuh Calon', 'No. Kad Pengenalan', 'No. Keahlian (BOMBA)', 'Ting/Kelas']}
            data={data.students.sort((a,b) => a.nama.localeCompare(b.nama))}
            renderRow={(s: Student, idx: number) => (
              <tr key={s.id} className="hover:bg-slate-900/50 transition-colors border-b border-white/[0.02]">
                <td className="px-8 py-5 text-xs font-black text-slate-600">{idx + 1}</td>
                <td className="px-8 py-5 font-black text-white uppercase text-xs">{s.nama}</td>
                <td className="px-8 py-5 text-xs font-mono text-slate-400">{s.noKP}</td>
                <td className="px-8 py-5">
                   <div className="w-24 h-8 bg-slate-950/50 border border-dashed border-slate-800 rounded flex items-center justify-center">
                      <span className="text-[8px] text-slate-700 font-black italic uppercase">Bomba Only</span>
                   </div>
                </td>
                <td className="px-8 py-5 text-xs font-black text-slate-500 uppercase">{s.tingkatan} {s.kelas}</td>
              </tr>
            )}
            emptyMessage="Sila daftar ahli terlebih dahulu untuk menjana Lampiran F."
          />
        </div>
      )}

      {/* VIEW: DAFTAR AHLI */}
      {currentView === 'DAFTAR' && (
        <div className="max-w-4xl mx-auto">
          <FormCard title="Pendaftaran Ahli Baru (Lampiran A & F)">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Nama Penuh" value={formData.nama} onChange={(e: any) => setFormData({...formData, nama: e.target.value})} />
                <Input label="No. KP" placeholder="000000-00-0000" value={formData.noKP} onChange={(e: any) => setFormData({...formData, noKP: e.target.value})} />
                <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Input label="Umur" type="number" value={formData.umur} onChange={(e: any) => setFormData({...formData, umur: e.target.value})} />
                  <Select label="Tingkatan" value={formData.tingkatan} onChange={(e: any) => setFormData({...formData, tingkatan: e.target.value})} options={FORMS.map(f => ({ value: f, label: `TINGKATAN ${f}` }))} />
                  <Input label="Kelas" value={formData.kelas} onChange={(e: any) => setFormData({...formData, kelas: e.target.value})} />
                  <Select label="Tahap" value={formData.tahap} onChange={(e: any) => setFormData({...formData, tahap: e.target.value})} options={['1','2','3'].map(t => ({ value: t, label: `TAHAP ${t}` }))} />
                </div>
                <div className="md:col-span-2 pt-6">
                   <Button onClick={handleRegister} className="w-full h-16 text-xs shadow-2xl">Daftar & Masuk Senarai Lampiran</Button>
                </div>
             </div>
          </FormCard>
        </div>
      )}

      {/* VIEW PLACEHOLDERS */}
      {['LAMPIRAN_B', 'LAMPIRAN_D', 'LAMPIRAN_E'].includes(currentView) && (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-900/40 rounded-[3rem] border-2 border-dashed border-white/[0.05]">
          <ClipboardList className="w-16 h-16 text-slate-700 mb-6" />
          <h3 className="text-xl font-black text-slate-500 uppercase tracking-widest">Modul {currentView.replace('_', ' ')}</h3>
          <p className="text-xs text-slate-600 font-bold uppercase mt-2">Sedia untuk debug 1-1 seterusnya.</p>
        </div>
      )}
    </div>
  );
};

export default PendaftaranManager;
