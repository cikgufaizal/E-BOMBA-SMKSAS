
import React from 'react';
import { Printer, ArrowLeft } from 'lucide-react';
import { SystemData, ReportType, JawatanAJK, Jantina, Student, JawatanGuru, Teacher } from '../types';
import { SCHOOL_INFO, MONTHS } from '../constants';

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
            {/* Mengisi baris kosong untuk estetika jika data sedikit */}
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
      default: return <div className="p-20 text-center font-bold uppercase tracking-widest">Modul Cetakan {type} Sedang Menunggu Arahan Debug</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 overflow-y-auto">
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b-2 border-slate-200 z-[100] flex items-center justify-between px-8 text-black no-print shadow-xl">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft className="w-6 h-6 text-red-600" /></button>
          <h2 className="font-black text-lg uppercase tracking-tighter text-black">
             {type === 'LAMPIRAN_F' ? 'Cetak Lampiran F (Kolektif)' : 
              type === 'LAMPIRAN_E' ? 'Cetak Lampiran E (Permohonan)' :
              'Cetak Lampiran A (Kesihatan)'}
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
