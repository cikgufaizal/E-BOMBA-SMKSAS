import React from 'react';
import { SystemData } from '../../../types';
import SchoolHeader from '../headers/SchoolHeader';

interface Props {
  data: SystemData;
  activityId: string;
}

const PrintAktiviti: React.FC<Props> = ({ data, activityId }) => {
  const act = data.activities.find(a => a.id === activityId);
  
  if (!act) return <div>Data Aktiviti Tidak Dijumpai</div>;
  
  const attRecord = data.attendances.find(a => a.tarikh === act.tarikh);
  const presentCount = attRecord ? attRecord.presents.length : 0;
  const totalStudents = data.students.length || 1;
  const percentage = Math.round((presentCount / totalStudents) * 100);

  return (
    <div className="w-full">
       <SchoolHeader data={data} />
       
       <div className="text-center mb-6 font-serif uppercase text-black break-inside-avoid page-break-inside-avoid">
           <h2 className="text-[12pt] font-bold underline">LAPORAN AKTIVITI MINGGUAN</h2>
       </div>

       <div className="border border-black p-6 space-y-6 font-serif text-black break-inside-avoid page-break-inside-avoid">
          <div className="grid grid-cols-[180px_auto] gap-y-4 text-[11pt]">
             <div className="font-bold uppercase">1. Nama Aktiviti</div><div className="font-bold uppercase">: {act.nama}</div>
             <div className="font-bold uppercase">2. Tarikh</div><div className="uppercase">: {act.tarikh}</div>
             <div className="font-bold uppercase">3. Masa</div><div className="uppercase">: {act.masa}</div>
             <div className="font-bold uppercase">4. Tempat</div><div className="uppercase">: {act.tempat}</div>
             <div className="font-bold uppercase">5. Kehadiran</div><div className="uppercase">: {presentCount} / {totalStudents} ({percentage}%)</div>
          </div>
          <div className="pt-4 border-t border-black break-inside-avoid page-break-inside-avoid">
             <div className="font-bold uppercase mb-2 text-[11pt]">6. Laporan / Ulasan Aktiviti:</div>
             <div className="p-4 bg-gray-50 border border-black min-h-[150px] text-justify whitespace-pre-wrap leading-relaxed text-[11pt]">
                {act.ulasan || "Tiada ulasan disediakan."}
             </div>
          </div>
          {act.photos && act.photos.length > 0 && (
            <div className="pt-4 border-t border-black break-inside-avoid page-break-inside-avoid">
               <div className="font-bold uppercase mb-4 text-[11pt]">7. Dokumentasi Bergambar:</div>
               <div className="grid grid-cols-2 gap-4">
                  {act.photos.map((photo, i) => (
                    <div key={i} className="aspect-[4/3] border border-black overflow-hidden flex items-center justify-center bg-white p-2">
                       <img src={photo} alt={`Gambar ${i+1}`} className="max-w-full max-h-full object-contain" />
                    </div>
                  ))}
               </div>
            </div>
          )}
       </div>
       <div className="mt-12 grid grid-cols-2 gap-20 font-serif text-black break-inside-avoid page-break-inside-avoid">
          <div className="text-center">
            <p className="font-bold uppercase text-[11pt]">Disediakan Oleh:</p>
            <div className="h-20 border-b border-black"></div>
            <p className="text-[11pt] font-bold uppercase mt-2">( SETIAUSAHA )</p>
          </div>
          <div className="text-center">
            <p className="font-bold uppercase text-[11pt]">Disahkan Oleh:</p>
            <div className="h-20 border-b border-black"></div>
            <p className="text-[11pt] font-bold uppercase mt-2">( GURU PENASIHAT )</p>
          </div>
       </div>
    </div>
  );
};

export default PrintAktiviti;