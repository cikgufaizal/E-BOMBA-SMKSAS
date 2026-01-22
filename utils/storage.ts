import { SystemData } from '../types';

const STORAGE_KEY = 'ekelab_data_v1';

/**
 * ARAHAN UNTUK CIKGU:
 * -------------------
 * 1. Deploy kod 'code.gs' di Apps Script Google Sheet cikgu.
 * 2. Ambil URL Web App (pautan yang berakhir dengan '/exec').
 * 3. Gantikan pautan placeholder di bawah ini dengan URL tersebut.
 */
const MASTER_CLOUD_URL = 'SILA_GANTI_DENGAN_URL_WEB_APP_CIKGU';

const createEmptyData = (): SystemData => ({
  teachers: [],
  students: [],
  committees: [],
  attendances: [],
  activities: [],
  annualPlans: [],
  settings: {
    sheetUrl: MASTER_CLOUD_URL, 
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
      const parsed = JSON.parse(saved);
      // Sentiasa gunakan URL terkini jika ia telah ditetapkan oleh cikgu
      if (MASTER_CLOUD_URL && !MASTER_CLOUD_URL.includes('SILA_GANTI')) {
        if (!parsed.settings) parsed.settings = createEmptyData().settings;
        parsed.settings.sheetUrl = MASTER_CLOUD_URL;
      }
      return parsed;
    } catch (e) {
      return createEmptyData();
    }
  }

  return createEmptyData();
};

export const fetchDataFromCloud = async (url: string): Promise<SystemData | null> => {
  if (!url || url.includes('SILA_GANTI') || !url.startsWith('https://script.google.com')) return null;
  try {
    const response = await fetch(`${url}?t=${Date.now()}`, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store'
    });
    
    if (!response.ok) return null;

    const cloudData = await response.json();
    if (cloudData && (Array.isArray(cloudData.students) || Array.isArray(cloudData.teachers))) {
      return cloudData as SystemData;
    }
    return null;
  } catch (err) {
    console.error("Cloud fetch failed:", err);
    return null;
  }
};

export const saveData = async (data: SystemData): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  
  const url = data.settings?.sheetUrl || MASTER_CLOUD_URL;
  if (url && !url.includes('SILA_GANTI') && url.startsWith('https://script.google.com')) {
    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(data)
      });
      return true;
    } catch (err) {
      console.error("Save to cloud failed:", err);
      return false;
    }
  }
  return false;
};

export const testCloudConnection = async (url: string): Promise<boolean> => {
  if (!url || !url.startsWith('https://script.google.com')) return false;
  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ test: true })
    });
    return true; 
  } catch (err) {
    return false;
  }
};