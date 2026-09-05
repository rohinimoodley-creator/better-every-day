import React from 'react';
import { X, Check, Droplet, Footprints, Utensils, Moon, Sparkles, Wind, Heart, Activity, ArrowUp, ArrowDown } from 'lucide-react';

export const ALL_OVERVIEW_PILLARS = [
  { id: 'move', label: 'Move', desc: 'Workouts, active pacing & steps', icon: Footprints, color: '#3a86c8' },
  { id: 'nourish', label: 'Nourish', desc: 'Meals, whole foods, and vitality balance', icon: Utensils, color: '#d97736' },
  { id: 'hydrate', label: 'Hydrate', desc: 'Daily water intake & cellular flow', icon: Droplet, color: '#3a86c8' },
  { id: 'rest', label: 'Rest', desc: 'Sleep duration & night recovery', icon: Moon, color: '#7b61ff' },
  { id: 'mind', label: 'Mind', desc: 'Gratitude reflections & mindset', icon: Sparkles, color: '#8b5cf6' },
  { id: 'cycle', label: 'Cycle', desc: 'Cycle phase & energy syncing', icon: Heart, color: '#d64062' },
  { id: 'breathwork', label: 'Breathwork', desc: 'Calming nervous system regulation', icon: Wind, color: '#40916c' },
  { id: 'steps', label: 'Steps', desc: 'Daily step cadence & outdoor walks', icon: Activity, color: '#2d6a4f' }
];

export default function CustomizeOverviewModal({ isOpen, onClose, selectedPillars = [], onUpdatePillars }) {
  if (!isOpen) return null;

  const togglePillar = (id) => {
    if (selectedPillars.includes(id)) {
      if (selectedPillars.length <= 1) return; // Keep at least 1
      onUpdatePillars(selectedPillars.filter(p => p !== id));
    } else {
      onUpdatePillars([...selectedPillars, id]);
    }
  };

  const movePillar = (index, direction, e) => {
    e.stopPropagation();
    const newPillars = [...selectedPillars];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newPillars.length) return;
    const temp = newPillars[index];
    newPillars[index] = newPillars[targetIndex];
    newPillars[targetIndex] = temp;
    onUpdatePillars(newPillars);
  };

  // Group into Active (in order) and Available
  const activePillarsFull = selectedPillars
    .map(id => ALL_OVERVIEW_PILLARS.find(p => p.id === id))
    .filter(Boolean);

  const availablePillars = ALL_OVERVIEW_PILLARS.filter(p => !selectedPillars.includes(p.id));

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1200 }}>
      <div 
        className="modal-sheet" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', padding: '1.6rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Customize Wellness Overview 📊
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Select which wellness hubs appear on your Home screen and arrange their order.
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* 1. Active Selected Hubs with Reorder */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.45rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Active on Home ({activePillarsFull.length})</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Use arrows to reorder</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {activePillarsFull.map((pil, idx) => {
              const Icon = pil.icon;
              return (
                <div
                  key={pil.id}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--accent-primary)',
                    background: 'var(--accent-primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} color={pil.color} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                        {pil.label}
                      </strong>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {pil.desc}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={(e) => movePillar(idx, -1, e)}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        padding: '3px 6px',
                        cursor: idx === 0 ? 'not-allowed' : 'pointer',
                        opacity: idx === 0 ? 0.3 : 1,
                        color: 'var(--text-primary)'
                      }}
                      title="Move up"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === activePillarsFull.length - 1}
                      onClick={(e) => movePillar(idx, 1, e)}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        padding: '3px 6px',
                        cursor: idx === activePillarsFull.length - 1 ? 'not-allowed' : 'pointer',
                        opacity: idx === activePillarsFull.length - 1 ? 0.3 : 1,
                        color: 'var(--text-primary)'
                      }}
                      title="Move down"
                    >
                      <ArrowDown size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => togglePillar(pil.id)}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-pill)',
                        padding: '3px 8px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        color: 'var(--text-secondary)'
                      }}
                      title="Remove from Home overview"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Available Hubs to Add */}
        {availablePillars.length > 0 && (
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.45rem' }}>
              Available Hubs to Add
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {availablePillars.map(pil => {
                const Icon = pil.icon;
                return (
                  <div
                    key={pil.id}
                    onClick={() => togglePillar(pil.id)}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={16} color={pil.color} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {pil.label}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {pil.desc}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem' }}
                      onClick={(e) => { e.stopPropagation(); togglePillar(pil.id); }}
                    >
                      + Add
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Changes apply instantly to your Home screen.
          </span>
          <button onClick={onClose} className="btn btn-primary" style={{ padding: '0.5rem 1.4rem', fontSize: '0.84rem' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

