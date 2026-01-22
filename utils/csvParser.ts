
export const parseCSV = (text: string): string[][] => {
  return text
    .split(/\r?\n/)
    .filter(line => line.trim() !== '')
    .map(line => line.split(',').map(cell => cell.trim()));
};

export const handleFileUpload = (file: File, callback: (rows: string[][]) => void) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result as string;
    callback(parseCSV(text));
  };
  reader.readAsText(file);
};
