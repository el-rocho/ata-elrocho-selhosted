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
- **Filtro de Síndrome de Bata Blanca**: Opción para atenuar lecturas elevadas iniciales producidas por la ansiedad del momento (intervalos de 5, 10 o 15 minutos).
- **Informes PDF con Doble Eje Y**: Gráfico vectorial impreso con curva de tensión y línea de pulsaciones en el margen derecho.
- **Copias de Seguridad CSV**: Formato de archivo unificado (`tension_arterial_daily_AAAA-MM-DD_HH-MM-SS.csv`) con fecha y hora exacta.
- **Contenedorización Docker**: Listo para desplegar con un comando mediante Docker y Docker-Compose.

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
