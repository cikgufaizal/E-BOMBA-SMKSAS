import React from 'react';
import { SystemData, JawatanGuru } from '../../../types';
import BombaHeader from '../headers/BombaHeader';

interface Props {
  data: SystemData;
}

const PrintLampiranF: React.FC<Props> = ({ data }) => {
  const sortedStudents = [...data.students].sort((a, b) => a.nama.localeCompare(b.nama));
  
  const guruPenasihat = data.teachers.find(t => t.jawatan === JawatanGuru.Penasihat)?.nama || "";
  const pengetua = data.teachers.find(t => t.jawatan.includes('Pengetua') || t.jawatan.includes('Guru Besar'))?.nama || "";

  // Konfigurasi Baris Per Halaman
  const ROWS_PAGE_1 = 20; 
  const ROWS_PAGE_REST = 35;

  const pages = [];
  let remaining = [...sortedStudents];
  
  pages.push(remaining.splice(0, ROWS_PAGE_1));
  while (remaining.length > 0) {
    pages.push(remaining.splice(0, ROWS_PAGE_REST));
  }
  if (pages.length === 0) pages.push([]);

  // Helper untuk baris kosong
  const renderEmptyRows = (count: number) => {
    return Array.from({ length: Math.max(0, count) }).map((_, i) => (
      <tr key={`empty-${i}`} className="h-[25px]">
         <td className="border border-black p-1 text-center"></td>
         <td className="border border-black p-1"></td>
         <td className="border border-black p-1"></td>
         <td className="border border-black p-1"></td>
         <td className="border border-black p-1"></td>
      </tr>
    ));
  };

  return (
    <div className="w-full font-serif text-black bg-white leading-[1.15]">
      {pages.map((pageData, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === pages.length - 1;
        
        let startBil = 0;
        for (let i = 0; i < idx; i++) startBil += (i === 0 ? ROWS_PAGE_1 : ROWS_PAGE_REST);

        return (
          <div 
            key={idx} 
            className="relative w-full h-[297mm] bg-white p-8 pb-10 flex flex-col box-border"
            style={{ pageBreakAfter: 'always', pageBreakInside: 'avoid' }}
          >
             {/* HEADER (Hanya Muka Surat Pertama ada Header Bomba) */}
             {isFirst ? (
               <>
                 <BombaHeader data={data} />
                 
                 {/* Label Lampiran */}
                 <div className="w-full flex justify-end mt-2 mb-1">
                    <div className="font-bold text-[9pt] border border-black p-1 px-3">
                       Lampiran F
                    </div>
                 </div>

                 <div className="text-center font-bold mb-4 uppercase">
                    <h2 className="text-[12pt] underline">BORANG PENDAFTARAN KEAHLIAN (KOLEKTIF)</h2>
                    <p className="text-[10pt]">PASUKAN KADET BOMBA DAN PENYELAMAT MALAYSIA</p>
                 </div>
                 <div className="mb-2 text-[10pt] font-bold border-b border-black pb-1">
                    MAKLUMAT ANGGOTA &nbsp;&nbsp;|&nbsp;&nbsp; GURU PENASIHAT: <span className="uppercase">{guruPenasihat}</span>
                 </div>
               </>
             ) : (
                <div className="mb-4 pt-4 border-b border-black pb-1 flex justify-between items-end">
                   <span className="font-bold italic text-[9pt]">Sambungan Lampiran F...</span>
                   <span className="text-[9pt]">Muka Surat {idx + 1}</span>
                </div>
             )}

             {/* TABLE */}
             <div className="flex-1">
                 <table className="w-full border-collapse border border-black text-[9pt]">
                   <thead>
                     <tr className="bg-gray-100 h-[30px]">
                       <th className="border border-black p-1 w-[40px] text-center">BIL</th>
                       <th className="border border-black p-1 px-2 text-left">NAMA PENUH (HURUF BESAR)</th>
                       <th className="border border-black p-1 w-[110px] text-center">NO. K/P</th>
                       <th className="border border-black p-1 w-[120px] text-center">NO. KEAHLIAN</th>
                       <th className="border border-black p-1 w-[80px] text-center">TINGKATAN</th>
                     </tr>
                   </thead>
                   <tbody>
                     {pageData.map((s, i) => (
                       <tr key={s.id} className="h-[25px]">
                         <td className="border border-black p-1 text-center">{startBil + i + 1}</td>
                         <td className="border border-black p-1 px-2 font-bold uppercase truncate max-w-[350px]">{s.nama}</td>
                         <td className="border border-black p-1 text-center font-mono">{s.noKP}</td>
                         <td className="border border-black p-1 text-center font-bold text-red-900">{s.noKeahlian || ''}</td>
                         <td className="border border-black p-1 text-center uppercase">{s.tingkatan} {s.kelas}</td>
                       </tr>
                     ))}
                     {/* Render row kosong jika perlu memenuhi kertas */}
                     {renderEmptyRows((isFirst ? ROWS_PAGE_1 : ROWS_PAGE_REST) - pageData.length)}
                   </tbody>
                 </table>
             </div>

             {/* FOOTER (Hanya di muka surat terakhir) */}
             {isLast && (
               <div className="mt-8 flex justify-between items-start">
                  <div className="text-center w-[250px]">
                     <p className="font-bold uppercase text-[9pt] mb-16">Disediakan Oleh:</p>
                     <div className="border-b border-black w-full mb-1"></div>
                     <p className="font-bold uppercase text-[9pt]">( {guruPenasihat || 'GURU PENASIHAT'} )</p>
                     <p className="text-[8pt]">Guru Penasihat</p>
                  </div>
                  <div className="text-center w-[250px]">
                     <p className="font-bold uppercase text-[9pt] mb-16">Disahkan Oleh:</p>
                     <div className="border-b border-black w-full mb-1"></div>
                     <p className="font-bold uppercase text-[9pt]">( {pengetua || 'PENGETUA'} )</p>
                     <p className="text-[8pt]">Pengetua / Guru Besar</p>
                  </div>
               </div>
             )}
          </div>
        );
      })}
    </div>
  );
};

export default PrintLampiranF;