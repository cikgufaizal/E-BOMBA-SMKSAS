import React from 'react';
import { SystemData } from '../../../types';
import BombaHeader from '../headers/BombaHeader';

interface Props {
  data: SystemData;
}

const PrintLampiranD: React.FC<Props> = ({ data }) => {
  const currentYear = new Date().getFullYear();
  const schoolName = data.settings?.schoolName || "SMK SULTAN AHMAD SHAH";

  return (
    <div className="w-full font-sans text-black leading-tight">
      {/* Header Balai Bomba kerana ini surat DARI Balai */}
      <BombaHeader data={data} />
      
      <div className="absolute right-0 top-[18mm] font-bold text-[10pt] border border-black p-1">
        Lampiran D
      </div>

      <div className="text-center font-bold text-[11pt] mt-4 mb-2">
        SURAT SOKONGAN PENUBUHAN PASUKAN KADET BOMBA
      </div>
      <div className="text-center font-bold text-[10pt] mb-8">
        (MENGGUNAKAN KEPALA SURAT JABATAN / BALAI)
      </div>

      <div className="grid grid-cols-[1fr_250px] gap-8 px-8 text-[11pt]">
        <div>
          <div className="border-b border-black h-5 w-3/4"></div>
          <div className="border-b border-black h-5 w-3/4 mt-1"></div>
          <div className="mt-4 font-bold">Tuan / Puan</div>
        </div>

        <div>
          <div className="grid grid-cols-[100px_1fr] items-end">
            <div>Rujukan Tuan</div>
            <div className="font-bold">: .......................................</div>
          </div>
          <div className="grid grid-cols-[100px_1fr] items-end mt-2">
            <div>Rujukan Kami</div>
            <div className="font-bold">: .......................................</div>
          </div>
          <div className="grid grid-cols-[100px_1fr] items-end mt-2">
            <div>Tarikh</div>
            <div className="font-bold">: {new Date().toLocaleDateString('ms-MY')}</div>
          </div>
        </div>
      </div>

      <div className="border border-black p-6 mt-8 mx-auto w-[95%]">
        <div className="text-center font-bold text-[11pt] mb-6">
          SURAT SOKONGAN / TIDAK SOKONG PENUBUHAN PASUKAN<br/>
          KADET BOMBA DAN PENYELAMAT MALAYSIA
        </div>

        <div className="text-justify leading-relaxed text-[11pt]">
          Merujuk perkara di atas dimaklumkan bahawa Penubuhan Pasukan Kadet Bomba di Sekolah / Institusi tuan 
          (<span className="font-bold uppercase">{schoolName}</span>) adalah:-
          <div className="my-4 pl-4 font-bold italic">
            .......................................................................................................................................
            <br/>(Sokong / Tidak Sokong)
          </div>
        </div>

        <div className="mt-4 text-[11pt]">
          2.&nbsp;&nbsp;&nbsp;Pihak tuan dikehendaki melengkapkan perkara-perkara berikut:
          <div className="ml-8 mt-2 space-y-1">
            <div>2.1 Borang kebenaran Ibu / Bapa / Penjaga (Lampiran B)</div>
            <div>2.2 Borang Permohonan Penubuhan Pasukan Kadet Bomba Malaysia (Lampiran E)</div>
            <div>2.3 Borang Pendaftaran Ahli Kadet Bomba Malaysia (Lampiran F)</div>
            <div>2.4 .......................................................................................................................................</div>
          </div>
        </div>

        <div className="mt-6 text-[11pt]">Sekian terima kasih.</div>

        <div className="mt-6 font-bold text-[11pt] uppercase">"BERKHIDMAT UNTUK NEGARA"</div>

        <div className="mt-6 text-[11pt]">Saya yang menjalankan amanah,</div>

        <div className="mt-16 ml-4">
          <div className="border-b border-dotted border-black w-[300px]"></div>
          <div className="mt-2">( <span className="inline-block w-[280px]"></span> )</div>
          <div className="font-bold mt-1">Ketua Balai</div>
          <div>Balai Bomba dan Penyelamat</div>
        </div>
      </div>
    </div>
  );
};

export default PrintLampiranD;