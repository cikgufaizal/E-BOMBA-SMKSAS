import React, { useState } from 'react';
import { 
  UserPlus, ShieldAlert, FileStack, FileText, 
  ShieldHalf, Landmark, FileCheck 
} from 'lucide-react';
import { SystemData, Student } from '../../types';
import ViewLampiranA from './views/ViewLampiranA';
import ViewLampiranB from './views/ViewLampiranB';
import ViewLampiranE from './views/ViewLampiranE';
import ViewLampiranF from './views/ViewLampiranF';
import MemberFormModal from '../common/MemberFormModal';

interface Props {
  data: SystemData;
  updateData: (newData: Partial<SystemData>) => void;
  onPrint: (id: string | undefined, type?: any) => void;
  isReadOnly?: boolean; // PROPS BARU
}

export type SubModule = 'LAMPIRAN_A' | 'LAMPIRAN_B' | 'LAMPIRAN_D' | 'LAMPIRAN_E' | 'LAMPIRAN_F';

const PendaftaranIndex: React.FC<Props> = ({ data, updateData, onPrint, isReadOnly = false }) => {
  const [currentView, setCurrentView] = useState<SubModule>('LAMPIRAN_F'); // Default ke Lampiran F untuk Bomba
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

  // Fungsi Simpan dari Modal
  const handleRegisterNew = (formData: Partial<Student>) => {
     const cleanKP = formData.noKP?.replace(/[^0-9]/g, '') || '';
     
     // Cek Duplicate
     const isDuplicate = data.students.find(s => s.noKP === cleanKP);
     if (isDuplicate) {
        alert(`Ralat: Pelajar ini sudah wujud (${isDuplicate.nama}). Sila kemaskini di Database Anggota.`);
        return;
     }

     const newStudent: Student = {
        ...(formData as Student),
        id: crypto.randomUUID(),
        nama: formData.nama?.toUpperCase().trim() || '',
        noKP: cleanKP,
        kelas: formData.kelas?.toUpperCase().trim() || '-',
        health: formData.health || {
          asma: false, lelahTB: false, kencingManis: false, darahTinggi: false,
          penglihatan: false, pendengaran: false, kronikLain: false, kecacatan: ''
        }
     };

     updateData({ students: [...data.students, newStudent] });
     // Auto switch ke Lampiran A view untuk print
     setCurrentView('LAMPIRAN_A');
     alert("Pendaftaran Berjaya! Anda kini boleh mencetak borang.");
  };

  const menuButtons = [
    { id: 'LAMPIRAN_A', label: 'Lampiran A', icon: FileText },
    { id: 'LAMPIRAN_B', label: 'Lampiran B', icon: ShieldHalf },
    { id: 'LAMPIRAN_E', label: 'Lampiran E', icon: Landmark },
    { id: 'LAMPIRAN_F', label: 'Lampiran F', icon: FileStack },
    { id: 'LAMPIRAN_D', label: 'Lampiran D', icon: FileCheck },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      {/* HEADER & NAVIGASI */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
              <ShieldAlert className="text-red-600 w-8 h-8" />
              Hub Dokumentasi {isReadOnly && <span className="text-xs bg-red-600/20 text-red-500 px-3 py-1 rounded-full not-italic tracking-widest">VIEW ONLY</span>}
            </h2>
            
            {/* Butang Daftar Disorok Jika ReadOnly (Bomba) */}
            {!isReadOnly && (
              <button 
                onClick={() => setRegisterModalOpen(true)}
                className="bg-red-600 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:scale-105 transition-all active:scale-95"
              >
                <UserPlus className="w-5 h-5" /> Daftar Ahli Baru
              </button>
            )}
        </div>

        <div className="flex flex-wrap gap-2">
          {menuButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setCurrentView(btn.id as SubModule)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                currentView === btn.id 
                ? 'bg-slate-800 text-white border border-red-500/50 shadow-lg' 
                : 'bg-slate-900/50 text-slate-500 border border-white/[0.05] hover:bg-slate-800'
              }`}
            >
              <btn.icon className="w-4 h-4" />
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT SWITCHER */}
      {currentView === 'LAMPIRAN_A' && <ViewLampiranA data={data} onPrint={onPrint} />}
      {currentView === 'LAMPIRAN_B' && <ViewLampiranB data={data} onPrint={onPrint} />}
      {currentView === 'LAMPIRAN_E' && <ViewLampiranE data={data} onPrint={onPrint} />}
      {currentView === 'LAMPIRAN_F' && <ViewLampiranF data={data} updateData={updateData} onPrint={onPrint} />}
      
      {currentView === 'LAMPIRAN_D' && (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-900/40 rounded-[3rem] border-2 border-dashed border-white/[0.05]">
          <FileCheck className="w-16 h-16 text-slate-700 mb-6" />
          <h3 className="text-xl font-black text-slate-500 uppercase tracking-widest">Modul Lampiran D</h3>
          <p className="text-xs text-slate-600 font-bold uppercase mt-2">Sedia untuk pembangunan seterusnya.</p>
        </div>
      )}

      {/* SHARED REGISTRATION MODAL */}
      <MemberFormModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setRegisterModalOpen(false)}
        onSave={handleRegisterNew}
        mode="ADD"
      />
    </div>
  );
};

export default PendaftaranIndex;