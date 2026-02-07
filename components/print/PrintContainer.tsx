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
  const orientation = (type === 'KEHADIRAN' || type === 'AHLI') ? 'landscape' : 'portrait';

  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch(type) {
      case 'AHLI': return <PrintSenaraiAhli data={data} />;
      case 'KEHADIRAN': return <PrintKehadiran data={data} />;
      case 'AJK': return <PrintCartaAJK data={data} />;
      case 'AKTIVITI': return targetId ? <PrintAktiviti data={data} activityId={targetId} /> : <div>Error</div>;
      case 'PENDAFTARAN': 
      case 'LAMPIRAN_B':
      case 'LAMPIRAN_E':
      case 'LAMPIRAN_F':
        return <PrintBorangBomba data={data} type={type} targetId={targetId} />;
      default: return <div>Not Supported</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 flex flex-col items-center">
       
       <div className="no-print fixed top-0 left-0 right-0 bg-white shadow-xl p-4 flex justify-between items-center z-50">
          <button onClick={onClose} className="flex items-center gap-2 text-slate-700 hover:text-red-600 font-bold text-sm">
             <ArrowLeft className="w-5 h-5" /> KEMBALI
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 bg-red-600 text-white px-8 py-2.5 rounded-xl shadow-lg font-black text-xs uppercase tracking-widest">
             <Printer className="w-4 h-4" /> CETAK SEKARANG
          </button>
       </div>

       <div 
         id="printable-area"
         className="bg-white text-black shadow-2xl mt-24 mb-20 print-root-wrapper"
         style={{
           width: orientation === 'landscape' ? '297mm' : '210mm',
           padding: '10mm',
           boxSizing: 'border-box'
         }}
       >
          {renderContent()}
       </div>

       <style>{`
          @media print {
             @page { 
                size: A4 ${orientation}; 
                margin: 10mm;
             }
             
             html, body { 
                background: white !important; 
                margin: 0 !important;
                padding: 0 !important;
             }

             .no-print { display: none !important; }

             .print-root-wrapper {
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                box-shadow: none !important;
                border: none !important;
             }

             * { color: black !important; -webkit-print-color-adjust: exact; }
          }
       `}</style>
    </div>
  );
};

export default PrintContainer;