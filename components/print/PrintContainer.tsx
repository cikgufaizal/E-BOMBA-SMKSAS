import React, { useEffect } from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import { SystemData, ReportType } from '../../types';

// Import Templates
import PrintSenaraiAhli from './templates/PrintSenaraiAhli';
import PrintKehadiran from './templates/PrintKehadiran';
import PrintCartaAJK from './templates/PrintCartaAJK';
import PrintAktiviti from './templates/PrintAktiviti';

// Import Modular Bomba Forms
import PrintLampiranA from './templates/PrintLampiranA';
import PrintLampiranB from './templates/PrintLampiranB';
import PrintLampiranD from './templates/PrintLampiranD'; 
import PrintLampiranE from './templates/PrintLampiranE';
import PrintLampiranF from './templates/PrintLampiranF';

interface PrintProps {
  type: ReportType;
  data: SystemData;
  targetId?: string;
  onClose: () => void;
}

const PrintContainer: React.FC<PrintProps> = ({ type, data, targetId, onClose }) => {
  // AHLI dan KEHADIRAN menggunakan Landscape
  const orientation = (type === 'KEHADIRAN' || type === 'AHLI') ? 'landscape' : 'portrait';

  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch(type) {
      // Modul Sekolah
      case 'AHLI': return <PrintSenaraiAhli data={data} />;
      case 'KEHADIRAN': return <PrintKehadiran data={data} />;
      case 'AJK': return <PrintCartaAJK data={data} />;
      case 'AKTIVITI': return targetId ? <PrintAktiviti data={data} activityId={targetId} /> : <div>Error</div>;
      
      // Modul Bomba (Modular)
      case 'PENDAFTARAN': return <PrintLampiranA data={data} targetId={targetId} />;
      case 'LAMPIRAN_B': return <PrintLampiranB data={data} targetId={targetId} />;
      case 'LAMPIRAN_D': return <PrintLampiranD data={data} />; 
      case 'LAMPIRAN_E': return <PrintLampiranE data={data} />;
      case 'LAMPIRAN_F': return <PrintLampiranF data={data} />;
      
      default: return <div>Not Supported</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center overflow-x-hidden">
       
       <div className="no-print fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-2xl p-4 flex justify-between items-center z-[100] border-b border-slate-200">
          <button onClick={onClose} className="flex items-center gap-3 px-6 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-black text-xs uppercase tracking-widest transition-all">
             <ArrowLeft className="w-5 h-5 text-red-600" /> KEMBALI KE SISTEM
          </button>
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-lg">
                Format: A4 {orientation.toUpperCase()} (100% SCALE)
             </span>
             <button onClick={() => window.print()} className="flex items-center gap-3 bg-red-600 text-white px-10 py-3 rounded-xl shadow-[0_10px_20px_rgba(220,38,38,0.3)] font-black text-xs uppercase tracking-[0.2em] hover:bg-red-500 transition-all active:scale-95">
                <Printer className="w-4 h-4" /> MULAKAN CETAKAN
             </button>
          </div>
       </div>

       <div 
         id="printable-area"
         className="bg-white text-black shadow-2xl mt-28 mb-20 print-root-wrapper animate-in fade-in zoom-in-95 duration-500"
         style={{
           width: orientation === 'landscape' ? '297mm' : '210mm',
           minHeight: orientation === 'landscape' ? '210mm' : '297mm',
           padding: '0',
           boxSizing: 'border-box'
         }}
       >
          {renderContent()}
       </div>

       <style>{`
          @media print {
             @page { 
                size: A4 ${orientation}; 
                margin: 0 !important;
             }
             
             html, body { 
                background: white !important; 
                margin: 0 !important;
                padding: 0 !important;
                width: ${orientation === 'landscape' ? '297mm' : '210mm'} !important;
                height: ${orientation === 'landscape' ? '210mm' : '297mm'} !important;
                overflow: visible !important;
             }

             .no-print { display: none !important; }

             .print-root-wrapper {
                width: ${orientation === 'landscape' ? '297mm' : '210mm'} !important;
                height: auto !important;
                margin: 0 !important;
                padding: 0 !important;
                box-shadow: none !important;
                border: none !important;
                transform: none !important;
             }

             * { 
                color: black !important; 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact; 
             }
             
             table { 
                page-break-inside: auto; 
                width: 100%;
             }
             tr { 
                page-break-inside: avoid; 
                page-break-after: auto; 
             }
          }
       `}</style>
    </div>
  );
};

export default PrintContainer;
