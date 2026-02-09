import React from 'react';
import { SystemData } from '../../../types';
import SchoolHeader from '../headers/SchoolHeader';

interface Props {
  data: SystemData;
}

const PrintKehadiran: React.FC<Props> = ({ data }) => {
  const currentYear = new Date().getFullYear();
  const sortedStudents = [...data.students].sort((a, b) => a.nama.localeCompare(b.nama));
  const sortedAttendance = [...data.attendances]
    .sort((a, b) => new Date(a.tarikh).getTime() - new Date(b.tarikh).getTime());
  const meetingSlots = Array.from({ length: 12 }, (_, i) => sortedAttendance[i] || null);

  // Stats Footer Calculation
  const footerStats = meetingSlots.map(slot => {
     if (!slot) return { hadir: 0, takHadir: 0, total: 0, percent: 0 };
     let hadirCount = 0;
     sortedStudents.forEach(s => { if (slot.presents.includes(s.id)) hadirCount++; });
     const totalAhli = sortedStudents.length;
     const percent = totalAhli > 0 ? Math.round((hadirCount / totalAhli) * 100) : 0;
     return { hadir: hadirCount, takHadir: totalAhli - hadirCount, total: totalAhli, percent };
  });

  // Config: A4 Landscape (210mm Height)
  const ROWS_PAGE_1 = 15;
  const ROWS_PAGE_NEXT = 25;

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
            className="w-[297mm] h-[210mm] relative bg-white p-8 flex flex-col box-border"
            style={{ pageBreakAfter: 'always' }}
          >
             {/* HEADER */}
             {isFirstPage ? (
               <div>
                 <SchoolHeader data={data} />
                 <div className="text-center mb-4">
                    <h2 className="text-[12pt] font-bold underline uppercase">RUMUSAN KEHADIRAN AKTIVITI KOKURIKULUM TAHUN {currentYear}</h2>
                 </div>
               </div>
             ) : (
                <div className="mb-2 pt-2 border-b border-black flex justify-between items-end text-[9pt]">
                   <span className="font-bold italic">Sambungan Rekod Kehadiran...</span>
                   <span>Muka Surat {pageIdx + 1}</span>
                </div>
             )}

             {/* TABLE */}
             <div className="flex-1 overflow-hidden">
                <table className="w-full border-collapse border border-black text-[9pt]">
                  <thead>
                    <tr className="bg-gray-100 text-center">
                      <th className="border border-black p-1 w-[30px]" rowSpan={2}>BIL</th>
                      <th className="border border-black p-1 px-2 text-left" rowSpan={2}>NAMA PELAJAR</th>
                      {Array.from({length: 12}).map((_, i) => (
                        <th key={i} className="border border-black p-0 w-[2.5%] align-middle text-[8pt]">{i + 1}</th>
                      ))}
                      <th className="border border-black p-1 w-[40px] text-[8pt]">JUM<br/>HADIR</th>
                      <th className="border border-black p-1 w-[40px] text-[8pt]">%</th>
                    </tr>
                    <tr className="text-[8pt]">
                       {meetingSlots.map((slot, i) => (
                          <th key={`date-${i}`} className="border border-black h-[40px] align-bottom p-0">
                             {slot && (
                                <div className="whitespace-nowrap -rotate-90 origin-center translate-y-[-5px]">
                                   {slot.tarikh.split('-').reverse().slice(0,2).join('/')}
                                </div>
                             )}
                          </th>
                       ))}
                       <th className="border border-black bg-gray-100"></th>
                       <th className="border border-black bg-gray-100"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.map((s, idx) => {
                      let totalPresent = 0;
                      data.attendances.forEach(att => { if (att.presents.includes(s.id)) totalPresent++; });
                      const totalHeld = data.attendances.length || 1;
                      const percent = Math.round((totalPresent / totalHeld) * 100);

                      return (
                        <tr key={s.id} className="h-[22px]">
                          <td className="border border-black text-center">{startBil + idx}</td>
                          <td className="border border-black px-2 uppercase font-bold truncate max-w-[300px]">{s.nama}</td>
                          {meetingSlots.map((slot, i) => {
                            const isPresent = slot ? slot.presents.includes(s.id) : false;
                            return <td key={i} className="border border-black text-center font-bold text-[8pt]">{isPresent ? '/' : ''}</td>;
                          })}
                          <td className="border border-black text-center font-bold">{totalPresent}</td>
                          <td className="border border-black text-center">{percent}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  {isLastPage && (
                    <tfoot>
                       <tr>
                          <td colSpan={2} className="border border-black p-1 text-right font-bold pr-2 bg-gray-50">JUM. HADIR</td>
                          {footerStats.map((stat, i) => <td key={i} className="border border-black text-center font-bold text-[8pt]">{stat.total > 0 ? stat.hadir : ''}</td>)}
                          <td colSpan={2} className="border border-black bg-gray-100"></td>
                       </tr>
                    </tfoot>
                  )}
                </table>
             </div>
          </div>
        );
      })}
    </div>
  );
};

export default PrintKehadiran;