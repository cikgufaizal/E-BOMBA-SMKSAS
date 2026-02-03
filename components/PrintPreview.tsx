import React, { useState, useEffect } from 'react';
import { Printer, ArrowLeft } from 'lucide-react';
import { SystemData, ReportType, JawatanAJK, Jantina, Student, JawatanGuru } from '../types';
import { SCHOOL_INFO } from '../constants';

interface PrintProps {
  type: ReportType;
  data: SystemData;
  targetId?: string;
  onClose: () => void;
}

const PrintPreview: React.FC<PrintProps> = ({ type, data, targetId, onClose }) => {
  const currentYear = new Date().getFullYear();
  
  // State untuk orientasi kertas
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  // Auto-set orientasi
  useEffect(() => {
    if (type === 'KEHADIRAN' || type === 'AHLI') {
      setOrientation('landscape');
    } else {
      setOrientation('portrait');
    }
  }, [type]);

  // MAKLUMAT SEKOLAH
  const schoolName = data.settings?.schoolName || SCHOOL_INFO.name;
  const address = data.settings?.address || SCHOOL_INFO.address;
  const schoolLogo = data.settings?.logoUrl;

  // URL Logo JBPM (Guna Custom jika ada, jika tidak guna Default CDN)
  const BOMBA_LOGO = data.settings?.bombaLogoUrl || "https://upload.wikimedia.org/wikipedia/commons/8/87/Jabatan_Bomba_dan_Penyelamat_Malaysia.png";

  // --- HEADER SEKOLAH (FORMAT SURAT RASMI - LOGO KIRI) ---
  const SchoolHeader = () => (
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

  // --- HEADER BOMBA (FORMAT BORANG - LOGO TENGAH) ---
  const BombaHeader = () => (
    <div className="w-full mb-6 text-center font-serif uppercase break-inside-avoid page-break-inside-avoid">
       <div className="flex justify-center mb-3">
          <img src={BOMBA_LOGO} alt="Logo JBPM" className="h-24 w-auto object-contain" />
       </div>
       <h2 className="text-[12pt] font-bold text-black">JABATAN BOMBA DAN PENYELAMAT MALAYSIA</h2>
       <h3 className="text-[11pt] font-bold text-black">PASUKAN KADET BOMBA DAN PENYELAMAT MALAYSIA</h3>
       <div className="border-b-2 border-black w-full mt-4"></div>
    </div>
  );

  // COMPONENT TAJUK DOKUMEN
  const DocumentTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="text-center mb-6 font-serif uppercase text-black break-inside-avoid page-break-inside-avoid">
        <h2 className="text-[12pt] font-bold underline">{title}</h2>
        {subtitle && <p className="text-[11pt] font-bold mt-1">{subtitle}</p>}
    </div>
  );

  // --- RENDER MODUL: SENARAI AHLI (Guna SchoolHeader) ---
  const renderAhli = () => {
    const sortedStudents = [...data.students].sort((a, b) => a.nama.localeCompare(b.nama));
    return (
      <div className="w-full">
        <SchoolHeader />
        <DocumentTitle 
          title="SENARAI KEHADIRAN / KEAHLIAN PASUKAN" 
          subtitle={`TAHUN ${currentYear}`} 
        />
        <div className="flex justify-between items-end mb-2 text-[10pt] font-bold font-serif text-black break-inside-avoid">
           <p>GURU PENASIHAT: {data.teachers.find(t => t.jawatan === JawatanGuru.Penasihat)?.nama || '................................'}</p>
           <p>JUMLAH AHLI: {sortedStudents.length} ORANG</p>
        </div>
        <table className="w-full border-collapse border border-black text-[10pt] font-serif">
          <thead className="table-header-group">
            <tr className="bg-gray-100 font-bold break-inside-avoid page-break-inside-avoid">
              <th className="border border-black p-2 text-center w-[5%]">BIL</th>
              <th className="border border-black p-2 text-left w-[40%]">NAMA PENUH</th>
              <th className="border border-black p-2 text-center w-[15%]">NO. KP</th>
              <th className="border border-black p-2 text-center w-[10%]">NO. AHLI</th>
              <th className="border border-black p-2 text-center w-[5%]">JANTINA</th>
              <th className="border border-black p-2 text-center w-[10%]">KELAS</th>
              <th className="border border-black p-2 text-center w-[15%]">CATATAN</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((s, idx) => (
              <tr key={s.id} className="break-inside-avoid page-break-inside-avoid">
                <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                <td className="border border-black p-1.5 uppercase font-bold">{s.nama}</td>
                <td className="border border-black p-1.5 text-center">{s.noKP}</td>
                <td className="border border-black p-1.5 text-center font-bold">{s.noKeahlian || '-'}</td>
                <td className="border border-black p-1.5 text-center">{s.jantina === Jantina.Lelaki ? 'L' : 'P'}</td>
                <td className="border border-black p-1.5 text-center uppercase">{s.tingkatan} {s.kelas}</td>
                <td className="border border-black p-1.5"></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-12 flex justify-end font-serif text-black break-inside-avoid page-break-inside-avoid">
           <div className="text-center w-[250px]">
              <p className="font-bold uppercase text-[11pt]">Disahkan Oleh:</p>
              <div className="h-20 border-b border-black"></div>
              <p className="text-[11pt] font-bold uppercase mt-2">( PENGETUA / PK KOKURIKULUM )</p>
           </div>
        </div>
      </div>
    );
  };

  // --- RENDER MODUL: KEHADIRAN (Guna SchoolHeader) ---
  const renderKehadiran = () => {
    const sortedStudents = [...data.students].sort((a, b) => a.nama.localeCompare(b.nama));
    const sortedAttendance = [...data.attendances]
      .sort((a, b) => new Date(a.tarikh).getTime() - new Date(b.tarikh).getTime());
    const meetingSlots = Array.from({ length: 12 }, (_, i) => sortedAttendance[i] || null);
    
    const footerStats = meetingSlots.map(slot => {
       if (!slot) return { hadir: 0, takHadir: 0, total: 0, percent: 0 };
       let hadirCount = 0;
       sortedStudents.forEach(s => { if (slot.presents.includes(s.id)) hadirCount++; });
       const totalAhli = sortedStudents.length;
       const percent = totalAhli > 0 ? Math.round((hadirCount / totalAhli) * 100) : 0;
       return { hadir: hadirCount, takHadir: totalAhli - hadirCount, total: totalAhli, percent };
    });

    return (
      <div className="w-full relative">
        <SchoolHeader />
        <DocumentTitle 
          title="RUMUSAN KEHADIRAN AKTIVITI KOKURIKULUM" 
          subtitle={`TAHUN ${currentYear}`} 
        />
        <table className="w-full border-collapse border border-black text-[9pt] font-serif">
          <thead className="table-header-group">
            <tr className="bg-transparent font-bold text-center break-inside-avoid page-break-inside-avoid">
              <th className="border border-black p-1 w-[3%]" rowSpan={2}>BIL</th>
              <th className="border border-black p-1 text-center" rowSpan={2}>NAMA PELAJAR</th>
              {Array.from({length: 12}).map((_, i) => (
                <th key={i} className="border border-black p-1 w-[2.5%] align-middle bg-gray-50">{i + 1}</th>
              ))}
              <th className="border border-black p-1 w-[4%] text-[8pt] bg-gray-100">JUM<br/>HADIR</th>
              <th className="border border-black p-1 w-[4%] text-[8pt] bg-gray-100">TIDAK<br/>HADIR</th>
              <th className="border border-black p-1 w-[4%] text-[8pt] bg-gray-100">%</th>
              <th className="border border-black p-1 w-[6%] text-[8pt] bg-gray-200">MARKAH<br/>(40%)</th>
            </tr>
            <tr className="text-[8pt] break-inside-avoid page-break-inside-avoid">
               {meetingSlots.map((slot, i) => (
                  <th key={`date-${i}`} className="border border-black h-[60px] align-bottom p-0.5 bg-gray-50">
                     {slot && (
                        <div className="whitespace-nowrap -rotate-90 origin-center translate-y-[-10px]">
                           {slot.tarikh.split('-').reverse().slice(0,2).join('/')}
                        </div>
                     )}
                  </th>
               ))}
               <th className="border border-black bg-gray-100"></th>
               <th className="border border-black bg-gray-100"></th>
               <th className="border border-black bg-gray-100"></th>
               <th className="border border-black bg-gray-200"></th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((s, idx) => {
              let totalPresent = 0;
              data.attendances.forEach(att => { if (att.presents.includes(s.id)) totalPresent++; });
              const totalHeld = data.attendances.length || 1;
              const percent = Math.round((totalPresent / totalHeld) * 100);
              const markah = ((totalPresent / totalHeld) * 40).toFixed(0);

              return (
                <tr key={s.id} className="h-[28px] break-inside-avoid page-break-inside-avoid">
                  <td className="border border-black p-1 text-center">{idx + 1}</td>
                  <td className="border border-black p-1 px-2 uppercase font-semibold text-[9pt] whitespace-nowrap overflow-hidden text-ellipsis max-w-[250px]">{s.nama}</td>
                  {meetingSlots.map((slot, i) => {
                    const isPresent = slot ? slot.presents.includes(s.id) : false;
                    return <td key={i} className="border border-black p-0 text-center font-bold align-middle">{isPresent ? '/' : ''}</td>;
                  })}
                  <td className="border border-black p-1 text-center bg-gray-50 font-bold">{totalPresent}</td>
                  <td className="border border-black p-1 text-center bg-gray-50">{totalHeld - totalPresent}</td>
                  <td className="border border-black p-1 text-center bg-gray-50">{percent}</td>
                  <td className="border border-black p-1 text-center bg-gray-200 font-bold">{markah}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="break-inside-avoid page-break-inside-avoid">
             <tr>
                <td colSpan={2} className="border border-black p-1 text-right font-bold pr-2 bg-gray-50">JUM. HADIR</td>
                {footerStats.map((stat, i) => <td key={i} className="border border-black text-center font-bold text-[9pt] bg-gray-50">{stat.total > 0 ? stat.hadir : ''}</td>)}
                <td colSpan={4} className="border border-black bg-gray-100"></td>
             </tr>
             <tr>
                <td colSpan={2} className="border border-black p-1 text-right font-bold pr-2 bg-gray-50">JUM. TIDAK HADIR</td>
                {footerStats.map((stat, i) => <td key={i} className="border border-black text-center font-bold text-[9pt] bg-gray-50">{stat.total > 0 ? stat.takHadir : ''}</td>)}
                <td colSpan={4} className="border border-black bg-gray-100"></td>
             </tr>
             <tr>
                <td colSpan={2} className="border border-black p-1 text-right font-bold pr-2 bg-gray-50">PERATUS (%)</td>
                {footerStats.map((stat, i) => <td key={i} className="border border-black text-center font-bold text-[9pt] bg-gray-50">{stat.total > 0 ? stat.percent : ''}</td>)}
                <td colSpan={4} className="border border-black bg-gray-100"></td>
             </tr>
          </tfoot>
        </table>
      </div>
    );
  };

  // --- RENDER MODUL: CARTA ORGANISASI (Guna SchoolHeader) ---
  const renderAJK = () => {
    const order = Object.values(JawatanAJK);
    const sortedCommittees = [...data.committees].sort((a, b) => order.indexOf(a.jawatan) - order.indexOf(b.jawatan));

    return (
      <div className="w-full">
        <SchoolHeader />
        <DocumentTitle 
          title="CARTA ORGANISASI PASUKAN" 
          subtitle={`TAHUN ${currentYear}`} 
        />
        <table className="w-full border-collapse border border-black text-[11pt] mt-6 font-serif">
          <thead className="table-header-group">
            <tr className="bg-gray-100 font-bold break-inside-avoid page-break-inside-avoid">
              <th className="border border-black p-3 text-center w-[10%]">BIL</th>
              <th className="border border-black p-3 text-left w-[30%]">JAWATAN</th>
              <th className="border border-black p-3 text-left w-[40%]">NAMA PENUH</th>
              <th className="border border-black p-3 text-center w-[20%]">TINGKATAN</th>
            </tr>
          </thead>
          <tbody>
            {sortedCommittees.map((ajk, idx) => {
              const student = data.students.find(s => s.id === ajk.studentId);
              return (
                <tr key={ajk.id} className="break-inside-avoid page-break-inside-avoid">
                  <td className="border border-black p-3 text-center font-bold">{idx + 1}</td>
                  <td className="border border-black p-3 font-bold uppercase">{ajk.jawatan}</td>
                  <td className="border border-black p-3 uppercase font-bold">{student?.nama || '-'}</td>
                  <td className="border border-black p-3 text-center font-bold uppercase">{student ? `${student.tingkatan} ${student.kelas}` : '-'}</td>
                </tr>
              );
            })}
            {sortedCommittees.length === 0 && (
              <tr><td colSpan={4} className="border border-black p-8 text-center italic">Tiada AJK dilantik.</td></tr>
            )}
          </tbody>
        </table>
        <div className="mt-16 grid grid-cols-2 gap-20 font-serif text-black break-inside-avoid page-break-inside-avoid">
          <div className="text-center">
            <p className="font-bold uppercase text-[11pt]">Disediakan Oleh:</p>
            <div className="h-20 border-b border-black"></div>
            <p className="text-[11pt] font-bold uppercase mt-2">( SETIAUSAHA )</p>
          </div>
          <div className="text-center">
            <p className="font-bold uppercase text-[11pt]">Disahkan Oleh:</p>
            <div className="h-20 border-b border-black"></div>
            <p className="text-[11pt] font-bold uppercase mt-2">( GURU PENASIHAT )</p>
          </div>
        </div>
      </div>
    );
  };

  // --- RENDER MODUL: AKTIVITI (Guna SchoolHeader) ---
  const renderAktiviti = (actId: string) => {
    const act = data.activities.find(a => a.id === actId);
    if (!act) return <div>Data Tidak Dijumpai</div>;
    const attRecord = data.attendances.find(a => a.tarikh === act.tarikh);
    const presentCount = attRecord ? attRecord.presents.length : 0;
    const totalStudents = data.students.length || 1;
    const percentage = Math.round((presentCount / totalStudents) * 100);

    return (
      <div className="w-full">
         <SchoolHeader />
         <DocumentTitle title="LAPORAN AKTIVITI MINGGUAN" />
         <div className="border border-black p-6 space-y-6 font-serif text-black break-inside-avoid page-break-inside-avoid">
            <div className="grid grid-cols-[180px_auto] gap-y-4 text-[11pt]">
               <div className="font-bold uppercase">1. Nama Aktiviti</div><div className="font-bold uppercase">: {act.nama}</div>
               <div className="font-bold uppercase">2. Tarikh</div><div className="uppercase">: {act.tarikh}</div>
               <div className="font-bold uppercase">3. Masa</div><div className="uppercase">: {act.masa}</div>
               <div className="font-bold uppercase">4. Tempat</div><div className="uppercase">: {act.tempat}</div>
               <div className="font-bold uppercase">5. Kehadiran</div><div className="uppercase">: {presentCount} / {totalStudents} ({percentage}%)</div>
            </div>
            <div className="pt-4 border-t border-black break-inside-avoid page-break-inside-avoid">
               <div className="font-bold uppercase mb-2 text-[11pt]">6. Laporan / Ulasan Aktiviti:</div>
               <div className="p-4 bg-gray-50 border border-black min-h-[150px] text-justify whitespace-pre-wrap leading-relaxed text-[11pt]">
                  {act.ulasan || "Tiada ulasan disediakan."}
               </div>
            </div>
            {act.photos && act.photos.length > 0 && (
              <div className="pt-4 border-t border-black break-inside-avoid page-break-inside-avoid">
                 <div className="font-bold uppercase mb-4 text-[11pt]">7. Dokumentasi Bergambar:</div>
                 <div className="grid grid-cols-2 gap-4">
                    {act.photos.map((photo, i) => (
                      <div key={i} className="aspect-[4/3] border border-black overflow-hidden flex items-center justify-center bg-white p-2">
                         <img src={photo} alt={`Gambar ${i+1}`} className="max-w-full max-h-full object-contain" />
                      </div>
                    ))}
                 </div>
              </div>
            )}
         </div>
         <div className="mt-12 grid grid-cols-2 gap-20 font-serif text-black break-inside-avoid page-break-inside-avoid">
            <div className="text-center">
              <p className="font-bold uppercase text-[11pt]">Disediakan Oleh:</p>
              <div className="h-20 border-b border-black"></div>
              <p className="text-[11pt] font-bold uppercase mt-2">( SETIAUSAHA )</p>
            </div>
            <div className="text-center">
              <p className="font-bold uppercase text-[11pt]">Disahkan Oleh:</p>
              <div className="h-20 border-b border-black"></div>
              <p className="text-[11pt] font-bold uppercase mt-2">( GURU PENASIHAT )</p>
            </div>
         </div>
      </div>
    );
  };

  // --- RENDER LAMPIRAN (Guna BombaHeader) ---
  const renderLampiran = (content: React.ReactNode, title: string) => (
    <div className="w-full">
      <BombaHeader />
      <DocumentTitle title={title} />
      {content}
    </div>
  );

  const renderLampiranA_Content = (s: Student) => (
    <div className="text-[11pt] space-y-6 px-4 font-serif text-black">
      <div className="grid grid-cols-[200px_auto] gap-y-3">
        <div className="font-bold">1. Nama Penuh</div><div className="uppercase font-bold border-b border-black/50">: {s.nama}</div>
        <div className="font-bold">2. No. Kad Pengenalan</div><div className="font-bold border-b border-black/50">: {s.noKP}</div>
        <div className="font-bold">3. Tingkatan</div><div className="uppercase border-b border-black/50">: {s.tingkatan} {s.kelas}</div>
        <div className="font-bold">4. Jantina</div><div className="uppercase border-b border-black/50">: {s.jantina}</div>
        <div className="font-bold">5. Kaum</div><div className="uppercase border-b border-black/50">: {s.kaum}</div>
      </div>
      <div className="border border-black p-4 mt-6 break-inside-avoid page-break-inside-avoid">
        <p className="font-bold underline mb-2">PENGAKUAN KESIHATAN</p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[10pt]">
           {Object.entries(s.health || {}).map(([k, v]) => (
             k !== 'kecacatan' && (
               <div key={k} className="flex justify-between border-b border-black/10 py-1">
                 <span className="uppercase">{k.replace(/([A-Z])/g, ' $1')}</span>
                 <span className="font-bold">{v ? 'YA' : 'TIDAK'}</span>
               </div>
             )
           ))}
        </div>
      </div>
      <div className="mt-12 break-inside-avoid page-break-inside-avoid">
        <p className="text-justify leading-relaxed">Saya mengaku bahawa segala maklumat yang diberikan adalah benar.</p>
        <div className="mt-8 grid grid-cols-2 gap-10">
           <div className="text-center mt-10">
              <div className="border-b border-black h-10 w-3/4 mx-auto"></div>
              <p className="mt-2 font-bold uppercase text-[10pt]">Tandatangan Pelajar</p>
           </div>
        </div>
      </div>
    </div>
  );

  const renderLampiranB_Content = (s: Student) => (
     <div className="text-[11pt] px-4 text-justify leading-relaxed space-y-6 font-serif text-black">
        <p>Saya, <strong>{s.namaWaris || '................................'}</strong> (No KP: <strong>{s.noKPWaris || '......................'}</strong>), waris kepada pelajar bernama <strong>{s.nama}</strong> (<strong>{s.tingkatan} {s.kelas}</strong>), dengan ini memberi kebenaran kepada anak jagaan saya untuk menyertai aktiviti Pasukan Kadet Bomba.</p>
        <p>Saya faham bahawa pihak sekolah akan mengambil langkah keselamatan yang sewajarnya. Namun demikian, saya tidak akan mengambil sebarang tindakan undang-undang terhadap pihak sekolah sekiranya berlaku kemalangan di luar jangkaan.</p>
        <div className="mt-16 grid grid-cols-2 gap-20 break-inside-avoid page-break-inside-avoid">
           <div className="text-center">
              <div className="border-b border-black h-20"></div>
              <p className="mt-2 font-bold uppercase">( TANDATANGAN WARIS )</p>
           </div>
           <div className="text-center">
              <div className="border-b border-black h-20"></div>
              <p className="mt-2 font-bold uppercase">( SAKSI )</p>
           </div>
        </div>
     </div>
  );

  // Lampiran F (Guna BombaHeader)
  const renderLampiranF_Content = () => {
    const sortedStudents = [...data.students].sort((a, b) => a.nama.localeCompare(b.nama));
    return (
      <div className="w-full">
         <BombaHeader />
         <DocumentTitle title="BORANG PENDAFTARAN KOLEKTIF" subtitle={`TAHUN ${currentYear}`} />
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
      </div>
    );
  };

  const getReportContent = () => {
    switch(type) {
      // Modul Dalaman -> Guna School Header (hardcoded dalam function)
      case 'KEHADIRAN': return renderKehadiran();
      case 'AHLI': return renderAhli();
      case 'AJK': return renderAJK();
      case 'AKTIVITI': return targetId ? renderAktiviti(targetId) : <div>Error: ID Aktiviti Tidak Dijumpai</div>;
      
      // Modul Pendaftaran (Bomba) -> Guna Bomba Header (hardcoded dalam renderLampiran atau function)
      case 'PENDAFTARAN': // Lampiran A
        const sA = data.students.find(x => x.id === targetId);
        return sA ? renderLampiran(renderLampiranA_Content(sA), "BORANG MAKLUMAT PERIBADI (LAMPIRAN A)") : null;
      case 'LAMPIRAN_B':
        const sB = data.students.find(x => x.id === targetId);
        return sB ? renderLampiran(renderLampiranB_Content(sB), "SURAT KEBENARAN IBU BAPA / PENJAGA (LAMPIRAN B)") : null;
      case 'LAMPIRAN_E':
         return renderLampiran(
           <div className="text-[11pt] space-y-4 px-4 font-serif text-black">
             <p className="text-justify">Bahawasanya kami guru-guru dan pelajar-pelajar sekolah ini memohon menubuhkan Pasukan Kadet Bomba dan Penyelamat Malaysia.</p>
             <div className="mt-8 border border-black p-4 h-32">Ulasan Pengetua:</div>
           </div>, 
           "PERMOHONAN PENUBUHAN PASUKAN (LAMPIRAN E)"
         );
      case 'LAMPIRAN_F': return renderLampiranF_Content(); // Ada BombaHeader sendiri di dalam function
      default: return <div>Modul Belum Sedia: {type}</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-sm flex flex-col">
      <div className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-md shrink-0 no-print">
         <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-red-600">
               <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="font-bold text-lg uppercase text-slate-800">Pratonton Cetakan: {type}</h2>
         </div>
         <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 rounded-lg p-1 border">
               <button onClick={() => setOrientation('portrait')} className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-all ${orientation === 'portrait' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-black'}`}>Portrait</button>
               <button onClick={() => setOrientation('landscape')} className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-all ${orientation === 'landscape' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-black'}`}>Landscape</button>
            </div>
            <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-2 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition-colors shadow-lg">
               <Printer className="w-4 h-4" /> CETAK
            </button>
         </div>
      </div>

      <div className="flex-1 overflow-auto p-8 flex justify-center bg-slate-800/50">
         <div 
           id="printable-area"
           className={`bg-white shadow-2xl transition-all duration-300 ${orientation === 'landscape' ? 'w-[297mm] min-h-[210mm]' : 'w-[210mm] min-h-[297mm]'}`}
           style={{ fontFamily: '"Times New Roman", Times, serif', padding: '20mm' }}
         >
            {getReportContent()}
         </div>
      </div>

      <style>{`
        @media print {
           @page { 
             size: A4 ${orientation}; 
             margin: 10mm; /* Browser uruskan margin kertas */
           }
           html, body {
             height: auto !important;
             overflow: visible !important;
             background: white !important;
             margin: 0 !important;
             padding: 0 !important;
             width: 100% !important;
           }
           
           /* Sembunyikan semua UI asal */
           body > * { display: none !important; }
           
           /* Paparkan hanya kawasan print */
           #printable-area { 
             display: block !important;
             position: absolute !important;
             top: 0 !important;
             left: 0 !important;
             width: 100% !important;
             height: auto !important;
             margin: 0 !important;
             padding: 0 !important; /* Margin dah set di @page */
             box-shadow: none !important;
             background: white !important;
             overflow: visible !important;
           }
           
           /* Pastikan text warna hitam */
           * { 
             -webkit-print-color-adjust: exact !important; 
             print-color-adjust: exact !important; 
             color: black !important;
           }
           
           /* TABLE LOGIC: Header Berulang */
           table { 
             width: 100%; 
             border-collapse: collapse; 
             page-break-inside: auto; 
           }
           thead { 
             display: table-header-group; 
           }
           tr { 
             page-break-inside: avoid; 
             page-break-after: auto; 
           }
           tfoot { 
             display: table-footer-group; 
           }
           
           /* ELAKKAN PECAH COMPONENT PENTING */
           .break-inside-avoid, .page-break-inside-avoid {
             page-break-inside: avoid !important;
             break-inside: avoid !important;
           }
           
           .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default PrintPreview;