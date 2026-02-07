import { SystemData } from '../types';
import { CLOUD_API_URL, SCHOOL_INFO } from '../constants';

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
 * Menarik data dari Cloud.
 * Menggunakan konfigurasi paling asas untuk mengelakkan isu preflight CORS.
 */
export const fetchDataFromCloud = async (): Promise<SystemData | null> => {
  if (!CLOUD_API_URL || CLOUD_API_URL.includes("YOUR_SCRIPT_URL")) return null;
  
  try {
    const response = await fetch(CLOUD_API_URL, {
      method: 'GET',
      mode: 'cors', // Google Script menyokong CORS jika di-deploy dengan betul
      redirect: 'follow',
      cache: 'no-store'
    });

    if (!response.ok) throw new Error(`Server memulangkan kod: ${response.status}`);

    const data = await response.json();
    if (data.status === "ERROR") throw new Error(data.message);
    
    return data as SystemData;
  } catch (err) {
    console.warn("Gagal menghubungi API Cloud. Menggunakan mod fail-safe.");
    throw err;
  }
};

/**
 * Menyimpan data ke Cloud.
 * Mod 'no-cors' digunakan untuk memastikan data dihantar tanpa sekatan browser,
 * walaupun respons tidak dapat dibaca secara langsung.
 */
export const saveDataToCloud = async (data: SystemData): Promise<{success: boolean, message: string}> => {
  if (!CLOUD_API_URL || CLOUD_API_URL.includes("YOUR_SCRIPT_URL")) {
    return { success: false, message: "URL API Tidak Ditetapkan." };
  }

  try {
    await fetch(CLOUD_API_URL, {
      method: 'POST',
      mode: 'no-cors', // Memintas isu CORS preflight untuk penghantaran data
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'text/plain', // Gunakan text/plain untuk mengelakkan preflight
      }
    });
    
    return { 
      success: true, 
      message: "Data telah dihantar ke Cloud. Sila semak Google Sheet anda dalam beberapa saat." 
    };
  } catch (err) {
    return { 
      success: false, 
      message: "Gagal menghantar data. Sila semak sambungan internet anda." 
    };
  }
};

export const loadData = () => createEmptyData();
export const saveData = (data: SystemData) => {};
