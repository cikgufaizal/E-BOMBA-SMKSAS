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
 * Guna fetch paling ringkas untuk elakkan ralat CORS.
 */
export const fetchDataFromCloud = async (): Promise<SystemData | null> => {
  if (!CLOUD_API_URL || CLOUD_API_URL.includes("YOUR_SCRIPT_URL")) return null;
  
  try {
    const response = await fetch(`${CLOUD_API_URL}?t=${Date.now()}`, {
      method: 'GET',
      redirect: 'follow', // Wajib untuk Google Apps Script
    });

    if (!response.ok) return null;

    const rawText = await response.text();
    
    // Elakkan ralat jika Google minta login (Sebab Deployment tak set kepada "Anyone")
    if (rawText.includes("<!DOCTYPE") || rawText.includes("google-login")) {
      console.error("ALAMAK: Google minta Login. Sila set Deployment 'Who has access' kepada 'Anyone'.");
      return null;
    }

    if (!rawText || rawText.trim() === "" || rawText === "null") {
      return createEmptyData();
    }

    const cloudData = JSON.parse(rawText);
    if (cloudData.status === "ERROR") return null;
    if (cloudData.status === "NEW_SESSION") return createEmptyData();
    
    return cloudData as SystemData;
  } catch (err) {
    console.error("Fetch Failure:", err);
    return null;
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
    const jsonString = JSON.stringify({ ...data, lastUpdated: Date.now() });
    
    // Guna mode no-cors untuk bypass ralat preflight (OPTIONS)
    await fetch(CLOUD_API_URL, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      body: jsonString
    });
    
    return { success: true, message: "Data dihantar ke Cloud. Sila tunggu 5 saat untuk kemaskini." };
  } catch (err) {
    return { success: false, message: "Gagal menyimpan. Sila semak internet." };
  }
};

export const loadData = () => createEmptyData();
export const saveData = (data: SystemData) => {};
