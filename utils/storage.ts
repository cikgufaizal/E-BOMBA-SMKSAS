
import { SystemData } from '../types';

const STORAGE_KEY = 'ekelab_data_v1';

const createEmptyData = (): SystemData => ({
  teachers: [],
  students: [],
  committees: [],
  attendances: [],
  activities: [],
  annualPlans: [],
  lastUpdated: Date.now(),
  settings: {
    sheetUrl: '', 
    autoSync: true,
    schoolName: 'SMK SULTAN AHMAD SHAH',
    clubName: 'KADET BOMBA',
    address: 'Jalan Sultan Ahmad Shah, 25200 Kuantan',
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
  if (!url || !url.startsWith('https://script.google.com')) return null;
  try {
    // Tambah cache buster t=Date.now()
    const response = await fetch(`${url}?t=${Date.now()}`, { 
      method: 'GET',
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (!response.ok) return null;
    const cloudData = await response.json();
    
    // Pastikan data yang diterima valid
    if (cloudData && (Array.isArray(cloudData.students) || Array.isArray(cloudData.teachers))) {
      return cloudData as SystemData;
    }
    return null;
  } catch (err) {
    console.error("Fetch Cloud Error:", err);
    return null;
  }
};

export const saveData = async (data: SystemData): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  
  // Update timestamp sebelum simpan
  const dataToSave = { ...data, lastUpdated: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  
  const url = dataToSave.settings?.sheetUrl;
  if (url && url.startsWith('https://script.google.com')) {
    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(dataToSave)
      });
      return true;
    } catch (err) {
      console.error("Save Cloud Error:", err);
      return false;
    }
  }
  return false;
};
