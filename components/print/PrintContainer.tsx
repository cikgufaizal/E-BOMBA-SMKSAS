import React, { useEffect } from 'react';
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
  // 1. Tentukan Orientasi secara automatik
  const orientation = (type === 'KEHADIRAN' || type === 'AHLI') ? 'landscape' : 'portrait';

  // 2. Auto-Print apabila component di-mount
  useEffect(() => {
    // Timeout kecil untuk memastikan DOM sudah render sepenuhnya sebelum print trigger
    const timer = setTimeout(() => {
      window.print();
      // Selepas dialog print tutup (atau cancel), kita tutup component ini
      // Nota: window.print() adalah blocking di kebanyakan browser (script berhenti di situ).
      // Selepas user tutup dialog, script sambung dan jalankan onClose().
      onClose();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

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
    <div className="fixed top-0 left-0 w-0 h-0 overflow-hidden opacity-0 pointer-events-none">
       {/* 
          Container ini tersembunyi di skrin biasa (w-0 h-0 opacity-0).
          Tetapi CSS @media print di bawah akan memaksa ia menjadi visible semasa printing.
       */}
       
       <div id="printable-area" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
          {renderContent()}
       </div>

       <style>{`
          @media print {
             @page { 
               size: A4 ${orientation}; 
               margin: 10mm; 
             }
             
             /* Sembunyikan semua elemen UI App */
             body > *:not(#root) { display: none !important; }
             /* Dalam #root, sembunyikan semua kecuali printable-area parent */
             #root > * { display: none !important; }

             /* Reset body */
             html, body {
               background: white !important;
               height: auto !important;
               width: 100% !important;
               margin: 0 !important;
               padding: 0 !important;
               overflow: visible !important;
             }

             /* Paparkan Printable Area Sahaja - Teknik Overlay */
             .fixed.top-0.left-0 {
                position: absolute !important;
                width: 100% !important;
                height: auto !important;
                opacity: 1 !important;
                display: block !important;
                left: 0 !important;
                top: 0 !important;
                z-index: 9999 !important;
                pointer-events: auto !important;
             }

             #printable-area {
                display: block !important;
                width: 100% !important;
             }
             
             /* Table Page Break Logic */
             table { width: 100%; border-collapse: collapse; }
             thead { display: table-header-group; }
             tr { page-break-inside: avoid; }
             
             /* Warna Hitam */
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