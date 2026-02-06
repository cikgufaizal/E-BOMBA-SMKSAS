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
  // Senarai Ahli & Kehadiran = Landscape. Lain = Portrait.
  const orientation = (type === 'KEHADIRAN' || type === 'AHLI') ? 'landscape' : 'portrait';

  useEffect(() => {
    // Delay sedikit untuk pastikan content load sebelum print dialog keluar
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
    <div className="min-h-screen bg-gray-500 flex flex-col items-center py-10">
       
       {/* HEADER KAWALAN (AKAN HILANG BILA PRINT) */}
       <div className="no-print fixed top-0 left-0 right-0 bg-white shadow-md p-4 flex justify-between items-center z-50">
          <div className="flex items-center gap-4">
             <button onClick={onClose} className="flex items-center gap-2 text-slate-700 hover:text-black font-bold font-sans text-sm">
                <ArrowLeft className="w-5 h-5" /> KEMBALI KE SISTEM
             </button>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={() => window.print()} 
                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded shadow-lg font-bold font-sans text-sm"
             >
                <Printer className="w-4 h-4" /> CETAK / SIMPAN PDF
             </button>
          </div>
       </div>

       {/* KERTAS PUTIH (PREVIEW AREA) */}
       {/* Kita set background white secara hardcode di sini */}
       <div 
         className="bg-white text-black shadow-2xl mt-10 print-content"
         style={{
           width: orientation === 'landscape' ? '297mm' : '210mm',
           minHeight: orientation === 'landscape' ? '210mm' : '297mm',
           padding: '15mm', // Padding default untuk preview skrin
           boxSizing: 'border-box',
           fontFamily: '"Times New Roman", Times, serif'
         }}
       >
          {renderContent()}
       </div>

       {/* CSS KHAS PRINT (Global Styles) */}
       <style>{`
          /* Import font rasmi jika tiada di PC user */
          @import url('https://fonts.googleapis.com/css2?family=Tinos:wght@400;700&display=swap');

          @media print {
             @page { 
                size: A4 ${orientation}; 
                margin: 15mm; /* Margin standard 1.5cm sekeliling */
             }
             
             /* Reset Browser Defaults */
             html, body { 
                background-color: white !important; 
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                height: 100% !important;
                overflow: visible !important;
                -webkit-print-color-adjust: exact !important; 
                print-color-adjust: exact !important;
             }

             /* Sembunyikan UI Sistem */
             .no-print, nav, aside, header { 
                display: none !important; 
             }

             /* Pastikan content print memenuhi kertas */
             .print-content {
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important; /* Margin dikawal oleh @page */
                box-shadow: none !important;
                border: none !important;
                background: white !important;
                color: black !important;
             }

             /* TABLE OPTIMIZATION */
             table {
                width: 100% !important;
                border-collapse: collapse !important;
                font-size: 10pt; /* Saiz standard */
             }
             
             /* Ulang Header di setiap page */
             thead {
                display: table-header-group !important;
             }
             
             /* Elak row putus di tengah page */
             tr {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
             }
             
             /* Footer table jika ada */
             tfoot {
                display: table-footer-group !important;
             }

             /* Pastikan text sentiasa hitam pekat */
             * {
                color: black !important;
                font-family: 'Times New Roman', Times, serif !important;
             }
          }
       `}</style>
    </div>
  );
};

export default PrintContainer;