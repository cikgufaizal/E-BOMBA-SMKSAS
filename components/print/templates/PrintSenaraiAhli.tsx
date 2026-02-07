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

  // KONFIGURASI PAGINATION LANDSCAPE (RECALIBRATED)
  // Page 1: 15 baris (Ruang header sekolah besar)
  // Page 2+: 20 baris (Ruang header sambungan kecil)
  const PAGE_1_LIMIT = 15; 
  const PAGE_NEXT_LIMIT = 20;

  const pages: any[][] = [];
  const studentPool = [...sortedStudents];

  if (studentPool.length > 0) {
    pages.push(studentPool.splice(0, PAGE_1_LIMIT));
  } else {
    pages.push([]);
  }

  while (studentPool.length > 0) {
    pages.push(studentPool.splice(0, PAGE_NEXT_LIMIT));
  }

  // Penomboran Progresif
  let globalBil = 1;

  return (
    <div className="w-full text-black font-serif bg-white print:m-0">
      {pages.map((pageData, pageIdx) => {
        const isFirstPage = pageIdx === 0;
        const isLastPage = pageIdx === pages.length - 1;
        const startBil = globalBil;
        globalBil += pageData.length;

        return (
          <div 
            key={pageIdx} 
            className="print-page-container"
            style={{ 
              pageBreakAfter: isLastPage ? 'auto' : 'always',
              position: 'relative',
              paddingBottom: '20px',
              backgroundColor: 'white'
            }}
          >
            {/* 1. HEADER LOGIC */}
            {isFirstPage ? (
              <div className="mb-4">
                <SchoolHeader data={data} />
                <div className="text-center mb-4">
                  <h2 className="text-[14pt] font-bold uppercase underline tracking-[0.05em]">SENARAI NAMA AHLI PASUKAN KADET BOMBA</h2>
                  <p className="text-[11pt] font-bold uppercase mt-1">SESI PERSEKOLAHAN TAHUN {currentYear}</p>
                </div>
                <div className="flex justify-between items-end mb-2 text-[10pt] font-bold uppercase border-b-2 border-black pb-2">
                   <div className="w-2/3 truncate">GURU PENASIHAT: {guruPenasihat}</div>
                   <div className="w-1/3 text-right">JUMLAH: {sortedStudents.length} AHLI</div>
                </div>
              </div>
            ) : (
              <div className="mb-4 border-b border-black pb-2 flex justify-between items-center text-[9pt] italic font-bold uppercase">
                 <div className="flex gap-2">
                    <span className="not-italic font-black text-red-700">SAMBUNGAN SENARAI AHLI</span>
                    <span>- HALAMAN {pageIdx + 1}</span>
                 </div>
                 <div className="flex gap-4">
                    <span>{data.settings?.schoolName || 'SMK SULTAN AHMAD SHAH'}</span>
                    <span>TAHUN {currentYear}</span>
                 </div>
              </div>
            )}

            {/* 2. JADUAL (Table Layout Fixed untuk elak lebar lari) */}
            <table className="w-full border-collapse border-[1.2pt] border-black table-fixed bg-white">
              <thead>
                <tr className="bg-gray-100 text-[8.5pt] font-bold text-center">
                  <th className="border border-black py-2 w-[40px]">BIL</th>
                  <th className="border border-black px-2 py-2 text-left w-[38%]">NAMA PENUH PELAJAR (MENGIKUT KAD PENGENALAN)</th>
                  <th className="border border-black py-2 w-[120px]">NO. KP</th>
                  <th className="border border-black py-2 w-[100px]">NO. KEAHLIAN</th>
                  <th className="border border-black py-2 w-[45px]">JAN</th>
                  <th className="border border-black py-2 w-[90px]">TING/KELAS</th>
                  <th className="border border-black px-2 py-2 text-left">CATATAN / TANDA TANGAN</th>
                </tr>
              </thead>
              <tbody>
                {pageData.length > 0 ? pageData.map((s, idx) => (
                  <tr key={s.id} className="text-[9pt] h-[32px]">
                    <td className="border border-black py-1 text-center font-bold">{startBil + idx}</td>
                    <td className="border border-black px-2 py-1 uppercase font-bold whitespace-normal break-words leading-tight">
                      {s.nama}
                    </td>
                    <td className="border border-black py-1 text-center font-mono">{s.noKP}</td>
                    <td className="border border-black py-1 text-center font-bold">{s.noKeahlian || '-'}</td>
                    <td className="border border-black py-1 text-center">{s.jantina === Jantina.Lelaki ? 'L' : 'P'}</td>
                    <td className="border border-black py-1 text-center uppercase font-bold text-[8.5pt]">{s.tingkatan} {s.kelas}</td>
                    <td className="border border-black px-2 py-1"></td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="border border-black p-10 text-center italic">Tiada rekod data.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* 3. PENGESAHAN (Hanya pada Muka Surat Terakhir) */}
            {isLastPage && sortedStudents.length > 0 && (
              <div className="mt-8 flex justify-between px-10 items-start" style={{ pageBreakInside: 'avoid' }}>
                 <div className="text-center w-[250px]">
                    <p className="font-bold uppercase text-[9pt] mb-14">Disediakan Oleh:</p>
                    <div className="border-b-[1pt] border-black w-full mb-1"></div>
                    <p className="text-[9pt] font-bold uppercase leading-none">( SETIAUSAHA )</p>
                    <p className="text-[8pt] uppercase mt-1">Unit Kadet Bomba & Penyelamat</p>
                 </div>
                 <div className="text-center w-[250px]">
                    <p className="font-bold uppercase text-[9pt] mb-14">Disahkan Oleh:</p>
                    <div className="border-b-[1pt] border-black w-full mb-1"></div>
                    <p className="text-[9pt] font-bold uppercase leading-none">( PENGETUA / GURU BESAR )</p>
                    <p className="text-[8pt] uppercase mt-1 truncate">{data.settings?.schoolName || 'SMK SULTAN AHMAD SHAH'}</p>
                 </div>
              </div>
            )}
          </div>
        );
      })}

      <style>{`
        @media print {
          .print-page-container {
            display: block !important;
            height: auto !important;
            min-height: 0 !important;
            margin-bottom: 0 !important;
            page-break-after: always !important;
            break-after: always !important;
          }
          
          /* Tutup pengulangan thead automatik browser untuk elak overlap dengan header manual kita */
          thead { display: table-row-group !important; }
          
          table { 
            border-collapse: collapse !important; 
            width: 100% !important;
            table-layout: fixed !important;
          }
          
          tr { 
            page-break-inside: avoid !important;
            height: auto !important;
          }
          
          body { 
            background: white !important; 
          }
        }
      `}</style>
    </div>
  );
};

export default PrintSenaraiAhli;