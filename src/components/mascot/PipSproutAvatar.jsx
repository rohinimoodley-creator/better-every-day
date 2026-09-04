import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { MASCOT_WARDROBE } from '../../data/themes';
import PipAccessories from './PipAccessories';
import { Sparkles } from 'lucide-react';

export default function PipSproutAvatar({
  size = 56,
  mood = 'happy',
  animated = true,
  onClick,
  hatId,
  colorId,
  beanieColorId
}) {
  const { userProfile } = useWellness();
  const [isHovered, setIsHovered] = useState(false);

  const activeHatId = hatId !== undefined ? hatId : (userProfile?.mascotHat || 'flower');
  const activeColorId = colorId !== undefined ? colorId : (userProfile?.mascotColor || 'sprout');
  const activeBeanieColor = beanieColorId !== undefined ? beanieColorId : (userProfile?.mascotBeanieColor || 'pink');

  const selectedColor = MASCOT_WARDROBE.colors.find(c => c.id === activeColorId) || MASCOT_WARDROBE.colors[0];

  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={animated ? 'animate-float' : ''}
      style={{
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
        cursor: onClick ? 'pointer' : 'default',
        transform: onClick && isHovered ? 'scale(1.08)' : 'scale(1)',
        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
      title={onClick ? "Click to style Pip's wardrobe & aura 🌱" : "Pip the Sprout 🌱"}
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.15))', overflow: 'visible' }}
      >
        {/* Glow Aura */}
        <circle cx="50" cy="52" r="42" fill={selectedColor.hex} opacity={isHovered ? 0.35 : 0.18} />
        
        {/* Mascot Body */}
        <path
          d="M 50 16 C 74 16, 88 36, 88 60 C 88 80, 72 90, 50 90 C 28 90, 12 80, 12 60 C 12 36, 26 16, 50 16 Z"
          fill={selectedColor.bodyColor}
        />
        
        {/* Belly */}
        <ellipse cx="50" cy="65" rx="26" ry="20" fill="#ffffff" opacity="0.38" />

        {/* Cheeks Blush */}
        <circle cx="30" cy="58" r="6" fill={selectedColor.blush} opacity="0.75" />
        <circle cx="70" cy="58" r="6" fill={selectedColor.blush} opacity="0.75" />

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
        <PipAccessories hatId={activeHatId} beanieColorId={activeBeanieColor} />
      </svg>

      {/* Subtle Wardrobe Edit Sparkle Indicator on Hover / Clickable */}
      {onClick && (
        <div 
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            background: 'var(--bg-secondary)',
            border: '1.5px solid var(--accent-primary)',
            borderRadius: '50%',
            width: Math.max(18, Math.round(size * 0.32)),
            height: Math.max(18, Math.round(size * 0.32)),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            color: 'var(--accent-primary)',
            opacity: isHovered ? 1 : 0.85,
            transition: 'all 0.15s ease'
          }}
          title="Customize Pip"
        >
          <Sparkles size={Math.max(10, Math.round(size * 0.18))} />
        </div>
      )}
    </div>
  );
}
