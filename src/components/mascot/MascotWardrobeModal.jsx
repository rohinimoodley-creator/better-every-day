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

  const [customHex, setCustomHex] = useState('#8b5cf6');
  const [customName, setCustomName] = useState('My Purple 💜');
  const [showColorWheel, setShowColorWheel] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const customColorsList = userProfile.customMascotColors || [];

  const handleSaveCustomColor = (e) => {
    e.preventDefault();
    if (!customHex) return;
    const newColorId = `custom_${Date.now()}`;
    const newColorObj = {
      id: newColorId,
      name: customName.trim() || 'Custom Color 🎨',
      hex: customHex,
      bodyColor: customHex,
      blush: '#ff9ebb'
    };
    setUserProfile(prev => ({
      ...prev,
      customMascotColors: [...(prev.customMascotColors || []), newColorObj],
      mascotColor: newColorId
    }));
  };

  const handleDeleteCustomColor = (id, e) => {
    e.stopPropagation();
    setUserProfile(prev => ({
      ...prev,
      customMascotColors: (prev.customMascotColors || []).filter(c => c.id !== id),
      mascotColor: prev.mascotColor === id ? 'sprout' : prev.mascotColor
    }));
  };

  const allAvailableColors = [...MASCOT_WARDROBE.colors, ...customColorsList];
  const activeColorObj = allAvailableColors.find(c => c.id === currentColor) || { name: 'Custom', hex: currentColor, bodyColor: currentColor };

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem', margin: 0 }}>
              <Palette size={14} color="var(--accent-primary)" /> Pip's Body & Aura Color
            </label>
            <button
              type="button"
              onClick={() => setShowColorWheel(!showColorWheel)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-primary)',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem'
              }}
            >
              <span>{showColorWheel ? 'Hide Color Wheel' : '🎨 Custom Color Wheel'}</span>
            </button>
          </div>

          {/* Color Wheel Creator Panel */}
          {showColorWheel && (
            <form 
              onSubmit={handleSaveCustomColor}
              style={{
                background: 'var(--bg-secondary)',
                border: '1.5px solid var(--accent-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                marginBottom: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                animation: 'fadeIn 0.2s ease-out'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ position: 'relative', width: 44, height: 44 }}>
                  <input
                    type="color"
                    value={customHex}
                    onChange={(e) => {
                      setCustomHex(e.target.value);
                      setUserProfile(prev => ({ ...prev, mascotColor: e.target.value }));
                    }}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      border: '2px solid #ffffff',
                      cursor: 'pointer',
                      padding: 0,
                      background: 'none'
                    }}
                    title="Choose custom shade from color wheel"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.15rem' }}>
                    Custom Color Name
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. 🌸 Soft Pink, 🌿 Sage, 💜 My Purple"
                    style={{
                      width: '100%',
                      padding: '0.35rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-glass)',
                      fontSize: '0.82rem',
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Selected: <strong style={{ color: customHex }}>{customHex}</strong>
                </span>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem' }}
                >
                  Save Color Palette ✨
                </button>
              </div>
            </form>
          )}

          {/* Color Palettes Grid (Presets + Saved Custom Colors) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: '0.45rem' }}>
            {allAvailableColors.map(c => {
              const active = currentColor === c.id || currentColor === c.hex;
              const isCustom = c.id.startsWith('custom_');
              return (
                <div
                  key={c.id}
                  onClick={() => selectColor(c.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.45rem 0.25rem',
                    background: active ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                    border: active ? `2px solid ${c.hex}` : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.15s ease'
                  }}
                  title={c.name}
                >
                  {isCustom && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteCustomColor(c.id, e)}
                      style={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        background: 'rgba(0,0,0,0.15)',
                        border: 'none',
                        borderRadius: '50%',
                        width: 14,
                        height: 14,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.55rem',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        padding: 0
                      }}
                      title="Delete saved color"
                    >
                      ✕
                    </button>
                  )}
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: c.bodyColor || c.hex,
                      border: '2px solid #ffffff',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
                    }}
                  />
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: active ? 'var(--accent-primary)' : 'var(--text-secondary)', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', padding: '0 2px' }}>
                    {c.name}
                  </span>
                </div>
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
