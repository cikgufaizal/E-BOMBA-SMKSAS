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

  // Konfigurasi Had Halaman (Pagination)
  const FIRST_PAGE_LIMIT = 25;
  const SUBSEQUENT_PAGE_LIMIT = 30;

  // Pecahkan data kepada chunk mengikut had halaman
  const pages: any[][] = [];
  const studentCopy = [...sortedStudents];

  // Proses Halaman 1 (25 orang)
  if (studentCopy.length > 0) {
    pages.push(studentCopy.splice(0, FIRST_PAGE_LIMIT));
  } else {
    pages.push([]); // Pastikan ada sekurang-kurangnya satu halaman kosong jika tiada data
  }

  // Proses Halaman Seterusnya (30 orang setiap satu)
  while (studentCopy.length > 0) {
    pages.push(studentCopy.splice(0, SUBSEQUENT_PAGE_LIMIT));
  }

  return (
    <div className="w-full text-black font-serif leading-tight bg-white">
      {pages.map((pageStudents, pageIdx) => {
        const isFirstPage = pageIdx === 0;
        const isLastPage = pageIdx === pages.length - 1;
        
        // Kira Bilangan (Bil) permulaan untuk halaman semasa
        let startBil = 1;
        if (pageIdx > 0) {
          startBil = FIRST_PAGE_LIMIT + ((pageIdx - 1) * SUBSEQUENT_PAGE_LIMIT) + 1;
        }

        return (
          <div 
            key={pageIdx} 
            className="w-full print-page-container" 
            style={{ 
              pageBreakAfter: isLastPage ? 'auto' : 'always',
              minHeight: isLastPage ? 'auto' : '290mm', // Menghampiri saiz A4
              paddingBottom: '5mm'
            }}
          >
            {/* HEADER SEKOLAH - HANYA PADA HALAMAN PERTAMA */}
            {isFirstPage ? (
              <div className="mb-6">
                <SchoolHeader data={data} />
                <div className="text-center mb-6">
                  <h2 className="text-[14pt] font-bold uppercase underline tracking-wider">SENARAI NAMA PENUH KEAHLIAN PASUKAN</h2>
                  <p className="text-[11pt] font-bold uppercase mt-1">SESI PERSEKOLAHAN TAHUN {currentYear}</p>
                </div>
                <div className="flex justify-between items-end mb-2 text-[10pt] font-bold uppercase border-b-2 border-black pb-2">
                   <div className="w-2/3">GURU PENASIHAT: {guruPenasihat}</div>
                   <div className="w-1/3 text-right">JUMLAH AHLI: {sortedStudents.length} ORANG</div>
                </div>
              </div>
            ) : (
              /* HEADER RINGKAS - UNTUK HALAMAN SAMBUNGAN */
              <div className="mb-4 border-b border-black pb-1 flex justify-between items-center text-[9pt] italic font-bold uppercase">
                 <div>Sambungan Senarai Ahli - Halaman {pageIdx + 1}</div>
                 <div>Tahun {currentYear}</div>
              </div>
            )}

            {/* JADUAL AHLI */}
            <table className="w-full border-collapse border border-black text-[10pt]">
              <thead>
                <tr className="bg-gray-100 font-bold text-center">
                  <th className="border border-black px-1 py-2 w-[5%]">BIL</th>
                  <th className="border border-black px-2 py-2 w-[35%] text-left">NAMA PENUH PELAJAR</th>
                  <th className="border border-black px-1 py-2 w-[15%]">NO. KAD PENGENALAN</th>
                  <th className="border border-black px-1 py-2 w-[15%]">NO. KEAHLIAN</th>
                  <th className="border border-black px-1 py-2 w-[6%] text-[8pt]">GENDER</th>
                  <th className="border border-black px-2 py-2 w-[12%] text-[9pt]">TING/KELAS</th>
                  <th className="border border-black px-2 py-2 w-[12%]">CATATAN</th>
                </tr>
              </thead>
              <tbody>
                {pageStudents.length > 0 ? pageStudents.map((s, idx) => (
                  <tr key={s.id}>
                    <td className="border border-black px-1 py-1.5 text-center font-bold">{startBil + idx}</td>
                    <td className="border border-black px-2 py-1.5 uppercase font-semibold">{s.nama}</td>
                    <td className="border border-black px-1 py-1.5 text-center font-mono text-[9pt]">{s.noKP}</td>
                    <td className="border border-black px-1 py-1.5 text-center font-bold">{s.noKeahlian || '-'}</td>
                    <td className="border border-black px-1 py-1.5 text-center">{s.jantina === Jantina.Lelaki ? 'L' : 'P'}</td>
                    <td className="border border-black px-2 py-1.5 text-center uppercase text-[9pt] font-bold">{s.tingkatan} {s.kelas}</td>
                    <td className="border border-black px-2 py-1.5"></td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="border border-black p-12 text-center italic text-gray-500">
                      Tiada rekod ahli dijumpai untuk paparan ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* RUANG TANDATANGAN - HANYA PADA HALAMAN TERAKHIR */}
            {isLastPage && sortedStudents.length > 0 && (
              <div className="mt-16 flex justify-between px-10" style={{ pageBreakInside: 'avoid' }}>
                 <div className="text-center w-[250px]">
                    <p className="font-bold uppercase text-[10pt] mb-20">Disediakan Oleh:</p>
                    <div className="border-b border-black w-full mb-2"></div>
                    <p className="text-[10pt] font-bold uppercase">( SETIAUSAHA )</p>
                    <p className="text-[9pt] uppercase">Kadet Bomba & Penyelamat</p>
                 </div>
                 <div className="text-center w-[250px]">
                    <p className="font-bold uppercase text-[10pt] mb-20">Disahkan Oleh:</p>
                    <div className="border-b border-black w-full mb-2"></div>
                    <p className="text-[10pt] font-bold uppercase">( PENGETUA )</p>
                    <p className="text-[9pt] uppercase">{data.settings?.schoolName || 'SMK SULTAN AHMAD SHAH'}</p>
                 </div>
              </div>
            )}
            
            {/* FOOTER NO-PRINT (Hanya muncul di skrin preview) */}
            <div className="no-print mt-8 text-center text-[10px] text-slate-400 font-black uppercase tracking-widest border-t border-slate-100 pt-4">
               Halaman {pageIdx + 1} daripada {pages.length}
            </div>
          </div>
        );
      })}

      <style>{`
        @media print {
          .print-page-container {
            margin: 0 !important;
            padding: 0 !important;
          }
          /* Hilangkan elemen yang tidak diperlukan semasa mencetak */
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default PrintSenaraiAhli;