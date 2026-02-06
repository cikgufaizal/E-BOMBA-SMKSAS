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
      // Sentiasa update URL dari constants jika ia berubah di kod
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
    // TIPS: 'no-cors' tidak membenarkan kita baca JSON response.
    // Kita MESTI guna 'cors' (default).
    // Jika berlaku CORS Error, selalunya sebab Script Google App tidak di-deploy sebagai "Anyone".
    // Sila pastikan di Google Script: Deploy > Web App > Who has access > "Anyone".
    
    const response = await fetch(`${CLOUD_API_URL}?t=${Date.now()}`, {
      method: 'GET',
      credentials: 'omit', // Penting untuk elak hantar cookies yg menyebabkan redirect ke login
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      console.warn("Cloud Response Not OK:", response.status);
      return null;
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
       // Ini berlaku jika script redirect ke Google Login Page
       console.warn("Cloud returned HTML instead of JSON. Deployment Issue?");
       return null;
    }

    const cloudData = await response.json();
    
    if (cloudData && typeof cloudData === 'object' && cloudData.status !== "EMPTY") {
      return cloudData as SystemData;
    }
    return null;
  } catch (err) {
    // Suppress network errors to avoid UI noise
    console.debug("Offline Mode / Cloud Unreachable:", err);
    return null;
  }
};

export const saveDataToCloud = async (data: SystemData): Promise<{success: boolean, message: string}> => {
  if (!CLOUD_API_URL) return { success: false, message: "URL API Tidak Dikesan" };

  try {
    const dataToSend = { ...data, lastUpdated: Date.now() };
    
    // Gunakan 'no-cors' untuk POST ke Google Apps Script.
    // Ini standard untuk form submission ke GAS tanpa perlu handle CORS Preflight.
    await fetch(CLOUD_API_URL, {
      method: 'POST',
      mode: 'no-cors',
      credentials: 'omit',
      headers: { 'Content-Type': 'text/plain' }, // Mesti text/plain
      body: JSON.stringify(dataToSend)
    });
    
    // Simpan ke local juga
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSend));
    
    // Oleh sebab 'no-cors', kita tak tahu status sebenar. Kita anggap berjaya jika tiada network error.
    return { success: true, message: "Data dihantar ke Cloud (Mod Senyap)" };
  } catch (err) {
    console.error("Gagal menghantar ke Cloud:", err);
    return { success: false, message: "Ralat sambungan Cloud (Semak Internet)" };
  }
};

export const saveData = (data: SystemData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};