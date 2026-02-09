import React from 'react';
import { SystemData } from '../../../types';
import BombaHeader from '../headers/BombaHeader';

interface Props {
  data: SystemData;
}

const PrintLampiranD: React.FC<Props> = ({ data }) => {
  const schoolName = data.settings?.schoolName || "SMK SULTAN AHMAD SHAH";

  return (
    <div className="w-full h-[297mm] relative bg-white font-serif text-black leading-[1.15] p-8 box-border" style={{ pageBreakAfter: 'always' }}>
      <BombaHeader data={data} />
      
      {/* Label Lampiran */}
      <div className="w-full flex justify-end mt-2 mb-1">
         <div className="font-bold text-[9pt] border border-black p-1">
           Lampiran D
         </div>
      </div>

      <div className="text-center font-bold text-[11pt] mt-2 mb-1">
        SURAT SOKONGAN PENUBUHAN PASUKAN KADET BOMBA
      </div>
      <div className="text-center font-bold text-[9pt] mb-6">
        (MENGGUNAKAN KEPALA SURAT JABATAN / BALAI)
      </div>

      <div className="grid grid-cols-[1fr_250px] gap-8 px-4 text-[10pt]">
        <div>
          <div className="border-b border-black h-5 w-3/4"></div>
          <div className="border-b border-black h-5 w-3/4 mt-1"></div>
          <div className="mt-4 font-bold">Tuan / Puan</div>
        </div>

        <div>
          <div className="grid grid-cols-[90px_1fr] items-end">
            <div>Rujukan Tuan</div>
            <div className="font-bold">: .......................................</div>
          </div>
          <div className="grid grid-cols-[90px_1fr] items-end mt-1">
            <div>Rujukan Kami</div>
            <div className="font-bold">: .......................................</div>
          </div>
          <div className="grid grid-cols-[90px_1fr] items-end mt-1">
            <div>Tarikh</div>
            <div className="font-bold">: {new Date().toLocaleDateString('ms-MY')}</div>
          </div>
        </div>
      </div>

      <div className="border border-black p-6 mt-6 mx-auto w-full">
        <div className="text-center font-bold text-[10pt] mb-4">
          SURAT SOKONGAN / TIDAK SOKONG PENUBUHAN PASUKAN<br/>
          KADET BOMBA DAN PENYELAMAT MALAYSIA
        </div>

        <div className="text-justify leading-relaxed text-[10pt]">
          Merujuk perkara di atas dimaklumkan bahawa Penubuhan Pasukan Kadet Bomba di Sekolah / Institusi tuan 
          (<span className="font-bold uppercase">{schoolName}</span>) adalah:-
          <div className="my-3 pl-4 font-bold italic">
            .......................................................................................................................................
            <br/>(Sokong / Tidak Sokong)
          </div>
        </div>

        <div className="mt-3 text-[10pt]">
          2.&nbsp;&nbsp;&nbsp;Pihak tuan dikehendaki melengkapkan perkara-perkara berikut:
          <div className="ml-6 mt-1 space-y-1">
            <div>2.1 Borang kebenaran Ibu / Bapa / Penjaga (Lampiran B)</div>
            <div>2.2 Borang Permohonan Penubuhan Pasukan Kadet Bomba Malaysia (Lampiran E)</div>
            <div>2.3 Borang Pendaftaran Ahli Kadet Bomba Malaysia (Lampiran F)</div>
            <div>2.4 .......................................................................................................................................</div>
          </div>
        </div>

        <div className="mt-4 text-[10pt]">Sekian terima kasih.</div>

        <div className="mt-4 font-bold text-[10pt] uppercase">"BERKHIDMAT UNTUK NEGARA"</div>

        <div className="mt-4 text-[10pt]">Saya yang menjalankan amanah,</div>

        <div className="mt-12 ml-4">
          <div className="border-b border-dotted border-black w-[250px]"></div>
          <div className="mt-1 text-[10pt]">( <span className="inline-block w-[230px]"></span> )</div>
          <div className="font-bold mt-0.5 text-[10pt]">Ketua Balai</div>
          <div className="text-[10pt]">Balai Bomba dan Penyelamat</div>
        </div>
      </div>
    </div>
  );
};

export default PrintLampiranD;