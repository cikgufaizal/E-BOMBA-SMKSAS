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
    <span className="font-bold font-mono text-lg">{val ? "(/)" : "( )"}</span>
  );
  
  const CheckNo = ({ val }: { val: boolean }) => (
    <span className="font-bold font-mono text-lg">{!val ? "(/)" : "( )"}</span>
  );

  const FieldRow = ({ num, label, value }: any) => (
    <div className="flex items-end gap-4 mt-3">
      <div className="w-[30px] text-[11pt] font-bold">{num}.</div>
      <div className="w-[180px] text-[11pt]">{label}</div>
      <div className="flex-1 border-b border-black border-dotted px-2 font-bold uppercase text-[11pt] leading-none pb-1 relative top-1">
        {value}
      </div>
    </div>
  );

  return (
    <div className="w-full h-[297mm] relative bg-white font-serif text-black leading-tight p-8 box-border" style={{ pageBreakAfter: 'always' }}>
      <BombaHeader data={data} />

      <div className="absolute right-8 top-[35mm] font-bold text-[10pt] border border-black p-1 px-3">
        Lampiran A
      </div>

      <div className="text-center mt-6 mb-8">
         <h2 className="text-[14pt] font-bold tracking-wide underline">BORANG MAKLUMAT PERIBADI</h2>
         <div className="text-[10pt] font-bold mt-1 uppercase">PASUKAN KADET BOMBA DAN PENYELAMAT MALAYSIA</div>
      </div>

      <div className="px-2">
         <FieldRow num="1" label="Nama Penuh" value={s.nama} />
         <FieldRow num="2" label="No. Kad Pengenalan" value={s.noKP} />
         <FieldRow num="3" label="Nama Sekolah" value={schoolName} />
         <FieldRow num="4" label="Alamat Rumah" value={s.alamat || ''} />
         
         <div className="grid grid-cols-2 gap-8 mt-2">
            <FieldRow num="5" label="Umur" value={`${s.umur || ''} TAHUN`} />
            <FieldRow num="6" label="Jantina" value={s.jantina} />
         </div>
         
         <div className="grid grid-cols-2 gap-8 mt-2">
            <FieldRow num="7" label="Tingkatan" value={`${s.tingkatan} ${s.kelas}`} />
            <FieldRow num="8" label="Bangsa" value={s.kaum} />
         </div>

         <div className="mt-8 border-t-2 border-black pt-6">
            <div className="flex items-start gap-2 text-[11pt]">
               <div className="w-[30px] font-bold">9.</div>
               <div className="font-bold flex-1">
                  PENGAKUAN KESIHATAN:
                  <br/>
                  <span className="text-[10pt] font-normal italic">Adakah anda mempunyai penyakit berikut? (Tandakan / Pada yang berkenaan)</span>
               </div>
            </div>

            <div className="mt-4 border border-black">
                {/* Table Header */}
                <div className="flex border-b border-black bg-gray-100">
                    <div className="flex-1 p-2 border-r border-black font-bold text-center">JENIS PENYAKIT</div>
                    <div className="w-[100px] p-2 border-r border-black font-bold text-center">ADA</div>
                    <div className="w-[100px] p-2 font-bold text-center">TIADA</div>
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
                   <div key={d.k} className={`flex ${i !== 6 ? 'border-b border-black' : ''}`}>
                      <div className="flex-1 p-2 pl-4 border-r border-black uppercase text-[10pt]">{d.l}</div>
                      <div className="w-[100px] p-1 border-r border-black text-center flex items-center justify-center bg-red-50">
                          <Check val={(s.health?.[d.k as keyof typeof s.health] as boolean) || false} />
                      </div>
                      <div className="w-[100px] p-1 text-center flex items-center justify-center bg-green-50">
                          <CheckNo val={(s.health?.[d.k as keyof typeof s.health] as boolean) || false} />
                      </div>
                   </div>
                 ))}
            </div>

            <div className="mt-4 flex gap-4 items-end">
               <div className="text-[11pt] font-bold">Jika ADA, sila nyatakan:</div>
               <div className="flex-1 border-b border-black border-dotted h-6 uppercase font-bold text-[11pt]">{s.masalahKesihatan || 'TIADA'}</div>
            </div>
             <div className="mt-2 flex gap-4 items-end">
               <div className="text-[11pt] font-bold">Kecacatan (Jika ada):</div>
               <div className="flex-1 border-b border-black border-dotted h-6 uppercase font-bold text-[11pt]">{s.health?.kecacatan || 'TIADA'}</div>
            </div>
         </div>

         <div className="mt-8 text-[11pt] leading-relaxed text-justify bg-gray-50 p-4 border border-black rounded-lg">
            "Saya dengan ini mengaku bahawa maklumat yang diberikan di atas adalah benar. Saya sihat tubuh badan dan bersedia untuk menyertai segala aktiviti yang dianjurkan oleh Pasukan Kadet Bomba dan Penyelamat Malaysia dengan kerelaan saya sendiri."
         </div>

         <div className="mt-12 flex justify-between items-end">
            <div className="text-[11pt]">
               Tarikh: <span className="font-bold">{new Date().toLocaleDateString('ms-MY')}</span>
            </div>

            <div className="text-center w-[250px]">
               <div className="border-b border-black h-16 w-full mb-2"></div>
               <div className="text-[10pt] font-bold uppercase">({s.nama})</div>
               <div className="text-[9pt] italic">Tandatangan Pelajar</div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default PrintLampiranA;