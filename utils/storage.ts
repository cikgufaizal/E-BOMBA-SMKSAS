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
 * Guna fetch paling ringkas untuk Google Script (Tanpa headers pelik).
 */
export const fetchDataFromCloud = async (): Promise<SystemData | null> => {
  if (!CLOUD_API_URL || CLOUD_API_URL.includes("YOUR_SCRIPT_URL")) return null;
  
  try {
    // Tambah timestamp unik untuk elak cache browser
    const response = await fetch(`${CLOUD_API_URL}?t=${Date.now()}`, {
      method: 'GET',
      redirect: 'follow'
    });

    if (!response.ok) throw new Error("HTTP Status: " + response.status);

    const data = await response.json();
    
    // Jika data memulangkan status ralat dari Apps Script
    if (data.status === "ERROR") {
      console.error("Backend Script Error:", data.message);
      return null;
    }
    
    return data as SystemData;
  } catch (err) {
    console.error("Ralat Rangkaian (Fetch Failure):", err);
    throw err;
  }
};

/**
 * Menyimpan data ke Cloud.
 */
export const saveDataToCloud = async (data: SystemData): Promise<{success: boolean, message: string}> => {
  if (!CLOUD_API_URL || CLOUD_API_URL.includes("YOUR_SCRIPT_URL")) {
    return { success: false, message: "URL API Tidak Sah." };
  }

  try {
    // Guna mode no-cors untuk POST pantas tanpa isu preflight
    await fetch(CLOUD_API_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(data)
    });
    
    return { success: true, message: "Berjaya! Data sedang dikemaskini dalam Spreadsheet." };
  } catch (err) {
    return { success: false, message: "Gagal menyimpan. Sila semak sambungan internet." };
  }
};

export const loadData = () => createEmptyData();
export const saveData = (data: SystemData) => {};
