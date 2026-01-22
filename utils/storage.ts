import { SystemData } from '../types';

const STORAGE_KEY = 'ekelab_data_v1';
/**
 * URL Google Apps Script Personal Pengguna.
 * Ini membolehkan sistem auto-sync ke akaun anda tanpa perlu tampal URL berkali-kali.
 */
const USER_CLOUD_URL = 'https://script.google.com/macros/s/AKfycbzBUzC1FZEkSyEiyPuuwQYhzY38Ipt3_wvLZhd9UvzBD9QTgl_Z7o0C0JEMV7oq2TWEvA/exec';

const createEmptyData = (): SystemData => ({
  teachers: [],
  students: [],
  committees: [],
  attendances: [],
  activities: [],
  annualPlans: [],
  settings: {
    sheetUrl: USER_CLOUD_URL, 
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
      // Jika URL dalam storage kosong atau lama, gantikan dengan URL personal terbaru
      if (parsed.settings && (!parsed.settings.sheetUrl || parsed.settings.sheetUrl.includes('AKfycbzB'))) {
        parsed.settings.sheetUrl = USER_CLOUD_URL;
      }
      return parsed;
    } catch (e) {
      return createEmptyData();
    }
  }
  return createEmptyData();
};

export const fetchDataFromCloud = async (url: string): Promise<SystemData | null> => {
  if (!url) return null;
  try {
    const syncUrl = `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
    
    const response = await fetch(syncUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    
    if (!response.ok) throw new Error("Cloud Down");
    
    const cloudData = await response.json();
    
    if (cloudData.status === "EMPTY") {
      console.log("Cloud sedia tetapi data masih kosong.");
      return null;
    }

    if (cloudData && (Array.isArray(cloudData.students) || cloudData.settings)) {
      return cloudData as SystemData;
    }
    return null;
  } catch (err) {
    console.error("Gagal tarik data dari cloud:", err);
    return null;
  }
};

export const saveData = async (data: SystemData) => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  
  if (data.settings?.sheetUrl) {
    try {
      await fetch(data.settings.sheetUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      console.log("Sync Berjaya.");
    } catch (err) {
      console.warn("Sync Gagal.");
    }
  }
};

export const testCloudConnection = async (url: string): Promise<boolean> => {
  if (!url || !url.startsWith('https://script.google.com')) return false;
  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ test: true })
    });
    return true; 
  } catch (err) {
    return false;
  }
};