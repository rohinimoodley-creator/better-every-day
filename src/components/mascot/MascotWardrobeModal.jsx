import React from 'react';
import { useWellness } from '../../context/WellnessContext';
import { MASCOT_WARDROBE } from '../../data/themes';
import { X, Check } from 'lucide-react';

export default function MascotWardrobeModal({ onClose }) {
  const { userProfile, setUserProfile } = useWellness();

  const currentHat = userProfile.mascotHat || 'flower';
  const currentColor = userProfile.mascotColor || 'sprout';

  const selectHat = (hatId) => {
    setUserProfile(prev => ({ ...prev, mascotHat: hatId }));
  };

  const selectColor = (colorId) => {
    setUserProfile(prev => ({ ...prev, mascotColor: colorId }));
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>Style Pip's Wardrobe 🌱</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Customize your wellness companion's look and colors.</p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Color Palette Selection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.6rem' }}>
            Pip's Aura Color
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.5rem' }}>
            {MASCOT_WARDROBE.colors.map(c => {
              const active = currentColor === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => selectColor(c.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.6rem 0.3rem',
                    background: active ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                    border: active ? `2px solid ${c.hex}` : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: c.bodyColor, border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-primary)' }}>{c.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hats & Accessories */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.6rem' }}>
            Hats & Accessories
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            {MASCOT_WARDROBE.hats.map(h => {
              const active = currentHat === h.id;
              return (
                <button
                  key={h.id}
                  onClick={() => selectHat(h.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.75rem 0.25rem',
                    background: active ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                    border: active ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{h.icon}</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center' }}>
                    {h.name}
                  </span>
                  {active && (
                    <div style={{ position: 'absolute', top: 4, right: 4, background: 'var(--accent-primary)', color: '#fff', borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={9} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
          Done Styling Pip ✨
        </button>
      </div>
    </div>
  );
}
