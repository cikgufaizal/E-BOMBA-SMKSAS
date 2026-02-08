import React, { useState, useRef } from 'react';
import { Plus, Trash2, Printer, MapPin, Clock, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { SystemData, Activity } from '../types';
import { FormCard, Input, Button, Table, InlineConfirm } from './CommonUI';
import { compressImage } from '../utils/imageUtils';

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
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentPhotos = formData.photos || [];
    if (currentPhotos.length + files.length > 2) {
      alert("Maksimum 2 keping gambar sahaja dibenarkan.");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsProcessingImage(true);
    try {
      const newPhotos: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Kita guna utiliti compressImage untuk memastikan saiz < 300KB
        const compressed = await compressImage(file, 300);
        newPhotos.push(compressed);
      }

      setFormData(prev => ({ 
        ...prev, 
        photos: [...(prev.photos || []), ...newPhotos] 
      }));
    } catch (err) {
      console.error("Gagal memproses gambar:", err);
      alert("Ralat semasa memproses gambar.");
    } finally {
      setIsProcessingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...(formData.photos || [])];
    newPhotos.splice(index, 1);
    setFormData({ ...formData, photos: newPhotos });
  };

  const addAktiviti = () => {
    if (!formData.nama || !formData.tarikh) {
      alert("Sila isi Nama Aktiviti dan Tarikh.");
      return;
    }
    
    if (isProcessingImage) {
      alert("Sila tunggu sehingga gambar selesai diproses.");
      return;
    }

    const newAct: Activity = {
      id: crypto.randomUUID(),
      tarikh: formData.tarikh!,
      masa: formData.masa || '',
      nama: formData.nama.toUpperCase(),
      tempat: formData.tempat || '',
      ulasan: formData.ulasan || '',
      photos: formData.photos || []
    };

    updateData({ activities: [...data.activities, newAct] });
    
    // Reset form
    setFormData({
      tarikh: new Date().toISOString().split('T')[0],
      masa: '14:00',
      nama: '',
      tempat: 'Bilik Robotik',
      ulasan: '',
      photos: []
    });
    alert("Rekod aktiviti berjaya disimpan!");
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
             <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 block">Gambar Laporan (Maks 2)</label>
                {isProcessingImage && (
                  <span className="flex items-center gap-2 text-[10px] text-red-500 font-black animate-pulse uppercase">
                    <Loader2 className="w-3 h-3 animate-spin" /> Mengoptimumkan Gambar (Maks 300KB)...
                  </span>
                )}
             </div>
             
             <div className="flex flex-wrap gap-4">
                {formData.photos?.map((photo, idx) => (
                  <div key={idx} className="w-24 h-24 relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-800 shadow-lg">
                    <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removePhoto(idx)} 
                      className="absolute inset-0 bg-red-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                ))}
                
                {(formData.photos?.length || 0) < 2 && (
                  <button 
                    type="button"
                    disabled={isProcessingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-24 h-24 bg-slate-950 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-500 transition-all gap-1 ${isProcessingImage ? 'opacity-50 cursor-not-allowed' : 'hover:text-red-500 hover:border-red-500 hover:bg-red-500/5'}`}
                  >
                    <ImageIcon className="w-6 h-6" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Tambah</span>
                  </button>
                )}
                
                <input 
                  type="file" 
                  accept="image/jpeg,image/png" 
                  multiple 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                />
             </div>
          </div>

          <div className="md:col-span-2 space-y-2">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Ulasan / Catatan Aktiviti</label>
             <textarea 
               className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder:text-slate-700 focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all outline-none h-32 text-sm font-medium"
               placeholder="Masukkan laporan aktiviti di sini..."
               value={formData.ulasan}
               onChange={(e) => setFormData({...formData, ulasan: e.target.value})}
             />
          </div>
          <div className="md:col-span-2">
            <Button 
              onClick={addAktiviti} 
              disabled={isProcessingImage || !formData.nama}
              className="w-full py-4 shadow-xl"
            >
              {isProcessingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {isProcessingImage ? 'SEDANG MEMPROSES...' : 'SIMPAN REKOD AKTIVITI'}
            </Button>
          </div>
        </div>
      </FormCard>

      <Table
        headers={['Tarikh', 'Masa/Tempat', 'Aktiviti', 'Gambar', 'Tindakan']}
        data={data.activities.sort((a,b) => b.tarikh.localeCompare(a.tarikh))}
        renderRow={(act: Activity) => (
          <tr key={act.id} className="group hover:bg-slate-900/50 transition-colors border-b border-white/[0.02]">
            <td className="px-6 py-4">
              <p className="font-bold text-slate-200 uppercase text-xs">{act.tarikh}</p>
            </td>
            <td className="px-6 py-4 space-y-1">
              <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-black"><Clock className="w-3 h-3 text-red-500" /> {act.masa}</div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-black"><MapPin className="w-3 h-3 text-red-500" /> {act.tempat}</div>
            </td>
            <td className="px-6 py-4">
               <p className="font-black text-slate-200 uppercase text-xs tracking-tight group-hover:text-red-500 transition-colors">{act.nama}</p>
               <p className="text-[10px] text-slate-500 line-clamp-1 italic mt-0.5">{act.ulasan || 'Tiada ulasan'}</p>
               <span className="text-[9px] font-black text-slate-600 mt-2 block uppercase tracking-widest">KEHADIRAN: {getAttendanceStats(act.tarikh)}</span>
            </td>
            <td className="px-6 py-4">
               {act.photos && act.photos.length > 0 ? (
                 <div className="flex -space-x-3">
                   {act.photos.map((p, i) => (
                     <div key={i} className="w-10 h-10 rounded-xl border-2 border-slate-900 overflow-hidden ring-2 ring-slate-800 shadow-lg transform hover:scale-110 hover:z-10 transition-transform bg-slate-800">
                        <img src={p} className="w-full h-full object-cover" alt="Thumb" />
                     </div>
                   ))}
                 </div>
               ) : (
                 <span className="text-[9px] text-slate-700 font-bold uppercase italic">Tiada Gambar</span>
               )}
            </td>
            <td className="px-6 py-4">
              <div className="flex gap-2">
                <button onClick={() => onPrint(act.id)} className="p-2.5 bg-slate-800/50 rounded-xl text-slate-500 hover:text-emerald-500 transition-all" title="Cetak Laporan">
                  <Printer className="w-5 h-5" />
                </button>
                {deletingId === act.id ? (
                  <InlineConfirm onConfirm={() => updateData({ activities: data.activities.filter(a => a.id !== act.id) })} onCancel={() => setDeletingId(null)} />
                ) : (
                  <button onClick={() => setDeletingId(act.id)} className="p-2.5 bg-slate-800/50 rounded-xl text-slate-500 hover:text-red-500 transition-all">
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
