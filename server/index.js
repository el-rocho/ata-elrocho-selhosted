import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Ruta de almacenamiento de la base de datos centralizada
const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DEFAULT_SETTINGS = {
  enableWhiteCoatFilter: false, // Por defecto DESACTIVADO
  whiteCoatIntervalMinutes: 5,
  defaultArm: 'left',
  preferredInputMode: 'keyboard',
  patientName: '',
  patientSex: '',
  patientAge: '',
  backupFrequency: 'disabled',
  backupFolder: 'Descargas/Copias_Tension_Arterial',
  lastBackupTimestamp: null,
};

const INITIAL_DEMO_READINGS = [
  {
    id: 'demo-103',
    timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    systolic: 142,
    diastolic: 91,
    heartRate: 88,
    arm: 'left',
    notes: 'Tomas continuas en reposo (1ª lectura algo nerviosa)',
  },
  {
    id: 'demo-102',
    timestamp: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
    systolic: 128,
    diastolic: 83,
    heartRate: 76,
    arm: 'left',
  },
  {
    id: 'demo-101',
    timestamp: new Date(Date.now() - 1000 * 60 * 46).toISOString(),
    systolic: 121,
    diastolic: 79,
    heartRate: 72,
    arm: 'left',
  },
  {
    id: 'demo-5',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    systolic: 124,
    diastolic: 81,
    heartRate: 70,
    arm: 'left',
    notes: 'Mañana en ayunas',
  },
  {
    id: 'demo-4',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    systolic: 132,
    diastolic: 86,
    heartRate: 75,
    arm: 'left',
    notes: 'Tras caminata ligera',
  },
  {
    id: 'demo-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    systolic: 118,
    diastolic: 77,
    heartRate: 68,
    arm: 'right',
  },
  {
    id: 'demo-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    systolic: 138,
    diastolic: 89,
    heartRate: 81,
    arm: 'left',
    notes: 'Día de trabajo intenso',
  },
  {
    id: 'demo-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    systolic: 122,
    diastolic: 80,
    heartRate: 71,
    arm: 'left',
  },
];

function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = { readings: INITIAL_DEMO_READINGS, settings: DEFAULT_SETTINGS };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error al leer base de datos JSON:', error);
    return { readings: INITIAL_DEMO_READINGS, settings: DEFAULT_SETTINGS };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error al guardar en base de datos JSON:', error);
  }
}

app.get('/api/readings', (req, res) => {
  const db = readDB();
  const sorted = [...db.readings].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  res.json(sorted);
});

app.post('/api/readings', (req, res) => {
  const { systolic, diastolic, heartRate, arm, notes } = req.body;
  if (!systolic || !diastolic || !heartRate) {
    return res.status(400).json({ error: 'Faltan parámetros obligatorios' });
  }

  const db = readDB();
  const newReading = {
    id: `bp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    systolic: Number(systolic),
    diastolic: Number(diastolic),
    heartRate: Number(heartRate),
    arm: arm || 'left',
    notes: notes ? String(notes).trim() : undefined,
  };

  db.readings.unshift(newReading);
  writeDB(db);
  res.status(201).json(newReading);
});

app.delete('/api/readings/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  db.readings = db.readings.filter((r) => r.id !== id);
  writeDB(db);
  res.json({ success: true, count: db.readings.length });
});

app.post('/api/sessions/delete', (req, res) => {
  const { readingIds } = req.body;
  if (!Array.isArray(readingIds)) {
    return res.status(400).json({ error: 'readingIds debe ser un array' });
  }
  const idsToDelete = new Set(readingIds);
  const db = readDB();
  db.readings = db.readings.filter((r) => !idsToDelete.has(r.id));
  writeDB(db);
  res.json({ success: true, count: db.readings.length });
});

app.delete('/api/readings/all/confirm', (req, res) => {
  const db = readDB();
  db.readings = [];
  writeDB(db);
  res.json({ success: true, count: 0 });
});

app.post('/api/readings/reset-demo', (req, res) => {
  const db = readDB();
  db.readings = INITIAL_DEMO_READINGS;
  writeDB(db);
  res.json(db.readings);
});

app.post('/api/readings/import', (req, res) => {
  const importedItems = req.body;
  if (!Array.isArray(importedItems)) {
    return res.status(400).json({ error: 'Formato inválido para importación' });
  }

  const db = readDB();
  const existingSigs = new Set(
    db.readings.map((r) => `${new Date(r.timestamp).toISOString().slice(0, 16)}_${r.systolic}_${r.diastolic}_${r.heartRate}`)
  );

  let addedCount = 0;
  const newItems = [];

  importedItems.forEach((item) => {
    const sig = `${new Date(item.timestamp).toISOString().slice(0, 16)}_${item.systolic}_${item.diastolic}_${item.heartRate}`;
    if (!existingSigs.has(sig)) {
      existingSigs.add(sig);
      addedCount++;
      newItems.push({
        ...item,
        id: `imp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      });
    }
  });

  db.readings = [...newItems, ...db.readings];
  writeDB(db);

  res.json({ addedCount, total: db.readings.length, readings: db.readings });
});

app.get('/api/settings', (req, res) => {
  const db = readDB();
  res.json(db.settings || DEFAULT_SETTINGS);
});

app.post('/api/settings', (req, res) => {
  const newSettings = req.body;
  const db = readDB();
  db.settings = { ...DEFAULT_SETTINGS, ...newSettings };
  writeDB(db);
  res.json(db.settings);
});

const DIST_DIR = path.join(__dirname, '../dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🩺 Servidor Centralizado de Tensión Arterial Iniciado`);
  console.log(`🌐 Acceso Local: http://localhost:${PORT}`);
  console.log(`📱 Acceso desde Tablets/Móviles Android en tu red Wi-Fi:`);
  console.log(`   http://<IP_DE_TU_SERVIDOR>:${PORT}`);
  console.log(`=======================================================`);
});
