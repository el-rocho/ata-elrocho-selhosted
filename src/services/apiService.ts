import type { BloodPressureReading, AppSettings } from '../types/bloodPressure';

const API_BASE = '/api';

export async function fetchReadingsAPI(): Promise<BloodPressureReading[]> {
  try {
    const res = await fetch(`${API_BASE}/readings`);
    if (!res.ok) throw new Error('Error de servidor al cargar lecturas');
    return await res.json();
  } catch (error) {
    console.warn('Servidor local no alcanzable, usando almacenamiento en caché local:', error);
    const cached = localStorage.getItem('server_bp_readings_cache');
    return cached ? JSON.parse(cached) : [];
  }
}

export async function addReadingAPI(reading: Omit<BloodPressureReading, 'id'>): Promise<BloodPressureReading> {
  const res = await fetch(`${API_BASE}/readings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reading),
  });
  if (!res.ok) throw new Error('Error al guardar lectura en el servidor');
  return await res.json();
}

export async function deleteReadingAPI(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/readings/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar lectura en el servidor');
}

export async function deleteSessionAPI(readingIds: string[]): Promise<void> {
  const res = await fetch(`${API_BASE}/sessions/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ readingIds }),
  });
  if (!res.ok) throw new Error('Error al eliminar sesión en el servidor');
}

export async function clearAllDataAPI(): Promise<void> {
  const res = await fetch(`${API_BASE}/readings/all/confirm`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar todos los datos en el servidor');
}

export async function resetDemoDataAPI(): Promise<BloodPressureReading[]> {
  const res = await fetch(`${API_BASE}/readings/reset-demo`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Error al restaurar datos demo en el servidor');
  return await res.json();
}

export async function importReadingsAPI(imported: Omit<BloodPressureReading, 'id'>[]): Promise<{ addedCount: number; readings: BloodPressureReading[] }> {
  const res = await fetch(`${API_BASE}/readings/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(imported),
  });
  if (!res.ok) throw new Error('Error al importar lecturas en el servidor');
  return await res.json();
}

export async function fetchSettingsAPI(): Promise<AppSettings> {
  try {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Error de servidor al cargar ajustes');
    return await res.json();
  } catch (error) {
    const cached = localStorage.getItem('server_bp_settings_cache');
    return cached ? JSON.parse(cached) : {
      enableWhiteCoatFilter: true,
      whiteCoatIntervalMinutes: 5,
      defaultArm: 'left',
      preferredInputMode: 'keyboard',
      patientName: '',
      patientSex: '',
      patientAge: '',
      backupFrequency: 'disabled',
      backupFolder: 'Descargas/Copias_Tension_Arterial',
    };
  }
}

export async function saveSettingsAPI(settings: AppSettings): Promise<AppSettings> {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error('Error al guardar ajustes en el servidor');
  return await res.json();
}
