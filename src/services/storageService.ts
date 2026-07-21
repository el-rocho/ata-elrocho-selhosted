import type { BloodPressureReading, AppSettings } from '../types/bloodPressure';
import {
  fetchReadingsAPI,
  addReadingAPI,
  deleteReadingAPI,
  deleteSessionAPI,
  clearAllDataAPI,
  resetDemoDataAPI,
  importReadingsAPI,
  fetchSettingsAPI,
  saveSettingsAPI,
} from './apiService';

export const DEFAULT_SETTINGS: AppSettings = {
  enableWhiteCoatFilter: false, // Por defecto DESACTIVADO
  whiteCoatIntervalMinutes: 5,
  defaultArm: 'left',
  preferredInputMode: 'keyboard',
  patientName: '',
  patientSex: '',
  patientAge: '',
  backupFrequency: 'disabled',
  backupFolder: 'Descargas/Copias_Tension_Arterial',
  lastBackupTimestamp: undefined,
};

export async function getStoredReadings(): Promise<BloodPressureReading[]> {
  const readings = await fetchReadingsAPI();
  localStorage.setItem('server_bp_readings_cache', JSON.stringify(readings));
  return readings;
}

export async function saveStoredReadings(_readings: BloodPressureReading[]): Promise<void> {
  // En servidor multi-dispositivo, los datos se guardan vía API
}

export async function clearAllStoredData(): Promise<void> {
  await clearAllDataAPI();
  localStorage.removeItem('server_bp_readings_cache');
}

export async function getStoredSettings(): Promise<AppSettings> {
  const settings = await fetchSettingsAPI();
  localStorage.setItem('server_bp_settings_cache', JSON.stringify(settings));
  return settings;
}

export async function saveStoredSettings(settings: AppSettings): Promise<void> {
  const saved = await saveSettingsAPI(settings);
  localStorage.setItem('server_bp_settings_cache', JSON.stringify(saved));
}

export async function addReadingToStorage(newReading: Omit<BloodPressureReading, 'id'>): Promise<BloodPressureReading> {
  return await addReadingAPI(newReading);
}

export async function deleteReadingFromStorage(id: string): Promise<BloodPressureReading[]> {
  await deleteReadingAPI(id);
  return await getStoredReadings();
}

export async function deleteSessionFromStorage(readingsInSession: BloodPressureReading[]): Promise<BloodPressureReading[]> {
  const ids = readingsInSession.map((r) => r.id);
  await deleteSessionAPI(ids);
  return await getStoredReadings();
}

export async function importReadingsIntoStorage(imported: Omit<BloodPressureReading, 'id'>[]): Promise<{
  updated: BloodPressureReading[];
  addedCount: number;
}> {
  const result = await importReadingsAPI(imported);
  return { updated: result.readings, addedCount: result.addedCount };
}

export async function resetDemoDataStorage(): Promise<BloodPressureReading[]> {
  return await resetDemoDataAPI();
}
