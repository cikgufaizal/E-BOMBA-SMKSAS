import React from 'react';
import { Landmark, Printer, Building2, GraduationCap, CheckCircle2 } from 'lucide-react';
import { SystemData, JawatanGuru } from '../../../types';
import { Button } from '../../CommonUI';

interface Props {
  data: SystemData;
  onPrint: (id: string | undefined, type: any) => void;
}

const ViewLampiranE: React.FC<Props> = ({ data, onPrint }) => {
  const pengetua = data.teachers.find(t => t.jawatan.toUpperCase().includes('PENGETUA') || t.jawatan.toUpperCase().includes('BESAR'));
  const penasihat = data.teachers.find(t => t.jawatan === JawatanGuru.Penasihat);

  return (
    <div className="space-y-8 animate-slide-up">
       <div className="bg-slate-900/40 p-10 rounded-[3rem] border border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-red-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-red-900/20">
               <Landmark className="text-white w-10 h-10" />
            </div>
            <div>
               <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Lampiran E</h3>
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Permohonan Penubuhan Pasukan Kadet Bomba</p>
            </div>
          </div>
          <Button 
            onClick={() => onPrint(undefined, 'LAMPIRAN_E')} 
            className="h-16 px-12 shadow-2xl text-[12px]"
          >
             <Printer className="w-5 h-5" /> Cetak Borang Permohonan
          </Button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900/40 p-10 rounded-[3rem] border border-white/[0.05]">
             <div className="flex items-center gap-4 mb-8">
                <Building2 className="w-6 h-6 text-red-600" />
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">Maklumat Institusi</h4>
             </div>
             <div className="space-y-6">
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Nama Sekolah</p>
                  <p className="text-sm font-black text-white uppercase">{data.settings?.schoolName || 'SILA KEMASKINI DI TETAPAN'}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Alamat Surat-Menyurat</p>
                  <p className="text-xs font-bold text-slate-300 uppercase leading-relaxed">{data.settings?.address || 'SILA KEMASKINI DI TETAPAN'}</p>
                </div>
             </div>
          </div>

          <div className="bg-slate-900/40 p-10 rounded-[3rem] border border-white/[0.05]">
             <div className="flex items-center gap-4 mb-8">
                <GraduationCap className="w-6 h-6 text-red-600" />
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">Pihak Bertanggungjawab</h4>
             </div>
             <div className="space-y-6">
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Pengetua / Guru Besar</p>
                  <p className="text-sm font-black text-white uppercase">{pengetua?.nama || 'SILA LANTIK DI MODUL GURU'}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Guru Penasihat Utama</p>
                  <p className="text-sm font-black text-white uppercase">{penasihat?.nama || 'SILA LANTIK DI MODUL GURU'}</p>
                </div>
             </div>
          </div>
       </div>

       <div className="bg-emerald-600/5 border border-emerald-600/10 p-8 rounded-[2.5rem] flex items-start gap-5">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0">
             <CheckCircle2 className="text-white w-6 h-6" />
          </div>
          <div>
             <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Status Kesediaan</p>
             <p className="text-[11px] text-slate-400 font-bold uppercase leading-relaxed">
               Sistem telah mengesan {data.students.length} orang calon anggota dan {data.teachers.length} orang guru pembimbing. Borang permohonan sedia untuk dicetak dan dihantar ke balai berhampiran.
             </p>
          </div>
       </div>
    </div>
  );
};

export default ViewLampiranE;