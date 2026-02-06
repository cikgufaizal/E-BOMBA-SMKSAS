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
  // 1. Tentukan Orientasi
  const orientation = (type === 'KEHADIRAN' || type === 'AHLI') ? 'landscape' : 'portrait';

  // 2. Auto-Print Logic
  useEffect(() => {
    // Beri masa untuk React render DOM sepenuhnya sebelum panggil window.print()
    // Masa 800ms cukup untuk memastikan gambar/logo sempat dimuatkan (jika cached)
    const timer = setTimeout(() => {
      window.print();
      onClose(); // Tutup overlay selepas dialog print ditutup
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
    // OVERLAY PENUH SKRIN (Z-INDEX TINGGI)
    // Di skrin: Kelihatan putih penuh menutup aplikasi.
    // Di print: Hanya ini yang akan dicetak kerana App.tsx guna class 'print:hidden' pada Layout.
    <div className="fixed inset-0 z-[9999] bg-white text-black overflow-y-auto">
       
       {/* MESEJ STATUS UNTUK PENGGUNA (HILANG BILA PRINT) */}
       <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/90 z-[10000] print:hidden">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-widest">Sedang Menjana Dokumen...</h2>
          <p className="text-sm text-slate-500 mt-2">Sila tunggu dialog pencetak muncul.</p>
       </div>

       {/* KAWASAN YANG AKAN DICETAK */}
       <div 
        id="printable-area" 
        className="mx-auto bg-white"
        style={{ 
          fontFamily: '"Times New Roman", Times, serif',
          width: orientation === 'landscape' ? '297mm' : '210mm',
          minHeight: orientation === 'landscape' ? '210mm' : '297mm',
          padding: '10mm' // Padding visual di skrin
        }}
       >
          {renderContent()}
       </div>

       {/* CSS KHAS UNTUK PRINT - MEMAKSA FORMAT YANG BETUL */}
       <style>{`
          @media print {
             @page { 
               size: A4 ${orientation}; 
               margin: 10mm; /* Margin fizikal printer */
             }
             
             /* PASTIKAN BODY DAN HTML TIDAK MENGGANGGU */
             html, body {
               width: 100%;
               height: auto !important;
               margin: 0 !important;
               padding: 0 !important;
               background: white !important;
               overflow: visible !important;
             }

             /* PASTIKAN CONTAINER KITA MENGAMBIL ALIH */
             #printable-area {
               width: 100% !important;
               margin: 0 !important;
               padding: 0 !important;
               position: absolute;
               top: 0;
               left: 0;
             }

             /* SEMBUNYIKAN SEMUA YANG LAIN (Double Safety) */
             body > *:not(#root) { display: none !important; }
             
             /* TABLE PAGE BREAK FIXES */
             table { width: 100%; border-collapse: collapse; }
             thead { display: table-header-group; }
             tfoot { display: table-footer-group; }
             tr { page-break-inside: avoid; }
             
             /* FONT & COLOR */
             * { 
                -webkit-print-color-adjust: exact !important; 
                print-color-adjust: exact !important; 
                color: black !important;
             }
          }
       `}</style>
    </div>
  );
};

export default PrintContainer;