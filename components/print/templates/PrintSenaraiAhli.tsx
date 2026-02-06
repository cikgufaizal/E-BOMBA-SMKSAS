import React from 'react';
import { SystemData, JawatanGuru, Jantina } from '../../../types';
import SchoolHeader from '../headers/SchoolHeader';

interface Props {
  data: SystemData;
}

const PrintSenaraiAhli: React.FC<Props> = ({ data }) => {
  const currentYear = new Date().getFullYear();
  const sortedStudents = [...data.students].sort((a, b) => a.nama.localeCompare(b.nama));

  // Style helper untuk border hitam pekat
  const borderStyle = { borderColor: 'black', borderWidth: '1px', borderStyle: 'solid' };

  return (
    <div className="w-full font-serif text-black">
      <SchoolHeader data={data} />
      
      <div className="text-center mb-6">
        <h2 className="text-[16pt] font-bold underline tracking-wide uppercase">SENARAI KEAHLIAN PASUKAN</h2>
        <p className="text-[12pt] font-bold mt-1 uppercase">SESI PERSEKOLAHAN TAHUN {currentYear}</p>
      </div>

      <div className="flex justify-between items-end mb-2 text-[10pt] font-bold">
         <p className="uppercase">GURU PENASIHAT: {data.teachers.find(t => t.jawatan === JawatanGuru.Penasihat)?.nama || '................................'}</p>
         <p className="uppercase">JUMLAH AHLI: {sortedStudents.length} ORANG</p>
      </div>

      <table className="w-full border-collapse text-[10pt]" style={borderStyle}>
        <thead className="table-header-group">
          <tr className="bg-gray-100 font-bold">
            <th className="p-2 text-center w-[5%]" style={borderStyle}>BIL</th>
            <th className="p-2 text-left w-[35%]" style={borderStyle}>NAMA PENUH</th>
            <th className="p-2 text-center w-[15%]" style={borderStyle}>NO. KP</th>
            <th className="p-2 text-center w-[15%]" style={borderStyle}>NO. KEAHLIAN</th>
            <th className="p-2 text-center w-[5%]" style={borderStyle}>JANTINA</th>
            <th className="p-2 text-center w-[10%]" style={borderStyle}>TINGKATAN</th>
            <th className="p-2 text-center w-[15%]" style={borderStyle}>CATATAN</th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map((s, idx) => (
            <tr key={s.id} style={{ pageBreakInside: 'avoid' }}>
              <td className="p-1.5 text-center" style={borderStyle}>{idx + 1}</td>
              <td className="p-1.5 uppercase font-semibold" style={borderStyle}>{s.nama}</td>
              <td className="p-1.5 text-center" style={borderStyle}>{s.noKP}</td>
              <td className="p-1.5 text-center font-bold" style={borderStyle}>{s.noKeahlian || '-'}</td>
              <td className="p-1.5 text-center" style={borderStyle}>{s.jantina === Jantina.Lelaki ? 'L' : 'P'}</td>
              <td className="p-1.5 text-center uppercase" style={borderStyle}>{s.tingkatan} {s.kelas}</td>
              <td className="p-1.5" style={borderStyle}></td>
            </tr>
          ))}
          {sortedStudents.length === 0 && (
             <tr>
                <td colSpan={7} className="p-8 text-center italic" style={borderStyle}>Tiada data ahli direkodkan.</td>
             </tr>
          )}
        </tbody>
      </table>

      {/* RUANG TANDATANGAN */}
      <div className="mt-16 flex justify-between page-break-inside-avoid break-inside-avoid">
         <div className="text-center w-[250px]">
            <p className="font-bold uppercase text-[11pt] mb-12">Disediakan Oleh:</p>
            <div className="border-b-2 border-black w-full"></div>
            <p className="text-[11pt] font-bold uppercase mt-2">( SETIAUSAHA )</p>
         </div>
         <div className="text-center w-[250px]">
            <p className="font-bold uppercase text-[11pt] mb-12">Disahkan Oleh:</p>
            <div className="border-b-2 border-black w-full"></div>
            <p className="text-[11pt] font-bold uppercase mt-2">( PENGETUA / PK KOKURIKULUM )</p>
         </div>
      </div>
    </div>
  );
};

export default PrintSenaraiAhli;