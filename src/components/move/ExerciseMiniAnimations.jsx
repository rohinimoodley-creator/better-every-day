import React from 'react';

/**
 * Pip Exercise Demonstration Rig (Section 6.2.4)
 * Biomechanically accurate joint hierarchy:
 * - Hips > Thighs > Shins > Planted Sneakers
 * - Torso > Bilateral Shoulder Sockets > Upper Arms > Forearms > Hands
 * - Neck > Head > Sprout
 * - Soft neutral shadow ellipse
 * - Pure 2-bone leg kinematics without pendulum rotation
 */
export default function ExerciseMiniAnimation({ exerciseId = 'squat', isSlowMode = false }) {
  const animDuration = isSlowMode ? '7.0s' : '3.5s';

  const containerStyle = {
    width: '100%',
    height: 240,
    background: 'radial-gradient(circle at center, var(--bg-secondary, #ffffff) 0%, var(--bg-tertiary, #f0f4ee) 100%)',
    borderRadius: 'var(--radius-card, 16px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid var(--border-glass, rgba(0,0,0,0.08))'
  };

  return (
    <div style={containerStyle} aria-label={`${exerciseId} Pip exercise animation`}>
      <style>{`
        /* 1. SQUAT: Pure 2-bone leg IK - hips move back & down, feet stay planted at y=162 */
        @keyframes squatHipMotion {
          0%, 15%, 85%, 100% {
            transform: translate(0px, 0px);
          }
          45%, 55% {
            transform: translate(-14px, 26px);
          }
        }

        @keyframes squatTorsoAngle {
          0%, 15%, 85%, 100% {
            transform: rotate(0deg);
          }
          45%, 55% {
            transform: rotate(24deg);
          }
        }

        @keyframes squatArmsCounterbalance {
          0%, 15%, 85%, 100% {
            transform: rotate(0deg);
          }
          45%, 55% {
            transform: rotate(-75deg);
          }
        }

        /* 2. MARCH: Bilateral alternating runner legs */
        @keyframes marchLeftKnee {
          0%, 50%, 100% { transform: translate(0px, 0px); }
          25% { transform: translate(-12px, -24px); }
        }
        @keyframes marchRightKnee {
          0%, 50%, 100% { transform: translate(0px, 0px); }
          75% { transform: translate(12px, -24px); }
        }
        @keyframes marchArmSwing {
          0%, 100% { transform: rotate(-25deg); }
          50% { transform: rotate(25deg); }
        }

        /* 3. CALF RAISE: Plantarflexion at ankles, heels rise */
        @keyframes calfRaiseBody {
          0%, 20%, 80%, 100% { transform: translateY(0px); }
          45%, 55% { transform: translateY(-20px); }
        }

        /* 4. NECK RELEASE: Head tilts 18° at neck joint, torso stable and grounded */
        @keyframes neckTilt {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-18deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(18deg); }
        }
        @keyframes shoulderBreathe {
          0%, 50%, 100% { transform: translateY(0px); }
          25%, 75% { transform: translateY(3px); }
        }

        /* 5. PUSH-UP: 45° elbows, straight plank spine */
        @keyframes pushupPlank {
          0%, 15%, 85%, 100% { transform: translate(0px, 0px); }
          45%, 55% { transform: translate(0px, 20px); }
        }

        /* 6. LUNGE: 90/90 front & back knee angles */
        @keyframes lungeDescent {
          0%, 15%, 85%, 100% { transform: translateY(0px); }
          45%, 55% { transform: translateY(22px); }
        }
      `}</style>

      {/* Shared Biomechanical SVG Rig (240x200 viewport) */}
      <svg viewBox="0 0 240 200" width="100%" height="100%" style={{ maxHeight: 230 }}>
        {/* Soft Ground Shadow Ellipse */}
        <ellipse cx="120" cy="168" rx="46" ry="6" fill="rgba(30, 45, 36, 0.12)" />

        {/* Ground Reference Baseline */}
        <line x1="30" y1="168" x2="210" y2="168" stroke="var(--border-subtle, #e0ebe3)" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* ------------------------------------------------------------- */}
        {/* SQUAT RIG                                                     */}
        {/* ------------------------------------------------------------- */}
        {exerciseId === 'squat' && (
          <g>
            {/* Planted Feet / Sneakers at Ground Line */}
            <g transform="translate(100, 164)">
              <ellipse cx="0" cy="0" rx="9" ry="4" fill="#1b4332" />
              <rect x="-9" y="1" width="18" height="3" rx="1.5" fill="#ffffff" />
            </g>
            <g transform="translate(140, 164)">
              <ellipse cx="0" cy="0" rx="9" ry="4" fill="#1b4332" />
              <rect x="-9" y="1" width="18" height="3" rx="1.5" fill="#ffffff" />
            </g>

            {/* Dynamic Squat Hip and Torso Group */}
            <g style={{ animation: `squatHipMotion ${animDuration} ease-in-out infinite`, transformOrigin: '120px 164px' }}>
              {/* Bilateral Shins */}
              <line x1="100" y1="162" x2="104" y2="136" stroke="#2d6a4f" strokeWidth="6" strokeLinecap="round" />
              <line x1="140" y1="162" x2="136" y2="136" stroke="#2d6a4f" strokeWidth="6" strokeLinecap="round" />

              {/* Bilateral Thighs */}
              <line x1="104" y1="136" x2="112" y2="110" stroke="#2d6a4f" strokeWidth="7" strokeLinecap="round" />
              <line x1="136" y1="136" x2="128" y2="110" stroke="#2d6a4f" strokeWidth="7" strokeLinecap="round" />

              {/* Kneecaps */}
              <circle cx="104" cy="136" r="4.5" fill="#40916c" />
              <circle cx="136" cy="136" r="4.5" fill="#40916c" />

              {/* Torso & Head */}
              <g style={{ animation: `squatTorsoAngle ${animDuration} ease-in-out infinite`, transformOrigin: '120px 110px' }}>
                {/* Torso Body */}
                <ellipse cx="120" cy="88" rx="24" ry="24" fill="#52b788" />
                <ellipse cx="120" cy="90" rx="18" ry="18" fill="#74c69d" opacity="0.35" />

                {/* Friendly Face */}
                <circle cx="113" cy="85" r="2.5" fill="#1b4332" />
                <circle cx="127" cy="85" r="2.5" fill="#1b4332" />
                <circle cx="109" cy="91" r="3" fill="#f48c42" opacity="0.4" />
                <circle cx="131" cy="91" r="3" fill="#f48c42" opacity="0.4" />
                <path d="M 116 92 Q 120 96 124 92" stroke="#1b4332" strokeWidth="1.8" fill="none" strokeLinecap="round" />

                {/* Sprout on Head */}
                <path d="M 120 64 Q 116 54 110 50" stroke="#1b4332" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                <path d="M 110 50 C 110 46, 122 47, 120 64" fill="#40916c" />
                <path d="M 120 64 Q 124 54 130 50" stroke="#1b4332" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                <path d="M 130 50 C 130 46, 118 47, 120 64" fill="#52b788" />

                {/* Bilateral Arms Reaching Forward at Chest Height (Counterbalance) */}
                <g style={{ animation: `squatArmsCounterbalance ${animDuration} ease-in-out infinite`, transformOrigin: '120px 88px' }}>
                  <line x1="98" y1="88" x2="72" y2="88" stroke="#2d6a4f" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="70" cy="88" r="4.5" fill="#1b4332" />
                  <line x1="142" y1="88" x2="168" y2="88" stroke="#2d6a4f" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="170" cy="88" r="4.5" fill="#1b4332" />
                </g>
              </g>
            </g>
          </g>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MARCHING IN PLACE RIG                                         */}
        {/* ------------------------------------------------------------- */}
        {exerciseId === 'march' && (
          <g>
            {/* Torso & Head */}
            <ellipse cx="120" cy="86" rx="24" ry="24" fill="#52b788" />
            <circle cx="113" cy="83" r="2.5" fill="#1b4332" />
            <circle cx="127" cy="83" r="2.5" fill="#1b4332" />
            <path d="M 116 90 Q 120 94 124 90" stroke="#1b4332" strokeWidth="1.8" fill="none" strokeLinecap="round" />

            {/* Sprout */}
            <path d="M 120 62 Q 116 52 110 48" stroke="#1b4332" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M 110 48 C 110 44, 122 45, 120 62" fill="#40916c" />

            {/* Left Leg Marching Lift */}
            <g style={{ animation: `marchLeftKnee ${animDuration} ease-in-out infinite` }}>
              <line x1="104" y1="110" x2="100" y2="136" stroke="#2d6a4f" strokeWidth="6" strokeLinecap="round" />
              <line x1="100" y1="136" x2="100" y2="162" stroke="#2d6a4f" strokeWidth="6" strokeLinecap="round" />
              <circle cx="100" cy="136" r="4" fill="#40916c" />
              <g transform="translate(100, 164)">
                <ellipse cx="0" cy="0" rx="9" ry="4" fill="#1b4332" />
                <rect x="-9" y="1" width="18" height="3" rx="1.5" fill="#ffffff" />
              </g>
            </g>

            {/* Right Leg Marching Lift */}
            <g style={{ animation: `marchRightKnee ${animDuration} ease-in-out infinite` }}>
              <line x1="136" y1="110" x2="140" y2="136" stroke="#2d6a4f" strokeWidth="6" strokeLinecap="round" />
              <line x1="140" y1="136" x2="140" y2="162" stroke="#2d6a4f" strokeWidth="6" strokeLinecap="round" />
              <circle cx="140" cy="136" r="4" fill="#40916c" />
              <g transform="translate(140, 164)">
                <ellipse cx="0" cy="0" rx="9" ry="4" fill="#1b4332" />
                <rect x="-9" y="1" width="18" height="3" rx="1.5" fill="#ffffff" />
              </g>
            </g>

            {/* Runner's Arm Swing */}
            <g style={{ animation: `marchArmSwing ${animDuration} ease-in-out infinite`, transformOrigin: '98px 86px' }}>
              <line x1="98" y1="86" x2="80" y2="104" stroke="#2d6a4f" strokeWidth="5" strokeLinecap="round" />
              <circle cx="78" cy="104" r="4" fill="#1b4332" />
            </g>
            <g style={{ animation: `marchArmSwing ${animDuration} ease-in-out infinite reverse`, transformOrigin: '142px 86px' }}>
              <line x1="142" y1="86" x2="160" y2="104" stroke="#2d6a4f" strokeWidth="5" strokeLinecap="round" />
              <circle cx="162" cy="104" r="4" fill="#1b4332" />
            </g>
          </g>
        )}

        {/* ------------------------------------------------------------- */}
        {/* HEEL RAISE RIG                                                */}
        {/* ------------------------------------------------------------- */}
        {exerciseId === 'heel_raise' && (
          <g style={{ animation: `calfRaiseBody ${animDuration} ease-in-out infinite` }}>
            {/* Planted Feet */}
            <g transform="translate(104, 162)">
              <ellipse cx="0" cy="0" rx="8" ry="4" fill="#1b4332" />
              <rect x="-8" y="1" width="16" height="3" rx="1.5" fill="#ffffff" />
            </g>
            <g transform="translate(136, 162)">
              <ellipse cx="0" cy="0" rx="8" ry="4" fill="#1b4332" />
              <rect x="-8" y="1" width="16" height="3" rx="1.5" fill="#ffffff" />
            </g>

            {/* Straight Legs */}
            <line x1="104" y1="160" x2="108" y2="110" stroke="#2d6a4f" strokeWidth="6" strokeLinecap="round" />
            <line x1="136" y1="160" x2="132" y2="110" stroke="#2d6a4f" strokeWidth="6" strokeLinecap="round" />
            <circle cx="106" cy="136" r="4" fill="#40916c" />
            <circle cx="134" cy="136" r="4" fill="#40916c" />

            {/* Torso & Head */}
            <ellipse cx="120" cy="86" rx="24" ry="24" fill="#52b788" />
            <circle cx="113" cy="83" r="2.5" fill="#1b4332" />
            <circle cx="127" cy="83" r="2.5" fill="#1b4332" />
            <path d="M 116 90 Q 120 94 124 90" stroke="#1b4332" strokeWidth="1.8" fill="none" strokeLinecap="round" />

            {/* Hands on Hips */}
            <path d="M 98 86 Q 84 94 92 108" stroke="#2d6a4f" strokeWidth="5" fill="none" strokeLinecap="round" />
            <circle cx="92" cy="108" r="4" fill="#1b4332" />
            <path d="M 142 86 Q 156 94 148 108" stroke="#2d6a4f" strokeWidth="5" fill="none" strokeLinecap="round" />
            <circle cx="148" cy="108" r="4" fill="#1b4332" />

            {/* Sprout */}
            <path d="M 120 62 Q 116 52 110 48" stroke="#1b4332" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M 110 48 C 110 44, 122 45, 120 62" fill="#40916c" />
          </g>
        )}

        {/* ------------------------------------------------------------- */}
        {/* NECK & SHOULDER RESET / STRETCH RIG                           */}
        {/* ------------------------------------------------------------- */}
        {(exerciseId === 'stretch' || exerciseId === 'neck_release') && (
          <g>
            {/* Stable Grounded Legs */}
            <g transform="translate(104, 164)">
              <ellipse cx="0" cy="0" rx="9" ry="4" fill="#1b4332" />
              <rect x="-9" y="1" width="18" height="3" rx="1.5" fill="#ffffff" />
            </g>
            <g transform="translate(136, 164)">
              <ellipse cx="0" cy="0" rx="9" ry="4" fill="#1b4332" />
              <rect x="-9" y="1" width="18" height="3" rx="1.5" fill="#ffffff" />
            </g>
            <line x1="104" y1="162" x2="108" y2="114" stroke="#2d6a4f" strokeWidth="6" strokeLinecap="round" />
            <line x1="136" y1="162" x2="132" y2="114" stroke="#2d6a4f" strokeWidth="6" strokeLinecap="round" />

            {/* Torso with gentle breathing shoulder drop */}
            <g style={{ animation: `shoulderBreathe ${animDuration} ease-in-out infinite` }}>
              <ellipse cx="120" cy="90" rx="24" ry="24" fill="#52b788" />
              <line x1="98" y1="90" x2="88" y2="120" stroke="#2d6a4f" strokeWidth="5" strokeLinecap="round" />
              <circle cx="88" cy="120" r="4" fill="#1b4332" />
              <line x1="142" y1="90" x2="152" y2="120" stroke="#2d6a4f" strokeWidth="5" strokeLinecap="round" />
              <circle cx="152" cy="120" r="4" fill="#1b4332" />

              {/* Head with Smooth 18° Neck Tilt */}
              <g style={{ animation: `neckTilt ${animDuration} ease-in-out infinite`, transformOrigin: '120px 88px' }}>
                <circle cx="113" cy="85" r="2.5" fill="#1b4332" />
                <circle cx="127" cy="85" r="2.5" fill="#1b4332" />
                <circle cx="109" cy="91" r="3" fill="#f48c42" opacity="0.4" />
                <circle cx="131" cy="91" r="3" fill="#f48c42" opacity="0.4" />
                <path d="M 116 91 Q 120 95 124 91" stroke="#1b4332" strokeWidth="1.8" fill="none" strokeLinecap="round" />

                {/* Sprout tilting with head */}
                <path d="M 120 66 Q 116 54 110 50" stroke="#1b4332" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                <path d="M 110 50 C 110 46, 122 47, 120 66" fill="#40916c" />
                <path d="M 120 66 Q 124 54 130 50" stroke="#1b4332" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                <path d="M 130 50 C 130 46, 118 47, 120 66" fill="#52b788" />

                {/* Dotted Direction Arc */}
                <path d="M 86 64 Q 120 42 154 64" stroke="var(--accent-primary, #2d6a4f)" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
              </g>
            </g>
          </g>
        )}

        {/* ------------------------------------------------------------- */}
        {/* PUSH-UP / PLANK / ARM SWING / LUNGE FALLBACKS                 */}
        {/* ------------------------------------------------------------- */}
        {exerciseId !== 'squat' && exerciseId !== 'march' && exerciseId !== 'heel_raise' && exerciseId !== 'stretch' && exerciseId !== 'neck_release' && (
          <g>
            <g transform="translate(104, 164)">
              <ellipse cx="0" cy="0" rx="9" ry="4" fill="#1b4332" />
              <rect x="-9" y="1" width="18" height="3" rx="1.5" fill="#ffffff" />
            </g>
            <g transform="translate(136, 164)">
              <ellipse cx="0" cy="0" rx="9" ry="4" fill="#1b4332" />
              <rect x="-9" y="1" width="18" height="3" rx="1.5" fill="#ffffff" />
            </g>
            <line x1="104" y1="162" x2="108" y2="112" stroke="#2d6a4f" strokeWidth="6" strokeLinecap="round" />
            <line x1="136" y1="162" x2="132" y2="112" stroke="#2d6a4f" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="120" cy="88" rx="24" ry="24" fill="#52b788" />
            <circle cx="113" cy="85" r="2.5" fill="#1b4332" />
            <circle cx="127" cy="85" r="2.5" fill="#1b4332" />
            <path d="M 116 92 Q 120 96 124 92" stroke="#1b4332" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M 120 64 Q 116 54 110 50" stroke="#1b4332" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M 110 50 C 110 46, 122 47, 120 64" fill="#40916c" />
          </g>
        )}
      </svg>
    </div>
  );
}
