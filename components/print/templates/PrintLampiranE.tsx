import React from 'react';
import { SystemData, JawatanGuru } from '../../../types';
import BombaHeader from '../headers/BombaHeader';

interface Props {
  data: SystemData;
}

const PrintLampiranE: React.FC<Props> = ({ data }) => {
  const currentYear = new Date().getFullYear();
  const penasihat = data.teachers.find(t => t.jawatan === JawatanGuru.Penasihat);
  const pengetua = data.teachers.find(t => t.jawatan.includes('Pengetua') || t.jawatan.includes('Guru Besar'));

  const DocumentTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="text-center mb-6 font-serif uppercase text-black break-inside-avoid page-break-inside-avoid">
        <h2 className="text-[11pt] font-bold underline">{title}</h2>
        {subtitle && <p className="text-[10pt] font-bold mt-1">{subtitle}</p>}
    </div>
  );

  return (
    <div className="w-full h-[297mm] relative bg-white font-serif text-black leading-[1.15] p-8 box-border" style={{ pageBreakAfter: 'always' }}>
      <BombaHeader data={data} />
      
      {/* Label Lampiran */}
      <div className="w-full flex justify-end mt-2 mb-1">
         <div className="font-bold text-[9pt] border border-black p-1 px-3">
           Lampiran E
         </div>
      </div>

      <DocumentTitle title="BORANG PERMOHONAN PENUBUHAN / PEMBAHARUAN PASUKAN" />
      
      <div className="text-[10pt] px-2 font-serif text-black leading-relaxed">
           
           <div className="mb-6 p-3 border border-black bg-gray-50">
              <p className="font-bold underline mb-2 text-[9pt]">JENIS PERMOHONAN (SILA TANDAKAN):</p>
              <div className="flex gap-16">
                 <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border border-black flex items-center justify-center font-bold"></div>
                    <span className="font-bold uppercase text-[9pt]">Penubuhan Baru</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border border-black flex items-center justify-center font-bold">/</div>
                    <span className="font-bold uppercase text-[9pt]">Pembaharuan (Tahun {currentYear})</span>
                 </div>
              </div>
           </div>

           <p className="text-justify indent-10 mb-3 leading-[1.6]">
             Bahawasanya kami guru-guru dan pelajar-pelajar sekolah ini memohon menubuhkan / memperbaharui pendaftaran 
             <strong> Pasukan Kadet Bomba dan Penyelamat Malaysia</strong>.
           </p>
           
           <p className="text-justify indent-10 mb-3 leading-[1.6]">
             Kami berjanji akan mematuhi segala peraturan dan undang-undang yang ditetapkan oleh Jabatan Bomba dan Penyelamat Malaysia 
             serta Kementerian Pendidikan Malaysia dan akan melaksanakan aktiviti-aktiviti yang dirancang dengan penuh tanggungjawab.
           </p>

           <div className="mt-12">
              <div>
                 <p className="font-bold">Pemohon (Guru Penasihat):</p>
                 <div className="h-20 border-b border-black mt-2 w-[300px]"></div>
                 <p className="mt-1 font-bold uppercase text-[10pt]">({penasihat?.nama || '...........................................'})</p>
                 <p className="text-[10pt] mt-1">Tarikh: <span className="font-bold border-b border-black px-2">{new Date().toLocaleDateString('ms-MY')}</span></p>
              </div>
           </div>

           <div className="mt-10 border-t-2 border-black pt-6">
              <p className="font-bold underline mb-3 text-[10pt]">ULASAN PENGETUA / GURU BESAR:</p>
              <div className="border border-black p-4 h-32 mb-4 relative bg-gray-50/50">
                 <p className="text-justify leading-relaxed text-[10pt] italic">
                    "Saya menyokong penuh permohonan ini dan mengesahkan bahawa sekolah ini mempunyai kemudahan asas serta komitmen untuk menjalankan aktiviti pasukan ini dengan jayanya."
                 </p>
                 <div className="absolute bottom-2 left-3 font-bold italic text-[8pt] text-gray-500">( Ruang Ulasan Tambahan )</div>
              </div>

              <div className="flex justify-end mt-10">
                 <div className="text-center w-[300px]">
                    <div className="h-20 border-b border-black"></div>
                    <p className="text-[10pt] font-bold uppercase mt-1">({pengetua?.nama || '...........................................'})</p>
                    <p className="uppercase font-bold text-[9pt] mt-1">COP RASMI SEKOLAH</p>
                 </div>
              </div>
           </div>
      </div>
    </div>
  );
};

export default PrintLampiranE;