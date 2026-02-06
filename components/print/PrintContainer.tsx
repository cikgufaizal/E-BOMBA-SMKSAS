import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
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
    // Tunggu render selesai
    const timer = setTimeout(() => {
      window.print();
      onClose();
    }, 1000); // Masa ditambah sedikit untuk memastikan CSS load sepenuhnya

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
    <div className="fixed inset-0 z-[9999] bg-white text-black font-serif" id="print-wrapper">
       
       {/* LOADING SCREEN (HANYA DI PAPARAN, HILANG BILA PRINT) */}
       <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 z-[10000] print:hidden">
          <Loader2 className="w-16 h-16 text-red-600 animate-spin mb-6" />
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest">Menjana Dokumen...</h2>
          <p className="text-slate-500 mt-2 font-sans font-medium">Sila tunggu dialog pencetak muncul.</p>
       </div>

       {/* CONTENT SEBENAR */}
       <div id="printable-area" className="mx-auto bg-white p-10 min-h-screen">
          {renderContent()}
       </div>

       {/* GLOBAL PRINT STYLES - PENYELESAIAN MASALAH "PRINT SCREEN" */}
       <style>{`
          @media print {
             @page { 
               size: A4 ${orientation}; 
               margin: 10mm; /* Margin standard pencetak */
             }
             
             /* 1. RESET GLOBAL */
             html, body {
               height: auto !important;
               overflow: visible !important;
               background: #FFF !important;
               margin: 0 !important;
               padding: 0 !important;
             }

             /* 2. SEMBUNYIKAN SEMUA ELEMEN LAIN */
             body * {
               visibility: hidden; /* Sembunyikan visual tetapi kekalkan posisi jika perlu (biasanya kita override di bawah) */
             }

             /* 3. PAPARKAN HANYA WRAPPER KITA & ANAK-ANAKNYA */
             #print-wrapper, #print-wrapper * {
               visibility: visible;
             }

             /* 4. POSISIKAN WRAPPER KE ATAS HALAMAN (OVERRIDE LAYOUT ASAL) */
             #print-wrapper {
               position: absolute !important;
               left: 0 !important;
               top: 0 !important;
               width: 100% !important;
               height: auto !important;
               margin: 0 !important;
               padding: 0 !important;
               background: white !important;
               z-index: 99999 !important;
               display: block !important;
               overflow: visible !important;
             }
             
             #printable-area {
                width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
             }

             /* 5. PAKSA WARNA HITAM & BORDER JELAS */
             * { 
                -webkit-print-color-adjust: exact !important; 
                print-color-adjust: exact !important; 
                color: #000 !important;
             }

             /* 6. TABLE BORDERS */
             table, th, td {
                border-color: #000 !important;
             }
             
             /* 7. HILANGKAN ELEMEN 'print:hidden' (Double Safety) */
             .print\\:hidden {
               display: none !important;
             }
          }
       `}</style>
    </div>
  );
};

export default PrintContainer;