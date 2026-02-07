import { SystemData } from '../types';
import { CLOUD_API_URL, SCHOOL_INFO } from '../constants';

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
    sheetUrl: CLOUD_API_URL,
    autoSync: true,
    schoolName: SCHOOL_INFO.name,
    clubName: SCHOOL_INFO.clubName,
    address: SCHOOL_INFO.address
  }
});

export const loadData = (): SystemData => {
  if (typeof window === 'undefined') return createEmptyData();
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Sentiasa paksa URL API yang terkini dari constants
      if (parsed.settings) {
        parsed.settings.sheetUrl = CLOUD_API_URL;
      }
      return parsed;
    } catch (e) {
      return createEmptyData();
    }
  }
  return createEmptyData();
};

export const fetchDataFromCloud = async (): Promise<SystemData | null> => {
  if (!CLOUD_API_URL) return null;
  
  try {
    // Tambah cache-buster timestamp untuk elak data basi di Incognito
    const url = `${CLOUD_API_URL}?t=${Date.now()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store',
      redirect: 'follow',
    });

    if (!response.ok) {
      console.error(`Sync Fail: HTTP ${response.status}`);
      return null;
    }

    const cloudData = await response.json();
    
    // Status EMPTY bermaksud sheet wujud tapi tiada data
    if (cloudData && typeof cloudData === 'object' && cloudData.status !== "EMPTY") {
      return cloudData as SystemData;
    }
    
    return null;
  } catch (err) {
    console.error("Network Error / CORS Issue:", err);
    return null;
  }
};

export const saveDataToCloud = async (data: SystemData): Promise<{success: boolean, message: string}> => {
  if (!CLOUD_API_URL) return { success: false, message: "URL API Tidak Sah" };

  try {
    const dataToSend = { ...data, lastUpdated: Date.now() };
    
    // Gunakan mode 'no-cors' dengan content-type text/plain 
    // untuk mengelakkan isu preflight OPTIONS pada Google Apps Script
    await fetch(CLOUD_API_URL, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-store',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(dataToSend)
    });
    
    // Simpan ke local storage sebagai cache pantas
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSend));
    
    return { success: true, message: "Data berjaya dihantar ke Cloud." };
  } catch (err) {
    console.error("Gagal Save ke Cloud:", err);
    return { success: false, message: "Ralat sambungan Cloud." };
  }
};

export const saveData = (data: SystemData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};