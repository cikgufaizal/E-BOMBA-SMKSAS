import React, { useState } from 'react';
import { Upload, X, FileSpreadsheet } from 'lucide-react';
import { Button, FormCard } from '../CommonUI';
import { parseCSV, handleFileUpload } from '../../utils/csvParser';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImport: (rows: string[][]) => void;
  title?: string;
  notes?: React.ReactNode;
}

const CsvImportModal: React.FC<Props> = ({ isOpen, onClose, onImport, title = "Import Data CSV", notes }) => {
  const [csvText, setCsvText] = useState('');

  if (!isOpen) return null;

  const handleProcess = () => {
    onImport(parseCSV(csvText));
  };

  return (
    <div className="fixed inset-0 z-[150] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="w-full max-w-2xl">
        <div className="flex justify-end mb-2">
            <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-white hover:bg-red-600 transition-colors"><X className="w-6 h-6" /></button>
        </div>
        <FormCard title={title}>
          <div className="space-y-6">
            {notes && (
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
                    {notes}
                </div>
            )}
            
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Paste CSV Data</label>
                <textarea
                  className="w-full h-40 p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 focus:border-red-600 outline-none"
                  placeholder="Paste data dari Excel/CSV di sini..."
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <input
                    type="file"
                    accept=".csv"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], onImport)}
                />
                <Button variant="secondary" className="w-full h-14">
                    <Upload className="w-4 h-4" /> Upload File .CSV
                </Button>
              </div>
              <Button onClick={handleProcess} className="w-full h-14">
                  <FileSpreadsheet className="w-4 h-4" /> Proses Data
              </Button>
            </div>
          </div>
        </FormCard>
      </div>
    </div>
  );
};

export default CsvImportModal;