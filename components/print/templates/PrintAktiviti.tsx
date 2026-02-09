import React from 'react';
import { SystemData } from '../../../types';
import SchoolHeader from '../headers/SchoolHeader';

interface Props {
  data: SystemData;
  activityId: string;
}

const PrintAktiviti: React.FC<Props> = ({ data, activityId }) => {
  const act = data.activities.find(a => a.id === activityId);
  
  if (!act) return <div className="p-10 text-center font-bold text-red-600">RALAT: Data Aktiviti Tidak Dijumpai</div>;
  
  const attRecord = data.attendances.find(a => a.tarikh === act.tarikh);
  const presentCount = attRecord ? attRecord.presents.length : 0;
  const totalStudents = data.students.length || 1;
  const percentage = Math.round((presentCount / totalStudents) * 100);

  return (
    <div className="w-full h-[297mm] relative bg-white p-8 box-border flex flex-col" style={{ pageBreakAfter: 'always' }}>
       <SchoolHeader data={data} />
       
       <div className="text-center mb-6 font-serif uppercase text-black">
           <h2 className="text-[12pt] font-bold underline">LAPORAN AKTIVITI MINGGUAN</h2>
       </div>

       <div className="border border-black p-6 space-y-4 font-serif text-black flex-1">
          <div className="grid grid-cols-[150px_auto] gap-y-3 text-[10pt]">
             <div className="font-bold uppercase">1. Nama Aktiviti</div><div className="font-bold uppercase">: {act.nama}</div>
             <div className="font-bold uppercase">2. Tarikh</div><div className="uppercase">: {new Date(act.tarikh).toLocaleDateString('ms-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
             <div className="font-bold uppercase">3. Masa</div><div className="uppercase">: {act.masa}</div>
             <div className="font-bold uppercase">4. Tempat</div><div className="uppercase">: {act.tempat}</div>
             <div className="font-bold uppercase">5. Kehadiran</div><div className="uppercase">: {presentCount} / {totalStudents} Orang ({percentage}%)</div>
          </div>

          <div className="pt-4 border-t border-black">
             <div className="font-bold uppercase mb-2 text-[10pt]">6. Laporan / Ulasan Aktiviti:</div>
             <div className="p-3 border border-black min-h-[150px] text-justify whitespace-pre-wrap leading-relaxed text-[10pt]">
                {act.ulasan || "Tiada ulasan disediakan."}
             </div>
          </div>

          {act.photos && act.photos.length > 0 && (
            <div className="pt-4 border-t border-black">
               <div className="font-bold uppercase mb-4 text-[10pt]">7. Dokumentasi Bergambar:</div>
               <div className="grid grid-cols-2 gap-6">
                  {act.photos.map((photo, i) => (
                    <div key={i} className="aspect-[4/3] border border-black overflow-hidden flex items-center justify-center bg-gray-50 p-1">
                       <img src={photo} alt={`Gambar ${i+1}`} className="w-full h-full object-contain" />
                    </div>
                  ))}
               </div>
            </div>
          )}
       </div>

       <div className="mt-8 grid grid-cols-2 gap-20 font-serif text-black">
          <div className="text-center w-[200px] mx-auto">
            <p className="font-bold uppercase text-[9pt] mb-16">Disediakan Oleh:</p>
            <div className="h-px bg-black w-full mb-1"></div>
            <p className="text-[8pt] font-bold uppercase">( SETIAUSAHA )</p>
          </div>
          <div className="text-center w-[200px] mx-auto">
            <p className="font-bold uppercase text-[9pt] mb-16">Disahkan Oleh:</p>
            <div className="h-px bg-black w-full mb-1"></div>
            <p className="text-[8pt] font-bold uppercase">( GURU PENASIHAT )</p>
          </div>
       </div>
    </div>
  );
};

export default PrintAktiviti;