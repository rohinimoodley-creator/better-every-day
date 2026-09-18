import React from 'react';

/**
 * Pip IS the Exercise Demonstrator!
 * Animated SVG demonstrations with true HUMAN KINEMATICS & BIOMECHANICS:
 * - Multi-segment anatomical articulation (Shoulder, Elbow, Wrist, Gloved Hand, Hip hinge, Kneecap, Calf/Shin, Ankle plantarflexion, Pelvic tilt, Athletic Sneaker)
 * - Accurate human joint angles (90° parallel squat, 90/90 marching gait, 45° push-up elbows, 90/90 lunges)
 * - Realistic kinetic phases: Starting posture → Movement descent/drive → Apex pause/hold → Controlled eccentric return → Reset
 * - Full Slow Mode support (7.5s cycle) for deliberate learning
 * - Pip's signature mascot identity: round friendly body, sprout leaf, cute face, rosy cheeks, and encouraging expression.
 */

export default function ExerciseMiniAnimation({ exerciseId = 'squat', isSlowMode = false }) {
  const animDuration = isSlowMode ? '7.5s' : '3.8s';

  const containerStyle = {
    width: '100%',
    height: 230,
    background: 'radial-gradient(circle at center, var(--bg-secondary, #ffffff) 0%, var(--bg-tertiary, #f1f5f3) 100%)',
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
    <div style={containerStyle} aria-label={`${exerciseId} Pip human movement demonstration`}>
      <style>{`
        /* =========================================================================
           1. SQUAT HUMAN KINEMATICS: Pelvic Hinge Back, Thighs Parallel (90°), 
              Torso 36° Balance Incline, Arms Forward Counterbalance
           ========================================================================= */
        @keyframes humanSquatPelvis {
          0%, 15%, 88%, 100% {
            transform: translate(0px, 0px);
          }
          45%, 62% {
            transform: translate(-18px, 34px);
          }
        }

        @keyframes humanSquatTorsoIncline {
          0%, 15%, 88%, 100% {
            transform: rotate(0deg);
          }
          45%, 62% {
            transform: rotate(36deg);
          }
        }

        @keyframes humanSquatArmsCounterbalance {
          0%, 15%, 88%, 100% {
            transform: rotate(0deg);
          }
          45%, 62% {
            transform: rotate(-85deg);
          }
        }

        @keyframes humanSquatThighAngle {
          0%, 15%, 88%, 100% {
            d: path("M 115 105 L 115 136 L 115 162");
          }
          45%, 62% {
            d: path("M 97 139 L 132 136 L 122 162");
          }
        }

        /* =========================================================================
           2. MARCHING IN PLACE HUMAN GAIT: 90° Hip & Knee Lift + 90° Runner's Arm
           ========================================================================= */
        @keyframes humanMarchLeftLeg {
          0%, 45%, 100% {
            d: path("M 104 110 L 102 136 L 102 162");
          }
          15%, 32% {
            d: path("M 104 110 L 76 110 L 76 138");
          }
        }

        @keyframes humanMarchLeftFoot {
          0%, 45%, 100% {
            transform: translate(0px, 0px);
          }
          15%, 32% {
            transform: translate(-26px, -24px);
          }
        }

        @keyframes humanMarchRightLeg {
          0%, 55%, 100% {
            d: path("M 136 110 L 138 136 L 138 162");
          }
          65%, 82% {
            d: path("M 136 110 L 164 110 L 164 138");
          }
        }

        @keyframes humanMarchRightFoot {
          0%, 55%, 100% {
            transform: translate(0px, 0px);
          }
          65%, 82% {
            transform: translate(26px, -24px);
          }
        }

        @keyframes humanMarchArmLeft {
          0%, 45%, 100% {
            transform: rotate(0deg);
          }
          15%, 32% {
            transform: rotate(38deg);
          }
          65%, 82% {
            transform: rotate(-55deg);
          }
        }

        @keyframes humanMarchArmRight {
          0%, 45%, 100% {
            transform: rotate(0deg);
          }
          15%, 32% {
            transform: rotate(-55deg);
          }
          65%, 82% {
            transform: rotate(38deg);
          }
        }

        @keyframes humanMarchGaitBuoyancy {
          0%, 50%, 100% {
            transform: translateY(0px);
          }
          20%, 70% {
            transform: translateY(-5px);
          }
        }

        /* =========================================================================
           3. HEEL & CALF RAISES: Ankle Plantarflexion, Vertical Elevation, Peak Hold
           ========================================================================= */
        @keyframes humanHeelRaiseVertical {
          0%, 15%, 90%, 100% {
            transform: translateY(0px);
          }
          45%, 68% {
            transform: translateY(-26px);
          }
        }

        @keyframes humanAnklePlantarflex {
          0%, 15%, 90%, 100% {
            transform: rotate(0deg);
          }
          45%, 68% {
            transform: rotate(-35deg);
          }
        }

        /* =========================================================================
           4. ARM SWINGS: Sagittal Plane Shoulder Pendulum with Soft Knee Buoyancy
           ========================================================================= */
        @keyframes humanArmSwingShoulders {
          0%, 100% {
            transform: rotate(0deg);
          }
          15% {
            transform: rotate(0deg);
          }
          40%, 55% {
            transform: rotate(-75deg);
          }
          75%, 88% {
            transform: rotate(40deg);
          }
        }

        @keyframes humanArmSwingKneeDip {
          0%, 100% {
            transform: translateY(0px);
          }
          40%, 55% {
            transform: translateY(-4px);
          }
          75%, 88% {
            transform: translateY(5px);
          }
        }

        /* =========================================================================
           5. PUSH-UP: High Plank Line, 45° Arrowhead Elbows, Chest to Floor Hover
           ========================================================================= */
        @keyframes humanPushupPlankDescent {
          0%, 15%, 88%, 100% {
            transform: rotate(0deg) translateY(0px);
          }
          48%, 62% {
            transform: rotate(-12deg) translateY(26px);
          }
        }

        @keyframes humanPushupElbowFlexion {
          0%, 15%, 88%, 100% {
            d: path("M 160 85 L 160 118 L 160 152");
          }
          48%, 62% {
            d: path("M 160 85 L 136 102 L 160 152");
          }
        }

        /* =========================================================================
           6. STEP LUNGE: 90/90 Knee Split, Vertical Spine, Hover Back Knee
           ========================================================================= */
        @keyframes humanLungeVerticalDescent {
          0%, 15%, 88%, 100% {
            transform: translateY(0px);
          }
          45%, 62% {
            transform: translateY(30px);
          }
        }

        @keyframes humanLungeFrontLegKinematics {
          0%, 15%, 88%, 100% {
            d: path("M 120 110 L 140 134 L 140 162");
          }
          45%, 62% {
            d: path("M 120 125 L 170 125 L 170 162");
          }
        }

        @keyframes humanLungeBackLegKinematics {
          0%, 15%, 88%, 100% {
            d: path("M 120 110 L 100 134 L 100 162");
          }
          45%, 62% {
            d: path("M 120 125 L 82 146 L 82 162");
          }
        }

        /* =========================================================================
           7. FOREARM PLANK & NECK STRETCH
           ========================================================================= */
        @keyframes humanPlankCoreActivation {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.75; transform: scale(1.2); }
        }

        @keyframes humanCervicalLateralFlexion {
          0%, 100% { transform: rotate(0deg); }
          20%, 42% { transform: rotate(-24deg); }
          50% { transform: rotate(0deg); }
          70%, 92% { transform: rotate(24deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .human-pip-group {
            animation: none !important;
          }
        }
      `}</style>

      {/* Sneaker SVG Helper */}
      {/* ========================================================================= */}
      {/* 1. SQUAT DEMONSTRATION — ACCURATE HUMAN BIOMECHANICS (SIDE/3/4 VIEW)      */}
      {/* ========================================================================= */}
      {exerciseId === 'squat' && (
        <svg width="260" height="200" viewBox="0 0 260 200">
          <line x1="15" y1="166" x2="245" y2="166" stroke="var(--border-subtle, #cbd5e1)" strokeWidth="3" strokeLinecap="round" />
          
          {/* Alignment cues */}
          <line x1="80" y1="174" x2="160" y2="174" stroke="#3a86c8" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="80" cy="174" r="2.5" fill="#3a86c8" />
          <circle cx="160" cy="174" r="2.5" fill="#3a86c8" />
          <text x="120" y="186" fontSize="8.5" fill="#3a86c8" textAnchor="middle" fontWeight="bold">Feet Flat & Hips to Parallel (90°)</text>

          {/* Shadow */}
          <ellipse cx="120" cy="166" rx="44" ry="7" fill="rgba(0,0,0,0.08)" />

          {/* Planted Detailed Athletic Sneakers */}
          <g transform="translate(115, 162)">
            <path d="M -10 0 C -10 -4, 6 -5, 12 -2 C 14 0, 14 3, 12 5 L -10 5 Z" fill="#1b4332" />
            <path d="M -11 5 L 14 5 C 15 5, 15 7, 14 8 L -11 8 C -12 8, -12 5, -11 5 Z" fill="#ffffff" stroke="#d8f3dc" strokeWidth="0.5" />
            <line x1="-4" y1="-2" x2="3" y2="-2" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" />
          </g>

          {/* Multi-Segment Human Leg Articulation (Thigh + Kneecap + Shin) */}
          <path
            className="human-pip-group"
            d="M 115 105 L 115 136 L 115 162"
            fill="none"
            stroke="#52b788"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: `humanSquatThighAngle ${animDuration} cubic-bezier(0.4, 0, 0.2, 1) infinite` }}
          />

          {/* Articulated Pelvis & Torso Group */}
          <g className="human-pip-group" style={{ animation: `humanSquatPelvis ${animDuration} cubic-bezier(0.4, 0, 0.2, 1) infinite` }}>
            
            {/* Torso & Head with Human Spine Incline */}
            <g style={{ animation: `humanSquatTorsoIncline ${animDuration} cubic-bezier(0.4, 0, 0.2, 1) infinite`, transformOrigin: '115px 105px' }}>
              
              {/* Pip Pear Mascot Body */}
              <path
                d="M 115 32 C 140 32, 154 54, 154 80 C 154 104, 136 116, 115 116 C 94 116, 76 104, 76 80 C 76 54, 90 32, 115 32 Z"
                fill="#74c69d"
              />
              <ellipse cx="115" cy="85" rx="26" ry="18" fill="#ffffff" opacity="0.38" />

              {/* Rosy Cheeks */}
              <ellipse cx="95" cy="74" rx="6" ry="4.5" fill="#ff9ebb" opacity="0.85" />
              <ellipse cx="135" cy="74" rx="6" ry="4.5" fill="#ff9ebb" opacity="0.85" />

              {/* Forward Focused Cheerful Eyes */}
              <path d="M 97 64 Q 103 57, 109 64" stroke="#1b382b" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 121 64 Q 127 57, 133 64" stroke="#1b382b" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 110 74 Q 115 80, 120 74" stroke="#1b382b" strokeWidth="2.6" strokeLinecap="round" fill="none" />

              {/* Multi-Segment Human Arm (Upper Arm + Elbow + Forearm + Gloved Hand) reaching forward */}
              <g style={{ animation: `humanSquatArmsCounterbalance ${animDuration} cubic-bezier(0.4, 0, 0.2, 1) infinite`, transformOrigin: '115px 72px' }}>
                <path d="M 115 72 L 95 90 L 78 90" stroke="#52b788" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="95" cy="90" r="3.5" fill="#40916c" /> {/* Elbow */}
                <circle cx="76" cy="90" r="5" fill="#2d6a4f" /> {/* Hand */}
                <path d="M 74 88 L 70 88 M 74 90 L 69 90 M 74 92 L 70 92" stroke="#40916c" strokeWidth="1.2" strokeLinecap="round" />
              </g>

              {/* Sprout Leaf */}
              <g transform="translate(115, 32)">
                <path d="M 0 0 Q -3 -8, -10 -12" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M -10 -12 C -24 -18, -32 -10, -20 -4 C -13 -6, -10 -11, -10 -12 Z" fill="#40916c" />
                <path d="M -4 -6 C 5 -11, 14 -7, 7 0 C 1 -2, -3 -5, -4 -6 Z" fill="#52b788" />
              </g>
            </g>
          </g>

          <g transform="translate(165, 10)">
            <rect x="0" y="0" width="85" height="22" rx="11" fill="var(--bg-glass-card, #ffffff)" stroke="var(--border-subtle, #e2e8f0)" strokeWidth="1" />
            <text x="42.5" y="14" fontSize="8" fill="var(--text-secondary, #4a5568)" textAnchor="middle" fontWeight="bold">
              {isSlowMode ? '🐢 Slow Human Demo' : '✨ Parallel Squat (90°)'}
            </text>
          </g>
        </svg>
      )}

      {/* ========================================================================= */}
      {/* 2. MARCHING IN PLACE — FULL HUMAN GAIT KINEMATICS (90° RUNNER'S ARMS)     */}
      {/* ========================================================================= */}
      {exerciseId === 'march' && (
        <svg width="260" height="200" viewBox="0 0 260 200">
          <line x1="15" y1="166" x2="245" y2="166" stroke="var(--border-subtle, #cbd5e1)" strokeWidth="3" strokeLinecap="round" />
          
          <text x="120" y="186" fontSize="8.5" fill="#40916c" textAnchor="middle" fontWeight="bold">90° High Knee Drive & 90° Runner's Arm Swing</text>
          
          <ellipse cx="120" cy="166" rx="42" ry="6" fill="rgba(0,0,0,0.08)" />

          {/* Left Articulated Human Leg (90° Thigh & Shin) */}
          <path
            className="human-pip-group"
            d="M 104 110 L 102 136 L 102 162"
            fill="none"
            stroke="#52b788"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: `humanMarchLeftLeg ${animDuration} cubic-bezier(0.4, 0, 0.2, 1) infinite` }}
          />
          <g className="human-pip-group" style={{ animation: `humanMarchLeftFoot ${animDuration} cubic-bezier(0.4, 0, 0.2, 1) infinite` }}>
            <g transform="translate(102, 160)">
              <path d="M -8 0 C -8 -3, 4 -4, 9 -2 C 10 0, 10 3, 9 4 L -8 4 Z" fill="#1b4332" />
              <path d="M -9 4 L 10 4 C 11 4, 11 6, 10 7 L -9 7 Z" fill="#ffffff" />
            </g>
          </g>

          {/* Right Articulated Human Leg */}
          <path
            className="human-pip-group"
            d="M 136 110 L 138 136 L 138 162"
            fill="none"
            stroke="#52b788"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: `humanMarchRightLeg ${animDuration} cubic-bezier(0.4, 0, 0.2, 1) infinite` }}
          />
          <g className="human-pip-group" style={{ animation: `humanMarchRightFoot ${animDuration} cubic-bezier(0.4, 0, 0.2, 1) infinite` }}>
            <g transform="translate(138, 160)">
              <path d="M -8 0 C -8 -3, 4 -4, 9 -2 C 10 0, 10 3, 9 4 L -8 4 Z" fill="#1b4332" />
              <path d="M -9 4 L 10 4 C 11 4, 11 6, 10 7 L -9 7 Z" fill="#ffffff" />
            </g>
          </g>

          {/* Upright Human Torso with Gait Buoyancy */}
          <g className="human-pip-group" style={{ animation: `humanMarchGaitBuoyancy ${animDuration} ease-in-out infinite` }}>
            <path
              d="M 120 32 C 146 32, 160 54, 160 80 C 160 104, 142 116, 120 116 C 98 116, 80 104, 80 80 C 80 54, 94 32, 120 32 Z"
              fill="#74c69d"
            />
            <ellipse cx="120" cy="85" rx="28" ry="20" fill="#ffffff" opacity="0.38" />

            <circle cx="98" cy="74" r="7" fill="#ff9ebb" opacity="0.85" />
            <circle cx="142" cy="74" r="7" fill="#ff9ebb" opacity="0.85" />

            <path d="M 100 64 Q 106 57, 112 64" stroke="#1b382b" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <path d="M 128 64 Q 134 57, 140 64" stroke="#1b382b" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <path d="M 114 74 Q 120 80, 126 74" stroke="#1b382b" strokeWidth="2.8" strokeLinecap="round" fill="none" />

            {/* Left 90° Runner's Arm (Shoulder -> 90° Elbow -> Gloved Fist) */}
            <g style={{ animation: `humanMarchArmLeft ${animDuration} cubic-bezier(0.4, 0, 0.2, 1) infinite`, transformOrigin: '92px 70px' }}>
              <path d="M 92 70 L 74 85 L 86 98" stroke="#52b788" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <circle cx="74" cy="85" r="3.2" fill="#40916c" /> {/* Elbow */}
              <circle cx="88" cy="98" r="4.5" fill="#2d6a4f" /> {/* Runner's Fist */}
            </g>

            {/* Right 90° Runner's Arm */}
            <g style={{ animation: `humanMarchArmRight ${animDuration} cubic-bezier(0.4, 0, 0.2, 1) infinite`, transformOrigin: '148px 70px' }}>
              <path d="M 148 70 L 166 85 L 154 98" stroke="#52b788" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <circle cx="166" cy="85" r="3.2" fill="#40916c" />
              <circle cx="152" cy="98" r="4.5" fill="#2d6a4f" />
            </g>

            {/* Sprout Leaf */}
            <g transform="translate(120, 32)">
              <path d="M 0 0 Q -3 -8, -10 -12" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M -10 -12 C -24 -18, -32 -10, -20 -4 C -13 -6, -10 -11, -10 -12 Z" fill="#40916c" />
              <path d="M -4 -6 C 5 -11, 14 -7, 7 0 C 1 -2, -3 -5, -4 -6 Z" fill="#52b788" />
            </g>
          </g>

          <g transform="translate(165, 10)">
            <rect x="0" y="0" width="85" height="22" rx="11" fill="var(--bg-glass-card, #ffffff)" stroke="var(--border-subtle, #e2e8f0)" strokeWidth="1" />
            <text x="42.5" y="14" fontSize="8" fill="var(--text-secondary, #4a5568)" textAnchor="middle" fontWeight="bold">
              {isSlowMode ? '🐢 Slow Human Gait' : '✨ 90° Knee & Arm Gait'}
            </text>
          </g>
        </svg>
      )}

      {/* ========================================================================= */}
      {/* 3. HEEL & CALF RAISES — TRUE ANKLE PLANTARFLEXION KINEMATICS              */}
      {/* ========================================================================= */}
      {exerciseId === 'heel_raise' && (
        <svg width="260" height="200" viewBox="0 0 260 200">
          <line x1="15" y1="166" x2="245" y2="166" stroke="var(--border-subtle, #cbd5e1)" strokeWidth="3" strokeLinecap="round" />
          
          <line x1="50" y1="150" x2="50" y2="115" stroke="#3a86c8" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M 47 119 L 50 113 L 53 119" fill="none" stroke="#3a86c8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="120" y="186" fontSize="8.5" fill="#3a86c8" textAnchor="middle" fontWeight="bold">Ankles Plantarflex → Rise High on Balls of Feet</text>

          <ellipse cx="120" cy="166" rx="40" ry="6" fill="rgba(0,0,0,0.08)" />

          {/* Grounded Metatarsal Balls */}
          <ellipse cx="96" cy="164" rx="7" ry="4" fill="#1b4332" />
          <ellipse cx="144" cy="164" rx="7" ry="4" fill="#1b4332" />

          {/* Entire Human Skeleton Vertical Rise */}
          <g className="human-pip-group" style={{ animation: `humanHeelRaiseVertical ${animDuration} cubic-bezier(0.4, 0, 0.2, 1) infinite` }}>
            
            {/* Calves & Shins (Tightened & Extended) */}
            <line x1="98" y1="110" x2="96" y2="152" stroke="#52b788" strokeWidth="9" strokeLinecap="round" />
            <circle cx="97" cy="130" r="3" fill="#40916c" /> {/* Knee */}
            <line x1="142" y1="110" x2="144" y2="152" stroke="#52b788" strokeWidth="9" strokeLinecap="round" />
            <circle cx="143" cy="130" r="3" fill="#40916c" />

            {/* Elevated Sneakers Pivoting on Ankle */}
            <g style={{ animation: `humanAnklePlantarflex ${animDuration} cubic-bezier(0.4, 0, 0.2, 1) infinite`, transformOrigin: '96px 164px' }}>
              <g transform="translate(94, 154)">
                <path d="M -8 0 C -8 -3, 4 -4, 9 -2 C 10 0, 10 3, 9 4 L -8 4 Z" fill="#1b4332" />
                <path d="M -9 4 L 10 4 C 11 4, 11 6, 10 7 L -9 7 Z" fill="#ffffff" />
              </g>
            </g>
            <g style={{ animation: `humanAnklePlantarflex ${animDuration} cubic-bezier(0.4, 0, 0.2, 1) infinite`, transformOrigin: '144px 164px' }}>
              <g transform="translate(142, 154)">
                <path d="M -8 0 C -8 -3, 4 -4, 9 -2 C 10 0, 10 3, 9 4 L -8 4 Z" fill="#1b4332" />
                <path d="M -9 4 L 10 4 C 11 4, 11 6, 10 7 L -9 7 Z" fill="#ffffff" />
              </g>
            </g>

            {/* Tall Upright Spine & Torso */}
            <path
              d="M 120 32 C 146 32, 160 54, 160 80 C 160 104, 142 116, 120 116 C 98 116, 80 104, 80 80 C 80 54, 94 32, 120 32 Z"
              fill="#74c69d"
            />
            <ellipse cx="120" cy="85" rx="28" ry="20" fill="#ffffff" opacity="0.38" />
            <circle cx="98" cy="74" r="7" fill="#ff9ebb" opacity="0.85" />
            <circle cx="142" cy="74" r="7" fill="#ff9ebb" opacity="0.85" />
            <path d="M 100 64 Q 106 57, 112 64" stroke="#1b382b" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <path d="M 128 64 Q 134 57, 140 64" stroke="#1b382b" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <path d="M 114 74 Q 120 80, 126 74" stroke="#1b382b" strokeWidth="2.8" strokeLinecap="round" fill="none" />

            {/* Hands Anchored Stably on Hips with Winged Elbows */}
            <path d="M 92 78 L 78 88 L 88 100" fill="none" stroke="#52b788" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="78" cy="88" r="3" fill="#40916c" />
            <circle cx="90" cy="100" r="4.5" fill="#2d6a4f" />
            <path d="M 148 78 L 162 88 L 152 100" fill="none" stroke="#52b788" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="162" cy="88" r="3" fill="#40916c" />
            <circle cx="150" cy="100" r="4.5" fill="#2d6a4f" />

            {/* Sprout Leaf */}
            <g transform="translate(120, 32)">
              <path d="M 0 0 Q -3 -8, -10 -12" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M -10 -12 C -24 -18, -32 -10, -20 -4 C -13 -6, -10 -11, -10 -12 Z" fill="#40916c" />
              <path d="M -4 -6 C 5 -11, 14 -7, 7 0 C 1 -2, -3 -5, -4 -6 Z" fill="#52b788" />
            </g>
          </g>

          <g transform="translate(165, 10)">
            <rect x="0" y="0" width="85" height="22" rx="11" fill="var(--bg-glass-card, #ffffff)" stroke="var(--border-subtle, #e2e8f0)" strokeWidth="1" />
            <text x="42.5" y="14" fontSize="8" fill="var(--text-secondary, #4a5568)" textAnchor="middle" fontWeight="bold">
              {isSlowMode ? '🐢 Slow Human Raise' : '✨ Full Calf Contraction'}
            </text>
          </g>
        </svg>
      )}

      {/* ========================================================================= */}
      {/* 4. GENTLE ARM SWINGS — SAGITTAL PLANE SHOULDER PENDULUM                   */}
      {/* ========================================================================= */}
      {exerciseId === 'arm_swing' && (
        <svg width="260" height="200" viewBox="0 0 260 200">
          <line x1="15" y1="166" x2="245" y2="166" stroke="var(--border-subtle, #cbd5e1)" strokeWidth="3" strokeLinecap="round" />
          
          <path d="M 55 80 Q 45 105, 75 135" fill="none" stroke="#3a86c8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          <path d="M 195 80 Q 205 105, 175 135" fill="none" stroke="#3a86c8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          <text x="120" y="186" fontSize="8.5" fill="#3a86c8" textAnchor="middle" fontWeight="bold">Sagittal Shoulder Swing & Soft Knee Buoyancy</text>

          <ellipse cx="120" cy="166" rx="42" ry="6" fill="rgba(0,0,0,0.08)" />

          {/* Planted Sneakers */}
          <g transform="translate(96, 162)">
            <path d="M -8 0 C -8 -3, 4 -4, 9 -2 C 10 0, 10 3, 9 4 L -8 4 Z" fill="#1b4332" />
            <path d="M -9 4 L 10 4 C 11 4, 11 6, 10 7 L -9 7 Z" fill="#ffffff" />
          </g>
          <g transform="translate(144, 162)">
            <path d="M -8 0 C -8 -3, 4 -4, 9 -2 C 10 0, 10 3, 9 4 L -8 4 Z" fill="#1b4332" />
            <path d="M -9 4 L 10 4 C 11 4, 11 6, 10 7 L -9 7 Z" fill="#ffffff" />
          </g>
          <line x1="104" y1="114" x2="96" y2="162" stroke="#52b788" strokeWidth="9" strokeLinecap="round" />
          <circle cx="100" cy="138" r="3" fill="#40916c" />
          <line x1="136" y1="114" x2="144" y2="162" stroke="#52b788" strokeWidth="9" strokeLinecap="round" />
          <circle cx="140" cy="138" r="3" fill="#40916c" />

          {/* Torso & Soft Knee Dip */}
          <g className="human-pip-group" style={{ animation: `humanArmSwingKneeDip ${animDuration} ease-in-out infinite` }}>
            <path
              d="M 120 34 C 146 34, 160 56, 160 82 C 160 106, 142 118, 120 118 C 98 118, 80 106, 80 82 C 80 56, 94 34, 120 34 Z"
              fill="#74c69d"
            />
            <ellipse cx="120" cy="88" rx="28" ry="20" fill="#ffffff" opacity="0.38" />
            <circle cx="98" cy="76" r="7" fill="#ff9ebb" opacity="0.85" />
            <circle cx="142" cy="76" r="7" fill="#ff9ebb" opacity="0.85" />
            <path d="M 100 66 Q 106 59, 112 66" stroke="#1b382b" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <path d="M 128 66 Q 134 59, 140 66" stroke="#1b382b" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <path d="M 114 76 Q 120 82, 126 76" stroke="#1b382b" strokeWidth="2.8" strokeLinecap="round" fill="none" />

            {/* Articulated Human Arms Swinging in True Pendulum Arc */}
            <g style={{ animation: `humanArmSwingShoulders ${animDuration} ease-in-out infinite`, transformOrigin: '92px 72px' }}>
              <path d="M 92 72 L 72 96 L 60 105" stroke="#52b788" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <circle cx="72" cy="96" r="3" fill="#40916c" />
              <circle cx="58" cy="106" r="4.8" fill="#2d6a4f" />
            </g>

            <g style={{ animation: `humanArmSwingShoulders ${animDuration} ease-in-out infinite`, transformOrigin: '148px 72px' }}>
              <path d="M 148 72 L 168 96 L 180 105" stroke="#52b788" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <circle cx="168" cy="96" r="3" fill="#40916c" />
              <circle cx="182" cy="106" r="4.8" fill="#2d6a4f" />
            </g>

            {/* Sprout Leaf */}
            <g transform="translate(120, 34)">
              <path d="M 0 0 Q -3 -8, -10 -12" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M -10 -12 C -24 -18, -32 -10, -20 -4 C -13 -6, -10 -11, -10 -12 Z" fill="#40916c" />
              <path d="M -4 -6 C 5 -11, 14 -7, 7 0 C 1 -2, -3 -5, -4 -6 Z" fill="#52b788" />
            </g>
          </g>

          <g transform="translate(165, 10)">
            <rect x="0" y="0" width="85" height="22" rx="11" fill="var(--bg-glass-card, #ffffff)" stroke="var(--border-subtle, #e2e8f0)" strokeWidth="1" />
            <text x="42.5" y="14" fontSize="8" fill="var(--text-secondary, #4a5568)" textAnchor="middle" fontWeight="bold">
              {isSlowMode ? '🐢 Slow Pendulum' : '✨ Fluid Shoulder Arc'}
            </text>
          </g>
        </svg>
      )}

      {/* ========================================================================= */}
      {/* 5. PUSH-UP — HIGH PLANK & 45° ARROWHEAD ELBOWS (SIDE VIEW)                */}
      {/* ========================================================================= */}
      {exerciseId === 'pushup' && (
        <svg width="260" height="200" viewBox="0 0 260 200">
          <line x1="15" y1="160" x2="245" y2="160" stroke="var(--border-subtle, #cbd5e1)" strokeWidth="3" strokeLinecap="round" />
          
          <line x1="45" y1="152" x2="195" y2="85" stroke="#3a86c8" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
          <text x="120" y="70" fontSize="8.5" fill="#3a86c8" textAnchor="middle" fontWeight="bold">Straight Spine & 45° Arrowhead Elbows</text>

          {/* Planted Toes with Sneaker */}
          <g transform="translate(45, 154)">
            <path d="M -6 0 C -6 -3, 3 -4, 7 -2 C 8 0, 8 3, 7 4 L -6 4 Z" fill="#1b4332" />
            <path d="M -7 4 L 8 4 C 9 4, 9 6, 8 6.5 L -7 6.5 Z" fill="#ffffff" />
          </g>

          {/* Rigid Human Plank Lever */}
          <g className="human-pip-group" style={{ animation: `humanPushupPlankDescent ${animDuration} cubic-bezier(0.4, 0, 0.2, 1) infinite`, transformOrigin: '45px 154px' }}>
            
            {/* Pip Torso in Plank Angle */}
            <g transform="translate(146, 92) rotate(22)">
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

            {/* Straight Legs from Toes to Hip with Knee Joint */}
            <path d="M 45 152 L 82 133 L 120 114" stroke="#52b788" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="82" cy="133" r="3.2" fill="#40916c" />

            {/* Multi-Segment Pushing Arm (Shoulder -> Elbow 45° -> Palm on Floor) */}
            <path
              className="human-pip-group"
              d="M 160 85 L 160 118 L 160 152"
              fill="none"
              stroke="#40916c"
              strokeWidth="7.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: `humanPushupElbowFlexion ${animDuration} cubic-bezier(0.4, 0, 0.2, 1) infinite` }}
            />
            <g transform="translate(160, 154)">
              <ellipse cx="0" cy="0" rx="7" ry="3.5" fill="#2d6a4f" />
              <path d="M -4 0 L -5 3 M -2 0 L -2 4 M 0 0 L 0 4 M 2 0 L 2 3" stroke="#40916c" strokeWidth="1" strokeLinecap="round" />
            </g>
          </g>

          <g transform="translate(165, 10)">
            <rect x="0" y="0" width="85" height="22" rx="11" fill="var(--bg-glass-card, #ffffff)" stroke="var(--border-subtle, #e2e8f0)" strokeWidth="1" />
            <text x="42.5" y="14" fontSize="8" fill="var(--text-secondary, #4a5568)" textAnchor="middle" fontWeight="bold">
              {isSlowMode ? '🐢 Slow Push-Up' : '✨ 45° Elbow Form'}
            </text>
          </g>
        </svg>
      )}

      {/* ========================================================================= */}
      {/* 6. STEP LUNGE — 90/90 SPLIT STANCE & VERTICAL SPINE (SIDE VIEW)            */}
      {/* ========================================================================= */}
      {exerciseId === 'lunge' && (
        <svg width="260" height="200" viewBox="0 0 260 200">
          <line x1="15" y1="166" x2="245" y2="166" stroke="var(--border-subtle, #cbd5e1)" strokeWidth="3" strokeLinecap="round" />

          {/* Front Leg Kinematics (90° Knee Flexion, Shin Vertical) */}
          <path
            className="human-pip-group"
            d="M 120 110 L 140 134 L 140 162"
            fill="none"
            stroke="#52b788"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: `humanLungeFrontLegKinematics ${animDuration} cubic-bezier(0.4, 0, 0.2, 1) infinite` }}
          />
          <g transform="translate(170, 162)">
            <path d="M -8 0 C -8 -3, 4 -4, 9 -2 C 10 0, 10 3, 9 4 L -8 4 Z" fill="#1b4332" />
            <path d="M -9 4 L 10 4 C 11 4, 11 6, 10 7 L -9 7 Z" fill="#ffffff" />
          </g>

          {/* Back Leg Kinematics (90° Knee Drop, Heel Elevated) */}
          <path
            className="human-pip-group"
            d="M 120 110 L 100 134 L 100 162"
            fill="none"
            stroke="#40916c"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: `humanLungeBackLegKinematics ${animDuration} cubic-bezier(0.4, 0, 0.2, 1) infinite` }}
          />
          <g transform="translate(82, 162)">
            <path d="M -6 0 C -6 -3, 3 -4, 7 -2 C 8 0, 8 3, 7 4 L -6 4 Z" fill="#1b4332" />
            <path d="M -7 4 L 8 4 C 9 4, 9 6, 8 6.5 L -7 6.5 Z" fill="#ffffff" />
          </g>

          {/* Upright Human Torso (Descends straight down) */}
          <g className="human-pip-group" style={{ animation: `humanLungeVerticalDescent ${animDuration} cubic-bezier(0.4, 0, 0.2, 1) infinite` }}>
            <g transform="translate(120, 75)">
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

              {/* Hands Anchored on Hips */}
              <path d="M -30 10 L -38 18 L -28 26" fill="none" stroke="#52b788" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="-38" cy="18" r="2.8" fill="#40916c" />
              <circle cx="-28" cy="26" r="4" fill="#2d6a4f" />
              <path d="M 30 10 L 38 18 L 28 26" fill="none" stroke="#52b788" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="38" cy="18" r="2.8" fill="#40916c" />
              <circle cx="28" cy="26" r="4" fill="#2d6a4f" />

              {/* Sprout Leaf */}
              <g transform="translate(0, -38)">
                <path d="M 0 0 Q -3 -8, -10 -12" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M -10 -12 C -24 -18, -32 -10, -20 -4 C -13 -6, -10 -11, -10 -12 Z" fill="#40916c" />
                <path d="M -4 -6 C 5 -11, 14 -7, 7 0 C 1 -2, -3 -5, -4 -6 Z" fill="#52b788" />
              </g>
            </g>
          </g>

          <text x="180" y="118" fontSize="8" fill="#3a86c8" fontWeight="bold">90° Front</text>
          <text x="50" y="142" fontSize="8" fill="#3a86c8" fontWeight="bold">90° Back</text>

          <g transform="translate(165, 10)">
            <rect x="0" y="0" width="85" height="22" rx="11" fill="var(--bg-glass-card, #ffffff)" stroke="var(--border-subtle, #e2e8f0)" strokeWidth="1" />
            <text x="42.5" y="14" fontSize="8" fill="var(--text-secondary, #4a5568)" textAnchor="middle" fontWeight="bold">
              {isSlowMode ? '🐢 Slow 90/90 Lunge' : '✨ 90/90 Split Stance'}
            </text>
          </g>
        </svg>
      )}

      {/* ========================================================================= */}
      {/* 7. FOREARM PLANK — ISOMETRIC CORE & NEUTRAL SPINE                         */}
      {/* ========================================================================= */}
      {exerciseId === 'plank' && (
        <svg width="260" height="200" viewBox="0 0 260 200">
          <line x1="15" y1="160" x2="245" y2="160" stroke="var(--border-subtle, #cbd5e1)" strokeWidth="3" strokeLinecap="round" />

          <line x1="50" y1="126" x2="175" y2="102" stroke="#3a86c8" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />

          {/* Warm Core Glow */}
          <circle 
            cx="118" 
            cy="116" 
            r="28" 
            fill="rgba(217, 119, 54, 0.25)" 
            style={{ animation: `humanPlankCoreActivation ${isSlowMode ? '4s' : '2.5s'} ease-in-out infinite` }} 
          />
          <text x="118" y="120" fontSize="8.5" fill="#d97736" textAnchor="middle" fontWeight="bold">Isometric Core Brace</text>

          <g transform="translate(50, 154)">
            <path d="M -6 0 C -6 -3, 3 -4, 7 -2 C 8 0, 8 3, 7 4 L -6 4 Z" fill="#1b4332" />
            <path d="M -7 4 L 8 4 C 9 4, 9 6, 8 6.5 L -7 6.5 Z" fill="#ffffff" />
          </g>

          <g className="human-pip-group" style={{ animation: `humanPlankCoreActivation ${isSlowMode ? '4s' : '2.5s'} ease-in-out infinite`, transformOrigin: '118px 116px' }}>
            <g transform="translate(144, 102) rotate(16)">
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

            {/* Legs with Knee */}
            <path d="M 50 152 L 86 136 L 122 120" stroke="#52b788" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="86" cy="136" r="3.2" fill="#40916c" />

            {/* Forearms Under Shoulders (90° Angle) */}
            <line x1="156" y1="122" x2="156" y2="156" stroke="#40916c" strokeWidth="7" strokeLinecap="round" />
            <circle cx="156" cy="156" r="3.5" fill="#2d6a4f" />
            <line x1="156" y1="156" x2="184" y2="156" stroke="#2d6a4f" strokeWidth="7" strokeLinecap="round" />
          </g>

          <text x="120" y="186" fontSize="8.5" fill="var(--text-muted, #718096)" textAnchor="middle">Neutral Spine & Smooth Breathing (10–20s)</text>
        </svg>
      )}

      {/* ========================================================================= */}
      {/* 8. NECK & SHOULDER RESET — CERVICAL LATERAL FLEXION & SCAPULAR ROLL       */}
      {/* ========================================================================= */}
      {(exerciseId === 'stretch' || exerciseId === 'neck_stretch') && (
        <svg width="260" height="200" viewBox="0 0 260 200">
          <line x1="45" y1="166" x2="215" y2="166" stroke="var(--border-subtle, #cbd5e1)" strokeWidth="3" strokeLinecap="round" />
          
          <path d="M 70 80 Q 60 66, 72 56" fill="none" stroke="#3a86c8" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M 190 80 Q 200 66, 188 56" fill="none" stroke="#3a86c8" strokeWidth="1.5" strokeDasharray="3 2" />

          {/* Seated Base */}
          <ellipse cx="120" cy="160" rx="46" ry="12" fill="#52b788" />
          <g transform="translate(78, 156)">
            <path d="M -8 0 C -8 -3, 4 -4, 9 -2 C 10 0, 10 3, 9 4 L -8 4 Z" fill="#1b4332" />
            <path d="M -9 4 L 10 4 C 11 4, 11 6, 10 7 L -9 7 Z" fill="#ffffff" />
          </g>
          <g transform="translate(162, 156)">
            <path d="M -8 0 C -8 -3, 4 -4, 9 -2 C 10 0, 10 3, 9 4 L -8 4 Z" fill="#1b4332" />
            <path d="M -9 4 L 10 4 C 11 4, 11 6, 10 7 L -9 7 Z" fill="#ffffff" />
          </g>

          {/* Cervical Lateral Flexion (Ear toward shoulder, opposite shoulder depressed) */}
          <g className="human-pip-group" style={{ animation: `humanCervicalLateralFlexion ${animDuration} ease-in-out infinite`, transformOrigin: '120px 135px' }}>
            <path
              d="M 120 48 C 144 48, 156 68, 156 93 C 156 115, 138 127, 120 127 C 102 127, 84 115, 84 93 C 84 68, 96 48, 120 48 Z"
              fill="#74c69d"
            />
            <ellipse cx="120" cy="101" rx="26" ry="18" fill="#ffffff" opacity="0.4" />
            <circle cx="100" cy="91" r="6.5" fill="#ff9ebb" opacity="0.85" />
            <circle cx="140" cy="91" r="6.5" fill="#ff9ebb" opacity="0.85" />

            <path d="M 102 81 Q 107 86, 112 81" stroke="#1b382b" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M 128 81 Q 133 86, 138 81" stroke="#1b382b" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M 115 91 Q 120 95, 125 91" stroke="#1b382b" strokeWidth="2.4" strokeLinecap="round" fill="none" />

            {/* Articulated Resting Arms on Thighs */}
            <path d="M 94 88 L 82 108 L 86 126" stroke="#52b788" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="82" cy="108" r="2.8" fill="#40916c" />
            <circle cx="86" cy="126" r="4.5" fill="#2d6a4f" />

            <path d="M 146 88 L 158 108 L 154 126" stroke="#52b788" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="158" cy="108" r="2.8" fill="#40916c" />
            <circle cx="154" cy="126" r="4.5" fill="#2d6a4f" />

            <g transform="translate(120, 48)">
              <path d="M 0 0 Q -3 -8, -10 -12" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M -10 -12 C -24 -18, -32 -10, -20 -4 C -13 -6, -10 -11, -10 -12 Z" fill="#40916c" />
              <path d="M -4 -6 C 5 -11, 14 -7, 7 0 C 1 -2, -3 -5, -4 -6 Z" fill="#52b788" />
            </g>
          </g>

          <text x="120" y="186" fontSize="8.5" fill="var(--text-muted, #718096)" textAnchor="middle">Ear Toward Shoulder (Never Force or Strain)</text>
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
