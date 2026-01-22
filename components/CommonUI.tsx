
import React from 'react';
import { THEME_COLOR } from '../constants';

export const FormCard = ({ title, children }: any) => (
  <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 overflow-hidden mb-8">
    <div className={`px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-800 flex items-center justify-between`}>
      <h3 className="font-bold text-slate-100 tracking-tight">{title}</h3>
      <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
    </div>
    <div className="p-6 text-slate-300">{children}</div>
  </div>
);

export const Input = ({ label, ...props }: any) => (
  <div className="space-y-2">
    {label && <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>}
    <input 
      {...props} 
      className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all outline-none" 
    />
  </div>
);

export const Select = ({ label, options, ...props }: any) => (
  <div className="space-y-2">
    {label && <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>}
    <select 
      {...props} 
      className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all outline-none appearance-none"
    >
      <option value="" className="bg-slate-900">Sila Pilih</option>
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value} className="bg-slate-900">{opt.label}</option>
      ))}
    </select>
  </div>
);

export const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const variants: any = {
    primary: `bg-gradient-to-br from-red-700 to-red-900 text-white hover:brightness-110 shadow-lg shadow-red-900/20 border border-red-800/50`,
    secondary: 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700',
    danger: 'bg-rose-900/30 text-rose-400 border border-rose-800/50 hover:bg-rose-900/50 shadow-lg shadow-rose-950/20',
    success: 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 hover:bg-emerald-900/50 shadow-lg shadow-emerald-950/20'
  };
  
  return (
    <button 
      {...props} 
      className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Table = ({ headers, data, renderRow, emptyMessage = 'Tiada data dijumpai' }: any) => (
  <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-950/50 border-b border-slate-800">
          <tr>
            {headers.map((h: string, i: number) => (
              <th key={i} className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {data.length > 0 ? data.map((item: any, idx: number) => renderRow(item, idx)) : (
            <tr>
              <td colSpan={headers.length} className="px-6 py-16 text-center text-slate-600 font-medium italic">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export const InlineConfirm = ({ onConfirm, onCancel }: any) => (
  <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-xl border border-rose-900/50 animate-in fade-in slide-in-from-right-2">
    <span className="text-[10px] font-black text-rose-500 uppercase tracking-tighter px-2">Padam?</span>
    <button onClick={onConfirm} className="px-3 py-1 text-[10px] bg-rose-600 text-white rounded-md font-bold hover:bg-rose-700 transition-colors uppercase tracking-widest">Ya</button>
    <button onClick={onCancel} className="px-3 py-1 text-[10px] bg-slate-800 text-slate-400 rounded-md font-bold hover:bg-slate-700 transition-colors uppercase tracking-widest">Tidak</button>
  </div>
);
