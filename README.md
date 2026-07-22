# Servidor Centralizado de Registro de Tensión Arterial (Self-Hosted) 🩺

![Built with Vibe Coding](https://img.shields.io/badge/Built%20with-Vibe%20Coding%20%26%20AI-7c3aed?style=for-the-badge&logo=sparkles)
![Estado](https://img.shields.io/badge/Estado-v1.0.0--beta-orange?style=for-the-badge)

> ⚠️ **Nota de Versión:** Esta es una **primera versión en fase de pruebas (v1.0.0-beta)**. Está diseñada para sincronización en red local desde cualquier navegador o dispositivo (Windows, Linux, macOS, Android, iOS) y servidores domésticos.
>
> ✨ **Metodología de Desarrollo**: Este proyecto ha sido conceptualizado, diseñado y guiado mediante **Vibe Coding**, utilizando asistencia avanzada de Inteligencia Artificial para la generación de código, arquitectura y contenedorización Docker.

---

## 📋 Descripción

Aplicación web PWA auto-alojada **100% Multiplataforma** con servidor local **Node.js + Express + Base de Datos Centralizada**. Al ser una Web App Progresiva, funciona y se ejecuta sin problemas en **Windows, Linux, macOS, Android y iOS**. Permite sincronizar las mediciones de tensión arterial y pulsaciones en tiempo real entre múltiples dispositivos conectados a la misma red Wi-Fi doméstica o desde un servidor NAS / Raspberry Pi.

---

## ✨ Características Destacadas

- **Sincronización Multi-Dispositivo & Multiplataforma**: Acceso instantáneo desde tu PC Windows, Linux, Mac, móvil o tablet Android/iOS. Cualquier registro o cambio se actualiza automáticamente en la base de datos centralizada.
- **Ruleta Táctil & Teclado Numérico**: Selección rápida centrada automáticamente en la última medición realizada.
- **Filtro de Síndrome de Bata Blanca**: Opción para atenuar lecturas elevadas iniciales producidas por la ansiedad del momento (intervalos de 3, 5 o 10 minutos entre tomas consecutivas).
- **Informes PDF con Doble Eje Y**: Gráfico vectorial impreso con curva de tensión y línea de pulsaciones en el margen derecho.
- **Copias de Seguridad CSV**: Guardadas físicamente en la carpeta `data/backups/` del Servidor y opción de descarga directa.
- **Contenedorización Docker**: Listo para desplegar con un comando mediante Docker y Docker-Compose.

---

## 🛡️ Filtro de Síndrome de Bata Blanca (Algoritmo Médico)

El **Filtro de Síndrome de Bata Blanca** mitiga la distorsión generada por el sesgo de alerta o ansiedad inicial del paciente al colocarse el manguito de tensión.

### 🔬 Cómo funciona el algoritmo:
1. **Agrupación Consecutiva**: Se agrupan dentro de una misma sesión las tomas donde el intervalo entre una toma y la anterior sea menor al margen configurado (**3, 5 o 10 minutos**).
2. **Sesiones de 2 tomas**: Si la 1ª toma es significativamente superior a la 2ª ($\ge 8$ mmHg sistólica / $\ge 4$ mmHg diastólica), se descarta la 1ª toma reteniendo la 2ª. En caso contrario, se promedian ambas.
3. **Sesiones de 3 tomas**: Se descarta siempre la 1ª toma (por su bajo valor diagnóstico de aclimatación al manguito) y se calcula la media con las 2 tomas restantes.
4. **Sesiones de 4 o más tomas**: Se descarta la 1ª toma y se continúan descartando las siguientes tomas iniciales elevadas ($\ge 8$ mmHg sistólica / $\ge 4$ mmHg diastólica) respecto a la media de las restantes, siempre y cuando queden al menos 3 tomas válidas para calcular la media definitiva.

---

## 💾 Arquitectura de Almacenamiento: Base de Datos JSON (`database.json`)

El servidor utiliza una **base de datos plana centralizada basada en JSON (`database.json`)** diseñada a medida para entornos domésticos y familiares:

### 💡 Razones del diseño y ventajas:
- **Cero Dependencias Binarias (Zero-Config)**: No requiere motores de base de datos externos (SQLite, MySQL, PostgreSQL) ni paquetes nativos de C++. Esto garantiza compatibilidad 100% inmediata al desplegar en Docker en cualquier arquitectura (Raspberry Pi ARM32/ARM64, NAS x86_64, PC Windows/Linux).
- **Legibilidad y Transparencia**: El archivo `database.json` se almacena en texto plano legible en `./data/database.json` (vinculado al volumen persistente `/app/data` de Docker). Se puede abrir, inspeccionar o editar con cualquier editor de texto.
- **Portabilidad y Respaldos Inmediatos**: Hacer una copia de seguridad o migrar de servidor es tan sencillo como copiar el archivo `database.json`.
- **Sincronización en Tiempo Real**: Cualquier medición grabada o modificada desde un dispositivo se guarda instantáneamente y se refleja en el resto de móviles o tablets de la red local.

---

## 🚀 Instalación y Despliegue

### Opción 1: Con Docker Compose (Recomendado para NAS / Servidores)

1. Clona el repositorio:
   ```bash
   git clone https://github.com/el-rocho/ata-elrocho-selhosted.git
   cd ata-elrocho-selhosted
   ```
2. Levanta el contenedor:
   ```bash
   docker-compose up -d --build
   ```
3. La aplicación estará disponible en `http://<IP_DE_TU_SERVIDOR>:3000`. La base de datos persistente se guardará en la carpeta `./data`.

---

### Opción 2: Con Node.js

1. Instala las dependencias y compila:
   ```bash
   npm install
   npm run start
   ```
2. Accede desde tu navegador o tablet Android en tu red local: `http://<IP_DE_TU_SERVIDOR>:3000`.

---

## 🔒 Privacidad y RGPD

Todos los datos permanecen 100% dentro de tu propia red local. No requiere servicios externos en la nube ni conexión a servidores de terceros.
