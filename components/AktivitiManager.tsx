import React, { useState } from 'react';
import { Plus, Trash2, Printer, MapPin, Clock } from 'lucide-react';
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
    ulasan: ''
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const addAktiviti = () => {
    if (!formData.nama || !formData.tarikh) return;
    const newAct: Activity = {
      id: crypto.randomUUID(),
      tarikh: formData.tarikh!,
      masa: formData.masa || '',
      nama: formData.nama,
      tempat: formData.tempat || '',
      ulasan: formData.ulasan || ''
    };
    updateData({ activities: [...data.activities, newAct] });
    setFormData({ ...formData, nama: '', ulasan: '' });
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
        headers={['Tarikh', 'Masa/Tempat', 'Aktiviti', 'Kehadiran', 'Tindakan']}
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
            </td>
            <td className="px-6 py-4">
               <span className="text-sm font-black text-slate-400">{getAttendanceStats(act.tarikh)}</span>
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