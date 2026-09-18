import React from 'react';

/**
 * Pip Exercise Storyboard Step Illustrator
 * 
 * Provides biomechanically accurate, anatomically articulated human-like illustrations
 * for Pip the mascot across all 8 steps of every exercise in "Break It Down":
 * 
 * Anatomy & Alignment:
 * - Articulated arms: Shoulder -> Upper arm -> Elbow joint -> Forearm -> Wrist -> Hand (with thumb & fingers / athletic glove)
 * - Articulated legs: Hip socket -> Muscular thigh -> Kneecap joint -> Calf/Shin -> Ankle -> Detailed athletic sneaker
 * - Natural torso & head articulation: Neutral spine alignment, hip hinge mechanics, pelvic tilt, ear-to-shoulder tilt, and directional gaze
 * - Biomechanically accurate joint angles (90° parallel squats, 90/90 runner's march, 45° push-up elbows, 90/90 lunges, forearm plank)
 * - Visual training cues: Motion trajectory arrows, pause/hold markers, alignment guide lines, celebration sparkles
 */

export default function PipStepIllustration({ exerciseId = 'squat', stepNumber = 1, isActive = false }) {

  // ---------------------------------------------------------------------------
  // 1. REUSABLE ANATOMICAL ASSETS (Sneakers, Hands, Sprout, Face, Torso)
  // ---------------------------------------------------------------------------

  // Detailed Athletic Sneaker
  const renderSneaker = (cx, cy, isLeft = true, scale = 1, angle = 0) => (
    <g transform={`translate(${cx}, ${cy}) rotate(${angle}) scale(${scale})`}>
      {/* Sneaker body */}
      <path
        d={isLeft 
          ? "M -8 1 C -8 -4, 4 -5, 9 -2 C 10 0, 10 3, 9 5 L -8 5 Z" 
          : "M 8 1 C 8 -4, -4 -5, -9 -2 C -10 0, -10 3, -9 5 L 8 5 Z"}
        fill="#1b4332"
      />
      {/* Upper collar accent */}
      <path
        d={isLeft 
          ? "M -5 -3 L 1 -3 L 2 -1 L -4 -1 Z" 
          : "M 5 -3 L -1 -3 L -2 -1 L 4 -1 Z"}
        fill="#40916c"
      />
      {/* White rubber toe cap & sole */}
      <path
        d={isLeft 
          ? "M -9 5 L 10 5 C 11 5, 11 7.5, 10 8 L -9 8 C -10 8, -10 5, -9 5 Z" 
          : "M 9 5 L -10 5 C -11 5, -11 7.5, -10 8 L 9 8 C 10 8, 10 5, 9 5 Z"}
        fill="#ffffff"
        stroke="#d8f3dc"
        strokeWidth="0.5"
      />
      {/* Tread grooves */}
      <line x1={isLeft ? "-6" : "6"} y1="7.5" x2={isLeft ? "-2" : "2"} y2="7.5" stroke="#95d5b2" strokeWidth="0.8" />
      <line x1={isLeft ? "1" : "-1"} y1="7.5" x2={isLeft ? "6" : "-6"} y2="7.5" stroke="#95d5b2" strokeWidth="0.8" />
      {/* White laces */}
      <line x1={isLeft ? "-3" : "3"} y1="-2" x2={isLeft ? "2" : "-2"} y2="-2" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" />
      <line x1={isLeft ? "-2" : "2"} y1="0.5" x2={isLeft ? "3" : "-3"} y2="0.5" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" />
    </g>
  );

  // Human-like Athletic Gloved Hand
  const renderHand = (hx, hy, type = 'fist', angle = 0, scale = 1) => (
    <g transform={`translate(${hx}, ${hy}) rotate(${angle}) scale(${scale})`}>
      {type === 'palm_down' && (
        <g>
          {/* Palm base on ground */}
          <ellipse cx="0" cy="0" rx="4.5" ry="2.2" fill="#2d6a4f" />
          {/* Extended fingers */}
          <path d="M -3 0 L -4 4 M -1 0 L -1 5 M 1 0 L 1 5 M 3 0 L 3 4" stroke="#40916c" strokeWidth="1.2" strokeLinecap="round" />
          {/* Thumb */}
          <path d="M -3 -1 L -5 1" stroke="#40916c" strokeWidth="1.3" strokeLinecap="round" />
        </g>
      )}
      {type === 'on_hip' && (
        <g>
          {/* Hand resting on hip with thumb behind */}
          <ellipse cx="0" cy="0" rx="3.5" ry="4" fill="#2d6a4f" />
          <path d="M 0 -3 Q 2 0, 0 3" stroke="#52b788" strokeWidth="1.2" fill="none" />
          <circle cx="1" cy="-1" r="1.2" fill="#40916c" />
        </g>
      )}
      {type === 'reach' && (
        <g>
          {/* Open reaching hand with extended fingers */}
          <ellipse cx="0" cy="0" rx="3.5" ry="3.5" fill="#2d6a4f" />
          <path d="M 2 -2 L 6 -3 M 3 0 L 7 0 M 2 2 L 6 3 M -1 -2 L 1 -5" stroke="#40916c" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      )}
      {type === 'fist' && (
        <g>
          {/* Athletic runner's fist with thumb tucked */}
          <circle cx="0" cy="0" r="3.8" fill="#2d6a4f" />
          <path d="M -2 -2 C 0 -3, 2 -2, 2 0 C 2 2, 0 3, -2 2" stroke="#52b788" strokeWidth="1" fill="none" strokeLinecap="round" />
          <ellipse cx="-1.5" cy="-1.5" rx="1.5" ry="1.2" fill="#40916c" />
        </g>
      )}
    </g>
  );

  // Sprout Leaves
  const renderSprout = (x = 60, y = 22, tilt = 0) => (
    <g transform={`translate(${x}, ${y}) rotate(${tilt})`}>
      <path d="M 0 0 Q -2 -6, -7 -9" stroke="#1b4332" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M -7 -9 C -16 -13, -20 -7, -13 -3 C -9 -4, -7 -8, -7 -9 Z" fill="#2d6a4f" />
      <path d="M -3 -4 C 3 -8, 9 -5, 4 0 C 0 -1, -2 -3, -3 -4 Z" fill="#52b788" />
    </g>
  );

  // Pip Mascot Face with Correct Gaze & Expression
  const renderFace = (cx = 60, cy = 46, expression = 'happy', gaze = 'front') => {
    let eyeOffsetX = 0;
    let eyeOffsetY = 0;
    if (gaze === 'down') { eyeOffsetY = 2; }
    if (gaze === 'left') { eyeOffsetX = -3; }
    if (gaze === 'right') { eyeOffsetX = 3; }

    if (expression === 'celebrate') {
      return (
        <g>
          {/* Joyful closed curved eyes */}
          <path d={`M ${cx - 13} ${cy - 1} L ${cx - 8} ${cy + 2.5} L ${cx - 13} ${cy + 6}`} stroke="#1b382b" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d={`M ${cx + 13} ${cy - 1} L ${cx + 8} ${cy + 2.5} L ${cx + 13} ${cy + 6}`} stroke="#1b382b" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Big happy open mouth */}
          <path d={`M ${cx - 6} ${cy + 6} Q ${cx} ${cy + 14}, ${cx + 6} ${cy + 6} Z`} fill="#e63946" stroke="#1b382b" strokeWidth="1.4" />
          <path d={`M ${cx - 3} ${cy + 10} Q ${cx} ${cy + 13}, ${cx + 3} ${cy + 10}`} fill="#ffb703" />
          {/* Rosy blush cheeks */}
          <ellipse cx={cx - 16} cy={cy + 7} rx="6" ry="4.5" fill="#ff9ebb" opacity="0.85" />
          <ellipse cx={cx + 16} cy={cy + 7} rx="6" ry="4.5" fill="#ff9ebb" opacity="0.85" />
        </g>
      );
    }

    if (expression === 'focused') {
      return (
        <g>
          {/* Determined soft eyes looking at ground */}
          <ellipse cx={cx - 10 + eyeOffsetX} cy={cy + eyeOffsetY} rx="3" ry="3.5" fill="#1b382b" />
          <circle cx={cx - 11 + eyeOffsetX} cy={cy - 1 + eyeOffsetY} r="1" fill="#ffffff" />
          <ellipse cx={cx + 10 + eyeOffsetX} cy={cy + eyeOffsetY} rx="3" ry="3.5" fill="#1b382b" />
          <circle cx={cx + 9 + eyeOffsetX} cy={cy - 1 + eyeOffsetY} r="1" fill="#ffffff" />
          {/* Gentle focused smile */}
          <path d={`M ${cx - 4} ${cy + 7} Q ${cx} ${cy + 10}, ${cx + 4} ${cy + 7}`} stroke="#1b382b" strokeWidth="2" strokeLinecap="round" fill="none" />
          <ellipse cx={cx - 15} cy={cy + 6} rx="5.5" ry="4" fill="#ff9ebb" opacity="0.75" />
          <ellipse cx={cx + 15} cy={cy + 6} rx="5.5" ry="4" fill="#ff9ebb" opacity="0.75" />
        </g>
      );
    }

    // Default friendly open smile
    return (
      <g>
        {/* Soft cheerful eyes */}
        <path d={`M ${cx - 14 + eyeOffsetX} ${cy + eyeOffsetY} Q ${cx - 9 + eyeOffsetX} ${cy - 6 + eyeOffsetY}, ${cx - 4 + eyeOffsetX} ${cy + eyeOffsetY}`} stroke="#1b382b" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <path d={`M ${cx + 4 + eyeOffsetX} ${cy + eyeOffsetY} Q ${cx + 9 + eyeOffsetX} ${cy - 6 + eyeOffsetY}, ${cx + 14 + eyeOffsetX} ${cy + eyeOffsetY}`} stroke="#1b382b" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        {/* Gentle encouraging smile */}
        <path d={`M ${cx - 5} ${cy + 7} Q ${cx} ${cy + 11.5}, ${cx + 5} ${cy + 7}`} stroke="#1b382b" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        {/* Rosy cheeks */}
        <ellipse cx={cx - 15} cy={cy + 6} rx="6" ry="4.5" fill="#ff9ebb" opacity="0.85" />
        <ellipse cx={cx + 15} cy={cy + 6} rx="6" ry="4.5" fill="#ff9ebb" opacity="0.85" />
      </g>
    );
  };

  // ---------------------------------------------------------------------------
  // 2. CELEBRATION STEP (STEP 8 FOR ALL EXERCISES)
  // ---------------------------------------------------------------------------
  const renderCelebrateStep = () => (
    <svg viewBox="0 0 120 120" width="100%" height="100%">
      {/* Ground soft shadow */}
      <ellipse cx="60" cy="113" rx="28" ry="4" fill="rgba(0,0,0,0.08)" />

      {/* Radiant celebration sparkle lines */}
      <line x1="26" y1="26" x2="18" y2="20" stroke="#2d6a4f" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="30" y1="38" x2="20" y2="38" stroke="#2d6a4f" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="90" y1="26" x2="98" y2="20" stroke="#2d6a4f" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="86" y1="38" x2="96" y2="38" stroke="#2d6a4f" strokeWidth="2.2" strokeLinecap="round" />

      {/* Floating green hearts */}
      <g transform="translate(80, 10) scale(0.75)">
        <path d="M 0 4 C -2 0, -7 0, -7 4 C -7 7, 0 12, 0 12 C 0 12, 7 7, 7 4 C 7 0, 2 0, 0 4 Z" fill="#2d6a4f" />
      </g>
      <g transform="translate(24, 12) scale(0.6)">
        <path d="M 0 4 C -2 0, -7 0, -7 4 C -7 7, 0 12, 0 12 C 0 12, 7 7, 7 4 C 7 0, 2 0, 0 4 Z" fill="#52b788" />
      </g>

      {/* Articulated Legs (Standing strong) */}
      {/* Left leg */}
      <path d="M 48 76 L 46 92 L 46 108" stroke="#52b788" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="46" cy="92" r="3.2" fill="#40916c" /> {/* Left kneecap */}
      {renderSneaker(46, 108, true, 1)}

      {/* Right leg */}
      <path d="M 72 76 L 74 92 L 74 108" stroke="#52b788" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="74" cy="92" r="3.2" fill="#40916c" /> {/* Right kneecap */}
      {renderSneaker(74, 108, false, 1)}

      {/* Torso */}
      <path d="M 60 26 C 78 26, 88 42, 88 62 C 88 78, 76 84, 60 84 C 44 84, 32 78, 32 62 C 32 42, 42 26, 60 26 Z" fill="#74c69d" />
      <ellipse cx="60" cy="64" rx="18" ry="14" fill="#ffffff" opacity="0.38" />

      {/* Sprout & Face */}
      {renderSprout(60, 26)}
      {renderFace(60, 52, 'celebrate')}

      {/* Articulated Arms Raised High in Victory V */}
      {/* Left arm: Shoulder (38,54) -> Elbow (26,38) -> Wrist/Hand (18,22) */}
      <path d="M 38 54 L 26 38 L 18 22" stroke="#52b788" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="26" cy="38" r="3" fill="#40916c" /> {/* Left elbow */}
      {renderHand(18, 22, 'reach', -40)}

      {/* Right arm: Shoulder (82,54) -> Elbow (94,38) -> Wrist/Hand (102,22) */}
      <path d="M 82 54 L 94 38 L 102 22" stroke="#52b788" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="94" cy="38" r="3" fill="#40916c" /> {/* Right elbow */}
      {renderHand(102, 22, 'reach', 40)}
    </svg>
  );

  if (stepNumber === 8) {
    return renderCelebrateStep();
  }

  /* =========================================================================
     1. SQUAT STORYBOARD (8 Steps)
     - Step 1: Upright tall posture, feet hip-width, arms relaxed at sides
     - Step 2: Hips hinge back, knees bend 45°, arms start forward reach
     - Step 3: Deep parallel squat (90° knee angle, torso 35° incline, arms reach forward)
     - Step 4: Parallel hold with pause indicator
     - Step 5: Ascent drive pushing through heels, hips & knees extending
     - Step 6: Full standing lockout with glute contraction
     - Step 7: Continuous repetition rhythm with motion trails
     ========================================================================= */
  if (exerciseId === 'squat') {
    switch (stepNumber) {
      case 1:
      case 6:
        return (
          <svg viewBox="0 0 120 120" width="100%" height="100%">
            <ellipse cx="60" cy="113" rx="28" ry="4" fill="rgba(0,0,0,0.08)" />
            {/* Left Leg: Hip (48,74) -> Knee (47,91) -> Ankle (46,108) */}
            <path d="M 48 74 L 47 91 L 46 108" stroke="#52b788" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="47" cy="91" r="3.2" fill="#40916c" />
            {renderSneaker(46, 108, true, 1)}

            {/* Right Leg: Hip (72,74) -> Knee (73,91) -> Ankle (74,108) */}
            <path d="M 72 74 L 73 91 L 74 108" stroke="#52b788" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="73" cy="91" r="3.2" fill="#40916c" />
            {renderSneaker(74, 108, false, 1)}

            {/* Torso */}
            <path d="M 60 22 C 78 22, 88 38, 88 58 C 88 74, 76 82, 60 82 C 44 82, 32 74, 32 58 C 32 38, 42 22, 60 22 Z" fill="#74c69d" />
            <ellipse cx="60" cy="60" rx="18" ry="14" fill="#ffffff" opacity="0.38" />
            {renderSprout(60, 22)}
            {renderFace(60, 48, 'happy')}

            {/* Articulated Arms relaxed at sides: Shoulder -> Elbow -> Wrist -> Hand */}
            {/* Left arm */}
            <path d="M 38 48 L 33 63 L 36 78" stroke="#52b788" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="33" cy="63" r="2.8" fill="#40916c" />
            {renderHand(36, 78, 'fist', 10)}

            {/* Right arm */}
            <path d="M 82 48 L 87 63 L 84 78" stroke="#52b788" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="87" cy="63" r="2.8" fill="#40916c" />
            {renderHand(84, 78, 'fist', -10)}
          </svg>
        );

      case 2:
        return (
          <svg viewBox="0 0 120 120" width="100%" height="100%">
            <ellipse cx="56" cy="113" rx="30" ry="4" fill="rgba(0,0,0,0.08)" />
            {/* Downward hinge arrow */}
            <g transform="translate(20, 40)">
              <line x1="0" y1="0" x2="0" y2="18" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M -4 13 L 0 18 L 4 13" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>

            {/* Articulated Legs (Bending 45°): Hip -> Knee -> Ankle */}
            {/* Back leg */}
            <path d="M 66 78 L 74 92 L 68 108" stroke="#40916c" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="74" cy="92" r="3" fill="#2d6a4f" />
            {renderSneaker(68, 108, false, 0.95)}

            {/* Front leg */}
            <path d="M 52 78 L 62 92 L 54 108" stroke="#52b788" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="62" cy="92" r="3.2" fill="#40916c" />
            {renderSneaker(54, 108, true, 1)}

            {/* Torso inclined forward 16° for center of gravity */}
            <g transform="translate(54, 30) rotate(16)">
              <path d="M 0 -8 C 18 -8, 28 8, 28 26 C 28 44, 16 52, 0 52 C -16 52, -28 44, -28 26 C -28 8, -18 -8, 0 -8 Z" fill="#74c69d" />
              <ellipse cx="0" cy="30" rx="18" ry="14" fill="#ffffff" opacity="0.38" />
              {renderSprout(0, -8)}
              {renderFace(0, 18, 'happy')}

              {/* Articulated Counterbalance Arms extending forward */}
              {/* Shoulder (10, 18) -> Elbow (26, 18) -> Hand (42, 16) */}
              <path d="M 8 18 L 26 18 L 42 16" stroke="#52b788" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <circle cx="26" cy="18" r="2.8" fill="#40916c" />
              {renderHand(42, 16, 'reach', 0)}
            </g>
          </svg>
        );

      case 3:
        return (
          <svg viewBox="0 0 120 120" width="100%" height="100%">
            <ellipse cx="56" cy="113" rx="32" ry="4.5" fill="rgba(0,0,0,0.08)" />
            {/* Depth 90° angle marker */}
            <g transform="translate(86, 74)">
              <path d="M -8 -8 L 0 0 L 8 0" stroke="#2d6a4f" strokeWidth="1.8" fill="none" />
              <text x="4" y="-4" fontSize="8" fontWeight="800" fill="#2d6a4f">90°</text>
            </g>

            {/* Articulated Legs in Deep Parallel Squat (Thigh horizontal, Shin vertical) */}
            {/* Back leg */}
            <path d="M 44 88 L 68 86 L 64 108" stroke="#40916c" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="68" cy="86" r="3.2" fill="#2d6a4f" />
            {renderSneaker(64, 108, false, 0.95)}

            {/* Front leg */}
            <path d="M 38 88 L 62 86 L 56 108" stroke="#52b788" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="62" cy="86" r="3.4" fill="#40916c" />
            {renderSneaker(56, 108, true, 1)}

            {/* Torso hinged back and inclined ~26° */}
            <g transform="translate(48, 44) rotate(24)">
              <path d="M 0 -8 C 18 -8, 28 8, 28 26 C 28 44, 16 52, 0 52 C -16 52, -28 44, -28 26 C -28 8, -18 -8, 0 -8 Z" fill="#74c69d" />
              <ellipse cx="0" cy="30" rx="18" ry="14" fill="#ffffff" opacity="0.38" />
              {renderSprout(0, -8)}
              {renderFace(0, 18, 'focused')}

              {/* Arms fully extended forward for balance */}
              <path d="M 10 18 L 28 16 L 46 14" stroke="#52b788" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <circle cx="28" cy="16" r="2.8" fill="#40916c" />
              {renderHand(46, 14, 'reach', -10)}
            </g>
          </svg>
        );

      case 4:
        return (
          <svg viewBox="0 0 120 120" width="100%" height="100%">
            <ellipse cx="56" cy="113" rx="32" ry="4.5" fill="rgba(0,0,0,0.08)" />
            {/* Pause Hold Cues (||) */}
            <g transform="translate(90, 36)">
              <rect x="0" y="0" width="3.5" height="12" rx="1.5" fill="#2d6a4f" />
              <rect x="6.5" y="0" width="3.5" height="12" rx="1.5" fill="#2d6a4f" />
              <text x="-4" y="22" fontSize="7" fontWeight="800" fill="#2d6a4f">HOLD</text>
            </g>

            {/* Back leg */}
            <path d="M 44 88 L 68 86 L 64 108" stroke="#40916c" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="68" cy="86" r="3.2" fill="#2d6a4f" />
            {renderSneaker(64, 108, false, 0.95)}

            {/* Front leg */}
            <path d="M 38 88 L 62 86 L 56 108" stroke="#52b788" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="62" cy="86" r="3.4" fill="#40916c" />
            {renderSneaker(56, 108, true, 1)}

            {/* Torso */}
            <g transform="translate(48, 44) rotate(24)">
              <path d="M 0 -8 C 18 -8, 28 8, 28 26 C 28 44, 16 52, 0 52 C -16 52, -28 44, -28 26 C -28 8, -18 -8, 0 -8 Z" fill="#74c69d" />
              <ellipse cx="0" cy="30" rx="18" ry="14" fill="#ffffff" opacity="0.38" />
              {renderSprout(0, -8)}
              {renderFace(0, 18, 'focused')}
              <path d="M 10 18 L 28 16 L 46 14" stroke="#52b788" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <circle cx="28" cy="16" r="2.8" fill="#40916c" />
              {renderHand(46, 14, 'reach', -10)}
            </g>
          </svg>
        );

      case 5:
        return (
          <svg viewBox="0 0 120 120" width="100%" height="100%">
            <ellipse cx="56" cy="113" rx="30" ry="4" fill="rgba(0,0,0,0.08)" />
            {/* Upward drive arrow */}
            <g transform="translate(20, 64)">
              <line x1="0" y1="18" x2="0" y2="0" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M -4 5 L 0 0 L 4 5" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>

            {/* Legs extending up */}
            <path d="M 50 75 L 48 91 L 46 108" stroke="#52b788" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="48" cy="91" r="3.2" fill="#40916c" />
            <path d="M 70 75 L 72 91 L 74 108" stroke="#52b788" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="72" cy="91" r="3.2" fill="#40916c" />
            {renderSneaker(46, 108, true, 1)}
            {renderSneaker(74, 108, false, 1)}

            {/* Torso rising */}
            <path d="M 58 24 C 76 24, 86 40, 86 58 C 86 76, 74 84, 58 84 C 42 84, 30 76, 30 58 C 30 40, 40 24, 58 24 Z" fill="#74c69d" />
            <ellipse cx="58" cy="62" rx="18" ry="14" fill="#ffffff" opacity="0.38" />
            {renderSprout(58, 24)}
            {renderFace(58, 50, 'happy')}

            {/* Arms lowering with control */}
            <path d="M 44 52 L 56 64 L 68 68" stroke="#52b788" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="56" cy="64" r="2.8" fill="#40916c" />
            {renderHand(68, 68, 'reach', 20)}
          </svg>
        );

      case 7:
        return (
          <svg viewBox="0 0 120 120" width="100%" height="100%">
            <ellipse cx="56" cy="113" rx="30" ry="4" fill="rgba(0,0,0,0.08)" />
            {/* Repetition wave loop indicator */}
            <g transform="translate(88, 48)">
              <path d="M 0 0 C 8 4, 8 16, 0 20 C -6 23, -12 18, -10 12" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M -13 15 L -10 10 L -6 14" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <text x="-8" y="30" fontSize="7" fontWeight="800" fill="#2d6a4f">FLOW</text>
            </g>

            {/* Legs bending smoothly */}
            <path d="M 52 80 L 62 93 L 54 108" stroke="#52b788" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="62" cy="93" r="3.2" fill="#40916c" />
            {renderSneaker(54, 108, true, 1)}

            <g transform="translate(54, 32) rotate(16)">
              <path d="M 0 -8 C 18 -8, 28 8, 28 26 C 28 44, 16 52, 0 52 C -16 52, -28 44, -28 26 C -28 8, -18 -8, 0 -8 Z" fill="#74c69d" />
              <ellipse cx="0" cy="30" rx="18" ry="14" fill="#ffffff" opacity="0.38" />
              {renderSprout(0, -8)}
              {renderFace(0, 18, 'happy')}
              <path d="M 8 18 L 26 18 L 42 16" stroke="#52b788" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <circle cx="26" cy="18" r="2.8" fill="#40916c" />
              {renderHand(42, 16, 'reach', 0)}
            </g>
          </svg>
        );

      default:
        return null;
    }
  }

  /* =========================================================================
     2. MARCHING IN PLACE STORYBOARD (8 Steps)
     - Step 1: Upright tall posture, runner's arms ready
     - Step 2: Left knee drives up to 90° hip height, left ankle dorsiflexed
     - Step 3: Opposite arm sync: Right arm swings forward (90° elbow), Left arm swings back
     - Step 4: Top of march pause & balance hold
     - Step 5: Switch sides: Right knee drives to 90°, Left arm forward, Right arm back
     - Step 6: Full balanced marching rep
     - Step 7: Smooth rhythmic march pacing
     ========================================================================= */
  if (exerciseId === 'march') {
    switch (stepNumber) {
      case 1:
      case 6:
        return (
          <svg viewBox="0 0 120 120" width="100%" height="100%">
            <ellipse cx="60" cy="113" rx="28" ry="4" fill="rgba(0,0,0,0.08)" />
            {/* Standing grounded legs */}
            <path d="M 48 74 L 47 91 L 46 108" stroke="#52b788" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="47" cy="91" r="3.2" fill="#40916c" />
            {renderSneaker(46, 108, true, 1)}

            <path d="M 72 74 L 73 91 L 74 108" stroke="#52b788" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="73" cy="91" r="3.2" fill="#40916c" />
            {renderSneaker(74, 108, false, 1)}

            {/* Torso */}
            <path d="M 60 22 C 78 22, 88 38, 88 58 C 88 74, 76 82, 60 82 C 44 82, 32 74, 32 58 C 32 38, 42 22, 60 22 Z" fill="#74c69d" />
            <ellipse cx="60" cy="60" rx="18" ry="14" fill="#ffffff" opacity="0.38" />
            {renderSprout(60, 22)}
            {renderFace(60, 48, 'happy')}

            {/* Athletic 90° Runner's arms at sides */}
            {/* Left arm: Shoulder -> Elbow (90°) -> Fist near hip */}
            <path d="M 38 48 L 30 60 L 38 68" stroke="#52b788" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="30" cy="60" r="2.8" fill="#40916c" />
            {renderHand(38, 68, 'fist', -15)}

            {/* Right arm */}
            <path d="M 82 48 L 90 60 L 82 68" stroke="#52b788" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="90" cy="60" r="2.8" fill="#40916c" />
            {renderHand(82, 68, 'fist', 15)}
          </svg>
        );

      case 2:
      case 3:
      case 4:
        return (
          <svg viewBox="0 0 120 120" width="100%" height="100%">
            <ellipse cx="60" cy="113" rx="28" ry="4" fill="rgba(0,0,0,0.08)" />
            {stepNumber === 2 && (
              <g transform="translate(18, 48)">
                <line x1="0" y1="18" x2="0" y2="0" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M -4 5 L 0 0 L 4 5" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>
            )}
            {stepNumber === 4 && (
              <g transform="translate(90, 32)">
                <rect x="0" y="0" width="3" height="10" rx="1.5" fill="#2d6a4f" />
                <rect x="5.5" y="0" width="3" height="10" rx="1.5" fill="#2d6a4f" />
                <text x="-4" y="20" fontSize="7" fontWeight="800" fill="#2d6a4f">PAUSE</text>
              </g>
            )}

            {/* Grounded Right Leg */}
            <path d="M 72 74 L 73 91 L 74 108" stroke="#52b788" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="73" cy="91" r="3.2" fill="#40916c" />
            {renderSneaker(74, 108, false, 1)}

            {/* Lifted Left Leg: Hip (48,74) -> Knee (32,74) [Horizontal Thigh] -> Ankle (32,94) [Vertical Shin] */}
            <path d="M 48 74 L 32 74 L 32 94" stroke="#40916c" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="32" cy="74" r="3.5" fill="#2d6a4f" /> {/* 90° Knee Joint */}
            {renderSneaker(32, 94, true, 1, 0)}

            {/* Torso */}
            <path d="M 60 22 C 78 22, 88 38, 88 58 C 88 74, 76 82, 60 82 C 44 82, 32 74, 32 58 C 32 38, 42 22, 60 22 Z" fill="#74c69d" />
            <ellipse cx="60" cy="60" rx="18" ry="14" fill="#ffffff" opacity="0.38" />
            {renderSprout(60, 22)}
            {renderFace(60, 48, 'happy')}

            {/* Opposite Runner's Arm Sync: Right arm forward at 90°, Left arm back at 90° */}
            {/* Right arm: Shoulder (82,48) -> Elbow (96,56) -> Hand to chest (84,46) */}
            <path d="M 82 48 L 96 56 L 86 46" stroke="#52b788" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="96" cy="56" r="3" fill="#40916c" />
            {renderHand(86, 46, 'fist', -20)}

            {/* Left arm: Shoulder (38,48) -> Elbow (24,58) -> Hand behind (20,72) */}
            <path d="M 38 48 L 24 58 L 20 72" stroke="#40916c" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="24" cy="58" r="2.8" fill="#2d6a4f" />
            {renderHand(20, 72, 'fist', 20)}
          </svg>
        );

      case 5:
      case 7:
        return (
          <svg viewBox="0 0 120 120" width="100%" height="100%">
            <ellipse cx="60" cy="113" rx="28" ry="4" fill="rgba(0,0,0,0.08)" />
            {stepNumber === 5 && (
              <g transform="translate(94, 48)">
                <line x1="0" y1="18" x2="0" y2="0" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M -4 5 L 0 0 L 4 5" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>
            )}

            {/* Grounded Left Leg */}
            <path d="M 48 74 L 47 91 L 46 108" stroke="#52b788" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="47" cy="91" r="3.2" fill="#40916c" />
            {renderSneaker(46, 108, true, 1)}

            {/* Lifted Right Leg: Hip (72,74) -> Knee (88,74) [Horizontal Thigh] -> Ankle (88,94) */}
            <path d="M 72 74 L 88 74 L 88 94" stroke="#40916c" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="88" cy="74" r="3.5" fill="#2d6a4f" />
            {renderSneaker(88, 94, false, 1, 0)}

            {/* Torso */}
            <path d="M 60 22 C 78 22, 88 38, 88 58 C 88 74, 76 82, 60 82 C 44 82, 32 74, 32 58 C 32 38, 42 22, 60 22 Z" fill="#74c69d" />
            <ellipse cx="60" cy="60" rx="18" ry="14" fill="#ffffff" opacity="0.38" />
            {renderSprout(60, 22)}
            {renderFace(60, 48, 'happy')}

            {/* Left Arm forward at 90°, Right Arm back at 90° */}
            {/* Left arm: Shoulder (38,48) -> Elbow (24,56) -> Hand to chest (34,46) */}
            <path d="M 38 48 L 24 56 L 34 46" stroke="#52b788" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="24" cy="56" r="3" fill="#40916c" />
            {renderHand(34, 46, 'fist', 20)}

            {/* Right arm: Shoulder (82,48) -> Elbow (96,58) -> Hand behind (100,72) */}
            <path d="M 82 48 L 96 58 L 100 72" stroke="#40916c" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="96" cy="58" r="2.8" fill="#2d6a4f" />
            {renderHand(100, 72, 'fist', -20)}
          </svg>
        );

      default:
        return null;
    }
  }

  /* =========================================================================
     3. HEEL & CALF RAISES STORYBOARD (8 Steps)
     - Step 1: Standing tall, hands firmly on hips with winged elbows
     - Step 2: Pressing into balls of feet, initiating ankle plantarflexion
     - Step 3: Peak elevation onto balls of feet, heels high, calves flexed
     - Step 4: Top hold pause & ankle stability
     - Step 5: Controlled eccentric descent
     - Step 6: Grounded reset
     - Step 7: Smooth continuous cadence
     ========================================================================= */
  if (exerciseId === 'heel_raise') {
    switch (stepNumber) {
      case 1:
      case 6:
        return (
          <svg viewBox="0 0 120 120" width="100%" height="100%">
            <ellipse cx="60" cy="113" rx="28" ry="4" fill="rgba(0,0,0,0.08)" />
            {/* Flat-footed straight legs */}
            <path d="M 48 74 L 47 91 L 46 108" stroke="#52b788" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="47" cy="91" r="3.2" fill="#40916c" />
            {renderSneaker(46, 108, true, 1)}

            <path d="M 72 74 L 73 91 L 74 108" stroke="#52b788" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="73" cy="91" r="3.2" fill="#40916c" />
            {renderSneaker(74, 108, false, 1)}

            {/* Torso */}
            <path d="M 60 22 C 78 22, 88 38, 88 58 C 88 74, 76 82, 60 82 C 44 82, 32 74, 32 58 C 32 38, 42 22, 60 22 Z" fill="#74c69d" />
            <ellipse cx="60" cy="60" rx="18" ry="14" fill="#ffffff" opacity="0.38" />
            {renderSprout(60, 22)}
            {renderFace(60, 48, 'happy')}

            {/* Hands planted on hips with winged elbows: Shoulder -> Elbow flared -> Hand on waist */}
            <path d="M 38 48 L 24 58 L 38 66" stroke="#52b788" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="24" cy="58" r="2.8" fill="#40916c" />
            {renderHand(38, 66, 'on_hip', 0)}

            <path d="M 82 48 L 96 58 L 82 66" stroke="#52b788" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="96" cy="58" r="2.8" fill="#40916c" />
            {renderHand(82, 66, 'on_hip', 0)}
          </svg>
        );

      case 2:
      case 3:
      case 4:
      case 7:
        return (
          <svg viewBox="0 0 120 120" width="100%" height="100%">
            <ellipse cx="60" cy="113" rx="26" ry="4" fill="rgba(0,0,0,0.08)" />
            {stepNumber === 2 && (
              <g transform="translate(18, 52)">
                <line x1="0" y1="18" x2="0" y2="0" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M -4 5 L 0 0 L 4 5" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>
            )}
            {stepNumber === 4 && (
              <g transform="translate(90, 28)">
                <rect x="0" y="0" width="3" height="10" rx="1.5" fill="#2d6a4f" />
                <rect x="5.5" y="0" width="3" height="10" rx="1.5" fill="#2d6a4f" />
                <text x="-4" y="20" fontSize="7" fontWeight="800" fill="#2d6a4f">HOLD</text>
              </g>
            )}

            {/* Elevated body: Rising vertically 14px onto balls of feet */}
            <g transform="translate(0, -14)">
              {/* Straight legs with calves flexed */}
              <path d="M 48 74 L 47 91 L 46 108" stroke="#52b788" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <circle cx="47" cy="91" r="3.2" fill="#40916c" />
              {/* Sneaker with heel tilted high off floor (-25°) */}
              {renderSneaker(46, 106, true, 1, -25)}

              <path d="M 72 74 L 73 91 L 74 108" stroke="#52b788" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <circle cx="73" cy="91" r="3.2" fill="#40916c" />
              {renderSneaker(74, 106, false, 1, -25)}

              {/* Torso */}
              <path d="M 60 22 C 78 22, 88 38, 88 58 C 88 74, 76 82, 60 82 C 44 82, 32 74, 32 58 C 32 38, 42 22, 60 22 Z" fill="#74c69d" />
              <ellipse cx="60" cy="60" rx="18" ry="14" fill="#ffffff" opacity="0.38" />
              {renderSprout(60, 22)}
              {renderFace(60, 48, 'happy')}

              {/* Hands on hips */}
              <path d="M 38 48 L 24 58 L 38 66" stroke="#52b788" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <circle cx="24" cy="58" r="2.8" fill="#40916c" />
              {renderHand(38, 66, 'on_hip', 0)}

              <path d="M 82 48 L 96 58 L 82 66" stroke="#52b788" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <circle cx="96" cy="58" r="2.8" fill="#40916c" />
              {renderHand(82, 66, 'on_hip', 0)}
            </g>
          </svg>
        );

      case 5:
        return (
          <svg viewBox="0 0 120 120" width="100%" height="100%">
            <ellipse cx="60" cy="113" rx="28" ry="4" fill="rgba(0,0,0,0.08)" />
            {/* Lowering arrow */}
            <g transform="translate(18, 45)">
              <line x1="0" y1="0" x2="0" y2="18" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M -4 13 L 0 18 L 4 13" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>

            {/* Halfway down */}
            <g transform="translate(0, -6)">
              <path d="M 48 74 L 47 91 L 46 108" stroke="#52b788" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <circle cx="47" cy="91" r="3.2" fill="#40916c" />
              {renderSneaker(47, 107, true, 1, -12)}

              <path d="M 72 74 L 73 91 L 74 108" stroke="#52b788" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <circle cx="73" cy="91" r="3.2" fill="#40916c" />
              {renderSneaker(73, 107, false, 1, -12)}

              <path d="M 60 22 C 78 22, 88 38, 88 58 C 88 74, 76 82, 60 82 C 44 82, 32 74, 32 58 C 32 38, 42 22, 60 22 Z" fill="#74c69d" />
              <ellipse cx="60" cy="60" rx="18" ry="14" fill="#ffffff" opacity="0.38" />
              {renderSprout(60, 22)}
              {renderFace(60, 48, 'happy')}

              <path d="M 38 48 L 24 58 L 38 66" stroke="#52b788" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <circle cx="24" cy="58" r="2.8" fill="#40916c" />
              {renderHand(38, 66, 'on_hip', 0)}

              <path d="M 82 48 L 96 58 L 82 66" stroke="#52b788" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <circle cx="96" cy="58" r="2.8" fill="#40916c" />
              {renderHand(82, 66, 'on_hip', 0)}
            </g>
          </svg>
        );

      default:
        return null;
    }
  }

  /* =========================================================================
     4. GENTLE ARM SWINGS STORYBOARD (8 Steps)
     - Step 1: Standing tall, soft knees, relaxed shoulders
     - Step 2: Arms initiate pendulum forward swing
     - Step 3: Arms reach chest/shoulder height in front
     - Step 4: Gentle apex float pause
     - Step 5: Arms swing smoothly back past hips
     - Step 6: Full pendulum rhythm
     - Step 7: Harmonious breathing rhythm
     ========================================================================= */
  if (exerciseId === 'arm_swing') {
    switch (stepNumber) {
      case 1:
      case 6:
        return (
          <svg viewBox="0 0 120 120" width="100%" height="100%">
            <ellipse cx="60" cy="113" rx="28" ry="4" fill="rgba(0,0,0,0.08)" />
            <path d="M 48 74 L 47 91 L 46 108" stroke="#52b788" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="47" cy="91" r="3.2" fill="#40916c" />
            {renderSneaker(46, 108, true, 1)}

            <path d="M 72 74 L 73 91 L 74 108" stroke="#52b788" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="73" cy="91" r="3.2" fill="#40916c" />
            {renderSneaker(74, 108, false, 1)}

            <path d="M 60 22 C 78 22, 88 38, 88 58 C 88 74, 76 82, 60 82 C 44 82, 32 74, 32 58 C 32 38, 42 22, 60 22 Z" fill="#74c69d" />
            <ellipse cx="60" cy="60" rx="18" ry="14" fill="#ffffff" opacity="0.38" />
            {renderSprout(60, 22)}
            {renderFace(60, 48, 'happy')}

            {/* Arms relaxed at sides */}
            <path d="M 38 48 L 33 63 L 36 78" stroke="#52b788" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="33" cy="63" r="2.8" fill="#40916c" />
            {renderHand(36, 78, 'reach', 10)}

            <path d="M 82 48 L 87 63 L 84 78" stroke="#52b788" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="87" cy="63" r="2.8" fill="#40916c" />
            {renderHand(84, 78, 'reach', -10)}
          </svg>
        );

      case 2:
      case 3:
      case 7:
        // Forward reach to shoulder height
        return (
          <svg viewBox="0 0 120 120" width="100%" height="100%">
            <ellipse cx="60" cy="113" rx="28" ry="4" fill="rgba(0,0,0,0.08)" />
            {/* Forward swing motion arc */}
            <path d="M 30 75 Q 16 55, 20 38" stroke="#2d6a4f" strokeWidth="1.8" strokeDasharray="3,3" strokeLinecap="round" fill="none" />
            <path d="M 90 75 Q 104 55, 100 38" stroke="#2d6a4f" strokeWidth="1.8" strokeDasharray="3,3" strokeLinecap="round" fill="none" />

            <path d="M 48 74 L 47 91 L 46 108" stroke="#52b788" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="47" cy="91" r="3.2" fill="#40916c" />
            {renderSneaker(46, 108, true, 1)}

            <path d="M 72 74 L 73 91 L 74 108" stroke="#52b788" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="73" cy="91" r="3.2" fill="#40916c" />
            {renderSneaker(74, 108, false, 1)}

            <path d="M 60 22 C 78 22, 88 38, 88 58 C 88 74, 76 82, 60 82 C 44 82, 32 74, 32 58 C 32 38, 42 22, 60 22 Z" fill="#74c69d" />
            <ellipse cx="60" cy="60" rx="18" ry="14" fill="#ffffff" opacity="0.38" />
            {renderSprout(60, 22)}
            {renderFace(60, 48, 'happy')}

            {/* Articulated arms reaching forward: Shoulder -> Elbow (soft) -> Hand */}
            {/* Left arm */}
            <path d="M 38 48 L 22 42 L 14 36" stroke="#52b788" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="22" cy="42" r="2.8" fill="#40916c" />
            {renderHand(14, 36, 'reach', -30)}

            {/* Right arm */}
            <path d="M 82 48 L 98 42 L 106 36" stroke="#52b788" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="98" cy="42" r="2.8" fill="#40916c" />
            {renderHand(106, 36, 'reach', 30)}
          </svg>
        );

      case 4:
      case 5:
        // Swing back behind hips
        return (
          <svg viewBox="0 0 120 120" width="100%" height="100%">
            <ellipse cx="60" cy="113" rx="28" ry="4" fill="rgba(0,0,0,0.08)" />
            <path d="M 48 74 L 47 91 L 46 108" stroke="#52b788" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="47" cy="91" r="3.2" fill="#40916c" />
            {renderSneaker(46, 108, true, 1)}

            <path d="M 72 74 L 73 91 L 74 108" stroke="#52b788" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="73" cy="91" r="3.2" fill="#40916c" />
            {renderSneaker(74, 108, false, 1)}

            <path d="M 60 22 C 78 22, 88 38, 88 58 C 88 74, 76 82, 60 82 C 44 82, 32 74, 32 58 C 32 38, 42 22, 60 22 Z" fill="#74c69d" />
            <ellipse cx="60" cy="60" rx="18" ry="14" fill="#ffffff" opacity="0.38" />
            {renderSprout(60, 22)}
            {renderFace(60, 48, 'happy')}

            {/* Arms swinging back past hips */}
            <path d="M 38 48 L 28 66 L 20 78" stroke="#52b788" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="28" cy="66" r="2.8" fill="#40916c" />
            {renderHand(20, 78, 'reach', 20)}

            <path d="M 82 48 L 92 66 L 100 78" stroke="#52b788" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="92" cy="66" r="2.8" fill="#40916c" />
            {renderHand(100, 78, 'reach', -20)}
          </svg>
        );

      default:
        return null;
    }
  }

  /* =========================================================================
     5. PUSH-UP STORYBOARD (8 Steps)
     - Step 1: High plank setup, straight arms, straight body plank line
     - Step 2: Initiation descending as one rigid plane
     - Step 3: Bottom position: 45° elbow bend (arrowhead), chest hovering
     - Step 4: Bottom hover hold
     - Step 5: Pressing phase pushing floor away
     - Step 6: Lockout high plank
     - Step 7: Core brace alignment check
     ========================================================================= */
  if (exerciseId === 'pushup') {
    switch (stepNumber) {
      case 1:
      case 6:
      case 7:
        return (
          <svg viewBox="0 0 120 120" width="100%" height="100%">
            {/* Mat ground line */}
            <line x1="16" y1="102" x2="104" y2="102" stroke="rgba(45,106,79,0.2)" strokeWidth="2" strokeLinecap="round" />

            {/* Back Feet / Toes on floor */}
            {renderSneaker(28, 98, true, 0.9, -15)}

            {/* Straight Legs in rigid plank: Ankle (28,96) -> Knee (48,82) -> Hip (68,70) */}
            <path d="M 28 96 L 48 82 L 68 70" stroke="#52b788" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="48" cy="82" r="3.2" fill="#40916c" /> {/* Knee joint */}

            {/* Straight Supporting Arm: Shoulder (82,56) -> Elbow (83,78) -> Wrist/Palm (84,100) */}
            <path d="M 82 56 L 83 78 L 84 100" stroke="#40916c" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="83" cy="78" r="2.8" fill="#2d6a4f" />
            {renderHand(84, 100, 'palm_down', 0)}

            {/* Torso & Head angled horizontally in plank */}
            <g transform="translate(80, 52) rotate(16)">
              <path d="M 0 -18 C 14 -18, 20 -8, 20 6 C 20 18, 12 24, 0 24 C -12 24, -20 18, -20 6 C -20 -8, -14 -18, 0 -18 Z" fill="#74c69d" />
              <ellipse cx="0" cy="8" rx="12" ry="9" fill="#ffffff" opacity="0.38" />
              {renderSprout(0, -18, -20)}
              {renderFace(0, 4, 'focused', 'down')}
            </g>
          </svg>
        );

      case 2:
      case 3:
      case 4:
      case 5:
        return (
          <svg viewBox="0 0 120 120" width="100%" height="100%">
            <line x1="16" y1="102" x2="104" y2="102" stroke="rgba(45,106,79,0.2)" strokeWidth="2" strokeLinecap="round" />

            {stepNumber === 2 && (
              <g transform="translate(82, 30)">
                <line x1="0" y1="0" x2="0" y2="16" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M -3 11 L 0 16 L 3 11" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>
            )}
            {stepNumber === 4 && (
              <g transform="translate(88, 28)">
                <rect x="0" y="0" width="3" height="10" rx="1.5" fill="#2d6a4f" />
                <rect x="5.5" y="0" width="3" height="10" rx="1.5" fill="#2d6a4f" />
                <text x="-4" y="20" fontSize="7" fontWeight="800" fill="#2d6a4f">PAUSE</text>
              </g>
            )}

            {/* Back Feet */}
            {renderSneaker(28, 98, true, 0.9, -15)}

            {/* Straight Legs lowered closer to floor */}
            <path d="M 28 96 L 48 88 L 68 80" stroke="#52b788" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="48" cy="88" r="3.2" fill="#40916c" />

            {/* Articulated 45° Bent Elbow (Arrowhead alignment): Shoulder (82,70) -> Elbow bent back (70,82) -> Palm on floor (84,100) */}
            <path d="M 82 70 L 70 82 L 84 100" stroke="#40916c" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="70" cy="82" r="3" fill="#2d6a4f" /> {/* 45° Elbow Joint */}
            {renderHand(84, 100, 'palm_down', 0)}

            {/* Torso hovering 2 inches above ground */}
            <g transform="translate(80, 68) rotate(10)">
              <path d="M 0 -18 C 14 -18, 20 -8, 20 6 C 20 18, 12 24, 0 24 C -12 24, -20 18, -20 6 C -20 -8, -14 -18, 0 -18 Z" fill="#74c69d" />
              <ellipse cx="0" cy="8" rx="12" ry="9" fill="#ffffff" opacity="0.38" />
              {renderSprout(0, -18, -20)}
              {renderFace(0, 4, 'focused', 'down')}
            </g>
          </svg>
        );

      default:
        return null;
    }
  }

  /* =========================================================================
     6. STEP LUNGE STORYBOARD (8 Steps)
     - Step 1: Standing tall, hands on hips
     - Step 2: Forward step initiation
     - Step 3: 90/90 Lunge bottom (Front thigh parallel, back knee hovering 90°)
     - Step 4: Bottom hold & balance pause
     - Step 5: Push-off drive returning tall
     - Step 6: Full standing reset
     - Step 7: Alternating leg switch
     ========================================================================= */
  if (exerciseId === 'lunge') {
    switch (stepNumber) {
      case 1:
      case 6:
        return (
          <svg viewBox="0 0 120 120" width="100%" height="100%">
            <ellipse cx="60" cy="113" rx="28" ry="4" fill="rgba(0,0,0,0.08)" />
            <path d="M 48 74 L 47 91 L 46 108" stroke="#52b788" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="47" cy="91" r="3.2" fill="#40916c" />
            {renderSneaker(46, 108, true, 1)}

            <path d="M 72 74 L 73 91 L 74 108" stroke="#52b788" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="73" cy="91" r="3.2" fill="#40916c" />
            {renderSneaker(74, 108, false, 1)}

            <path d="M 60 22 C 78 22, 88 38, 88 58 C 88 74, 76 82, 60 82 C 44 82, 32 74, 32 58 C 32 38, 42 22, 60 22 Z" fill="#74c69d" />
            <ellipse cx="60" cy="60" rx="18" ry="14" fill="#ffffff" opacity="0.38" />
            {renderSprout(60, 22)}
            {renderFace(60, 48, 'happy')}

            <path d="M 38 48 L 24 58 L 38 66" stroke="#52b788" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="24" cy="58" r="2.8" fill="#40916c" />
            {renderHand(38, 66, 'on_hip', 0)}

            <path d="M 82 48 L 96 58 L 82 66" stroke="#52b788" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="96" cy="58" r="2.8" fill="#40916c" />
            {renderHand(82, 66, 'on_hip', 0)}
          </svg>
        );

      case 2:
      case 3:
      case 4:
      case 5:
      case 7:
        // 90/90 Lunge Stance
        return (
          <svg viewBox="0 0 120 120" width="100%" height="100%">
            <ellipse cx="60" cy="113" rx="34" ry="4" fill="rgba(0,0,0,0.08)" />
            {stepNumber === 2 && (
              <g transform="translate(86, 55)">
                <line x1="0" y1="0" x2="0" y2="16" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M -3 11 L 0 16 L 3 11" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>
            )}
            {stepNumber === 4 && (
              <g transform="translate(18, 36)">
                <rect x="0" y="0" width="3" height="10" rx="1.5" fill="#2d6a4f" />
                <rect x="5.5" y="0" width="3" height="10" rx="1.5" fill="#2d6a4f" />
                <text x="-4" y="20" fontSize="7" fontWeight="800" fill="#2d6a4f">90/90</text>
              </g>
            )}

            {/* Front Leg (Clean 90° Knee Bend): Hip (60,76) -> Knee (82,76) [Horizontal Thigh] -> Ankle (82,108) [Vertical Shin] */}
            <path d="M 60 76 L 82 76 L 82 108" stroke="#52b788" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="82" cy="76" r="3.5" fill="#40916c" /> {/* Front 90° Knee */}
            {renderSneaker(82, 108, false, 1)}

            {/* Back Leg (90° Hovering): Hip (60,76) -> Knee (40,94) [Vertical Thigh] -> Ankle (36,108) */}
            <path d="M 60 76 L 40 94 L 36 108" stroke="#40916c" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="40" cy="94" r="3.2" fill="#2d6a4f" /> {/* Back hovering knee */}
            {renderSneaker(36, 108, true, 0.9, -20)}

            {/* Torso upright & vertical */}
            <path d="M 60 30 C 76 30, 84 44, 84 62 C 84 76, 74 84, 60 84 C 46 84, 36 76, 36 62 C 36 44, 44 30, 60 30 Z" fill="#74c69d" />
            <ellipse cx="60" cy="66" rx="16" ry="12" fill="#ffffff" opacity="0.38" />
            {renderSprout(60, 30)}
            {renderFace(60, 54, 'happy')}

            {/* Hands on hips */}
            <path d="M 44 58 L 32 66 L 44 74" stroke="#52b788" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="32" cy="66" r="2.8" fill="#40916c" />
            {renderHand(44, 74, 'on_hip', 0)}

            <path d="M 76 58 L 88 66 L 76 74" stroke="#52b788" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="88" cy="66" r="2.8" fill="#40916c" />
            {renderHand(76, 74, 'on_hip', 0)}
          </svg>
        );

      default:
        return null;
    }
  }

  /* =========================================================================
     7. FOREARM PLANK HOLD STORYBOARD (8 Steps)
     - Step 1: Forearms flat on mat under shoulders
     - Step 2: Feet stepped back into straight line
     - Step 3: Posterior pelvic tilt & core brace
     - Step 4: Neutral neck alignment looking at mat
     - Step 5: Slow steady breathing
     - Step 6: 10-20s sustained endurance hold
     - Step 7: Restful reset lowering knees
     ========================================================================= */
  if (exerciseId === 'plank') {
    return (
      <svg viewBox="0 0 120 120" width="100%" height="100%">
        <line x1="16" y1="102" x2="104" y2="102" stroke="rgba(45,106,79,0.2)" strokeWidth="2" strokeLinecap="round" />

        {/* Feet on floor */}
        {renderSneaker(28, 98, true, 0.9, -15)}

        {/* Straight Legs in rigid plank */}
        <path d="M 28 96 L 48 86 L 68 76" stroke="#52b788" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="48" cy="86" r="3.2" fill="#40916c" />

        {/* Forearm on ground: Shoulder (82,68) -> Elbow (82,100) -> Forearm flat on mat to wrist (98,100) */}
        <path d="M 82 68 L 82 100 L 98 100" stroke="#40916c" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="82" cy="100" r="3.2" fill="#2d6a4f" /> {/* Grounded 90° Elbow */}
        {renderHand(98, 100, 'palm_down', 0)}

        {/* Torso & Head in neutral alignment */}
        <g transform="translate(80, 62) rotate(12)">
          <path d="M 0 -18 C 14 -18, 20 -8, 20 6 C 20 18, 12 24, 0 24 C -12 24, -20 18, -20 6 C -20 -8, -14 -18, 0 -18 Z" fill="#74c69d" />
          <ellipse cx="0" cy="8" rx="12" ry="9" fill="#ffffff" opacity="0.38" />
          {renderSprout(0, -18, -20)}
          {renderFace(0, 4, 'focused', 'down')}
        </g>
      </svg>
    );
  }

  /* =========================================================================
     8. NECK & SHOULDER RESET (STRETCH) (8 Steps)
     - Step 1: Seated tall, shoulders depressed away from ears, hands on lap
     - Step 2: Right lateral neck tilt (right ear to right shoulder)
     - Step 3: Deep gentle stretch hold
     - Step 4: Return center, roll shoulders
     - Step 5: Left lateral neck tilt (left ear to left shoulder)
     - Step 6: Deep gentle stretch hold
     - Step 7: Tall elongated spine reset
     ========================================================================= */
  if (exerciseId === 'stretch' || exerciseId === 'neck_stretch') {
    const isTilt = stepNumber === 2 || stepNumber === 3 || stepNumber === 5 || stepNumber === 6;
    const isRightTilt = stepNumber === 2 || stepNumber === 3;
    const tiltAngle = isTilt ? (isRightTilt ? 22 : -22) : 0;

    return (
      <svg viewBox="0 0 120 120" width="100%" height="100%">
        {/* Chair / Cushion ground shadow */}
        <ellipse cx="60" cy="113" rx="28" ry="4" fill="rgba(0,0,0,0.08)" />

        {/* Seated Legs with hands resting comfortably on thighs */}
        {/* Left leg */}
        <path d="M 48 76 L 44 94 L 44 108" stroke="#52b788" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="44" cy="94" r="3.2" fill="#40916c" />
        {renderSneaker(44, 108, true, 0.95)}

        {/* Right leg */}
        <path d="M 72 76 L 76 94 L 76 108" stroke="#52b788" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="76" cy="94" r="3.2" fill="#40916c" />
        {renderSneaker(76, 108, false, 0.95)}

        {/* Torso grounded upright */}
        <path d="M 60 40 C 76 40, 84 52, 84 68 C 84 82, 74 86, 60 86 C 46 86, 36 82, 36 68 C 36 52, 44 40, 60 40 Z" fill="#74c69d" />
        <ellipse cx="60" cy="70" rx="16" ry="12" fill="#ffffff" opacity="0.38" />

        {/* Articulated Arms resting gently on thighs */}
        <path d="M 40 54 L 32 68 L 44 80" stroke="#52b788" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="32" cy="68" r="2.8" fill="#40916c" />
        {renderHand(44, 80, 'palm_down', 0)}

        <path d="M 80 54 L 88 68 L 76 80" stroke="#52b788" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="88" cy="68" r="2.8" fill="#40916c" />
        {renderHand(76, 80, 'palm_down', 0)}

        {/* Articulated Neck & Head tilting laterally ear-to-shoulder */}
        <g transform={`translate(60, 42) rotate(${tiltAngle})`}>
          <path d="M 0 -24 C 15 -24, 22 -12, 22 2 C 22 14, 12 20, 0 20 C -12 20, -22 14, -22 2 C -22 -12, -15 -24, 0 -24 Z" fill="#74c69d" />
          <ellipse cx="0" cy="6" rx="12" ry="9" fill="#ffffff" opacity="0.38" />
          {renderSprout(0, -24, isRightTilt ? 15 : -15)}
          {renderFace(0, 0, 'happy', isRightTilt ? 'right' : (isTilt ? 'left' : 'front'))}
        </g>
      </svg>
    );
  }

  // Fallback
  return renderCelebrateStep();
}
