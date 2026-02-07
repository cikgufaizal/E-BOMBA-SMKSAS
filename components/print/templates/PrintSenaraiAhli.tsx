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

  // KONFIGURASI PAGINATION LANDSCAPE YANG TEPAT
  // Page 1: Ada Header Sekolah + Tajuk + Info Guru (Ruang Terhad) -> Had 25 orang
  // Page 2+: Tiada Header Besar -> Had 30 orang
  const PAGE_1_LIMIT = 25;
  const PAGE_NEXT_LIMIT = 30;

  const pages: any[][] = [];
  const studentPool = [...sortedStudents];

  // Agihan data ke dalam halaman
  if (studentPool.length > 0) {
    pages.push(studentPool.splice(0, PAGE_1_LIMIT));
  } else {
    pages.push([]); // Halaman kosong jika tiada data
  }

  while (studentPool.length > 0) {
    pages.push(studentPool.splice(0, PAGE_NEXT_LIMIT));
  }

  return (
    <div className="w-full text-black font-serif bg-white print:m-0">
      {pages.map((pageData, pageIdx) => {
        const isFirstPage = pageIdx === 0;
        const isLastPage = pageIdx === pages.length - 1;
        
        // Kira nombor bilangan mula
        let startBil = 1;
        if (pageIdx > 0) {
          startBil = PAGE_1_LIMIT + ((pageIdx - 1) * PAGE_NEXT_LIMIT) + 1;
        }

        return (
          <div 
            key={pageIdx} 
            className="print-page-wrapper"
            style={{ 
              pageBreakAfter: isLastPage ? 'auto' : 'always',
              minHeight: isLastPage ? 'auto' : '190mm', // Mendekati tinggi A4 Landscape (210mm - margin)
              paddingBottom: '5mm',
              position: 'relative'
            }}
          >
            {/* 1. HEADER (Hanya Page 1) */}
            {isFirstPage ? (
              <div className="mb-4">
                <SchoolHeader data={data} />
                <div className="text-center mb-4">
                  <h2 className="text-[14pt] font-bold uppercase underline tracking-[0.1em]">SENARAI NAMA PENUH KEAHLIAN PASUKAN</h2>
                  <p className="text-[11pt] font-bold uppercase mt-1 italic">SESI PERSEKOLAHAN TAHUN {currentYear}</p>
                </div>
                <div className="flex justify-between items-end mb-2 text-[10pt] font-bold uppercase border-b-2 border-black pb-2">
                   <div className="w-2/3 truncate">GURU PENASIHAT: {guruPenasihat}</div>
                   <div className="w-1/3 text-right">JUMLAH KEAHLIAN: {sortedStudents.length} ORANG</div>
                </div>
              </div>
            ) : (
              /* Header Kecil untuk Halaman Sambungan */
              <div className="mb-4 border-b border-black pb-1 flex justify-between items-center text-[9pt] italic font-bold uppercase">
                 <div className="flex gap-2">
                    <span className="not-italic font-black">SAMBUNGAN SENARAI AHLI</span>
                    <span>- HALAMAN {pageIdx + 1}</span>
                 </div>
                 <div className="flex gap-4">
                    <span>{data.settings?.schoolName || 'SMK SULTAN AHMAD SHAH'}</span>
                    <span>TAHUN {currentYear}</span>
                 </div>
              </div>
            )}

            {/* 2. JADUAL (Ketinggian Baris Mampat: py-1) */}
            <table className="w-full border-collapse border border-black table-fixed bg-white">
              <thead>
                <tr className="bg-gray-100 text-[9pt] font-bold text-center">
                  <th className="border border-black py-2 w-[40px]">BIL</th>
                  <th className="border border-black px-2 py-2 text-left w-[32%]">NAMA PENUH PELAJAR</th>
                  <th className="border border-black py-2 w-[130px]">NO. KP</th>
                  <th className="border border-black py-2 w-[110px]">NO. KEAHLIAN</th>
                  <th className="border border-black py-2 w-[50px]">JAN</th>
                  <th className="border border-black py-2 w-[100px]">TING/KELAS</th>
                  <th className="border border-black px-2 py-2 text-left">CATATAN / PERANAN</th>
                </tr>
              </thead>
              <tbody>
                {pageData.length > 0 ? pageData.map((s, idx) => (
                  <tr key={s.id} className="text-[9.5pt] leading-tight">
                    <td className="border border-black py-1 text-center font-bold">{startBil + idx}</td>
                    <td className="border border-black px-2 py-1 uppercase font-semibold overflow-hidden truncate">{s.nama}</td>
                    <td className="border border-black py-1 text-center font-mono">{s.noKP}</td>
                    <td className="border border-black py-1 text-center font-bold">{s.noKeahlian || '-'}</td>
                    <td className="border border-black py-1 text-center">{s.jantina === Jantina.Lelaki ? 'L' : 'P'}</td>
                    <td className="border border-black py-1 text-center uppercase font-bold text-[9pt]">{s.tingkatan} {s.kelas}</td>
                    <td className="border border-black px-2 py-1"></td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="border border-black p-12 text-center italic text-gray-500">Tiada rekod ahli dijumpai untuk paparan ini.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* 3. PENGESAHAN (Hanya pada Muka Surat TERAKHIR) */}
            {isLastPage && sortedStudents.length > 0 && (
              <div className="mt-8 flex justify-between px-16 items-start" style={{ pageBreakInside: 'avoid' }}>
                 <div className="text-center w-[250px]">
                    <p className="font-bold uppercase text-[10pt] mb-16">Disediakan Oleh:</p>
                    <div className="border-b border-black w-full mb-1"></div>
                    <p className="text-[10pt] font-bold uppercase leading-none">( SETIAUSAHA )</p>
                    <p className="text-[8.5pt] uppercase mt-1">Kadet Bomba & Penyelamat</p>
                 </div>
                 <div className="text-center w-[250px]">
                    <p className="font-bold uppercase text-[10pt] mb-16">Disahkan Oleh:</p>
                    <div className="border-b border-black w-full mb-1"></div>
                    <p className="text-[10pt] font-bold uppercase leading-none">( PENGETUA )</p>
                    <p className="text-[8.5pt] uppercase mt-1 truncate">{data.settings?.schoolName || 'SMK SULTAN AHMAD SHAH'}</p>
                 </div>
              </div>
            )}

            {/* Footer Penunjuk Halaman (Hanya dipaparkan di skrin preview) */}
            <div className="no-print mt-6 pt-4 border-t border-gray-100 flex justify-center items-center gap-4">
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
                  MUKA SURAT {pageIdx + 1} / {pages.length}
               </span>
            </div>
          </div>
        );
      })}

      <style>{`
        @media print {
          .print-page-wrapper {
            margin: 0 !important;
            padding: 0 !important;
            height: 190mm !important; /* Force exact height for landscape A4 minus some margins */
            position: relative;
            overflow: hidden;
          }
          table { font-size: 9.5pt !important; line-height: 1 !important; border-width: 1pt !important; }
          thead th { 
            background-color: #f3f4f6 !important; 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact; 
          }
          tr { height: 28px !important; } /* Hardcode height to ensure logic fits */
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default PrintSenaraiAhli;