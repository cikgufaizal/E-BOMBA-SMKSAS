import React from 'react';
import { SystemData, ReportType, Student } from '../../../types';
import BombaHeader from '../headers/BombaHeader';

interface Props {
  data: SystemData;
  type: ReportType;
  targetId?: string;
}

const PrintBorangBomba: React.FC<Props> = ({ data, type, targetId }) => {
  const currentYear = new Date().getFullYear();

  // Helper untuk tajuk
  const DocumentTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="text-center mb-6 font-serif uppercase text-black break-inside-avoid page-break-inside-avoid">
        <h2 className="text-[12pt] font-bold underline">{title}</h2>
        {subtitle && <p className="text-[11pt] font-bold mt-1">{subtitle}</p>}
    </div>
  );

  // KANDUNGAN LAMPIRAN A (PENDAFTARAN)
  const renderLampiranA = () => {
    const s = data.students.find(x => x.id === targetId);
    if (!s) return <div>Data Pelajar Tidak Dijumpai</div>;

    const schoolName = data.settings?.schoolName || "SMK SULTAN AHMAD SHAH";
    
    // Helper untuk checkmark
    const Check = ({ val }: { val: boolean }) => (
      <span className="font-bold">{val ? "(/)" : "( )"}</span>
    );
    
    // Helper untuk inverse checkmark (untuk kolom TIADA)
    const CheckNo = ({ val }: { val: boolean }) => (
      <span className="font-bold">{!val ? "(/)" : "( )"}</span>
    );

    const FieldRow = ({ num, label, value, isDotted = true }: any) => (
      <div className="flex items-end gap-2 mt-2">
        <div className="w-[28px] text-[11pt]">{num}.</div>
        <div className="w-[160px] text-[11pt]">{label}</div>
        <div className={`flex-1 ${isDotted ? 'border-b border-black border-dotted' : 'border-b border-black'} px-2 font-bold uppercase text-[11pt] leading-none pb-1`}>
          {value}
        </div>
      </div>
    );

    return