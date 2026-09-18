import React, { useState, useEffect } from 'react';
import { X, Sparkles, Plus, Minus, Check, Play, Pause, Grid, Clapperboard } from 'lucide-react';
import PipStepIllustration from './ExerciseStoryboardPip';
import ExerciseMiniAnimation from './ExerciseMiniAnimations';
import { useWellness } from '../../context/WellnessContext';
import { useAudio } from '../../context/AudioContext';
import confetti from 'canvas-confetti';

export const EXERCISE_BREAKDOWNS = {
  squat: {
    id: 'squat',
    title: 'Squat',
    subtitle: 'Stronger legs, better balance, more energy.',
    category: 'Legs & Balance',
    icon: '🌱',
    focusPoint: 'Keep your chest up, knees in line with your toes, and engage your core.',
    steps: [
      { num: 1, text: 'Stand tall with your feet about hip-width apart.' },
      { num: 2, text: 'Push your hips back and bend your knees.' },
      { num: 3, text: 'Lower until your thighs are roughly parallel.' },
      { num: 4, text: 'Pause for a moment.' },
      { num: 5, text: 'Stand back up, squeezing your glutes.' },
      { num: 6, text: "That's one rep!" },
      { num: 7, text: 'Keep going at your own pace.' },
      { num: 8, text: "You're doing great!" }
    ]
  },
  march: {
    id: 'march',
    title: 'Marching in Place',
    subtitle: 'Gentle cardio, joint mobility, and quick energy.',
    category: 'Gentle Cardio',
    icon: '🚶',
    focusPoint: 'Lift each knee to hip level and swing the opposite arm with natural rhythm.',
    steps: [
      { num: 1, text: 'Stand tall with arms relaxed at your sides.' },
      { num: 2, text: 'Lift your left knee up to hip height.' },
      { num: 3, text: 'Swing your opposite (right) arm forward.' },
      { num: 4, text: 'Pause briefly at the top of your march.' },
      { num: 5, text: 'Lower smoothly and drive your right knee up.' },
      { num: 6, text: "That's one full marching rep!" },
      { num: 7, text: 'Keep a smooth, rhythmic pace.' },
      { num: 8, text: "You're doing great!" }
    ]
  },
  heel_raise: {
    id: 'heel_raise',
    title: 'Heel & Calf Raises',
    subtitle: 'Stronger ankles, calf strength, and steady balance.',
    category: 'Ankles & Lower Body',
    icon: '👟',
    focusPoint: 'Push straight up onto the balls of your feet and lower down with control.',
    steps: [
      { num: 1, text: 'Stand tall with feet flat, hands on hips.' },
      { num: 2, text: 'Press firmly into the balls of your feet.' },
      { num: 3, text: 'Lift both heels high off the floor.' },
      { num: 4, text: 'Pause at the top for 1–2 seconds.' },
      { num: 5, text: 'Slowly lower your heels back to the floor.' },
      { num: 6, text: "That's one calf raise rep!" },
      { num: 7, text: 'Keep ankles steady and controlled.' },
      { num: 8, text: "You're doing great!" }
    ]
  },
  arm_swing: {
    id: 'arm_swing',
    title: 'Gentle Arm Swings',
    subtitle: 'Shoulder mobility, upper back relief, and easy circulation.',
    category: 'Shoulders & Mobility',
    icon: '🙆',
    focusPoint: 'Keep your shoulders relaxed and let arms swing freely in a natural arc.',
    steps: [
      { num: 1, text: 'Stand tall with soft, relaxed knees.' },
      { num: 2, text: 'Swing both arms smoothly forward.' },
      { num: 3, text: 'Reach chest or shoulder height.' },
      { num: 4, text: 'Pause for a fraction of a second.' },
      { num: 5, text: 'Let arms swing naturally behind your hips.' },
      { num: 6, text: "That's one smooth pendulum swing!" },
      { num: 7, text: 'Breathe deeply and keep the rhythm.' },
      { num: 8, text: "You're doing great!" }
    ]
  },
  pushup: {
    id: 'pushup',
    title: 'Push-Up',
    subtitle: 'Upper body power, arm strength, and core stability.',
    category: 'Arms & Chest',
    icon: '💪',
    focusPoint: 'Keep body in a straight plank line and tuck elbows at a 45° angle.',
    steps: [
      { num: 1, text: 'Set hands flat, slightly wider than shoulders.' },
      { num: 2, text: 'Keep a straight line from head to heels.' },
      { num: 3, text: 'Bend elbows back at a 45° angle.' },
      { num: 4, text: 'Hover chest 1–2 inches above surface.' },
      { num: 5, text: 'Push firmly away back to starting plank.' },
      { num: 6, text: "That's one strong push-up rep!" },
      { num: 7, text: 'Maintain a tight, braced core throughout.' },
      { num: 8, text: "You're doing great!" }
    ]
  },
  lunge: {
    id: 'lunge',
    title: 'Step Lunge',
    subtitle: 'Single-leg strength, hip mobility, and posture.',
    category: 'Legs & Stability',
    icon: '🚶',
    focusPoint: 'Keep your torso upright and form 90° angles with both knees.',
    steps: [
      { num: 1, text: 'Stand tall with your hands on your hips.' },
      { num: 2, text: 'Take a comfortable step forward.' },
      { num: 3, text: 'Bend both knees toward 90° angles.' },
      { num: 4, text: 'Pause with back knee hovering off the mat.' },
      { num: 5, text: 'Push off your front heel to stand tall.' },
      { num: 6, text: "That's one balanced lunge rep!" },
      { num: 7, text: 'Switch legs and continue smoothly.' },
      { num: 8, text: "You're doing great!" }
    ]
  },
  plank: {
    id: 'plank',
    title: 'Forearm Plank Hold',
    subtitle: 'Deep core endurance, posture support, and total body brace.',
    category: 'Core & Stability',
    icon: '🛡️',
    focusPoint: 'Keep elbows under shoulders, neutral spine, and breathe steadily.',
    steps: [
      { num: 1, text: 'Rest forearms flat under shoulders.' },
      { num: 2, text: 'Step feet back into a straight line.' },
      { num: 3, text: 'Gently brace your tummy and glutes.' },
      { num: 4, text: 'Keep neck neutral, looking at the mat.' },
      { num: 5, text: 'Breathe slowly and steadily.' },
      { num: 6, text: 'Hold strong for 10–20 seconds.' },
      { num: 7, text: 'Gently lower your knees down to rest.' },
      { num: 8, text: "You're doing great!" }
    ]
  },
  stretch: {
    id: 'stretch',
    title: 'Neck & Shoulder Reset',
    subtitle: 'Relieve desk stiffness, tension release, and relaxed breathing.',
    category: 'Postural Reset',
    icon: '🍃',
    focusPoint: 'Move gently without forcing or straining; let shoulders drop away from ears.',
    steps: [
      { num: 1, text: 'Sit or stand tall, relaxing shoulders down.' },
      { num: 2, text: 'Gently tilt right ear toward right shoulder.' },
      { num: 3, text: 'Hold softly and take a deep breath.' },
      { num: 4, text: 'Return head to center and roll shoulders.' },
      { num: 5, text: 'Gently tilt left ear toward left shoulder.' },
      { num: 6, text: 'Hold softly and exhale tension away.' },
      { num: 7, text: 'Return center with a relaxed, tall spine.' },
      { num: 8, text: "You're doing great!" }
    ]
  }
};

