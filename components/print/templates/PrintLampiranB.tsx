import React from 'react';
import { SystemData } from '../../../types';

interface Props {
  data: SystemData;
  targetId?: string;
}

const PrintLampiranB: React.FC<Props> = ({ data, targetId }) => {
  const studentsToPrint = targetId === 'ALL' 
    ? data.students.filter(s => s.namaWaris) 
    : data.students.filter(x => x.id === targetId);

  if (studentsToPrint.length === 0) return <div className="p-10 text-center text-red-500 font-bold">RALAT: Data Pelajar Tidak Dijumpai</div>;

  const schoolName = data.settings?.schoolName || "SMK SULTAN AHMAD SHAH";
  const BOMBA_LOGO = data.settings?.bombaLogoUrl || "https://upload.wikimedia.org/wikipedia/commons/8/87/Jabatan_Bomba_dan_Penyelamat_Malaysia.png";

  return (
    <div className="w-full">
      {studentsToPrint.map((s) => (
        <div 
          key={s.id}
          className="w-full h-[296mm] relative bg-white font-serif text-black leading-relaxed p-[15mm_20mm] box-border flex flex-col" 
          style={{ pageBreakAfter: 'always' }}
        >
          {/* Label Lampiran */}
          <div className="w-full flex justify-end mb-4">
             <div className="font-bold text-[11pt] border border-black px-2 py-1">
               Lampiran B
             </div>
          </div>

          {/* Header with Logo */}
          <div className="flex flex-col items-center mb-6">
            <img src={BOMBA_LOGO} alt="Logo JBPM" className="h-24 w-auto object-contain mb-3" />
            <h2 className="text-[15pt] font-bold text-center tracking-tight">JABATAN BOMBA DAN PENYELAMAT MALAYSIA</h2>
            <h3 className="text-[12pt] font-bold text-center mt-1">(Borang Pelepasan Tanggungjawab)</h3>
          </div>

          {/* Content Body */}
          <div className="text-[11.5pt] space-y-5 flex-1">
            
            {/* Nama Waris Section */}
            <div className="space-y-1">
              <div className="flex items-end">
                <span className="whitespace-nowrap">Saya</span>
                <div className="flex-1 border-b border-black/80 mx-2 text-center font-bold uppercase pb-0.5 min-h-[22px]">
                  {s.namaWaris || '________________________________________________'}
                </div>
              </div>
              <div className="flex justify-center">
                <span className="text-[9.5pt] italic text-gray-500">(Nama ibu bapa / penjaga)</span>
              </div>
            </div>

            <div className="flex items-end">
              <span className="whitespace-nowrap">No. Kad Pengenalan</span>
              <div className="w-[260px] border-b border-black/80 ml-2 text-center font-bold pb-0.5 min-h-[22px]">
                {s.noKPWaris || '______________________'}
              </div>
            </div>

            {/* Alamat Section */}
            <div className="space-y-1">
              <div className="flex items-end">
                <span className="whitespace-nowrap">Beralamat</span>
                <div className="flex-1 border-b border-black/80 ml-2 font-bold uppercase pb-0.5 min-h-[22px]">
                  {s.alamatWaris || s.alamat || '____________________________________________________________________________________'}
                </div>
              </div>
              <div className="border-b border-black/80 w-full h-[22px]"></div>
            </div>

            {/* Membenarkan Section */}
            <div className="space-y-1 pt-1">
              <div className="flex items-end">
                <span className="whitespace-nowrap">dengan ini membenarkan</span>
                <div className="flex-1 border-b border-black/80 ml-2 text-center font-bold uppercase pb-0.5 min-h-[22px]">
                  {s.nama}
                </div>
              </div>
              <div className="flex justify-center">
                <span className="text-[9.5pt] italic text-gray-500">( Nama Pelajar )</span>
              </div>
            </div>

            <div className="text-center font-bold py-1 uppercase tracking-widest text-[11pt]">
              menyertai:
            </div>

            {/* School Name Section */}
            <div className="flex flex-col items-center space-y-1">
              <h2 className="text-[12pt] font-bold text-center uppercase">PASUKAN KADET BOMBA DAN PENYELAMAT MALAYSIA DI</h2>
              <div className="w-full border-b border-black/80 pb-0.5 text-center font-bold uppercase text-[12pt]">
                {schoolName}
              </div>
              <div className="text-[9.5pt] italic text-gray-500">( Nama sekolah )</div>
            </div>

            {/* Terms & Conditions */}
            <div className="text-justify space-y-4 pt-2 leading-relaxed text-[11.5pt]">
              <p>
                Saya sedar bahawa kebenaran ini meliputi aktiviti-aktiviti, lawatan dan perkhemahan yang dianjurkan oleh sama ada pihak sekolah atau pihak bomba.
              </p>
              <p>
                Saya sedar bahawa pihak penganjur akan mengambil segala langkah keselamatan, dengan itu berjanji tidak akan mengambil sebarang tindakan mahkamah bagi sebarang kejadian di luar kawalan pihak penganjur yang mengakibatkan kecacatan sementara dan atau kecacatan kekal dan atau kematian ke atas anak / pelajar jagaan saya semasa dalam perjalanan pergi dan balik untuk menyertai aktiviti dan atau semasa penglibatannya di dalam aktiviti-aktiviti yang dijalankan.
              </p>
              <p>
                Saya juga membenarkan anak / pelajar jagaan saya mendapat rawatan perubatan yang sewajarnya sekiranya berlaku kecemasan.
              </p>
            </div>
          </div>

          {/* Footer Section */}
          <div className="flex justify-between items-end mt-8 pb-6">
            <div className="flex flex-col space-y-1">
              <div className="flex items-end">
                <span className="font-bold">Tarikh:</span>
                <div className="w-[160px] border-b border-black/80 ml-2 text-center font-bold pb-0.5">
                  {new Date().toLocaleDateString('ms-MY')}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-[260px] border-b border-black/80 h-[22px]"></div>
              <div className="text-[10.5pt] font-bold mt-2">( Tandatangan Ibu / Bapa / Penjaga )</div>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
};

export default PrintLampiranB;
