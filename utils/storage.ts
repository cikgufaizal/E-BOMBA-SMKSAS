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
    // Standard fetch GET. Google Apps Script doGet() akan handle redirect.
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) throw new Error("Gagal mengambil data dari awan");
    const cloudData = await response.json();
    
    // Pastikan data yang diterima adalah objek yang sah dan mempunyai array pelajar
    if (cloudData && (Array.isArray(cloudData.students) || cloudData.settings)) {
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
  
  // Simpan ke local storage sentiasa sebagai backup
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  
  // Jika sync aktif, hantar ke Google Sheets
  if (data.settings?.sheetUrl && data.settings?.autoSync) {
    try {
      await fetch(data.settings.sheetUrl, {
        method: 'POST',
        mode: 'no-cors', // Penting untuk Google Apps Script doPost()
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      console.log("Data berjaya dihantar ke Google Sheets.");
    } catch (err) {
      console.warn("Cloud Sync Error - Data disimpan di peranti ini sahaja.");
    }
  }
};

export const testCloudConnection = async (url: string): Promise<boolean> => {
  if (!url || !url.startsWith('https://script.google.com')) return false;
  try {
    // Test menggunakan POST ringkas
    await fetch(url, {
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