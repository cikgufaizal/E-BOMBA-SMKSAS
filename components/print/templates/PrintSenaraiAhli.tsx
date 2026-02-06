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
    <div className="w-full font-serif text-black text-[10pt]">
      <SchoolHeader data={data} />
      
      <div className="text-center mb-4">
        <h2 className="text-[14pt] font-bold underline uppercase tracking-wide">SENARAI KEAHLIAN PASUKAN</h2>
        <p className="text-[11pt] font-bold uppercase">SESI PERSEKOLAHAN TAHUN {currentYear}</p>
      </div>

      <div className="flex justify-between items-end mb-1 text-[9pt] font-bold uppercase">
         <p>GURU PENASIHAT: {data.teachers.find(t => t.jawatan === JawatanGuru.Penasihat)?.nama || '................................'}</p>
         <p>JUMLAH AHLI: {sortedStudents.length} ORANG</p>
      </div>

      <table className="w-full border-collapse border border-black">
        <thead>
          <tr className="bg-gray-100 font-bold text-center">
            <th className="border border-black p-1 w-[5%]">BIL</th>
            <th className="border border-black p-1 w-[40%] text-left pl-2">NAMA PENUH</th>
            <th className="border border-black p-1 w-[15%]">NO. KP</th>
            <th className="border border-black p-1 w-[10%]">NO. AHLI</th>
            <th className="border border-black p-1 w-[5%]">JANTINA</th>
            <th className="border border-black p-1 w-[10%]">KELAS</th>
            <th className="border border-black p-1 w-[15%]">CATATAN</th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map((s, idx) => (
            <tr key={s.id}>
              <td className="border border-black p-1 text-center">{idx + 1}</td>
              <td className="border border-black p-1 pl-2 uppercase font-semibold leading-tight">{s.nama}</td>
              <td className="border border-black p-1 text-center">{s.noKP}</td>
              <td className="border border-black p-1 text-center font-bold">{s.noKeahlian || '-'}</td>
              <td className="border border-black p-1 text-center">{s.jantina === Jantina.Lelaki ? 'L' : 'P'}</td>
              <td className="border border-black p-1 text-center uppercase">{s.tingkatan} {s.kelas}</td>
              <td className="border border-black p-1"></td>
            </tr>
          ))}
          {sortedStudents.length === 0 && (
             <tr>
                <td colSpan={7} className="border border-black p-8 text-center italic">Tiada data ahli direkodkan.</td>
             </tr>
          )}
        </tbody>
      </table>

      {/* RUANG TANDATANGAN */}
      <div className="mt-12 flex justify-between break-inside-avoid page-break-inside-avoid">
         <div className="text-center w-[200px]">
            <p className="font-bold uppercase text-[10pt] mb-12">Disediakan Oleh:</p>
            <div className="border-b border-black w-full"></div>
            <p className="text-[10pt] font-bold uppercase mt-1">( SETIAUSAHA )</p>
         </div>
         <div className="text-center w-[200px]">
            <p className="font-bold uppercase text-[10pt] mb-12">Disahkan Oleh:</p>
            <div className="border-b border-black w-full"></div>
            <p className="text-[10pt] font-bold uppercase mt-1">( PENGETUA )</p>
         </div>
      </div>
    </div>
  );
};

export default PrintSenaraiAhli;