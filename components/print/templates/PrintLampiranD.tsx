import React from 'react';
import { SystemData } from '../../../types';
import BombaHeader from '../headers/BombaHeader';

interface Props {
  data: SystemData;
}

const PrintLampiranD: React.FC<Props> = ({ data }) => {
  const BOMBA_LOGO = data.settings?.bombaLogoUrl || "https://upload.wikimedia.org/wikipedia/commons/8/87/Jabatan_Bomba_dan_Penyelamat_Malaysia.png";

  return (
    <div className="w-full min-h-[297mm] relative bg-white font-serif text-black leading-[1.2] p-8 box-border" style={{ pageBreakAfter: 'always' }}>
      
      {/* Header Outside Box */}
      <div className="text-center mb-4">
        <div className="font-bold text-[11pt]">Lampiran D:</div>
        <div className="text-[10pt]">Surat Sokongan Penubuhan Pasukan Kadet Bomba</div>
      </div>

      {/* Main Content Box */}
      <div className="border border-black p-6 w-full min-h-[240mm] flex flex-col">
        
        {/* Box Header */}
        <div className="flex items-center mb-2 relative">
          <img src={BOMBA_LOGO} alt="Logo JBPM" className="h-16 w-auto object-contain absolute left-0" />
          <div className="w-full text-center font-bold text-[11pt] px-20">
            MENGGUNAKAN KEPALA SURAT JABATAN / BALAI
          </div>
        </div>
        
        <div className="border-b border-black w-full mb-6"></div>

        {/* References and Date */}
        <div className="flex justify-end mb-6">
          <div className="text-[10pt] space-y-1 w-[250px]">
            <div className="flex justify-between">
              <span>Rujukan Tuan</span>
              <span>: ...........................</span>
            </div>
            <div className="flex justify-between">
              <span>Rujukan Kami</span>
              <span>: ...........................</span>
            </div>
            <div className="flex justify-between">
              <span>Tarikh</span>
              <span>: ...........................</span>
            </div>
          </div>
        </div>

        {/* Recipient Address Lines */}
        <div className="mb-8 text-[10pt] space-y-1">
          <div className="w-[200px] border-b border-black h-4"></div>
          <div className="w-[200px] border-b border-black h-4"></div>
          <div className="w-[200px] border-b border-black h-4"></div>
        </div>

        {/* Salutation */}
        <div className="mb-6 text-[10pt]">Tuan / Puan</div>

        {/* Subject */}
        <div className="mb-6 text-[10pt] font-bold uppercase">
          SURAT SOKONGAN / TIDAK SOKONG PENUBUHAN PASUKAN<br/>
          KADET BOMBA MALAYSIA
        </div>

        {/* Body Paragraph */}
        <div className="mb-6 text-[10pt] text-justify">
          Merujuk perkara di atas dimaklumkan bahawa Penubuhan Pasukan Kadet Bomba di Sekolah / Institusi tuan adalah ...................................
        </div>

        {/* Numbered List */}
        <div className="mb-6 text-[10pt]">
          <div className="flex gap-2">
            <span>2.</span>
            <span>Pihak tuan dikehendaki melengkapkan perkara-perkara berikut:</span>
          </div>
          <div className="ml-8 mt-2 space-y-2">
            <div className="flex gap-4">
              <span>2.1</span>
              <span>Borang Kebenaran Ibu / Bapa / Penjaga</span>
            </div>
            <div className="flex gap-4">
              <span>2.2</span>
              <span>Borang Permohonan Penubuhan Pasukan Kadet Bomba Malaysia.</span>
            </div>
            <div className="flex gap-4">
              <span>2.3</span>
              <span>Borang Pendaftaran Ahli Kadet Bomba Malaysia.</span>
            </div>
            <div className="flex gap-4">
              <span>2.4</span>
              <span className="flex-1 border-b border-black border-dotted h-4"></span>
            </div>
          </div>
        </div>

        {/* Closing */}
        <div className="mb-6 text-[10pt]">Sekian terima kasih.</div>

        {/* Motto */}
        <div className="mb-6 text-[10pt] font-bold uppercase">"BERKHIDMAT UNTUK NEGARA"</div>

        {/* Signature Area */}
        <div className="mt-auto">
          <div className="text-[10pt] mb-12">Saya yang menjalankan amanah</div>
          
          <div className="w-[250px] border-b border-black border-dotted mb-1"></div>
          <div className="text-[10pt] mb-1">( <span className="inline-block w-[200px]"></span> )</div>
          <div className="text-[10pt]">Ketua Balai</div>
          <div className="text-[10pt]">Balai Bomba dan Penyelamat</div>
        </div>

      </div>
    </div>
  );
};

export default PrintLampiranD;