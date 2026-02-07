
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
 * Menarik data dari Cloud dengan perlindungan cache yang lebih ketat.
 */
export const fetchDataFromCloud = async (): Promise<SystemData | null> => {
  if (!CLOUD_API_URL || CLOUD_API_URL.includes("YOUR_SCRIPT_URL")) {
    console.error("URL API tidak sah.");
    return null;
  }
  
  try {
    // Gunakan timestamp yang unik untuk mengelakkan cache browser/cloud
    const url = `${CLOUD_API_URL}?t=${new Date().getTime()}`;
    console.log("Mencuba tarik data dari:", url);
    
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store',
      redirect: 'follow',
      headers: { 
        'Accept': 'application/json',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      console.error(`Ralat Server Google: ${response.status}`);
      return null;
    }

    const rawText = await response.text();
    console.log("Respons diterima. Panjang karakter:", rawText.length);
    
    if (rawText.trim().startsWith("<!DOCTYPE")) {
      console.error("ALAMAK: Google memulangkan HTML (Login Page). Pastikan 'Who has access' diset kepada 'Anyone'.");
      return null;
    }

    if (!rawText || rawText.trim() === "" || rawText === "null" || rawText === "[]") {
      console.log("Info: Pangkalan data kosong di Google Sheets.");
      return createEmptyData();
    }

    try {
      const cloudData = JSON.parse(rawText);
      
      // Jika backend memulangkan status error
      if (cloudData.status === "ERROR") {
        console.error("Cloud Error:", cloudData.message);
        return null;
      }

      // Jika session baru (pangkalan data baru dicipta)
      if (cloudData.status === "NEW_SESSION") {
        console.log("Memulakan sesi pangkalan data baru.");
        return createEmptyData();
      }

      // Pastikan objek mempunyai struktur asas yang betul
      if (!cloudData.students || !cloudData.teachers) {
        console.warn("Struktur data tidak lengkap, kemungkinan data terpotong.");
        return null;
      }
      
      return cloudData as SystemData;
    } catch (parseError) {
      console.error("JSON Rosak. Kemungkinan data terpotong di Google Sheets (>50k char).", parseError);
      return null;
    }
  } catch (err) {
    console.error("Ralat Rangkaian:", err);
    return null;
  }
};

/**
 * Menyimpan data ke Cloud.
 */
export const saveDataToCloud = async (data: SystemData): Promise<{success: boolean, message: string, size?: number}> => {
  if (!CLOUD_API_URL || CLOUD_API_URL.includes("YOUR_SCRIPT_URL")) {
    return { success: false, message: "URL API Tidak Sah." };
  }

  try {
    const dataToSend = { ...data, lastUpdated: Date.now() };
    const jsonString = JSON.stringify(dataToSend);
    const dataSize = jsonString.length;

    if (dataSize > 990000) {
       return { success: false, message: `DATA TERLALU BESAR (${dataSize} chars).` };
    }

    await fetch(CLOUD_API_URL, {
      method: 'POST',
      mode: 'no-cors', 
      headers: { 'Content-Type': 'text/plain' },
      body: jsonString
    });
    
    return { 
      success: true, 
      message: "Data berjaya dihantar ke Cloud!",
      size: dataSize
    };
  } catch (err) {
    console.error("Save Error:", err);
    return { success: false, message: "Ralat rangkaian semasa menyimpan." };
  }
};

export const loadData = () => createEmptyData();
export const saveData = (data: SystemData) => {};
