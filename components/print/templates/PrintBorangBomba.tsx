import React from 'react';
import { SystemData, ReportType, Student } from '../../../types';
import BombaHeader from '../headers/BombaHeader';
import SchoolHeader from '../headers/SchoolHeader';

interface Props {
  data: SystemData;
  type: ReportType;
  targetId?: string;
}

const PrintBorangBomba: React.FC<Props> = ({ data, type, targetId }) => {
  const currentYear = new Date().getFullYear();

  // Helper untuk tajuk
  const DocumentTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="text-center mb-6 font-serif uppercase text-black break-inside-avoid page-break-inside-avoid">
        <h2 className="text-[12pt] font-bold underline">{title}</h2>
        {subtitle && <p className="text-[11pt] font-bold mt-1">{subtitle}</p>}
    </div>
  );

  // KANDUNGAN LAMPIRAN A
  const renderLampiranA = () => {
    const s = data.students.find(x => x.id === targetId);
    if (!s) return <div>Data Pelajar Tidak Dijumpai</div>;

    return (
      <>
        <DocumentTitle title="BORANG MAKLUMAT PERIBADI (LAMPIRAN A)" />
        <div className="text-[11pt] space-y-6 px-4 font-serif text-black">
          <div className="grid grid-cols-[200px_auto] gap-y-3">
            <div className="font-bold">1. Nama Penuh</div><div className="uppercase font-bold border-b border-black/50">: {s.nama}</div>
            <div className="font-bold">2. No. Kad Pengenalan</div><div className="font-bold border-b border-black/50">: {s.noKP}</div>
            <div className="font-bold">3. Tingkatan</div><div className="uppercase border-b border-black/50">: {s.tingkatan} {s.kelas}</div>
            <div className="font-bold">4. Jantina</div><div className="uppercase border-b border-black/50">: {s.jantina}</div>
            <div className="font-bold">5. Kaum</div><div className="uppercase border-b border-black/50">: {s.kaum}</div>
          </div>
          <div className="border border-black p-4 mt-6 break-inside-avoid page-break-inside-avoid">
            <p className="font-bold underline mb-2">PENGAKUAN KESIHATAN</p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[10pt]">
               {Object.entries(s.health || {}).map(([k, v]) => (
                 k !== 'kecacatan' && (
                   <div key={k} className="flex justify-between border-b border-black/10 py-1">
                     <span className="uppercase">{k.replace(/([A-Z])/g, ' $1')}</span>
                     <span className="font-bold">{v ? 'YA' : 'TIDAK'}</span>
                   </div>
                 )
               ))}
            </div>
          </div>
          <div className="mt-12 break-inside-avoid page-break-inside-avoid">
            <p className="text-justify leading-relaxed">Saya mengaku bahawa segala maklumat yang diberikan adalah benar.</p>
            <div className="mt-8 grid grid-cols-2 gap-10">
               <div className="text-center mt-10">
                  <div className="border-b border-black h-10 w-3/4 mx-auto"></div>
                  <p className="mt-2 font-bold uppercase text-[10pt]">Tandatangan Pelajar</p>
               </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // KANDUNGAN LAMPIRAN B
  const renderLampiranB = () => {
    const s = data.students.find(x => x.id === targetId);
    if (!s) return <div>Data Pelajar Tidak Dijumpai</div>;

    return (
      <>
         <DocumentTitle title="SURAT KEBENARAN IBU BAPA / PENJAGA (LAMPIRAN B)" />
         <div className="text-[11pt] px-4 text-justify leading-relaxed space-y-6 font-serif text-black">
            <p>Saya, <strong>{s.namaWaris || '................................'}</strong> (No KP: <strong>{s.noKPWaris || '......................'}</strong>), waris kepada pelajar bernama <strong>{s.nama}</strong> (<strong>{s.tingkatan} {s.kelas}</strong>), dengan ini memberi kebenaran kepada anak jagaan saya untuk menyertai aktiviti Pasukan Kadet Bomba.</p>
            <p>Saya faham bahawa pihak sekolah akan mengambil langkah keselamatan yang sewajarnya. Namun demikian, saya tidak akan mengambil sebarang tindakan undang-undang terhadap pihak sekolah sekiranya berlaku kemalangan di luar jangkaan.</p>
            <div className="mt-16 grid grid-cols-2 gap-20 break-inside-avoid page-break-inside-avoid">
               <div className="text-center">
                  <div className="border-b border-black h-20"></div>
                  <p className="mt-2 font-bold uppercase">( TANDATANGAN WARIS )</p>
               </div>
               <div className="text-center">
                  <div className="border-b border-black h-20"></div>
                  <p className="mt-2 font-bold uppercase">( SAKSI )</p>
               </div>
            </div>
         </div>
      </>
    );
  };

  // KANDUNGAN LAMPIRAN E
  const renderLampiranE = () => {
    return (
      <>
        <DocumentTitle title="PERMOHONAN PENUBUHAN PASUKAN (LAMPIRAN E)" />
        <div className="text-[11pt] space-y-4 px-4 font-serif text-black">
             <p className="text-justify">Bahawasanya kami guru-guru dan pelajar-pelajar sekolah ini memohon menubuhkan Pasukan Kadet Bomba dan Penyelamat Malaysia.</p>
             <div className="mt-8 border border-black p-4 h-32">Ulasan Pengetua:</div>
             <div className="mt-12 text-center w-[250px] ml-auto">
                <div className="h-20 border-b border-black"></div>
                <p className="text-[11pt] font-bold uppercase mt-2">( TANDATANGAN PEMOHON )</p>
             </div>
        </div>
      </>
    );
  };

  // KANDUNGAN LAMPIRAN F
  const renderLampiranF = () => {
    const sortedStudents = [...data.students].sort((a, b) => a.nama.localeCompare(b.nama));
    return (
      <>
         <DocumentTitle title="BORANG PENDAFTARAN KOLEKTIF (LAMPIRAN F)" subtitle={`TAHUN ${currentYear}`} />
         <table className="w-full border-collapse border border-black text-[10pt] font-serif">
          <thead className="table-header-group">
            <tr className="bg-gray-100 font-bold break-inside-avoid page-break-inside-avoid">
              <th className="border border-black p-2 text-center w-[5%]">BIL</th>
              <th className="border border-black p-2 text-left w-[40%]">NAMA PENUH</th>
              <th className="border border-black p-2 text-center w-[15%]">NO. KP</th>
              <th className="border border-black p-2 text-center w-[15%]">NO. KEAHLIAN</th>
              <th className="border border-black p-2 text-center w-[10%]">TINGKATAN</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((s, idx) => (
              <tr key={s.id} className="break-inside-avoid page-break-inside-avoid">
                <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                <td className="border border-black p-1.5 uppercase font-bold">{s.nama}</td>
                <td className="border border-black p-1.5 text-center">{s.noKP}</td>
                <td className="border border-black p-1.5 text-center font-bold">{s.noKeahlian || ''}</td>
                <td className="border border-black p-1.5 text-center uppercase">{s.tingkatan} {s.kelas}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-12 flex justify-between font-serif text-black break-inside-avoid page-break-inside-avoid">
           <div className="text-center w-[250px]">
              <p className="font-bold uppercase text-[11pt]">Disediakan Oleh:</p>
              <div className="h-20 border-b border-black"></div>
              <p className="text-[11pt] font-bold uppercase mt-2">( GURU PENASIHAT )</p>
           </div>
           <div className="text-center w-[250px]">
              <p className="font-bold uppercase text-[11pt]">Disahkan Oleh:</p>
              <div className="h-20 border-b border-black"></div>
              <p className="text-[11pt] font-bold uppercase mt-2">( PENGETUA )</p>
           </div>
        </div>
      </>
    );
  };

  return (
    <div className="w-full">
      {/* 
          LOGIC FIX: Lampiran E adalah surat rasmi sekolah, jadi guna SchoolHeader. 
          Yang lain adalah borang Bomba, guna BombaHeader.
      */}
      {type === 'LAMPIRAN_E' ? <SchoolHeader data={data} /> : <BombaHeader data={data} />}
      
      {type === 'PENDAFTARAN' && renderLampiranA()}
      {type === 'LAMPIRAN_B' && renderLampiranB()}
      {type === 'LAMPIRAN_E' && renderLampiranE()}
      {type === 'LAMPIRAN_F' && renderLampiranF()}
    </div>
  );
};

export default PrintBorangBomba;