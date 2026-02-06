import React, { useEffect } from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import { SystemData, ReportType } from '../../types';

// Import Templates
import PrintSenaraiAhli from './templates/PrintSenaraiAhli';
import PrintKehadiran from './templates/PrintKehadiran';
import PrintCartaAJK from './templates/PrintCartaAJK';
import PrintAktiviti from './templates/PrintAktiviti';
import PrintBorangBomba from './templates/PrintBorangBomba';

interface PrintProps {
  type: ReportType;
  data: SystemData;
  targetId?: string;
  onClose: () => void;
}

const PrintContainer: React.FC<PrintProps> = ({ type, data, targetId, onClose }) => {
  // Untuk Senarai Ahli & Kehadiran, Landscape lebih kemas. Dokumen lain Portrait.
  const orientation = (type === 'KEHADIRAN' || type === 'AHLI') ? 'landscape' : 'portrait';

  useEffect(() => {
    // Beri masa render sebelum print dialog keluar
    const timer = setTimeout(() => {
      window.print();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch(type) {
      case 'AHLI': return <PrintSenaraiAhli data={data} />;
      case 'KEHADIRAN': return <PrintKehadiran data={data} />;
      case 'AJK': return <PrintCartaAJK data={data} />;
      case 'AKTIVITI': return targetId ? <PrintAktiviti data={data} activityId={targetId} /> : <div>Error: ID Aktiviti Missing</div>;
      case 'PENDAFTARAN': 
      case 'LAMPIRAN_B':
      case 'LAMPIRAN_E':
      case 'LAMPIRAN_F':
        return <PrintBorangBomba data={data} type={type} targetId={targetId} />;
      default: return <div>Modul cetakan ini belum disokong.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 text-black">
       
       {/* HEADER KAWALAN (TIDAK DICETAK) */}
       <div className="no-print fixed top-0 left-0 right-0 bg-white shadow-md p-4 flex justify-between items-center z-50">
          <div className="flex items-center gap-4">
             <button onClick={onClose} className="flex items-center gap-2 text-slate-600 hover:text-black font-bold font-sans">
                <ArrowLeft className="w-5 h-5" /> KEMBALI
             </button>
             <span className="text-sm font-bold bg-gray-200 px-3 py-1 rounded text-gray-700 font-sans">MOD CETAKAN: {type}</span>
          </div>
          <button 
            onClick={() => window.print()} 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-all font-sans"
          >
             <Printer className="w-5 h-5" /> CETAK
          </button>
       </div>

       {/* KERTAS PUTIH (PREVIEW AREA) */}
       {/* Menggunakan font Times New Roman (Serif) secara default untuk nampak rasmi */}
       <div 
         id="printable-area"
         className="bg-white shadow-2xl mt-16 font-serif"
         style={{
           width: orientation === 'landscape' ? '297mm' : '210mm',
           minHeight: orientation === 'landscape' ? '210mm' : '297mm',
           padding: '20mm', // Padding visual di skrin
         }}
       >
          {renderContent()}
       </div>

       {/* CSS KHAS UNTUK PRINT (PENTING) */}
       <style>{`
          /* Import Font Google jika perlu, tapi Times New Roman biasanya built-in */
          @import url('https://fonts.googleapis.com/css2?family=Tinos:wght@400;700&display=swap');

          @media print {
             @page { 
                size: A4 ${orientation}; 
                margin: 20mm; /* Margin Rasmi 2cm / 20mm sekeliling */
             }
             
             html, body { 
                background: white !important; 
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                height: 100% !important;
                font-family: 'Times New Roman', Times, serif !important;
             }

             /* Hide UI System */
             .no-print { display: none !important; }
             body > *:not(#printable-area) { display: none !important; }

             /* Print Area Reset */
             #printable-area {
                display: block !important;
                position: relative !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important; /* Margin @page dah handle */
                box-shadow: none !important;
                overflow: visible !important;
             }

             /* TABLE LOGIC YANG LEBIH KETAT */
             table {
                width: 100%;
                border-collapse: collapse;
                border-spacing: 0;
             }
             
             /* Pastikan Header Jadual Berulang di Page Baru */
             thead {
                display: table-header-group;
             }
             
             tfoot {
                display: table-footer-group;
             }

             /* PENTING: Jangan potong baris di tengah jalan */
             tr {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
             }

             /* Font Styles */
             td, th, p, div, span {
                color: black !important;
                font-family: 'Times New Roman', Times, serif !important;
             }
          }
       `}</style>
    </div>
  );
};

export default PrintContainer;