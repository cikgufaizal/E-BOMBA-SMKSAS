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
 * Backend (code.gs) akan mencantumkan baris A1, A2, A3... secara automatik.
 */
export const fetchDataFromCloud = async (): Promise<SystemData | null> => {
  if (!CLOUD_API_URL || CLOUD_API_URL.includes("YOUR_SCRIPT_URL")) {
    console.error("URL API tidak sah.");
    return null;
  }
  
  try {
    const url = `${CLOUD_API_URL}?t=${Date.now()}`;
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store',
      redirect: 'follow',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) throw new Error(`Google Server Error: ${response.status}`);

    const rawText = await response.text();
    
    if (rawText.trim().startsWith("<!DOCTYPE")) {
      console.error("Sila pastikan Deployment Google Script diset kepada 'Anyone'.");
      return null;
    }

    if (!rawText || rawText.trim() === "" || rawText === "null") {
      return createEmptyData();
    }

    try {
      const cloudData = JSON.parse(rawText);
      if (cloudData.status === "ERROR") return null;
      if (cloudData.status === "NEW_SESSION") return createEmptyData();
      return cloudData as SystemData;
    } catch (parseError) {
      console.error("JSON Rosak. Backend mungkin gagal mencantumkan baris dengan betul.");
      return null;
    }
  } catch (err) {
    console.error("Fetch Error:", err);
    return null;
  }
};

/**
 * Menyimpan data ke Cloud.
 * Backend akan memecahkan JSON ini kepada beberapa baris (Chunking).
 */
export const saveDataToCloud = async (data: SystemData): Promise<{success: boolean, message: string, size?: number}> => {
  if (!CLOUD_API_URL || CLOUD_API_URL.includes("YOUR_SCRIPT_URL")) {
    return { success: false, message: "URL API Tidak Sah." };
  }

  try {
    const dataToSend = { ...data, lastUpdated: Date.now() };
    const jsonString = JSON.stringify(dataToSend);
    const dataSize = jsonString.length;

    // Had baru dinaikkan ke 1 Juta aksara (Multi-Row Support)
    if (dataSize > 990000) {
       return { 
         success: false, 
         message: `DATA TERLALU BESAR (${dataSize} chars). Had maksima 1MB.` 
       };
    }

    await fetch(CLOUD_API_URL, {
      method: 'POST',
      mode: 'no-cors', 
      headers: { 'Content-Type': 'text/plain' },
      body: jsonString
    });
    
    return { 
      success: true, 
      message: "Data dihantar berjaya (Chunking Mode Active).",
      size: dataSize
    };
  } catch (err) {
    return { success: false, message: "Ralat rangkaian semasa menyimpan." };
  }
};

export const loadData = () => createEmptyData();
export const saveData = (data: SystemData) => {}; 
