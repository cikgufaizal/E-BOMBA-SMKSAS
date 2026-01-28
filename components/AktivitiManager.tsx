
import React, { useState, useRef } from 'react';
import { Plus, Trash2, Printer, MapPin, Clock, Image as ImageIcon, X } from 'lucide-react';
import { SystemData, Activity } from '../types';
import { FormCard, Input, Button, Table, InlineConfirm } from './CommonUI';

interface Props {
  data: SystemData;
  updateData: (newData: Partial<SystemData>) => void;
  onPrint: (id: string) => void;
}

const AktivitiManager: React.FC<Props> = ({ data, updateData, onPrint }) => {
  const [formData, setFormData] = useState<Partial<Activity>>({
    tarikh: new Date().toISOString().split('T')[0],
    masa: '14:00',
    nama: '',
    tempat: 'Bilik Robotik',
    ulasan: '',
    photos: []
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fungsi Kompres Gambar (Resize ke max 600px & Quality 0.6)
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Tukar ke JPEG quality 0.6 untuk jimat storage
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          resolve(dataUrl);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const currentPhotos = formData.photos || [];
    if (currentPhotos.length + files.length > 2) {
      alert("Maksimum 2 keping gambar sahaja dibenarkan.");
      return;
    }

    const newPhotos: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 2 * 1024 * 1024) { // 2MB Limit Input
        alert(`Gambar ${file.name} terlalu besar (>2MB). Sila pilih gambar lain.`);
        continue;
      }
      const compressed = await compressImage(file);
      newPhotos.push(compressed);
    }

    setFormData({ ...formData, photos: [...currentPhotos, ...newPhotos] });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...(formData.photos || [])];
    newPhotos.splice(index, 1);
    setFormData({ ...formData, photos: newPhotos });
  };

  const addAktiviti = () => {
    if (!formData.nama || !formData.tarikh) return;
    const newAct: Activity = {
      id: crypto.randomUUID(),
      tarikh: formData.tarikh!,
      masa: formData.masa || '',
      nama: formData.nama,
      tempat: formData.tempat || '',
      ulasan: formData.ulasan || '',
      photos: formData.photos || []
    };
    updateData({ activities: [...data.activities, newAct] });
    setFormData({ ...formData, nama: '', ulasan: '', photos: [] });
  };

  const getAttendanceStats = (date: string) => {
    const att = data.attendances.find(a => a.tarikh === date);
    if (!att) return 'Tiada Log';
    const percent = data.students.length ? Math.round((att.presents.length / data.students.length) * 100) : 0;
    return `${att.presents.length}/${data.students.length} (${percent}%)`;
  };

  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-lg font-bold text-slate-200 uppercase tracking-tighter mb-6">Laporan Aktiviti & Projek</h2>

      <FormCard title="Tambah Rekod Aktiviti">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input type="date" label="Tarikh Aktiviti" value={formData.tarikh} onChange={(e: any) => setFormData({...formData, tarikh: e.target.value})} />
          <Input type="time" label="Masa" value={formData.masa} onChange={(e: any) => setFormData({...formData, masa: e.target.value})} />
          <Input label="Nama Aktiviti" placeholder="Cth: Latihan Pertandingan" value={formData.nama} onChange={(e: any) => setFormData({...formData, nama: e.target.value})} />
          <Input label="Tempat" value={formData.tempat} onChange={(e: any) => setFormData({...formData, tempat: e.target.value})} />
          
          {/* UPLOAD GAMBAR */}
          <div className="md:col-span-2">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Gambar Laporan (Max 2 Keping)</label>
             <div className="flex flex-wrap gap-4">
                {formData.photos?.map((photo, idx) => (
                  <div key={idx} className="w-24 h-24 relative group rounded-xl overflow-hidden border border-slate-700">
                    <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                    <button onClick={() => removePhoto(idx)} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                ))}
                {(formData.photos?.length || 0) < 2 && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 bg-slate-900 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:text-red-500 hover:border-red-500 transition-all gap-1"
                  >
                    <ImageIcon className="w-6 h-6" />
                    <span className="text-[9px] font-bold uppercase">Upload</span>
                  </button>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                />
             </div>
          </div>

          <div className="md:col-span-2 space-y-2">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Ulasan / Catatan</label>
             <textarea 
               className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all outline-none h-32"
               placeholder="Masukkan laporan aktiviti di sini..."
               value={formData.ulasan}
               onChange={(e) => setFormData({...formData, ulasan: e.target.value})}
             />
          </div>
          <div className="md:col-span-2">
            <Button onClick={addAktiviti} className="w-full py-4"><Plus className="w-4 h-4" /> Simpan Rekod Aktiviti</Button>
          </div>
        </div>
      </FormCard>

      <Table
        headers={['Tarikh', 'Masa/Tempat', 'Aktiviti', 'Gambar', 'Tindakan']}
        data={data.activities.sort((a,b) => b.tarikh.localeCompare(a.tarikh))}
        renderRow={(act: Activity) => (
          <tr key={act.id} className="hover:bg-slate-900/50 transition-colors">
            <td className="px-6 py-4">
              <p className="font-bold text-slate-200 uppercase">{act.tarikh}</p>
            </td>
            <td className="px-6 py-4 space-y-1">
              <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold"><Clock className="w-3 h-3" /> {act.masa}</div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold"><MapPin className="w-3 h-3" /> {act.tempat}</div>
            </td>
            <td className="px-6 py-4">
               <p className="font-bold text-red-500 uppercase">{act.nama}</p>
               <p className="text-[10px] text-slate-500 line-clamp-1 italic">{act.ulasan}</p>
               <span className="text-[9px] font-black text-slate-600 mt-1 block">KEHADIRAN: {getAttendanceStats(act.tarikh)}</span>
            </td>
            <td className="px-6 py-4">
               {act.photos && act.photos.length > 0 ? (
                 <div className="flex -space-x-2">
                   {act.photos.map((p, i) => (
                     <div key={i} className="w-8 h-8 rounded-full border border-slate-900 overflow-hidden ring-2 ring-slate-800">
                        <img src={p} className="w-full h-full object-cover" alt="Thumb" />
                     </div>
                   ))}
                 </div>
               ) : (
                 <span className="text-[9px] text-slate-600 italic">Tiada</span>
               )}
            </td>
            <td className="px-6 py-4">
              <div className="flex gap-2">
                <button onClick={() => onPrint(act.id)} className="p-2 text-slate-500 hover:text-emerald-500 transition-colors" title="Cetak Laporan">
                  <Printer className="w-5 h-5" />
                </button>
                {deletingId === act.id ? (
                  <InlineConfirm onConfirm={() => updateData({ activities: data.activities.filter(a => a.id !== act.id) })} onCancel={() => setDeletingId(null)} />
                ) : (
                  <button onClick={() => setDeletingId(act.id)} className="p-2 text-slate-500 hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </td>
          </tr>
        )}
      />
    </div>
  );
};

export default AktivitiManager;
