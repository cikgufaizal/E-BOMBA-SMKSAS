import React, { useState } from 'react';
import { Plus, Trash2, Upload, Edit2, X } from 'lucide-react';
import { SystemData, Teacher, JawatanGuru } from '../types';
import { FormCard, Input, Select, Button, Table, InlineConfirm } from './CommonUI';
import { handleFileUpload, parseCSV } from '../utils/csvParser';

interface Props {
  data: SystemData;
  updateData: (newData: Partial<SystemData>) => void;
}

const GuruManager: React.FC<Props> = ({ data, updateData }) => {
  const [formData, setFormData] = useState<Partial<Teacher>>({
    nama: '',
    jawatan: JawatanGuru.GuruPelaksana,
    telefon: ''
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [csvText, setCsvText] = useState('');
  const [showImport, setShowImport] = useState(false);

  const saveGuru = () => {
    if (!formData.nama || !formData.telefon) return;
    
    if (editingId) {
      const updatedTeachers = data.teachers.map(t => 
        t.id === editingId ? { ...t, ...formData } as Teacher : t
      );
      updateData({ teachers: updatedTeachers });
      setEditingId(null);
    } else {
      const newGuru: Teacher = {
        id: crypto.randomUUID(),
        nama: formData.nama,
        jawatan: formData.jawatan as JawatanGuru,
        telefon: formData.telefon
      };
      updateData({ teachers: [...data.teachers, newGuru] });
    }
    
    setFormData({ nama: '', jawatan: JawatanGuru.GuruPelaksana, telefon: '' });
  };

  const startEdit = (guru: Teacher) => {
    setEditingId(guru.id);
    setFormData({ nama: guru.nama, jawatan: guru.jawatan, telefon: guru.telefon });
    setShowImport(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ nama: '', jawatan: JawatanGuru.GuruPelaksana, telefon: '' });
  };

  const handleImport = (rows: string[][]) => {
    const imported: Teacher[] = rows.map(row => ({
      id: crypto.randomUUID(),
      nama: row[0] || 'N/A',
      jawatan: (row[1] as JawatanGuru) || JawatanGuru.GuruPelaksana,
      telefon: row[2] || '-'
    }));
    updateData({ teachers: [...data.teachers, ...imported] });
    setShowImport(false);
    setCsvText('');
  };

  const deleteGuru = (id: string) => {
    updateData({ teachers: data.teachers.filter(t => t.id !== id) });
    setDeletingId(null);
    if (editingId === id) cancelEdit();
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-200 uppercase tracking-tighter">Urus Guru Pembimbing</h2>
        {!editingId && (
          <Button variant="secondary" onClick={() => setShowImport(!showImport)}>
            <Upload className="w-4 h-4" />
            {showImport ? 'Tutup Import' : 'Import CSV'}
          </Button>
        )}
      </div>

      {showImport && !editingId && (
        <FormCard title="Import Data Guru">
          <div className="space-y-4">
            <p className="text-xs text-slate-500">Format CSV: Nama, Jawatan, No Telefon</p>
            <textarea
              className="w-full h-32 p-4 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-red-600 outline-none text-slate-200"
              placeholder="Ali bin Abu, Penasihat, 0123456789"
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
            />
            <div className="flex gap-4">
              <Button onClick={() => handleImport(parseCSV(csvText))} className="flex-1">Import dari Paste</Button>
              <div className="flex-1">
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  id="csv-upload"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], handleImport)}
                />
                <Button variant="secondary" className="w-full" onClick={() => document.getElementById('csv-upload')?.click()}>
                  Upload Fail CSV
                </Button>
              </div>
            </div>
          </div>
        </FormCard>
      )}

      {(!showImport || editingId) && (
        <FormCard title={editingId ? "Kemaskini Maklumat Guru" : "Tambah Guru Baru"}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <Input 
              label="Nama Penuh" 
              placeholder="Cth: Ahmad bin Bakri" 
              value={formData.nama} 
              onChange={(e: any) => setFormData({...formData, nama: e.target.value})} 
            />
            <Select 
              label="Jawatan" 
              value={formData.jawatan} 
              onChange={(e: any) => setFormData({...formData, jawatan: e.target.value})}
              options={Object.values(JawatanGuru).map(j => ({ value: j, label: j }))} 
            />
            <Input 
              label="No. Telefon" 
              placeholder="Cth: 0192837465" 
              value={formData.telefon} 
              onChange={(e: any) => setFormData({...formData, telefon: e.target.value})} 
            />
            <div className="md:col-span-3 flex gap-3">
              <Button onClick={saveGuru} className="flex-1">
                {editingId ? <><Edit2 className="w-4 h-4" /> Simpan Perubahan</> : <><Plus className="w-4 h-4" /> Tambah Guru</>}
              </Button>
              {editingId && (
                <Button variant="secondary" onClick={cancelEdit}>
                  <X className="w-4 h-4" /> Batal
                </Button>
              )}
            </div>
          </div>
        </FormCard>
      )}

      <Table
        headers={['Bil', 'Nama Guru', 'Jawatan', 'No. Telefon', 'Tindakan']}
        data={data.teachers}
        renderRow={(guru: Teacher, idx: number) => (
          <tr key={guru.id} className="hover:bg-slate-900/50 transition-colors">
            <td className="px-6 py-4 text-sm font-medium text-slate-500">{idx + 1}</td>
            <td className="px-6 py-4 text-sm text-slate-200 font-bold uppercase">{guru.nama}</td>
            <td className="px-6 py-4">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                guru.jawatan === JawatanGuru.Penasihat ? 'bg-red-900/30 text-red-500 border border-red-800/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {guru.jawatan}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-slate-400">{guru.telefon}</td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <button onClick={() => startEdit(guru)} className="p-2 text-slate-500 hover:text-emerald-500 transition-colors">
                  <Edit2 className="w-5 h-5" />
                </button>
                {deletingId === guru.id ? (
                  <InlineConfirm onConfirm={() => deleteGuru(guru.id)} onCancel={() => setDeletingId(null)} />
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