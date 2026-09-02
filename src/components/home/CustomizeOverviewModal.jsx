import React from 'react';
import { X, Check, Droplet, Footprints, Utensils, Moon, Sparkles, Wind, Heart, Activity } from 'lucide-react';

export const ALL_OVERVIEW_PILLARS = [
  { id: 'hydrate', label: 'Hydrate', desc: 'Daily water intake & hydration rhythm', icon: Droplet, color: '#3a86c8' },
  { id: 'move', label: 'Move', desc: 'Workouts, yoga, and active minutes', icon: Footprints, color: '#3a86c8' },
  { id: 'nourish', label: 'Nourish', desc: 'Meals, whole foods, and fuel balance', icon: Utensils, color: '#d97736' },
  { id: 'rest', label: 'Rest', desc: 'Sleep duration & night recovery', icon: Moon, color: '#7b61ff' },
  { id: 'mind', label: 'Mind', desc: 'Gratitude reflections & mindset', icon: Sparkles, color: '#8b5cf6' },
  { id: 'breathwork', label: 'Breathwork', desc: 'Calming nervous system regulation', icon: Wind, color: '#40916c' },
  { id: 'cycle', label: 'Cycle Rhythm', desc: 'Cycle phase & energy syncing', icon: Heart, color: '#d64062' },
  { id: 'steps', label: 'Steps Count', desc: 'Daily step cadence & outdoor walks', icon: Activity, color: '#2d6a4f' }
];

export default function CustomizeOverviewModal({ isOpen, onClose, selectedPillars, onUpdatePillars }) {
  if (!isOpen) return null;

  const togglePillar = (id) => {
    if (selectedPillars.includes(id)) {
      if (selectedPillars.length <= 2) return; // Keep at least 2
      onUpdatePillars(selectedPillars.filter(p => p !== id));
    } else {
      onUpdatePillars([...selectedPillars, id]);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-sheet" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 500, padding: '1.75rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Customize Week Overview 📊
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Select which wellness areas you want to track on your Home screen.
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.65rem', margin: '1rem 0' }}>
          {ALL_OVERVIEW_PILLARS.map(pil => {
            const isSelected = selectedPillars.includes(pil.id);
            const Icon = pil.icon;
            return (
              <div
                key={pil.id}
                onClick={() => togglePillar(pil.id)}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1.5px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  background: isSelected ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: isSelected ? 'var(--bg-secondary)' : 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={17} color={pil.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {pil.label}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {pil.desc}
                    </div>
                  </div>
                </div>

                <div 
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '5px',
                    border: `1.5px solid ${isSelected ? 'var(--accent-primary)' : 'var(--text-muted)'}`,
                    background: isSelected ? 'var(--accent-primary)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0
                  }}
                >
                  {isSelected && <Check size={13} />}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            {selectedPillars.length} pillars active
          </span>
          <button onClick={onClose} className="btn btn-primary" style={{ padding: '0.55rem 1.4rem' }}>
            Save Overview
          </button>
        </div>
      </div>
    </div>
  );
}
