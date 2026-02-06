import React from 'react';
import { SystemData } from '../../../types';

interface Props {
  data: SystemData;
}

const BombaHeader: React.FC<Props> = ({ data }) => {
  // URL Logo JBPM (Guna Custom jika ada, jika tidak guna Default CDN)
  const BOMBA_LOGO = data.settings?.bombaLogoUrl || "https://upload.wikimedia.org/wikipedia/commons/8/87/Jabatan_Bomba_dan_Penyelamat_Malaysia.png";

  return (
    <div className="w-full mb-6 text-center font-serif uppercase break-inside-avoid page-break-inside-avoid">
       <div className="flex justify-center mb-3">
          <img src={BOMBA_LOGO} alt="Logo JBPM" className="h-24 w-auto object-contain" />
       </div>
       <h2 className="text-[12pt] font-bold text-black">JABATAN BOMBA DAN PENYELAMAT MALAYSIA</h2>
       <h3 className="text-[11pt] font-bold text-black">PASUKAN KADET BOMBA DAN PENYELAMAT MALAYSIA</h3>
       <div className="border-b-2 border-black w-full mt-4"></div>
    </div>
  );
};

export default BombaHeader;