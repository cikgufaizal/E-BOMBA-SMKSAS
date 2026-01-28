
import React from 'react';
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

  // ALAMAT RASMI SEKOLAH
  const schoolName = data.settings?.schoolName || SCHOOL_INFO.name;
  const address = data.settings?.address || SCHOOL_INFO.address;
  const principalName = SCHOOL_INFO.principal;

  const JBPMHeader = () => (
    <div className="flex flex-col items-center text-center mb-6 text-black border-b-[1.5pt] border-black pb-4">
      <h2 className="text-[12pt] font-bold uppercase">JABATAN BOMBA DAN PENYELAMAT MALAYSIA</h2>
      <p className="text-[10pt] font-bold uppercase">PASUKAN KADET BOMBA DAN PENYELAMAT MALAYSIA</p>
    </div>
  );

  // --- RENDER MODUL: SENARAI AHLI ---
  const renderAhli = () => {
    const sortedStudents = [...data.students].sort((a, b) => a.nama.localeCompare(b.nama));
    
    return (
      <div className="text-black leading-tight text-[10.5pt] min-h-[297mm] font-serif">
        <div className="flex justify-end mb-2">
          <span className="font-bold text-[11pt]">Senarai Keahlian</span>
        </div>
        <JBPMHeader />
        <div className="text-center mb-8">
          <h3 className="font-bold text-[13pt] uppercase underline">SENARAI KEAHLIAN PASUKAN</h3>
          <p className="text-[10pt] font-bold uppercase mt-1">TAHUN {currentYear}</p>
          <p className="text-[9pt] font-bold uppercase mt-1">{schoolName}</p>
        </div>

        <div className="mb-4">
           <p className="font-bold uppercase text-[9pt]">JUMLAH KEAHLIAN: {sortedStudents.length} ORANG</p>
        </div>

        <table className="w-full border-collapse border border-black text-[9pt]">
          <thead>
            <tr className="bg-gray-100 font-bold">
              <th className="border border-black p-2 text-center w-[40px]">BIL</th>
              <th className="border border-black p-2 text-left">NAMA PENUH</th>
              <th className="border border-black p-2 text-center w-[100px]">NO. KP</th>
              <th className="border border-black p-2 text-center w-[90px]">NO. AHLI</th>
              <th className="border border-black p-2 text-center w-[40px]">JANTINA</th>
              <th className="border border-black p-2 text-center w-[80px]">TING/KELAS</th>
              <th className="border border-black p-2 text-center w-[80px]">CATATAN</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((s, idx) => (
              <tr key={s.id}>
                <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                <td className="border border-black p-1.5 uppercase font-bold">{s.nama}</td>
                <td className="border border-black p-1.5 text-center font-mono">{s.noKP}</td>
                <td className="border border-black p-1.5 text-center font-bold">{s.noKeahlian || '-'}</td>
                <td className="border border-black p-1.5 text-center">{s.jantina === Jantina.Lelaki ? 'L' : 'P'}</td>
                <td className="border border-black p-1.5 text-center uppercase">{s.tingkatan} {s.kelas}</td>
                <td className="border border-black p-1.5"></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-12 flex justify-end">
           <div className="text-center w-[200px]">
              <p className="font-bold uppercase text-[9pt]">Disahkan Oleh:</p>
              <div className="h-16 border-b border-black"></div>
              <p className="text-[9pt] font-bold uppercase mt-2">( GURU PENASIHAT )</p>
           </div>
        </div>
      </div>
    );
  };

  // --- RENDER MODUL: KEHADIRAN (FORMAT MATRIKS 12 KOLUM) ---
  const renderKehadiran = () => {
    const sortedStudents = [...data.students].sort((a, b) => a.nama.localeCompare(b.nama));
    const sortedAttendance = [...data.attendances]
      .sort((a, b) => new Date(a.tarikh).getTime() - new Date(b.tarikh).getTime())
      .slice(0, 12);

    const meetingSlots = Array.from({ length: 12 }, (_, i) => sortedAttendance[i] || null);

    return (
      <div className="text-black leading-tight text-[9pt] min-h-[297mm] font-serif">
        <JBPMHeader />
        <div className="text-center mb-6">
          <h3 className="font-bold text-[12pt] uppercase underline">RUMUSAN KEHADIRAN AKTIVITI TAHUNAN</h3>
          <p className="text-[10pt] font-bold uppercase mt-1">TAHUN {currentYear}</p>
        </div>

        <table className="w-full border-collapse border border-black text-[8pt]">
          <thead>
            <tr className="bg-gray-100 font-bold">
              <th rowSpan={2} className="border border-black p-1 text-center w-[30px]">BIL</th>
              <th rowSpan={2} className="border border-black p-1 text-left">NAMA ANGGOTA</th>
              <th colSpan={12} className="border border-black p-1 text-center">PERJUMPAAN / TARIKH</th>
              <th rowSpan={2} className="border border-black p-1 text-center w-[35px]">JUM</th>
              <th rowSpan={2} className="border border-black p-1 text-center w-[40px]">%</th>
            </tr>
            <tr className="bg-gray-50 font-bold text-[7pt]">
              {meetingSlots.map((slot, i) => (
                <th key={i} className="border border-black p-1 text-center w-[25px]">
                  {i + 1}
                  {slot && <div className="mt-1 text-[6pt] font-normal rotate-0">{slot.tarikh.split('-').reverse().slice(0,2).join('/')}</div>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((s, idx) => {
              let totalPresent = 0;
              return (
                <tr key={s.id}>
                  <td className="border border-black p-1 text-center">{idx + 1}</td>
                  <td className="border border-black p-1 uppercase font-bold text-[8.5pt] whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">{s.nama}</td>
                  {meetingSlots.map((slot, i) => {
                    const isPresent = slot ? slot.presents.includes(s.id) : false;
                    if (isPresent) totalPresent++;
                    return (
                      <td key={i} className="border border-black p-1 text-center font-bold">
                        {isPresent ? '/' : ''}
                      </td>
                    );
                  })}
                  <td className="border border-black p-1 text-center font-bold">{totalPresent}</td>
                  <td className="border border-black p-1 text-center">
                    {sortedAttendance.length > 0 
                      ? Math.round((totalPresent / sortedAttendance.length) * 100) 
                      : 0}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-8">
           <p className="text-[8pt] font-bold uppercase underline mb-2">PETUNJUK:</p>
           <div className="flex gap-8 text-[8pt]">
              <div>/ : HADIR</div>
              <div>O : TIDAK HADIR</div>
              <div>TH : TIDAK HADIR BERSEBAB</div>
           </div>
        </div>

        <div className="mt-12 flex justify-between items-end">
           <div className="text-[8pt] italic w-[200px]">
             * Rekod dijana secara automatik oleh sistem.
           </div>
           <div className="text-center w-[200px]">
              <p className="font-bold uppercase text-[9pt]">Disahkan Oleh:</p>
              <div className="h-16 border-b border-black"></div>
              <p className="text-[9pt] font-bold uppercase mt-2">( GURU PENASIHAT )</p>
           </div>
        </div>
      </div>
    );
  };

  // --- RENDER MODUL: AJK ---
  const renderAJK = () => {
    const order = Object.values(JawatanAJK);
    const sortedCommittees = [...data.committees].sort((a, b) => 
      order.indexOf(a.jawatan) - order.indexOf(b.jawatan)
    );

    return (
      <div className="text-black leading-tight text-[10.5pt] min-h-[297mm] font-serif">
        <JBPMHeader />
        <div className="text-center mb-10">
          <h3 className="font-bold text-[14pt] uppercase underline">CARTA ORGANISASI PASUKAN</h3>
          <p className="text-[11pt] font-bold uppercase mt-2">TAHUN {currentYear}</p>
          <p className="text-[10pt] font-bold uppercase mt-1">{schoolName}</p>
        </div>

        <table className="w-full border-collapse border border-black text-[10pt]">
          <thead>
            <tr className="bg-gray-100 font-bold">
              <th className="border border-black p-3 text-center w-[50px]">BIL</th>
              <th className="border border-black p-3 text-left w-[200px]">JAWATAN</th>
              <th className="border border-black p-3 text-left">NAMA PENUH</th>
              <th className="border border-black p-3 text-center w-[120px]">TINGKATAN</th>
            </tr>
          </thead>
          <tbody>
            {sortedCommittees.map((ajk, idx) => {
              const student = data.students.find(s => s.id === ajk.studentId);
              return (
                <tr key={ajk.id}>
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

        <div className="mt-16 grid grid-cols-2 gap-20">
          <div className="text-center space-y-16">
            <p className="font-bold uppercase text-[9pt]">Disediakan Oleh:</p>
            <div>
              <div className="border-b border-black w-48 mx-auto mb-2"></div>
              <p className="text-[9pt] font-bold uppercase">( SETIAUSAHA )</p>
            </div>
          </div>
          <div className="text-center space-y-16">
            <p className="font-bold uppercase text-[9pt]">Disahkan Oleh:</p>
            <div>
              <div className="border-b border-black w-48 mx-auto mb-2"></div>
              <p className="text-[9pt] font-bold uppercase">( GURU PENASIHAT )</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- RENDER MODUL: AKTIVITI ---
  const renderAktiviti = (actId: string) => {
    const act = data.activities.find(a => a.id === actId);
    if (!act) return <div className="p-10 font-bold text-center">Data Aktiviti Tidak Dijumpai</div>;

    const attRecord = data.attendances.find(a => a.tarikh === act.tarikh);
    const presentCount = attRecord ? attRecord.presents.length : 0;
    const totalStudents = data.students.length || 1;
    const percentage = Math.round((presentCount / totalStudents) * 100);

    return (
      <div className="text-black leading-relaxed text-[11pt] min-h-[297mm] font-serif">
         <JBPMHeader />
         <div className="text-center mb-8 border-b-2 border-black pb-4">
            <h3 className="font-bold text-[14pt] uppercase">LAPORAN AKTIVITI MINGGUAN</h3>
         </div>

         <div className="space-y-6 px-4">
            <div className="grid grid-cols-[150px_auto] gap-y-4">
               <div className="font-bold uppercase">Nama Aktiviti</div>
               <div className="font-bold uppercase">: {act.nama}</div>
               
               <div className="font-bold uppercase">Tarikh</div>
               <div className="uppercase">: {act.tarikh}</div>

               <div className="font-bold uppercase">Masa</div>
               <div className="uppercase">: {act.masa}</div>

               <div className="font-bold uppercase">Tempat</div>
               <div className="uppercase">: {act.tempat}</div>

               <div className="font-bold uppercase">Kehadiran</div>
               <div className="uppercase">: {presentCount} / {totalStudents} ({percentage}%)</div>
            </div>

            <div className="pt-6">
               <div className="font-bold uppercase mb-2 border-b border-black w-fit">Laporan / Ulasan Aktiviti:</div>
               <div className="border border-black p-6 min-h-[200px] text-justify whitespace-pre-wrap leading-relaxed">
                  {act.ulasan || "Tiada ulasan disediakan."}
               </div>
            </div>

            {/* GAMBAR LAPORAN */}
            {act.photos && act.photos.length > 0 && (
              <div className="pt-2">
                 <div className="font-bold uppercase mb-4 border-b border-black w-fit">Dokumentasi Bergambar:</div>
                 <div className="grid grid-cols-2 gap-4">
                    {act.photos.map((photo, i) => (
                      <div key={i} className="aspect-[4/3] border border-black overflow-hidden flex items-center justify-center bg-gray-50">
                         <img src={photo} alt={`Gambar ${i+1}`} className="max-w-full max-h-full object-contain" />
                      </div>
                    ))}
                 </div>
              </div>
            )}

            <div className="mt-12 grid grid-cols-2 gap-20">
               <div className="space-y-16 text-center">
                  <p className="font-bold uppercase text-[9pt]">Disediakan Oleh:</p>
                  <div>
                    <div className="border-b border-black w-48 mx-auto mb-2"></div>
                    <p className="text-[9pt] font-bold uppercase">( SETIAUSAHA )</p>
                  </div>
               </div>
               <div className="space-y-16 text-center">
                  <p className="font-bold uppercase text-[9pt]">Disahkan Oleh:</p>
                  <div>
                    <div className="border-b border-black w-48 mx-auto mb-2"></div>
                    <p className="text-[9pt] font-bold uppercase">( GURU PENASIHAT )</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    );
  };

  // --- RENDER MODUL: LAMPIRAN B (PELEPASAN) ---
  const renderLampiranB = (s: Student) => (
    <div className="text-black leading-relaxed text-[10.5pt] min-h-[280mm] font-serif">
      <div className="flex justify-end mb-2">
        <span className="font-bold text-[11pt]">Lampiran B</span>
      </div>
      <JBPMHeader />
      
      <div className="text-center mb-8">
        <h3 className="font-bold text-[12pt] uppercase underline">BORANG PELEPASAN TANGGUNGJAWAB</h3>
        <p className="text-[10pt] font-bold uppercase mt-1">PASUKAN KADET BOMBA DAN PENYELAMAT MALAYSIA</p>
      </div>

      <div className="px-8 space-y-6">
        <div className="space-y-4">
          <p>Saya, <span className="font-bold border-b border-black uppercase px-2">{s.namaWaris || '................................................................'}</span> No. KP: <span className="font-bold border-b border-black px-2">{s.noKPWaris || '................................'}</span> adalah *bapa / ibu / penjaga kepada pelajar di bawah:</p>
          
          <div className="bg-gray-50 p-4 border border-black rounded-sm space-y-2">
            <div className="grid grid-cols-[150px_auto]">
              <div className="font-bold">Nama Pelajar</div><div className="uppercase font-bold">: {s.nama}</div>
              <div className="font-bold">No. KP</div><div className="font-mono">: {s.noKP}</div>
              <div className="font-bold">Tingkatan / Kelas</div><div className="uppercase">: {s.tingkatan} {s.kelas}</div>
              <div className="font-bold">Nama Sekolah</div><div className="uppercase">: {schoolName}</div>
            </div>
          </div>
        </div>

        <div className="space-y-4 text-justify">
          <p>
            1. Dengan ini saya memberikan kebenaran kepada anak / jagaan saya untuk menyertai segala aktiviti fizikal dan latihan yang dianjurkan oleh 
            <span className="font-bold uppercase"> PASUKAN KADET BOMBA DAN PENYELAMAT MALAYSIA </span> bagi tahun <span className="font-bold px-2 border-b border-black">{currentYear}</span>.
          </p>
          <p>
            2. Saya sedar bahawa pihak penganjur akan mengambil segala langkah keselamatan yang perlu. Walaubagaimanapun, saya dengan ini melepaskan tanggungjawab 
            kepada pihak sekolah, Jabatan Pendidikan Negeri, Jabatan Bomba dan Penyelamat Malaysia serta para pegawai yang bertugas daripada sebarang tuntutan 
            ganti rugi atau tindakan undang-undang sekiranya berlaku sebarang kemalangan, kecederaan atau kehilangan harta benda yang tidak diingini ke atas anak / jagaan saya semasa atau selepas aktiviti dijalankan.
          </p>
          <p>
            3. Saya juga mengesahkan bahawa anak / jagaan saya tidak mempunyai sebarang penyakit kronik atau masalah kesihatan yang boleh menghalangnya daripada menyertai aktiviti-aktiviti tersebut (seperti yang dinyatakan dalam Lampiran A).
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-20">
          <div className="space-y-12">
            <div className="space-y-2">
              <div className="border-b border-black w-full h-8"></div>
              <p className="font-bold uppercase text-[9pt]">Tandatangan Waris</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9pt]">Nama: .................................................</p>
              <p className="text-[9pt]">No. KP: ...............................................</p>
              <p className="text-[9pt]">Tarikh: ................................................</p>
            </div>
          </div>

          <div className="space-y-12">
            <div className="space-y-2 text-center">
              <div className="border-b border-black w-full h-8"></div>
              <p className="font-bold uppercase text-[9pt]">Saksi (Guru Penasihat / Pentadbir)</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9pt]">Nama: .................................................</p>
              <p className="text-[9pt]">Jawatan: .............................................</p>
              <p className="text-[9pt]">Tarikh: ................................................</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 border-t border-black pt-2 px-8">
        <p className="text-[8pt] italic">* Potong yang tidak berkenaan.</p>
      </div>
    </div>
  );

  // --- RENDER MODUL: LAMPIRAN E (PENUBUHAN) ---
  const renderLampiranE = () => {
    const penasihat = data.teachers.find(t => t.jawatan === JawatanGuru.Penasihat);

    return (
      <div className="text-black leading-snug text-[10.5pt] min-h-[280mm] font-serif">
        <div className="flex justify-end mb-2">
          <span className="font-bold text-[11pt]">Lampiran E</span>
        </div>
        <JBPMHeader />
        
        <div className="text-center mb-10">
          <h3 className="font-bold text-[13pt] uppercase underline">BORANG PERMOHONAN PENUBUHAN</h3>
          <p className="text-[10.5pt] font-bold uppercase mt-1">PASUKAN KADET BOMBA DAN PENYELAMAT MALAYSIA</p>
        </div>

        <div className="space-y-8 px-6">
          <section>
            <h4 className="font-bold border-b border-black mb-4 uppercase text-[11pt]">Bahagian A: Maklumat Sekolah / Institusi</h4>
            <div className="grid grid-cols-[180px_auto] gap-y-3">
              <div className="font-bold">Nama Sekolah</div><div className="uppercase font-bold">: {schoolName}</div>
              <div className="font-bold">Alamat Sekolah</div><div className="uppercase leading-tight">: {address}</div>
              <div className="font-bold">No. Telefon</div><div className="">: {data.teachers[0]?.telefon || '05-491 1000'}</div>
              <div className="font-bold">Kod Sekolah</div><div className="">: CEB1003</div>
            </div>
          </section>

          <section>
            <h4 className="font-bold border-b border-black mb-4 uppercase text-[11pt]">Bahagian B: Maklumat Komander (Pengetua/Guru Besar)</h4>
            <div className="grid grid-cols-[180px_auto] gap-y-3">
              <div className="font-bold">Nama Penuh</div><div className="uppercase font-bold">: {principalName}</div>
              <div className="font-bold">No. Kad Pengenalan</div><div className="font-mono">: ................................</div>
              <div className="font-bold">Jawatan Hakiki</div><div className="uppercase">: PENGETUA</div>
            </div>
          </section>

          <section>
            <h4 className="font-bold border-b border-black mb-4 uppercase text-[11pt]">Bahagian C: Maklumat Guru Penasihat Utama</h4>
            <div className="grid grid-cols-[180px_auto] gap-y-3">
              <div className="font-bold">Nama Penuh</div><div className="uppercase font-bold">: {penasihat?.nama || '................................................................'}</div>
              <div className="font-bold">No. Kad Pengenalan</div><div className="font-mono">: {penasihat?.noKP || '................................'}</div>
              <div className="font-bold">No. Telefon (H/P)</div><div className="">: {penasihat?.telefon || '................................'}</div>
            </div>
          </section>

          <section className="mt-12">
             <h4 className="font-bold uppercase text-[11pt] mb-4">Pengesahan Dan Perakuan Institusi</h4>
             <p className="text-justify leading-relaxed">
               Saya dengan ini memohon untuk menubuhkan Pasukan Kadet Bomba dan Penyelamat Malaysia di institusi ini. Saya berjanji akan memastikan segala aktiviti yang dijalankan adalah selaras dengan perlembagaan dan arahan Jabatan Bomba dan Penyelamat Malaysia dari semasa ke semasa.
             </p>
             
             <div className="mt-20 grid grid-cols-[250px_auto_250px] gap-4">
                <div className="text-center">
                   <div className="border-b border-black h-12"></div>
                   <p className="mt-2 font-bold uppercase text-[9pt]">Tarikh</p>
                </div>
                <div></div>
                <div className="text-center">
                   <div className="border-b border-black h-12"></div>
                   <p className="mt-2 font-bold uppercase text-[9pt]">Tandatangan & Cop Rasmi</p>
                   <p className="text-[8pt] uppercase">Komander Institusi</p>
                </div>
             </div>
          </section>
        </div>

        <div className="mt-24 border-t-2 border-dashed border-black pt-4">
           <p className="text-[9pt] font-bold italic uppercase">Untuk Kegunaan Jabatan Bomba Dan Penyelamat Malaysia (JBPM) Sahaja</p>
           <div className="mt-4 border border-black p-4 h-32">
              <p className="text-[9pt]">Catatan / Ulasan Pegawai Penyelaras:</p>
           </div>
        </div>
      </div>
    );
  };

  // --- RENDER MODUL: LAMPIRAN A (KESIHATAN) ---
  const renderLampiranA = (s: Student) => (
    <div className="text-black leading-tight text-[10.5pt] min-h-[280mm] font-serif">
      <div className="flex justify-end mb-2">
        <span className="font-bold text-[11pt]">Lampiran A</span>
      </div>
      <JBPMHeader />
      <div className="text-center mb-8">
        <h3 className="font-bold text-[12pt] uppercase underline">BORANG MAKLUMAT PERIBADI</h3>
        <p className="text-[10.5pt] font-bold uppercase mt-1">PASUKAN KADET BOMBA DAN PENYELAMAT MALAYSIA</p>
      </div>

      <div className="space-y-5 px-6">
        <div className="grid grid-cols-[180px_auto] gap-x-2 gap-y-3">
          <div className="font-bold">1. Nama Penuh</div><div className="uppercase font-bold border-b border-black/20">: {s.nama}</div>
          <div className="font-bold">2. No. Kad Pengenalan</div><div className="font-mono border-b border-black/20">: {s.noKP}</div>
          <div className="font-bold">3. Nama Sekolah</div><div className="uppercase border-b border-black/20">: {schoolName}</div>
          <div className="font-bold">4. Alamat Sekolah</div><div className="uppercase border-b border-black/20">: {address}</div>
          <div className="font-bold">5. Umur</div><div className="border-b border-black/20">: {s.umur || '-'} Tahun</div>
          <div className="font-bold">6. Tahap Pendaftaran</div><div className="border-b border-black/20">: TAHAP {s.tahap || '-'}</div>
          <div className="font-bold">7. Tingkatan / Kelas</div><div className="border-b border-black/20">: {s.tingkatan} {s.kelas}</div>
        </div>

        <div className="mt-8">
          <p className="font-bold mb-4">8. PENGAKUAN KESIHATAN: - (Sila tandakan / pada ruangan berkaitan)</p>
          <table className="w-full border-collapse border border-black text-[9.5pt]">
            <thead>
              <tr className="bg-gray-50 font-bold">
                <th className="border border-black p-2 text-left w-[60%] uppercase">Jenis Penyakit / Keadaan Kesihatan</th>
                <th className="border border-black p-2 text-center w-[20%]">ADA</th>
                <th className="border border-black p-2 text-center w-[20%]">TIADA</th>
              </tr>
            </thead>
            <tbody>
              {[
                { key: 'asma', label: 'a. Asma / Sesak Nafas' },
                { key: 'lelahTB', label: 'b. Lelah / Batuk Kering / TB' },
                { key: 'kencingManis', label: 'c. Kencing Manis' },
                { key: 'darahTinggi', label: 'd. Darah Tinggi' },
                { key: 'penglihatan', label: 'e. Masalah Penglihatan (Rabun Teruk)' },
                { key: 'pendengaran', label: 'f. Masalah Pendengaran' },
                { key: 'kronikLain', label: 'g. Penyakit Kronik Lain' }
              ].map(item => (
                <tr key={item.key}>
                  <td className="border border-black p-2 font-medium">{item.label}</td>
                  <td className="border border-black p-2 text-center text-[12pt] font-bold">{s.health?.[item.key as keyof typeof s.health] ? '/' : ''}</td>
                  <td className="border border-black p-2 text-center text-[12pt] font-bold">{!s.health?.[item.key as keyof typeof s.health] ? '/' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex gap-4 items-start">
            <div className="font-bold text-[9pt] shrink-0">h. Nyatakan Kecacatan (Jika Ada):</div>
            <div className="border-b border-black flex-1 min-h-[24px] text-[9.5pt] italic">{s.health?.kecacatan || '-'}</div>
          </div>
        </div>

        <div className="mt-10 text-justify italic text-[10pt] leading-relaxed">
          Saya dengan ini mengaku bahawa segala maklumat yang diberikan di atas adalah benar and saya berada dalam keadaan sihat untuk menyertai segala aktiviti fizikal Pasukan Kadet Bomba dan Penyelamat Malaysia.
        </div>

        <div className="mt-16 grid grid-cols-[auto_250px] gap-10">
          <div className="pt-4">
            <p className="font-bold">Tarikh: ..............................</p>
          </div>
          <div className="text-center">
            <div className="border-b border-black h-14"></div>
            <p className="mt-2 font-bold uppercase text-[9pt]">Tandatangan Anggota Kadet</p>
            <p className="text-[8pt] uppercase">( {s.nama} )</p>
          </div>
        </div>
      </div>
    </div>
  );

  // --- RENDER MODUL: LAMPIRAN F (KOLEKTIF) ---
  const renderLampiranF = () => {
    const sortedStudents = [...data.students].sort((a,b) => a.nama.localeCompare(b.nama));
    const penasihat = data.teachers.find(t => t.jawatan === JawatanGuru.Penasihat)?.nama || principalName;

    return (
      <div className="text-black leading-tight text-[10pt] min-h-[297mm] font-serif">
        <div className="flex justify-end mb-2">
          <span className="font-bold text-[11pt]">Lampiran F</span>
        </div>
        <JBPMHeader />
        <div className="text-center mb-8">
          <h3 className="font-bold text-[11.5pt] uppercase underline">BORANG PENDAFTARAN KOLEKTIF</h3>
          <p className="text-[10pt] font-bold uppercase mt-1">AHLI PASUKAN KADET BOMBA DAN PENYELAMAT MALAYSIA</p>
        </div>

        <div className="space-y-3 mb-6 px-4 text-[9.5pt]">
          <div className="grid grid-cols-[160px_auto] gap-1">
            <div className="font-bold uppercase">Nama Sekolah</div><div className="uppercase font-bold border-b border-black/10">: {schoolName}</div>
            <div className="font-bold uppercase">Alamat Sekolah</div><div className="uppercase border-b border-black/10">: {address}</div>
            <div className="font-bold uppercase">Guru Penasihat</div><div className="uppercase border-b border-black/10">: {penasihat}</div>
            <div className="font-bold uppercase">Tahun Pendaftaran</div><div className="font-bold border-b border-black/10">: {currentYear}</div>
          </div>
        </div>

        <table className="w-full border-collapse border border-black text-[9pt]">
          <thead>
            <tr className="bg-gray-100 font-bold">
              <th className="border border-black p-2 text-center w-[40px]">Bil.</th>
              <th className="border border-black p-2 text-left">Nama Penuh Calon</th>
              <th className="border border-black p-2 text-center w-[140px]">No. Kad Pengenalan</th>
              <th className="border border-black p-2 text-center w-[120px]">No. Keahlian</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((s, idx) => (
              <tr key={s.id}>
                <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                <td className="border border-black p-1.5 uppercase font-bold">{s.nama}</td>
                <td className="border border-black p-1.5 text-center font-mono">{s.noKP}</td>
                <td className="border border-black p-1.5 text-center font-bold">{s.noKeahlian || ''}</td>
              </tr>
            ))}
            {sortedStudents.length < 15 && Array.from({ length: 15 - sortedStudents.length }).map((_, i) => (
               <tr key={`empty-${i}`} className="h-10">
                 <td className="border border-black p-1.5 text-center">{sortedStudents.length + i + 1}</td>
                 <td className="border border-black p-1.5"></td>
                 <td className="border border-black p-1.5"></td>
                 <td className="border border-black p-1.5"></td>
               </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-12 px-6 flex justify-between items-start">
          <div className="space-y-12">
            <p className="font-bold uppercase text-[9pt]">Disediakan Oleh:</p>
            <div className="pt-8">
              <div className="border-b border-black w-[200px] mb-2"></div>
              <p className="text-[8pt] font-bold uppercase">( Guru Penasihat )</p>
            </div>
          </div>
          <div className="space-y-12 text-center">
            <p className="font-bold uppercase text-[9pt]">Disahkan Oleh:</p>
            <div className="pt-8">
              <div className="border-b border-black w-[250px] mb-2"></div>
              <p className="text-[8pt] font-bold uppercase">( Pengetua / Guru Besar / Cop Rasmi )</p>
              <p className="text-[8pt]">Tarikh: ..............................</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getReportContent = () => {
    switch(type) {
      case 'PENDAFTARAN': 
        const s = targetId ? data.students.find(x => x.id === targetId) : null;
        if (!s) return <div className="p-20 text-center font-bold">RALAT: Data Pelajar Tidak Dijumpai</div>;
        return renderLampiranA(s);
      case 'LAMPIRAN_F': 
        return renderLampiranF();
      case 'LAMPIRAN_E':
        return renderLampiranE();
      case 'LAMPIRAN_B':
        const studentB = targetId ? data.students.find(x => x.id === targetId) : null;
        if (!studentB) return <div className="p-20 text-center font-bold">RALAT: Data Pelajar Tidak Dijumpai</div>;
        return renderLampiranB(studentB);
      case 'AJK':
        return renderAJK();
      case 'KEHADIRAN':
        return renderKehadiran();
      case 'AHLI':
        return renderAhli();
      case 'AKTIVITI':
        if (!targetId) return <div className="p-20 text-center font-bold">RALAT: Sila pilih aktiviti untuk dicetak.</div>;
        return renderAktiviti(targetId);
      default: return <div className="p-20 text-center font-bold uppercase tracking-widest">Modul Cetakan {type} Sedang Menunggu Arahan Debug</div>;
    }
  };

  const getHeaderTitle = () => {
     switch(type) {
        case 'LAMPIRAN_F': return 'Cetak Lampiran F (Kolektif)';
        case 'LAMPIRAN_E': return 'Cetak Lampiran E (Permohonan)';
        case 'LAMPIRAN_B': return 'Cetak Lampiran B (Pelepasan)';
        case 'AJK': return 'Cetak Carta Organisasi';
        case 'KEHADIRAN': return 'Rumusan Kehadiran Tahunan';
        case 'AKTIVITI': return 'Laporan Aktiviti Mingguan';
        case 'AHLI': return 'Senarai Keahlian';
        default: return 'Cetak Lampiran A (Kesihatan)';
     }
  };

  return (
    <div className="min-h-screen bg-slate-900 overflow-y-auto">
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b-2 border-slate-200 z-[100] flex items-center justify-between px-8 text-black no-print shadow-xl">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft className="w-6 h-6 text-red-600" /></button>
          <h2 className="font-black text-lg uppercase tracking-tighter text-black">
             {getHeaderTitle()}
          </h2>
        </div>
        <button onClick={() => window.print()} className="flex items-center gap-3 px-10 py-3 bg-red-700 text-white font-black rounded-xl hover:bg-red-800 transition-all shadow-xl uppercase text-xs tracking-widest">
          <Printer className="w-5 h-5" /> CETAK SEKARANG
        </button>
      </div>

      <div className="pt-24 pb-20 flex justify-center bg-slate-900 min-h-screen no-print">
        <div className="bg-white shadow-2xl w-[210mm] p-[15mm] print-area border border-slate-300 rounded-sm">
          {getReportContent()}
        </div>
      </div>

      <div className="hidden print:block">
          {getReportContent()}
      </div>
      
      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          .print-area { padding: 15mm !important; }
        }
      `}</style>
    </div>
  );
};

export default PrintPreview;
