
import React, { useState } from 'react';
import { UserPlus, ShieldAlert, Heart, Phone, Printer, Info, CheckCircle2, History } from 'lucide-react';
import { SystemData, Student, Jantina, Kaum, HealthStatus } from '../types';
import { FormCard, Input, Select, Button } from './CommonUI';
import { FORMS } from '../constants';

interface Props {
  data: SystemData;
  updateData: (newData: Partial<SystemData>) => void;
  onPrint: (id: string) => void;
}

const PendaftaranManager: React.FC<Props> = ({ data, updateData, onPrint }) => {
  const [formData, setFormData] = useState<Partial<Student>>({
    nama: '',
    noKP: '',
    tingkatan: '1',
    kelas: '',
    umur: '',
    tahap: '1',
    jantina: Jantina.Lelaki,
    kaum: Kaum.Melayu,
    kumpulanDarah: 'A+',
    alamat: '',
    namaWaris: '',
    noKPWaris: '',
    telefonWaris: '',
    alamatWaris: '',
    health: {
      asma: false,
      lelahTB: false,
      kencingManis: false,
      darahTinggi: false,
      penglihatan: false,
      pendengaran: false,
      kronikLain: false,
      kecacatan: ''
    }
  });

  const [activeStep, setActiveStep] = useState(1);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleRegister = () => {
    if (!formData.nama || !formData.noKP) {
        alert("Sila lengkapkan Nama dan No KP!");
        return;
    }

    const cleanKP = formData.noKP.replace(/[^0-9]/g, '');
    const isDuplicate = data.students.find(s => s.noKP === cleanKP);
    
    if (isDuplicate) {
        alert("Rekod sudah wujud dalam sistem!");
        return;
    }

    const newStudent: Student = {
      id: crypto.randomUUID(),
      nama: formData.nama.toUpperCase().trim(),
      noKP: cleanKP,
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
    setSuccessMessage(true);
    setTimeout(() => {
        setSuccessMessage(false);
        setFormData({
            nama: '', noKP: '', tingkatan: '1', kelas: '', umur: '', tahap: '1',
            jantina: Jantina.Lelaki, kaum: Kaum.Melayu, 
            kumpulanDarah: 'A+', alamat: '', namaWaris: '', 
            noKPWaris: '', telefonWaris: '', alamatWaris: '',
            health: {
              asma: false, lelahTB: false, kencingManis: false, 
              darahTinggi: false, penglihatan: false, pendengaran: false, 
              kronikLain: false, kecacatan: ''
            }
        });
        setActiveStep(1);
    }, 3000);
  };

  const toggleHealth = (key: keyof HealthStatus) => {
    setFormData({
      ...formData,
      health: {
        ...(formData.health as HealthStatus),
        [key]: !formData.health?.[key as keyof typeof formData.health]
      }
    });
  };

  const steps = [
    { id: 1, label: 'Lampiran A (Biodata)', icon: UserPlus },
    { id: 2, label: 'Lampiran A (Kesihatan)', icon: Heart },
    { id: 3, label: 'Lampiran B (Waris)', icon: Phone }
  ];

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-8 gap-6">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Pendaftaran Rekruit Baru</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Mengikut Format Surat JBPM 2026</p>
        </div>
        <div className="bg-red-600/10 border border-red-600/20 px-4 py-2 rounded-xl flex items-center gap-3">
           <Info className="w-4 h-4 text-red-500" />
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Surat JBPM Ruj: JPNP.SPMd.600-3/3/1</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-4 mb-8">
                {steps.map((step) => (
                    <button 
                        key={step.id}
                        onClick={() => setActiveStep(step.id)}
                        className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${activeStep === step.id ? 'bg-red-600 border-red-600 text-white shadow-lg' : 'bg-slate-900 border-white/[0.05] text-slate-500 hover:text-slate-300'}`}
                    >
                        <step.icon className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">{step.label}</span>
                    </button>
                ))}
            </div>

            {successMessage && (
                <div className="bg-emerald-600 text-white p-6 rounded-3xl flex items-center gap-4 animate-in zoom-in duration-300 shadow-2xl mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                    <div>
                        <p className="font-black uppercase text-sm tracking-widest">Data Berjaya Disimpan!</p>
                        <p className="text-[10px] font-bold opacity-80 uppercase">Lampiran A & B kini sedia untuk dicetak.</p>
                    </div>
                </div>
            )}

            <FormCard title={steps[activeStep-1].label}>
                {activeStep === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Nama Penuh Calon" value={formData.nama} onChange={(e: any) => setFormData({...formData, nama: e.target.value})} />
                        <Input label="No. Kad Pengenalan" placeholder="000000-00-0000" value={formData.noKP} onChange={(e: any) => setFormData({...formData, noKP: e.target.value})} />
                        <Input label="Umur" type="number" value={formData.umur} onChange={(e: any) => setFormData({...formData, umur: e.target.value})} />
                        <Select label="Tahap" value={formData.tahap} onChange={(e: any) => setFormData({...formData, tahap: e.target.value})} options={['1', '2', '3'].map(t => ({ value: t, label: `TAHAP ${t}` }))} />
                        <Select label="Tingkatan" value={formData.tingkatan} onChange={(e: any) => setFormData({...formData, tingkatan: e.target.value})} options={FORMS.map(f => ({ value: f, label: `TINGKATAN ${f}` }))} />
                        <Input label="Kelas" value={formData.kelas} onChange={(e: any) => setFormData({...formData, kelas: e.target.value})} />
                        <Select label="Jantina" value={formData.jantina} onChange={(e: any) => setFormData({...formData, jantina: e.target.value})} options={Object.values(Jantina).map(j => ({ value: j, label: j }))} />
                        <Select label="Kaum" value={formData.kaum} onChange={(e: any) => setFormData({...formData, kaum: e.target.value})} options={Object.values(Kaum).map(k => ({ value: k, label: k }))} />
                        <div className="md:col-span-2">
                            <Input label="Alamat Tetap (Lampiran A)" value={formData.alamat} onChange={(e: any) => setFormData({...formData, alamat: e.target.value})} />
                        </div>
                    </div>
                )}

                {activeStep === 2 && (
                    <div className="space-y-6">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Adakah anda mempunyai penyakit: (Tandakan Jika ADA)</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { key: 'asma', label: 'Asma' },
                                { key: 'lelahTB', label: 'Lelah / Batuk Kering / TB' },
                                { key: 'kencingManis', label: 'Kencing Manis' },
                                { key: 'darahTinggi', label: 'Darah Tinggi' },
                                { key: 'penglihatan', label: 'Masalah Penglihatan' },
                                { key: 'pendengaran', label: 'Masalah Pendengaran' },
                                { key: 'kronikLain', label: 'Penyakit Kronik Lain' }
                            ].map((item) => (
                                <button
                                    key={item.key}
                                    onClick={() => toggleHealth(item.key as keyof HealthStatus)}
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${formData.health?.[item.key as keyof HealthStatus] ? 'bg-red-600 border-red-600 text-white' : 'bg-slate-950 border-white/[0.05] text-slate-400'}`}
                                >
                                    <span className="text-xs font-bold uppercase">{item.label}</span>
                                    {formData.health?.[item.key as keyof HealthStatus] && <CheckCircle2 className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                        <Input 
                            label="Nyatakan Kecacatan / Lain-lain (Jika ada)" 
                            value={formData.health?.kecacatan} 
                            onChange={(e: any) => setFormData({
                                ...formData, 
                                health: { ...(formData.health as HealthStatus), kecacatan: e.target.value }
                            })} 
                        />
                    </div>
                )}

                {activeStep === 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Nama Ibu / Bapa / Penjaga" value={formData.namaWaris} onChange={(e: any) => setFormData({...formData, namaWaris: e.target.value})} />
                        <Input label="No. Kad Pengenalan Waris" placeholder="000000-00-0000" value={formData.noKPWaris} onChange={(e: any) => setFormData({...formData, noKPWaris: e.target.value})} />
                        <Input label="No. Telefon Waris" value={formData.telefonWaris} onChange={(e: any) => setFormData({...formData, telefonWaris: e.target.value})} />
                        <div className="md:col-span-2">
                             <Input label="Alamat Waris (Jika berbeza)" value={formData.alamatWaris} onChange={(e: any) => setFormData({...formData, alamatWaris: e.target.value})} />
                        </div>
                        <div className="md:col-span-2 pt-6 flex gap-4">
                            <Button variant="secondary" onClick={() => setActiveStep(2)} className="flex-1 h-14 uppercase">Kembali</Button>
                            <Button onClick={handleRegister} className="flex-1 h-14 uppercase tracking-widest">Sahkan & Simpan</Button>
                        </div>
                    </div>
                )}

                {activeStep < 3 && (
                    <div className="flex justify-end mt-10">
                        <Button onClick={() => setActiveStep(prev => prev + 1)} className="px-12 h-14 uppercase">Seterusnya</Button>
                    </div>
                )}
            </FormCard>
        </div>

        <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 border border-white/[0.05] rounded-[2.5rem] p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                    <History className="w-5 h-5 text-red-500" />
                    <h3 className="font-black text-xs text-white uppercase tracking-widest">Pendaftaran Terkini</h3>
                </div>
                <div className="space-y-4">
                    {data.students.slice(-5).reverse().map(student => (
                        <div key={student.id} className="p-4 bg-slate-950 border border-white/[0.03] rounded-2xl flex items-center justify-between group">
                            <div>
                                <p className="text-[11px] font-black text-white uppercase truncate max-w-[150px]">{student.nama}</p>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">KP: {student.noKP}</p>
                            </div>
                            <button 
                                onClick={() => onPrint(student.id)}
                                className="p-2 bg-red-600/10 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                                title="Cetak Lampiran A & B"
                            >
                                <Printer className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PendaftaranManager;
