import React from 'react';

/**
 * Clean, supportive, visually clear SVG mini-animations for exercise steps.
 * Designed to be easy to understand, short, calming, and non-distracting.
 */

export default function ExerciseMiniAnimation({ exerciseId, stepIndex }) {
  // Common styling for figures
  const primaryColor = 'var(--accent-primary, #2d6a4f)';
  const secondaryColor = 'var(--accent-secondary, #d97736)';
  const bodyColor = 'var(--text-primary, #2d3748)';
  const guideColor = '#3a86c8';

  const containerStyle = {
    width: '100%',
    height: 140,
    background: 'var(--bg-tertiary, rgba(0,0,0,0.03))',
    borderRadius: 'var(--radius-md, 8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid var(--border-subtle, rgba(0,0,0,0.08))'
  };

  // 1. SQUAT STEPS
  if (exerciseId === 'squat') {
    if (stepIndex === 0) {
      // Step 1: Stand with feet shoulder-width apart
      return (
        <div style={containerStyle}>
          <svg width="180" height="120" viewBox="0 0 180 120">
            {/* Ground line */}
            <line x1="20" y1="110" x2="160" y2="110" stroke="var(--border-subtle)" strokeWidth="2" strokeDasharray="4 4" />
            {/* Head */}
            <circle cx="90" cy="22" r="10" fill={primaryColor} />
            {/* Torso */}
            <line x1="90" y1="32" x2="90" y2="70" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" />
            {/* Arms at sides */}
            <line x1="90" y1="40" x2="78" y2="65" stroke={bodyColor} strokeWidth="3.5" strokeLinecap="round" />
            <line x1="90" y1="40" x2="102" y2="65" stroke={bodyColor} strokeWidth="3.5" strokeLinecap="round" />
            {/* Legs shoulder-width apart */}
            <line x1="90" y1="70" x2="72" y2="110" stroke={bodyColor} strokeWidth="4.5" strokeLinecap="round" />
            <line x1="90" y1="70" x2="108" y2="110" stroke={bodyColor} strokeWidth="4.5" strokeLinecap="round" />
            {/* Width arrow guide */}
            <path d="M 68 114 L 112 114" stroke={guideColor} strokeWidth="1.5" strokeDasharray="2 2" />
            <text x="90" y="118" fontSize="8" fill={guideColor} textAnchor="middle" fontWeight="bold">Shoulder Width</text>
          </svg>
        </div>
      );
    }
    if (stepIndex === 1) {
      // Step 2: Push hips back
      return (
        <div style={containerStyle}>
          <svg width="180" height="120" viewBox="0 0 180 120">
            <line x1="20" y1="110" x2="160" y2="110" stroke="var(--border-subtle)" strokeWidth="2" />
            <circle cx="82" cy="26" r="10" fill={primaryColor} />
            {/* Torso angled forward */}
            <line x1="82" y1="36" x2="74" y2="72" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" />
            {/* Arms reaching forward for balance */}
            <line x1="82" y1="44" x2="105" y2="44" stroke={bodyColor} strokeWidth="3.5" strokeLinecap="round" />
            {/* Hips hinging backward */}
            <line x1="74" y1="72" x2="80" y2="92" stroke={bodyColor} strokeWidth="4.5" strokeLinecap="round" />
            <line x1="80" y1="92" x2="84" y2="110" stroke={bodyColor} strokeWidth="4.5" strokeLinecap="round" />
            {/* Hinge arrow indicator */}
            <path d="M 90 70 Q 60 72 58 80" fill="none" stroke={secondaryColor} strokeWidth="2.5" markerEnd="url(#arrow)" />
            <circle cx="74" cy="72" r="4" fill={secondaryColor} />
            <text x="50" y="66" fontSize="9" fill={secondaryColor} fontWeight="bold">Hips Back</text>
          </svg>
        </div>
      );
    }
    if (stepIndex === 2 || stepIndex === 3) {
      // Step 3 & 4: Bend knees & lower body to parallel
      return (
        <div style={containerStyle}>
          <svg width="180" height="120" viewBox="0 0 180 120">
            <line x1="20" y1="110" x2="160" y2="110" stroke="var(--border-subtle)" strokeWidth="2" />
            {/* Head */}
            <circle cx="78" cy="42" r="10" fill={primaryColor} className="pulse-slow" />
            {/* Spine */}
            <line x1="78" y1="52" x2="65" y2="82" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" />
            {/* Arms forward */}
            <line x1="78" y1="58" x2="108" y2="58" stroke={bodyColor} strokeWidth="3.5" strokeLinecap="round" />
            {/* Thigh parallel to ground */}
            <line x1="65" y1="82" x2="98" y2="82" stroke={secondaryColor} strokeWidth="5" strokeLinecap="round" />
            {/* Shin */}
            <line x1="98" y1="82" x2="96" y2="110" stroke={bodyColor} strokeWidth="4.5" strokeLinecap="round" />
            {/* Alignment indicator */}
            <line x1="60" y1="82" x2="120" y2="82" stroke={guideColor} strokeWidth="1" strokeDasharray="3 3" />
            <text x="130" y="85" fontSize="8" fill={guideColor} fontWeight="bold">Parallel</text>
          </svg>
        </div>
      );
    }
    // Step 5: Return to standing
    return (
      <div style={containerStyle}>
        <svg width="180" height="120" viewBox="0 0 180 120">
          <line x1="20" y1="110" x2="160" y2="110" stroke="var(--border-subtle)" strokeWidth="2" />
          <circle cx="90" cy="22" r="10" fill={primaryColor} />
          <line x1="90" y1="32" x2="90" y2="70" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" />
          <line x1="90" y1="40" x2="90" y2="65" stroke={bodyColor} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="90" y1="70" x2="78" y2="110" stroke={bodyColor} strokeWidth="4.5" strokeLinecap="round" />
          <line x1="90" y1="70" x2="102" y2="110" stroke={bodyColor} strokeWidth="4.5" strokeLinecap="round" />
          {/* Upward motion arrow */}
          <path d="M 125 90 L 125 45 M 120 52 L 125 45 L 130 52" fill="none" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="135" y="70" fontSize="8.5" fill={primaryColor} fontWeight="bold">Drive Up</text>
        </svg>
      </div>
    );
  }

  // 2. PUSH-UP / WALL PUSH-UP STEPS
  if (exerciseId === 'pushup') {
    if (stepIndex === 0) {
      // Hands shoulder-width
      return (
        <div style={containerStyle}>
          <svg width="180" height="120" viewBox="0 0 180 120">
            <line x1="140" y1="10" x2="140" y2="110" stroke="var(--border-subtle)" strokeWidth="3" />
            <circle cx="95" cy="30" r="9" fill={primaryColor} />
            <line x1="95" y1="39" x2="80" y2="85" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" />
            <line x1="95" y1="48" x2="140" y2="48" stroke={secondaryColor} strokeWidth="4" strokeLinecap="round" />
            <line x1="80" y1="85" x2="65" y2="110" stroke={bodyColor} strokeWidth="4.5" strokeLinecap="round" />
            <text x="145" y="60" fontSize="8" fill="var(--text-muted)">Wall / Mat</text>
          </svg>
        </div>
      );
    }
    if (stepIndex === 1) {
      // Straight plank line
      return (
        <div style={containerStyle}>
          <svg width="180" height="120" viewBox="0 0 180 120">
            <line x1="20" y1="105" x2="160" y2="105" stroke="var(--border-subtle)" strokeWidth="2" />
            <circle cx="130" cy="50" r="9" fill={primaryColor} />
            {/* Straight body line */}
            <line x1="130" y1="58" x2="45" y2="98" stroke={primaryColor} strokeWidth="5" strokeLinecap="round" />
            {/* Arms vertical */}
            <line x1="120" y1="62" x2="120" y2="105" stroke={bodyColor} strokeWidth="4" strokeLinecap="round" />
            {/* Feet */}
            <circle cx="45" cy="100" r="4" fill={bodyColor} />
            <line x1="38" y1="52" x2="140" y2="52" stroke={guideColor} strokeWidth="1" strokeDasharray="3 3" />
            <text x="85" y="46" fontSize="8.5" fill={guideColor} fontWeight="bold">Flat Spine</text>
          </svg>
        </div>
      );
    }
    // Lowering & Pressing
    return (
      <div style={containerStyle}>
        <svg width="180" height="120" viewBox="0 0 180 120">
          <line x1="20" y1="105" x2="160" y2="105" stroke="var(--border-subtle)" strokeWidth="2" />
          <circle cx="130" cy="72" r="9" fill={primaryColor} />
          {/* Lowered plank */}
          <line x1="130" y1="78" x2="45" y2="100" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" />
          {/* Bent elbow 45 deg */}
          <path d="M 120 80 L 105 70 L 120 105" fill="none" stroke={secondaryColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <text x="90" y="62" fontSize="8.5" fill={secondaryColor} fontWeight="bold">45° Elbows</text>
        </svg>
      </div>
    );
  }

  // 3. LUNGE STEPS
  if (exerciseId === 'lunge') {
    return (
      <div style={containerStyle}>
        <svg width="180" height="120" viewBox="0 0 180 120">
          <line x1="20" y1="110" x2="160" y2="110" stroke="var(--border-subtle)" strokeWidth="2" />
          {/* Head */}
          <circle cx="85" cy="30" r="9" fill={primaryColor} />
          {/* Torso vertical */}
          <line x1="85" y1="39" x2="85" y2="72" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" />
          {/* Front Leg: 90 degrees */}
          <line x1="85" y1="72" x2="115" y2="72" stroke={secondaryColor} strokeWidth="4.5" strokeLinecap="round" />
          <line x1="115" y1="72" x2="115" y2="110" stroke={bodyColor} strokeWidth="4.5" strokeLinecap="round" />
          {/* Back Leg: 90 degrees dropping toward floor */}
          <line x1="85" y1="72" x2="60" y2="92" stroke={bodyColor} strokeWidth="4.5" strokeLinecap="round" />
          <line x1="60" y1="92" x2="60" y2="110" stroke={bodyColor} strokeWidth="4.5" strokeLinecap="round" />
          {/* 90 deg guide markers */}
          <rect x="110" y="72" width="6" height="6" fill="none" stroke={guideColor} strokeWidth="1" />
          <text x="125" y="80" fontSize="8" fill={guideColor} fontWeight="bold">90° Front</text>
        </svg>
      </div>
    );
  }

  // 4. PLANK / CORE HOLD
  if (exerciseId === 'plank') {
    return (
      <div style={containerStyle}>
        <svg width="180" height="120" viewBox="0 0 180 120">
          <line x1="20" y1="105" x2="160" y2="105" stroke="var(--border-subtle)" strokeWidth="2" />
          <circle cx="135" cy="65" r="9" fill={primaryColor} />
          <line x1="135" y1="72" x2="45" y2="95" stroke={primaryColor} strokeWidth="5" strokeLinecap="round" />
          {/* Forearm flat */}
          <line x1="125" y1="76" x2="125" y2="105" stroke={bodyColor} strokeWidth="4" strokeLinecap="round" />
          <line x1="125" y1="105" x2="145" y2="105" stroke={bodyColor} strokeWidth="4" strokeLinecap="round" />
          {/* Gentle core activation glow */}
          <circle cx="90" cy="85" r="7" fill="rgba(217, 93, 57, 0.25)" />
          <text x="90" y="88" fontSize="7" fill={secondaryColor} textAnchor="middle" fontWeight="bold">Core</text>
        </svg>
      </div>
    );
  }

  // 5. GENTLE NECK & SHOULDER RELEASE
  return (
    <div style={containerStyle}>
      <svg width="180" height="120" viewBox="0 0 180 120">
        {/* Head gently tilted */}
        <circle cx="90" cy="35" r="12" fill={primaryColor} />
        <path d="M 82 28 Q 98 24 102 32" stroke={secondaryColor} strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Torso & Shoulders rolling */}
        <line x1="90" y1="47" x2="90" y2="95" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" />
        <line x1="70" y1="58" x2="110" y2="58" stroke={secondaryColor} strokeWidth="4" strokeLinecap="round" />
        <path d="M 65 58 C 60 50, 60 65, 68 64" fill="none" stroke={guideColor} strokeWidth="1.5" />
        <path d="M 115 58 C 120 50, 120 65, 112 64" fill="none" stroke={guideColor} strokeWidth="1.5" />
        <text x="90" y="112" fontSize="8" fill="var(--text-muted)" textAnchor="middle">Slow gentle circles</text>
      </svg>
    </div>
  );
}
