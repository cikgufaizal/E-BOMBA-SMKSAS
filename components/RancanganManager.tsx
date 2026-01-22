
import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
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
      <h2 className="text-lg font-bold text-slate-800 mb-6">Rancangan Tahunan</h2>

      <FormCard title="Tambah Rancangan Aktiviti">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Select label="Bulan" value={formData.bulan} onChange={(e: any) => setFormData({...formData, bulan: e.target.value})} options={MONTHS.map(m => ({ value: m, label: m }))} />
          <Input label="Program / Aktiviti" value={formData.program} onChange={(e: any) => setFormData({...formData, program: e.target.value})} />
          <Input label="Tempat" value={formData.tempat} onChange={(e: any) => setFormData({...formData, tempat: e.target.value})} />
          <div className="md:col-span-3">
             <Input label="Catatan Tambahan" value={formData.catatan} onChange={(e: any) => setFormData({...formData, catatan: e.target.value})} />
          </div>
          <div className="md:col-span-3">
            <Button onClick={addPlan} className="w-full"><Plus className="w-4 h-4" /> Tambah Rancangan</Button>
          </div>
        </div>
      </FormCard>

      <Table
        headers={['Bulan', 'Program/Aktiviti', 'Tempat', 'Catatan', 'Tindakan']}
        data={data.annualPlans}
        renderRow={(plan: AnnualPlan) => (
          <tr key={plan.id} className="hover:bg-slate-50">
            <td className="px-6 py-4 text-xs font-bold text-indigo-600">{plan.bulan}</td>
            <td className="px-6 py-4 text-sm font-bold text-slate-800">{plan.program}</td>
            <td className="px-6 py-4 text-sm text-slate-600">{plan.tempat}</td>
            <td className="px-6 py-4 text-xs text-slate-500 italic">{plan.catatan}</td>
            <td className="px-6 py-4">
              {deletingId === plan.id ? (
                <InlineConfirm onConfirm={() => updateData({ annualPlans: data.annualPlans.filter(p => p.id !== plan.id) })} onCancel={() => setDeletingId(null)} />
              ) : (
                <button onClick={() => setDeletingId(plan.id)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
              )}
            </td>
          </tr>
        )}
      />
    </div>
  );
};

export default RancanganManager;
