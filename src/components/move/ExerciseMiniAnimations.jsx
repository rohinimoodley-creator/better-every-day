import React from 'react';

/**
 * Pip IS the Exercise Demonstrator!
 * Animated SVG character demonstrations with functional, expressive limbs showing:
 * - Clear starting posture & stance
 * - Accurate biomechanical movement trajectory (Squats, Marching, Heel Raises, Arm Swings, Push-ups, Lunges, Planks, Stretches)
 * - Articulated arms (elbows/hands) and legs (hips/knees/feet)
 * - Pause / Peak hold at the apex of movement
 * - Controlled return to starting position
 * - Full Slow Mode support (7.5s vs 3.8s)
 * - Pip's signature character design: sprout leaf, cute eyes, rosy blush, soft belly, hands & shoes.
 */

export default function ExerciseMiniAnimation({ exerciseId = 'squat', isSlowMode = false }) {
  const animDuration = isSlowMode ? '7.5s' : '3.8s';

  const containerStyle = {
    width: '100%',
    height: 220,
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
        /* =========================================================================
           1. SQUAT KEYFRAMES: Hips Back, Knees 90°, Arms Extend, Pause, Drive Up
           ========================================================================= */
        @keyframes pipSquatHips {
          0%, 100% {
            transform: translateY(0px) scale(1, 1);
          }
          15% {
            transform: translateY(0px) scale(1, 1);
          }
          45%, 62% {
            transform: translateY(32px) translateX(-4px) scale(1.06, 0.92);
          }
          85% {
            transform: translateY(0px) scale(1, 1);
          }
        }

        @keyframes pipSquatThighLeft {
          0%, 15%, 85%, 100% {
            d: path("M 104 116 L 88 132 L 88 152");
          }
          45%, 62% {
            d: path("M 100 138 L 68 140 L 88 152");
          }
        }

        @keyframes pipSquatThighRight {
          0%, 15%, 85%, 100% {
            d: path("M 136 116 L 152 132 L 152 152");
          }
          45%, 62% {
            d: path("M 140 138 L 172 140 L 152 152");
          }
        }

        @keyframes pipSquatArmsReach {
          0%, 15%, 85%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          45%, 62% {
            transform: translateY(-8px) rotate(-55deg);
          }
        }

        /* =========================================================================
           2. MARCHING IN PLACE KEYFRAMES: Alternating High Knee + Opposite Arm
           ========================================================================= */
        @keyframes pipMarchLegLeft {
          0%, 45%, 100% {
            d: path("M 106 118 L 102 136 L 102 154");
          }
          15%, 32% {
            /* High Knee Lift (90 deg hip & knee) */
            d: path("M 106 118 L 82 118 L 82 138");
          }
        }

        @keyframes pipMarchFootLeft {
          0%, 45%, 100% {
            transform: translate(0px, 0px);
          }
          15%, 32% {
            transform: translate(-20px, -16px);
          }
        }

        @keyframes pipMarchLegRight {
          0%, 55%, 100% {
            d: path("M 134 118 L 138 136 L 138 154");
          }
          65%, 82% {
            /* High Knee Lift (90 deg hip & knee) */
            d: path("M 134 118 L 158 118 L 158 138");
          }
        }

        @keyframes pipMarchFootRight {
          0%, 55%, 100% {
            transform: translate(0px, 0px);
          }
          65%, 82% {
            transform: translate(20px, -16px);
          }
        }

        @keyframes pipMarchArmLeft {
          0%, 45%, 100% {
            transform: rotate(0deg);
          }
          15%, 32% {
            /* Left leg is high -> Left arm swings back */
            transform: rotate(35deg);
          }
          65%, 82% {
            /* Right leg is high -> Left arm swings forward high */
            transform: rotate(-50deg);
          }
        }

        @keyframes pipMarchArmRight {
          0%, 45%, 100% {
            transform: rotate(0deg);
          }
          15%, 32% {
            /* Left leg is high -> Right arm swings forward high */
            transform: rotate(-50deg);
          }
          65%, 82% {
            /* Right leg is high -> Right arm swings back */
            transform: rotate(35deg);
          }
        }

        @keyframes pipMarchTorsoBuoyancy {
          0%, 50%, 100% {
            transform: translateY(0px);
          }
          20%, 70% {
            transform: translateY(-4px);
          }
        }

        /* =========================================================================
           3. ARM SWINGS KEYFRAMES: Full Smooth Shoulder Range of Motion
           ========================================================================= */
        @keyframes pipArmSwingBoth {
          0%, 100% {
            transform: rotate(0deg);
          }
          15% {
            transform: rotate(0deg);
          }
          40%, 55% {
            /* Forward & upward reach */
            transform: rotate(-65deg);
          }
          75%, 88% {
            /* Backwards reach past hips */
            transform: rotate(40deg);
          }
        }

        @keyframes pipArmSwingTorso {
          0%, 100% {
            transform: translateY(0px) scale(1, 1);
          }
          40%, 55% {
            transform: translateY(-5px) scale(0.98, 1.02);
          }
          75%, 88% {
            transform: translateY(4px) scale(1.02, 0.98);
          }
        }

        /* =========================================================================
           4. HEEL RAISES KEYFRAMES: Rising on Balls of Feet, Hold, Lower Controlled
           ========================================================================= */
        @keyframes pipHeelRaiseBody {
          0%, 15%, 90%, 100% {
            transform: translateY(0px);
          }
          45%, 65% {
            /* Elevate high onto toes */
            transform: translateY(-24px);
          }
        }

        @keyframes pipHeelRaiseFeet {
          0%, 15%, 90%, 100% {
            transform: scaleY(1);
          }
          45%, 65% {
            /* Heel lifts, ball of foot stays grounded */
            transform: scaleY(0.7) translateY(-8px);
          }
        }

        /* =========================================================================
           5. PUSH-UP KEYFRAMES: Elbow Bend, Neutral Spine, Hover Hold, Push
           ========================================================================= */
        @keyframes pipPushupPlankBody {
          0%, 15%, 88%, 100% {
            transform: rotate(0deg) translateY(0px);
          }
          48%, 62% {
            transform: rotate(-11deg) translateY(24px);
          }
        }

        @keyframes pipPushupElbows {
          0%, 15%, 88%, 100% {
            d: path("M 155 105 L 152 128 L 155 148");
          }
          48%, 62% {
            /* Elbow bends 90 deg backward */
            d: path("M 155 105 L 134 118 L 155 148");
          }
        }

        /* =========================================================================
           6. STEP LUNGE KEYFRAMES: 90 deg Front & Back Knees, Upright Torso
           ========================================================================= */
        @keyframes pipLungeTorso {
          0%, 15%, 88%, 100% {
            transform: translateY(0px);
          }
          45%, 62% {
            transform: translateY(28px);
          }
        }

        @keyframes pipLungeFrontLegPath {
          0%, 15%, 88%, 100% {
            d: path("M 120 115 L 140 132 L 140 152");
          }
          45%, 62% {
            /* Clean 90 deg front knee bend */
            d: path("M 120 125 L 165 125 L 165 152");
          }
        }

        @keyframes pipLungeBackLegPath {
          0%, 15%, 88%, 100% {
            d: path("M 120 115 L 100 132 L 100 152");
          }
          45%, 62% {
            /* Clean 90 deg back knee dropping toward floor */
            d: path("M 120 125 L 85 142 L 85 152");
          }
        }

        /* =========================================================================
           7. FOREARM PLANK & STRETCH KEYFRAMES
           ========================================================================= */
        @keyframes pipPlankGlow {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.18); }
        }

        @keyframes pipBreatheSubtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        @keyframes pipNeckStretchTilt {
          0%, 100% { transform: rotate(0deg); }
          20%, 42% { transform: rotate(-22deg); }
          50% { transform: rotate(0deg); }
          70%, 92% { transform: rotate(22deg); }
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
        <svg width="250" height="190" viewBox="0 0 250 190">
          {/* Ground floor line */}
          <line x1="20" y1="156" x2="230" y2="156" stroke="var(--border-subtle, #cbd5e1)" strokeWidth="3" strokeLinecap="round" />
          
          {/* Stance Indicator */}
          <line x1="88" y1="164" x2="152" y2="164" stroke="#3a86c8" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="88" cy="164" r="2" fill="#3a86c8" />
          <circle cx="152" cy="164" r="2" fill="#3a86c8" />
          <text x="120" y="176" fontSize="8.5" fill="#3a86c8" textAnchor="middle" fontWeight="bold">Feet Shoulder-Width Flat</text>

          {/* Pip Dynamic Floor Shadow */}
          <ellipse cx="120" cy="156" rx="42" ry="7" fill="rgba(0,0,0,0.08)" />

          {/* Feet Anchored Firmly to Floor */}
          <ellipse cx="88" cy="154" rx="10" ry="5" fill="#2d6a4f" />
          <ellipse cx="152" cy="154" rx="10" ry="5" fill="#2d6a4f" />

          {/* Dynamic Articulated Legs (Bend smoothly into 90 deg) */}
          <path
            className="pip-anim-group"
            d="M 104 116 L 88 132 L 88 152"
            fill="none"
            stroke="#52b788"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: `pipSquatThighLeft ${animDuration} ease-in-out infinite` }}
          />
          <path
            className="pip-anim-group"
            d="M 136 116 L 152 132 L 152 152"
            fill="none"
            stroke="#52b788"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: `pipSquatThighRight ${animDuration} ease-in-out infinite` }}
          />

          {/* Animated Torso & Head Group (Hips hinge back & down) */}
          <g className="pip-anim-group" style={{ animation: `pipSquatHips ${animDuration} ease-in-out infinite`, transformOrigin: '120px 150px' }}>
            
            {/* Pip Pear-Shaped Mascot Body */}
            <path
              d="M 120 36 C 146 36, 160 58, 160 84 C 160 108, 142 120, 120 120 C 98 120, 80 108, 80 84 C 80 58, 94 36, 120 36 Z"
              fill="#74c69d"
            />
            {/* Belly highlight */}
            <ellipse cx="120" cy="90" rx="28" ry="20" fill="#ffffff" opacity="0.38" />

            {/* Rosy Cheeks */}
            <circle cx="98" cy="80" r="7" fill="#ff9ebb" opacity="0.85" />
            <circle cx="142" cy="80" r="7" fill="#ff9ebb" opacity="0.85" />

            {/* Focused Happy Eyes looking forward */}
            <path d="M 100 70 Q 106 63, 112 70" stroke="#1b382b" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <path d="M 128 70 Q 134 63, 140 70" stroke="#1b382b" strokeWidth="3.2" strokeLinecap="round" fill="none" />

            {/* Confident Smile */}
            <path d="M 114 80 Q 120 86, 126 80" stroke="#1b382b" strokeWidth="2.8" strokeLinecap="round" fill="none" />

            {/* Functional Articulated Arms: Reaching forward for Counterbalance */}
            <g style={{ animation: `pipSquatArmsReach ${animDuration} ease-in-out infinite`, transformOrigin: '120px 76px' }}>
              {/* Left Arm & Mitten Hand */}
              <path d="M 94 84 L 72 84 L 62 82" stroke="#52b788" strokeWidth="7.5" strokeLinecap="round" fill="none" />
              <circle cx="60" cy="82" r="5" fill="#40916c" />
              {/* Right Arm & Mitten Hand */}
              <path d="M 146 84 L 168 84 L 178 82" stroke="#52b788" strokeWidth="7.5" strokeLinecap="round" fill="none" />
              <circle cx="180" cy="82" r="5" fill="#40916c" />
            </g>

            {/* Pip's Signature Sprout Leaf */}
            <g transform="translate(120, 36)">
              <path d="M 0 0 Q -3 -8, -10 -12" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M -10 -12 C -24 -18, -32 -10, -20 -4 C -13 -6, -10 -11, -10 -12 Z" fill="#40916c" />
              <path d="M -10 -12 Q -18 -12, -26 -11" stroke="#74c69d" strokeWidth="1" strokeLinecap="round" fill="none" />
              <path d="M -4 -6 C 5 -11, 14 -7, 7 0 C 1 -2, -3 -5, -4 -6 Z" fill="#52b788" />
            </g>
          </g>

          {/* Form Cues Badge */}
          <g transform="translate(160, 10)">
            <rect x="0" y="0" width="82" height="22" rx="11" fill="var(--bg-glass-card, #ffffff)" stroke="var(--border-subtle, #e2e8f0)" strokeWidth="1" />
            <text x="41" y="14" fontSize="8" fill="var(--text-secondary, #4a5568)" textAnchor="middle" fontWeight="bold">
              {isSlowMode ? '🐢 Slow Mode' : '✨ Technique Demo'}
            </text>
          </g>
        </svg>
      )}

      {/* ========================================================================= */}
      {/* 2. MARCHING IN PLACE DEMONSTRATION — PIP DEMONSTRATOR                      */}
      {/* ========================================================================= */}
      {exerciseId === 'march' && (
        <svg width="250" height="190" viewBox="0 0 250 190">
          <line x1="20" y1="156" x2="230" y2="156" stroke="var(--border-subtle, #cbd5e1)" strokeWidth="3" strokeLinecap="round" />
          
          <text x="120" y="176" fontSize="8.5" fill="#40916c" textAnchor="middle" fontWeight="bold">Opposite Arm & Knee Rhythms</text>
          
          {/* Shadow */}
          <ellipse cx="120" cy="156" rx="40" ry="6" fill="rgba(0,0,0,0.08)" />

          {/* Left Articulated Leg (Lifting high to 90 deg) */}
          <path
            className="pip-anim-group"
            d="M 106 118 L 102 136 L 102 154"
            fill="none"
            stroke="#52b788"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: `pipMarchLegLeft ${animDuration} ease-in-out infinite` }}
          />
          <g className="pip-anim-group" style={{ animation: `pipMarchFootLeft ${animDuration} ease-in-out infinite` }}>
            <ellipse cx="102" cy="154" rx="9" ry="5" fill="#2d6a4f" />
          </g>

          {/* Right Articulated Leg (Lifting high to 90 deg) */}
          <path
            className="pip-anim-group"
            d="M 134 118 L 138 136 L 138 154"
            fill="none"
            stroke="#52b788"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: `pipMarchLegRight ${animDuration} ease-in-out infinite` }}
          />
          <g className="pip-anim-group" style={{ animation: `pipMarchFootRight ${animDuration} ease-in-out infinite` }}>
            <ellipse cx="138" cy="154" rx="9" ry="5" fill="#2d6a4f" />
          </g>

          {/* Torso & Head with Marching Buoyancy */}
          <g className="pip-anim-group" style={{ animation: `pipMarchTorsoBuoyancy ${animDuration} ease-in-out infinite` }}>
            <path
              d="M 120 36 C 146 36, 160 58, 160 84 C 160 108, 142 120, 120 120 C 98 120, 80 108, 80 84 C 80 58, 94 36, 120 36 Z"
              fill="#74c69d"
            />
            <ellipse cx="120" cy="90" rx="28" ry="20" fill="#ffffff" opacity="0.38" />

            <circle cx="98" cy="80" r="7" fill="#ff9ebb" opacity="0.85" />
            <circle cx="142" cy="80" r="7" fill="#ff9ebb" opacity="0.85" />

            <path d="M 100 70 Q 106 63, 112 70" stroke="#1b382b" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <path d="M 128 70 Q 134 63, 140 70" stroke="#1b382b" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <path d="M 114 80 Q 120 86, 126 80" stroke="#1b382b" strokeWidth="2.8" strokeLinecap="round" fill="none" />

            {/* Left Arm with March Swing */}
            <g style={{ animation: `pipMarchArmLeft ${animDuration} ease-in-out infinite`, transformOrigin: '92px 76px' }}>
              <path d="M 92 76 L 76 90 L 66 84" stroke="#52b788" strokeWidth="7.5" strokeLinecap="round" fill="none" />
              <circle cx="64" cy="84" r="5" fill="#40916c" />
            </g>

            {/* Right Arm with March Swing */}
            <g style={{ animation: `pipMarchArmRight ${animDuration} ease-in-out infinite`, transformOrigin: '148px 76px' }}>
              <path d="M 148 76 L 164 90 L 174 84" stroke="#52b788" strokeWidth="7.5" strokeLinecap="round" fill="none" />
              <circle cx="176" cy="84" r="5" fill="#40916c" />
            </g>

            {/* Sprout Leaf */}
            <g transform="translate(120, 36)">
              <path d="M 0 0 Q -3 -8, -10 -12" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M -10 -12 C -24 -18, -32 -10, -20 -4 C -13 -6, -10 -11, -10 -12 Z" fill="#40916c" />
              <path d="M -4 -6 C 5 -11, 14 -7, 7 0 C 1 -2, -3 -5, -4 -6 Z" fill="#52b788" />
            </g>
          </g>

          {/* Form Tag */}
          <g transform="translate(160, 10)">
            <rect x="0" y="0" width="82" height="22" rx="11" fill="var(--bg-glass-card, #ffffff)" stroke="var(--border-subtle, #e2e8f0)" strokeWidth="1" />
            <text x="41" y="14" fontSize="8" fill="var(--text-secondary, #4a5568)" textAnchor="middle" fontWeight="bold">
              {isSlowMode ? '🐢 Slow Mode' : '✨ High Knees 90°'}
            </text>
          </g>
        </svg>
      )}

      {/* ========================================================================= */}
      {/* 3. ARM SWINGS DEMONSTRATION — PIP DEMONSTRATOR                            */}
      {/* ========================================================================= */}
      {exerciseId === 'arm_swing' && (
        <svg width="250" height="190" viewBox="0 0 250 190">
          <line x1="20" y1="156" x2="230" y2="156" stroke="var(--border-subtle, #cbd5e1)" strokeWidth="3" strokeLinecap="round" />
          
          {/* Arc Range Motion Path */}
          <path d="M 60 76 Q 50 100, 75 125" fill="none" stroke="#3a86c8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          <path d="M 190 76 Q 200 100, 175 125" fill="none" stroke="#3a86c8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          <text x="120" y="176" fontSize="8.5" fill="#3a86c8" textAnchor="middle" fontWeight="bold">Relaxed Shoulder Arc (Forward & Back)</text>

          <ellipse cx="120" cy="156" rx="40" ry="6" fill="rgba(0,0,0,0.08)" />

          {/* Feet Anchored */}
          <ellipse cx="98" cy="154" rx="9" ry="5" fill="#2d6a4f" />
          <ellipse cx="142" cy="154" rx="9" ry="5" fill="#2d6a4f" />
          <line x1="106" y1="120" x2="98" y2="154" stroke="#52b788" strokeWidth="9" strokeLinecap="round" />
          <line x1="134" y1="120" x2="142" y2="154" stroke="#52b788" strokeWidth="9" strokeLinecap="round" />

          {/* Torso & Swivel */}
          <g className="pip-anim-group" style={{ animation: `pipArmSwingTorso ${animDuration} ease-in-out infinite` }}>
            <path
              d="M 120 38 C 146 38, 160 60, 160 86 C 160 110, 142 122, 120 122 C 98 120, 80 110, 80 86 C 80 60, 94 38, 120 38 Z"
              fill="#74c69d"
            />
            <ellipse cx="120" cy="92" rx="28" ry="20" fill="#ffffff" opacity="0.38" />
            <circle cx="98" cy="82" r="7" fill="#ff9ebb" opacity="0.85" />
            <circle cx="142" cy="82" r="7" fill="#ff9ebb" opacity="0.85" />
            <path d="M 100 72 Q 106 65, 112 72" stroke="#1b382b" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <path d="M 128 72 Q 134 65, 140 72" stroke="#1b382b" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <path d="M 114 82 Q 120 88, 126 82" stroke="#1b382b" strokeWidth="2.8" strokeLinecap="round" fill="none" />

            {/* Both Functional Arms Swinging in Full Range Arc */}
            <g style={{ animation: `pipArmSwingBoth ${animDuration} ease-in-out infinite`, transformOrigin: '94px 78px' }}>
              <path d="M 94 78 L 74 100 L 64 108" stroke="#52b788" strokeWidth="7.5" strokeLinecap="round" fill="none" />
              <circle cx="62" cy="109" r="5" fill="#40916c" />
            </g>

            <g style={{ animation: `pipArmSwingBoth ${animDuration} ease-in-out infinite`, transformOrigin: '146px 78px' }}>
              <path d="M 146 78 L 166 100 L 176 108" stroke="#52b788" strokeWidth="7.5" strokeLinecap="round" fill="none" />
              <circle cx="178" cy="109" r="5" fill="#40916c" />
            </g>

            {/* Sprout Leaf */}
            <g transform="translate(120, 38)">
              <path d="M 0 0 Q -3 -8, -10 -12" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M -10 -12 C -24 -18, -32 -10, -20 -4 C -13 -6, -10 -11, -10 -12 Z" fill="#40916c" />
              <path d="M -4 -6 C 5 -11, 14 -7, 7 0 C 1 -2, -3 -5, -4 -6 Z" fill="#52b788" />
            </g>
          </g>

          <g transform="translate(160, 10)">
            <rect x="0" y="0" width="82" height="22" rx="11" fill="var(--bg-glass-card, #ffffff)" stroke="var(--border-subtle, #e2e8f0)" strokeWidth="1" />
            <text x="41" y="14" fontSize="8" fill="var(--text-secondary, #4a5568)" textAnchor="middle" fontWeight="bold">
              {isSlowMode ? '🐢 Slow Mode' : '✨ Smooth Swing'}
            </text>
          </g>
        </svg>
      )}

      {/* ========================================================================= */}
      {/* 4. HEEL / CALF RAISES DEMONSTRATION — PIP DEMONSTRATOR                    */}
      {/* ========================================================================= */}
      {exerciseId === 'heel_raise' && (
        <svg width="250" height="190" viewBox="0 0 250 190">
          <line x1="20" y1="156" x2="230" y2="156" stroke="var(--border-subtle, #cbd5e1)" strokeWidth="3" strokeLinecap="round" />
          
          {/* Vertical elevation arrow */}
          <line x1="60" y1="140" x2="60" y2="110" stroke="#3a86c8" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M 57 114 L 60 108 L 63 114" fill="none" stroke="#3a86c8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="120" y="176" fontSize="8.5" fill="#3a86c8" textAnchor="middle" fontWeight="bold">Lift Heels High onto Balls of Feet → Hold → Lower</text>

          <ellipse cx="120" cy="156" rx="38" ry="6" fill="rgba(0,0,0,0.08)" />

          {/* Pip Whole Body & Heels Elevating in Synchronization */}
          <g className="pip-anim-group" style={{ animation: `pipHeelRaiseBody ${animDuration} ease-in-out infinite` }}>
            
            {/* Legs with articulated calves */}
            <line x1="102" y1="116" x2="98" y2="148" stroke="#52b788" strokeWidth="9" strokeLinecap="round" />
            <line x1="138" y1="116" x2="142" y2="148" stroke="#52b788" strokeWidth="9" strokeLinecap="round" />

            {/* Feet / Shoes Pivoting on Balls */}
            <g style={{ animation: `pipHeelRaiseFeet ${animDuration} ease-in-out infinite` }}>
              <ellipse cx="98" cy="150" rx="9" ry="5" fill="#2d6a4f" />
              <ellipse cx="142" cy="150" rx="9" ry="5" fill="#2d6a4f" />
            </g>

            {/* Upright Torso */}
            <path
              d="M 120 36 C 146 36, 160 58, 160 84 C 160 108, 142 120, 120 120 C 98 120, 80 108, 80 84 C 80 58, 94 36, 120 36 Z"
              fill="#74c69d"
            />
            <ellipse cx="120" cy="90" rx="28" ry="20" fill="#ffffff" opacity="0.38" />
            <circle cx="98" cy="80" r="7" fill="#ff9ebb" opacity="0.85" />
            <circle cx="142" cy="80" r="7" fill="#ff9ebb" opacity="0.85" />
            <path d="M 100 70 Q 106 63, 112 70" stroke="#1b382b" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <path d="M 128 70 Q 134 63, 140 70" stroke="#1b382b" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <path d="M 114 80 Q 120 86, 126 80" stroke="#1b382b" strokeWidth="2.8" strokeLinecap="round" fill="none" />

            {/* Hands comfortably on hips for balance */}
            <path d="M 94 84 Q 80 94, 90 106" fill="none" stroke="#52b788" strokeWidth="6" strokeLinecap="round" />
            <circle cx="92" cy="106" r="4.5" fill="#40916c" />
            <path d="M 146 84 Q 160 94, 150 106" fill="none" stroke="#52b788" strokeWidth="6" strokeLinecap="round" />
            <circle cx="148" cy="106" r="4.5" fill="#40916c" />

            {/* Sprout Leaf */}
            <g transform="translate(120, 36)">
              <path d="M 0 0 Q -3 -8, -10 -12" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M -10 -12 C -24 -18, -32 -10, -20 -4 C -13 -6, -10 -11, -10 -12 Z" fill="#40916c" />
              <path d="M -4 -6 C 5 -11, 14 -7, 7 0 C 1 -2, -3 -5, -4 -6 Z" fill="#52b788" />
            </g>
          </g>

          <g transform="translate(160, 10)">
            <rect x="0" y="0" width="82" height="22" rx="11" fill="var(--bg-glass-card, #ffffff)" stroke="var(--border-subtle, #e2e8f0)" strokeWidth="1" />
            <text x="41" y="14" fontSize="8" fill="var(--text-secondary, #4a5568)" textAnchor="middle" fontWeight="bold">
              {isSlowMode ? '🐢 Slow Mode' : '✨ High Calf Hold'}
            </text>
          </g>
        </svg>
      )}

      {/* ========================================================================= */}
      {/* 5. PUSH-UP DEMONSTRATION — PIP DEMONSTRATOR                               */}
      {/* ========================================================================= */}
      {exerciseId === 'pushup' && (
        <svg width="250" height="190" viewBox="0 0 250 190">
          <line x1="20" y1="152" x2="230" y2="152" stroke="var(--border-subtle, #cbd5e1)" strokeWidth="3" strokeLinecap="round" />
          
          {/* Alignment guide line */}
          <line x1="48" y1="144" x2="190" y2="82" stroke="#3a86c8" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
          <text x="120" y="68" fontSize="8.5" fill="#3a86c8" textAnchor="middle" fontWeight="bold">Straight Spine & 45° Elbows</text>

          {/* Feet Anchored on Floor */}
          <ellipse cx="48" cy="146" rx="8" ry="5" fill="#2d6a4f" />

          {/* Animated Body & Push Group */}
          <g className="pip-anim-group" style={{ animation: `pipPushupPlankBody ${animDuration} ease-in-out infinite`, transformOrigin: '48px 146px' }}>
            
            {/* Pip Body in Plank Angle */}
            <g transform="translate(142, 90) rotate(22)">
              <path
                d="M 0 -35 C 24 -35, 36 -15, 36 10 C 36 30, 20 42, 0 42 C -20 42, -36 30, -36 10 C -36 -15, -24 -35, 0 -35 Z"
                fill="#74c69d"
              />
              <ellipse cx="0" cy="14" rx="22" ry="16" fill="#ffffff" opacity="0.4" />
              <circle cx="-16" cy="4" r="5.5" fill="#ff9ebb" opacity="0.85" />
              <circle cx="16" cy="4" r="5.5" fill="#ff9ebb" opacity="0.85" />
              <path d="M -14 -4 Q -9 -9, -4 -4" stroke="#1b382b" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <path d="M 6 -4 Q 11 -9, 16 -4" stroke="#1b382b" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <path d="M -5 6 Q 0 10, 5 6" stroke="#1b382b" strokeWidth="2.4" strokeLinecap="round" fill="none" />
              
              <g transform="translate(0, -35)">
                <path d="M 0 0 Q 6 -7, 12 -9" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M 12 -9 C 20 -13, 24 -6, 17 -1 C 12 -3, 11 -7, 12 -9 Z" fill="#40916c" />
              </g>
            </g>

            {/* Straight Legs Connection */}
            <line x1="48" y1="144" x2="118" y2="110" stroke="#52b788" strokeWidth="10" strokeLinecap="round" />

            {/* Functional Articulated Pushing Arms to Mat */}
            <path
              className="pip-anim-group"
              d="M 155 105 L 152 128 L 155 148"
              fill="none"
              stroke="#40916c"
              strokeWidth="7.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: `pipPushupElbows ${animDuration} ease-in-out infinite` }}
            />
            <circle cx="155" cy="148" r="5" fill="#2d6a4f" />
          </g>

          <g transform="translate(160, 10)">
            <rect x="0" y="0" width="82" height="22" rx="11" fill="var(--bg-glass-card, #ffffff)" stroke="var(--border-subtle, #e2e8f0)" strokeWidth="1" />
            <text x="41" y="14" fontSize="8" fill="var(--text-secondary, #4a5568)" textAnchor="middle" fontWeight="bold">
              {isSlowMode ? '🐢 Slow Mode' : '✨ Form Demo'}
            </text>
          </g>
        </svg>
      )}

      {/* ========================================================================= */}
      {/* 6. STEP LUNGE DEMONSTRATION — PIP DEMONSTRATOR                             */}
      {/* ========================================================================= */}
      {exerciseId === 'lunge' && (
        <svg width="250" height="190" viewBox="0 0 250 190">
          <line x1="20" y1="156" x2="230" y2="156" stroke="var(--border-subtle, #cbd5e1)" strokeWidth="3" strokeLinecap="round" />

          {/* Front Leg Bending (90 deg) */}
          <path
            className="pip-anim-group"
            d="M 120 115 L 140 132 L 140 152"
            fill="none"
            stroke="#52b788"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: `pipLungeFrontLegPath ${animDuration} ease-in-out infinite` }}
          />
          <ellipse cx="165" cy="154" rx="9" ry="5" fill="#2d6a4f" />

          {/* Back Leg Dropping Gently (90 deg) */}
          <path
            className="pip-anim-group"
            d="M 120 115 L 100 132 L 100 152"
            fill="none"
            stroke="#40916c"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: `pipLungeBackLegPath ${animDuration} ease-in-out infinite` }}
          />
          <ellipse cx="85" cy="154" rx="8" ry="4.5" fill="#2d6a4f" />

          {/* Pip Upright Body */}
          <g className="pip-anim-group" style={{ animation: `pipLungeTorso ${animDuration} ease-in-out infinite` }}>
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

              {/* Hands comfortably on hips */}
              <path d="M -30 10 Q -38 18, -28 26" fill="none" stroke="#52b788" strokeWidth="5.5" strokeLinecap="round" />
              <circle cx="-28" cy="26" r="4" fill="#40916c" />
              <path d="M 30 10 Q 38 18, 28 26" fill="none" stroke="#52b788" strokeWidth="5.5" strokeLinecap="round" />
              <circle cx="28" cy="26" r="4" fill="#40916c" />

              {/* Sprout Leaf */}
              <g transform="translate(0, -38)">
                <path d="M 0 0 Q -3 -8, -10 -12" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M -10 -12 C -24 -18, -32 -10, -20 -4 C -13 -6, -10 -11, -10 -12 Z" fill="#40916c" />
                <path d="M -4 -6 C 5 -11, 14 -7, 7 0 C 1 -2, -3 -5, -4 -6 Z" fill="#52b788" />
              </g>
            </g>
          </g>

          <text x="175" y="120" fontSize="8" fill="#3a86c8" fontWeight="bold">90° Front</text>
          <text x="55" y="140" fontSize="8" fill="#3a86c8" fontWeight="bold">90° Back</text>

          <g transform="translate(160, 10)">
            <rect x="0" y="0" width="82" height="22" rx="11" fill="var(--bg-glass-card, #ffffff)" stroke="var(--border-subtle, #e2e8f0)" strokeWidth="1" />
            <text x="41" y="14" fontSize="8" fill="var(--text-secondary, #4a5568)" textAnchor="middle" fontWeight="bold">
              {isSlowMode ? '🐢 Slow Mode' : '✨ 90° Angles'}
            </text>
          </g>
        </svg>
      )}

      {/* ========================================================================= */}
      {/* 7. FOREARM PLANK HOLD DEMONSTRATION — PIP DEMONSTRATOR                    */}
      {/* ========================================================================= */}
      {exerciseId === 'plank' && (
        <svg width="250" height="190" viewBox="0 0 250 190">
          <line x1="20" y1="152" x2="230" y2="152" stroke="var(--border-subtle, #cbd5e1)" strokeWidth="3" strokeLinecap="round" />

          <line x1="50" y1="120" x2="170" y2="96" stroke="#3a86c8" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />

          {/* Warm Core Glow */}
          <circle 
            cx="115" 
            cy="110" 
            r="26" 
            fill="rgba(217, 119, 54, 0.25)" 
            style={{ animation: `pipPlankGlow ${isSlowMode ? '4s' : '2.5s'} ease-in-out infinite` }} 
          />
          <text x="115" y="114" fontSize="8.5" fill="#d97736" textAnchor="middle" fontWeight="bold">Gently Engage Core</text>

          <ellipse cx="50" cy="148" rx="8" ry="5" fill="#2d6a4f" />

          <g className="pip-anim-group" style={{ animation: `pipBreatheSubtle ${isSlowMode ? '4s' : '2.5s'} ease-in-out infinite`, transformOrigin: '115px 110px' }}>
            <g transform="translate(140, 96) rotate(16)">
              <path
                d="M 0 -35 C 24 -35, 36 -15, 36 10 C 36 30, 20 42, 0 42 C -20 42, -36 30, -36 10 C -36 -15, -24 -35, 0 -35 Z"
                fill="#74c69d"
              />
              <ellipse cx="0" cy="14" rx="22" ry="16" fill="#ffffff" opacity="0.4" />
              <circle cx="-16" cy="4" r="5.5" fill="#ff9ebb" opacity="0.85" />
              <circle cx="16" cy="4" r="5.5" fill="#ff9ebb" opacity="0.85" />
              
              <path d="M -14 -2 Q -9 3, -4 -2" stroke="#1b382b" strokeWidth="2.6" strokeLinecap="round" fill="none" />
              <path d="M 6 -2 Q 11 3, 16 -2" stroke="#1b382b" strokeWidth="2.6" strokeLinecap="round" fill="none" />
              <path d="M -4 8 Q 0 12, 4 8" stroke="#1b382b" strokeWidth="2.2" strokeLinecap="round" fill="none" />

              <g transform="translate(0, -35)">
                <path d="M 0 0 Q 5 -7, 10 -9" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M 10 -9 C 18 -13, 22 -6, 15 -1 C 10 -3, 9 -7, 10 -9 Z" fill="#40916c" />
              </g>
            </g>

            <line x1="50" y1="146" x2="118" y2="114" stroke="#52b788" strokeWidth="9" strokeLinecap="round" />

            {/* Forearms Resting Flat */}
            <line x1="152" y1="116" x2="152" y2="150" stroke="#40916c" strokeWidth="6.5" strokeLinecap="round" />
            <line x1="152" y1="150" x2="178" y2="150" stroke="#2d6a4f" strokeWidth="6.5" strokeLinecap="round" />
          </g>

          <text x="120" y="176" fontSize="8.5" fill="var(--text-muted, #718096)" textAnchor="middle">Breathe Smoothly & Hold (10–20s)</text>
        </svg>
      )}

      {/* ========================================================================= */}
      {/* 8. NECK & SHOULDER RESET DEMONSTRATION — PIP DEMONSTRATOR                 */}
      {/* ========================================================================= */}
      {(exerciseId === 'stretch' || exerciseId === 'neck_stretch') && (
        <svg width="250" height="190" viewBox="0 0 250 190">
          <line x1="45" y1="156" x2="205" y2="156" stroke="var(--border-subtle, #cbd5e1)" strokeWidth="3" strokeLinecap="round" />
          
          <path d="M 70 75 Q 60 62, 72 52" fill="none" stroke="#3a86c8" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M 180 75 Q 190 62, 178 52" fill="none" stroke="#3a86c8" strokeWidth="1.5" strokeDasharray="3 2" />

          {/* Pip Sitting Cross-Legged */}
          <ellipse cx="120" cy="152" rx="44" ry="11" fill="#52b788" />
          <ellipse cx="82" cy="152" rx="10" ry="5.5" fill="#2d6a4f" />
          <ellipse cx="158" cy="152" rx="10" ry="5.5" fill="#2d6a4f" />

          {/* Pip Body with Gentle Neck Tilt */}
          <g className="pip-anim-group" style={{ animation: `pipNeckStretchTilt ${animDuration} ease-in-out infinite`, transformOrigin: '120px 130px' }}>
            <path
              d="M 120 45 C 144 45, 156 65, 156 90 C 156 112, 138 124, 120 124 C 102 124, 84 112, 84 90 C 84 65, 96 45, 120 45 Z"
              fill="#74c69d"
            />
            <ellipse cx="120" cy="98" rx="26" ry="18" fill="#ffffff" opacity="0.4" />
            <circle cx="100" cy="88" r="6.5" fill="#ff9ebb" opacity="0.85" />
            <circle cx="140" cy="88" r="6.5" fill="#ff9ebb" opacity="0.85" />

            <path d="M 102 78 Q 107 83, 112 78" stroke="#1b382b" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M 128 78 Q 133 83, 138 78" stroke="#1b382b" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M 115 88 Q 120 92, 125 88" stroke="#1b382b" strokeWidth="2.4" strokeLinecap="round" fill="none" />

            {/* Resting Hands on Knees */}
            <circle cx="84" cy="122" r="5" fill="#40916c" />
            <circle cx="156" cy="122" r="5" fill="#40916c" />

            <g transform="translate(120, 45)">
              <path d="M 0 0 Q -3 -8, -10 -12" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M -10 -12 C -24 -18, -32 -10, -20 -4 C -13 -6, -10 -11, -10 -12 Z" fill="#40916c" />
              <path d="M -4 -6 C 5 -11, 14 -7, 7 0 C 1 -2, -3 -5, -4 -6 Z" fill="#52b788" />
            </g>
          </g>

          <text x="120" y="176" fontSize="8.5" fill="var(--text-muted, #718096)" textAnchor="middle">Slow ear-to-shoulder release</text>
        </svg>
      )}

      {/* Visual Guide Badge */}
      <div style={{ position: 'absolute', bottom: 8, right: 12, display: 'flex', alignItems: 'center', gap: '5px', background: 'var(--bg-glass-card)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-subtle)' }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-primary)', display: 'inline-block' }} />
        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700 }}>Pip Instructor 🌱</span>
      </div>
    </div>
  );
}
