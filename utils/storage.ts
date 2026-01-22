import { SystemData } from '../types';

const STORAGE_KEY = 'ekelab_data_v1';

const createEmptyData = (): SystemData => ({
  teachers: [],
  students: [],
  committees: [],
  attendances: [],
  activities: [],
  annualPlans: [],
  settings: {
    sheetUrl: '',
    autoSync: false,
    schoolName: '',
    clubName: '',
    address: '',
    logoUrl: ''
  }
});

export const loadData = (): SystemData => {
  if (typeof window === 'undefined') return createEmptyData();
  
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return createEmptyData();
    }
  }
  return createEmptyData();
};

export const fetchDataFromCloud = async (url: string): Promise<SystemData | null> => {
  if (!url) return null;
  try {
    // Menggunakan fetch GET untuk mengambil data. 
    // Pastikan Google Apps Script anda mempunyai fungsi doGet(e) yang return ContentService.createTextOutput(JSON.stringify(data))
    const response = await fetch(url);
    if (!response.ok) throw new Error("Gagal mengambil data dari awan");
    const cloudData = await response.json();
    
    // Validasi struktur data ringkas
    if (cloudData && Array.isArray(cloudData.students)) {
      return cloudData as SystemData;
    }
    return null;
  } catch (err) {
    console.error("Cloud Fetch Error:", err);
    return null;
  }
};

export const saveData = async (data: SystemData) => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  
  if (data.settings?.sheetUrl && data.settings?.autoSync) {
    try {
      // POST untuk simpan data
      await fetch(data.settings.sheetUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.warn("Cloud Sync Error - Data saved locally only.");
    }
  }
};

export const testCloudConnection = async (url: string): Promise<boolean> => {
  if (!url || !url.startsWith('https://script.google.com')) return false;
  try {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true, timestamp: new Date().toISOString() })
    });
    return true; 
  } catch (err) {
    console.error("Connection test failed:", err);
    return false;
  }
};