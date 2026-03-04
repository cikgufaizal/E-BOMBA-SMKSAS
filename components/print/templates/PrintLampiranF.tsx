import React from 'react';
import { SystemData, JawatanGuru } from '../../../types';

interface Props {
  data: SystemData;
}

const PrintLampiranF: React.FC<Props> = ({ data }) => {
  const sortedStudents = [...data.students].sort((a, b) => a.nama.localeCompare(b.nama));
  
  // Data as per user request
  const schoolName = "SMK SULTAN AHMAD SHAH, CAMERON HIGHLANDS";
  const schoolAddress = "JALAN DAYANG ENDAH, 39000 TANAH RATA, CAMERON HIGHLANDS PAHANG";
  const schoolPhone = "0197782924"; 
  const guruPenasihat = "AHMAD FAIZAL BIN AYOP";
  const BOMBA_LOGO = data.settings?.bombaLogoUrl || "https://upload.wikimedia.org/wikipedia/commons/8/87/Jabatan_Bomba_dan_Penyelamat_Malaysia.png";

  // Konfigurasi Baris Per Halaman
  const ROWS_PAGE_1 = 10; 
  const ROWS_PAGE_REST = 25;

  const pages = [];
  let remaining = [...sortedStudents];
  
  // Page 1
  pages.push({ type: 'DATA', data: remaining.splice(0, ROWS_PAGE_1) });
  
  // User explicitly asked for Page 2 to be empty if there are more students or even if not?
  // "KEMUDIAN PAGE 2 KOSONG, DAN PAGE 3 ADA BALIK"
  // I will insert a blank page after page 1.
  pages.push({ type: 'BLANK' });

  // Subsequent pages starting from Page 3
  while (remaining.length > 0) {
    pages.push({ type: 'DATA', data: remaining.splice(0, ROWS_PAGE_REST) });
  }

  const renderTable = (pageData: any[], startBil: number, rowCount: number) => (
    <table className="w-full border-collapse border border-black text-[10pt]">
      <thead>
        <tr className="h-[30px]">
          <th className="border border-black p-1 w-[40px] text-center">Bil.</th>
          <th className="border border-black p-1 px-2 text-center">Nama Penuh</th>
          <th className="border border-black p-1 w-[150px] text-center">No. Kad Pengenalan</th>
          <th className="border border-black p-1 w-[120px] text-center">No. Keahlian</th>
        </tr>
      </thead>
      <tbody>
        {pageData.map((s, i) => (
          <tr key={s.id || i} className="h-[25px]">
            <td className="border border-black p-1 text-center">{startBil + i + 1}</td>
            <td className="border border-black p-1 px-2 uppercase font-bold truncate max-w-[350px]">{s.nama}</td>
            <td className="border border-black p-1 text-center font-mono">{s.noKP}</td>
            <td className="border border-black p-1 text-center font-bold">{s.noKeahlian || ''}</td>
          </tr>
        ))}
        {Array.from({ length: Math.max(0, rowCount - pageData.length) }).map((_, i) => (
          <tr key={`empty-${i}`} className="h-[25px]">
            <td className="border border-black p-1 text-center"></td>
            <td className="border border-black p-1"></td>
            <td className="border border-black p-1"></td>
            <td className="border border-black p-1"></td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderSignature = () => (
    <div className="mt-auto pt-6 text-[10pt]">
      <p className="mb-10">Disahkan oleh:</p>
      <div className="w-[250px] border-b border-black border-dotted mb-1"></div>
      <p>( <span className="inline-block w-[230px]"></span> )</p>
      <p>Pengetua / Guru Besar / Penyelia</p>
    </div>
  );

  return (
    <div className="w-full font-serif text-black bg-white leading-[1.2]">
      {pages.map((page, idx) => {
        const isFirst = idx === 0;
        const isBlank = page.type === 'BLANK';
        
        let startBil = 0;
        // Calculate startBil for data pages
        let dataPageIdx = 0;
        for (let i = 0; i < idx; i++) {
          if (pages[i].type === 'DATA') {
            startBil += (dataPageIdx === 0 ? ROWS_PAGE_1 : ROWS_PAGE_REST);
            dataPageIdx++;
          }
        }

        return (
          <div 
            key={idx} 
            className="relative w-full min-h-[297mm] bg-white p-10 flex flex-col box-border"
            style={{ pageBreakAfter: 'always' }}
          >
            {/* Label Lampiran */}
            <div className="absolute top-8 right-10 font-bold text-[11pt]">
              Lampiran F
            </div>

            {isBlank ? (
              <div className="flex-1 flex items-center justify-center text-gray-300 italic">
                (Halaman ini sengaja dikosongkan)
              </div>
            ) : (
              <>
                {isFirst && (
                  <div className="flex flex-col items-center mb-6">
                    <img src={BOMBA_LOGO} alt="Logo JBPM" className="h-20 w-auto object-contain mb-4" />
                    <div className="text-center font-bold text-[11pt] uppercase">
                      BORANG PENDAFTARAN<br/>
                      AHLI KADET BOMBA DAN PENYELAMAT MALAYSIA
                    </div>
                  </div>
                )}

                {isFirst && (
                  <div className="mb-6 text-[10pt] space-y-1">
                    <div className="flex">
                      <span className="w-[150px]">Nama Sekolah</span>
                      <span className="mr-2">:</span>
                      <span className="flex-1 border-b border-black font-bold uppercase">{schoolName}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-[150px]">Alamat Sekolah</span>
                      <span className="mr-2">:</span>
                      <div className="flex-1 space-y-1">
                        <div className="border-b border-black font-bold uppercase min-h-[1.2em]">{schoolAddress}</div>
                        <div className="border-b border-black min-h-[1.2em]"></div>
                      </div>
                    </div>
                    <div className="flex">
                      <span className="w-[150px]">No. Telefon</span>
                      <span className="mr-2">:</span>
                      <span className="flex-1 border-b border-black font-bold">{schoolPhone}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-[150px]">Nama Guru Penasihat</span>
                      <span className="mr-2">:</span>
                      <div className="flex-1 space-y-1">
                        <div className="border-b border-black font-bold uppercase min-h-[1.2em]">{guruPenasihat}</div>
                        <div className="border-b border-black min-h-[1.2em]"></div>
                        <div className="border-b border-black min-h-[1.2em]"></div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex-1">
                  {renderTable(page.data || [], startBil, isFirst ? ROWS_PAGE_1 : ROWS_PAGE_REST)}
                </div>

                {renderSignature()}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PrintLampiranF;