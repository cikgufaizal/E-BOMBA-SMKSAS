
import React, { useState } from 'react';
import { UserPlus, ShieldAlert, Heart, Phone, Printer, Info, CheckCircle2, History, FileStack, FileText, Users, FileCheck } from 'lucide-react';
import { SystemData, Student, Jantina, Kaum, HealthStatus } from '../types';
import { FormCard, Input, Select, Button } from './CommonUI';
import { FORMS } from '../constants';

interface Props {
  data: SystemData;
  updateData: (newData: Partial<SystemData>) => void;
  onPrint: (id: string, type?: any) => void;
}

const PendaftaranManager: React.FC<Props> = ({ data, updateData, onPrint }) => {
  const [formData, setFormData] = useState<Partial<Student>>({
    nama: '',
    noKP: '',
    noKeahlian: '',
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
      noKeahlian: formData.noKeahlian?.toUpperCase().trim() || '-',
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
            nama: '', noKP: '', noKeahlian: '', tingkatan: '1', kelas: '', umur: '', tahap: '1',
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

  const officialDocs = [
    { id: 'LAMPIRAN_D', label: 'Lampiran D', desc: 'Permohonan Pendaftaran Pasukan', icon: FileCheck },
    { id: 'LAMPIRAN_E', label: 'Lampiran E', desc: 'Senarai Guru Penasihat', icon: Users },
    { id: 'LAMPIRAN_F', label: 'Lampiran F', desc: 'Senarai Ahli Kolektif', icon: FileStack },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Hub Dokumentasi & Pendaftaran</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Sistem Pengurusan Lampiran Rasmi JBPM (A, B, D, E, F)</p>
        </div>
        <div className="bg-red-600/10 border border-red-600/20 px-6 py-3 rounded-2xl flex items-center gap-4">
           <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
           <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Format Terkini JBPM 2026</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* KIRI: BORANG PENDAFTARAN */}
        <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-4 mb-8">
                {steps.map((step) => (
                    <button 
                        key={step.id}
                        onClick={() => setActiveStep(step.id)}
                        className={`flex-1 flex flex-col md:flex-row items-center justify-center gap-3 p-5 rounded-3xl border transition-all duration-500 ${activeStep === step.id ? 'bg-red-600 border-red-600 text-white shadow-[0_15px_30px_rgba(239,68,68,0.25)] scale-[1.02]' : 'bg-slate-900/50 border-white/[0.05] text-slate-500 hover:text-slate-300 hover:bg-slate-900'}`}
                    >
                        <step.icon className={`w-5 h-5 ${activeStep === step.id ? 'animate-bounce' : ''}`} />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] hidden md:block">{step.label}</span>
                    </button>
                ))}
            </div>

            {successMessage && (
                <div className="bg-emerald-600 text-white p-6 rounded-[2.5rem] flex items-center gap-6 animate-in zoom-in duration-300 shadow-2xl mb-8">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-black uppercase text-sm tracking-widest">Ahli Berjaya Didaftarkan!</p>
                        <p className="text-[10px] font-bold opacity-80 uppercase tracking-tight">Maklumat kini sedia untuk dijana ke dalam Lampiran A, B dan F.</p>
                    </div>
                </div>
            )}

            <FormCard title={steps[activeStep-1].label}>
                {activeStep === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Input label="Nama Penuh Calon" value={formData.nama} onChange={(e: any) => setFormData({...formData, nama: e.target.value})} />
                        <Input label="No. Kad Pengenalan" placeholder="000000-00-0000" value={formData.noKP} onChange={(e: any) => setFormData({...formData, noKP: e.target.value})} />
                        <Input label="No. Keahlian (Untuk Lampiran F)" placeholder="Cth: KB-001/2026" value={formData.noKeahlian} onChange={(e: any) => setFormData({...formData, noKeahlian: e.target.value})} />
                        <Input label="Umur" type="number" value={formData.umur} onChange={(e: any) => setFormData({...formData, umur: e.target.value})} />
                        <Select label="Tahap Pendaftaran" value={formData.tahap} onChange={(e: any) => setFormData({...formData, tahap: e.target.value})} options={['1', '2', '3'].map(t => ({ value: t, label: `TAHAP ${t}` }))} />
                        <Select label="Tingkatan" value={formData.tingkatan} onChange={(e: any) => setFormData({...formData, tingkatan: e.target.value})} options={FORMS.map(f => ({ value: f, label: `TINGKATAN ${f}` }))} />
                        <Input label="Kelas" value={formData.kelas} onChange={(e: any) => setFormData({...formData, kelas: e.target.value})} />
                        <Select label="Jantina" value={formData.jantina} onChange={(e: any) => setFormData({...formData, jantina: e.target.value})} options={Object.values(Jantina).map(j => ({ value: j, label: j }))} />
                        <div className="md:col-span-2">
                            <Input label="Alamat Tetap Kediaman" value={formData.alamat} onChange={(e: any) => setFormData({...formData, alamat: e.target.value})} />
                        </div>
                    </div>
                )}

                {activeStep === 2 && (
                    <div className="space-y-8">
                        <div className="flex items-center gap-3 p-4 bg-red-600/10 border border-red-600/20 rounded-2xl">
                             <ShieldAlert className="w-5 h-5 text-red-500" />
                             <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">PENGAKUAN KESIHATAN (LAMPIRAN A)</p>
                        </div>
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
                                    className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${formData.health?.[item.key as keyof HealthStatus] ? 'bg-red-600 border-red-600 text-white shadow-lg' : 'bg-slate-950/40 border-white/[0.05] text-slate-400 hover:border-red-600/30'}`}
                                >
                                    <span className="text-xs font-bold uppercase">{item.label}</span>
                                    {formData.health?.[item.key as keyof HealthStatus] && <CheckCircle2 className="w-5 h-5" />}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Input label="Nama Ibu / Bapa / Penjaga" value={formData.namaWaris} onChange={(e: any) => setFormData({...formData, namaWaris: e.target.value})} />
                        <Input label="No. Kad Pengenalan Waris" placeholder="000000-00-0000" value={formData.noKPWaris} onChange={(e: any) => setFormData({...formData, noKPWaris: e.target.value})} />
                        <Input label="No. Telefon Waris" value={formData.telefonWaris} onChange={(e: any) => setFormData({...formData, telefonWaris: e.target.value})} />
                        <div className="md:col-span-2">
                             <Input label="Alamat Waris (Jika berbeza)" value={formData.alamatWaris} onChange={(e: any) => setFormData({...formData, alamatWaris: e.target.value})} />
                        </div>
                        <div className="md:col-span-2 pt-8 flex gap-6">
                            <Button variant="secondary" onClick={() => setActiveStep(2)} className="flex-1 h-16 uppercase tracking-widest">Kembali</Button>
                            <Button onClick={handleRegister} className="flex-1 h-16 uppercase tracking-widest shadow-2xl">Simpan & Selesai</Button>
                        </div>
                    </div>
                )}

                {activeStep < 3 && (
                    <div className="flex justify-end mt-12">
                        <Button onClick={() => setActiveStep(prev => prev + 1)} className="px-16 h-16 uppercase tracking-widest">Seterusnya</Button>
                    </div>
                )}
            </FormCard>
        </div>

        {/* KANAN: DOKUMENTASI UNIT */}
        <div className="lg:col-span-4 space-y-8">
            {/* ZON DOKUMEN PASUKAN (D, E, F) */}
            <div className="bg-slate-900 border border-white/[0.05] rounded-[2.5rem] p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                    <FileText className="w-5 h-5 text-red-600" />
                    <h3 className="font-black text-xs text-white uppercase tracking-widest">Dokumen Pasukan</h3>
                </div>
                <div className="space-y-4">
                    {officialDocs.map(doc => (
                        <button 
                            key={doc.id}
                            onClick={() => onPrint('', doc.id)}
                            className="w-full p-5 bg-slate-950 border border-white/[0.03] rounded-2xl flex items-center gap-4 group hover:border-red-600/50 hover:bg-red-600/5 transition-all text-left"
                        >
                            <div className="w-10 h-10 bg-red-600/10 text-red-500 rounded-xl flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
                                <doc.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-white uppercase tracking-wider">{doc.label}</p>
                                <p className="text-[9px] text-slate-500 font-bold uppercase">{doc.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* ZON DOKUMEN INDIVIDU (A, B) */}
            <div className="bg-slate-900 border border-white/[0.05] rounded-[2.5rem] p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <History className="w-5 h-5 text-red-600" />
                        <h3 className="font-black text-xs text-white uppercase tracking-widest">Ahli Baru</h3>
                    </div>
                    <span className="text-[9px] font-black text-slate-500 uppercase">Terkini</span>
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    {data.students.length === 0 && (
                        <div className="text-center py-10 opacity-30">
                            <Users className="w-8 h-8 mx-auto mb-3" />
                            <p className="text-[9px] font-bold uppercase tracking-widest">Tiada Pendaftaran</p>
                        </div>
                    )}
                    {data.students.slice(-5).reverse().map(student => (
                        <div key={student.id} className="p-4 bg-slate-950 border border-white/[0.03] rounded-2xl flex items-center justify-between group animate-in slide-in-from-right duration-500">
                            <div className="min-w-0 pr-4">
                                <p className="text-[10px] font-black text-white uppercase truncate">{student.nama}</p>
                                <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">KP: {student.noKP}</p>
                            </div>
                            <button 
                                onClick={() => onPrint(student.id, 'PENDAFTARAN')}
                                className="p-2.5 bg-red-600/10 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-lg"
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
