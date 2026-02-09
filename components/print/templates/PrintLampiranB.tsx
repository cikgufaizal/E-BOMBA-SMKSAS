import React from 'react';
import { SystemData } from '../../../types';
import BombaHeader from '../headers/BombaHeader';

interface Props {
  data: SystemData;
  targetId?: string;
}

const PrintLampiranB: React.FC<Props> = ({ data, targetId }) => {
  const s = data.students.find(x => x.id === targetId);
  if (!s) return <div className="p-10 text-center text-red-500 font-bold">RALAT: Data Pelajar Tidak Dijumpai</div>;

  const schoolName = data.settings?.schoolName || "SMK SULTAN AHMAD SHAH";

  return (
    <div className="w-full h-[297mm] relative bg-white font-serif text-black leading-[1.3] p-8 box-border" style={{ pageBreakAfter: 'always' }}>
      <BombaHeader data={data} />
      
      {/* Label Lampiran */}
      <div className="w-full flex justify-end mt-2 mb-1">
         <div className="font-bold text-[9pt] border border-black p-1 px-3">
           Lampiran B
         </div>
      </div>

      <div className="text-center mb-8">
         <h2 className="text-[12pt] font-bold tracking-wide underline">BORANG PELEPASAN TANGGUNGJAWAB</h2>
         <div className="text-[9pt] font-bold mt-0.5 uppercase">KEBENARAN IBU BAPA / PENJAGA</div>
      </div>

      <div className="px-4 text-[10pt] text-justify">
         
         <p className="mb-2">
           Saya <span className="font-bold uppercase border-b border-black px-2">{s.namaWaris || '................................................'}</span> 
           &nbsp;No. Kad Pengenalan <span className="font-bold border-b border-black px-2">{s.noKPWaris || '......................'}</span>
         </p>
         <p className="text-[9pt] text-gray-500 italic mb-4 mt-[-4px]">(Nama Ibu / Bapa / Penjaga)</p>

         <p className="mb-6">
           Beralamat di <span className="font-bold uppercase border-b border-black px-2">{s.alamatWaris || s.alamat || '................................................................................................'}</span>
         </p>

         <p className="mb-2">
           Dengan ini memberi kebenaran kepada anak / jagaan saya <span className="font-bold uppercase border-b border-black px-2">{s.nama}</span>
         </p>
         <p className="mb-4">
           No. Kad Pengenalan <span className="font-bold border-b border-black px-2">{s.noKP}</span> Tingkatan <span className="font-bold border-b border-black px-2 uppercase">{s.tingkatan} {s.kelas}</span>
         </p>
         <p>
           Untuk menyertai <strong>PASUKAN KADET BOMBA DAN PENYELAMAT MALAYSIA</strong> di sekolah:
         </p>
         <p className="text-center font-bold uppercase border-b border-black my-2 text-[11pt]">{schoolName}</p>

         <div className="mt-6 border border-black p-4 bg-gray-50 shadow-sm rounded-sm">
           <p className="font-bold underline mb-1">PENGAKUAN WARIS:</p>
           <p className="leading-relaxed">
             "Saya faham bahawa pihak sekolah dan Jabatan Bomba dan Penyelamat Malaysia akan mengambil segala langkah keselamatan yang sewajarnya. Namun demikian, saya mengakui bahawa saya tidak akan mengambil sebarang tindakan undang-undang atau mahkamah terhadap pihak sekolah atau Jabatan sekiranya berlaku sebarang kemalangan, kecederaan atau kehilangan harta benda yang berlaku di luar jangkaan atau kawalan pihak penganjur semasa aktiviti dijalankan."
           </p>
           <p className="mt-2 leading-relaxed">
             Saya juga memberi kebenaran kepada pihak pengurusan untuk menguruskan rawatan perubatan kecemasan bagi anak saya jika diperlukan.
           </p>
         </div>

         <div className="mt-12 grid grid-cols-2 gap-16">
            <div>
               <p className="mb-8">Tarikh: <span className="font-bold border-b border-black px-2">{new Date().toLocaleDateString('ms-MY')}</span></p>
               <div className="h-16 border-b border-black w-full"></div>
               <p className="text-[9pt] font-bold uppercase mt-1 text-center">( TANDATANGAN IBU / BAPA / PENJAGA )</p>
               <p className="text-[8pt] uppercase mt-0 text-center">Nama: {s.namaWaris}</p>
            </div>

            <div>
               <p className="mb-8">Disaksikan Oleh:</p>
               <div className="h-16 border-b border-black w-full"></div>
               <p className="text-[9pt] font-bold uppercase mt-1 text-center">( TANDATANGAN SAKSI )</p>
               <p className="text-[8pt] uppercase mt-0 text-center">Nama: ...........................................</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default PrintLampiranB;