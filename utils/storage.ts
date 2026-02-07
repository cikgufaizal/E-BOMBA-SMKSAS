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
 * Memastikan data yang diterima dari Cloud mempunyai struktur yang betul.
 * Menghalang ralat "Cannot read properties of undefined (reading 'length')"
 */
const sanitizeData = (raw: any): SystemData => {
  const base = createEmptyData();
  if (!raw || typeof raw !== 'object') return base;

  return {
    ...base,
    ...raw,
    // Pastikan semua array kritikal wujud
    teachers: Array.isArray(raw.teachers) ? raw.teachers : [],
    students: Array.isArray(raw.students) ? raw.students : [],
    committees: Array.isArray(raw.committees) ? raw.committees : [],
    attendances: Array.isArray(raw.attendances) ? raw.attendances : [],
    activities: Array.isArray(raw.activities) ? raw.activities : [],
    annualPlans: Array.isArray(raw.annualPlans) ? raw.annualPlans : [],
    settings: raw.settings ? { ...base.settings, ...raw.settings } : base.settings,
    lastUpdated: raw.lastUpdated || Date.now()
  };
};

export const fetchDataFromCloud = async (): Promise<SystemData | null> => {
  if (!CLOUD_API_URL) return null;
  
  try {
    const cacheBuster = `t=${Date.now()}`;
    const url = CLOUD_API_URL.includes('?') 
      ? `${CLOUD_API_URL}&${cacheBuster}` 
      : `${CLOUD_API_URL}?${cacheBuster}`;

    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      cache: 'no-store'
    });

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    
    const rawData = await response.json();
    return sanitizeData(rawData);
  } catch (err) {
    console.error("Cloud Fetch Critical Error:", err);
    return null;
  }
};

export const saveDataToCloud = async (data: SystemData): Promise<{success: boolean, message: string}> => {
  if (!CLOUD_API_URL) return { success: false, message: "URL API Tidak Ditetapkan." };

  try {
    const payload = JSON.stringify(data);
    
    // Gunakan POST dengan headers yang betul untuk GAS
    const response = await fetch(CLOUD_API_URL, {
      method: 'POST',
      mode: 'cors', 
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: payload
    });
    
    const result = await response.text();
    
    // Google Apps Script kadangkala tidak hantar "SUCCESS" string yang tepat disebabkan redirect
    if (result.includes("SUCCESS") || response.ok) {
      return { success: true, message: "Data berjaya dikemaskini ke Cloud!" };
    }
    
    throw new Error(result || "Unknown Error");

  } catch (err) {
    console.warn("Retrying with background mode (CORS)...");
    
    try {
      // Fallback mode: no-cors (tidak boleh baca response tapi data tetap sampai)
      await fetch(CLOUD_API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(data)
      });
      return { success: true, message: "Data dihantar ke Cloud. (Sila refresh dalam 2-3 saat)" };
    } catch (e) {
      return { success: false, message: "Gagal menyimpan data. Sila periksa sambungan internet." };
    }
  }
};

export const loadData = () => createEmptyData();
export const saveData = (data: SystemData) => {};