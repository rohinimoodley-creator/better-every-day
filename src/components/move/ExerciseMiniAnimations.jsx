import React from 'react';

/**
 * Pip IS the Exercise Demonstrator!
 * Animated SVG character demonstrations showing:
 * - Starting posture & stance
 * - Smooth movement trajectory
 * - End of movement & pauses/holds
 * - Gentle return to starting position
 * - Full Slow Mode support (7.5s vs 3.6s)
 * - Pip's signature character design: sprout leaf, cute eyes, rosy blush, soft belly, hands & shoes.
 */

export default function ExerciseMiniAnimation({ exerciseId, isSlowMode = false }) {
  const animDuration = isSlowMode ? '7.5s' : '3.6s';

  const containerStyle = {
    width: '100%',
    height: 205,
    background: 'radial-gradient(circle at center, var(--bg-secondary, #ffffff) 0%, var(--bg-tertiary, #f4f6f5) 100%)',
    borderRadius: 'var(--radius-lg, 14px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    border: '1.5px solid var(--border-subtle, rgba(0,0,0,0.08))',
    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.03)'
  };

  return (
    <div style={containerStyle} aria-label={`${exerciseId} Pip animation demonstration`}>
      <style>{`
        /* 1. Pip Squat Keyframes */
        @keyframes pipSquatBody {
          0%, 100% {
            transform: translateY(0px) scale(1, 1);
          }
          15% {
            transform: translateY(0px) scale(1, 1);
          }
          45%, 60% {
            transform: translateY(28px) scale(1.08, 0.9);
          }
          85% {
            transform: translateY(0px) scale(1, 1);
          }
        }

        @keyframes pipSquatArms {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          15% {
            transform: translateY(0px) rotate(0deg);
          }
          45%, 60% {
            transform: translateY(-4px) rotate(-15deg);
          }
          85% {
            transform: translateY(0px) rotate(0deg);
          }
        }

        /* 2. Pip Push-up Keyframes */
        @keyframes pipPushupBody {
          0%, 100% {
            transform: rotate(0deg) translateY(0px);
          }
          15% {
            transform: rotate(0deg) translateY(0px);
          }
          45%, 60% {
            transform: rotate(-10deg) translateY(18px);
          }
          85% {
            transform: rotate(0deg) translateY(0px);
          }
        }

        @keyframes pipPushupArm {
          0%, 100% {
            transform: scaleY(1);
          }
          15% {
            transform: scaleY(1);
          }
          45%, 60% {
            transform: scaleY(0.65) translateY(6px);
          }
          85% {
            transform: scaleY(1);
          }
        }

        /* 3. Pip Lunge Keyframes */
        @keyframes pipLungeBody {
          0%, 100% {
            transform: translateY(0px);
          }
          15% {
            transform: translateY(0px);
          }
          45%, 60% {
            transform: translateY(22px);
          }
          85% {
            transform: translateY(0px);
          }
        }

        @keyframes pipLungeFrontLeg {
          0%, 100% {
            transform: translateY(0px);
          }
          45%, 60% {
            transform: translateY(-2px);
          }
        }

        /* 4. Pip Plank Keyframes */
        @keyframes pipPlankGlow {
          0%, 100% {
            opacity: 0.25;
            transform: scale(1);
          }
          50% {
            opacity: 0.65;
            transform: scale(1.15);
          }
        }

        @keyframes pipBreatheSubtle {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        /* 5. Pip Stretch & Neck Keyframes */
        @keyframes pipNeckTilt {
          0%, 100% {
            transform: rotate(0deg);
          }
          20%, 40% {
            transform: rotate(-18deg);
          }
          50% {
            transform: rotate(0deg);
          }
          70%, 90% {
            transform: rotate(18deg);
          }
        }

        @keyframes pipShoulderRelax {
          0%, 100% {
            transform: translateY(0px);
          }
          20%, 40% {
            transform: translateY(2px);
          }
          50% {
            transform: translateY(0px);
          }
          70%, 90% {
            transform: translateY(2px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pip-anim-group {
            animation: none !important;
          }
        }
      `}</style>

      {/* ========================================================================= */}
      {/* 1. SQUAT DEMONSTRATION — PIP DEMONSTRATOR                                 */}
      {/* ========================================================================= */}
      {exerciseId === 'squat' && (
        <svg width="240" height="175" viewBox="0 0 240 175">
          {/* Ground surface */}
          <line x1="25" y1="150" x2="215" y2="150" stroke="var(--border-subtle, #e2e8f0)" strokeWidth="3" strokeLinecap="round" />
          
          {/* Stance indicator */}
          <path d="M 82 158 L 158 158" stroke="#3a86c8" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="120" y="168" fontSize="8" fill="#3a86c8" textAnchor="middle" fontWeight="bold">Feet Shoulder-Width</text>

          {/* Pip Shadow */}
          <ellipse cx="120" cy="150" rx="38" ry="6" fill="rgba(0,0,0,0.08)" />

          {/* Feet Anchored on Floor */}
          <ellipse cx="92" cy="148" rx="9" ry="5" fill="#2d6a4f" />
          <ellipse cx="148" cy="148" rx="9" ry="5" fill="#2d6a4f" />

          {/* Animated Pip Body Group */}
          <g className="pip-anim-group" style={{ animation: `pipSquatBody ${animDuration} ease-in-out infinite`, transformOrigin: '120px 145px' }}>
            
            {/* Legs bending */}
            <line x1="102" y1="120" x2="92" y2="146" stroke="#52b788" strokeWidth="9" strokeLinecap="round" />
            <line x1="138" y1="120" x2="148" y2="146" stroke="#52b788" strokeWidth="9" strokeLinecap="round" />

            {/* Pip Body (Signature Pear Shape) */}
            <path
              d="M 120 40 C 146 40, 160 62, 160 88 C 160 110, 142 122, 120 122 C 98 122, 80 110, 80 88 C 80 62, 94 40, 120 40 Z"
              fill="#74c69d"
            />
            {/* Belly */}
            <ellipse cx="120" cy="94" rx="28" ry="20" fill="#ffffff" opacity="0.4" />

            {/* Cheeks Blush */}
            <circle cx="98" cy="84" r="7" fill="#ff9ebb" opacity="0.85" />
            <circle cx="142" cy="84" r="7" fill="#ff9ebb" opacity="0.85" />

            {/* Cute Happy Eyes */}
            <path d="M 100 74 Q 106 67, 112 74" stroke="#1b382b" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <path d="M 128 74 Q 134 67, 140 74" stroke="#1b382b" strokeWidth="3.2" strokeLinecap="round" fill="none" />

            {/* Smile */}
            <path d="M 114 84 Q 120 90, 126 84" stroke="#1b382b" strokeWidth="2.8" strokeLinecap="round" fill="none" />

            {/* Arms Reaching Forward for Balance */}
            <g style={{ animation: `pipSquatArms ${animDuration} ease-in-out infinite`, transformOrigin: '120px 80px' }}>
              <path d="M 94 88 Q 75 80, 68 76" stroke="#52b788" strokeWidth="7" strokeLinecap="round" fill="none" />
              <circle cx="66" cy="75" r="5" fill="#40916c" />
              <path d="M 146 88 Q 165 80, 172 76" stroke="#52b788" strokeWidth="7" strokeLinecap="round" fill="none" />
              <circle cx="174" cy="75" r="5" fill="#40916c" />
            </g>

            {/* Natural Sprouting Leaf on Head */}
            <g transform="translate(120, 40)">
              <path d="M 0 0 Q -3 -8, -10 -12" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M -10 -12 C -24 -18, -32 -10, -20 -4 C -13 -6, -10 -11, -10 -12 Z" fill="#40916c" />
              <path d="M -10 -12 Q -18 -12, -26 -11" stroke="#74c69d" strokeWidth="1" strokeLinecap="round" fill="none" />
              <path d="M -4 -6 C 5 -11, 14 -7, 7 0 C 1 -2, -3 -5, -4 -6 Z" fill="#52b788" />
            </g>
          </g>

          {/* Form Tag */}
          <g>
            <rect x="155" y="10" width="75" height="22" rx="11" fill="var(--bg-glass-card, #ffffff)" stroke="var(--border-subtle, #e2e8f0)" strokeWidth="1" />
            <text x="192" y="24" fontSize="8" fill="var(--text-secondary, #4a5568)" textAnchor="middle" fontWeight="bold">
              {isSlowMode ? '🐢 Slow Mode' : '✨ Smooth Demo'}
            </text>
          </g>
        </svg>
      )}

      {/* ========================================================================= */}
      {/* 2. PUSH-UP DEMONSTRATION — PIP DEMONSTRATOR                               */}
      {/* ========================================================================= */}
      {exerciseId === 'pushup' && (
        <svg width="240" height="175" viewBox="0 0 240 175">
          {/* Mat & Floor Line */}
          <line x1="20" y1="145" x2="220" y2="145" stroke="var(--border-subtle, #e2e8f0)" strokeWidth="3" strokeLinecap="round" />
          
          {/* Plank Line Guide */}
          <line x1="45" y1="138" x2="185" y2="75" stroke="#3a86c8" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
          <text x="115" y="65" fontSize="8" fill="#3a86c8" textAnchor="middle" fontWeight="bold">Straight Back & Core</text>

          {/* Feet Anchored */}
          <ellipse cx="45" cy="140" rx="8" ry="5" fill="#2d6a4f" />

          {/* Animated Body & Push Group */}
          <g className="pip-anim-group" style={{ animation: `pipPushupBody ${animDuration} ease-in-out infinite`, transformOrigin: '45px 140px' }}>
            
            {/* Pip Body in Plank Angle */}
            <g transform="translate(140, 85) rotate(22)">
              <path
                d="M 0 -35 C 24 -35, 36 -15, 36 10 C 36 30, 20 42, 0 42 C -20 42, -36 30, -36 10 C -36 -15, -24 -35, 0 -35 Z"
                fill="#74c69d"
              />
              {/* Belly */}
              <ellipse cx="0" cy="14" rx="22" ry="16" fill="#ffffff" opacity="0.4" />
              {/* Cheeks Blush */}
              <circle cx="-16" cy="4" r="5.5" fill="#ff9ebb" opacity="0.85" />
              <circle cx="16" cy="4" r="5.5" fill="#ff9ebb" opacity="0.85" />
              {/* Focused Determined Eyes */}
              <path d="M -14 -4 Q -9 -9, -4 -4" stroke="#1b382b" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <path d="M 6 -4 Q 11 -9, 16 -4" stroke="#1b382b" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              {/* Smile */}
              <path d="M -5 6 Q 0 10, 5 6" stroke="#1b382b" strokeWidth="2.4" strokeLinecap="round" fill="none" />
              
              {/* Sprout Leaf */}
              <g transform="translate(0, -35)">
                <path d="M 0 0 Q 6 -7, 12 -9" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M 12 -9 C 20 -13, 24 -6, 17 -1 C 12 -3, 11 -7, 12 -9 Z" fill="#40916c" />
              </g>
            </g>

            {/* Straight Legs Connection */}
            <line x1="45" y1="138" x2="115" y2="105" stroke="#52b788" strokeWidth="10" strokeLinecap="round" />

            {/* Animated Pushing Arms to Mat */}
            <g style={{ animation: `pipPushupArm ${animDuration} ease-in-out infinite`, transformOrigin: '160px 105px' }}>
              <path d="M 155 105 L 150 125 L 155 145" fill="none" stroke="#40916c" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="155" cy="145" r="5" fill="#2d6a4f" />
            </g>
          </g>

          {/* Form Tag */}
          <g>
            <rect x="155" y="10" width="75" height="22" rx="11" fill="var(--bg-glass-card, #ffffff)" stroke="var(--border-subtle, #e2e8f0)" strokeWidth="1" />
            <text x="192" y="24" fontSize="8" fill="var(--text-secondary, #4a5568)" textAnchor="middle" fontWeight="bold">
              {isSlowMode ? '🐢 Slow Mode' : '✨ Smooth Demo'}
            </text>
          </g>
        </svg>
      )}

      {/* ========================================================================= */}
      {/* 3. STEP LUNGE DEMONSTRATION — PIP DEMONSTRATOR                             */}
      {/* ========================================================================= */}
      {exerciseId === 'lunge' && (
        <svg width="240" height="175" viewBox="0 0 240 175">
          <line x1="20" y1="150" x2="220" y2="150" stroke="var(--border-subtle, #e2e8f0)" strokeWidth="3" strokeLinecap="round" />

          {/* Animated Pip Lunge Figure */}
          <g className="pip-anim-group" style={{ animation: `pipLungeBody ${animDuration} ease-in-out infinite`, transformOrigin: '120px 145px' }}>
            
            {/* Front Leg Bending (90 deg) */}
            <path d="M 120 115 L 160 115 L 160 148" fill="none" stroke="#52b788" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <ellipse cx="160" cy="148" rx="8" ry="4" fill="#2d6a4f" />

            {/* Back Leg Dropping Gently (90 deg) */}
            <path d="M 120 115 L 80 135 L 80 148" fill="none" stroke="#40916c" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <ellipse cx="80" cy="148" rx="8" ry="4" fill="#2d6a4f" />

            {/* Pip Upright Body */}
            <g transform="translate(120, 80)">
              <path
                d="M 0 -38 C 24 -38, 36 -18, 36 8 C 36 28, 20 40, 0 40 C -20 40, -36 28, -36 8 C -36 -18, -24 -38, 0 -38 Z"
                fill="#74c69d"
              />
              <ellipse cx="0" cy="14" rx="22" ry="16" fill="#ffffff" opacity="0.4" />
              <circle cx="-16" cy="4" r="5.5" fill="#ff9ebb" opacity="0.85" />
              <circle cx="16" cy="4" r="5.5" fill="#ff9ebb" opacity="0.85" />
              <path d="M -14 -4 Q -9 -9, -4 -4" stroke="#1b382b" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <path d="M 6 -4 Q 11 -9, 16 -4" stroke="#1b382b" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <path d="M -5 6 Q 0 10, 5 6" stroke="#1b382b" strokeWidth="2.4" strokeLinecap="round" fill="none" />

              {/* Hands cheerfully on hips */}
              <path d="M -30 10 Q -38 18, -28 26" fill="none" stroke="#52b788" strokeWidth="5" strokeLinecap="round" />
              <circle cx="-28" cy="26" r="4" fill="#40916c" />
              <path d="M 30 10 Q 38 18, 28 26" fill="none" stroke="#52b788" strokeWidth="5" strokeLinecap="round" />
              <circle cx="28" cy="26" r="4" fill="#40916c" />

              {/* Sprout Leaf */}
              <g transform="translate(0, -38)">
                <path d="M 0 0 Q -3 -8, -10 -12" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M -10 -12 C -24 -18, -32 -10, -20 -4 C -13 -6, -10 -11, -10 -12 Z" fill="#40916c" />
                <path d="M -4 -6 C 5 -11, 14 -7, 7 0 C 1 -2, -3 -5, -4 -6 Z" fill="#52b788" />
              </g>
            </g>
          </g>

          {/* 90 deg Cues */}
          <text x="170" y="112" fontSize="7.5" fill="#3a86c8" fontWeight="bold">90° Front</text>
          <text x="50" y="132" fontSize="7.5" fill="#3a86c8" fontWeight="bold">90° Back</text>

          {/* Form Tag */}
          <g>
            <rect x="155" y="10" width="75" height="22" rx="11" fill="var(--bg-glass-card, #ffffff)" stroke="var(--border-subtle, #e2e8f0)" strokeWidth="1" />
            <text x="192" y="24" fontSize="8" fill="var(--text-secondary, #4a5568)" textAnchor="middle" fontWeight="bold">
              {isSlowMode ? '🐢 Slow Mode' : '✨ Smooth Demo'}
            </text>
          </g>
        </svg>
      )}

      {/* ========================================================================= */}
      {/* 4. FOREARM PLANK HOLD DEMONSTRATION — PIP DEMONSTRATOR                    */}
      {/* ========================================================================= */}
      {exerciseId === 'plank' && (
        <svg width="240" height="175" viewBox="0 0 240 175">
          <line x1="20" y1="145" x2="220" y2="145" stroke="var(--border-subtle, #e2e8f0)" strokeWidth="3" strokeLinecap="round" />

          {/* Stable Straight Spine Alignment Line */}
          <line x1="50" y1="115" x2="165" y2="92" stroke="#3a86c8" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />

          {/* Warm Core Glow Pulse */}
          <circle 
            cx="115" 
            cy="104" 
            r="24" 
            fill="rgba(217, 119, 54, 0.25)" 
            style={{ animation: `pipPlankGlow ${isSlowMode ? '4s' : '2.5s'} ease-in-out infinite` }} 
          />
          <text x="115" y="108" fontSize="8" fill="#d97736" textAnchor="middle" fontWeight="bold">Gently Tighten Core</text>

          {/* Toes on Floor */}
          <ellipse cx="50" cy="140" rx="8" ry="5" fill="#2d6a4f" />

          {/* Pip Body in Plank Position */}
          <g className="pip-anim-group" style={{ animation: `pipBreatheSubtle ${isSlowMode ? '4s' : '2.5s'} ease-in-out infinite`, transformOrigin: '115px 105px' }}>
            
            {/* Pip Body Angled */}
            <g transform="translate(138, 92) rotate(16)">
              <path
                d="M 0 -35 C 24 -35, 36 -15, 36 10 C 36 30, 20 42, 0 42 C -20 42, -36 30, -36 10 C -36 -15, -24 -35, 0 -35 Z"
                fill="#74c69d"
              />
              <ellipse cx="0" cy="14" rx="22" ry="16" fill="#ffffff" opacity="0.4" />
              <circle cx="-16" cy="4" r="5.5" fill="#ff9ebb" opacity="0.85" />
              <circle cx="16" cy="4" r="5.5" fill="#ff9ebb" opacity="0.85" />
              
              {/* Peaceful Breathing Closed Eyes */}
              <path d="M -14 -2 Q -9 3, -4 -2" stroke="#1b382b" strokeWidth="2.6" strokeLinecap="round" fill="none" />
              <path d="M 6 -2 Q 11 3, 16 -2" stroke="#1b382b" strokeWidth="2.6" strokeLinecap="round" fill="none" />
              <path d="M -4 8 Q 0 12, 4 8" stroke="#1b382b" strokeWidth="2.2" strokeLinecap="round" fill="none" />

              {/* Sprout Leaf */}
              <g transform="translate(0, -35)">
                <path d="M 0 0 Q 5 -7, 10 -9" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M 10 -9 C 18 -13, 22 -6, 15 -1 C 10 -3, 9 -7, 10 -9 Z" fill="#40916c" />
              </g>
            </g>

            {/* Straight Legs Connection */}
            <line x1="50" y1="138" x2="115" y2="108" stroke="#52b788" strokeWidth="9" strokeLinecap="round" />

            {/* Forearms Resting Flat on Mat */}
            <line x1="150" y1="110" x2="150" y2="142" stroke="#40916c" strokeWidth="6" strokeLinecap="round" />
            <line x1="150" y1="142" x2="175" y2="142" stroke="#2d6a4f" strokeWidth="6" strokeLinecap="round" />
          </g>

          <text x="120" y="165" fontSize="8" fill="var(--text-muted, #718096)" textAnchor="middle">Breathe Smoothly & Hold (10–20s)</text>
        </svg>
      )}

      {/* ========================================================================= */}
      {/* 5. NECK & SHOULDER RESET DEMONSTRATION — PIP DEMONSTRATOR                 */}
      {/* ========================================================================= */}
      {exerciseId === 'stretch' && (
        <svg width="240" height="175" viewBox="0 0 240 175">
          {/* Seated Mat Base */}
          <line x1="50" y1="150" x2="190" y2="150" stroke="var(--border-subtle, #e2e8f0)" strokeWidth="3" strokeLinecap="round" />
          
          {/* Motion guideline arrows */}
          <path d="M 70 75 Q 60 62, 72 52" fill="none" stroke="#3a86c8" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M 170 75 Q 180 62, 168 52" fill="none" stroke="#3a86c8" strokeWidth="1.5" strokeDasharray="3 2" />

          {/* Pip Sitting Cross-Legged */}
          <ellipse cx="120" cy="146" rx="42" ry="10" fill="#52b788" />
          <ellipse cx="85" cy="146" rx="10" ry="5" fill="#2d6a4f" />
          <ellipse cx="155" cy="146" rx="10" ry="5" fill="#2d6a4f" />

          {/* Pip Body with Gentle Shoulder Circle & Neck Tilt */}
          <g className="pip-anim-group" style={{ animation: `pipShoulderRelax ${animDuration} ease-in-out infinite` }}>
            
            {/* Pip Torso */}
            <g style={{ animation: `pipNeckTilt ${animDuration} ease-in-out infinite`, transformOrigin: '120px 125px' }}>
              <path
                d="M 120 45 C 144 45, 156 65, 156 90 C 156 112, 138 124, 120 124 C 102 124, 84 112, 84 90 C 84 65, 96 45, 120 45 Z"
                fill="#74c69d"
              />
              <ellipse cx="120" cy="98" rx="26" ry="18" fill="#ffffff" opacity="0.4" />
              <circle cx="100" cy="88" r="6.5" fill="#ff9ebb" opacity="0.85" />
              <circle cx="140" cy="88" r="6.5" fill="#ff9ebb" opacity="0.85" />

              {/* Relaxed Calming Closed Eyes */}
              <path d="M 102 78 Q 107 83, 112 78" stroke="#1b382b" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <path d="M 128 78 Q 133 83, 138 78" stroke="#1b382b" strokeWidth="2.8" strokeLinecap="round" fill="none" />

              {/* Gentle Smile */}
              <path d="M 115 88 Q 120 92, 125 88" stroke="#1b382b" strokeWidth="2.4" strokeLinecap="round" fill="none" />

              {/* Resting Hands on Knees */}
              <circle cx="86" cy="118" r="5" fill="#40916c" />
              <circle cx="154" cy="118" r="5" fill="#40916c" />

              {/* Sprout Leaf Tilting with Head */}
              <g transform="translate(120, 45)">
                <path d="M 0 0 Q -3 -8, -10 -12" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M -10 -12 C -24 -18, -32 -10, -20 -4 C -13 -6, -10 -11, -10 -12 Z" fill="#40916c" />
                <path d="M -10 -12 Q -18 -12, -26 -11" stroke="#74c69d" strokeWidth="1" strokeLinecap="round" fill="none" />
                <path d="M -4 -6 C 5 -11, 14 -7, 7 0 C 1 -2, -3 -5, -4 -6 Z" fill="#52b788" />
              </g>
            </g>
          </g>

          <text x="120" y="165" fontSize="8" fill="var(--text-muted, #718096)" textAnchor="middle">Slow ear-to-shoulder release</text>
        </svg>
      )}

      {/* Visual Guide Badge */}
      <div style={{ position: 'absolute', bottom: 6, right: 10, display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', display: 'inline-block' }} />
        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pip Instructor 🌱</span>
      </div>
    </div>
  );
}
