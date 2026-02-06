import React, { useState } from 'react';
import { Search, Info, Printer } from 'lucide-react';
import { SystemData, Student } from '../../../types';
import { Table } from '../../CommonUI';

interface Props {
  data: SystemData;
  onPrint: (id: string | undefined, type: any) => void;
}

const ViewLampiranA: React.FC<Props> = ({ data, onPrint }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = data.students.filter(s => 
    s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.noKP.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-slide-up">
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
  );
};

export default ViewLampiranA;