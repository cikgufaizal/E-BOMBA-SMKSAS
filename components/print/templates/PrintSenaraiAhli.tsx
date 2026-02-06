import React from 'react';
import { SystemData, JawatanGuru, Jantina } from '../../../types';
import SchoolHeader from '../headers/SchoolHeader';

interface Props {
  data: SystemData;
}

const PrintSenaraiAhli: React.FC<Props> = ({ data }) => {
  const currentYear = new Date().getFullYear();
  
  // Susun ikut nama A-Z
  const sortedStudents = [...data.students].sort((a, b) => a.nama.localeCompare(b.nama));
  
  const guruPenasihat = data.teachers.find(t => t.jawatan === JawatanGuru.Penasihat)?.nama || '................................................';

  return (
    <div className="w-full font-serif text-black leading-tight">
      {/* HEADER SEKOLAH */}
      <SchoolHeader data={data} />
      
      {/* TAJUK DOKUMEN */}
      <div className="text-center mb-4 mt-2">
        <h2 className="text-[12pt] font-bold uppercase tracking-wider underline">SENARAI NAMA KEAHLIAN PASUKAN</h2>
        <p className="text-[11pt] font-bold uppercase mt-1">SESI PERSEKOLAHAN TAHUN {currentYear}</p>
      </div>

      {/* MAKLUMAT RINGKAS */}
      <div className="flex justify-between items-end mb-2 text-[10pt] font-bold uppercase border-b-2 border-black pb-1">
         <div className="w-2/3">GURU PENASIHAT: {guruPenasihat}</div>
         <div className="w-1/3 text-right">JUMLAH AHLI: {sortedStudents.length} ORANG</div>
      </div>

      {/* JADUAL UTAMA */}
      <table className="w-full border-collapse border border-black text-[10pt]">
        <thead>
          <tr className="bg-gray-200 font-bold text-center">
            <th className="border border-black px-2 py-1.5 w-[5%]">BIL</th>
            <th className="border border-black px-2 py-1.5 w-[35%] text-left">NAMA PENUH PELAJAR</th>
            <th className="border border-black px-2 py-1.5 w-[15%]">NO. KAD PENGENALAN</th>
            <th className="border border-black px-2 py-1.5 w-[12%]">NO. AHLI</th>
            <th className="border border-black px-2 py-1.5 w-[8%]">JANTINA</th>
            <th className="border border-black px-2 py-1.5 w-[10%]">TINGKATAN</th>
            <th className="border border-black px-2 py-1.5 w-[15%]">CATATAN</th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map((s, idx) => (
            <tr key={s.id} className="align-middle">
              <td className="border border-black px-2 py-1 text-center">{idx + 1}</td>
              <td className="border border-black px-2 py-1 uppercase font-semibold text-left">{s.nama}</td>
              <td className="border border-black px-2 py-1 text-center">{s.noKP}</td>
              <td className="border border-black px-2 py-1 text-center font-bold">{s.noKeahlian || '-'}</td>
              <td className="border border-black px-2 py-1 text-center">{s.jantina === Jantina.Lelaki ? 'L' : 'P'}</td>
              <td className="border border-black px-2 py-1 text-center uppercase">{s.tingkatan} {s.kelas}</td>
              <td className="border border-black px-2 py-1"></td>
            </tr>
          ))}
          {sortedStudents.length === 0 && (
             <tr>
                <td colSpan={7} className="border border-black p-4 text-center italic">Tiada data ahli direkodkan dalam sistem.</td>
             </tr>
          )}
        </tbody>
      </table>

      {/* RUANG TANDATANGAN (AKAN TURUN KE PAGE BARU JIKA TIDAK MUAT) */}
      <div className="mt-12 flex justify-between px-4 break-inside-avoid page-break-inside-avoid">
         <div className="text-center w-[250px]">
            <p className="font-bold uppercase text-[10pt] mb-12">Disediakan Oleh:</p>
            <div className="