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
  
  const footerStats = meetingSlots.map(slot => {
     if (!slot) return { hadir: 0, takHadir: 0, total: 0, percent: 0 };
     let hadirCount = 0;
     sortedStudents.forEach(s => { if (slot.presents.includes(s.id)) hadirCount++; });
     const totalAhli = sortedStudents.length;
     const percent = totalAhli > 0 ? Math.round((hadirCount / totalAhli) * 100) : 0;
     return { hadir: hadirCount, takHadir: totalAhli - hadirCount, total: totalAhli, percent };
  });

  return (
    <div className="w-full relative">
      <SchoolHeader data={data} />
      
      <div className="text-center mb-6 font-serif uppercase text-black break-inside-avoid page-break-inside-avoid">
        <h2 className="text-[12pt] font-bold underline">RUMUSAN KEHADIRAN AKTIVITI KOKURIKULUM</h2>
        <p className="text-[11pt] font-bold mt-1">TAHUN {currentYear}</p>
      </div>

      <table className="w-full border-collapse border border-black text-[9pt] font-serif">
        <thead className="table-header-group">
          <tr className="bg-transparent font-bold text-center break-inside-avoid page-break-inside-avoid">
            <th className="border border-black p-1 w-[3%]" rowSpan={2}>BIL</th>
            <th className="border border-black p-1 text-center" rowSpan={2}>NAMA PELAJAR</th>
            {Array.from({length: 12}).map((_, i) => (
              <th key={i} className="border border-black p-1 w-[2.5%] align-middle bg-gray-50">{i + 1}</th>
            ))}
            <th className="border border-black p-1 w-[4%] text-[8pt] bg-gray-100">JUM<br/>HADIR</th>
            <th className="border border-black p-1 w-[4%] text-[8pt] bg-gray-100">TIDAK<br/>HADIR</th>
            <th className="border border-black p-1 w-[4%] text-[8pt] bg-gray-100">%</th>
            <th className="border border-black p-1 w-[6%] text-[8pt] bg-gray-200">MARKAH<br/>(40%)</th>
          </tr>
          <tr className="text-[8pt] break-inside-avoid page-break-inside-avoid">
             {meetingSlots.map((slot, i) => (
                <th key={`date-${i}`} className="border border-black h-[60px] align-bottom p-0.5 bg-gray-50">
                   {slot && (
                      <div className="whitespace-nowrap -rotate-90 origin-center translate-y-[-10px]">
                         {slot.tarikh.split('-').reverse().slice(0,2).join('/')}
                      </div>
                   )}
                </th>
             ))}
             <th className="border border-black bg-gray-100"></th>
             <th className="border border-black bg-gray-100"></th>
             <th className="border border-black bg-gray-100"></th>
             <th className="border border-black bg-gray-200"></th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map((s, idx) => {
            let totalPresent = 0;
            data.attendances.forEach(att => { if (att.presents.includes(s.id)) totalPresent++; });
            const totalHeld = data.attendances.length || 1;
            const percent = Math.round((totalPresent / totalHeld) * 100);
            const markah = ((totalPresent / totalHeld) * 40).toFixed(0);

            return (
              <tr key={s.id} className="h-[28px] break-inside-avoid page-break-inside-avoid">
                <td className="border border-black p-1 text-center">{idx + 1}</td>
                <td className="border border-black p-1 px-2 uppercase font-semibold text-[9pt] whitespace-nowrap overflow-hidden text-ellipsis max-w-[250px]">{s.nama}</td>
                {meetingSlots.map((slot, i) => {
                  const isPresent = slot ? slot.presents.includes(s.id) : false;
                  return <td key={i} className="border border-black p-0 text-center font-bold align-middle">{isPresent ? '/' : ''}</td>;
                })}
                <td className="border border-black p-1 text-center bg-gray-50 font-bold">{totalPresent}</td>
                <td className="border border-black p-1 text-center bg-gray-50">{totalHeld - totalPresent}</td>
                <td className="border border-black p-1 text-center bg-gray-50">{percent}</td>
                <td className="border border-black p-1 text-center bg-gray-200 font-bold">{markah}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="break-inside-avoid page-break-inside-avoid">
           <tr>
              <td colSpan={2} className="border border-black p-1 text-right font-bold pr-2 bg-gray-50">JUM. HADIR</td>
              {footerStats.map((stat, i) => <td key={i} className="border border-black text-center font-bold text-[9pt] bg-gray-50">{stat.total > 0 ? stat.hadir : ''}</td>)}
              <td colSpan={4} className="border border-black bg-gray-100"></td>
           </tr>
           <tr>
              <td colSpan={2} className="border border-black p-1 text-right font-bold pr-2 bg-gray-50">JUM. TIDAK HADIR</td>
              {footerStats.map((stat, i) => <td key={i} className="border border-black text-center font-bold text-[9pt] bg-gray-50">{stat.total > 0 ? stat.takHadir : ''}</td>)}
              <td colSpan={4} className="border border-black bg-gray-100"></td>
           </tr>
           <tr>
              <td colSpan={2} className="border border-black p-1 text-right font-bold pr-2 bg-gray-50">PERATUS (%)</td>
              {footerStats.map((stat, i) => <td key={i} className="border border-black text-center font-bold text-[9pt] bg-gray-50">{stat.total > 0 ? stat.percent : ''}</td>)}
              <td colSpan={4} className="border border-black bg-gray-100"></td>
           </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default PrintKehadiran;