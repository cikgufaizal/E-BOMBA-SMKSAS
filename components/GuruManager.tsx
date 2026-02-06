import React, { useState } from 'react';
import { Plus, Trash2, Upload, Edit2, X } from 'lucide-react';
import { SystemData, Teacher, JawatanGuru } from '../types';
import { FormCard, Input, Select, Button, Table, InlineConfirm } from './CommonUI';
import CsvImportModal from './common/CsvImportModal';

interface Props {
  data: SystemData;
  updateData: (newData: Partial<SystemData>) => void;
}

const GuruManager: React.FC<Props> = ({ data, updateData }) => {
  const [formData, setFormData] = useState<Partial<Teacher>>({
    nama: '', noKP: '', jawatan: JawatanGuru.GuruPelaksana, telefon: ''
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);

  const saveGuru = () => {
    if (!formData.nama || !formData.telefon) return;
    const cleanKP = formData.noKP?.replace(/[^0-9]/g, '') || '';

    if (editingId) {
      const updatedTeachers = data.teachers.map(t => 
        t.id === editingId ? { ...t, ...formData, noKP: cleanKP } as Teacher : t
      );
      updateData({ teachers: updatedTeachers });
      setEditingId(null);
    } else {
      const newGuru: Teacher = {
        id: crypto.randomUUID(),
        nama: formData.nama.toUpperCase().trim(),
        noKP: cleanKP,
        jawatan: formData.jawatan as JawatanGuru,
        telefon: formData.telefon
      };
      updateData({ teachers: [...data.teachers, newGuru] });
    }
    setFormData({ nama: '', noKP: '', jawatan: JawatanGuru.GuruPelaksana, telefon: '' });
  };

  const startEdit = (guru: Teacher) => {
    setEditingId(guru.id);
    setFormData({ nama: guru.nama, noKP: guru.noKP, jawatan: guru.jawatan, telefon: guru.telefon });
    setShowImport(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImport = (rows: string[][]) => {
    const imported: Teacher[] = rows.map(row => ({
      id: crypto.randomUUID(),
      nama: (row[0] || 'N/A').toUpperCase().trim(),
      noKP: (row[1] || '').replace(/[^0-9]/g, ''),
      jawatan: (row[2] as JawatanGuru) || JawatanGuru.GuruPelaksana,
      telefon: row[3] || '-'
    }));
    updateData({ teachers: [...data.teachers, ...imported] });
    setShowImport(false);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-200 uppercase tracking-tighter">Urus Guru Pembimbing</h2>
        {!editingId && (
          <Button variant="secondary" onClick={() => setShowImport(true)}>
            <Upload className="w-4 h-4" /> Import CSV
          </Button>
        )}
      </div>

      <CsvImportModal 
        isOpen={showImport} 
        onClose={() => setShowImport(false)} 
        onImport={handleImport}
        title="Import Data Guru"
        notes={<p className="text-[10px] text-slate-400 uppercase">Format: Nama, No KP, Jawatan, No Telefon</p>}
      />

      {editingId || !showImport ? (
        <FormCard title={editingId ? "Kemaskini Maklumat Guru" : "Tambah Guru Baru"}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="md:col-span-2">
                <Input label="Nama Penuh" placeholder="Cth: Ahmad bin Bakri" value={formData.nama} onChange={(e: any) => setFormData({...formData, nama: e.target.value})} />
            </div>
            <Input label="No. Kad Pengenalan" placeholder="80010114xxxx" value={formData.noKP} onChange={(e: any) => setFormData({...formData, noKP: e.target.value})} />
            <Select label="Jawatan" value={formData.jawatan} onChange={(e: any) => setFormData({...formData, jawatan: e.target.value})} options={Object.values(JawatanGuru).map(j => ({ value: j, label: j }))} />
            <div className="md:col-span-2">
                <Input label="No. Telefon" placeholder="Cth: 0192837465" value={formData.telefon} onChange={(e: any) => setFormData({...formData, telefon: e.target.value})} />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <Button onClick={saveGuru} className="w-full h-14">
                {editingId ? <><Edit2 className="w-4 h-4" /> Simpan Perubahan</> : <><Plus className="w-4 h-4" /> Tambah Guru</>}
              </Button>
              {editingId && (
                <Button variant="secondary" onClick={() => { setEditingId(null); setFormData({ nama: '', noKP: '', jawatan: JawatanGuru.GuruPelaksana, telefon: '' }); }} className="h-14">
                  <X className="w-4 h-4" /> Batal
                </Button>
              )}
            </div>
          </div>
        </FormCard>
      ) : null}

      <Table
        headers={['Bil', 'Nama Guru', 'No. KP', 'Jawatan', 'Tindakan']}
        data={data.teachers}
        renderRow={(guru: Teacher, idx: number) => (
          <tr key={guru.id} className="hover:bg-slate-900/50 transition-colors">
            <td className="px-6 py-4 text-sm font-medium text-slate-500">{idx + 1}</td>
            <td className="px-6 py-4 text-sm text-slate-200 font-bold uppercase">{guru.nama}</td>
            <td className="px-6 py-4 text-sm text-slate-400 font-mono">{guru.noKP || '-'}</td>
            <td className="px-6 py-4">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                guru.jawatan === JawatanGuru.Penasihat ? 'bg-red-900/30 text-red-500 border border-red-800/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {guru.jawatan}
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <button onClick={() => startEdit(guru)} className="p-2 text-slate-500 hover:text-emerald-500 transition-colors">
                  <Edit2 className="w-5 h-5" />
                </button>
                {deletingId === guru.id ? (
                  <InlineConfirm onConfirm={() => { updateData({ teachers: data.teachers.filter(t => t.id !== guru.id) }); setDeletingId(null); }} onCancel={() => setDeletingId(null)} />
                ) : (
                  <button onClick={() => setDeletingId(guru.id)} className="p-2 text-slate-500 hover:text-red-500 transition-colors">
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

export default GuruManager;