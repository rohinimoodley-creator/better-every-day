import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { Sparkles, Shirt } from 'lucide-react';
import MascotWardrobeModal from './MascotWardrobeModal';
import { MASCOT_WARDROBE } from '../../data/themes';

import PipAccessories from './PipAccessories';

export default function MascotCompanion({ message, mood = 'happy' }) {
  const { userProfile, howIThrive } = useWellness();
  const [showWardrobe, setShowWardrobe] = useState(false);

  // If mascot is turned off in How I Thrive
  if (howIThrive?.mascotInteractionLevel === 'off') {
    return null;
  }

  const selectedHatId = userProfile?.mascotHat || 'flower';
  const selectedColor = MASCOT_WARDROBE.colors.find(c => c.id === (userProfile?.mascotColor || 'sprout')) || MASCOT_WARDROBE.colors[0];
  const selectedBeanieColor = userProfile?.mascotBeanieColor || 'pink';

  const isReducedMotion = howIThrive?.animationLevel === 'reduced' || howIThrive?.animationLevel === 'minimal';
  const isMinimalInteraction = howIThrive?.mascotInteractionLevel === 'minimal';

  return (
    <>
      <div 
        className="mascot-container card-glass"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          padding: isMinimalInteraction ? '0.85rem 1.25rem' : '1.25rem 1.5rem',
          background: 'linear-gradient(135deg, var(--bg-glass-card) 0%, var(--accent-primary-light) 100%)',
          border: '1px solid var(--border-glass)',
          position: 'relative'
        }}
      >
        {/* Interactive Mascot SVG Character */}
        <div 
          style={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }}
          onClick={() => setShowWardrobe(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          title="Click to customize Pip's outfit!"
        >
          <div className={isReducedMotion ? '' : 'animate-float'} style={{ position: 'relative', width: isMinimalInteraction ? 54 : 78, height: isMinimalInteraction ? 54 : 78 }}>
            <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.12))', overflow: 'visible' }}>
              {/* Glow Aura */}
              <circle cx="50" cy="52" r="42" fill={selectedColor.hex} opacity="0.15" />
              
              {/* Mascot Body */}
              <path
                d="M 50 16 C 74 16, 88 36, 88 60 C 88 80, 72 90, 50 90 C 28 90, 12 80, 12 60 C 12 36, 26 16, 50 16 Z"
                fill={selectedColor.bodyColor}
              />
              
              {/* Belly */}
              <ellipse cx="50" cy="65" rx="26" ry="20" fill="#ffffff" opacity="0.35" />

              {/* Cheeks Blush */}
              <circle cx="30" cy="58" r="6" fill={selectedColor.blush} opacity="0.7" />
              <circle cx="70" cy="58" r="6" fill={selectedColor.blush} opacity="0.7" />

              {/* Expressive Eyes */}
              {mood === 'celebrate' ? (
                <>
                  <path d="M 32 48 Q 38 42, 44 48" stroke="#1b382b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                  <path d="M 56 48 Q 62 42, 68 48" stroke="#1b382b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                </>
              ) : (
                <>
                  <circle cx="38" cy="48" r="4.5" fill="#1b382b" />
                  <circle cx="40" cy="46" r="1.5" fill="#ffffff" />
                  <circle cx="62" cy="48" r="4.5" fill="#1b382b" />
                  <circle cx="64" cy="46" r="1.5" fill="#ffffff" />
                </>
              )}

              {/* Smile */}
              <path d="M 44 58 Q 50 64, 56 58" stroke="#1b382b" strokeWidth="3" strokeLinecap="round" fill="none" />

              {/* Seamless Wearable Vector Accessory */}
              <PipAccessories hatId={selectedHatId} beanieColorId={selectedBeanieColor} />
            </svg>

            {/* Wardrobe Edit Icon */}
            {!isMinimalInteraction && (
              <div 
                style={{
                  position: 'absolute',
                  bottom: -2,
                  right: -2,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)',
                  color: 'var(--accent-primary)'
                }}
              >
                <Shirt size={12} />
              </div>
            )}
          </div>
        </div>

        {/* Mascot Speech Bubble */}
        {!isMinimalInteraction && (
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  Pip the Sprout
                </span>
                <span className="pill-badge primary" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                  Companion
                </span>
              </div>
              <button 
                onClick={() => setShowWardrobe(true)}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: 'var(--text-muted)', 
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <Sparkles size={12} color="var(--accent-secondary)" /> Style Pip
              </button>
            </div>

            <p style={{ 
              fontSize: '0.92rem', 
              color: 'var(--text-secondary)', 
              lineHeight: 1.45,
              margin: 0
            }}>
              "{message || "You don't need to change everything today. Just take one small step at your own pace."}"
            </p>
          </div>
        )}
      </div>

      {showWardrobe && (
        <MascotWardrobeModal onClose={() => setShowWardrobe(false)} />
      )}
    </>
  );
}
