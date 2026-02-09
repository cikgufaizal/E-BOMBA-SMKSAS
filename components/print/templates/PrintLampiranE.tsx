import React from 'react';
import { SystemData, JawatanGuru } from '../../../types';
import SchoolHeader from '../headers/SchoolHeader';

interface Props {
  data: SystemData;
}

const PrintLampiranE: React.FC<Props> = ({ data }) => {
  const currentYear = new Date().getFullYear();
  const penasihat = data.teachers.find(t => t.jawatan === JawatanGuru.Penasihat);
  const pengetua = data.teachers.find(t => t.jawatan.includes('Pengetua') || t.jawatan.includes('Guru Besar'));

  const DocumentTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="text-center mb-8 font-serif uppercase text-black break-inside-avoid page-break-inside-avoid">
        <h2 className="text-[12pt] font-bold underline">{title}</h2>
        {subtitle && <p className="text-[11pt] font-bold mt-1">{subtitle}</p>}
    </div>
  );

  return (
    <div className="w-full h-[297mm] relative bg-white font-serif text-black leading-tight p-8 box-border" style={{ pageBreakAfter: 'always' }}>
      <SchoolHeader data={data} />
      
      <div className="absolute right-8 top-[35mm] font-bold text-[10pt] border border-black p-1">
        Lampiran E
      </div>

      <DocumentTitle title="BORANG PERMOHONAN PENUBUHAN / PEMBAHARUAN PASUKAN" />
      
      <div className="text-[11pt] px-4 font-serif text-black leading-relaxed">
           
           <div className="mb-8 p-4 border border-black bg-gray-50/50">
              <p className="font-bold underline mb-3">JENIS PERMOHONAN (SILA TANDAKAN):</p>
              <div className="flex gap-16">
                 <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border border-black"></div>
                    <span className="font-bold uppercase">Penubuhan Baru</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border border-black flex items-center justify-center font-bold"></div>
                    <span className="font-bold uppercase">Pembaharuan (Tahun {currentYear})</span>
                 </div>
              </div>
           </div>

           <p className="text-justify indent-12 mb-4 leading-loose">
             Bahawasanya kami guru-guru dan pelajar-pelajar sekolah ini memohon menubuhkan / memperbaharui pendaftaran 
             <strong> Pasukan Kadet Bomba dan Penyelamat Malaysia</strong>.
           </p>
           
           <p className="text-justify indent-12 mb-4 leading-loose">
             Kami berjanji akan mematuhi segala peraturan dan undang-undang yang ditetapkan oleh Jabatan Bomba dan Penyelamat Malaysia 
             serta Kementerian Pendidikan Malaysia dan akan melaksanakan aktiviti-aktiviti yang dirancang dengan penuh tanggungjawab.
           </p>

           <div className="mt-16 grid grid-cols-2 gap-10">
              <div>
                 <p className="font-bold">Pemohon (Guru Penasihat):</p>
                 <div className="h-24 border-b border-black mt-2"></div>
                 <p className="mt-2 font-bold uppercase">({penasihat?.nama || '...........................................'})</p>
                 <p>Tarikh: ..............................</p>
              </div>
           </div>

           <div className="mt-12 border-t-2 border-black pt-8">
              <p className="font-bold underline mb-4">ULASAN PENGETUA / GURU BESAR:</p>
              <div className="border border-black p-4 h-40 mb-6 relative">
                 <p className="text-justify leading-loose">
                    Saya menyokong penuh permohonan ini dan mengesahkan bahawa sekolah ini mempunyai kemudahan asas serta komitmen untuk menjalankan aktiviti pasukan ini dengan jayanya.
                 </p>
                 <div className="absolute bottom-4 left-4 font-bold italic text-sm">( Sila tambah ulasan jika perlu )</div>
              </div>

              <div className="flex justify-end mt-16">
                 <div className="text-center w-[300px]">
                    <div className="h-24 border-b border-black"></div>
                    <p className="text-[11pt] font-bold uppercase mt-2">({pengetua?.nama || '...........................................'})</p>
                    <p className="uppercase font-bold">COP RASMI SEKOLAH</p>
                 </div>
              </div>
           </div>
      </div>
    </div>
  );
};

export default PrintLampiranE;