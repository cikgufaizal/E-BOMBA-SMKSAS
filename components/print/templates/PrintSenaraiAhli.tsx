import React from 'react';
import { SystemData, JawatanGuru, Jantina } from '../../../types';
import SchoolHeader from '../headers/SchoolHeader';

interface Props {
  data: SystemData;
}

const PrintSenaraiAhli: React.FC<Props> = ({ data }) => {
  const currentYear = new Date().getFullYear();
  const sortedStudents = [...data.students].sort((a, b) => a.nama.localeCompare(b.nama));
  const guruPenasihat = data.teachers.find(t => t.jawatan === JawatanGuru.Penasihat)?.nama || '................................................';

  // Config: A4 Portrait
  // Page 1: Header Sekolah (Besar) + Title + Info + Table Header + Rows
  // Page Next: Header Ringkas + Table Header + Rows
  const ROWS_PAGE_1 = 20;
  const ROWS_PAGE_NEXT = 30;

  const pages = [];
  let remaining = [...sortedStudents];

  pages.push(remaining.splice(0, ROWS_PAGE_1));
  while (remaining.length > 0) {
    pages.push(remaining.splice(0, ROWS_PAGE_NEXT));
  }
  if (pages.length === 0) pages.push([]);

  let globalBil = 1;

  return (
    <div className="w-full text-black font-serif bg-white leading-tight">
      {pages.map((pageData, pageIdx) => {
        const isFirstPage = pageIdx === 0;
        const isLastPage = pageIdx === pages.length - 1;
        const startBil = globalBil;
        globalBil += pageData.length;

        return (
          <div 
            key={pageIdx} 
            className="w-full h-[297mm] relative bg-white p-8 pb-10 flex flex-col box-border"
            style={{ pageBreakAfter: 'always' }}
          >
            {/* HEADER SECTION */}
            {isFirstPage ? (
              <div>
                <SchoolHeader data={data} />
                <div className="text-center mb-6">
                  <h2 className="text-[12pt] font-bold uppercase underline">SENARAI NAMA AHLI PASUKAN KADET BOMBA</h2>
                  <p className="text-[10pt] font-bold uppercase mt-1">SESI PERSEKOLAHAN TAHUN {currentYear}</p>
                </div>
                <div className="flex justify-between items-end mb-2 text-[9pt] font-bold uppercase border-b border-black pb-1">
                   <div>GURU PENASIHAT: {guruPenasihat}</div>
                   <div>JUMLAH: {sortedStudents.length} ORANG</div>
                </div>
              </div>
            ) : (
              <div className="mb-4 pt-4 border-b border-black pb-1 flex justify-between items-end text-[9pt]">
                 <span className="font-bold italic">Sambungan Senarai Ahli...</span>
                 <span>Muka Surat {pageIdx + 1}</span>
              </div>
            )}

            {/* TABLE SECTION */}
            <div className="flex-1">
              <table className="w-full border-collapse border border-black text-[9pt]">
                <thead>
                  <tr className="bg-gray-100 text-center">
                    <th className="border border-black py-1 w-[30px]">BIL</th>
                    <th className="border border-black px-2 py-1 text-left">NAMA PENUH PELAJAR</th>
                    <th className="border border-black py-1 w-[100px]">NO. KP</th>
                    <th className="border border-black py-1 w-[90px]">NO. AHLI</th>
                    <th className="border border-black py-1 w-[30px]">JANTINA</th>
                    <th className="border border-black py-1 w-[80px]">KELAS</th>
                    <th className="border border-black py-1 w-[100px]">CATATAN</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((s, idx) => (
                    <tr key={s.id} className="h-[25px]">
                      <td className="border border-black text-center">{startBil + idx}</td>
                      <td className="border border-black px-2 uppercase font-bold truncate max-w-[250px]">
                        {s.nama}
                      </td>
                      <td className="border border-black text-center font-mono">{s.noKP}</td>
                      <td className="border border-black text-center font-bold text-[8pt]">{s.noKeahlian || '-'}</td>
                      <td className="border border-black text-center">{s.jantina === Jantina.Lelaki ? 'L' : 'P'}</td>
                      <td className="border border-black text-center uppercase">{s.tingkatan} {s.kelas}</td>
                      <td className="border border-black"></td>
                    </tr>
                  ))}
                  {/* Empty rows filler if needed for aesthetics, or just leave blank space */}
                </tbody>
              </table>
            </div>

            {/* FOOTER SECTION (Last Page Only) */}
            {isLastPage && (
              <div className="mt-4 flex justify-between items-start">
                 <div className="text-center w-[200px]">
                    <p className="font-bold uppercase text-[9pt] mb-12">Disediakan Oleh:</p>
                    <div className="border-b border-black w-full mb-1"></div>
                    <p className="text-[8pt] font-bold uppercase">( SETIAUSAHA )</p>
                 </div>
                 <div className="text-center w-[200px]">
                    <p className="font-bold uppercase text-[9pt] mb-12">Disahkan Oleh:</p>
                    <div className="border-b border-black w-full mb-1"></div>
                    <p className="text-[8pt] font-bold uppercase">( PENGETUA )</p>
                 </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PrintSenaraiAhli;