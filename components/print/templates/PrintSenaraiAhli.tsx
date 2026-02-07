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

  // LOGIK PAGINATION KERAS
  const FIRST_PAGE_MAX = 25;
  const OTHER_PAGE_MAX = 30;

  const pages: any[][] = [];
  const students = [...sortedStudents];

  if (students.length > 0) {
    pages.push(students.splice(0, FIRST_PAGE_MAX));
  } else {
    pages.push([]); 
  }

  while (students.length > 0) {
    pages.push(students.splice(0, OTHER_PAGE_MAX));
  }

  return (
    <div className="print-container-root w-full text-black font-serif">
      {pages.map((pageData, pageIdx) => {
        const isFirstPage = pageIdx === 0;
        const isLastPage = pageIdx === pages.length - 1;
        const startBil = isFirstPage ? 1 : FIRST_PAGE_MAX + ((pageIdx - 1) * OTHER_PAGE_MAX) + 1;

        return (
          <div 
            key={pageIdx} 
            className="print-page"
            style={{ 
              pageBreakAfter: isLastPage ? 'auto' : 'always',
              paddingBottom: '10mm'
            }}
          >
            {/* HEADER: Hanya Page 1 ada header penuh & tajuk besar */}
            {isFirstPage ? (
              <div className="header-section">
                <SchoolHeader data={data} />
                <div className="text-center mb-4">
                  <h2 className="text-[12pt] font-bold uppercase underline">SENARAI NAMA PENUH KEAHLIAN PASUKAN</h2>
                  <p className="text-[10pt] font-bold uppercase">SESI PERSEKOLAHAN TAHUN {currentYear}</p>
                </div>
                <div className="flex justify-between items-end mb-1 text-[9pt] font-bold uppercase border-b border-black pb-1">
                   <div>GURU PENASIHAT: {guruPenasihat}</div>
                   <div>JUMLAH AHLI: {sortedStudents.length} ORANG</div>
                </div>
              </div>
            ) : (
              <div className="header-mini mb-2 border-b border-black pb-1 flex justify-between text-[8pt] italic font-bold uppercase">
                 <div>Sambungan Senarai Ahli ({pageIdx + 1})</div>
                 <div>Tahun {currentYear}</div>
              </div>
            )}

            {/* JADUAL: Baris Sangat Mampat (py-0.5) */}
            <table className="w-full border-collapse border border-black table-fixed">
              <thead>
                <tr className="bg-gray-100 text-[9pt] font-bold text-center">
                  <th className="border border-black py-1 w-[35px]">BIL</th>
                  <th className="border border-black px-2 py-1 text-left">NAMA PENUH PELAJAR</th>
                  <th className="border border-black py-1 w-[110px]">NO. KP</th>
                  <th className="border border-black py-1 w-[90px]">NO. AHLI</th>
                  <th className="border border-black py-1 w-[40px]">JAN</th>
                  <th className="border border-black py-1 w-[80px]">TING/KLS</th>
                  <th className="border border-black py-1 w-[80px]">CATATAN</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((s, idx) => (
                  <tr key={s.id} className="text-[9pt]">
                    <td className="border border-black py-0.5 text-center font-bold">{startBil + idx}</td>
                    <td className="border border-black px-2 py-0.5 uppercase font-semibold whitespace-nowrap overflow-hidden">{s.nama}</td>
                    <td className="border border-black py-0.5 text-center font-mono">{s.noKP}</td>
                    <td className="border border-black py-0.5 text-center font-bold">{s.noKeahlian || '-'}</td>
                    <td className="border border-black py-0.5 text-center">{s.jantina === Jantina.Lelaki ? 'L' : 'P'}</td>
                    <td className="border border-black py-0.5 text-center uppercase font-bold">{s.tingkatan} {s.kelas}</td>
                    <td className="border border-black py-0.5"></td>
                  </tr>
                ))}
                {pageData.length === 0 && (
                   <tr><td colSpan={7} className="border border-black p-10 text-center italic">Tiada Data</td></tr>
                )}
              </tbody>
            </table>

            {/* TANDATANGAN: Hanya pada Halaman Terakhir */}
            {isLastPage && (
              <div className="mt-8 flex justify-between px-10 items-start" style={{ breakInside: 'avoid' }}>
                 <div className="text-center w-[200px]">
                    <p className="font-bold uppercase text-[9pt] mb-12">Disediakan Oleh:</p>
                    <div className="border-b border-black w-full mb-1"></div>
                    <p className="text-[9pt] font-bold uppercase">( SETIAUSAHA )</p>
                 </div>
                 <div className="text-center w-[200px]">
                    <p className="font-bold uppercase text-[9pt] mb-12">Disahkan Oleh:</p>
                    <div className="border-b border-black w-full mb-1"></div>
                    <p className="text-[9pt] font-bold uppercase">( PENGETUA )</p>
                 </div>
              </div>
            )}

            {/* Penunjuk Halaman (Skrin Sahaja) */}
            <div className="no-print mt-4 text-center text-[9px] text-gray-400 uppercase font-black">
               Halaman {pageIdx + 1} / {pages.length}
            </div>
          </div>
        );
      })}

      <style>{`
        @media print {
          .print-page {
            margin: 0 !important;
            padding: 0 !important;
            min-height: auto !important;
          }
          table { font-size: 9pt !important; }
          thead th { background-color: #f3f4f6 !important; -webkit-print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
};

export default PrintSenaraiAhli;