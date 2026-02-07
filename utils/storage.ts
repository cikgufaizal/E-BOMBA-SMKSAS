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
 * Nota: Backend (code.gs) akan mencantumkan pecahan baris A1, A2, A3... secara automatik.
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
    
    // Elakkan error jika Google pulangkan HTML (Login required)
    if (rawText.trim().startsWith("<!DOCTYPE")) {
      console.error("ALAMAK: Google memulangkan HTML. Sila pastikan deployment 'Anyone'.");
      return null;
    }

    if (!rawText || rawText.trim() === "" || rawText === "null") {
      return createEmptyData();
    }

    try {
      const cloudData = JSON.parse(rawText);
      if (cloudData.status === "ERROR") {
        console.error("Cloud Error:", cloudData.message);
        return null;
      }
      if (cloudData.status === "NEW_SESSION") return createEmptyData();
      return cloudData as SystemData;
    } catch (parseError) {
      console.error("JSON Error: Kemungkinan data terpotong di Google Sheets. Sila gunakan kod .gs yang menyokong chunking.");
      return null;
    }
  } catch (err) {
    console.error("Fetch Error:", err);
    return null;
  }
};

/**
 * Menyimpan data ke Cloud.
 * Data dipecahkan kepada ketul-ketulan (Chunking) untuk melepasi had 50k aksara per sel.
 */
export const saveDataToCloud = async (data: SystemData): Promise<{success: boolean, message: string, size?: number}> => {
  if (!CLOUD_API_URL || CLOUD_API_URL.includes("YOUR_SCRIPT_URL")) {
    return { success: false, message: "URL API Tidak Sah." };
  }

  try {
    const dataToSend = { ...data, lastUpdated: Date.now() };
    const jsonString = JSON.stringify(dataToSend);
    const dataSize = jsonString.length;

    // Had maksima 1 Juta aksara (Sangat besar untuk sistem sekolah)
    if (dataSize > 990000) {
       return { 
         success: false, 
         message: `DATA TERLALU BESAR (${dataSize} chars). Sila buang gambar laporan yang lama.` 
       };
    }

    // Gunakan POST untuk menghantar data besar
    await fetch(CLOUD_API_URL, {
      method: 'POST',
      mode: 'no-cors', 
      headers: { 'Content-Type': 'text/plain' },
      body: jsonString
    });
    
    return { 
      success: true, 
      message: "Data berjaya dihantar ke Cloud. Sila tunggu 5 saat untuk pangkalan data dikemaskini.",
      size: dataSize
    };
  } catch (err) {
    return { success: false, message: "Ralat rangkaian semasa menyimpan ke Cloud." };
  }
};

export const loadData = () => createEmptyData();
export const saveData = (data: SystemData) => {}; 
