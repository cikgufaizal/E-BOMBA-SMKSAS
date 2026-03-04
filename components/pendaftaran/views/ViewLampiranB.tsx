import React, { useState } from 'react';
import { Search, ShieldHalf, Printer } from 'lucide-react';
import { SystemData, Student } from '../../../types';
import { Table } from '../../CommonUI';

interface Props {
  data: SystemData;
  onPrint: (id: string | undefined, type: any) => void;
}

const ViewLampiranB: React.FC<Props> = ({ data, onPrint }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = data.students.filter(s => 
    s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.noKP.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="bg-slate-900/40 p-10 rounded-[3rem] border border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-red-600 rounded-3xl flex items-center justify-center shadow-xl">
             <ShieldHalf className="text-white w-8 h-8" />
          </div>
          <div>
             <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Borang Pelepasan (Lampiran B)</h3>
             <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Borang kebenaran waris dan pelepasan tanggungjawab.</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => onPrint('ALL', 'LAMPIRAN_B')}
            className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl active:scale-95"
          >
            <Printer className="w-5 h-5" />
            Print Semua ({data.students.length})
          </button>

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
      </div>

      <Table
        headers={['Bil', 'Nama Ahli', 'No. KP', 'Waris', 'Tindakan Cetak']}
        data={filteredStudents.sort((a,b) => a.nama.localeCompare(b.nama))}
        renderRow={(s: Student, idx: number) => (
          <tr key={s.id} className="hover:bg-slate-900/50 transition-colors border-b border-white/[0.02] group">
            <td className="px-8 py-6 text-xs font-black text-slate-600">{idx + 1}</td>
            <td className="px-8 py-6">
              <div className="font-black text-white uppercase text-xs tracking-tight group-hover:text-red-500 transition-colors">{s.nama}</div>
              <div className="text-[9px] text-slate-500 font-bold uppercase">{s.tingkatan} {s.kelas}</div>
            </td>
            <td className="px-8 py-6 text-xs font-mono text-slate-400">{s.noKP}</td>
            <td className="px-8 py-6">
               <div className="text-[10px] font-black text-slate-300 uppercase">{s.namaWaris || '-'}</div>
               <div className="text-[9px] text-slate-600 font-bold">{s.telefonWaris || '-'}</div>
            </td>
            <td className="px-8 py-6">
              <button 
                onClick={() => onPrint(s.id, 'LAMPIRAN_B')}
                className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 transition-all shadow-lg active:scale-95"
              >
                <Printer className="w-4 h-4" />
                Print Lampiran B
              </button>
            </td>
          </tr>
        )}
      />
    </div>
  );
};

export default ViewLampiranB;