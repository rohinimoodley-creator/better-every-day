import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { X, Trash2, Calendar, Clock, BookOpen, Filter } from 'lucide-react';

export default function PetPlayHistoryModal({ isOpen, onClose, initialPetId = 'all' }) {
  const { petProfiles = [], petPlayLogs = [], deletePetPlayLog } = useWellness();

  const [filterPetId, setFilterPetId] = useState(initialPetId || 'all');

  if (!isOpen) return null;

  const filteredLogs = petPlayLogs.filter(log => {
    if (filterPetId === 'all') return true;
    return log.petId === filterPetId;
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-sheet"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 540,
          background: 'var(--bg-glass-card)',
          backdropFilter: 'blur(20px)',
          border: '1.5px solid var(--accent-primary)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          maxHeight: '88vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}
            >
              📖
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Review Pet Play History
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.1rem 0 0 0' }}>
                {filteredLogs.length} active moments shared with your companion{filterPetId !== 'all' ? ` (${petProfiles.find(p => p.id === filterPetId)?.name})` : 's'}.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Pet Filter Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', background: 'var(--bg-secondary)', padding: '0.3rem', borderRadius: 'var(--radius-pill)', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setFilterPetId('all')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: filterPetId === 'all' ? 'var(--accent-primary)' : 'transparent',
              color: filterPetId === 'all' ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            🐾 All Pets ({petPlayLogs.length})
          </button>

          {petProfiles.map(pet => {
            const count = petPlayLogs.filter(l => l.petId === pet.id).length;
            const active = filterPetId === pet.id;
            return (
              <button
                key={pet.id}
                type="button"
                onClick={() => setFilterPetId(pet.id)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-pill)',
                  border: 'none',
                  background: active ? 'var(--accent-primary)' : 'transparent',
                  color: active ? '#ffffff' : 'var(--text-secondary)',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{pet.icon || '🐾'}</span>
                <span>{pet.name} ({count})</span>
              </button>
            );
          })}
        </div>

        {/* Logs List */}
        {filteredLogs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {filteredLogs.map(log => (
              <div
                key={log.id}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>{log.petIcon || '🐾'}</span>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                      {log.activityName}
                    </strong>
                    <span className="pill-badge primary" style={{ fontSize: '0.66rem', padding: '1px 6px' }}>
                      {log.petName}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={12} /> {log.date}
                    </span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                      <Clock size={12} /> {log.durationMin} min
                    </span>
                    {log.linkedWorkoutId && (
                      <>
                        <span>•</span>
                        <span style={{ color: 'var(--accent-secondary)' }}>🔗 Move workout</span>
                      </>
                    )}
                  </div>

                  {log.notes && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0 0', fontStyle: 'italic' }}>
                      "{log.notes}"
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => deletePetPlayLog(log.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    borderRadius: 'var(--radius-sm)'
                  }}
                  title="Delete log entry"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
            No Pet Play activities logged for this selection yet.
          </div>
        )}

        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
