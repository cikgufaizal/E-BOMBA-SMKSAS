import React from 'react';
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
  const orientation = (type === 'KEHADIRAN' || type === 'AHLI') ? 'landscape' : 'portrait';

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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 font-sans text-black">
       
       {/* HEADER: BUTANG KAWALAN (AKAN HILANG BILA PRINT) */}
       <div className="no-print fixed top-0 left-0 right-0 bg-white shadow-md p-4 flex justify-between items-center z-50">
          <div className="flex items-center gap-4">
             <button onClick={onClose} className="flex items-center gap-2 text-slate-600 hover:text-black font-bold">
                <ArrowLeft className="w-5 h-5" /> KEMBALI
             </button>
             <span className="text-sm font-bold bg-gray-200 px-3 py-1 rounded text-gray-700">MOD CETAKAN: {type}</span>
          </div>
          <button 
            onClick={() => window.print()} 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-all"
          >
             <Printer className="w-5 h-5" /> CETAK SEKARANG
          </button>
       </div>

       {/* KERTAS PUTIH (DOKUMEN) */}
       <div 
         className="bg-white shadow-2xl p-[20mm] mt-12"
         style={{
           width: orientation === 'landscape' ? '297mm' : '210mm',
           minHeight: orientation === 'landscape' ? '210mm' : '297mm', 
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
             body { 
                background: white; 
             }
             .no-print { 
                display: none !important; 
             }
             .shadow-2xl {
                box-shadow: none !important;
                margin-top: 0 !important;
                padding: 0 !important;
             }
          }
       `}</style>
    </div>
  );
};

export default PrintContainer;