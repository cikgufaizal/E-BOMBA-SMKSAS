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
 * Menarik data dari Cloud dengan cantuman automatik di backend
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
      console.error("DEBUG: Google memulangkan HTML bukannya JSON. Sila semak deployment 'Anyone' access.");
      return null;
    }

    if (!rawText || rawText.trim() === "" || rawText === "null") {
      return createEmptyData();
    }

    try {
      const cloudData = JSON.parse(rawText);
      if (cloudData.status === "ERROR") {
        console.error("Cloud Error Message:", cloudData.message);
        return null;
      }
      if (cloudData.status === "NEW_SESSION") return createEmptyData();
      return cloudData as SystemData;
    } catch (parseError) {
      console.error("DEBUG: JSON Rosak walaupun chunking aktif. Sila semak log Google Script.");
      return null;
    }
  } catch (err) {
    console.error("Network Fetch Error:", err);
    return null;
  }
};

/**
 * Menyimpan data ke Cloud. 
 * Kini had ditingkatkan ke 500,000 aksara kerana backend menyokong multi-row.
 */
export const saveDataToCloud = async (data: SystemData): Promise<{success: boolean, message: string, size?: number}> => {
  if (!CLOUD_API_URL || CLOUD_API_URL.includes("YOUR_SCRIPT_URL")) {
    return { success: false, message: "URL API Tidak Sah." };
  }

  try {
    const dataToSend = { ...data, lastUpdated: Date.now() };
    const jsonString = JSON.stringify(dataToSend);
    const dataSize = jsonString.length;

    // Had baru: 500k aksara (Lebih dari cukup untuk ribuan ahli + gambar)
    if (dataSize > 495000) {
       return { 
         success: false, 
         message: `DATA TERLALU BESAR (${dataSize} chars). Sila buang gambar yang tidak perlu.` 
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
      message: "Data dihantar ke Google Sheets (Multi-Row Mode). Sila tunggu 5 saat sebelum refresh.",
      size: dataSize
    };
  } catch (err) {
    return { success: false, message: "Ralat rangkaian semasa menyimpan." };
  }
};

export const loadData = () => createEmptyData();
export const saveData = (data: SystemData) => {}; 
