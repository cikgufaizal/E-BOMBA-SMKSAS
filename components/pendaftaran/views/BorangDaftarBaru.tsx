import React, { useState } from 'react';
import { SystemData, Student, Jantina, Kaum, HealthStatus } from '../../../types';
import { FormCard, Input, Select, Button } from '../../CommonUI';
import { FORMS } from '../../../constants';

interface Props {
  data: SystemData;
  updateData: (newData: Partial<SystemData>) => void;
  onSuccess: () => void;
}

const BorangDaftarBaru: React.FC<Props> = ({ data, updateData, onSuccess }) => {
  const [formData, setFormData] = useState<Partial<Student>>({
    nama: '', noKP: '', noKeahlian: '', tingkatan: '1', kelas: '', umur: '', tahap: '1',
    jantina: Jantina.Lelaki, kaum: Kaum.Melayu, kumpulanDarah: 'A+', alamat: '',
    namaWaris: '', noKPWaris: '', telefonWaris: '', alamatWaris: '',
    health: {
      asma: false, lelahTB: false, kencingManis: false, darahTinggi: false,
      penglihatan: false, pendengaran: false, kronikLain: false, kecacatan: ''
    }
  });

  const handleRegister = () => {
    if (!formData.nama || !formData.noKP) {
        alert("Sila lengkapkan Nama dan No KP!");
        return;
    }

    const cleanKP = formData.noKP.replace(/[^0-9]/g, '');
    const newStudent: Student = {
      id: crypto.randomUUID(),
      nama: formData.nama.toUpperCase().trim(),
      noKP: cleanKP,
      noKeahlian: formData.noKeahlian?.toUpperCase().trim() || '',
      tingkatan: formData.tingkatan!,
      kelas: formData.kelas?.toUpperCase().trim() || '-',
      jantina: formData.jantina as Jantina,
      kaum: formData.kaum as Kaum,
      umur: formData.umur,
      tahap: formData.tahap,
      kumpulanDarah: formData.kumpulanDarah,
      alamat: formData.alamat?.toUpperCase(),
      namaWaris: formData.namaWaris?.toUpperCase(),
      noKPWaris: formData.noKPWaris?.replace(/[^0-9]/g, ''),
      telefonWaris: formData.telefonWaris,
      alamatWaris: formData.alamatWaris?.toUpperCase() || formData.alamat?.toUpperCase(),
      health: formData.health as HealthStatus
    };

    updateData({ students: [...data.students, newStudent] });
    onSuccess();
  };

  return (
    <div className="max-w-4xl mx-auto animate-slide-up">
      <FormCard title="Pendaftaran Ahli Baru (Lampiran A & F)">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Nama Penuh" value={formData.nama} onChange={(e: any) => setFormData({...formData, nama: e.target.value})} />
            <Input label="No. KP" placeholder="000000-00-0000" value={formData.noKP} onChange={(e: any) => setFormData({...formData, noKP: e.target.value})} />
            <Input label="No. Keahlian (Jika Sudah Ada)" placeholder="Contoh: KB-001/2026" value={formData.noKeahlian} onChange={(e: any) => setFormData({...formData, noKeahlian: e.target.value})} />
            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input label="Umur" type="number" value={formData.umur} onChange={(e: any) => setFormData({...formData, umur: e.target.value})} />
              <Select label="Tingkatan" value={formData.tingkatan} onChange={(e: any) => setFormData({...formData, tingkatan: e.target.value})} options={FORMS.map(f => ({ value: f, label: `TINGKATAN ${f}` }))} />
              <Input label="Kelas" value={formData.kelas} onChange={(e: any) => setFormData({...formData, kelas: e.target.value})} />
              <Select label="Tahap" value={formData.tahap} onChange={(e: any) => setFormData({...formData, tahap: e.target.value})} options={['1','2','3'].map(t => ({ value: t, label: `TAHAP ${t}` }))} />
            </div>
            <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-800/50">
               <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Maklumat Penjaga / Waris</p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input label="Nama Waris" value={formData.namaWaris} onChange={(e: any) => setFormData({...formData, namaWaris: e.target.value})} />
                 <Input label="No. KP Waris" value={formData.noKPWaris} onChange={(e: any) => setFormData({...formData, noKPWaris: e.target.value})} />
                 <Input label="No. Telefon Waris" value={formData.telefonWaris} onChange={(e: any) => setFormData({...formData, telefonWaris: e.target.value})} />
               </div>
            </div>
            <div className="md:col-span-2 pt-6">
               <Button onClick={handleRegister} className="w-full h-16 text-xs shadow-2xl">Daftar & Masuk Senarai Lampiran</Button>
            </div>
         </div>
      </FormCard>
    </div>
  );
};

export default BorangDaftarBaru;