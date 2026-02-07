import { SystemData } from '../types';
import { CLOUD_API_URL, SCHOOL_INFO } from '../constants';

/**
 * Struktur data kosong untuk permulaan sesi
 */
export const createEmptyData = (): SystemData => ({
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
 * Menarik data dari Cloud (Google Sheets)
 * Menggunakan cache: 'no-store' untuk memastikan data sentiasa segar
 */
export const fetchDataFromCloud = async (): Promise<SystemData | null> => {
  if (!CLOUD_API_URL) return null;
  
  try {
    const url = `${CLOUD_API_URL}?t=${Date.now()}`;
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store',
      redirect: 'follow',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) throw new Error("Gagal akses Cloud");

    const cloudData = await response.json();
    
    // Validasi struktur data yang diterima
    if (cloudData && typeof cloudData === 'object' && cloudData.status !== "ERROR") {
      return cloudData as SystemData;
    }
    return null;
  } catch (err) {
    console.error("Cloud Fetch Error:", err);
    return null;
  }
};

/**
 * Menyimpan data ke Cloud
 */
export const saveDataToCloud = async (data: SystemData): Promise<{success: boolean, message: string}> => {
  if (!CLOUD_API_URL) return { success: false, message: "URL API Tidak Sah" };

  try {
    const dataToSend = { ...data, lastUpdated: Date.now() };
    
    const response = await fetch(CLOUD_API_URL, {
      method: 'POST',
      mode: 'no-cors', // Penting untuk bypass CORS preflight pada Google Script
      cache: 'no-store',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(dataToSend)
    });
    
    return { success: true, message: "Data berjaya diselaraskan ke Google Sheets." };
  } catch (err) {
    console.error("Cloud Save Error:", err);
    return { success: false, message: "Ralat rangkaian. Sila cuba sebentar lagi." };
  }
};

// Fungsi placeholder untuk kekalkan kompatibiliti komponen lama jika perlu
export const loadData = () => createEmptyData();
export const saveData = (data: SystemData) => {}; // Tidak lagi simpan ke localStorage
