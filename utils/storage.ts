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
 * Menggunakan redirect follow untuk mengendalikan redirection Google Script.
 */
export const fetchDataFromCloud = async (): Promise<SystemData | null> => {
  if (!CLOUD_API_URL || CLOUD_API_URL.includes("YOUR_SCRIPT_URL")) return null;
  
  try {
    const response = await fetch(CLOUD_API_URL, {
      method: 'GET',
      redirect: 'follow',
      cache: 'no-store'
    });

    if (!response.ok) throw new Error(`Ralat Server: ${response.status}`);

    const data = await response.json();
    if (data.status === "ERROR") throw new Error(data.message);
    
    return data as SystemData;
  } catch (err) {
    console.error("Fetch Error:", err);
    throw new Error("Gagal menghubungi pangkalan data. Sila pastikan Apps Script di-deploy sebagai 'Anyone'.");
  }
};

/**
 * Menyimpan data ke Cloud.
 * Gunakan Content-Type: text/plain untuk mengelakkan OPTIONS preflight request 
 * yang sering menyebabkan 'Failed to fetch' pada Google Apps Script.
 */
export const saveDataToCloud = async (data: SystemData): Promise<{success: boolean, message: string}> => {
  if (!CLOUD_API_URL || CLOUD_API_URL.includes("YOUR_SCRIPT_URL")) {
    return { success: false, message: "URL API Tidak Ditetapkan." };
  }

  try {
    // Kami menggunakan POST dengan body string dan mode cors. 
    // Jika masih gagal, code.gs akan memprosesnya sebagai text/plain.
    const response = await fetch(CLOUD_API_URL, {
      method: 'POST',
      body: JSON.stringify(data),
      mode: 'no-cors', // Mod ini menghantar data walaupun respons tidak dapat dibaca (opaque)
      headers: {
        'Content-Type': 'text/plain' 
      }
    });
    
    // Kerana no-cors, kita anggap berjaya jika tiada exception dilemparkan
    return { 
      success: true, 
      message: "Data sedang disinkronkan ke Google Sheets." 
    };
  } catch (err) {
    console.error("Save Error:", err);
    return { 
      success: false, 
      message: "Ralat rangkaian semasa menyimpan data." 
    };
  }
};

export const loadData = () => createEmptyData();
export const saveData = (data: SystemData) => {};