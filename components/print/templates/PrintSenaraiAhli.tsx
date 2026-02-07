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

  // KONFIGURASI PAGINATION (LANDSCAPE A4)
  const FIRST_PAGE_LIMIT = 25;
  const OTHER_PAGE_LIMIT = 30;

  const pages: any[][] = [];
  const students = [...sortedStudents];

  if (students.length > 0) {
    pages.push(students.splice(0, FIRST_PAGE_LIMIT));
  } else {
    pages.push([]); 
  }

  while (students.length > 0) {
    pages.push(students.splice(0, OTHER_PAGE_LIMIT));
  }

  return (
    <div className="w-full text-black font-serif leading-none bg-white">
      {pages.map((pageData, pageIdx) => {
        const isFirstPage = pageIdx === 0;
        const isLastPage = pageIdx === pages.length - 1;
        const startBil = isFirstPage ? 1 : FIRST_PAGE_LIMIT + ((pageIdx - 1) * OTHER_PAGE_LIMIT) + 1;

        return (
          <div 
            key={pageIdx} 
            className="print-page-landscape"
            style={{ 
              pageBreakAfter: isLastPage ? 'auto' : 'always',
              width: '100%',
              minHeight: isLastPage ? 'auto' : '190mm', // Menghampiri tinggi A4 Landscape (210mm - margin)
            }}
          >
            {/* 1. HEADER SEKOLAH & TAJUK (Halaman 1 Sahaja) */}
            {isFirstPage ? (
              <div className="mb-4">
                <SchoolHeader data={data} />
                <div className="text-center mb-4">
                  <h2 className="text-[14pt] font-bold uppercase underline tracking-widest">SENARAI NAMA PENUH KEAHLIAN PASUKAN</h2>
                  <p className="text-[11pt] font-bold uppercase mt-1">SESI PERSEKOLAHAN TAHUN {currentYear}</p>
                </div>
                <div className="flex justify-between items-end mb-2 text-[10pt] font-bold uppercase border-b-2 border-black pb-2">
                   <div className="w-2/3">GURU PENASIHAT: {guruPenasihat}</div>
                   <div className="w-1/3 text-right">JUMLAH KEAHLIAN: {sortedStudents.length} ORANG</div>
                </div>
              </div>
            ) : (
              /* Header Kecil untuk Halaman Sambungan */
              <div className="mb-4 border-b border-black pb-1 flex justify-between items-center text-[9pt] italic font-bold uppercase">
                 <div>Sambungan Senarai Ahli - Halaman {pageIdx + 1}</div>
                 <div className="flex gap-4">
                    <span>{data.settings?.schoolName || 'SMK SULTAN AHMAD SHAH'}</span>
                    <span>TAHUN {currentYear}</span>
                 </div>
              </div>
            )}

            {/* 2. JADUAL AHLI (LANDSCAPE OPTIMIZED) */}
            <table className="w-full border-collapse border border-black table-fixed">
              <thead>
                <tr className="bg-gray-100 text-[9pt] font-bold text-center">
                  <th className="border border-black py-2 w-[40px]">BIL</th>
                  <th className="border border-black px-2 py-2 text-left w-[35%]">NAMA PENUH PELAJAR</th>
                  <th className="border border-black py-2 w-[140px]">NO. KAD PENGENALAN</th>
                  <th className="border border-black py-2 w-[120px]">NO. KEAHLIAN</th>
                  <th className="border border-black py-2 w-[60px]">JANTINA</th>
                  <th className="border border-black py-2 w-[110px]">TING/KELAS</th>
                  <th className="border border-black px-2 py-2 text-left">CATATAN / PERANAN</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((s, idx) => (
                  <tr key={s.id} className="text-[9.5pt] hover:bg-gray-50">
                    <td className="border border-black py-1 text-center font-bold">{startBil + idx}</td>
                    <td className="border border-black px-2 py-1 uppercase font-semibold truncate">{s.nama}</td>
                    <td className="border border-black py-1 text-center font-mono">{s.noKP}</td>
                    <td className="border border-black py-1 text-center font-bold">{s.noKeahlian || '-'}</td>
                    <td className="border border-black py-1 text-center">{s.jantina === Jantina.Lelaki ? 'LELAKI' : 'PEREMPUAN'}</td>
                    <td className="border border-black py-1 text-center uppercase font-bold">{s.tingkatan} {s.kelas}</td>
                    <td className="border border-black px-2 py-1"></td>
                  </tr>
                ))}
                {pageData.length === 0 && (
                   <tr>
                     <td colSpan={7} className="border border-black p-10 text-center italic text-gray-500">Tiada rekod ahli dijumpai.</td>
                   </tr>
                )}
              </tbody>
            </table>

            {/* 3. PENGESAHAN (Halaman Terakhir Sahaja) */}
            {isLastPage && sortedStudents.length > 0 && (
              <div className="mt-10 flex justify-between px-16 items-start" style={{ pageBreakInside: 'avoid' }}>
                 <div className="text-center w-[250px]">
                    <p className="font-bold uppercase text-[10pt] mb-16">Disediakan Oleh:</p>
                    <div className="border-b border-black w-full mb-1"></div>
                    <p className="text-[10pt] font-bold uppercase">( SETIAUSAHA )</p>
                    <p className="text-[9pt] uppercase tracking-tighter">Pasukan Kadet Bomba & Penyelamat</p>
                 </div>
                 <div className="text-center w-[250px]">
                    <p className="font-bold uppercase text-[10pt] mb-16">Disahkan Oleh:</p>
                    <div className="border-b border-black w-full mb-1"></div>
                    <p className="text-[10pt] font-bold uppercase">( PENGETUA )</p>
                    <p className="text-[9pt] uppercase tracking-tighter">{data.settings?.schoolName || 'SMK SULTAN AHMAD SHAH'}</p>
                 </div>
              </div>
            )}

            {/* Indikator Preview (Hanya Skrin) */}
            <div className="no-print mt-6 pt-4 border-t border-gray-100 text-center">
               <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">
                  Muka Surat {pageIdx + 1} / {pages.length}
               </span>
            </div>
          </div>
        );
      })}

      <style>{`
        @media print {
          .print-page-landscape {
            margin: 0 !important;
            padding: 0 !important;
            height: 190mm !important; /* Force height to match A4 landscape minus margin */
            position: relative;
          }
          table { font-size: 9.5pt !important; }
          thead th { background-color: #f3f4f6 !important; -webkit-print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default PrintSenaraiAhli;