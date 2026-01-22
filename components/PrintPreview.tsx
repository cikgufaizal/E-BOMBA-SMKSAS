import React from 'react';
import { Printer, ArrowLeft } from 'lucide-react';
import { SystemData, ReportType, JawatanAJK } from '../types';
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

  const Header = () => (
    <div className="mb-8 border-b-[3px] border-black pb-4 text-black flex items-center justify-center gap-8">
      {data.settings?.logoUrl && (
        <img src={data.settings.logoUrl} alt="Logo" className="w-24 h-24 object-contain shrink-0" />
      )}
      <div className="text-center">
        <h1 className="text-2xl font-extrabold uppercase leading-tight">{schoolName}</h1>
        <p className="text-sm font-medium whitespace-pre-wrap max-w-lg mx-auto">{address}</p>
        <div className="mt-2 border-t border-black/30 pt-1">
          <h2 className="text-xl font-bold uppercase tracking-wide">{clubName}</h2>
          <p className="text-md font-semibold">SESI PERSEKOLAHAN {currentYear}</p>
        </div>
      </div>
    </div>
  );

  const SignatureSection = () => (
    <div className="mt-16 grid grid-cols-2 gap-16 text-black">
      <div className="space-y-12">
        <p className="font-bold">Disediakan oleh:</p>
        <div className="w-full border-b-2 border-black"></div>
        <div className="text-xs font-bold">
          <p>(NAMA: _________________________________)</p>
          <p className="mt-1">GURU PENASIHAT {clubName}</p>
        </div>
      </div>
      <div className="space-y-12">
        <p className="font-bold">Disahkan oleh:</p>
        <div className="w-full border-b-2 border-black"></div>
        <div className="text-xs font-bold">
          <p>(NAMA: _________________________________)</p>
          <p className="mt-1">PENGETUA / GPK KOKURIKULUM</p>
        </div>
      </div>
    </div>
  );

  const FooterInfo = () => (
    <div className="mt-16 pt-2 border-t-2 border-black/10 text-[9px] text-slate-500 flex justify-between uppercase font-bold tracking-tighter">
      <span>Sistem Pengurusan {clubName} SMKSAS - Digital Edition</span>
      <span>Tarikh Cetakan: {printTime}</span>
    </div>
  );

  const renderAhli = () => (
    <div className="text-black">
      <Header />
      <h3 className="text-center font-black text-xl mb-8 uppercase underline decoration-2 underline-offset-4">SENARAI INDUK AHLI {clubName}</h3>
      <table className="w-full border-collapse border-2 border-black text-sm">
        <thead>
          <tr className="bg-gray-100 font-bold">
            <th className="border-2 border-black p-2 text-center w-12">BIL</th>
            <th className="border-2 border-black p-2 text-left">NAMA PENUH</th>
            <th className="border-2 border-black p-2 text-center w-32">NO. KP</th>
            <th className="border-2 border-black p-2 text-center w-24">TING.</th>
            <th className="border-2 border-black p-2 text-center w-24">JANTINA</th>
          </tr>
        </thead>
        <tbody>
          {data.students.sort((a,b) => a.nama.localeCompare(b.nama)).map((s, idx) => (
            <tr key={s.id}>
              <td className="border border-black p-2 text-center">{idx + 1}</td>
              <td className="border border-black p-2 font-bold uppercase">{s.nama}</td>
              <td className="border border-black p-2 text-center">{s.noKP}</td>
              <td className="border border-black p-2 text-center uppercase">{s.tingkatan} {s.kelas}</td>
              <td className="border border-black p-2 text-center text-xs">{s.jantina}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SignatureSection />
      <FooterInfo />
    </div>
  );

  const renderAJK = () => {
    const sortedCommittees = [...data.committees].sort((a,b) => {
        const order = Object.values(JawatanAJK);
        return order.indexOf(a.jawatan) - order.indexOf(b.jawatan);
    });
    return (
      <div className="text-black">
        <Header />
        <h3 className="text-center font-black text-xl mb-8 uppercase underline decoration-2 underline-offset-4">CARTA ORGANISASI AHLI JAWATANKUASA</h3>
        <table className="w-full border-collapse border-2 border-black text-sm">
          <thead>
            <tr className="bg-gray-100 font-bold">
              <th className="border-2 border-black p-3 text-center w-12">BIL</th>
              <th className="border-2 border-black p-3 text-left w-1/3">JAWATAN</th>
              <th className="border-2 border-black p-3 text-left">NAMA PENUH</th>
              <th className="border-2 border-black p-3 text-center w-24">TING/KELAS</th>
            </tr>
          </thead>
          <tbody>
            {sortedCommittees.map((ajk, idx) => {
              const student = data.students.find(s => s.id === ajk.studentId);
              return (
                <tr key={ajk.id}>
                  <td className="border border-black p-3 text-center">{idx + 1}</td>
                  <td className="border border-black p-3 font-black text-xs uppercase">{ajk.jawatan}</td>
                  <td className="border border-black p-3 font-bold uppercase">{student?.nama || 'N/A'}</td>
                  <td className="border border-black p-3 text-center uppercase">{student?.tingkatan} {student?.kelas}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <SignatureSection />
        <FooterInfo />
      </div>
    );
  };

  const renderKehadiranSummary = () => {
    const sortedStudents = [...data.students].sort((a,b) => a.nama.localeCompare(b.nama));
    return (
      <div className="text-black">
        <Header />
        <h3 className="text-center font-black text-xl mb-8 uppercase underline decoration-2 underline-offset-4">RUMUSAN KEHADIRAN AKTIVITI ({currentYear})</h3>
        <table className="w-full border-collapse border-2 border-black text-[7pt]">
          <thead>
            <tr className="bg-gray-100 font-bold">
              <th className="border-2 border-black p-1 text-center" rowSpan={2}>BIL</th>
              <th className="border-2 border-black p-1 text-left" rowSpan={2}>NAMA PENUH AHLI</th>
              <th className="border-2 border-black p-1 text-center" rowSpan={2}>TING</th>
              <th className="border-2 border-black p-1 text-center" colSpan={12}>BULAN</th>
            </tr>
            <tr className="bg-gray-50 font-bold">
              {MONTHS.map(m => <th key={m} className="border border-black p-0.5 text-center text-[6pt]">{m.substring(0,3)}</th>)}
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((s, idx) => {
               const rowAtt = MONTHS.map((m, mIdx) => {
                  const monthRecords = data.attendances.filter(a => new Date(a.tarikh).getMonth() === mIdx);
                  if (monthRecords.length === 0) return '-';
                  const presentCount = monthRecords.filter(r => r.presents.includes(s.id)).length;
                  return presentCount > 0 ? '/' : 'O';
               });
               return (
                <tr key={s.id}>
                  <td className="border border-black p-1 text-center">{idx + 1}</td>
                  <td className="border border-black p-1 font-bold uppercase truncate max-w-[150px]">{s.nama}</td>
                  <td className="border border-black p-1 text-center font-bold">{s.tingkatan}</td>
                  {rowAtt.map((m, i) => (
                    <td key={i} className="border border-black p-0.5 text-center font-black text-[8pt]">
                      {m}
                    </td>
                  ))}
                </tr>
               );
            })}
          </tbody>
        </table>
        <div className="mt-4 text-[8pt] font-bold italic">
           Nota: (/) Hadir sekurang-kurangnya sekali pada bulan tersebut | (O) Tidak hadir langsung | (-) Tiada aktiviti
        </div>
        <SignatureSection />
        <FooterInfo />
      </div>
    );
  };

  const renderAktivitiReport = () => {
    const act = data.activities.find(a => a.id === targetId);
    if (!act) return <div className="p-8 text-black">Laporan tidak ditemui.</div>;
    const att = data.attendances.find(a => a.tarikh === act.tarikh);
    const presentCount = att?.presents.length || 0;
    const totalCount = data.students.length;
    const percent = totalCount ? Math.round((presentCount / totalCount) * 100) : 0;

    return (
      <div className="text-black">
        <Header />
        <h3 className="text-center font-black text-xl mb-10 uppercase underline decoration-2 underline-offset-4">LAPORAN AKTIVITI MINGGUAN</h3>
        
        <div className="space-y-8 text-sm">
          <table className="w-full border-collapse border-2 border-black">
            <tbody>
              <tr>
                <td className="border border-black p-4 font-bold bg-gray-100 w-1/3 uppercase">AKTIVITI / PROJEK</td>
                <td className="border border-black p-4 font-black text-lg uppercase">{act.nama}</td>
              </tr>
              <tr>
                <td className="border border-black p-4 font-bold bg-gray-100 uppercase">TARIKH & MASA</td>
                <td className="border border-black p-4 font-bold uppercase">{act.tarikh} | {act.masa}</td>
              </tr>
              <tr>
                <td className="border border-black p-4 font-bold bg-gray-100 uppercase">TEMPAT</td>
                <td className="border border-black p-4 font-bold uppercase">{act.tempat}</td>
              </tr>
              <tr>
                <td className="border border-black p-4 font-bold bg-gray-100 uppercase">KEHADIRAN</td>
                <td className="border border-black p-4 font-black text-blue-700">{presentCount} / {totalCount} ORANG ({percent}%)</td>
              </tr>
            </tbody>
          </table>

          <div>
            <h4 className="font-black text-sm mb-2 bg-gray-100 p-2 border-2 border-black uppercase tracking-widest">LAPORAN & RINGKASAN AKTIVITI</h4>
            <div className="border-2 border-black p-8 min-h-[350px] text-justify leading-loose whitespace-pre-wrap font-medium text-md">
               {act.ulasan || 'Tiada maklumat laporan terperinci dimasukkan bagi aktiviti ini.'}
            </div>
          </div>
        </div>
        <SignatureSection />
        <FooterInfo />
      </div>
    );
  };

  const getReportContent = () => {
    switch(type) {
      case 'AHLI': return renderAhli();
      case 'AJK': return renderAJK();
      case 'KEHADIRAN': return renderKehadiranSummary();
      case 'AKTIVITI': return renderAktivitiReport();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 overflow-y-auto">
      {/* Navigation Bar (no-print) */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b-2 border-slate-200 z-[100] flex items-center justify-between px-8 text-black no-print">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="font-black text-lg uppercase tracking-tighter">PRATONTON LAPORAN A4</h2>
        </div>
        <button 
          onClick={() => window.print()} 
          className="flex items-center gap-2 px-8 py-2.5 bg-red-700 text-white font-black rounded-lg hover:bg-red-800 transition-all shadow-xl uppercase text-sm tracking-widest active:scale-95"
        >
          <Printer className="w-5 h-5" /> CETAK SEKARANG
        </button>
      </div>

      {/* Preview Wrapper (Kawasan Gelap di belakang) */}
      <div className="pt-24 pb-20 flex justify-center bg-slate-900 min-h-screen no-print">
        <div className="bg-white shadow-[0_0_100px_rgba(0,0,0,0.5)] w-[210mm] min-h-[297mm] p-[20mm] print-area border border-slate-300">
          {getReportContent()}
        </div>
      </div>

      {/* Render elemen khas untuk print sahaja (Hanya nampak masa print) */}
      <div className="hidden print:block print-area">
          {getReportContent()}
      </div>
    </div>
  );
};

export default PrintPreview;