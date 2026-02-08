import React from 'react';
import { FileCheck, Printer, Building2, ShieldCheck } from 'lucide-react';
import { SystemData } from '../../../types';
import { Button } from '../../CommonUI';

interface Props {
  data: SystemData;
  onPrint: (id: string | undefined, type: any) => void;
}

const ViewLampiranD: React.FC<Props> = ({ data, onPrint }) => {
  return (
    <div className="space-y-8 animate-slide-up">
       <div className="bg-slate-900/40 p-10 rounded-[3rem] border border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-900/20">
               <ShieldCheck className="text-white w-10 h-10" />
            </div>
            <div>
               <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Lampiran D</h3>
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Surat Sokongan Penubuhan (Dari Balai Bomba)</p>
            </div>
          </div>
          <Button 
            onClick={() => onPrint(undefined, 'LAMPIRAN_D')} 
            className="h-16 px-12 shadow-2xl text-[12px] bg-blue-600 hover:bg-blue-500 border-blue-500"
          >
             <Printer className="w-5 h-5" /> Cetak Surat Sokongan
          </Button>
       </div>

       <div className="bg-slate-900/40 p-10 rounded-[3rem] border border-white/[0.05]">
           <div className="flex items-center gap-4 mb-6">
              <Building2 className="w-6 h-6 text-blue-500" />
              <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">Pratonton Ringkas</h4>
           </div>
           
           <div className="bg-white text-black p-8 rounded-xl font-serif text-sm leading-relaxed max-w-2xl mx-auto shadow-inner border border-slate-200">
               <div className="text-center font-bold mb-4 border-b border-black pb-2">
                  KEPALA SURAT JABATAN / BALAI BOMBA
               </div>
               
               <p>Kepada: <strong>Pengetua, {data.settings?.schoolName || 'NAMA SEKOLAH'}</strong></p>
               <br/>
               <p className="font-bold underline">PER: SURAT SOKONGAN PENUBUHAN PASUKAN KADET BOMBA</p>
               <br/>
               <p className="text-justify">
                  Merujuk perkara di atas dimaklumkan bahawa Penubuhan Pasukan Kadet Bomba di Sekolah / Institusi tuan adalah <span className="font-bold">[SOKONG / TIDAK SOKONG]</span>.
               </p>
               <br/>
               <p>2. Pihak tuan dikehendaki melengkapkan Lampiran B, E dan F.</p>
               <br/><br/>
               <div className="mt-4">
                  <p className="font-bold">Ketua Balai</p>
                  <p>Balai Bomba dan Penyelamat</p>
               </div>
           </div>
           
           <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wide text-center">
                 Nota: Dokumen ini disediakan oleh Pihak Balai Bomba sebagai maklum balas kepada permohonan sekolah.
              </p>
           </div>
       </div>
    </div>
  );
};

export default ViewLampiranD;