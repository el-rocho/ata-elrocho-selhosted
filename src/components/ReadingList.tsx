import React, { useState } from 'react';
import type { BloodPressureSession, DateRange } from '../types/bloodPressure';
import { getHealthCategory } from '../utils/healthClassification';
import { filterSessionsByDateRange } from '../utils/exportCsv';
import { History, Trash2, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

interface ReadingListProps {
  sessions: BloodPressureSession[];
  onDeleteSession: (session: BloodPressureSession) => void;
  onDeleteSingleReading: (readingId: string) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export const ReadingList: React.FC<ReadingListProps> = ({
  sessions,
  onDeleteSession,
  onDeleteSingleReading,
  dateRange,
  onDateRangeChange,
}) => {
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  const filteredSessions = filterSessionsByDateRange(sessions, dateRange);

  const toggleExpand = (sessionId: string) => {
    setExpandedSessionId(expandedSessionId === sessionId ? null : sessionId);
  };

  return (
    <div className="card list-card">
      <div className="list-header">
        <div className="list-title">
          <History size={20} className="icon-history" />
          <h2>Historial de Mediciones</h2>
          <span className="count-badge">{filteredSessions.length}</span>
        </div>

        <div className="filter-chips">
          <button
            type="button"
            className={`chip ${dateRange.preset === '7days' ? 'active' : ''}`}
            onClick={() => onDateRangeChange({ preset: '7days' })}
          >
            7 Días
          </button>
          <button
            type="button"
            className={`chip ${dateRange.preset === '30days' ? 'active' : ''}`}
            onClick={() => onDateRangeChange({ preset: '30days' })}
          >
            30 Días
          </button>

          <button
            type="button"
            className={`chip ${dateRange.preset === 'all' ? 'active' : ''}`}
            onClick={() => onDateRangeChange({ preset: 'all' })}
          >
            Todo
          </button>
        </div>
      </div>

      {filteredSessions.length === 0 ? (
        <div className="empty-state">
          <p>No se han encontrado registros en este periodo.</p>
        </div>
      ) : (
        <div className="sessions-list">
          {filteredSessions.map((session) => {
            const dateObj = new Date(session.timestamp);
            const dateStr = dateObj.toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });
            const timeStr = dateObj.toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            });

            const category = getHealthCategory(session.averageSystolic, session.averageDiastolic);
            const isExpanded = expandedSessionId === session.id;
            const hasMultiple = session.readings.length > 1;

            return (
              <div key={session.id} className="session-item">
                <div className="session-main-row">
                  <div>
                    <div className="session-date">{dateStr}</div>
                    <div className="session-time">{timeStr}</div>
                  </div>

                  <div className="bp-reading-display">
                    <span className="sys-num">{session.averageSystolic}</span>
                    <span className="slash">/</span>
                    <span className="dia-num">{session.averageDiastolic}</span>
                    <span className="bp-unit">mmHg</span>
                  </div>

                  <div className="pulse-display">
                    <span className="pulse-num">{session.averageHeartRate}</span>
                    <span className="pulse-unit">ppm</span>
                  </div>

                  <div>
                    <div
                      className="category-pill"
                      style={{ backgroundColor: category.badgeBg, color: category.badgeText }}
                    >
                      <span className="dot" style={{ backgroundColor: category.colorHex }}></span>
                      {category.name}
                    </div>

                    {hasMultiple && (
                      <div className="white-coat-pill">
                        <ShieldCheck size={12} />
                        <span>Media de {session.readings.length} tomas</span>
                      </div>
                    )}
                  </div>

                  <div className="session-actions-col">
                    {hasMultiple && (
                      <button
                        type="button"
                        className="btn-icon-subtle"
                        onClick={() => toggleExpand(session.id)}
                        title="Ver tomas individuales de la sesión"
                      >
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    )}

                    <button
                      type="button"
                      className="btn-icon-delete"
                      onClick={() => onDeleteSession(session)}
                      title="Eliminar esta medición"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {session.notes && <span className="notes-preview">"{session.notes}"</span>}

                {isExpanded && hasMultiple && (
                  <div className="session-expanded-details">
                    <div className="expanded-banner-info">
                      <ShieldCheck size={14} />
                      <span>
                        Filtro de Bata Blanca aplicado: Se descartaron {session.discardedCount} tomas elevadas iniciales.
                      </span>
                    </div>

                    <table className="expanded-readings-table">
                      <thead>
                        <tr>
                          <th>Hora</th>
                          <th>Tensión</th>
                          <th>Pulso</th>
                          <th>Estado</th>
                          <th>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {session.readings.map((r, idx) => {
                          const rTime = new Date(r.timestamp).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                          });
                          const isFirstElevated = idx === 0 && session.discardedCount > 0;

                          return (
                            <tr key={r.id} className={isFirstElevated ? 'row-discarded' : ''}>
                              <td>{rTime}</td>
                              <td>
                                <strong>{r.systolic}</strong> / {r.diastolic} mmHg
                              </td>
                              <td>{r.heartRate} ppm</td>
                              <td>
                                {isFirstElevated ? (
                                  <span className="status-discarded">Descartada (Ansiedad inicial)</span>
                                ) : (
                                  <span className="status-used">Utilizada en media</span>
                                )}
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="btn-text-delete"
                                  onClick={() => onDeleteSingleReading(r.id)}
                                >
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
