
import React from 'react';
import { Printer, ArrowLeft } from 'lucide-react';
import { SystemData, ReportType, JawatanAJK, Jantina, Student } from '../types';
import { SCHOOL_INFO, MONTHS } from '../constants';

interface PrintProps {
  type: ReportType;
  data: SystemData;
  targetId?: string;
  onClose: () => void;
}

const PrintPreview: React.FC<PrintProps> = ({ type, data, targetId, onClose }) => {
  const currentYear = new Date().getFullYear();
  const printTime = new Date().toLocaleString('ms-MY');

  const schoolName = data.settings?.schoolName || SCHOOL_INFO.name;
  const clubName = data.settings?.clubName || SCHOOL_INFO.clubName;
  const address = data.settings?.address || SCHOOL_INFO.address;

  // Header Rasmi JBPM
  const JBPMHeader = () => (
    <div className="flex flex-col items-center text-center mb-6 text-black border-b border-black pb-4">
      {data.settings?.logoUrl && <img src={data.settings.logoUrl} alt="Logo" className="w-16 h-16 object-contain mb-2" />}
      <h2 className="text-[12pt] font-bold uppercase">JABATAN BOMBA DAN PENYELAMAT MALAYSIA</h2>
      <p className="text-[10pt] font-bold uppercase">PASUKAN KADET BOMBA DAN PENYELAMAT MALAYSIA</p>
    </div>
  );

  const FooterInfo = () => (
    <div className="mt-8 pt-1 border-t border-black/10 text-[7px] text-slate-400 flex justify-between uppercase no-print">
      <span>E-Kadet Bomba Professional • Generated from JBPM Digital Core</span>
      <span>{printTime}</span>
    </div>
  );

  const renderLampiranA = (s: Student) => (
    <div className="text-black leading-tight text-[10.5pt] h-[297mm]">
      <div className="flex justify-end mb-2">
        <span className="font-bold text-[11pt]">Lampiran A</span>
      </div>
      <JBPMHeader />
      <div className="text-center mb-6">
        <h3 className="font-bold text-[11.5pt] uppercase">BORANG MAKLUMAT PERIBADI</h3>
        <p className="text-[10.5pt] font-bold uppercase">PASUKAN KADET BOMBA DAN PENYELAMAT MALAYSIA</p>
      </div>

      <div className="space-y-4 px-4">
        <div className="grid grid-cols-[180px_auto] gap-2">
          <div>1. Nama</div><div className="uppercase">: {s.nama}</div>
          <div>2. No. K/P</div><div className="font-mono">: {s.noKP}</div>
          <div>3. Nama Sekolah</div><div className="uppercase">: {schoolName}</div>
          <div>4. Alamat</div><div className="uppercase">: {s.alamat || '-'}</div>
          <div>5. Umur</div><div>: {s.umur || '-'}</div>
          <div>6. Tahap</div><div>: {s.tahap || '-'}</div>
          <div>7. Tingkatan</div><div>: {s.tingkatan}</div>
        </div>

        <div className="mt-6">
          <p>8. Adakah anda mempunyai penyakit: - (Tandakan / Pada yang berkenaan)</p>
          <div className="mt-4 grid grid-cols-[auto_100px_100px] gap-x-2 border border-black text-center font-bold text-[9pt]">
            <div className="border-b border-r border-black p-1 text-left">JENIS PENYAKIT</div>
            <div className="border-b border-r border-black p-1">ADA</div>
            <div className="border-b border-black p-1">TIADA</div>

            {[
              { key: 'asma', label: 'a. Asma' },
              { key: 'lelahTB', label: 'b. Lelah / Batuk Kering / TB' },
              { key: 'kencingManis', label: 'c. Kencing Manis' },
              { key: 'darahTinggi', label: 'd. Darah Tinggi' },
              { key: 'penglihatan', label: 'e. Masalah Penglihatan' },
              { key: 'pendengaran', label: 'f. Masalah Pendengaran' },
              { key: 'kronikLain', label: 'g. Penyakit Kronik lain Daripada Yang Tersenarai di Atas' }
            ].map(item => (
              <React.Fragment key={item.key}>
                <div className="border-b border-r border-black p-1 text-left font-normal">{item.label}</div>
                <div className="border-b border-r border-black p-1">{s.health?.[item.key as keyof typeof s.health] ? '/' : ''}</div>
                <div className="border-b border-black p-1">{!s.health?.[item.key as keyof typeof s.health] ? '/' : ''}</div>
              </React.Fragment>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-[100px_auto] gap-2 items-baseline">
            <div className="font-bold">Nyatakan:</div>
            <div className="border-b border-black flex-1 min-h-[20px]">{s.health?.kecacatan || '-'}</div>
            <div className="font-bold">h. Kecacatan dan Lain-lain:</div>
            <div className="border-b border-black flex-1 min-h-[20px]">{s.health?.kecacatan ? (s.health.kronikLain ? '/' : '') : ''}</div>
          </div>
        </div>

        <div className="mt-8 text-justify italic">
          Saya mengaku bahawa saya sihat dan berminat menyertai Pasukan Kadet Bomba dan Penyelamat Malaysia.
        </div>

        <div className="mt-12 grid grid-cols-[auto_250px] gap-4">
          <div>Tarikh: ..............................</div>
          <div className="text-center">
            <div className="border-b border-black h-12"></div>
            <p className="mt-2 font-bold uppercase">Tandatangan / Nama Kadet</p>
          </div>
        </div>
      </div>
      <FooterInfo />
    </div>
  );

  const renderLampiranB = (s: Student) => (
    <div className="text-black leading-normal text-[10.5pt] h-[297mm]">
      <div className="flex justify-end mb-2">
        <span className="font-bold text-[11pt]">Lampiran B</span>
      </div>
      <JBPMHeader />
      <div className="text-center mb-10">
        <h3 className="font-bold text-[11.5pt] uppercase underline">BORANG PELEPASAN TANGGUNGJAWAB</h3>
      </div>

      <div className="space-y-6 px-4">
        <p>Saya <span className="font-bold uppercase border-b border-black inline-block px-2 min-w-[200px]">{s.namaWaris || '................................'}</span> No. Kad Pengenalan <span className="font-bold border-b border-black inline-block px-2 min-w-[150px]">{s.noKPWaris || '.....................'}</span></p>
        
        <p>(Nama ibu bapa/penjaga) beralamat <span className="font-bold uppercase border-b border-black inline-block w-full">{s.alamatWaris || s.alamat || '....................................................................................................'}</span></p>
        
        <p>dengan ini membenarkan <span className="font-bold uppercase border-b border-black inline-block px-2 min-w-[200px]">{s.nama}</span> menyertai:</p>

        <div className="text-center font-bold text-[12pt] my-6">
          PASUKAN KADET BOMBA DAN PENYELAMAT MALAYSIA DI
          <div className="mt-2 border-b border-black inline-block px-10">{schoolName}</div>
        </div>

        <p className="text-justify leading-relaxed">
          Saya sedar bahawa kebenaran ini meliputi aktiviti-aktiviti, lawatan dan perkhemahan yang dianjurkan oleh sama ada pihak sekolah atau pihak bomba.
        </p>

        <p className="text-justify leading-relaxed">
          Saya sedar bahawa pihak penganjur akan mengambil segala langkah keselamatan, dengan itu berjanji tidak akan mengambil sebarang tindakan mahkamah bagi sebarang kejadian yang di luar kawalan pihak penganjur yang mengakibatkan kecacatan sementara dan atau kecacatan kekal dan atau kematian ke atas anak / pelajar jagaan saya semasa dalam perjalanan pergi dan balik untuk menyertai aktiviti dan atau semasa penglibatannya di dalam aktiviti-aktiviti yang dijalankan.
        </p>

        <p className="text-justify leading-relaxed">
          Saya juga membenarkan anak / pelajar jagaan saya mendapat rawatan perubatan yang sewajarnya sekiranya berlaku kecemasan.
        </p>

        <div className="mt-16 grid grid-cols-[auto_250px] gap-4">
          <div>Tarikh: ..............................</div>
          <div className="text-center">
            <div className="border-b border-black h-12"></div>
            <p className="mt-2 font-bold uppercase">( Ibu / Bapa / Penjaga )</p>
          </div>
        </div>
      </div>
      <FooterInfo />
    </div>
  );

  const getReportContent = () => {
    const s = targetId ? data.students.find(x => x.id === targetId) : null;
    
    switch(type) {
      case 'AHLI': 
        return (
          <div className="text-black">
            <div className="mb-4 text-black flex items-start gap-6 border-b-[1.5pt] border-black pb-2">
              {data.settings?.logoUrl && <img src={data.settings.logoUrl} alt="Logo" className="w-16 h-16 object-contain" />}
              <div className="text-left pt-1">
                <h1 className="text-[11pt] font-bold uppercase leading-tight">{schoolName}</h1>
                <p className="text-[9pt] font-normal">{address}</p>
              </div>
            </div>
            <h3 className="text-center font-bold text-lg mb-6 uppercase underline">SENARAI INDUK AHLI {clubName}</h3>
            <table className="w-full border-collapse border border-black text-xs">
              <thead><tr className="bg-gray-100 font-bold"><th className="border border-black p-2">BIL</th><th className="border border-black p-2 text-left">NAMA PENUH</th><th className="border border-black p-2">NO. KP</th><th className="border border-black p-2">TING/KELAS</th></tr></thead>
              <tbody>{data.students.sort((a,b)=>a.nama.localeCompare(b.nama)).map((s,i)=>(<tr key={s.id}><td className="border border-black p-2 text-center">{i+1}</td><td className="border border-black p-2 font-bold uppercase">{s.nama}</td><td className="border border-black p-2 text-center font-mono">{s.noKP}</td><td className="border border-black p-2 text-center uppercase">{s.tingkatan} {s.kelas}</td></tr>))}</tbody>
            </table>
          </div>
        );
      case 'PENDAFTARAN': 
        if (!s) return null;
        return (
          <div className="space-y-[20mm]">
            {renderLampiranA(s)}
            <div className="page-break h-0"></div>
            {renderLampiranB(s)}
          </div>
        );
      case 'AKTIVITI': 
        const act = data.activities.find(a => a.id === targetId);
        if (!act) return null;
        return (
          <div className="text-black text-[10pt]">
            <div className="border-b border-black mb-4 pb-2 font-bold text-center uppercase">LAPORAN AKTIVITI MINGGUAN KADET BOMBA</div>
            <div className="grid grid-cols-[150px_auto] gap-2 mb-6">
              <div className="font-bold">TARIKH:</div><div>{act.tarikh}</div>
              <div className="font-bold">AKTIVITI:</div><div className="uppercase font-bold">{act.nama}</div>
              <div className="font-bold">TEMPAT:</div><div className="uppercase">{act.tempat}</div>
            </div>
            <div className="border border-black p-4 min-h-[400px]">
              <div className="font-bold underline mb-2 uppercase">LAPORAN PENUH:</div>
              <div className="whitespace-pre-wrap">{act.ulasan}</div>
            </div>
          </div>
        );
      default: return <div>Report type not implemented.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 overflow-y-auto">
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b-2 border-slate-200 z-[100] flex items-center justify-between px-8 text-black no-print shadow-md">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft className="w-6 h-6" /></button>
          <h2 className="font-black text-lg uppercase tracking-tighter">PRATONTON DOKUMEN RASMI</h2>
        </div>
        <button onClick={() => window.print()} className="flex items-center gap-2 px-8 py-2.5 bg-red-700 text-white font-black rounded-lg hover:bg-red-800 transition-all shadow-xl uppercase text-sm tracking-widest">
          <Printer className="w-5 h-5" /> CETAK (A4)
        </button>
      </div>

      <div className="pt-24 pb-20 flex justify-center bg-slate-900 min-h-screen no-print">
        <div className="bg-white shadow-2xl w-[210mm] p-[15mm] print-area border border-slate-300">
          {getReportContent()}
        </div>
      </div>

      <div className="hidden print:block print-area">
          {getReportContent()}
      </div>
      
      <style>{`
        @media print {
          .page-break { page-break-before: always; }
        }
      `}</style>
    </div>
  );
};

export default PrintPreview;
