import React from 'react';
import { SystemData } from '../../../types';
import BombaHeader from '../headers/BombaHeader';

interface Props {
  data: SystemData;
  targetId?: string;
}

const PrintLampiranA: React.FC<Props> = ({ data, targetId }) => {
  const s = data.students.find(x => x.id === targetId);
  if (!s) return <div className="p-10 text-center text-red-500 font-bold">RALAT: Data Pelajar Tidak Dijumpai</div>;

  const schoolName = data.settings?.schoolName || "SMK SULTAN AHMAD SHAH";
  
  const Check = ({ val }: { val: boolean }) => (
    <span className="font-bold font-mono text-[11pt]">{val ? "(/)" : "( )"}</span>
  );
  
  const CheckNo = ({ val }: { val: boolean }) => (
    <span className="font-bold font-mono text-[11pt]">{!val ? "(/)" : "( )"}</span>
  );

  const FieldRow = ({ num, label, value }: any) => (
    <div className="flex items-end gap-2 mt-1.5 leading-[1.15]">
      <div className="w-[25px] text-[10pt] font-medium">{num}.</div>
      <div className="w-[160px] text-[10pt]">{label}</div>
      <div className="flex-1 border-b border-black border-dotted px-2 font-bold uppercase text-[10pt] relative top-[2px]">
        {value}
      </div>
    </div>
  );

  return (
    <div className="w-full h-[297mm] relative bg-white font-serif text-black p-8 box-border leading-[1.15]" style={{ pageBreakAfter: 'always' }}>
      <BombaHeader data={data} />

      <div className="absolute right-8 top-[30mm] font-bold text-[9pt] border border-black p-1 px-2">
        Lampiran A
      </div>

      <div className="text-center mt-2 mb-4">
         <h2 className="text-[12pt] font-bold tracking-wide underline">BORANG MAKLUMAT PERIBADI</h2>
         <div className="text-[9pt] font-bold mt-0.5 uppercase">PASUKAN KADET BOMBA DAN PENYELAMAT MALAYSIA</div>
      </div>

      <div className="px-2">
         <FieldRow num="1" label="Nama Penuh" value={s.nama} />
         <FieldRow num="2" label="No. Kad Pengenalan" value={s.noKP} />
         <FieldRow num="3" label="Nama Sekolah" value={schoolName} />
         <FieldRow num="4" label="Alamat Rumah" value={s.alamat || ''} />
         
         <div className="grid grid-cols-2 gap-8">
            <FieldRow num="5" label="Umur" value={`${s.umur || ''} TAHUN`} />
            <FieldRow num="6" label="Jantina" value={s.jantina} />
         </div>
         
         <div className="grid grid-cols-2 gap-8">
            <FieldRow num="7" label="Tingkatan" value={`${s.tingkatan} ${s.kelas}`} />
            <FieldRow num="8" label="Bangsa" value={s.kaum} />
         </div>

         <div className="mt-4 border-t border-black pt-2">
            <div className="flex items-start gap-2 text-[10pt]">
               <div className="w-[25px] font-medium">9.</div>
               <div className="font-medium flex-1">
                  PENGAKUAN KESIHATAN:
                  <span className="text-[9pt] font-normal italic ml-2">(Adakah anda mempunyai penyakit berikut? Tandakan / pada yang berkenaan)</span>
               </div>
            </div>

            <div className="mt-2 border border-black text-[9pt]">
                {/* Table Header */}
                <div className="flex border-b border-black bg-gray-50 h-[24px] items-center">
                    <div className="flex-1 px-2 border-r border-black font-bold text-center">JENIS PENYAKIT</div>
                    <div className="w-[60px] border-r border-black font-bold text-center">ADA</div>
                    <div className="w-[60px] font-bold text-center">TIADA</div>
                </div>

                {/* Rows */}
                {[
                   { l: 'a. Asma / Lelah', k: 'asma' },
                   { l: 'b. Batuk Kering / TB', k: 'lelahTB' },
                   { l: 'c. Kencing Manis', k: 'kencingManis' },
                   { l: 'd. Darah Tinggi', k: 'darahTinggi' },
                   { l: 'e. Masalah Penglihatan', k: 'penglihatan' },
                   { l: 'f. Masalah Pendengaran', k: 'pendengaran' },
                   { l: 'g. Penyakit Kronik Lain', k: 'kronikLain' },
                 ].map((d, i) => (
                   <div key={d.k} className={`flex items-center h-[22px] ${i !== 6 ? 'border-b border-black' : ''}`}>
                      <div className="flex-1 px-2 pl-4 border-r border-black uppercase text-[9pt]">{d.l}</div>
                      <div className="w-[60px] border-r border-black text-center flex items-center justify-center">
                          <Check val={(s.health?.[d.k as keyof typeof s.health] as boolean) || false} />
                      </div>
                      <div className="w-[60px] text-center flex items-center justify-center">
                          <CheckNo val={(s.health?.[d.k as keyof typeof s.health] as boolean) || false} />
                      </div>
                   </div>
                 ))}
            </div>

            <div className="mt-2 flex gap-4 items-end">
               <div className="text-[10pt] font-medium w-[150px]">Jika ADA, sila nyatakan:</div>
               <div className="flex-1 border-b border-black border-dotted h-5 uppercase font-bold text-[10pt]">{s.masalahKesihatan || 'TIADA'}</div>
            </div>
             <div className="mt-1 flex gap-4 items-end">
               <div className="text-[10pt] font-medium w-[150px]">Kecacatan (Jika ada):</div>
               <div className="flex-1 border-b border-black border-dotted h-5 uppercase font-bold text-[10pt]">{s.health?.kecacatan || 'TIADA'}</div>
            </div>
         </div>

         <div className="mt-4 text-[10pt] leading-[1.2] text-justify bg-gray-50 p-3 border border-black rounded-sm">
            "Saya dengan ini mengaku bahawa maklumat yang diberikan di atas adalah benar. Saya sihat tubuh badan dan bersedia untuk menyertai segala aktiviti yang dianjurkan oleh Pasukan Kadet Bomba dan Penyelamat Malaysia dengan kerelaan saya sendiri."
         </div>

         <div className="mt-8 flex justify-between items-end">
            <div className="text-[10pt]">
               Tarikh: <span className="font-bold border-b border-black px-2">{new Date().toLocaleDateString('ms-MY')}</span>
            </div>

            <div className="text-center w-[220px]">
               <div className="border-b border-black h-12 w-full mb-1"></div>
               <div className="text-[10pt] font-bold uppercase">({s.nama})</div>
               <div className="text-[9pt] italic">Tandatangan Pelajar</div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default PrintLampiranA;