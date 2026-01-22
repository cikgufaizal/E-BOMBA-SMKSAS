
import React, { useState } from 'react';
import { Plus, Trash2, Upload, Printer } from 'lucide-react';
import { SystemData, Student, Jantina, Kaum } from '../types';
import { FormCard, Input, Select, Button, Table, InlineConfirm } from './CommonUI';
import { handleFileUpload, parseCSV } from '../utils/csvParser';
import { FORMS } from '../constants';

interface Props {
  data: SystemData;
  updateData: (newData: Partial<SystemData>) => void;
  onPrint: () => void;
}

const AhliManager: React.FC<Props> = ({ data, updateData, onPrint }) => {
  const [formData, setFormData] = useState<Partial<Student>>({
    nama: '', noKP: '', tingkatan: '1', kelas: '', jantina: Jantina.Lelaki, kaum: Kaum.Melayu
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [csvText, setCsvText] = useState('');

  const addAhli = () => {
    if (!formData.nama || !formData.noKP) return;
    const newAhli: Student = {
      id: crypto.randomUUID(),
      nama: formData.nama,
      noKP: formData.noKP,
      tingkatan: formData.tingkatan!,
      kelas: formData.kelas || '-',
      jantina: formData.jantina as Jantina,
      kaum: formData.kaum as Kaum
    };
    updateData({ students: [...data.students, newAhli] });
    setFormData({ nama: '', noKP: '', tingkatan: '1', kelas: '', jantina: Jantina.Lelaki, kaum: Kaum.Melayu });
  };

  const handleImport = (rows: string[][]) => {
    const imported: Student[] = rows.map(row => ({
      id: crypto.randomUUID(),
      nama: row[0] || 'N/A',
      noKP: row[1] || '-',
      tingkatan: row[2] || '1',
      kelas: row[3] || '-',
      jantina: (row[4]?.toUpperCase() === 'PEREMPUAN' ? Jantina.Perempuan : Jantina.Lelaki),
      kaum: (row[5] as Kaum) || Kaum.Melayu
    }));
    updateData({ students: [...data.students, ...imported] });
    setShowImport(false);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-800">Urus Ahli Kelab</h2>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowImport(!showImport)}>
            <Upload className="w-4 h-4" />
            Import CSV
          </Button>
          <Button onClick={onPrint} variant="success">
            <Printer className="w-4 h-4" />
            Cetak Senarai
          </Button>
        </div>
      </div>

      {showImport && (
        <FormCard title="Import Data Ahli">
          <div className="space-y-4">
            <p className="text-xs text-slate-500">Format CSV: Nama, No KP, Tingkatan, Kelas, Jantina, Kaum</p>
            <textarea
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              placeholder="Ali bin Abu, 080101-14-1234, 4, Murni, LELAKI, MELAYU"
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
            />
            <div className="flex gap-4">
              <Button onClick={() => handleImport(parseCSV(csvText))} className="flex-1">Import Paste</Button>
              <div className="flex-1">
                <input type="file" accept=".csv" className="hidden" id="csv-student" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], handleImport)} />
                <Button variant="secondary" className="w-full" onClick={() => document.getElementById('csv-student')?.click()}>Upload File</Button>
              </div>
            </div>
          </div>
        </FormCard>
      )}

      {!showImport && (
        <FormCard title="Tambah Ahli Baru">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input label="Nama Ahli" value={formData.nama} onChange={(e: any) => setFormData({...formData, nama: e.target.value})} />
            <Input label="No. Kad Pengenalan" placeholder="000000-00-0000" value={formData.noKP} onChange={(e: any) => setFormData({...formData, noKP: e.target.value})} />
            <Select label="Tingkatan" value={formData.tingkatan} onChange={(e: any) => setFormData({...formData, tingkatan: e.target.value})} options={FORMS.map(f => ({ value: f, label: f }))} />
            <Input label="Kelas" value={formData.kelas} onChange={(e: any) => setFormData({...formData, kelas: e.target.value})} />
            <Select label="Jantina" value={formData.jantina} onChange={(e: any) => setFormData({...formData, jantina: e.target.value})} options={Object.values(Jantina).map(j => ({ value: j, label: j }))} />
            <Select label="Kaum" value={formData.kaum} onChange={(e: any) => setFormData({...formData, kaum: e.target.value})} options={Object.values(Kaum).map(k => ({ value: k, label: k }))} />
            <div className="md:col-span-3">
              <Button onClick={addAhli} className="w-full"><Plus className="w-4 h-4" /> Tambah Ahli</Button>
            </div>
          </div>
        </FormCard>
      )}

      <Table
        headers={['Bil', 'Nama', 'No. KP', 'Ting.', 'Kelas', 'Jantina', 'Kaum', 'Tindakan']}
        data={data.students}
        renderRow={(student: Student, idx: number) => (
          <tr key={student.id} className="hover:bg-slate-50">
            <td className="px-6 py-4 text-xs font-bold text-slate-400">{idx + 1}</td>
            <td className="px-6 py-4 text-sm font-bold text-slate-800">{student.nama}</td>
            <td className="px-6 py-4 text-sm text-slate-500">{student.noKP}</td>
            <td className="px-6 py-4 text-sm font-bold text-blue-600">{student.tingkatan}</td>
            <td className="px-6 py-4 text-sm text-slate-600">{student.kelas}</td>
            <td className="px-6 py-4 text-xs font-semibold">{student.jantina}</td>
            <td className="px-6 py-4 text-xs font-semibold">{student.kaum}</td>
            <td className="px-6 py-4">
              {deletingId === student.id ? (
                <InlineConfirm onConfirm={() => updateData({ students: data.students.filter(s => s.id !== student.id) })} onCancel={() => setDeletingId(null)} />
              ) : (
                <button onClick={() => setDeletingId(student.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
              )}
            </td>
          </tr>
        )}
      />
    </div>
  );
};

export default AhliManager;
