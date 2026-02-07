import React from 'react';
import { SystemData, JawatanAJK } from '../../../types';
import SchoolHeader from '../headers/SchoolHeader';

interface Props {
  data: SystemData;
}

const PrintCartaAJK: React.FC<Props> = ({ data }) => {
  const currentYear = new Date().getFullYear();
  const order = Object.values(JawatanAJK);
  const sortedCommittees = [...data.committees].sort((a, b) => order.indexOf(a.jawatan) - order.indexOf(b.jawatan));

  return (
    <div className="w-full">
      <SchoolHeader data={data} />
      
      <div className="text-center mb-6 font-serif uppercase text-black break-inside-avoid">
        <h2 className="text-[12pt] font-bold underline">CARTA ORGANISASI PASUKAN</h2>
        <p className="text-[11pt] font-bold mt-1">TAHUN {currentYear}</p>
      </div>

      <table className="w-full border-collapse border border-black text-[11pt] mt-6 font-serif">
        <thead className="table-header-group">
          <tr className="bg-gray-100 font-bold">
            <th className="border border-black p-3 text-center w-[10%]">BIL</th>
            <th className="border border-black p-3 text-left w-[30%]">JAWATAN</th>
            <th className="border border-black p-3 text-left w-[40%]">NAMA PENUH</th>
            <th className="border border-black p-3 text-center w-[20%]">TINGKATAN</th>
          </tr>
        </thead>
        <tbody>
          {sortedCommittees.map((ajk, idx) => {
            const student = data.students.find(s => s.id === ajk.studentId);
            return (
              <tr key={ajk.id} className="break-inside-avoid">
                <td className="border border-black p-3 text-center font-bold">{idx + 1}</td>
                <td className="border border-black p-3 font-bold uppercase">{ajk.jawatan}</td>
                <td className="border border-black p-3 uppercase font-bold">
                   {student ? student.nama : 'PELAJAR TIDAK DIJUMPAI'}
                </td>
                <td className="border border-black p-3 text-center font-bold uppercase">
                   {student ? `${student.tingkatan} ${student.kelas}` : '-'}
                </td>
              </tr>
            );
          })}
          {sortedCommittees.length === 0 && (
            <tr><td colSpan={4} className="border border-black p-8 text-center italic text-black">Tiada maklumat AJK dilantik direkodkan.</td></tr>
          )}
        </tbody>
      </table>

      <div className="mt-16 grid grid-cols-2 gap-20 font-serif text-black break-inside-avoid">
        <div className="text-center">
          <p className="font-bold uppercase text-[11pt]">Disediakan Oleh:</p>
          <div className="h-20 border-b border-black"></div>
          <p className="text-[11pt] font-bold uppercase mt-2">( SETIAUSAHA )</p>
        </div>
        <div className="text-center">
          <p className="font-bold uppercase text-[11pt]">Disahkan Oleh:</p>
          <div className="h-20 border-b border-black"></div>
          <p className="text-[11pt] font-bold uppercase mt-2">( GURU PENASIHAT )</p>
        </div>
      </div>
    </div>
  );
};

export default PrintCartaAJK;