import React from 'react';
import { X, Check, Droplet, Footprints, Utensils, Moon, Sparkles, Wind, Heart, Calendar, Mic, MessageSquare } from 'lucide-react';

export const ALL_AVAILABLE_SHORTCUTS = [
  { id: 'hydrate', label: 'Hydrate', icon: Droplet, color: '#3a86c8', target: 'WELLNESS', params: { category: 'hydrate' } },
  { id: 'move', label: 'Move', icon: Footprints, color: '#3a86c8', target: 'WELLNESS', params: { category: 'move' } },
  { id: 'nourish', label: 'Nourish', icon: Utensils, color: '#d97736', target: 'WELLNESS', params: { category: 'nourish' } },
  { id: 'rest', label: 'Rest', icon: Moon, color: '#7b61ff', target: 'WELLNESS', params: { category: 'rest' } },
  { id: 'gratitude', label: 'Gratitude', icon: Sparkles, color: '#8b5cf6', target: 'WELLNESS', params: { category: 'mind' } },
  { id: 'breathwork', label: 'Breathwork', icon: Wind, color: '#40916c', target: 'WELLNESS', params: { category: 'breathwork' } },
  { id: 'calendar', label: 'Calendar', icon: Calendar, color: '#40916c', target: 'WELLNESS', params: { category: 'calendar' } },
  { id: 'record', label: 'Record Day', icon: Mic, color: 'var(--accent-primary)', target: 'RECORD' },
  { id: 'cycle', label: 'Cycle Sync', icon: Heart, color: '#d64062', target: 'WELLNESS', params: { category: 'cycle' } },
  { id: 'ask_ai', label: 'Ask Insights', icon: MessageSquare, color: '#7b61ff', target: 'INSIGHTS' }
];

export default function EditShortcutsModal({ isOpen, onClose, selectedShortcuts, onUpdateShortcuts }) {
  if (!isOpen) return null;

  const toggleShortcut = (id) => {
    if (selectedShortcuts.includes(id)) {
      if (selectedShortcuts.length <= 2) return; // keep at least 2
      onUpdateShortcuts(selectedShortcuts.filter(s => s !== id));
    } else {
      onUpdateShortcuts([...selectedShortcuts, id]);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-sheet" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 480 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
              Customize Home Shortcuts ⚡
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Choose which quick-access items appear on your Home page.
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', margin: '1rem 0' }}>
          {ALL_AVAILABLE_SHORTCUTS.map(sc => {
            const isSelected = selectedShortcuts.includes(sc.id);
            const Icon = sc.icon;
            return (
              <div
                key={sc.id}
                onClick={() => toggleShortcut(sc.id)}
                style={{
                  padding: '0.75rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1.5px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  background: isSelected ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Icon size={16} color={sc.color} />
                  <span style={{ fontSize: '0.84rem', fontWeight: isSelected ? 700 : 500, color: 'var(--text-primary)' }}>
                    {sc.label}
                  </span>
                </div>

                <div 
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '4px',
                    border: `1.5px solid ${isSelected ? 'var(--accent-primary)' : 'var(--text-muted)'}`,
                    background: isSelected ? 'var(--accent-primary)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}
                >
                  {isSelected && <Check size={12} />}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          💡 Removing a shortcut only hides the icon from Home. It does not delete or change the feature.
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-primary" style={{ padding: '0.55rem 1.25rem' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
