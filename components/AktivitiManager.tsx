
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
      <h2 className="text-lg font-bold text-slate-800 mb-6">Laporan Aktiviti & Projek</h2>

      <FormCard title="Tambah Rekod Aktiviti">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input type="date" label="Tarikh Aktiviti" value={formData.tarikh} onChange={(e: any) => setFormData({...formData, tarikh: e.target.value})} />
          <Input type="time" label="Masa" value={formData.masa} onChange={(e: any) => setFormData({...formData, masa: e.target.value})} />
          <Input label="Nama Aktiviti" placeholder="Cth: Latihan Pertandingan" value={formData.nama} onChange={(e: any) => setFormData({...formData, nama: e.target.value})} />
          <Input label="Tempat" value={formData.tempat} onChange={(e: any) => setFormData({...formData, tempat: e.target.value})} />
          <div className="md:col-span-2 space-y-1.5">
             <label className="text-sm font-semibold text-slate-700">Ulasan / Catatan</label>
             <textarea 
               className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-24"
               value={formData.ulasan}
               onChange={(e) => setFormData({...formData, ulasan: e.target.value})}
             />
          </div>
          <div className="md:col-span-2">
            <Button onClick={addAktiviti} className="w-full"><Plus className="w-4 h-4" /> Simpan Rekod</Button>
          </div>
        </div>
      </FormCard>

      <Table
        headers={['Tarikh', 'Masa/Tempat', 'Aktiviti', 'Kehadiran', 'Tindakan']}
        data={data.activities.sort((a,b) => b.tarikh.localeCompare(a.tarikh))}
        renderRow={(act: Activity) => (
          <tr key={act.id} className="hover:bg-slate-50">
            <td className="px-6 py-4">
              <p className="font-bold text-slate-800">{act.tarikh}</p>
            </td>
            <td className="px-6 py-4 space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-500"><Clock className="w-3 h-3" /> {act.masa}</div>
              <div className="flex items-center gap-2 text-xs text-slate-500"><MapPin className="w-3 h-3" /> {act.tempat}</div>
            </td>
            <td className="px-6 py-4">
               <p className="font-bold text-blue-600">{act.nama}</p>
               <p className="text-xs text-slate-500 line-clamp-1 italic">{act.ulasan}</p>
            </td>
            <td className="px-6 py-4">
               <span className="text-sm font-semibold text-slate-600">{getAttendanceStats(act.tarikh)}</span>
            </td>
            <td className="px-6 py-4">
              <div className="flex gap-2">
                <button onClick={() => onPrint(act.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Cetak Laporan">
                  <Printer className="w-5 h-5" />
                </button>
                {deletingId === act.id ? (
                  <InlineConfirm onConfirm={() => updateData({ activities: data.activities.filter(a => a.id !== act.id) })} onCancel={() => setDeletingId(null)} />
                ) : (
                  <button onClick={() => setDeletingId(act.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
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
