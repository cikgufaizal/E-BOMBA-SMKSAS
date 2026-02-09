import React from 'react';
import { SystemData, JawatanGuru } from '../../../types';
import SchoolHeader from '../headers/SchoolHeader';

interface Props {
  data: SystemData;
}

const PrintLampiranF: React.FC<Props> = ({ data }) => {
  const sortedStudents = [...data.students].sort((a, b) => a.nama.localeCompare(b.nama));
  
  const guruPenasihat = data.teachers.find(t => t.jawatan === JawatanGuru.Penasihat)?.nama || "";
  const pengetua = data.teachers.find(t => t.jawatan.includes('Pengetua') || t.jawatan.includes('Guru Besar'))?.nama || "";

  // Konfigurasi Baris Per Halaman (Dilaraskan untuk muat A4 dengan tepat)
  // Muka 1 ada SchoolHeader -> muat 12 pelajar
  // Muka 2 header simple -> muat 22 pelajar
  const ROWS_PAGE_1 = 12; 
  const ROWS_PAGE_REST = 22;

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
      <tr key={`empty-${i}`} className="h-[32px]">
         <td className="border border-black p-1 text-center"></td>
         <td className="border border-black p-1"></td>
         <td className="border border-black p-1"></td>
         <td className="border border-black p-1"></td>
         <td className="border border-black p-1"></td>
      </tr>
    ));
  };

  return (
    <div className="w-full font-serif text-black bg-white">
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
             {/* HEADER */}
             {isFirst ? (
               <>
                 <SchoolHeader data={data} />
                 <div className="absolute right-8 top-[35mm] font-bold text-[10pt] border border-black p-1 px-2">
                    Lampiran F
                 </div>
                 <div className="text-center font-bold mb-6 uppercase">
                    <h2 className="text-[14pt] underline">BORANG PENDAFTARAN KEAHLIAN</h2>
                    <p className="text-[11pt]">PASUKAN KADET BOMBA DAN PENYELAMAT MALAYSIA</p>
                 </div>
                 <div className="mb-4 text-[11pt]">
                    <p>Guru Penasihat: <span className="font-bold uppercase">{guruPenasihat}</span></p>
                 </div>
               </>
             ) : (
                <div className="mb-6 pt-8 border-b border-black pb-2 flex justify-between items-end">
                   <span className="font-bold italic">Sambungan Lampiran F...</span>
                   <span className="text-[9pt]">Muka Surat {idx + 1}</span>
                </div>
             )}

             {/* TABLE */}
             <div className="flex-1">
                 <table className="w-full border-collapse border border-black text-[10pt]">
                   <thead>
                     <tr className="bg-gray-100">
                       <th className="border border-black p-2 w-[50px] text-center">BIL</th>
                       <th className="border border-black p-2 text-left">NAMA PENUH (HURUF BESAR)</th>
                       <th className="border border-black p-2 w-[130px] text-center">NO. K/P</th>
                       <th className="border border-black p-2 w-[120px] text-center">NO. KEAHLIAN</th>
                       <th className="border border-black p-2 w-[100px] text-center">TINGKATAN</th>
                     </tr>
                   </thead>
                   <tbody>
                     {pageData.map((s, i) => (
                       <tr key={s.id} className="h-[32px]">
                         <td className="border border-black p-1 text-center">{startBil + i + 1}</td>
                         <td className="border border-black p-1 px-2 font-bold uppercase truncate max-w-[250px]">{s.nama}</td>
                         <td className="border border-black p-1 text-center font-mono">{s.noKP}</td>
                         <td className="border border-black p-1 text-center font-bold text-red-900">{s.noKeahlian || ''}</td>
                         <td className="border border-black p-1 text-center uppercase">{s.tingkatan} {s.kelas}</td>
                       </tr>
                     ))}
                     {renderEmptyRows((isFirst ? ROWS_PAGE_1 : ROWS_PAGE_REST) - pageData.length)}
                   </tbody>
                 </table>
             </div>

             {/* FOOTER (Hanya di muka surat terakhir) */}
             {isLast && (
               <div className="mt-4 flex justify-between items-start">
                  <div className="text-center w-[250px]">
                     <p className="font-bold uppercase text-[10pt] mb-16">Disediakan Oleh:</p>
                     <div className="border-b border-black w-full mb-1"></div>
                     <p className="font-bold uppercase text-[10pt]">( {guruPenasihat || 'GURU PENASIHAT'} )</p>
                     <p className="text-[9pt]">Guru Penasihat</p>
                  </div>
                  <div className="text-center w-[250px]">
                     <p className="font-bold uppercase text-[10pt] mb-16">Disahkan Oleh:</p>
                     <div className="border-b border-black w-full mb-1"></div>
                     <p className="font-bold uppercase text-[10pt]">( {pengetua || 'PENGETUA'} )</p>
                     <p className="text-[9pt]">Pengetua / Guru Besar</p>
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