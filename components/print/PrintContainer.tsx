import React, { useState, useEffect } from 'react';
import { Printer, ArrowLeft } from 'lucide-react';
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
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  // Auto-set orientasi berdasarkan jenis laporan
  useEffect(() => {
    if (type === 'KEHADIRAN' || type === 'AHLI') {
      setOrientation('landscape');
    } else {
      setOrientation('portrait');
    }
  }, [type]);

  const renderContent = () => {
    switch(type) {
      case 'AHLI': return <PrintSenaraiAhli data={data} />;
      case 'KEHADIRAN': return <PrintKehadiran data={data} />;
      case 'AJK': return <PrintCartaAJK data={data} />;
      case 'AKTIVITI': return targetId ? <PrintAktiviti data={data} activityId={targetId} /> : <div>Error: ID Aktiviti Missing</div>;
      
      // Borang Bomba (Lampiran)
      case 'PENDAFTARAN': 
      case 'LAMPIRAN_B':
      case 'LAMPIRAN_E':
      case 'LAMPIRAN_F':
        return <PrintBorangBomba data={data} type={type} targetId={targetId} />;
      
      default: return <div>Modul cetakan ini belum disokong.</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-sm flex flex-col">
      {/* TOOLBAR ATAS (Tidak akan dicetak) */}
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

      {/* KAWASAN PREVIEW */}
      <div className="flex-1 overflow-auto p-8 flex justify-center bg-slate-800/50">
         <div 
           id="printable-area"
           className={`bg-white shadow-2xl transition-all duration-300 ${orientation === 'landscape' ? 'w-[297mm] min-h-[210mm]' : 'w-[210mm] min-h-[297mm]'}`}
           style={{ fontFamily: '"Times New Roman", Times, serif', padding: '20mm' }}
         >
            {renderContent()}
         </div>
      </div>

      {/* CSS KHAS UNTUK PRINTING */}
      <style>{`
        @media print {
           @page { 
             size: A4 ${orientation}; 
             margin: 10mm;
           }
           
           /* Reset body dan html */
           html, body {
             margin: 0 !important;
             padding: 0 !important;
             background: white !important;
             width: 100% !important;
             height: auto !important;
             overflow: visible !important;
           }

           /* Sembunyikan semua elemen dalam body secara default */
           body * {
             visibility: hidden;
           }

           /* Paparkan hanya kawasan print dan anak-anaknya */
           #printable-area, #printable-area * {
             visibility: visible;
           }

           /* Letakkan kawasan print di posisi mutlak atas kiri */
           #printable-area {
             position: absolute !important;
             left: 0 !important;
             top: 0 !important;
             width: 100% !important;
             margin: 0 !important;
             padding: 0 !important;
             box-shadow: none !important;
           }
           
           /* Pastikan text warna hitam */
           * { 
             -webkit-print-color-adjust: exact !important; 
             print-color-adjust: exact !important; 
             color: black !important;
           }
           
           /* TABLE LOGIC */
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

export default PrintContainer;