import React from 'react';
import { SystemData, JawatanGuru, Jantina } from '../../../types';
import SchoolHeader from '../headers/SchoolHeader';

interface Props {
  data: SystemData;
}

const PrintSenaraiAhli: React.FC<Props> = ({ data }) => {
  const currentYear = new Date().getFullYear();
  const sortedStudents = [...data.students].sort((a, b) => a.nama.localeCompare(b.nama));

  return (
    <div className="w-full">
      <SchoolHeader data={data} />
      
      <div className="text-center mb-6 font-serif uppercase text-black break-inside-avoid page-break-inside-avoid">
        <h2 className="text-[12pt] font-bold underline">SENARAI KEHADIRAN / KEAHLIAN PASUKAN</h2>
        <p className="text-[11pt] font-bold mt-1">TAHUN {currentYear}</p>
      </div>

      <div className="flex justify-between items-end mb-2 text-[10pt] font-bold font-serif text-black break-inside-avoid">
         <p>GURU PENASIHAT: {data.teachers.find(t => t.jawatan === JawatanGuru.Penasihat)?.nama || '................................'}</p>
         <p>JUMLAH AHLI: {sortedStudents.length} ORANG</p>
      </div>

      <table className="w-full border-collapse border border-black text-[10pt] font-serif">
        <thead className="table-header-group">
          <tr className="bg-gray-100 font-bold break-inside-avoid page-break-inside-avoid">
            <th className="border border-black p-2 text-center w-[5%]">BIL</th>
            <th className="border border-black p-2 text-left w-[40%]">NAMA PENUH</th>
            <th className="border border-black p-2 text-center w-[15%]">NO. KP</th>
            <th className="border border-black p-2 text-center w-[10%]">NO. AHLI</th>
            <th className="border border-black p-2 text-center w-[5%]">JANTINA</th>
            <th className="border border-black p-2 text-center w-[10%]">KELAS</th>
            <th className="border border-black p-2 text-center w-[15%]">CATATAN</th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map((s, idx) => (
            <tr key={s.id} className="break-inside-avoid page-break-inside-avoid">
              <td className="border border-black p-1.5 text-center">{idx + 1}</td>
              <td className="border border-black p-1.5 uppercase font-bold">{s.nama}</td>
              <td className="border border-black p-1.5 text-center">{s.noKP}</td>
              <td className="border border-black p-1.5 text-center font-bold">{s.noKeahlian || '-'}</td>
              <td className="border border-black p-1.5 text-center">{s.jantina === Jantina.Lelaki ? 'L' : 'P'}</td>
              <td className="border border-black p-1.5 text-center uppercase">{s.tingkatan} {s.kelas}</td>
              <td className="border border-black p-1.5"></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-12 flex justify-end font-serif text-black break-inside-avoid page-break-inside-avoid">
         <div className="text-center w-[250px]">
            <p className="font-bold uppercase text-[11pt]">Disahkan Oleh:</p>
            <div className="h-20 border-b border-black"></div>
            <p className="text-[11pt] font-bold uppercase mt-2">( PENGETUA / PK KOKURIKULUM )</p>
         </div>
      </div>
    </div>
  );
};

export default PrintSenaraiAhli;