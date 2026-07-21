# Servidor Centralizado de Registro de Tensión Arterial (Multi-Dispositivo) 🩺

Aplicación web PWA auto-alojada con servidor local Node.js + Express centralizado. Permite sincronizar las mediciones de tensión arterial y pulsaciones en tiempo real entre múltiples dispositivos Android (tablets, móviles) conectados a la misma red Wi-Fi de tu casa o servidor NAS/Raspberry Pi.

---

## 🚀 Características Principales

- **Multi-Dispositivo Sincronizado**: Cualquier registro o cambio de configuración desde tu tablet Android se refleja automáticamente en tus otros dispositivos.
- **Ruleta Táctil & Teclado Numérico**: Introducción ultrarrápida centrada automáticamente en la última medición realizada.
- **Filtro de Síndrome de Bata Blanca**: Atenuación inteligente de ansiedad inicial en intervalos de 5, 10 o 15 minutos.
- **Informes PDF con Doble Eje Y**: Gráfico vectorial impreso con curva de tensión y línea punteada de pulsaciones en el margen derecho.
- **Exportación e Importación CSV**: Copias de seguridad automáticas y restauración sin duplicados.
- **Despliegue con Docker / Docker-Compose**: Ideal para alojar en un servidor local, Synology NAS, Unraid o Raspberry Pi.

---

## 🛠️ Cómo Ejecutar en Local

### Opción 1: Con Node.js

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Compila el frontend e inicia el servidor central:
   ```bash
   npm run start
   ```
3. Abre en tu navegador de cualquier dispositivo Android conectado a tu Wi-Fi:
   `http://<IP_DE_TU_SERVIDOR>:3000`

### Opción 2: Con Docker Compose (Recomendado para NAS / Servidores)

1. En la carpeta raíz del proyecto, ejecuta:
   ```bash
   docker-compose up -d --build
   ```
2. La base de datos centralizada se guardará de forma persistente en la carpeta `./data`.
