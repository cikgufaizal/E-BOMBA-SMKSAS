
import { SystemData } from '../types';

const STORAGE_KEY = 'ekelab_data_v1';

export const loadData = (): SystemData => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse stored data", e);
    }
  }
  return {
    teachers: [],
    students: [],
    committees: [],
    attendances: [],
    activities: [],
    annualPlans: [],
    settings: {
      sheetUrl: '',
      autoSync: false
    }
  };
};

export const saveData = async (data: SystemData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  
  // Cloud Sync Logic
  if (data.settings?.sheetUrl && data.settings?.autoSync) {
    try {
      // Use no-cors for Google Apps Script to bypass pre-flight checks
      await fetch(data.settings.sheetUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      console.log("Cloud Sync Triggered");
    } catch (err) {
      console.error("Cloud Sync Network Error", err);
    }
  }
};

export const testCloudConnection = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true, students: [], teachers: [], committees: [], attendances: [], activities: [], annualPlans: [] })
    });
    return true; // If fetch doesn't throw, it's generally connected in no-cors mode
  } catch (err) {
    console.error("Connection test failed", err);
    return false;
  }
};
