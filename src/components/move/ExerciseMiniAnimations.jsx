import React from 'react';

/**
 * Rich, clear, calm, and continuous SVG animated exercise demonstrations.
 * Built to visually demonstrate starting position, movement path, correct stance,
 * ending position, and repetition, with full Slow Mode support.
 */

export default function ExerciseMiniAnimation({ exerciseId, isSlowMode = false, activeStepIdx = null }) {
  const primaryColor = 'var(--accent-primary, #2d6a4f)';
  const secondaryColor = 'var(--accent-secondary, #d97736)';
  const bodyColor = 'var(--text-primary, #2d3748)';
  const guideColor = '#3a86c8';

  const animDuration = isSlowMode ? '7s' : '3.6s';

  const containerStyle = {
    width: '100%',
    height: 190,
    background: 'radial-gradient(circle at center, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
    borderRadius: 'var(--radius-lg, 12px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    border: '1.5px solid var(--border-subtle, rgba(0,0,0,0.08))',
    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.04)'
  };

  return (
    <div style={containerStyle} aria-label={`${exerciseId} animation demonstration`}>
      <style>{`
        @keyframes squatLoop {
          0%, 100% {
            transform: translateY(0);
          }
          15% {
            transform: translateY(0);
          }
          45%, 60% {
            transform: translateY(22px);
          }
          85% {
            transform: translateY(0);
          }
        }

        @keyframes squatLegs {
          0%, 100% {
            d: path("M 90 70 L 76 110 M 90 70 L 104 110");
          }
          15% {
            d: path("M 90 70 L 76 110 M 90 70 L 104 110");
          }
          45%, 60% {
            d: path("M 90 86 L 68 86 L 72 110 M 90 86 L 112 86 L 108 110");
          }
          85% {
            d: path("M 90 70 L 76 110 M 90 70 L 104 110");
          }
        }

        @keyframes pushupLoop {
          0%, 100% {
            transform: rotate(0deg) translateY(0);
          }
          15% {
            transform: rotate(0deg) translateY(0);
          }
          45%, 60% {
            transform: rotate(-6deg) translateY(14px);
          }
          85% {
            transform: rotate(0deg) translateY(0);
          }
        }

        @keyframes lungeLegFront {
          0%, 100% {
            d: path("M 90 72 L 90 110 M 90 72 L 90 110");
          }
          15% {
            d: path("M 90 72 L 108 72 L 108 110 M 90 72 L 72 90 L 72 110");
          }
          45%, 60% {
            d: path("M 90 84 L 115 84 L 115 110 M 90 84 L 65 96 L 65 110");
          }
          85% {
            d: path("M 90 72 L 90 110 M 90 72 L 90 110");
          }
        }

        @keyframes gentlePulse {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.08); opacity: 1; }
        }

        @keyframes neckTilt {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-14deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(14deg); }
        }

        @keyframes shoulderCircle {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-4px); }
          50% { transform: translateY(2px); }
          75% { transform: translateY(-2px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .anim-squat-torso, .anim-squat-legs, .anim-pushup, .anim-lunge, .anim-neck, .anim-shoulder {
            animation: none !important;
          }
        }
      `}</style>

      {/* 1. SQUAT DEMONSTRATION */}
      {exerciseId === 'squat' && (
        <svg width="220" height="150" viewBox="0 0 220 150">
          {/* Ground surface */}
          <line x1="30" y1="130" x2="190" y2="130" stroke="var(--border-subtle)" strokeWidth="2.5" strokeDasharray="5 5" />
          
          {/* Stance indicator */}
          <path d="M 72 135 L 148 135" stroke={guideColor} strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="110" y="145" fontSize="8.5" fill={guideColor} textAnchor="middle" fontWeight="bold">Feet Shoulder-Width</text>

          {/* Animated Body Group */}
          <g style={{ animation: `squatLoop ${animDuration} ease-in-out infinite`, transformOrigin: '110px 110px' }}>
            {/* Head */}
            <circle cx="110" cy="30" r="11" fill={primaryColor} />
            {/* Smile / Eye indication */}
            <circle cx="106" cy="28" r="1.5" fill="#ffffff" />
            <circle cx="114" cy="28" r="1.5" fill="#ffffff" />
            
            {/* Torso */}
            <line x1="110" y1="41" x2="110" y2="78" stroke={bodyColor} strokeWidth="6" strokeLinecap="round" />
            
            {/* Arms reaching forward for balance */}
            <line x1="110" y1="52" x2="136" y2="52" stroke={secondaryColor} strokeWidth="4" strokeLinecap="round" />
            <line x1="110" y1="52" x2="84" y2="52" stroke={secondaryColor} strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* Animated Legs */}
          <g style={{ animation: `squatLoop ${animDuration} ease-in-out infinite`, transformOrigin: '110px 110px' }}>
            {/* Left leg */}
            <line x1="110" y1="78" x2="88" y2="130" stroke={bodyColor} strokeWidth="5.5" strokeLinecap="round" />
            {/* Right leg */}
            <line x1="110" y1="78" x2="132" y2="130" stroke={bodyColor} strokeWidth="5.5" strokeLinecap="round" />
          </g>

          {/* Form Checkpoint Badge */}
          <g opacity={isSlowMode ? "1" : "0.9"}>
            <rect x="145" y="16" width="68" height="20" rx="10" fill="var(--bg-glass-card)" stroke="var(--border-subtle)" strokeWidth="1" />
            <text x="179" y="29" fontSize="7.5" fill="var(--text-secondary)" textAnchor="middle" fontWeight="bold">
              {isSlowMode ? '🐢 Slow Demo' : '✨ Smooth Loop'}
            </text>
          </g>
        </svg>
      )}

      {/* 2. PUSH-UP DEMONSTRATION */}
      {exerciseId === 'pushup' && (
        <svg width="220" height="150" viewBox="0 0 220 150">
          {/* Ground/Mat Line */}
          <line x1="30" y1="125" x2="190" y2="125" stroke="var(--border-subtle)" strokeWidth="3" />
          
          {/* Plank Line Guide */}
          <line x1="50" y1="118" x2="160" y2="65" stroke={guideColor} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
          <text x="105" y="55" fontSize="8" fill={guideColor} textAnchor="middle" fontWeight="bold">Straight Back & Core</text>

          {/* Animated Body & Push Group */}
          <g style={{ animation: `pushupLoop ${animDuration} ease-in-out infinite`, transformOrigin: '55px 120px' }}>
            {/* Head */}
            <circle cx="160" cy="72" r="10" fill={primaryColor} />
            
            {/* Torso straight through hips */}
            <line x1="160" y1="78" x2="55" y2="120" stroke={bodyColor} strokeWidth="6" strokeLinecap="round" />
            
            {/* Arm pushing to mat */}
            <path d="M 148 83 L 140 102 L 148 125" fill="none" stroke={secondaryColor} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Feet anchor */}
            <circle cx="55" cy="122" r="4" fill={bodyColor} />
          </g>

          {/* Form checkpoint tag */}
          <g>
            <rect x="145" y="16" width="68" height="20" rx="10" fill="var(--bg-glass-card)" stroke="var(--border-subtle)" strokeWidth="1" />
            <text x="179" y="29" fontSize="7.5" fill="var(--text-secondary)" textAnchor="middle" fontWeight="bold">
              {isSlowMode ? '🐢 Slow Demo' : '✨ Smooth Loop'}
            </text>
          </g>
        </svg>
      )}

      {/* 3. STEP LUNGE DEMONSTRATION */}
      {exerciseId === 'lunge' && (
        <svg width="220" height="150" viewBox="0 0 220 150">
          <line x1="30" y1="130" x2="190" y2="130" stroke="var(--border-subtle)" strokeWidth="2.5" />

          {/* Animated Lunge Figure */}
          <g style={{ animation: `squatLoop ${animDuration} ease-in-out infinite`, transformOrigin: '110px 110px' }}>
            {/* Head */}
            <circle cx="105" cy="32" r="10" fill={primaryColor} />
            {/* Torso upright */}
            <line x1="105" y1="42" x2="105" y2="80" stroke={bodyColor} strokeWidth="5.5" strokeLinecap="round" />
            
            {/* Hands on hips */}
            <path d="M 105 52 L 118 64 L 112 75" fill="none" stroke={bodyColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 105 52 L 92 64 L 98 75" fill="none" stroke={bodyColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Front leg bending to 90 deg */}
            <path d="M 105 80 L 140 80 L 140 130" fill="none" stroke={secondaryColor} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Back leg dropping gently */}
            <path d="M 105 80 L 75 105 L 75 130" fill="none" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* 90 deg angle checkpoint */}
          <text x="145" y="74" fontSize="8" fill={guideColor} fontWeight="bold">90° Front</text>
          <text x="50" y="102" fontSize="8" fill={guideColor} fontWeight="bold">90° Back</text>
        </svg>
      )}

      {/* 4. FOREARM PLANK HOLD DEMONSTRATION */}
      {exerciseId === 'plank' && (
        <svg width="220" height="150" viewBox="0 0 220 150">
          <line x1="30" y1="125" x2="190" y2="125" stroke="var(--border-subtle)" strokeWidth="3" />

          {/* Stable Straight Spine */}
          <line x1="60" y1="105" x2="155" y2="85" stroke={primaryColor} strokeWidth="6" strokeLinecap="round" />
          
          {/* Head */}
          <circle cx="165" cy="80" r="10" fill={primaryColor} />

          {/* Forearms resting flat on mat */}
          <line x1="145" y1="90" x2="145" y2="125" stroke={bodyColor} strokeWidth="4.5" strokeLinecap="round" />
          <line x1="145" y1="125" x2="165" y2="125" stroke={secondaryColor} strokeWidth="4.5" strokeLinecap="round" />

          {/* Toes on ground */}
          <circle cx="60" cy="115" r="4" fill={bodyColor} />

          {/* Calming Core Glow Pulse */}
          <circle 
            cx="110" 
            cy="95" 
            r="16" 
            fill="rgba(217, 119, 54, 0.2)" 
            style={{ animation: `gentlePulse ${isSlowMode ? '4s' : '2.5s'} ease-in-out infinite` }} 
          />
          <text x="110" y="99" fontSize="8" fill={secondaryColor} textAnchor="middle" fontWeight="bold">Tighten Tummy</text>
          <text x="110" y="142" fontSize="8.5" fill="var(--text-muted)" textAnchor="middle">Breathe Smoothly & Hold</text>
        </svg>
      )}

      {/* 5. NECK & SHOULDER RESET DEMONSTRATION */}
      {exerciseId === 'stretch' && (
        <svg width="220" height="150" viewBox="0 0 220 150">
          {/* Seated base */}
          <line x1="60" y1="135" x2="160" y2="135" stroke="var(--border-subtle)" strokeWidth="2.5" />

          {/* Shoulders with gentle rolling */}
          <g style={{ animation: `shoulderCircle ${animDuration} ease-in-out infinite` }}>
            <line x1="110" y1="62" x2="110" y2="110" stroke={bodyColor} strokeWidth="6" strokeLinecap="round" />
            <line x1="75" y1="72" x2="145" y2="72" stroke={secondaryColor} strokeWidth="5" strokeLinecap="round" />
          </g>

          {/* Head with gentle tilt animation */}
          <g style={{ animation: `neckTilt ${animDuration} ease-in-out infinite`, transformOrigin: '110px 62px' }}>
            <circle cx="110" cy="40" r="13" fill={primaryColor} />
            <circle cx="106" cy="38" r="1.5" fill="#ffffff" />
            <circle cx="114" cy="38" r="1.5" fill="#ffffff" />
          </g>

          {/* Motion guideline arrows */}
          <path d="M 68 70 Q 60 60 70 54" fill="none" stroke={guideColor} strokeWidth="1.5" markerEnd="url(#arrow)" />
          <path d="M 152 70 Q 160 60 150 54" fill="none" stroke={guideColor} strokeWidth="1.5" markerEnd="url(#arrow)" />
          <text x="110" y="145" fontSize="8.5" fill="var(--text-muted)" textAnchor="middle">Slow ear-to-shoulder release</text>
        </svg>
      )}

      {/* Interactive Helper Cue */}
      <div style={{ position: 'absolute', bottom: 6, right: 10, display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', display: 'inline-block' }} />
        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>Visual Guide</span>
      </div>
    </div>
  );
}

