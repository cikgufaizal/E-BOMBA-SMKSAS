
import { SystemData } from '../types';

const STORAGE_KEY = 'ekelab_data_v1';

/**
 * TIPS: Masukkan URL Google Web App (Apps Script) anda di sini 
 * supaya semua guru yang buka web ini terus terhubung ke 
 * pangkalan data yang sama tanpa perlu setting manual.
 */
const DEFAULT_CLOUD_URL = ''; // PASTE URL /exec ANDA DI SINI

export const loadData = (): SystemData => {
  const saved = localStorage.getItem(STORAGE_KEY);
  let data: SystemData;

  if (saved) {
    try {
      data = JSON.parse(saved);
    } catch (e) {
      data = createEmptyData();
    }
  } else {
    data = createEmptyData();
  }

  // Jika ada URL hardcoded dan user belum ada setting, paksa guna hardcoded
  if (DEFAULT_CLOUD_URL && (!data.settings?.sheetUrl)) {
    data.settings = {
      sheetUrl: DEFAULT_CLOUD_URL,
      autoSync: true,
      lastSync: data.settings?.lastSync
    };
  }

  return data;
};

const createEmptyData = (): SystemData => ({
  teachers: [],
  students: [],
  committees: [],
  attendances: [],
  activities: [],
  annualPlans: [],
  settings: {
    sheetUrl: DEFAULT_CLOUD_URL || '',
    autoSync: !!DEFAULT_CLOUD_URL
  }
});

export const saveData = async (data: SystemData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  
  // Cloud Sync Logic
  if (data.settings?.sheetUrl && data.settings?.autoSync) {
    try {
      await fetch(data.settings.sheetUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      console.log("Cloud Sync Triggered");
    } catch (err) {
      console.error("Cloud Sync Network Error", err);
    }
  }
};

export const testCloudConnection = async (url: string): Promise<boolean> => {
  if (!url) return false;
  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true })
    });
    return true;
  } catch (err) {
    return false;
  }
};
