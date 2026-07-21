# Servidor Centralizado de Registro de Tensión Arterial (Self-Hosted) 🩺

![Built with Vibe Coding](https://img.shields.io/badge/Built%20with-Vibe%20Coding%20%26%20AI-7c3aed?style=for-the-badge&logo=sparkles)
![Estado](https://img.shields.io/badge/Estado-v1.0.0--beta-orange?style=for-the-badge)

> ⚠️ **Nota de Versión:** Esta es una **primera versión en fase de pruebas (v1.0.0-beta)**. Está diseñada para probar la sincronización en red local desde múltiples dispositivos Android y servidores domésticos.
>
> ✨ **Metodología de Desarrollo**: Este proyecto ha sido conceptualizado, diseñado y guiado mediante **Vibe Coding**, utilizando asistencia avanzada de Inteligencia Artificial para la generación de código, arquitectura y contenedorización Docker.

---

## 📋 Descripción

Aplicación web PWA auto-alojada con servidor local **Node.js + Express + Base de Datos Centralizada**. Permite sincronizar las mediciones de tensión arterial y pulsaciones en tiempo real entre múltiples dispositivos Android (tablets, móviles) conectados a la misma red Wi-Fi de tu casa o desde un servidor NAS/Raspberry Pi.

---

## ✨ Características Destacadas

- **Sincronización Multi-Dispositivo**: Cualquier registro o cambio de configuración en tu tablet Android se actualiza automáticamente en la base de datos centralizada del servidor.
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
