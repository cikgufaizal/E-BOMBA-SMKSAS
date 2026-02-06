import React from 'react';
import { LayoutList, Printer, Save } from 'lucide-react';
import { SystemData, Student } from '../../../types';
import { Button, Table } from '../../CommonUI';

interface Props {
  data: SystemData;
  updateData: (newData: Partial<SystemData>) => void;
  onPrint: (id: string | undefined, type: any) => void;
}

const ViewLampiranF: React.FC<Props> = ({ data, updateData, onPrint }) => {
  const updateNoKeahlian = (studentId: string, val: string) => {
    const updatedStudents = data.students.map(s => 
      s.id === studentId ? { ...s, noKeahlian: val.toUpperCase() } : s
    );
    updateData({ students: updatedStudents });
  };

  return (
    <div className="space-y-6 animate-slide-up">
       <div className="bg-slate-900/40 p-10 rounded-[3rem] border border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-red-600 rounded-3xl flex items-center justify-center shadow-xl">
               <LayoutList className="text-white w-8 h-8" />
            </div>
            <div>
               <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-tight">Pendaftaran Kolektif (Lampiran F)</h3>
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Isi No. Keahlian di bawah untuk paparan automatik dalam cetakan.</p>
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
        headers={['Bil', 'Nama Penuh Calon', 'No. Kad Pengenalan', 'Input No. Keahlian (BOMBA)', 'Ting/Kelas']}
        data={data.students.sort((a,b) => a.nama.localeCompare(b.nama))}
        renderRow={(s: Student, idx: number) => (
          <tr key={s.id} className="hover:bg-slate-900/50 transition-colors border-b border-white/[0.02]">
            <td className="px-8 py-5 text-xs font-black text-slate-600">{idx + 1}</td>
            <td className="px-8 py-5 font-black text-white uppercase text-xs">{s.nama}</td>
            <td className="px-8 py-5 text-xs font-mono text-slate-400">{s.noKP}</td>
            <td className="px-8 py-3">
               <div className="relative group">
                  <input 
                    type="text"
                    placeholder="MASUKKAN NO..."
                    value={s.noKeahlian || ''}
                    onChange={(e) => updateNoKeahlian(s.id, e.target.value)}
                    className="w-full h-10 px-4 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-black uppercase text-red-500 focus:border-red-600 outline-none transition-all placeholder:text-slate-800"
                  />
                  <Save className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-800 group-focus-within:text-red-600" />
               </div>
            </td>
            <td className="px-8 py-5 text-xs font-black text-slate-500 uppercase">{s.tingkatan} {s.kelas}</td>
          </tr>
        )}
        emptyMessage="Sila daftar ahli terlebih dahulu untuk menjana Lampiran F."
      />
    </div>
  );
};

export default ViewLampiranF;