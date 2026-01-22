import { SystemData } from '../types';

const STORAGE_KEY = 'ekelab_data_v1';
const DEFAULT_CLOUD_URL = ''; // Masukkan URL Google Apps Script di sini

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

export const loadData = (): SystemData => {
  if (typeof window === 'undefined') return createEmptyData();
  
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

  if (DEFAULT_CLOUD_URL && (!data.settings?.sheetUrl)) {
    data.settings = {
      sheetUrl: DEFAULT_CLOUD_URL,
      autoSync: true,
      lastSync: data.settings?.lastSync
    };
  }

  return data;
};

export const saveData = async (data: SystemData) => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  
  if (data.settings?.sheetUrl && data.settings?.autoSync) {
    try {
      await fetch(data.settings.sheetUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.warn("Cloud Sync Network Error - Data saved locally only.");
    }
  }
};

export const testCloudConnection = async (url: string): Promise<boolean> => {
  if (!url) return false;
  try {
    const response = await fetch(url, {
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