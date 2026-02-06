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
    // FIX CORS & NETWORK ERROR:
    // 1. credentials: 'omit' -> Penting! Elak hantar cookie Google yang menyebabkan konflik akaun.
    // 2. Tiada Header Custom -> Pastikan ia kekal 'Simple Request'.
    const response = await fetch(`${CLOUD_API_URL}?t=${Date.now()}`, {
      method: 'GET',
      redirect: 'follow',
      credentials: 'omit' 
    });

    if (!response.ok) {
      console.warn("Cloud Response Not OK:", response.status);
      return null;
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
       console.warn("Cloud returned HTML instead of JSON. Check Script Deployment (Anyone vs Me).");
       return null;
    }

    const cloudData = await response.json();
    
    if (cloudData && typeof cloudData === 'object' && cloudData.status !== "EMPTY") {
      return cloudData as SystemData;
    }
    return null;
  } catch (err) {
    console.error("Network Error / CORS Blocked:", err);
    return null;
  }
};

export const saveDataToCloud = async (data: SystemData): Promise<{success: boolean, message: string}> => {
  if (!CLOUD_API_URL) return { success: false, message: "URL API Tidak Dikesan" };

  try {
    const dataToSend = { ...data, lastUpdated: Date.now() };
    
    // Guna 'no-cors' untuk POST ke GAS. 
    // Kita tak boleh baca response status, tapi ini satu-satunya cara elak CORS Preflight untuk POST.
    await fetch(CLOUD_API_URL, {
      method: 'POST',
      mode: 'no-cors',
      credentials: 'omit', // Tambah ini juga untuk keselamatan
      headers: { 'Content-Type': 'text/plain' }, // Mesti text/plain
      body: JSON.stringify(dataToSend)
    });
    
    // Simpan ke local sebagai backup
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSend));
    return { success: true, message: "Data dihantar ke Cloud (Mod Senyap)" };
  } catch (err) {
    console.error("Gagal menghantar ke Cloud:", err);
    return { success: false, message: "Ralat sambungan Cloud" };
  }
};

export const saveData = (data: SystemData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};