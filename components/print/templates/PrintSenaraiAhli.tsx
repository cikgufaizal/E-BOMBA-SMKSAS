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

  return (
    <div className="w-full font-serif text-black leading-tight">
      {/* HEADER SEKOLAH */}
      <SchoolHeader data={data} />
      
      {/* TAJUK DOKUMEN */}
      <div className="text-center mb-6 mt-4 break-inside-avoid page-break-inside-avoid">
        <h2 className="text-[12pt] font-bold uppercase tracking-wider underline">SENARAI NAMA PENUH KEAHLIAN PASUKAN</h2>
        <p className="text-[11pt] font-bold uppercase mt-1">SESI PERSEKOLAHAN TAHUN {currentYear}</p>
      </div>

      {/* MAKLUMAT RINGKAS */}
      <div className="flex justify-between items-end mb-2 text-[10pt] font-bold uppercase border-b-2 border-black pb-2 break-inside-avoid page-break-inside-avoid">
         <div className="w-2/3">GURU PENASIHAT: {guruPenasihat}</div>
         <div className="w-1/3 text-right">JUMLAH AHLI: {sortedStudents.length} ORANG</div>
      </div>

      {/* JADUAL UTAMA */}
      <table className="w-full border-collapse border border-black text-[10pt]">
        <thead>
          <tr className="bg-gray-100 font-bold text-center">
            <th className="border border-black px-2 py-2 w-[5%]">BIL</th>
            <th className="border border-black px-2 py-2 w-[35%] text-left">NAMA PENUH PELAJAR</th>
            <th className="border border-black px-2 py-2 w-[15%]">NO. KAD PENGENALAN</th>
            <th className="border border-black px-2 py-2 w-[15%]">NO. KEAHLIAN</th>
            <th className="border border-black px-2 py-2 w-[8%]">JANTINA</th>
            <th className="border border-black px-2 py-2 w-[10%]">TING/KELAS</th>
            <th className="border border-black px-2 py-2 w-[12%]">CATATAN</th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map((s, idx) => (
            <tr key={s.id} className="break-inside-avoid page-break-inside-avoid">
              <td className="border border-black px-2 py-1.5 text-center">{idx + 1}</td>
              <td className="border border-black px-2 py-1.5 uppercase font-semibold">{s.nama}</td>
              <td className="border border-black px-2 py-1.5 text-center font-mono">{s.noKP}</td>
              <td className="border border-black px-2 py-1.5 text-center font-bold">{s.noKeahlian || '-'}</td>
              <td className="border border-black px-2 py-1.5 text-center">{s.jantina === Jantina.Lelaki ? 'L' : 'P'}</td>
              <td className="border border-black px-2 py-1.5 text-center uppercase text-[9pt]">{s.tingkatan} {s.kelas}</td>
              <td className="border border-black px-2 py-1.5"></td>
            </tr>
          ))}
          {sortedStudents.length === 0 && (
             <tr>
                <td colSpan={7} className="border border-black p-6 text-center italic">Tiada data ahli direkodkan dalam sistem.</td>
             </tr>
          )}
        </tbody>
      </table>

      {/* RUANG TANDATANGAN */}
      <div className="mt-16 flex justify-between px-8 break-inside-avoid page-break-inside-avoid">
         <div className="text-center w-[250px]">
            <p className="font-bold uppercase text-[10pt] mb-16">Disediakan Oleh:</p>
            <div className="border-b border-black w-full mb-2"></div>
            <p className="text-[10pt] font-bold uppercase">( SETIAUSAHA )</p>
            <p className="text-[9pt]">Kadet Bomba & Penyelamat</p>
         </div>
         <div className="text-center w-[250px]">
            <p className="font-bold uppercase text-[10pt] mb-16">Disahkan Oleh:</p>
            <div className="border-b border-black w-full mb-2"></div>
            <p className="text-[10pt] font-bold uppercase">( PENGETUA )</p>
            <p className="text-[9pt] uppercase">{data.settings?.schoolName || 'SMK SULTAN AHMAD SHAH'}</p>
         </div>
      </div>
    </div>
  );
};

export default PrintSenaraiAhli;