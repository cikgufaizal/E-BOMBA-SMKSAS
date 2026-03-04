import React from 'react';
import { SystemData } from '../../../types';

interface Props {
  data: SystemData;
  targetId?: string;
}

const PrintLampiranB: React.FC<Props> = ({ data, targetId }) => {
  // Handle single or multiple students
  const studentsToPrint = targetId === 'ALL' 
    ? data.students.sort((a, b) => a.nama.localeCompare(b.nama))
    : data.students.filter(x => x.id === targetId);

  if (studentsToPrint.length === 0) {
    return <div className="p-10 text-center text-red-500 font-bold">RALAT: Data Pelajar Tidak Dijumpai</div>;
  }

  const schoolName = data.settings?.schoolName || "SMK SULTAN AHMAD SHAH";
  const BOMBA_LOGO = data.settings?.bombaLogoUrl || "https://upload.wikimedia.org/wikipedia/commons/8/87/Jabatan_Bomba_dan_Penyelamat_Malaysia.png";

  return (
    <div className="print-all-wrapper">
      {studentsToPrint.map((s, index) => (
        <div 
          key={s.id} 
          className="w-full relative bg-white font-serif text-black leading-[1.4] p-[5mm_10mm] box-border" 
          style={{ 
            pageBreakAfter: index === studentsToPrint.length - 1 ? 'auto' : 'always',
            minHeight: '270mm'
          }}
        >
          {/* Label Lampiran */}
          <div className="w-full flex justify-end mb-2">
             <div className="font-bold text-[10pt]">
               Lampiran B
             </div>
          </div>

          {/* Header with Logo */}
          <div className="flex flex-col items-center mb-4">
            <img src={BOMBA_LOGO} alt="Logo JBPM" className="h-20 w-auto object-contain mb-2" />
            <h2 className="text-[12pt] font-bold text-center">JABATAN BOMBA DAN PENYELAMAT MALAYSIA</h2>
            <h3 className="text-[11pt] text-center">(Borang Pelepasan Tanggungjawab)</h3>
          </div>

          {/* Content */}
          <div className="text-[11pt] space-y-4">
            
            {/* Nama Waris */}
            <div className="relative pt-2">
              <div className="flex items-baseline">
                <span>Saya</span>
                <span className="flex-1 border-b border-black border-dotted mx-2 text-center font-bold uppercase min-h-[20px]">
                  {s.namaWaris || ''}
                </span>
                <span>No. Kad Pengenalan</span>
                <span className="w-[180px] border-b border-black border-dotted ml-2 text-center font-bold min-h-[20px]">
                  {s.noKPWaris || ''}
                </span>
              </div>
              <div className="flex justify-center mt-0.5">
                <span className="text-[9pt] italic">(Nama ibu bapa/penjaga)</span>
              </div>
            </div>

            {/* Alamat */}
            <div className="space-y-2">
              <div className="flex items-baseline">
                <span>Beralamat</span>
                <span className="flex-1 border-b border-black border-dotted ml-2 font-bold uppercase min-h-[20px]">
                  {s.alamatWaris || s.alamat || ''}
                </span>
              </div>
              <div className="border-b border-black border-dotted w-full h-[20px]"></div>
            </div>

            {/* Nama Pelajar */}
            <div className="relative pt-2">
              <div className="flex items-baseline">
                <span>dengan ini membenarkan</span>
                <span className="flex-1 border-b border-black border-dotted ml-2 text-center font-bold uppercase min-h-[20px]">
                  {s.nama}
                </span>
              </div>
              <div className="flex justify-center mt-0.5">
                <span className="text-[9pt] italic">( Nama Pelajar )</span>
              </div>
            </div>

            <div className="text-center font-bold">
              menyertai:
            </div>

            {/* School Name Section */}
            <div className="flex flex-col items-center space-y-1">
              <h2 className="text-[11pt] font-bold text-center uppercase">PASUKAN KADET BOMBA DAN PENYELAMAT MALAYSIA DI</h2>
              <div className="w-full border-b border-black border-dotted h-[20px] text-center font-bold uppercase text-[11pt]">
                {schoolName}
              </div>
              <div className="text-[9pt] italic">( Nama sekolah )</div>
            </div>

            {/* Paragraphs */}
            <div className="text-justify space-y-3 pt-2">
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

            {/* Footer */}
            <div className="flex justify-between items-end pt-8">
              <div className="flex items-baseline">
                <span>Tarikh:</span>
                <span className="w-[180px] border-b border-black border-dotted ml-2 text-center font-bold min-h-[20px]">
                  {new Date().toLocaleDateString('ms-MY')}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-[220px] border-b border-black border-dotted h-[20px]"></div>
                <div className="text-[10pt] mt-1">( Ibu / Bapa / Penjaga )</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrintLampiranB;
