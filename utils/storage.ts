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
    // Gunakan URL dengan timestamp untuk elak caching di Incognito
    const url = `${CLOUD_API_URL}?t=${Date.now()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors', // Paksa CORS
      cache: 'no-store', // Jangan guna cache
      redirect: 'follow', // Wajib untuk Google Apps Script (handle 302 redirect)
    });

    if (!response.ok) {
      console.error(`Cloud Sync Failed: HTTP ${response.status}`);
      return null;
    }

    const cloudData = await response.json();
    
    // Pastikan data yang diterima adalah objek yang sah
    if (cloudData && typeof cloudData === 'object' && cloudData.status !== "EMPTY") {
      return cloudData as SystemData;
    }
    
    console.debug("Cloud returned empty or invalid data format.");
    return null;
  } catch (err) {
    console.error("Network Error (Sync Failed):", err);
    return null;
  }
};

export const saveDataToCloud = async (data: SystemData): Promise<{success: boolean, message: string}> => {
  if (!CLOUD_API_URL) return { success: false, message: "URL API Tidak Dikesan" };

  try {
    const dataToSend = { ...data, lastUpdated: Date.now() };
    
    // Google Apps Script memerlukan POST dengan mod 'no-cors' atau 'cors' tanpa custom headers tertentu
    // Kita guna 'no-cors' kerana ia paling stabil untuk menghantar data ke GAS Web App
    await fetch(CLOUD_API_URL, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-store',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(dataToSend)
    });
    
    // Simpan ke local storage juga
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSend));
    
    return { success: true, message: "Data berjaya dihantar ke Cloud." };
  } catch (err) {
    console.error("Gagal menghantar ke Cloud:", err);
    return { success: false, message: "Ralat sambungan Cloud (Semak Internet)" };
  }
};

export const saveData = (data: SystemData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};