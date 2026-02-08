import React, { useState, useEffect } from 'react';
import { X, Save, User, Heart, Phone, ShieldCheck } from 'lucide-react';
import { Student, Jantina, Kaum, HealthStatus } from '../../types';
import { Input, Select, Button } from '../CommonUI';
import { FORMS } from '../../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Partial<Student>) => void;
  initialData?: Partial<Student> | null;
  mode: 'ADD' | 'EDIT';
}

const MemberFormModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData, mode }) => {
  const [activeTab, setActiveTab] = useState<'ASAS' | 'WARIS' | 'KESIHATAN'>('ASAS');
  
  const defaultData: Partial<Student> = {
    nama: '', noKP: '', noKeahlian: '', tingkatan: '1', kelas: '', jantina: Jantina.Lelaki, 
    kaum: Kaum.Melayu, kumpulanDarah: 'A+', alamat: '', namaWaris: '', noKPWaris: '', 
    telefonWaris: '', health: {
      asma: false, lelahTB: false, kencingManis: false, darahTinggi: false,
      penglihatan: false, pendengaran: false, kronikLain: false, kecacatan: ''
    }
  };

  const [formData, setFormData] = useState<Partial<Student>>(defaultData);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...defaultData, ...initialData });
      } else {
        setFormData(defaultData);
      }
      setActiveTab('ASAS');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.nama || !formData.noKP) {
      alert("Sila isi Nama Penuh dan No. Kad Pengenalan.");
      return;
    }
    onSave(formData);
    onClose();
  };

  const updateHealth = (key: keyof HealthStatus, val: any) => {
    setFormData(prev => ({
      ...prev,
      health: { ...prev.health, [key]: val } as HealthStatus
    }));
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-slate-900 border border-white/[0.1] rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.05]">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
              {mode === 'ADD' ? <User className="text-emerald-500" /> : <User className="text-amber-500" />}
              {mode === 'ADD' ? 'Pendaftaran Anggota Baru' : 'Kemaskini Maklumat Anggota'}
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
              Sila lengkapkan maklumat di bawah
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/[0.05] rounded-full text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b border-white/[0.05] bg-slate-950/30">
          {[
            { id: 'ASAS', label: 'Maklumat Asas', icon: ShieldCheck },
            { id: 'WARIS', label: 'Waris & Hubungan', icon: Phone },
            { id: 'KESIHATAN', label: 'Profil Kesihatan', icon: Heart },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${
                activeTab === tab.id 
                  ? 'border-red-500 text-red-500 bg-red-500/5' 
                  : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          {activeTab === 'ASAS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="md:col-span-2">
                 <Input label="Nama Penuh (Seperti MyKad)" value={formData.nama} onChange={(e: any) => setFormData({...formData, nama: e.target.value})} autoFocus />
              </div>
              <Input label="No. Kad Pengenalan" placeholder="Contoh: 080101061234" value={formData.noKP} onChange={(e: any) => setFormData({...formData, noKP: e.target.value})} />
              <Input label="No. Keahlian (Jika Ada)" placeholder="KB-001/2024" value={formData.noKeahlian} onChange={(e: any) => setFormData({...formData, noKeahlian: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-4">
                 <Select label="Tingkatan" value={formData.tingkatan} onChange={(e: any) => setFormData({...formData, tingkatan: e.target.value})} options={FORMS.map(f => ({ value: f, label: `TINGKATAN ${f}` }))} />
                 <Input label="Nama Kelas" value={formData.kelas} onChange={(e: any) => setFormData({...formData, kelas: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <Select label="Jantina" value={formData.jantina} onChange={(e: any) => setFormData({...formData, jantina: e.target.value})} options={Object.values(Jantina).map(j => ({ value: j, label: j }))} />
                 <Select label="Kaum" value={formData.kaum} onChange={(e: any) => setFormData({...formData, kaum: e.target.value})} options={Object.values(Kaum).map(k => ({ value: k, label: k }))} />
              </div>

              <div className="md:col-span-2">
                <Input label="Alamat Rumah" value={formData.alamat} onChange={(e: any) => setFormData({...formData, alamat: e.target.value})} />
              </div>
            </div>
          )}

          {activeTab === 'WARIS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2">
               <div className="md:col-span-2 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-2">
                  <p className="text-[10px] font-bold text-amber-500 uppercase flex items-center gap-2">
                    <Phone className="w-3 h-3" /> Maklumat ini penting untuk kes kecemasan
                  </p>
               </div>
               <Input label="Nama Bapa / Ibu / Penjaga" value={formData.namaWaris} onChange={(e: any) => setFormData({...formData, namaWaris: e.target.value})} />
               <Input label="No. Telefon Waris" placeholder="01X-XXXXXXX" value={formData.telefonWaris} onChange={(e: any) => setFormData({...formData, telefonWaris: e.target.value})} />
               <Input label="No. KP Waris" value={formData.noKPWaris} onChange={(e: any) => setFormData({...formData, noKPWaris: e.target.value})} />
            </div>
          )}

          {activeTab === 'KESIHATAN' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { k: 'asma', l: 'Asma / Lelah' },
                    { k: 'kencingManis', l: 'Kencing Manis' },
                    { k: 'darahTinggi', l: 'Darah Tinggi' },
                    { k: 'lelahTB', l: 'Batuk Kering (TB)' },
                    { k: 'penglihatan', l: 'Masalah Penglihatan' },
                    { k: 'pendengaran', l: 'Masalah Pendengaran' },
                    { k: 'kronikLain', l: 'Lain-lain Penyakit Kronik' },
                  ].map((item) => (
                    <div key={item.k} onClick={() => updateHealth(item.k as keyof HealthStatus, !formData.health?.[item.k as keyof HealthStatus])} className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${formData.health?.[item.k as keyof HealthStatus] ? 'bg-red-600/20 border-red-600' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`}>
                       <span className={`text-xs font-bold uppercase ${formData.health?.[item.k as keyof HealthStatus] ? 'text-red-500' : 'text-slate-400'}`}>{item.l}</span>
                       <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.health?.[item.k as keyof HealthStatus] ? 'bg-red-600 border-red-600' : 'border-slate-600'}`}>
                          {formData.health?.[item.k as keyof HealthStatus] && <div className="w-2 h-2 bg-white rounded-full" />}
                       </div>
                    </div>
                  ))}
                </div>
                <div>
                   <Input label="Catatan Kecacatan (Jika Ada)" value={formData.health?.kecacatan || ''} onChange={(e: any) => updateHealth('kecacatan', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <Select label="Kumpulan Darah" value={formData.kumpulanDarah} onChange={(e: any) => setFormData({...formData, kumpulanDarah: e.target.value})} options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'TIDAK PASTI'].map(d => ({ value: d, label: d }))} />
                </div>
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/[0.05] bg-slate-950/50 flex justify-end gap-3 rounded-b-[2rem]">
           <Button variant="secondary" onClick={onClose} className="w-32">Batal</Button>
           <Button onClick={handleSubmit} className="w-48 shadow-lg shadow-red-600/20">
             <Save className="w-4 h-4" /> {mode === 'ADD' ? 'Simpan Pendaftaran' : 'Kemaskini Data'}
           </Button>
        </div>
      </div>
    </div>
  );
};

export default MemberFormModal;
