
import { SystemData } from '../types';

const STORAGE_KEY = 'ekelab_data_v1';

const createEmptyData = (): SystemData => ({
  teachers: [],
  students: [],
  committees: [],
  attendances: [],
  activities: [],
  annualPlans: [],
  lastUpdated: 0,
  settings: {
    sheetUrl: '', 
    autoSync: true,
    schoolName: 'SMK SULTAN AHMAD SHAH',
    clubName: 'KADET BOMBA',
    address: 'Jalan Sultan Ahmad Shah, 25200 Kuantan'
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
  if (!url || !url.includes('script.google.com')) return null;
  try {
    const response = await fetch(`${url}?t=${Date.now()}`);
    if (!response.ok) return null;
    const cloudData = await response.json();
    
    // Validasi struktur data cloud
    if (cloudData && typeof cloudData === 'object' && (Array.isArray(cloudData.students) || Array.isArray(cloudData.teachers))) {
      return cloudData as SystemData;
    }
    return null;
  } catch (err) {
    console.error("Cloud Fetch Error:", err);
    return null;
  }
};

export const saveDataToCloud = async (data: SystemData): Promise<{success: boolean, message: string}> => {
  const url = data.settings?.sheetUrl;
  if (!url || !url.includes('script.google.com')) return { success: false, message: "URL API Tidak Sah" };

  try {
    // Pastikan timestamp sentiasa dikemaskini sebelum hantar
    const dataToSend = { ...data, lastUpdated: Date.now() };
    
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(dataToSend)
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSend));
    return { success: true, message: "Data berjaya diselaraskan ke Cloud" };
  } catch (err) {
    console.error("Cloud Save Error:", err);
    return { success: false, message: "Gagal menyambung ke Cloud" };
  }
};

export const saveData = (data: SystemData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
