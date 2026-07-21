import type { BloodPressureReading, ArmPosition } from '../types/bloodPressure';

/**
 * Procesa el contenido de texto de un archivo CSV y devuelve un array de lecturas normalizadas.
 */
export function parseCSVData(csvText: string): Omit<BloodPressureReading, 'id'>[] {
  if (!csvText || !csvText.trim()) return [];

  // Eliminar BOM de UTF-8 si estuviera presente
  const cleanText = csvText.replace(/^\uFEFF/, '');
  const lines = cleanText.split(/\r?\n/).filter((line) => line.trim() && !line.startsWith('#'));

  if (lines.length < 2) return [];

  // Detectar delimitador (; o ,)
  const firstLine = lines[0];
  const delimiter = firstLine.includes(';') ? ';' : ',';

  const headers = firstLine.split(delimiter).map((h) => h.trim().replace(/^"|"$/g, '').toLowerCase());

  // Encontrar índices de columnas
  const dateIdx = headers.findIndex((h) => h.includes('fecha') || h.includes('date'));
  const timeIdx = headers.findIndex((h) => h.includes('hora') || h.includes('time'));
  const sysIdx = headers.findIndex((h) => h.includes('sistolica') || h.includes('sys') || h.includes('maxima'));
  const diaIdx = headers.findIndex((h) => h.includes('diastolica') || h.includes('dia') || h.includes('minima'));
  const pulseIdx = headers.findIndex((h) => h.includes('pulsaciones') || h.includes('pulse') || h.includes('pulso') || h.includes('hr'));
  const armIdx = headers.findIndex((h) => h.includes('brazo') || h.includes('arm'));
  const notesIdx = headers.findIndex((h) => h.includes('nota') || h.includes('notes') || h.includes('observaciones'));

  if (sysIdx === -1 || diaIdx === -1) {
    return [];
  }

  const results: Omit<BloodPressureReading, 'id'>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split respetando comillas
    const cols = line.split(new RegExp(`${delimiter}(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)`)).map((c) => c.trim().replace(/^"|"$/g, ''));

    const sysVal = parseInt(cols[sysIdx], 10);
    const diaVal = parseInt(cols[diaIdx], 10);
    const pulseVal = pulseIdx !== -1 && cols[pulseIdx] ? parseInt(cols[pulseIdx], 10) : 70;

    if (isNaN(sysVal) || isNaN(diaVal)) continue;

    let timestampStr = new Date().toISOString();
    if (dateIdx !== -1 && cols[dateIdx]) {
      const datePart = cols[dateIdx];
      const timePart = timeIdx !== -1 && cols[timeIdx] ? cols[timeIdx] : '12:00';

      // Parsear fecha DD/MM/YYYY o YYYY-MM-DD
      const dateBits = datePart.split(/[-/.]/);
      let year = 2026, month = 1, day = 1;

      if (dateBits.length === 3) {
        if (dateBits[0].length === 4) {
          year = parseInt(dateBits[0], 10);
          month = parseInt(dateBits[1], 10);
          day = parseInt(dateBits[2], 10);
        } else {
          day = parseInt(dateBits[0], 10);
          month = parseInt(dateBits[1], 10);
          year = parseInt(dateBits[2], 10);
        }
      }

      const timeBits = timePart.split(':');
      const hours = timeBits[0] ? parseInt(timeBits[0], 10) : 12;
      const minutes = timeBits[1] ? parseInt(timeBits[1], 10) : 0;

      const parsedDate = new Date(year, month - 1, day, hours, minutes);
      if (!isNaN(parsedDate.getTime())) {
        timestampStr = parsedDate.toISOString();
      }
    }

    let armVal: ArmPosition = 'left';
    if (armIdx !== -1 && cols[armIdx]) {
      const armClean = cols[armIdx].toLowerCase();
      if (armClean.includes('der') || armClean.includes('right')) {
        armVal = 'right';
      }
    }

    const notesVal = notesIdx !== -1 && cols[notesIdx] ? cols[notesIdx] : undefined;

    results.push({
      timestamp: timestampStr,
      systolic: sysVal,
      diastolic: diaVal,
      heartRate: isNaN(pulseVal) ? 70 : pulseVal,
      arm: armVal,
      notes: notesVal,
    });
  }

  return results;
}
