import React from 'react';
import { SystemData } from '../../../types';
import { SCHOOL_INFO } from '../../../constants';

interface Props {
  data: SystemData;
}

const SchoolHeader: React.FC<Props> = ({ data }) => {
  const schoolName = data.settings?.schoolName || SCHOOL_INFO.name;
  const address = data.settings?.address || SCHOOL_INFO.address;
  const schoolLogo = data.settings?.logoUrl;

  return (
    <div className="w-full mb-6 border-b-2 border-black pb-4 flex items-center gap-6 font-serif break-inside-avoid page-break-inside-avoid">
      <div className="w-24 h-24 shrink-0 flex items-center justify-center">
         {schoolLogo ? (
            <img src={schoolLogo} alt="Logo Sekolah" className="w-full h-full object-contain" />
         ) : (
            <div className="border border-dashed border-black w-20 h-20 flex items-center justify-center text-[8pt] text-center italic">Tiada Logo</div>
         )}
      </div>
      <div className="flex-1 uppercase text-left">
         <h1 className="text-[14pt] font-bold leading-tight tracking-wide text-black">{schoolName}</h1>
         <p className="text-[10pt] font-semibold leading-tight mt-1 text-black">{address}</p>
         <p className="text-[9pt] italic normal-case mt-2 text-black">(Unit Kokurikulum - Pasukan Kadet Bomba)</p>
      </div>
    </div>
  );
};

export default SchoolHeader;