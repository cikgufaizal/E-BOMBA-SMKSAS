import React from 'react';
import { SystemData, ReportType, Student } from '../../../types';
import BombaHeader from '../headers/BombaHeader';
import SchoolHeader from '../headers/SchoolHeader';

interface Props {
  data: SystemData;
  type: ReportType;
  targetId?: string;
}

const PrintBorangBomba: React.FC<Props> = ({ data, type, targetId }) => {
  const currentYear = new Date().getFullYear();

  // Helper untuk tajuk
  const DocumentTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="text-center mb-6 font-serif uppercase text-black break-inside-avoid page-break-inside-avoid">
        <h2 className="text-[12pt] font-bold underline">{title}</h2>
        {subtitle && <p className="text-[11pt] font-bold mt-1">{subtitle}</p>}
    </div>
  );

  // KANDUNGAN LAMPIRAN A (PENDAFTARAN)
  const renderLampiranA = () => {
    const s = data.students.find(x => x.id === targetId);
    if (!s) return <div>Data Pelajar Tidak Dijumpai</div>;

    const schoolName = data.settings?.schoolName || "SMK SULTAN AHMAD SHAH";
    
    // Helper untuk checkmark
    const Check = ({ val }: { val: boolean }) => (
      <span className="font-bold">{val ? "(/)" : "( )"}</span>
    );
    
    // Helper untuk inverse checkmark (untuk kolom TIADA)
    const CheckNo = ({ val }: { val: boolean }) => (
      <span className="font-bold">{!val ? "(/)" : "( )"}</span>
    );

    const FieldRow = ({ num, label, value, isDotted = true }: any) => (
      <div className="flex items-end gap-2 mt-2">
        <div className="w-[28px] text-[11pt]">{num}.</div>
        <div className="w-[160px] text-[11pt]">{label}</div>
        <div className={`flex-1 ${isDotted ? 'border-b border-black border-dotted' : 'border-b border-black'} px-2 font-bold uppercase text-[11pt] leading-none pb-1`}>
          {value}
        </div>
      </div>
    );

    return (
      <div className="font-sans text-black leading-tight w-full max-w-[210mm] mx-auto pt-4 pb-10">
        <div className="flex justify-between items-start">
           <div></div>
           <div className="text-[10pt] text-slate-600">Lampiran A</div>
        </div>

        <div className="text-center mt-2 mb-8">
           <h2 className="text-[13pt] font-bold tracking-wide">BORANG MAKLUMAT PERIBADI</h2>
           <div className="text-[10pt] font-bold text-gray-600 mt-1 uppercase">PASUKAN KADET BOMBA DAN PENYELAMAT MALAYSIA</div>
        </div>

        <div className="mt-5">
           <FieldRow num="1" label="Nama" value={s.nama} />
           <FieldRow num="2" label="No. K/P" value={s.noKP} />
           <FieldRow num="3" label="Nama Sekolah" value={schoolName} />
           <FieldRow num="4" label="Alamat" value={s.alamat || ''} />
           
           <div className="border-b border-black my-4 h-[1px]"></div>

           <FieldRow num="5" label="Umur" value={`${s.umur || ''} TAHUN`} />
           <FieldRow num="6" label="Tahap" value={s.tahap || ''} />
           <FieldRow num="7" label="Tingkatan" value={`${s.tingkatan} ${s.kelas}`} />

           <div className="mt-4">
              <div className="flex items-start gap-2 text-[11pt]">
                 <div className="w-[28px]">8.</div>
                 <div className="font-bold">
                    Adakah anda mempunyai penyakit:-
                    <span className="text-[9pt] font-normal block text-gray-600">(Tandakan / Pada yang berkenaan)</span>
                 </div>
              </div>

              <div className="flex mt-3 mb-2 text-[11pt]">
                 <div className="flex-1"></div>
                 <div className="w-[90px] text-center font-bold">ADA</div>
                 <div className="w-[90px] text-center font-bold">TIADA</div>
              </div>

              <div className="space-y-2 text-[11pt]">
                 {[
                   { l: 'a. Asma', k: 'asma' },
                   { l: 'b. Lelah / Batuk Kering / TB', k: 'lelahTB' },
                   { l: 'c. Kencing Manis', k: 'kencingManis' },
                   { l: 'd. Darah Tinggi', k: 'darahTinggi' },
                   { l: 'e. Masalah Penglihatan', k: 'penglihatan' },
                   { l: 'f. Masalah Pendengaran', k: 'pendengaran' },
                 ].map((d) => (
                   <div key={d.k} className="flex items-center">
                      <div className="flex-1 pl-[28px]">{d.l}</div>
                      <div className="w-[90px] text-center"><Check val={(s.health?.[d.k as keyof typeof s.health] as boolean) || false} /></div>
                      <div className="w-[90px] text-center"><CheckNo val={(s.health?.[d.k as keyof typeof s.health] as boolean) || false} /></div>
                   </div>
                 ))}
                 
                 <div className="flex items-start">
                    <div className="flex-1 pl-[28px]">
                      g. Penyakit Kronik lain Daripada<br/>
                      <span className="text-[9pt] text-gray-600">Yang tersenarai di Atas</span>
                    </div>
                    <div className="w-[90px] text-center pt-2"><Check val={s.health?.kronikLain || false} /></div>
                    <div className="w-[90px] text-center pt-2"><CheckNo val={s.health?.kronikLain || false} /></div>
                 </div>
              </div>

              <div className="mt-3 pl-[28px]">
                 <div className="text-[10pt] text-gray-600 mb-1">Nyatakan:</div>
                 <div className="border-b border-dotted border-black h-5 uppercase font-bold text-[11pt]">{s.masalahKesihatan || ''}</div>
              </div>

              <div className="mt-4 pl-[28px]">
                 <div className="text-[11pt]">h. Kecacatan dan Lain-lain</div>
                 <div className="border-b border-dotted border-black h-5 mt-1 uppercase font-bold text-[11pt]">{s.health?.kecacatan || ''}</div>
              </div>
           </div>

           <div className="mt-6 text-[11pt] leading-normal pl-[28px]">
              Saya mengaku bahawa saya sihat dan berminat menyertai Pasukan Kadet<br/>
              Bomba dan Penyelamat Malaysia.
           </div>

           <div className="mt-6 pl-[28px]">
              <div className="mb-8 text-[11pt]">
                 Tarikh: <span className="border-b border-black inline-block w-[180px] text-center font-bold">{new Date().toLocaleDateString('en-GB')}</span>
              </div>

              <div className="flex justify-end mt-8">
                 <div className="text-center">
                    <div className="border-b border-black w-[240px] mb-2"></div>
                    <div className="text-[10pt] text-gray-600">Tandatangan / Nama Kadet</div>
                    <div className="text-[10pt] font-bold uppercase">({s.nama})</div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  };

  // KANDUNGAN LAMPIRAN B (PELEPASAN TANGGUNGJAWAB)
  const renderLampiranB = () => {
    const s = data.students.find(x => x.id === targetId);
    if (!s) return <div>Data Pelajar Tidak Dijumpai</div>;

    const schoolName = data.settings?.schoolName || "SMK SULTAN AHMAD SHAH";

    return (
      <div className="font-sans text-black leading-tight w-full max-w-[210mm] mx-auto pt-4 pb-10">
        {/* Top Row */}
        <div className="flex justify-between items-start">
           <div></div>
           <div className="text-[10pt] text-gray-600">Lampiran B</div>
        </div>

        {/* Center Title */}
        <div className="text-center mt-2 mb-8">
           <h2 className="text-[11pt] font-bold tracking-wide">JABATAN BOMBA DAN PENYELAMAT MALAYSIA</h2>
           <div className="text-[10pt] text-gray-600 mt-1">(Borang Pelepasan Tanggungjawab)</div>
        </div>

        {/* Content */}
        <div className="mt-6 text-[10pt]">
           
           <div className="mb-1">
             Saya <span className="border-b border-black inline-block min-w-[280px] px-2 font-bold uppercase">{s.namaWaris}</span>
             &nbsp;&nbsp;No. Kad Pengenalan <span className="border-b border-black inline-block min-w-[220px] px-2 font-bold">{s.noKPWaris}</span>
           </div>
           <div className="text-[9pt] text-gray-500 mb-4">(Nama ibu bapa/penjaga)</div>

           <div className="mb-1 flex items-end">
             <span className="whitespace-nowrap mr-2">Beralamat</span>
             <span className="border-b border-black inline-block flex-1 px-2 font-bold uppercase leading-tight">{s.alamatWaris || s.alamat}</span>
           </div>
           <div className="border-b border-black h-[1px] mb-4"></div>

           <div className="mb-1">
             dengan ini membenarkan <span className="border-b border-black inline-block min-w-[300px] px-2 font-bold uppercase">{s.nama}</span>
           </div>
           <div className="text-[9pt] text-gray-500 mb-4">( Nama Pelajar )</div>

           <div className="mb-2">menyertai:</div>

           <div className="text-center mt-2">
              <div className="font-bold text-[10pt]">PASUKAN KADET BOMBA DAN PENYELAMAT MALAYSIA DI</div>
              <div className="mt-2">
                 ( <span className="border-b border-black inline-block min-w-[320px] px-2 font-bold uppercase">{schoolName}</span> )
              </div>
              <div className="text-[9pt] text-gray-500 mt-2">(Nama sekolah)</div>
           </div>

           <div className="mt-6 text-justify leading-relaxed">
             Saya sedar bahawa kebenaran ini meliputi aktiviti-aktiviti, lawatan dan<br/>
             perkhemahan yang dianjurkan oleh sama ada pihak sekolah atau pihak bomba.
             <br/><br/>
             Saya sedar bahawa pihak penganjur akan mengambil segala langkah keselamatan,<br/>
             dengan itu bererti tidak akan mengamalkan sebarang tindakan mahkamah bagi<br/>
             sebarang kejadian yang di luar kawalan pihak penganjur yang mengakibatkan<br/>
             kecacatan sementara dan atau kecacatan kekal dan atau kematian ke atas anak /<br/>
             pelajar jagaan saya semasa dalam perjalanan pergi dan balik untuk menyertai<br/>
             aktiviti dan atau semasa penglibatannya di dalam aktiviti-aktiviti yang dijalankan.
             <br/><br/>
             Saya juga membenarkan anak / pelajar jagaan saya mendapat rawatan perubatan<br/>
             yang sewajarnya sekiranya berlaku kecemasan.
           </div>

           <div className="mt-8">
              <div>
                 Tarikh: <span className="border-b border-black inline-block min-w-[180px] text-center font-bold">{new Date().toLocaleDateString('en-GB')}</span>
              </div>

              <div className="flex justify-end mt-12">
                 <div className="text-center">
                    <div className="border-b border-black w-[260px] mb-2"></div>
                    <div className="text-[9pt] text-gray-500">( Ibu / Bapa / Penjaga )</div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  };

  // KANDUNGAN LAMPIRAN E
  const renderLampiranE = () => {
    return (
      <>
        <DocumentTitle title="PERMOHONAN PENUBUHAN PASUKAN (LAMPIRAN E)" />
        <div className="text-[11pt] space-y-4 px-4 font-serif text-black">
             <p className="text-justify">Bahawasanya kami guru-guru dan pelajar-pelajar sekolah ini memohon menubuhkan Pasukan Kadet Bomba dan Penyelamat Malaysia.</p>
             <div className="mt-8 border border-black p-4 h-32">Ulasan Pengetua:</div>
             <div className="mt-12 text-center w-[250px] ml-auto">
                <div className="h-20 border-b border-black"></div>
                <p className="text-[11pt] font-bold uppercase mt-2">( TANDATANGAN PEMOHON )</p>
             </div>
        </div>
      </>
    );
  };

  // KANDUNGAN LAMPIRAN F
  const renderLampiranF = () => {
    const sortedStudents = [...data.students].sort((a, b) => a.nama.localeCompare(b.nama));
    return (
      <>
         <DocumentTitle title="BORANG PENDAFTARAN KOLEKTIF (LAMPIRAN F)" subtitle={`TAHUN ${currentYear}`} />
         <table className="w-full border-collapse border border-black text-[10pt] font-serif">
          <thead className="table-header-group">
            <tr className="bg-gray-100 font-bold break-inside-avoid page-break-inside-avoid">
              <th className="border border-black p-2 text-center w-[5%]">BIL</th>
              <th className="border border-black p-2 text-left w-[40%]">NAMA PENUH</th>
              <th className="border border-black p-2 text-center w-[15%]">NO. KP</th>
              <th className="border border-black p-2 text-center w-[15%]">NO. KEAHLIAN</th>
              <th className="border border-black p-2 text-center w-[10%]">TINGKATAN</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((s, idx) => (
              <tr key={s.id} className="break-inside-avoid page-break-inside-avoid">
                <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                <td className="border border-black p-1.5 uppercase font-bold">{s.nama}</td>
                <td className="border border-black p-1.5 text-center">{s.noKP}</td>
                <td className="border border-black p-1.5 text-center font-bold">{s.noKeahlian || ''}</td>
                <td className="border border-black p-1.5 text-center uppercase">{s.tingkatan} {s.kelas}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-12 flex justify-between font-serif text-black break-inside-avoid page-break-inside-avoid">
           <div className="text-center w-[250px]">
              <p className="font-bold uppercase text-[11pt]">Disediakan Oleh:</p>
              <div className="h-20 border-b border-black"></div>
              <p className="text-[11pt] font-bold uppercase mt-2">( GURU PENASIHAT )</p>
           </div>
           <div className="text-center w-[250px]">
              <p className="font-bold uppercase text-[11pt]">Disahkan Oleh:</p>
              <div className="h-20 border-b border-black"></div>
              <p className="text-[11pt] font-bold uppercase mt-2">( PENGETUA )</p>
           </div>
        </div>
      </>
    );
  };

  return (
    <div className="w-full">
      {/* 
          LOGIC FIX: 
          - Lampiran A (PENDAFTARAN) ada header sendiri dalam renderLampiranA.
          - Lampiran B (LAMPIRAN_B) ada header sendiri dalam renderLampiranB (text only).
          - Lampiran E guna SchoolHeader.
          - Yang lain guna BombaHeader.
      */}
      {type === 'PENDAFTARAN' || type === 'LAMPIRAN_B' ? null : (type === 'LAMPIRAN_E' ? <SchoolHeader data={data} /> : <BombaHeader data={data} />)}
      
      {type === 'PENDAFTARAN' && renderLampiranA()}
      {type === 'LAMPIRAN_B' && renderLampiranB()}
      {type === 'LAMPIRAN_E' && renderLampiranE()}
      {type === 'LAMPIRAN_F' && renderLampiranF()}
    </div>
  );
};

export default PrintBorangBomba;