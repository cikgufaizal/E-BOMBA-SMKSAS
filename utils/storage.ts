
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
    // Google Apps Script memerlukan redirect: 'follow'
    // t= digunakan untuk cache busting (mengelakkan data lama disimpan pelayar)
    const response = await fetch(`${CLOUD_API_URL}?t=${Date.now()}`, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      redirect: 'follow'
    });

    if (!response.ok) {
      console.warn("Cloud Response Not OK:", response.status);
      return null;
    }

    const cloudData = await response.json();
    
    if (cloudData && typeof cloudData === 'object' && cloudData.status !== "EMPTY") {
      return cloudData as SystemData;
    }
    return null;
  } catch (err) {
    // Ralat "Failed to fetch" biasanya kerana sekatan CORS atau offline
    console.error("Network Error / CORS Blocked:", err);
    return null;
  }
};

export const saveDataToCloud = async (data: SystemData): Promise<{success: boolean, message: string}> => {
  if (!CLOUD_API_URL) return { success: false, message: "URL API Tidak Dikesan" };

  try {
    const dataToSend = { ...data, lastUpdated: Date.now() };
    
    // Gunakan POST dengan mode 'no-cors' untuk Google Apps Script
    // Ini menghantar data tanpa menunggu maklumbalas (kerana GAS 302 redirect isu)
    await fetch(CLOUD_API_URL, {
      method: 'POST',
      mode: 'no-cors', // Penting untuk elak CORS preflight ralat pada Google Script
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(dataToSend)
    });
    
    // Simpan ke local sebagai backup segera
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSend));
    return { success: true, message: "Data dihantar ke Cloud (Handshake Berjaya)" };
  } catch (err) {
    console.error("Gagal menghantar ke Cloud:", err);
    return { success: false, message: "Ralat sambungan Cloud" };
  }
};

export const saveData = (data: SystemData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
