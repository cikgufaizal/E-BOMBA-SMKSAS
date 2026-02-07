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

  // KONFIGURASI PAGINATION LANDSCAPE DENGAN BUFFER (BIJAKSANA)
  // Kita kurangkan had sedikit (buffer) untuk memberi ruang jika ada nama yang wrap ke 2 baris
  const PAGE_1_LIMIT = 22; 
  const PAGE_NEXT_LIMIT = 27;

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

  return (
    <div className="w-full text-black font-serif bg-white print:m-0">
      {pages.map((pageData, pageIdx) => {
        const isFirstPage = pageIdx === 0;
        const isLastPage = pageIdx === pages.length - 1;
        
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
              minHeight: isLastPage ? 'auto' : '190mm',
              paddingBottom: '10mm',
              position: 'relative'
            }}
          >
            {/* 1. HEADER SEKOLAH */}
            {isFirstPage ? (
              <div className="mb-4">
                <SchoolHeader data={data} />
                <div className="text-center mb-4">
                  <h2 className="text-[14pt] font-bold uppercase underline tracking-[0.05em]">SENARAI NAMA AHLI PASUKAN KADET BOMBA</h2>
                  <p className="text-[11pt] font-bold uppercase mt-1">SESI PERSEKOLAHAN TAHUN {currentYear}</p>
                </div>
                <div className="flex justify-between items-end mb-2 text-[10pt] font-bold uppercase border-b-2 border-black pb-2">
                   <div className="w-2/3 truncate">GURU PENASIHAT: {guruPenasihat}</div>
                   <div className="w-1/3 text-right">JUMLAH: {sortedStudents.length} ORANG</div>
                </div>
              </div>
            ) : (
              <div className="mb-4 border-b border-black pb-1 flex justify-between items-center text-[9pt] italic font-bold uppercase">
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

            {/* 2. JADUAL (Lebar Lajur Dilaraskan) */}
            <table className="w-full border-collapse border-[1.5pt] border-black table-fixed bg-white">
              <thead>
                <tr className="bg-gray-100 text-[9pt] font-bold text-center">
                  <th className="border border-black py-2 w-[40px]">BIL</th>
                  <th className="border border-black px-2 py-2 text-left w-[38%]">NAMA PENUH PELAJAR (MENGIKUT KAD PENGENALAN)</th>
                  <th className="border border-black py-2 w-[120px]">NO. KP</th>
                  <th className="border border-black py-2 w-[110px]">NO. KEAHLIAN</th>
                  <th className="border border-black py-2 w-[45px]">JAN</th>
                  <th className="border border-black py-2 w-[90px]">TING/KELAS</th>
                  <th className="border border-black px-2 py-2 text-left">CATATAN / TANDA TANGAN</th>
                </tr>
              </thead>
              <tbody>
                {pageData.length > 0 ? pageData.map((s, idx) => (
                  <tr key={s.id} className="text-[9.5pt]">
                    <td className="border border-black py-1.5 text-center font-bold">{startBil + idx}</td>
                    {/* BIJAKSANA: Menggunakan leading-tight dan break-words supaya nama panjang tak terpotong */}
                    <td className="border border-black px-2 py-1.5 uppercase font-bold whitespace-normal break-words leading-[1.15]">
                      {s.nama}
                    </td>
                    <td className="border border-black py-1.5 text-center font-mono">{s.noKP}</td>
                    <td className="border border-black py-1.5 text-center font-bold">{s.noKeahlian || '-'}</td>
                    <td className="border border-black py-1.5 text-center">{s.jantina === Jantina.Lelaki ? 'L' : 'P'}</td>
                    <td className="border border-black py-1.5 text-center uppercase font-bold text-[9pt]">{s.tingkatan} {s.kelas}</td>
                    <td className="border border-black px-2 py-1.5"></td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="border border-black p-12 text-center italic">Tiada rekod ahli.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* 3. PENGESAHAN (Hanya pada Muka Surat Terakhir) */}
            {isLastPage && sortedStudents.length > 0 && (
              <div className="mt-10 flex justify-between px-10 items-start" style={{ pageBreakInside: 'avoid' }}>
                 <div className="text-center w-[250px]">
                    <p className="font-bold uppercase text-[10pt] mb-16">Disediakan Oleh:</p>
                    <div className="border-b-[1.5pt] border-black w-full mb-1"></div>
                    <p className="text-[10pt] font-bold uppercase leading-none">( SETIAUSAHA )</p>
                    <p className="text-[8.5pt] uppercase mt-1">Pasukan Kadet Bomba & Penyelamat</p>
                 </div>
                 <div className="text-center w-[250px]">
                    <p className="font-bold uppercase text-[10pt] mb-16">Disahkan Oleh:</p>
                    <div className="border-b-[1.5pt] border-black w-full mb-1"></div>
                    <p className="text-[10pt] font-bold uppercase leading-none">( PENGETUA / GURU BESAR )</p>
                    <p className="text-[8.5pt] uppercase mt-1 truncate">{data.settings?.schoolName || 'SMK SULTAN AHMAD SHAH'}</p>
                 </div>
              </div>
            )}
          </div>
        );
      })}

      <style>{`
        @media print {
          .print-page-wrapper {
            margin: 0 !important;
            padding: 0 !important;
            height: 190mm !important; 
            position: relative;
          }
          table { font-size: 9.5pt !important; border-width: 1.5pt !important; }
          thead th { 
            background-color: #f3f4f6 !important; 
            -webkit-print-color-adjust: exact; 
          }
          /* Kita tukar ke min-height supaya baris boleh membesar jika nama panjang wrap */
          tr { min-height: 28px !important; } 
        }
      `}</style>
    </div>
  );
};

export default PrintSenaraiAhli;