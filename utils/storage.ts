import { SystemData } from '../types';

const STORAGE_KEY = 'ekelab_data_v1';

const createEmptyData = (): SystemData => ({
  teachers: [],
  students: [],
  committees: [],
  attendances: [],
  activities: [],
  annualPlans: [],
  settings: {
    sheetUrl: '',
    autoSync: false,
    schoolName: '',
    clubName: '',
    address: '',
    logoUrl: ''
  }
});

export const loadData = (): SystemData => {
  if (typeof window === 'undefined') return createEmptyData();
  
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
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
    
    // Jika respon dari v3.3 menyatakan sheet masih kosong
    if (cloudData.status === "EMPTY") {
      console.log("Cloud sedia tetapi data masih kosong. Memerlukan 'Save' pertama.");
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
      console.warn("Sync Gagal (Offline/CORS).");
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