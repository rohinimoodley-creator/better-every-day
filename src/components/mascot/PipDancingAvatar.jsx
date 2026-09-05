import React from 'react';
import { useWellness } from '../../context/WellnessContext';
import { MASCOT_WARDROBE } from '../../data/themes';
import PipAccessories from './PipAccessories';

export default function PipDancingAvatar({
  size = 120,
  isPlaying = true,
  hatId,
  colorId,
  beanieColorId
}) {
  const { userProfile } = useWellness();

  const activeHatId = hatId !== undefined ? hatId : (userProfile?.mascotHat || 'flower');
  const activeColorId = colorId !== undefined ? colorId : (userProfile?.mascotColor || 'sprout');
  const activeBeanieColor = beanieColorId !== undefined ? beanieColorId : (userProfile?.mascotBeanieColor || 'pink');

  const selectedColor = MASCOT_WARDROBE.colors.find(c => c.id === activeColorId) || MASCOT_WARDROBE.colors[0];

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* CSS Keyframe Animation for Dance Groove */}
      <style>{`
        @keyframes pipDanceGroove {
          0% {
            transform: translateY(0px) rotate(-6deg) scale(1, 0.95);
          }
          25% {
            transform: translateY(-16px) rotate(0deg) scale(0.95, 1.05);
          }
          50% {
            transform: translateY(0px) rotate(6deg) scale(1.04, 0.94);
          }
          75% {
            transform: translateY(-16px) rotate(0deg) scale(0.95, 1.05);
          }
          100% {
            transform: translateY(0px) rotate(-6deg) scale(1, 0.95);
          }
        }

        @keyframes pipArmLeftDance {
          0% { transform: rotate(-25deg); }
          50% { transform: rotate(35deg); }
          100% { transform: rotate(-25deg); }
        }

        @keyframes pipArmRightDance {
          0% { transform: rotate(25deg); }
          50% { transform: rotate(-35deg); }
          100% { transform: rotate(25deg); }
        }

        @keyframes pipSparklePulse {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50% { opacity: 0.9; transform: scale(1.2); }
        }
      `}</style>

      {/* Ambient Pulsing Aura */}
      <div
        style={{
          position: 'absolute',
          width: size * 1.15,
          height: size * 1.15,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${selectedColor.hex}44 0%, transparent 70%)`,
          animation: isPlaying ? 'pipSparklePulse 1.2s infinite ease-in-out' : 'none',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          width: '100%',
          height: '100%',
          animation: isPlaying ? 'pipDanceGroove 0.75s infinite ease-in-out' : 'none',
          transformOrigin: 'bottom center',
          filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.18))'
        }}
      >
        <svg
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          style={{ overflow: 'visible' }}
        >
          {/* Animated Dance Arms */}
          <g style={{ transformOrigin: '20px 60px', animation: isPlaying ? 'pipArmLeftDance 0.75s infinite ease-in-out' : 'none' }}>
            <ellipse cx="14" cy="60" rx="9" ry="5" fill={selectedColor.bodyColor} opacity="0.95" />
          </g>
          <g style={{ transformOrigin: '80px 60px', animation: isPlaying ? 'pipArmRightDance 0.75s infinite ease-in-out' : 'none' }}>
            <ellipse cx="86" cy="60" rx="9" ry="5" fill={selectedColor.bodyColor} opacity="0.95" />
          </g>

          {/* Pip Main Body */}
          <path
            d="M 50 16 C 74 16, 88 36, 88 60 C 88 80, 72 90, 50 90 C 28 90, 12 80, 12 60 C 12 36, 26 16, 50 16 Z"
            fill={selectedColor.bodyColor}
          />

          {/* Belly */}
          <ellipse cx="50" cy="65" rx="26" ry="20" fill="#ffffff" opacity="0.38" />

          {/* Cheerful Blush */}
          <circle cx="30" cy="58" r="6.5" fill={selectedColor.blush} opacity="0.85" />
          <circle cx="70" cy="58" r="6.5" fill={selectedColor.blush} opacity="0.85" />

          {/* Celebratory Joyful Eyes (Closed Happy Arcs) */}
          <path d="M 31 48 Q 38 40, 45 48" stroke="#1b382b" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 55 48 Q 62 40, 69 48" stroke="#1b382b" strokeWidth="4" strokeLinecap="round" fill="none" />

          {/* Big Joyful Dance Smile */}
          <path d="M 43 57 Q 50 66, 57 57" stroke="#1b382b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M 46 60 Q 50 67, 54 60" fill="#ff708f" opacity="0.75" />

          {/* Seamless Wearable Accessory that dances with Pip */}
          <PipAccessories hatId={activeHatId} beanieColorId={activeBeanieColor} />

          {/* Dance Sparkles around head */}
          {isPlaying && (
            <>
              <text x="8" y="28" fontSize="11">✨</text>
              <text x="82" y="32" fontSize="12">🎵</text>
              <text x="78" y="78" fontSize="10">💃</text>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
