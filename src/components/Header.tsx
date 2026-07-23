import React from 'react';
import { Server, Download, Moon, Sun, Settings } from 'lucide-react';
import { HeartIcon } from './HeartIcon';

interface HeaderProps {
  onOpenExportModal: () => void;
  onOpenSettingsModal: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenExportModal,
  onOpenSettingsModal,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-logo">
          <img
            src={isDarkMode ? './logo-night.png' : './logo-day.png'}
            alt="Logo Control Tensión Arterial"
            className="brand-logo-img"
          />
        </div>
        <div>
          <h1 className="brand-title">Control Tensión Arterial</h1>
          <div className="brand-badge">
            <Server size={13} className="shield-icon" />
            <span>Privado &amp; Autoalojado &bull; v1.2.0</span>
          </div>
        </div>
      </div>

      <div className="header-actions">
        <button
          onClick={onToggleDarkMode}
          className="btn-icon"
          title={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
        >
          {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
        </button>

        <button
          onClick={onOpenSettingsModal}
          className="btn-icon"
          title="Configuración de la aplicación"
        >
          <Settings size={22} />
        </button>

        <button onClick={onOpenExportModal} className="btn-primary-gradient">
          <Download size={16} />
          <span>Exportar / Imprimir</span>
        </button>
      </div>
    </header>
  );
};
