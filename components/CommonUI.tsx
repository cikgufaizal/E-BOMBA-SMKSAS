import React from 'react';

export const FormCard = ({ title, children, badge }: any) => (
  <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2rem] border border-white/[0.05] overflow-hidden mb-8 transition-all hover:border-red-500/20 shadow-2xl animate-enter hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] group">
    <div className="px-8 py-6 border-b border-white/[0.05] flex items-center justify-between bg-gradient-to-r from-slate-900/80 to-transparent relative overflow-hidden">
      {/* Glossy Effect on Header */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-1.5 h-5 bg-red-600 rounded-full shadow-[0_0_10px_#ef4444] animate-pulse"></div>
        <h3 className="font-extrabold text-slate-100 tracking-tight uppercase text-sm">{title}</h3>
      </div>
      {badge && <span className="px-3 py-1 bg-red-600/10 text-red-500 text-[10px] font-black rounded-full border border-red-600/20 relative z-10 shadow-[0_0_10px_rgba(239,68,68,0.2)]">{badge}</span>}
    </div>
    <div className="p-8 text-slate-300 relative z-10">{children}</div>
  </div>
);

export const Input = ({ label, icon: Icon, ...props }: any) => (
  <div className="space-y-2 group">
    {label && <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-red-500 transition-colors duration-300">{label}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-red-500 transition-colors duration-300" />}
      <input 
        {...props} 
        className={`w-full ${Icon ? 'pl-12' : 'px-6'} py-4 bg-slate-950/50 border border-white/[0.05] rounded-2xl text-slate-200 placeholder:text-slate-700 focus:bg-slate-950 focus:ring-4 focus:ring-red-600/10 focus:border-red-600 transition-all outline-none font-medium text-sm hover:border-white/10`} 
      />
      {/* Corner Accent */}
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-500/0 group-focus-within:border-red-500 rounded-br-2xl transition-all duration-300"></div>
    </div>
  </div>
);

export const Select = ({ label, options, ...props }: any) => (
  <div className="space-y-2 group">
    {label && <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-red-500 transition-colors duration-300">{label}</label>}
    <div className="relative">
      <select 
        {...props} 
        className="w-full px-6 py-4 bg-slate-950/50 border border-white/[0.05] rounded-2xl text-slate-200 focus:bg-slate-950 focus:ring-4 focus:ring-red-600/10 focus:border-red-600 transition-all outline-none appearance-none font-medium text-sm cursor-pointer hover:border-white/10"
      >
        <option value="" className="bg-slate-900">Sila Pilih...</option>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900">{opt.label}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600 group-focus-within:text-red-500 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  </div>
);

export const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const variants: any = {
    primary: `bg-red-600 text-white hover:bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] border border-red-500/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] btn-shine`,
    secondary: 'bg-slate-800 text-slate-300 border border-white/[0.05] hover:bg-slate-700 hover:text-white hover:border-white/20',
    danger: 'bg-rose-950/30 text-rose-500 border border-rose-600/30 hover:bg-rose-600 hover:text-white hover:shadow-[0_0_20px_rgba(225,29,72,0.4)]',
    success: 'bg-emerald-950/30 text-emerald-500 border border-emerald-600/30 hover:bg-emerald-600 hover:text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]'
  };
  
  return (
    <button 
      {...props} 
      className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group ${variants[variant]} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-3">{children}</span>
    </button>
  );
};

export const Table = ({ headers, data, renderRow, emptyMessage = 'Tiada data dijumpai' }: any) => (
  <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2rem] border border-white/[0.05] overflow-hidden shadow-2xl animate-enter hover:border-white/10 transition-colors">
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-left">
        <thead className="bg-slate-950/80 border-b border-white/[0.05] backdrop-blur-md">
          <tr>
            {headers.map((h: string, i: number) => (
              <th key={i} className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.02]">
          {data.length > 0 ? data.map((item: any, idx: number) => renderRow(item, idx)) : (
            <tr>
              <td colSpan={headers.length} className="px-8 py-24 text-center">
                <div className="flex flex-col items-center gap-4 opacity-30 animate-pulse">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export const InlineConfirm = ({ onConfirm, onCancel }: any) => (
  <div className="flex items-center gap-2 bg-rose-950/50 p-1.5 pr-2 rounded-2xl border border-rose-500/30 animate-in zoom-in duration-200">
    <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest px-2 animate-pulse">Padam?</span>
    <button onClick={onConfirm} className="px-3 py-1.5 text-[9px] bg-rose-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-rose-500 transition-all btn-press shadow-lg shadow-rose-900/50">Ya</button>
    <button onClick={onCancel} className="px-3 py-1.5 text-[9px] bg-slate-800 text-slate-400 rounded-xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all btn-press">X</button>
  </div>
);