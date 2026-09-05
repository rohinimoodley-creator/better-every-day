import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { MASCOT_WARDROBE } from '../../data/themes';
import PipAccessories from './PipAccessories';
import { Sparkles } from 'lucide-react';

export default function PipSproutAvatar({
  size = 56,
  mood = 'happy',
  animated = true,
  animationType = 'float', // 'float' | 'bounce' | 'sway' | 'breathe' | 'nod' | 'wink' | 'stretch' | 'yawn' | 'tilt' | 'none'
  onClick,
  hatId,
  colorId,
  beanieColorId,
  showCustomiseBadge = false,
  title
}) {
  const { userProfile, howIThrive } = useWellness();
  const [isHovered, setIsHovered] = useState(false);

  const activeHatId = hatId !== undefined ? hatId : (userProfile?.mascotHat || 'flower');
  const activeColorId = colorId !== undefined ? colorId : (userProfile?.mascotColor || 'sprout');
  const activeBeanieColor = beanieColorId !== undefined ? beanieColorId : (userProfile?.mascotBeanieColor || 'pink');

  const isReducedMotion = howIThrive?.animationLevel === 'reduced' || howIThrive?.animationLevel === 'minimal';
  const customColors = userProfile?.customMascotColors || [];
  const allColors = [...MASCOT_WARDROBE.colors, ...customColors];
  let selectedColor = allColors.find(c => c.id === activeColorId);
  if (!selectedColor && typeof activeColorId === 'string' && activeColorId.startsWith('#')) {
    selectedColor = {
      id: activeColorId,
      name: 'Custom',
      hex: activeColorId,
      bodyColor: activeColorId,
      blush: '#ff9ebb'
    };
  } else if (!selectedColor && typeof activeColorId === 'object' && activeColorId?.hex) {
    selectedColor = activeColorId;
  }
  if (!selectedColor) selectedColor = MASCOT_WARDROBE.colors[0];

  // Resolve animation class
  let animClass = '';
  if (!isReducedMotion && animated) {
    if (animationType === 'bounce') animClass = 'pip-anim-bounce';
    else if (animationType === 'sway') animClass = 'pip-anim-sway';
    else if (animationType === 'breathe' || mood === 'breathing') animClass = 'pip-anim-breathe';
    else if (animationType === 'nod') animClass = 'pip-anim-nod';
    else if (animationType === 'stretch' || mood === 'stretching') animClass = 'pip-anim-stretch';
    else if (animationType === 'yawn') animClass = 'pip-anim-yawn';
    else if (animationType === 'tilt' || mood === 'curious' || mood === 'listening') animClass = 'pip-anim-tilt';
    else if (animationType === 'wink' || mood === 'playful') animClass = 'pip-anim-wink';
    else if (animationType === 'float') animClass = 'animate-float';
  }

  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={animClass}
      style={{
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
        cursor: onClick ? 'pointer' : 'default',
        transform: onClick && isHovered ? 'scale(1.08)' : 'scale(1)',
        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
      title={title || (onClick ? "Pip the Sprout 🌱 (Click to style wardrobe)" : "Pip the Sprout 🌱")}
    >
      {/* Dynamic Keyframes for Pip's Emotional & Contextual Expressions */}
      <style>{`
        @keyframes pipBounceKeyframe {
          0%, 100% { transform: translateY(0px) scale(1, 1); }
          30% { transform: translateY(-8px) scale(0.96, 1.04); }
          60% { transform: translateY(0px) scale(1.04, 0.96); }
        }
        @keyframes pipSwayKeyframe {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        @keyframes pipBreatheKeyframe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes pipNodKeyframe {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          35% { transform: translateY(4px) rotate(2deg); }
          70% { transform: translateY(-2px) rotate(-1deg); }
        }
        @keyframes pipStretchKeyframe {
          0%, 100% { transform: scale(1, 1); }
          40% { transform: scale(0.92, 1.1) translateY(-6px); }
        }
        @keyframes pipTiltKeyframe {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(7deg) translateY(-2px); }
        }
        @keyframes pipWinkKeyframe {
          0%, 100% { transform: rotate(0deg) scale(1); }
          40% { transform: rotate(-4deg) scale(1.05); }
        }
        @keyframes pipYawnKeyframe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05, 0.95) translateY(2px); }
        }

        .pip-anim-bounce { animation: pipBounceKeyframe 0.6s ease-in-out; transform-origin: bottom center; }
        .pip-anim-sway { animation: pipSwayKeyframe 3s infinite ease-in-out; transform-origin: bottom center; }
        .pip-anim-breathe { animation: pipBreatheKeyframe 4s infinite ease-in-out; transform-origin: center center; }
        .pip-anim-nod { animation: pipNodKeyframe 0.7s ease-in-out; transform-origin: center center; }
        .pip-anim-stretch { animation: pipStretchKeyframe 1.2s ease-in-out; transform-origin: bottom center; }
        .pip-anim-tilt { animation: pipTiltKeyframe 2.5s infinite ease-in-out; transform-origin: bottom center; }
        .pip-anim-wink { animation: pipWinkKeyframe 0.6s ease-in-out; transform-origin: center center; }
        .pip-anim-yawn { animation: pipYawnKeyframe 1.4s ease-in-out; transform-origin: center center; }
      `}</style>

      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.15))', overflow: 'visible' }}
      >
        {/* Glow Aura */}
        <circle 
          cx="50" 
          cy="52" 
          r={mood === 'breathing' ? '46' : '42'} 
          fill={selectedColor.hex} 
          opacity={isHovered ? 0.35 : (mood === 'calm' || mood === 'breathing' ? 0.25 : 0.18)} 
        />
        
        {/* Mascot Body */}
        <path
          d="M 50 16 C 74 16, 88 36, 88 60 C 88 80, 72 90, 50 90 C 28 90, 12 80, 12 60 C 12 36, 26 16, 50 16 Z"
          fill={selectedColor.bodyColor}
        />
        
        {/* Belly */}
        <ellipse cx="50" cy="65" rx="26" ry="20" fill="#ffffff" opacity="0.38" />

        {/* Cheeks Blush */}
        <circle 
          cx="30" 
          cy="58" 
          r={mood === 'warm' || mood === 'celebrate' ? 7.5 : 6} 
          fill={selectedColor.blush} 
          opacity={mood === 'warm' || mood === 'celebrate' ? 0.9 : 0.75} 
        />
        <circle 
          cx="70" 
          cy="58" 
          r={mood === 'warm' || mood === 'celebrate' ? 7.5 : 6} 
          fill={selectedColor.blush} 
          opacity={mood === 'warm' || mood === 'celebrate' ? 0.9 : 0.75} 
        />

        {/* Expressive Contextual Eyes */}
        {/* 1. Celebrate / Joyful */}
        {mood === 'celebrate' && (
          <>
            <path d="M 32 48 Q 38 41, 44 48" stroke="#1b382b" strokeWidth="3.6" strokeLinecap="round" fill="none" />
            <path d="M 56 48 Q 62 41, 68 48" stroke="#1b382b" strokeWidth="3.6" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* 2. Calm / Peaceful / Breathing */}
        {(mood === 'calm' || mood === 'breathing' || mood === 'peaceful') && (
          <>
            <path d="M 33 48 Q 38 45, 43 47" stroke="#1b382b" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <path d="M 57 47 Q 62 45, 67 48" stroke="#1b382b" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* 3. Sleepy / Unwind */}
        {mood === 'sleepy' && (
          <>
            <path d="M 33 49 Q 38 52, 43 49" stroke="#1b382b" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <path d="M 57 49 Q 62 52, 67 49" stroke="#1b382b" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            {/* Little dream z */}
            <text x="76" y="38" fontSize="10" fill="var(--accent-primary)" opacity="0.8" fontWeight="bold">z</text>
          </>
        )}

        {/* 4. Listening / Attentive */}
        {mood === 'listening' && (
          <>
            <circle cx="37" cy="48" r="4.8" fill="#1b382b" />
            <circle cx="39" cy="46" r="2" fill="#ffffff" />
            <circle cx="36" cy="49" r="0.9" fill="#ffffff" />
            <circle cx="61" cy="48" r="4.8" fill="#1b382b" />
            <circle cx="63" cy="46" r="2" fill="#ffffff" />
            <circle cx="60" cy="49" r="0.9" fill="#ffffff" />
          </>
        )}

        {/* 5. Curious */}
        {mood === 'curious' && (
          <>
            {/* Left eye wider */}
            <circle cx="37" cy="47" r="5.2" fill="#1b382b" />
            <circle cx="39" cy="45" r="1.8" fill="#ffffff" />
            {/* Right eye slight squint */}
            <circle cx="62" cy="48" r="4" fill="#1b382b" />
            <circle cx="64" cy="46" r="1.4" fill="#ffffff" />
            {/* Cute inquisitive eyebrow */}
            <path d="M 33 39 Q 37 36, 42 38" stroke="#1b382b" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* 6. Playful / Wink */}
        {mood === 'playful' && (
          <>
            {/* Left eye open */}
            <circle cx="38" cy="48" r="4.6" fill="#1b382b" />
            <circle cx="40" cy="46" r="1.6" fill="#ffffff" />
            {/* Right eye wink arc */}
            <path d="M 56 48 Q 62 42, 68 48" stroke="#1b382b" strokeWidth="3.6" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* 7. Stretching */}
        {mood === 'stretching' && (
          <>
            <path d="M 32 47 Q 38 41, 44 47" stroke="#1b382b" strokeWidth="3.4" strokeLinecap="round" fill="none" />
            <path d="M 56 47 Q 62 41, 68 47" stroke="#1b382b" strokeWidth="3.4" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* 8. Default Happy / Encouraging / Neutral / Warm */}
        {mood !== 'celebrate' && 
         mood !== 'calm' && 
         mood !== 'breathing' && 
         mood !== 'peaceful' && 
         mood !== 'sleepy' && 
         mood !== 'listening' && 
         mood !== 'curious' && 
         mood !== 'playful' && 
         mood !== 'stretching' && (
          <>
            <circle cx="38" cy="48" r="4.5" fill="#1b382b" />
            <circle cx="40" cy="46" r="1.6" fill="#ffffff" />
            <circle cx="62" cy="48" r="4.5" fill="#1b382b" />
            <circle cx="64" cy="46" r="1.6" fill="#ffffff" />
          </>
        )}

        {/* Contextual Mouth & Smile */}
        {mood === 'celebrate' ? (
          <>
            <path d="M 43 57 Q 50 66, 57 57" stroke="#1b382b" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <path d="M 46 60 Q 50 66, 54 60" fill="#ff708f" opacity="0.8" />
          </>
        ) : mood === 'curious' ? (
          <circle cx="50" cy="60" r="2.8" fill="#1b382b" />
        ) : mood === 'sleepy' ? (
          <path d="M 46 60 Q 50 63, 54 60" stroke="#1b382b" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        ) : mood === 'calm' || mood === 'breathing' || mood === 'peaceful' ? (
          <path d="M 45 59 Q 50 63, 55 59" stroke="#1b382b" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M 44 58 Q 50 64, 56 58" stroke="#1b382b" strokeWidth="3" strokeLinecap="round" fill="none" />
        )}

        {/* Seamless Wearable Vector Accessory */}
        <PipAccessories hatId={activeHatId} beanieColorId={activeBeanieColor} />
      </svg>

      {/* Subtle Wardrobe Edit Sparkle Indicator on Directly Customizable Instances */}
      {showCustomiseBadge && onClick && (
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
