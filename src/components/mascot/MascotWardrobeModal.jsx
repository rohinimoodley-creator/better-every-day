import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { MASCOT_WARDROBE, BEANIE_COLORS } from '../../data/themes';
import PipSproutAvatar from './PipSproutAvatar';
import { X, Check, Palette } from 'lucide-react';

export default function MascotWardrobeModal({ onClose }) {
  const { userProfile, setUserProfile } = useWellness();

  const currentHat = userProfile.mascotHat || 'flower';
  const currentColor = userProfile.mascotColor || 'sprout';
  const currentBeanieColor = userProfile.mascotBeanieColor || 'pink';

  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'flowers' | 'hats' | 'eyewear'

  const selectHat = (hatId) => {
    setUserProfile(prev => ({ ...prev, mascotHat: hatId }));
  };

  const selectColor = (colorId) => {
    setUserProfile(prev => ({ ...prev, mascotColor: colorId }));
  };

  const selectBeanieColor = (beanieColorId) => {
    setUserProfile(prev => ({ ...prev, mascotBeanieColor: beanieColorId }));
  };

  const filteredHats = MASCOT_WARDROBE.hats.filter(h => {
    if (activeCategory === 'flowers') return h.category === 'flowers' || h.category === 'nature';
    if (activeCategory === 'hats') return h.category === 'hats';
    if (activeCategory === 'eyewear') return h.category === 'eyewear' || h.category === 'special';
    return true;
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-sheet"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 540,
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--bg-glass-card)',
          backdropFilter: 'blur(20px)',
          border: '1.5px solid var(--accent-primary)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}
            >
              ✨
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Style Pip's Wardrobe 🌱
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.1rem 0 0 0' }}>
                Seamless vector accessories that physically belong to Pip.
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

        {/* Big Live Pip Preview Card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--accent-primary-light) 100%)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            marginBottom: '1.25rem',
            position: 'relative'
          }}
        >
          <div style={{ transform: 'scale(1.1)', margin: '0.5rem 0' }}>
            <PipSproutAvatar
              size={90}
              mood="happy"
              hatId={currentHat}
              colorId={currentColor}
              beanieColorId={currentBeanieColor}
              animated={true}
            />
          </div>

          <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)', display: 'block' }}>
              Pip the Sprout
            </strong>
            <span style={{ fontSize: '0.76rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
              {MASCOT_WARDROBE.hats.find(h => h.id === currentHat)?.name || 'Natural Leaf'} • {MASCOT_WARDROBE.colors.find(c => c.id === currentColor)?.name || 'Sprout Green'}
            </span>
          </div>
        </div>

        {/* 1. Pip's Aura & Body Color */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
            <Palette size={14} color="var(--accent-primary)" /> Pip's Body & Aura Color
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.45rem' }}>
            {MASCOT_WARDROBE.colors.map(c => {
              const active = currentColor === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => selectColor(c.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.5rem 0.25rem',
                    background: active ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                    border: active ? `2px solid ${c.hex}` : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: c.bodyColor,
                      border: '2px solid #ffffff',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
                    }}
                  />
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: active ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                    {c.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Cozy Beanie Color Picker (Shown when Beanie is Selected) */}
        {currentHat === 'beanie' && (
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1.5px solid var(--accent-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                🧶 Choose Beanie Color:
              </span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                {BEANIE_COLORS.find(b => b.id === currentBeanieColor)?.name || 'Dusty Pink'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(48px, 1fr))', gap: '0.35rem' }}>
              {BEANIE_COLORS.map(b => {
                const active = currentBeanieColor === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => selectBeanieColor(b.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.2rem',
                      padding: '0.4rem 0.2rem',
                      borderRadius: 'var(--radius-sm)',
                      border: active ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      background: active ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                      cursor: 'pointer'
                    }}
                    title={b.name}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: b.hex,
                        border: '1.5px solid rgba(0,0,0,0.15)'
                      }}
                    />
                    <span style={{ fontSize: '0.62rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 44 }}>
                      {b.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Category Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.75rem', background: 'var(--bg-secondary)', padding: '0.25rem', borderRadius: 'var(--radius-pill)' }}>
          {[
            { id: 'all', label: 'All Items' },
            { id: 'flowers', label: '🌸 Flowers & Sprout' },
            { id: 'hats', label: '🎩 Hats & Bands' },
            { id: 'eyewear', label: '👓 Eyewear & Special' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              style={{
                flex: 1,
                padding: '0.35rem 0.5rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: activeCategory === tab.id ? 'var(--accent-primary)' : 'transparent',
                color: activeCategory === tab.id ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 4. Wearable Accessories Grid (Mini Pip Previews) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.55rem', marginBottom: '1.5rem' }}>
          {filteredHats.map(h => {
            const active = currentHat === h.id;
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => selectHat(h.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.75rem 0.4rem',
                  background: active ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                  border: active ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Mini Pip Preview Wearing This Exact Vector Item */}
                <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PipSproutAvatar
                    size={46}
                    mood="happy"
                    hatId={h.id}
                    colorId={currentColor}
                    beanieColorId={currentBeanieColor}
                    animated={false}
                  />
                </div>

                <div style={{ textAlign: 'center', marginTop: '0.15rem' }}>
                  <strong style={{ fontSize: '0.74rem', color: active ? 'var(--accent-primary)' : 'var(--text-primary)', display: 'block' }}>
                    {h.name}
                  </strong>
                </div>

                {active && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      background: 'var(--accent-primary)',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: 16,
                      height: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                    }}
                  >
                    <Check size={10} strokeWidth={3.5} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Done Button */}
        <button
          type="button"
          className="btn btn-primary"
          onClick={onClose}
          style={{
            width: '100%',
            padding: '0.85rem',
            fontSize: '0.95rem',
            fontWeight: 800
          }}
        >
          Done Styling Pip ✨
        </button>

      </div>
    </div>
  );
}
