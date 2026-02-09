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
    <div className="w-full h-[297mm] relative bg-white p-8 box-border flex flex-col" style={{ pageBreakAfter: 'always' }}>
      <SchoolHeader data={data} />
      
      <div className="text-center mb-6 font-serif uppercase text-black">
        <h2 className="text-[12pt] font-bold underline">CARTA ORGANISASI PASUKAN</h2>
        <p className="text-[10pt] font-bold mt-1">SESI TAHUN {currentYear}</p>
      </div>

      <div className="flex-1">
        <table className="w-full border-collapse border border-black text-[10pt] font-serif">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-2 text-center w-[40px]">BIL</th>
              <th className="border border-black p-2 text-left w-[30%]">JAWATAN</th>
              <th className="border border-black p-2 text-left w-[40%]">NAMA PENUH</th>
              <th className="border border-black p-2 text-center w-[20%]">KELAS</th>
            </tr>
          </thead>
          <tbody>
            {sortedCommittees.map((ajk, idx) => {
              const student = data.students.find(s => s.id === ajk.studentId);
              return (
                <tr key={ajk.id} className="h-[35px]">
                  <td className="border border-black text-center font-bold">{idx + 1}</td>
                  <td className="border border-black px-3 font-bold uppercase">{ajk.jawatan}</td>
                  <td className="border border-black px-3 uppercase font-bold">
                     {student ? student.nama : 'PELAJAR TIDAK DIJUMPAI'}
                  </td>
                  <td className="border border-black text-center font-bold uppercase">
                     {student ? `${student.tingkatan} ${student.kelas}` : '-'}
                  </td>
                </tr>
              );
            })}
            {sortedCommittees.length === 0 && (
              <tr><td colSpan={4} className="border border-black p-8 text-center italic">Tiada AJK dilantik.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-between items-start">
        <div className="text-center w-[200px]">
          <p className="font-bold uppercase text-[9pt] mb-16">Disediakan Oleh:</p>
          <div className="border-b border-black w-full mb-1"></div>
          <p className="text-[8pt] font-bold uppercase">( SETIAUSAHA )</p>
        </div>
        <div className="text-center w-[200px]">
          <p className="font-bold uppercase text-[9pt] mb-16">Disahkan Oleh:</p>
          <div className="border-b border-black w-full mb-1"></div>
          <p className="text-[8pt] font-bold uppercase">( GURU PENASIHAT )</p>
        </div>
      </div>
    </div>
  );
};

export default PrintCartaAJK;