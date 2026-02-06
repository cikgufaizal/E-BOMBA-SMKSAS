import React, { useState } from 'react';
import { 
  UserPlus, ShieldAlert, FileStack, FileText, 
  ShieldHalf, Landmark, FileCheck 
} from 'lucide-react';
import { SystemData } from '../../types';
import ViewLampiranA from './views/ViewLampiranA';
import ViewLampiranB from './views/ViewLampiranB';
import ViewLampiranE from './views/ViewLampiranE';
import ViewLampiranF from './views/ViewLampiranF';
import BorangDaftarBaru from './views/BorangDaftarBaru';

interface Props {
  data: SystemData;
  updateData: (newData: Partial<SystemData>) => void;
  onPrint: (id: string | undefined, type?: any) => void;
}

export type SubModule = 'DAFTAR' | 'LAMPIRAN_A' | 'LAMPIRAN_B' | 'LAMPIRAN_D' | 'LAMPIRAN_E' | 'LAMPIRAN_F';

const PendaftaranIndex: React.FC<Props> = ({ data, updateData, onPrint }) => {
  const [currentView, setCurrentView] = useState<SubModule>('LAMPIRAN_A');

  const menuButtons = [
    { id: 'LAMPIRAN_A', label: 'Lampiran A', icon: FileText },
    { id: 'LAMPIRAN_B', label: 'Lampiran B', icon: ShieldHalf },
    { id: 'LAMPIRAN_E', label: 'Lampiran E', icon: Landmark },
    { id: 'LAMPIRAN_F', label: 'Lampiran F', icon: FileStack },
    { id: 'DAFTAR', label: 'Daftar Ahli', icon: UserPlus },
    { id: 'LAMPIRAN_D', label: 'Lampiran D', icon: FileCheck },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      {/* HEADER & NAVIGASI */}
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

      {/* CONTENT SWITCHER */}
      {currentView === 'LAMPIRAN_A' && <ViewLampiranA data={data} onPrint={onPrint} />}
      {currentView === 'LAMPIRAN_B' && <ViewLampiranB data={data} onPrint={onPrint} />}
      {currentView === 'LAMPIRAN_E' && <ViewLampiranE data={data} onPrint={onPrint} />}
      {currentView === 'LAMPIRAN_F' && <ViewLampiranF data={data} updateData={updateData} onPrint={onPrint} />}
      {currentView === 'DAFTAR' && <BorangDaftarBaru data={data} updateData={updateData} onSuccess={() => setCurrentView('LAMPIRAN_A')} />}
      
      {currentView === 'LAMPIRAN_D' && (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-900/40 rounded-[3rem] border-2 border-dashed border-white/[0.05]">
          <FileCheck className="w-16 h-16 text-slate-700 mb-6" />
          <h3 className="text-xl font-black text-slate-500 uppercase tracking-widest">Modul Lampiran D</h3>
          <p className="text-xs text-slate-600 font-bold uppercase mt-2">Sedia untuk pembangunan seterusnya.</p>
        </div>
      )}
    </div>
  );
};

export default PendaftaranIndex;