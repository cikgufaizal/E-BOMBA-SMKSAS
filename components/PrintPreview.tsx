
import React from 'react';
import { Printer, ArrowLeft } from 'lucide-react';
import { SystemData, ReportType, Student, JawatanAJK, Attendance } from '../types';
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

  const Header = () => (
    <div className="text-center mb-8 border-b-2 border-black pb-4">
      <h1 className="text-2xl font-bold uppercase">{SCHOOL_INFO.name}</h1>
      <p className="text-sm">{SCHOOL_INFO.address}</p>
      <p className="text-sm font-bold">{SCHOOL_INFO.postcode}</p>
      <div className="mt-4 border-t border-black pt-2">
        <h2 className="text-xl font-bold uppercase">{SCHOOL_INFO.clubName}</h2>
        <p className="text-md">TAHUN {currentYear}</p>
      </div>
    </div>
  );

  const Footer = () => (
    <div className="mt-12 pt-4 border-t border-slate-200 text-[10px] text-slate-400 flex justify-between">
      <span>Sistem Pengurusan E-Kelab Pro</span>
      <span>Tarikh Cetakan: {printTime}</span>
    </div>
  );

  const SignatureSection = () => (
    <div className="mt-16 grid grid-cols-2 gap-12">
      <div className="space-y-12">
        <p>Disediakan oleh:</p>
        <div className="w-64 border-b border-black"></div>
        <p className="text-sm font-bold">(NAMA: _____________________)</p>
        <p className="text-sm">Jawatan: Guru Penasihat</p>
      </div>
      <div className="space-y-12">
        <p>Disahkan oleh:</p>
        <div className="w-64 border-b border-black"></div>
        <p className="text-sm font-bold">(NAMA: _____________________)</p>
        <p className="text-sm">Jawatan: Pengetua/GPK Kokurikulum</p>
      </div>
    </div>
  );

  const renderAhli = () => (
    <div className="print-landscape p-8">
      <Header />
      <h3 className="text-center font-bold text-lg mb-4">SENARAI AHLI AKTIF</h3>
      <table className="w-full border-collapse border border-black text-sm">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-black p-2">Bil</th>
            <th className="border border-black p-2">Nama Penuh</th>
            <th className="border border-black p-2">No. Kad Pengenalan</th>
            <th className="border border-black p-2">Ting.</th>
            <th className="border border-black p-2">Kelas</th>
            <th className="border border-black p-2">Jantina</th>
            <th className="border border-black p-2">Kaum</th>
          </tr>
        </thead>
        <tbody>
          {data.students.sort((a,b) => Number(a.tingkatan) - Number(b.tingkatan)).map((s, idx) => (
            <tr key={s.id}>
              <td className="border border-black p-2 text-center">{idx + 1}</td>
              <td className="border border-black p-2 font-bold">{s.nama}</td>
              <td className="border border-black p-2 text-center">{s.noKP}</td>
              <td className="border border-black p-2 text-center">{s.tingkatan}</td>
              <td className="border border-black p-2 text-center">{s.kelas}</td>
              <td className="border border-black p-2 text-center">{s.jantina}</td>
              <td className="border border-black p-2 text-center">{s.kaum}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Footer />
    </div>
  );

  const renderAJK = () => {
    const sortedCommittees = [...data.committees].sort((a,b) => {
        const order = Object.values(JawatanAJK);
        return order.indexOf(a.jawatan) - order.indexOf(b.jawatan);
    });
    return (
      <div className="p-8">
        <Header />
        <h3 className="text-center font-bold text-lg mb-4 underline">CARTA ORGANISASI AHLI JAWATANKUASA</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-black p-2">Bil</th>
              <th className="border border-black p-2">Jawatan</th>
              <th className="border border-black p-2">Nama Ahli</th>
              <th className="border border-black p-2">No. IC</th>
              <th className="border border-black p-2">Ting/Kelas</th>
            </tr>
          </thead>
          <tbody>
            {sortedCommittees.map((ajk, idx) => {
              const student = data.students.find(s => s.id === ajk.studentId);
              return (
                <tr key={ajk.id}>
                  <td className="border border-black p-2 text-center">{idx + 1}</td>
                  <td className="border border-black p-2 font-bold uppercase text-[10px]">{ajk.jawatan}</td>
                  <td className="border border-black p-2 font-bold">{student?.nama || 'N/A'}</td>
                  <td className="border border-black p-2 text-center">{student?.noKP || '-'}</td>
                  <td className="border border-black p-2 text-center">{student?.tingkatan} {student?.kelas}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <SignatureSection />
        <Footer />
      </div>
    );
  };

  const renderKehadiranSummary = () => {
    // Generate monthly grid for each student
    const studentAttendanceMap = data.students.sort((a,b) => Number(a.tingkatan) - Number(b.tingkatan)).map(s => {
       const row: any = { id: s.id, nama: s.nama, ting: s.tingkatan, months: Array(12).fill('-') };
       MONTHS.forEach((m, mIdx) => {
          // Find attendance for this month
          const monthRecords = data.attendances.filter(a => {
             const d = new Date(a.tarikh);
             return d.getMonth() === mIdx;
          });
          if (monthRecords.length === 0) row.months[mIdx] = '-';
          else {
             const presentCount = monthRecords.filter(r => r.presents.includes(s.id)).length;
             row.months[mIdx] = presentCount > 0 ? '✓' : '✗';
          }
       });
       return row;
    });

    const monthlyStats = MONTHS.map((m, idx) => {
       const records = data.attendances.filter(a => new Date(a.tarikh).getMonth() === idx);
       if (records.length === 0) return { hadir: 0, total: 0 };
       const totalHadir = records.reduce((acc, curr) => acc + curr.presents.length, 0);
       const totalSesi = records.length * data.students.length;
       return { hadir: totalHadir, total: totalSesi };
    });

    return (
      <div className="print-landscape p-8">
        <Header />
        <h3 className="text-center font-bold text-md mb-4 uppercase">RUMUSAN KEHADIRAN TAHUNAN ({currentYear})</h3>
        <table className="w-full border-collapse border border-black text-[9pt]">
          <thead className="bg-slate-100">
            <tr>
              <th className="border border-black p-1" rowSpan={2}>Bil</th>
              <th className="border border-black p-1" rowSpan={2}>Nama Ahli</th>
              <th className="border border-black p-1" rowSpan={2}>Ting</th>
              <th className="border border-black p-1 text-center" colSpan={12}>Bulan</th>
              <th className="border border-black p-1" rowSpan={2}>Jum</th>
            </tr>
            <tr>
              {MONTHS.map(m => <th key={m} className="border border-black p-1 text-[7px]">{m.substring(0,3)}</th>)}
            </tr>
          </thead>
          <tbody>
            {studentAttendanceMap.map((row, idx) => (
              <tr key={row.id}>
                <td className="border border-black p-1 text-center">{idx + 1}</td>
                <td className="border border-black p-1 font-bold whitespace-nowrap overflow-hidden max-w-[150px]">{row.nama}</td>
                <td className="border border-black p-1 text-center">{row.ting}</td>
                {row.months.map((m: any, i: number) => (
                  <td key={i} className={`border border-black p-1 text-center font-bold ${m === '✓' ? 'text-green-600' : m === '✗' ? 'text-red-600' : ''}`}>
                    {m}
                  </td>
                ))}
                <td className="border border-black p-1 text-center">{row.months.filter((m:any) => m === '✓').length}</td>
              </tr>
            ))}
            <tr className="bg-slate-50 font-bold">
               <td colSpan={3} className="border border-black p-1 text-right">JUMLAH HADIR:</td>
               {monthlyStats.map((s, i) => <td key={i} className="border border-black p-1 text-center">{s.hadir}</td>)}
               <td className="border border-black p-1"></td>
            </tr>
             <tr className="bg-slate-50 font-bold">
               <td colSpan={3} className="border border-black p-1 text-right">PERATUS (%):</td>
               {monthlyStats.map((s, i) => <td key={i} className="border border-black p-1 text-center">{s.total ? Math.round((s.hadir/s.total)*100) : 0}%</td>)}
               <td className="border border-black p-1"></td>
            </tr>
          </tbody>
        </table>
        <SignatureSection />
        <Footer />
      </div>
    );
  };

  const renderAktivitiReport = () => {
    const act = data.activities.find(a => a.id === targetId);
    if (!act) return <div className="p-8">Laporan tidak ditemui.</div>;
    const att = data.attendances.find(a => a.tarikh === act.tarikh);
    const presentCount = att?.presents.length || 0;
    const totalCount = data.students.length;
    const percent = totalCount ? Math.round((presentCount / totalCount) * 100) : 0;

    return (
      <div className="p-12">
        <Header />
        <h3 className="text-center font-bold text-xl mb-8 underline">LAPORAN AKTIVITI MINGGUAN / PROJEK</h3>
        
        <div className="space-y-6 text-md">
          <div className="grid grid-cols-3 border-b pb-2">
             <span className="font-bold">AKTIVITI / PROJEK</span>
             <span className="col-span-2 uppercase font-bold text-blue-800">{act.nama}</span>
          </div>
          <div className="grid grid-cols-3 border-b pb-2">
             <span className="font-bold">TARIKH</span>
             <span className="col-span-2">{act.tarikh}</span>
          </div>
          <div className="grid grid-cols-3 border-b pb-2">
             <span className="font-bold">MASA & TEMPAT</span>
             <span className="col-span-2">{act.masa} @ {act.tempat}</span>
          </div>
          
          <div className="mt-8">
            <h4 className="font-bold text-lg mb-4 bg-slate-100 p-2">STATISTIK KEHADIRAN</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="border p-4 rounded-lg text-center">
                <p className="text-sm text-slate-500">Jumlah Ahli</p>
                <p className="text-2xl font-bold">{totalCount}</p>
              </div>
              <div className="border p-4 rounded-lg text-center">
                <p className="text-sm text-slate-500">Hadir</p>
                <p className="text-2xl font-bold text-blue-600">{presentCount} ({percent}%)</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="font-bold text-lg mb-4 bg-slate-100 p-2">ULASAN / CATATAN GURU</h4>
            <div className="border p-6 rounded-lg min-h-[200px] bg-slate-50 italic">
               {act.ulasan || 'Tiada ulasan disediakan.'}
            </div>
          </div>

          <div className="mt-8">
            <h4 className="font-bold text-lg mb-4 bg-slate-100 p-2">GURU PENASIHAT HADIR</h4>
            <ul className="list-disc pl-6 space-y-1">
               {data.teachers.map(t => <li key={t.id}>{t.nama} ({t.jawatan})</li>)}
            </ul>
          </div>
        </div>
        <SignatureSection />
        <Footer />
      </div>
    );
  };

  const content = () => {
    switch(type) {
      case 'AHLI': return renderAhli();
      case 'AJK': return renderAJK();
      case 'KEHADIRAN': return renderKehadiranSummary();
      case 'AKTIVITI': return renderAktivitiReport();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-700 overflow-y-auto no-print">
      <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-xl z-50 flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="font-bold text-lg">Pratonton Cetakan</h2>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => window.print()} 
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg"
          >
            <Printer className="w-5 h-5" /> Cetak Sekarang
          </button>
        </div>
      </div>

      <div className="pt-24 pb-12 flex justify-center">
        <div className="bg-white shadow-2xl w-[210mm] min-h-[297mm] origin-top transition-all" id="printable-area">
          {content()}
        </div>
      </div>
      
      {/* Actual content for printing (hidden from screen, shown on print) */}
      <div className="print-only">
        {content()}
      </div>
    </div>
  );
};

export default PrintPreview;
