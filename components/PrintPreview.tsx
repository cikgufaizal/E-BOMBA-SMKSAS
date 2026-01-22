
import React from 'react';
import { Printer, ArrowLeft } from 'lucide-react';
import { SystemData, ReportType, JawatanAJK, Jantina } from '../types';
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

  // Header Rasmi: Logo di sebelah KIRI mengikut permintaan pengguna
  const OfficialHeader = () => (
    <div className="mb-6 text-black">
      <div className="flex items-start gap-6">
        {data.settings?.logoUrl && (
          <img src={data.settings.logoUrl} alt="Logo" className="w-24 h-24 object-contain shrink-0" />
        )}
        <div className="text-left space-y-0.5 pt-2">
          <h1 className="text-[12pt] font-bold uppercase leading-tight">{schoolName}</h1>
          <p className="text-[10pt] font-normal whitespace-pre-wrap max-w-2xl">{address}</p>
        </div>
      </div>
      <div className="mt-4 border-b-[2pt] border-black w-full"></div>
    </div>
  );

  const FooterInfo = () => (
    <div className="mt-16 pt-2 border-t border-black/10 text-[8px] text-slate-400 flex justify-between uppercase no-print">
      <span>E-Kadet Bomba Professional • {clubName}</span>
      <span>Masa Cetakan: {printTime}</span>
    </div>
  );

  const renderAhli = () => (
    <div className="text-black">
      <OfficialHeader />
      <h3 className="text-center font-bold text-lg mb-8 uppercase underline underline-offset-4">SENARAI INDUK AHLI {clubName}</h3>
      <table className="w-full border-collapse border border-black text-sm">
        <thead>
          <tr className="bg-gray-100 font-bold">
            <th className="border border-black p-2 text-center w-12">BIL</th>
            <th className="border border-black p-2 text-left uppercase">NAMA PENUH</th>
            <th className="border border-black p-2 text-center w-32">NO. KP</th>
            <th className="border border-black p-2 text-center w-20">JANTINA</th>
            <th className="border border-black p-2 text-center w-32">TINGKATAN / KELAS</th>
          </tr>
        </thead>
        <tbody>
          {data.students.sort((a,b) => a.nama.localeCompare(b.nama)).map((s, idx) => (
            <tr key={s.id}>
              <td className="border border-black p-2 text-center text-xs">{idx + 1}</td>
              <td className="border border-black p-2 font-bold text-xs uppercase">{s.nama}</td>
              <td className="border border-black p-2 text-center text-xs font-mono">{s.noKP}</td>
              <td className="border border-black p-2 text-center text-[10px] font-black uppercase">
                {s.jantina === Jantina.Perempuan ? 'P' : 'L'}
              </td>
              <td className="border border-black p-2 text-center text-xs uppercase font-bold">{s.tingkatan} {s.kelas}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-20 grid grid-cols-2 gap-20">
        <div className="border-t border-black pt-2 text-center text-xs font-bold">Tandatangan Guru Penasihat</div>
        <div className="border-t border-black pt-2 text-center text-xs font-bold">Tandatangan Pengetua/GPK</div>
      </div>
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
        <OfficialHeader />
        <h3 className="text-center font-bold text-lg mb-8 uppercase underline underline-offset-4">CARTA ORGANISASI AHLI JAWATANKUASA</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <thead>
            <tr className="bg-gray-100 font-bold">
              <th className="border border-black p-3 text-center w-12">BIL</th>
              <th className="border border-black p-3 text-left w-1/4">JAWATAN</th>
              <th className="border border-black p-3 text-left">NAMA PENUH</th>
              <th className="border border-black p-3 text-center w-32">NO. KP</th>
              <th className="border border-black p-3 text-center w-32">TING / KELAS</th>
            </tr>
          </thead>
          <tbody>
            {sortedCommittees.map((ajk, idx) => {
              const student = data.students.find(s => s.id === ajk.studentId);
              return (
                <tr key={ajk.id}>
                  <td className="border border-black p-3 text-center">{idx + 1}</td>
                  <td className="border border-black p-3 font-bold text-xs uppercase">{ajk.jawatan}</td>
                  <td className="border border-black p-3 text-sm font-bold uppercase">{student?.nama || 'N/A'}</td>
                  <td className="border border-black p-3 text-center text-xs">{student?.noKP || '-'}</td>
                  <td className="border border-black p-3 text-center text-xs font-bold uppercase">{student?.tingkatan} {student?.kelas}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="mt-20 grid grid-cols-2 gap-20">
          <div className="border-t border-black pt-2 text-center text-xs font-bold uppercase">Disediakan Oleh</div>
          <div className="border-t border-black pt-2 text-center text-xs font-bold uppercase">Disahkan Oleh</div>
        </div>
        <FooterInfo />
      </div>
    );
  };

  const renderKehadiranSummary = () => {
    const sortedStudents = [...data.students].sort((a,b) => a.nama.localeCompare(b.nama));
    return (
      <div className="text-black">
        <OfficialHeader />
        <h3 className="text-center font-bold text-lg mb-8 uppercase underline underline-offset-4">RUMUSAN KEHADIRAN AKTIVITI ({currentYear})</h3>
        <table className="w-full border-collapse border border-black text-[7pt]">
          <thead>
            <tr className="bg-gray-100 font-bold">
              <th className="border border-black p-1 text-center" rowSpan={2}>BIL</th>
              <th className="border border-black p-1 text-left uppercase" rowSpan={2}>NAMA PENUH AHLI</th>
              <th className="border border-black p-1 text-center" rowSpan={2}>TING / KELAS</th>
              <th className="border border-black p-1 text-center" colSpan={12}>BULAN</th>
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
                  <td className="border border-black p-1 text-center font-bold">{s.tingkatan} {s.kelas}</td>
                  {rowAtt.map((m, i) => (
                    <td key={i} className="border border-black p-0.5 text-center font-bold text-[8pt]">
                      {m}
                    </td>
                  ))}
                </tr>
               );
            })}
          </tbody>
        </table>
        <FooterInfo />
      </div>
    );
  };

  // FORMAT TEPAT MENGIKUT IMEJ PDF PENGGUNA DENGAN PENYELARASAN KOLON
  const renderAktivitiReport = () => {
    const act = data.activities.find(a => a.id === targetId);
    if (!act) return <div className="p-8 text-black">Laporan tidak ditemui.</div>;
    const att = data.attendances.find(a => a.tarikh === act.tarikh);
    const presentCount = att?.presents.length || 0;
    const totalCount = data.students.length;
    const percent = totalCount ? Math.round((presentCount / totalCount) * 100) : 0;
    const yearFromDate = act.tarikh ? new Date(act.tarikh).getFullYear() : currentYear;

    return (
      <div className="text-black leading-relaxed">
        <OfficialHeader />
        
        <div className="flex justify-between items-baseline mb-8">
          <h3 className="font-bold text-[14pt] uppercase tracking-tight">LAPORAN PERJUMPAAN MINGGUAN</h3>
          <p className="font-bold text-[12pt]">Tahun : <span className="ml-2 border-b-2 border-black inline-block w-24 text-center pb-0.5">{yearFromDate}</span></p>
        </div>

        <div className="space-y-6 text-[11pt]">
          {/* Section 1: Info Kelab & Tarikh */}
          <div className="grid grid-cols-[300px_auto] gap-2 items-baseline">
            <div className="font-bold">Kelab / Persatuan / Badan Beruniform* :</div>
            <div className="uppercase font-bold underline decoration-2 underline-offset-4">{clubName}</div>
            
            <div className="font-bold">Tarikh Aktiviti dijalankan :</div>
            <div className="font-bold border-b border-black flex-1 pb-1">{act.tarikh} ({act.masa})</div>
            
            <div className="font-bold">Aktiviti :</div>
            <div className="font-bold uppercase border-b border-black flex-1 pb-1">{act.nama}</div>
          </div>

          {/* Section 2: Statistik Kehadiran - SELARI KOLON */}
          <div className="mt-12 space-y-4">
            <div className="grid grid-cols-[250px_20px_auto] items-baseline">
               <div>Bilangan Sebenar ahli</div>
               <div>:</div>
               <div className="font-bold">{totalCount}</div>

               <div>Bilangan Ahli yang Hadir</div>
               <div>:</div>
               <div className="font-bold">{presentCount}</div>

               <div>Peratus Kehadiran</div>
               <div>:</div>
               <div className="font-bold">{percent}%</div>

               <div>Guru Penasihat yang Hadir</div>
               <div>:</div>
               <div className="font-bold uppercase border-b border-black flex-1 pb-1">
                 {data.teachers.map(t => t.nama).join(', ')}
               </div>
            </div>
          </div>

          {/* Section 3: Ulasan */}
          <div className="mt-12">
            <p className="font-bold mb-3 uppercase">Ulasan :</p>
            <div className="min-h-[300px] p-4 whitespace-pre-wrap italic leading-relaxed border border-black/10 bg-slate-50/30">
              {act.ulasan || 'Tiada maklumat laporan dimasukkan.'}
            </div>
          </div>

          {/* Section 4: Tandatangan */}
          <div className="mt-20 grid grid-cols-2">
            <div className="flex items-end h-full">
              <p className="font-bold">Tarikh : <span className="border-b border-black inline-block w-56 ml-2 text-center">{act.tarikh}</span></p>
            </div>
            <div className="space-y-4 text-left pl-20">
              <p className="font-bold">Tandatangan,</p>
              <div className="pt-12 border-b border-black w-72 mb-1"></div>
              <div className="relative">
                <span className="text-[11pt]">(</span>
                <span className="inline-block w-[260px] text-center font-bold uppercase underline underline-offset-2">
                  {data.teachers[0]?.nama || 'ZAIDATONAKMA BINTI ABD HAMID'}
                </span>
                <span className="text-[11pt]">)</span>
              </div>
              <p className="text-[10pt] font-bold">Guru Penasihat.</p>
            </div>
          </div>

          {/* Section 5: Peringatan */}
          <div className="mt-16 text-[9pt] space-y-1">
            <p><span className="font-bold">Peringatan :</span> Sila isikan maklumat dengan tepat.</p>
            <p className="pl-20 text-[8pt] italic">* - SILA POTONG YANG TIDAK BERKENAAN</p>
          </div>
        </div>
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
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b-2 border-slate-200 z-[100] flex items-center justify-between px-8 text-black no-print shadow-md">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="font-black text-lg uppercase tracking-tighter">PRATONTON LAPORAN RASMI</h2>
        </div>
        <button 
          onClick={() => window.print()} 
          className="flex items-center gap-2 px-8 py-2.5 bg-red-700 text-white font-black rounded-lg hover:bg-red-800 transition-all shadow-xl uppercase text-sm tracking-widest"
        >
          <Printer className="w-5 h-5" /> CETAK SEKARANG
        </button>
      </div>

      {/* Preview Wrapper */}
      <div className="pt-24 pb-20 flex justify-center bg-slate-900 min-h-screen no-print">
        <div className="bg-white shadow-[0_0_100px_rgba(0,0,0,0.5)] w-[210mm] min-h-[297mm] p-[20mm] print-area border border-slate-300">
          {getReportContent()}
        </div>
      </div>

      {/* Render elemen khas untuk print sahaja */}
      <div className="hidden print:block print-area">
          {getReportContent()}
      </div>
    </div>
  );
};

export default PrintPreview;
