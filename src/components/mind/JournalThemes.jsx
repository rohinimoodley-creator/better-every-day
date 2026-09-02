import React from 'react';
import { JOURNAL_THEMES } from '../../data/themes';
import { X, Check } from 'lucide-react';

export default function JournalThemes({ isOpen, onClose, activeThemeId, onSelectTheme }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem' }}>Journal Aesthetic Themes ✨</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Choose a visual mood for your reflective writing space.
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* 9 Themes Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {JOURNAL_THEMES.map(theme => {
            const isSelected = activeThemeId === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => { onSelectTheme(theme.id); onClose(); }}
                style={{
                  background: theme.bg,
                  border: isSelected ? `3px solid ${theme.accentColor}` : `1px solid ${theme.borderColor}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  position: 'relative',
                  boxShadow: isSelected ? 'var(--shadow-md)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.5rem' }}>{theme.icon}</span>
                  {isSelected && (
                    <div style={{ background: theme.accentColor, color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={11} strokeWidth={3} />
                    </div>
                  )}
                </div>

                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: theme.textColor }}>
                  {theme.name}
                </span>

                <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.2rem' }}>
                  {theme.stickers.slice(0, 4).map((st, i) => (
                    <span key={i} style={{ fontSize: '0.8rem' }}>{st}</span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
          Apply Aesthetic
        </button>
      </div>
    </div>
  );
}
