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

/**
 * Memuatkan data dari Local Storage (Cache Cepat)
 */
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

/**
 * Menarik data dari Cloud (Source of Truth)
 */
export const fetchDataFromCloud = async (): Promise<SystemData | null> => {
  if (!CLOUD_API_URL) return null;
  
  try {
    // Tambah timestamp unik untuk memaksa Google & Browser memberikan data TERBARU
    const url = `${CLOUD_API_URL}?t=${Date.now()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store',
      redirect: 'follow', // Penting: Google Apps Script melakukan redirect ke URL baru
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      console.error(`Sync Error: HTTP ${response.status}`);
      return null;
    }

    // Elakkan crash jika Cloud memulangkan HTML (cth: halaman login Google yang disekat)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      console.warn("Handshake Blocked: Sila benarkan cookies pada browser anda.");
      return null;
    }

    const cloudData = await response.json();
    
    // Pastikan data yang diterima adalah objek yang sah
    if (cloudData && typeof cloudData === 'object' && cloudData.status !== "ERROR") {
      return cloudData as SystemData;
    }
    
    return null;
  } catch (err) {
    console.error("Critical Cloud Fetch Failure:", err);
    return null;
  }
};

/**
 * Menyimpan data ke Cloud dan Local
 */
export const saveDataToCloud = async (data: SystemData): Promise<{success: boolean, message: string}> => {
  if (!CLOUD_API_URL) return { success: false, message: "URL API Tidak Sah" };

  try {
    const dataToSend = { ...data, lastUpdated: Date.now() };
    
    // Simpan ke Local dahulu supaya UX nampak pantas
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSend));

    // Kirim ke Google Apps Script
    // Menggunakan no-cors untuk memintas isu preflight OPTIONS yang sering gagal di sesetengah browser
    await fetch(CLOUD_API_URL, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-store',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(dataToSend)
    });
    
    return { success: true, message: "Data berjaya dihantar ke Cloud." };
  } catch (err) {
    console.error("Save to Cloud Error:", err);
    return { success: false, message: "Ralat Cloud. Data hanya disimpan secara lokal." };
  }
};

export const saveData = (data: SystemData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};