export default function ExerciseBreakdownModal({ isOpen, onClose, initialExercise = 'squat' }) {
  const { logMicroMovement } = useWellness();
  const { playChime } = useAudio();

  const [selectedKey, setSelectedKey] = useState(initialExercise);
  const [activeStep, setActiveStep] = useState(1);
  const [viewMode, setViewMode] = useState('storyboard'); // 'storyboard' | 'live'
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [isSlowMode, setIsSlowMode] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [savedFeedback, setSavedFeedback] = useState('');

  // Auto-play / sequencer timer
  useEffect(() => {
    let timer;
    if (isPlayingSequence) {
      const stepDuration = isSlowMode ? 1800 : 1000;
      timer = setInterval(() => {
        setActiveStep(prev => (prev >= 8 ? 1 : prev + 1));
      }, stepDuration);
    }
    return () => clearInterval(timer);
  }, [isPlayingSequence, isSlowMode]);

  if (!isOpen) return null;

  const exercise = EXERCISE_BREAKDOWNS[selectedKey] || EXERCISE_BREAKDOWNS.squat;

  const handleSelectExercise = (key) => {
    setSelectedKey(key);
    setActiveStep(1);
    setIsPlayingSequence(false);
    setRepCount(0);
    setSavedFeedback('');
  };

  const togglePlaySequence = () => {
    setIsPlayingSequence(prev => !prev);
  };

  const handleIncrement = () => {
    setRepCount(prev => prev + 1);
    setSavedFeedback('');
  };

  const handleDecrement = () => {
    setRepCount(prev => Math.max(0, prev - 1));
    setSavedFeedback('');
  };

  const handleSaveReps = () => {
    if (repCount > 0) {
      if (logMicroMovement) {
        logMicroMovement(`${exercise.title} (${repCount} reps)`, 'completed');
      }
      try { playChime(660); } catch(e) {}
      try { confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } }); } catch(e) {}
      setSavedFeedback(`Saved ${repCount} ${repCount === 1 ? 'rep' : 'reps'}! Great job 🌱`);
    } else {
      setSavedFeedback('Practice noted! 🌱');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-sheet" 
        onClick={e => e.stopPropagation()} 
        style={{ 
          maxWidth: 960, 
          width: '95vw',
          maxHeight: '92vh', 
          overflowY: 'auto',
          borderRadius: '24px',
          padding: '1.5rem',
          background: 'var(--bg-card, #f4faf6)',
          border: '1.5px solid rgba(45, 106, 79, 0.2)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
          animation: 'scaleUp 0.2s ease-out'
        }}
      >
        {/* =========================================================================
            HEADER SECTION (MATCHING DESIGN REFERENCE)
            ========================================================================= */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.8rem' }}>
          
          {/* Left Title Capsule */}
          <div style={{ 
            background: 'var(--bg-secondary, #eaf5ee)', 
            padding: '0.55rem 1.15rem', 
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            border: '1px solid rgba(45, 106, 79, 0.15)'
          }}>
            <span style={{ fontSize: '1.4rem' }}>{exercise.icon}</span>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-primary, #1b382b)', lineHeight: 1.1 }}>
                {exercise.title}
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary, #40916c)', margin: 0, fontWeight: 600 }}>
                {exercise.subtitle}
              </p>
            </div>
          </div>

          {/* Right Mascot Badge & Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'var(--bg-secondary, #eaf5ee)',
              border: '1.5px solid rgba(45, 106, 79, 0.25)',
              borderRadius: '999px',
              padding: '0.35rem 0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--accent-primary, #2d6a4f)',
              fontSize: '0.84rem',
              fontWeight: 800
            }}>
              <Sparkles size={14} fill="#f4a261" color="#f4a261" />
              <span>Pip shows you how!</span>
            </div>

            {/* Mascot Avatar Circle with glow lines */}
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#74c69d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: '0 4px 12px rgba(45, 106, 79, 0.2)'
            }}>
              <svg width="34" height="34" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="16" fill="#74c69d" />
                {/* Sprout */}
                <path d="M 20 6 Q 18 2, 14 0" stroke="#2d6a4f" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <path d="M 14 0 C 10 -3, 8 1, 14 3 Z" fill="#40916c" />
                {/* Face */}
                <path d="M 13 18 Q 16 14, 19 18" stroke="#1b382b" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                <path d="M 21 18 Q 24 14, 27 18" stroke="#1b382b" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                <path d="M 18 23 Q 20 26, 22 23" stroke="#1b382b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <circle cx="12" cy="22" r="2.5" fill="#ff9ebb" opacity="0.85" />
                <circle cx="28" cy="22" r="2.5" fill="#ff9ebb" opacity="0.85" />
              </svg>
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose} 
              style={{ 
                background: 'var(--bg-tertiary, #e2ece6)', 
                border: 'none', 
                borderRadius: '50%', 
                width: 32, 
                height: 32, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer', 
                color: 'var(--text-muted, #555)',
                marginLeft: '0.2rem'
              }}
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Exercise Switching Chips & View Mode Selector */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
          {/* Exercise Chips */}
          <div style={{ display: 'flex', gap: '0.45rem', overflowX: 'auto', paddingBottom: '0.2rem', scrollbarWidth: 'none', flex: 1, minWidth: 260 }}>
            {Object.entries(EXERCISE_BREAKDOWNS).map(([key, ex]) => {
              const isSelected = selectedKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectExercise(key)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '999px',
                    border: isSelected ? '1.8px solid var(--accent-primary, #2d6a4f)' : '1px solid rgba(45, 106, 79, 0.15)',
                    background: isSelected ? 'var(--accent-primary-light, #d8f3dc)' : 'var(--bg-secondary, #ffffff)',
                    color: isSelected ? 'var(--accent-primary, #2d6a4f)' : 'var(--text-primary, #2d3748)',
                    fontSize: '0.78rem',
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.15s ease'
                  }}
                >
                  {ex.icon} {ex.title}
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle Switch (Storyboard vs Live Animation) */}
          <div style={{ 
            display: 'flex', 
            background: 'var(--bg-secondary, #eaf5ee)', 
            padding: '3px', 
            borderRadius: '999px',
            border: '1px solid rgba(45, 106, 79, 0.15)'
          }}>
            <button
              type="button"
              onClick={() => setViewMode('storyboard')}
              style={{
                background: viewMode === 'storyboard' ? 'var(--accent-primary, #2d6a4f)' : 'transparent',
                color: viewMode === 'storyboard' ? '#ffffff' : 'var(--text-secondary, #2d6a4f)',
                border: 'none',
                borderRadius: '999px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.76rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Grid size={13} />
              <span>8-Step Storyboard</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('live')}
              style={{
                background: viewMode === 'live' ? 'var(--accent-primary, #2d6a4f)' : 'transparent',
                color: viewMode === 'live' ? '#ffffff' : 'var(--text-secondary, #2d6a4f)',
                border: 'none',
                borderRadius: '999px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.76rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Clapperboard size={13} />
              <span>Live Demonstration</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            MAIN VIEW: LIVE ANIMATION PLAYER OR 8-STEP STORYBOARD GRID
            ========================================================================= */}
        {viewMode === 'live' ? (
          <div style={{ marginBottom: '1.2rem' }}>
            <ExerciseMiniAnimation exerciseId={selectedKey} isSlowMode={isSlowMode} />
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.9rem',
            marginBottom: '1.2rem'
          }}>
            {exercise.steps.map((step) => {
              const isStepActive = activeStep === step.num;
              return (
                <div
                  key={step.num}
                  onClick={() => setActiveStep(step.num)}
                  style={{
                    background: 'var(--bg-secondary, #eef7f2)',
                    borderRadius: '16px',
                    padding: '0.85rem 0.75rem',
                    border: isStepActive 
                      ? '2px solid var(--accent-primary, #2d6a4f)' 
                      : '1px solid rgba(45, 106, 79, 0.12)',
                    boxShadow: isStepActive 
                      ? '0 6px 18px rgba(45, 106, 79, 0.18)' 
                      : '0 2px 6px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    transform: isStepActive ? 'translateY(-2px)' : 'none'
                  }}
                >
                  {/* Top Illustration Area */}
                  <div style={{ width: '100%', height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                    <PipStepIllustration 
                      exerciseId={selectedKey} 
                      stepNumber={step.num} 
                      isActive={isStepActive} 
                    />
                  </div>

                  {/* Bottom Step Number Badge & Instruction Text */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    width: '100%',
                    marginTop: 'auto'
                  }}>
                    {/* Step Number Circle Badge */}
                    <div style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: isStepActive ? 'var(--accent-primary, #2d6a4f)' : '#a3d9b8',
                      color: isStepActive ? '#ffffff' : '#1b382b',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      {step.num}
                    </div>

                    {/* Instruction Pill Container */}
                    <div style={{
                      background: 'var(--bg-card, #ffffff)',
                      padding: '0.4rem 0.65rem',
                      borderRadius: '999px',
                      border: '1px solid rgba(45, 106, 79, 0.1)',
                      flex: 1,
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      color: 'var(--text-primary, #1b382b)',
                      lineHeight: 1.25
                    }}>
                      {step.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* =========================================================================
            BOTTOM BAR (QUICK TIP + SLOW MODE / PLAY BUTTONS)
            ========================================================================= */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1rem'
        }}>
          {/* Quick Tip Capsule */}
          <div style={{
            background: 'var(--bg-secondary, #eef7f2)',
            padding: '0.65rem 1.15rem',
            borderRadius: '999px',
            border: '1px solid rgba(45, 106, 79, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flex: 1,
            minWidth: 280
          }}>
            <span style={{ fontSize: '1.1rem' }}>💡</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-primary, #1b382b)', fontWeight: 600 }}>
              <strong style={{ color: 'var(--accent-primary, #2d6a4f)' }}>Quick Tip:</strong> {exercise.focusPoint}
            </span>
          </div>

          {/* Interactive Player Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Play/Pause Sequence Button */}
            <button
              type="button"
              onClick={togglePlaySequence}
              style={{
                background: isPlayingSequence ? 'var(--accent-primary, #2d6a4f)' : 'var(--bg-secondary, #eef7f2)',
                color: isPlayingSequence ? '#ffffff' : 'var(--accent-primary, #2d6a4f)',
                border: '1.5px solid var(--accent-primary, #2d6a4f)',
                borderRadius: '999px',
                padding: '0.45rem 0.95rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {isPlayingSequence ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlayingSequence ? 'Pause Steps' : 'Play Steps'}</span>
            </button>

            {/* Slow Mode Toggle */}
            <button
              type="button"
              onClick={() => setIsSlowMode(!isSlowMode)}
              style={{
                background: isSlowMode ? 'var(--accent-primary-light, #d8f3dc)' : 'var(--bg-secondary, #eef7f2)',
                color: isSlowMode ? 'var(--accent-primary, #2d6a4f)' : 'var(--text-secondary, #4a5568)',
                border: isSlowMode ? '1.5px solid var(--accent-primary, #2d6a4f)' : '1px solid rgba(45, 106, 79, 0.2)',
                borderRadius: '999px',
                padding: '0.45rem 0.95rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{isSlowMode ? '🐢 Slow Mode On' : '▶ Slow Mode'}</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            PRACTICE REP COUNTER & LOGGER
            ========================================================================= */}
        <div style={{
          background: 'var(--bg-secondary, #ffffff)',
          border: '1px solid rgba(45, 106, 79, 0.15)',
          borderRadius: '16px',
          padding: '0.85rem 1.15rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.8rem'
        }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary, #1b382b)' }}>
              Practice & Log {exercise.title}
            </span>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary, #718096)', margin: 0 }}>
              Try a few reps following Pip's form, then record your practice!
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-tertiary, #f0f4f1)', padding: '3px 6px', borderRadius: '999px' }}>
              <button
                type="button"
                onClick={handleDecrement}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  border: 'none',
                  background: 'var(--bg-card, #ffffff)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <Minus size={14} />
              </button>
              <span style={{ minWidth: 28, textAlign: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                {repCount}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  border: 'none',
                  background: 'var(--bg-card, #ffffff)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleSaveReps}
              style={{
                background: 'var(--accent-primary, #2d6a4f)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '999px',
                padding: '0.5rem 1.1rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(45, 106, 79, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Check size={14} />
              <span>Log Practice</span>
            </button>
          </div>

          {savedFeedback && (
            <div style={{ width: '100%', fontSize: '0.78rem', color: 'var(--accent-primary, #2d6a4f)', fontWeight: 700, textAlign: 'right' }}>
              {savedFeedback}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
