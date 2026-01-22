import { SystemData } from '../types';

const STORAGE_KEY = 'ekelab_data_v1';

/**
 * ARAHAN UNTUK CIKGU:
 * Selepas cikgu Deploy Google Apps Script baru, 
 * copy pautan Web App tersebut dan ganti di bawah.
 */
const MASTER_CLOUD_URL = 'https://script.google.com/macros/s/AKfycbzBUzC1FZEkSyEiyPuuwQYhzY38Ipt3_wvLZhd9UvzBD9QTgl_Z7o0C0JEMV7oq2TWEvA/exec';

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
      // Sentiasa paksa guna MASTER_CLOUD_URL yang terkini
      parsed.settings = { 
        ...createEmptyData().settings, 
        ...parsed.settings,
        sheetUrl: MASTER_CLOUD_URL 
      };
      return parsed;
    } catch (e) {
      return createEmptyData();
    }
  }

  return createEmptyData();
};

export const fetchDataFromCloud = async (url: string): Promise<SystemData | null> => {
  if (!url || !url.startsWith('https://script.google.com')) return null;
  try {
    const response = await fetch(`${url}?t=${Date.now()}`, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store'
    });
    
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return null;
    }

    const cloudData = await response.json();
    if (cloudData && (Array.isArray(cloudData.students) || Array.isArray(cloudData.teachers))) {
      cloudData.settings = { ...cloudData.settings, sheetUrl: MASTER_CLOUD_URL };
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
  
  const dataToSave = {
    ...data,
    settings: { ...data.settings, sheetUrl: MASTER_CLOUD_URL }
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  
  if (MASTER_CLOUD_URL) {
    try {
      await fetch(MASTER_CLOUD_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(dataToSave)
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