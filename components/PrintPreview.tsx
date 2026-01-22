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
    <div className="relative mb-8 border-b-2 border-black pb-4 text-black">
      <div className="flex items-center justify-center gap-6">
        {data.settings?.logoUrl && (
          <img src={data.settings.logoUrl} alt="Logo Sekolah" className="w-24 h-24 object-contain" />
        )}
        <div className="text-center">
          <h1 className="text-2xl font-bold uppercase leading-tight">{schoolName}</h1>
          <p className="text-sm whitespace-pre-wrap">{address}</p>
          <div className="mt-2 border-t border-black/20 pt-1">
            <h2 className="text-xl font-bold uppercase">{clubName}</h2>
            <p className="text-md">SESI PERSEKOLAHAN {currentYear}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const SignatureSection = () => (
    <div className="mt-16 grid grid-cols-2 gap-12 text-black">
      <div className="space-y-12">
        <p>Disediakan oleh:</p>
        <div className="w-64 border-b border-black"></div>
        <p className="text-xs font-bold">(NAMA: _____________________)</p>
        <p className="text-[10px]">Guru Penasihat {clubName}</p>
      </div>
      <div className="space-y-12">
        <p>Disahkan oleh:</p>
        <div className="w-64 border-b border-black"></div>
        <p className="text-xs font-bold">(NAMA: _____________________)</p>
        <p className="text-[10px]">Pengetua/GPK Kokurikulum</p>
      </div>
    </div>
  );

  const FooterInfo = () => (
    <div className="mt-12 pt-4 border-t border-slate-300 text-[10px] text-slate-600 flex justify-between">
      <span>Sistem Pengurusan {clubName} Professional</span>
      <span>Dicetak: {printTime}</span>
    </div>
  );

  const renderAhli = () => (
    <div className="text-black">
      <Header />
      <h3 className="text-center font-bold text-lg mb-6 border-b pb-2">SENARAI INDUK AHLI {clubName}</h3>
      <table className="w-full border-collapse border border-black text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-black p-2 text-xs">BIL</th>
            <th className="border border-black p-2 text-xs">NAMA PENUH</th>
            <th className="border border-black p-2 text-xs">NO. KP</th>
            <th className="border border-black p-2 text-xs">TING.</th>
            <th className="border border-black p-2 text-xs">JANTINA</th>
            <th className="border border-black p-2 text-xs">KAUM</th>
          </tr>
        </thead>
        <tbody>
          {data.students.sort((a,b) => a.nama.localeCompare(b.nama)).map((s, idx) => (
            <tr key={s.id}>
              <td className="border border-black p-2 text-center text-xs">{idx + 1}</td>
              <td className="border border-black p-2 font-bold text-xs uppercase">{s.nama}</td>
              <td className="border border-black p-2 text-center text-xs">{s.noKP}</td>
              <td className="border border-black p-2 text-center text-xs">{s.tingkatan} {s.kelas}</td>
              <td className="border border-black p-2 text-center text-xs">{s.jantina}</td>
              <td className="border border-black p-2 text-center text-xs">{s.kaum}</td>
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
        <h3 className="text-center font-bold text-lg mb-6 underline">CARTA ORGANISASI AHLI JAWATANKUASA</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-2 text-xs">BIL</th>
              <th className="border border-black p-2 text-xs">JAWATAN</th>
              <th className="border border-black p-2 text-xs">NAMA PENUH</th>
              <th className="border border-black p-2 text-xs">TING/KELAS</th>
            </tr>
          </thead>
          <tbody>
            {sortedCommittees.map((ajk, idx) => {
              const student = data.students.find(s => s.id === ajk.studentId);
              return (
                <tr key={ajk.id}>
                  <td className="border border-black p-2 text-center text-xs">{idx + 1}</td>
                  <td className="border border-black p-2 font-bold text-[10px] uppercase">{ajk.jawatan}</td>
                  <td className="border border-black p-2 font-bold text-xs uppercase">{student?.nama || 'N/A'}</td>
                  <td className="border border-black p-2 text-center text-xs">{student?.tingkatan} {student?.kelas}</td>
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
    const studentAttendanceMap = data.students.sort((a,b) => a.nama.localeCompare(b.nama)).map(s => {
       const row: any = { id: s.id, nama: s.nama, ting: s.tingkatan, months: Array(12).fill('-') };
       MONTHS.forEach((m, mIdx) => {
          const monthRecords = data.attendances.filter(a => new Date(a.tarikh).getMonth() === mIdx);
          if (monthRecords.length === 0) row.months[mIdx] = '-';
          else {
             const presentCount = monthRecords.filter(r => r.presents.includes(s.id)).length;
             row.months[mIdx] = presentCount > 0 ? 'Y' : 'T';
          }
       });
       return row;
    });

    return (
      <div className="text-black">
        <Header />
        <h3 className="text-center font-bold text-md mb-6 uppercase border-b pb-2">RUMUSAN KEHADIRAN AKTIVITI ({currentYear})</h3>
        <table className="w-full border-collapse border border-black text-[7pt]">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-1" rowSpan={2}>BIL</th>
              <th className="border border-black p-1" rowSpan={2}>NAMA PENUH AHLI</th>
              <th className="border border-black p-1" rowSpan={2}>TING</th>
              <th className="border border-black p-1 text-center" colSpan={12}>BULAN</th>
            </tr>
            <tr className="bg-gray-50">
              {MONTHS.map(m => <th key={m} className="border border-black p-0.5 text-[6pt]">{m.substring(0,3)}</th>)}
            </tr>
          </thead>
          <tbody>
            {studentAttendanceMap.map((row, idx) => (
              <tr key={row.id}>
                <td className="border border-black p-1 text-center">{idx + 1}</td>
                <td className="border border-black p-1 font-bold uppercase truncate max-w-[120px]">{row.nama}</td>
                <td className="border border-black p-1 text-center">{row.ting}</td>
                {row.months.map((m: any, i: number) => (
                  <td key={i} className="border border-black p-0.5 text-center font-bold text-[6pt]">
                    {m}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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
        <h3 className="text-center font-bold text-xl mb-8 underline uppercase">LAPORAN AKTIVITI MINGGUAN {clubName}</h3>
        
        <div className="space-y-6 text-sm">
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="border border-black p-3 font-bold bg-gray-50 w-1/3">AKTIVITI / PROJEK</td>
                <td className="border border-black p-3 font-black uppercase text-blue-900">{act.nama}</td>
              </tr>
              <tr>
                <td className="border border-black p-3 font-bold bg-gray-50">TARIKH & MASA</td>
                <td className="border border-black p-3 uppercase">{act.tarikh} | {act.masa}</td>
              </tr>
              <tr>
                <td className="border border-black p-3 font-bold bg-gray-50">TEMPAT</td>
                <td className="border border-black p-3 uppercase">{act.tempat}</td>
              </tr>
              <tr>
                <td className="border border-black p-3 font-bold bg-gray-50">KEHADIRAN</td>
                <td className="border border-black p-3 font-bold">{presentCount} / {totalCount} ({percent}%)</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-8">
            <h4 className="font-bold text-md mb-2 bg-gray-100 p-2 border border-black uppercase">LAPORAN & ULASAN AKTIVITI</h4>
            <div className="border border-black p-6 min-h-[300px] text-justify leading-relaxed whitespace-pre-wrap">
               {act.ulasan || 'Tiada laporan teks disediakan bagi aktiviti ini.'}
            </div>
          </div>

          <div className="mt-8">
            <h4 className="font-bold text-md mb-2 bg-gray-100 p-2 border border-black uppercase">GURU PENASIHAT TERLIBAT</h4>
            <div className="border border-black p-4">
              <ul className="list-decimal pl-5 space-y-1">
                 {data.teachers.map(t => <li key={t.id} className="font-bold uppercase">{t.nama} ({t.jawatan})</li>)}
              </ul>
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
    <div className="min-h-screen bg-slate-800 overflow-y-auto">
      {/* Navigation Bar (no-print) */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-xl z-50 flex items-center justify-between px-8 text-black no-print">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-600">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="font-bold text-lg uppercase tracking-tighter">PRATONTON LAPORAN A4</h2>
        </div>
        <button 
          onClick={() => window.print()} 
          className="flex items-center gap-2 px-6 py-2 bg-red-700 text-white font-bold rounded-lg hover:bg-red-800 transition-all shadow-lg uppercase text-xs tracking-widest"
        >
          <Printer className="w-4 h-4" /> Cetak Sekarang
        </button>
      </div>

      {/* Main Container for Preview and Print */}
      <div className="pt-24 pb-12 flex justify-center bg-slate-800 min-h-screen">
        <div className="bg-white shadow-2xl w-[210mm] min-h-[297mm] p-10 print-area">
          {getReportContent()}
        </div>
      </div>
    </div>
  );
};

export default PrintPreview;