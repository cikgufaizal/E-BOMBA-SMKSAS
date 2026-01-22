import React, { useState } from 'react';
import { Plus, Trash2, CalendarDays } from 'lucide-react';
import { SystemData, AnnualPlan } from '../types';
import { FormCard, Input, Select, Button, Table, InlineConfirm } from './CommonUI';
import { MONTHS } from '../constants';

interface Props {
  data: SystemData;
  updateData: (newData: Partial<SystemData>) => void;
}

const RancanganManager: React.FC<Props> = ({ data, updateData }) => {
  const [formData, setFormData] = useState<Partial<AnnualPlan>>({
    bulan: 'JANUARI', program: '', tempat: '', catatan: ''
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const addPlan = () => {
    if (!formData.program) return;
    const newPlan: AnnualPlan = {
      id: crypto.randomUUID(),
      bulan: formData.bulan!,
      program: formData.program,
      tempat: formData.tempat || '-',
      catatan: formData.catatan || '-'
    };
    updateData({ annualPlans: [...data.annualPlans, newPlan] });
    setFormData({ ...formData, program: '', catatan: '' });
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
         <div className="p-3 bg-amber-600 rounded-2xl">
            <CalendarDays className="w-6 h-6 text-white" />
         </div>
         <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Rancangan Tahunan {new Date().getFullYear()}</h2>
      </div>

      <FormCard title="Tambah Rancangan Aktiviti">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Select label="Bulan Pelaksanaan" value={formData.bulan} onChange={(e: any) => setFormData({...formData, bulan: e.target.value})} options={MONTHS.map(m => ({ value: m, label: m }))} />
          <Input label="Program / Nama Aktiviti" placeholder="Cth: Perkhemahan Perdana" value={formData.program} onChange={(e: any) => setFormData({...formData, program: e.target.value})} />
          <Input label="Cadangan Tempat" placeholder="Cth: Tapak Kokurikulum" value={formData.tempat} onChange={(e: any) => setFormData({...formData, tempat: e.target.value})} />
          <div className="md:col-span-3">
             <Input label="Nota / Catatan Utama" placeholder="Cth: Melibatkan semua tingkatan 4 dan 5" value={formData.catatan} onChange={(e: any) => setFormData({...formData, catatan: e.target.value})} />
          </div>
          <div className="md:col-span-3">
            <Button onClick={addPlan} className="w-full h-12"><Plus className="w-4 h-4" /> Sahkan Rancangan</Button>
          </div>
        </div>
      </FormCard>

      <Table
        headers={['Bulan', 'Program / Aktiviti', 'Tempat', 'Catatan', 'Tindakan']}
        data={data.annualPlans.sort((a,b) => MONTHS.indexOf(a.bulan) - MONTHS.indexOf(b.bulan))}
        renderRow={(plan: AnnualPlan) => (
          <tr key={plan.id} className="hover:bg-slate-900/50 transition-colors">
            <td className="px-6 py-4">
              <span className="px-3 py-1 bg-amber-900/20 text-amber-500 text-[10px] font-black rounded-lg border border-amber-800/30 uppercase tracking-widest">
                {plan.bulan}
              </span>
            </td>
            <td className="px-6 py-4 text-sm font-black text-slate-200 uppercase tracking-tighter italic">{plan.program}</td>
            <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{plan.tempat}</td>
            <td className="px-6 py-4 text-[11px] text-slate-400 italic leading-relaxed">{plan.catatan}</td>
            <td className="px-6 py-4">
              {deletingId === plan.id ? (
                <InlineConfirm onConfirm={() => updateData({ annualPlans: data.annualPlans.filter(p => p.id !== plan.id) })} onCancel={() => setDeletingId(null)} />
              ) : (
                <button onClick={() => setDeletingId(plan.id)} className="text-slate-600 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              )}
            </td>
          </tr>
        )}
      />
    </div>
  );
};

export default RancanganManager;