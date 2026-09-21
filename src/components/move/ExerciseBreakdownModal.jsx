import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Check, Play, Pause, ChevronLeft, ChevronRight, Sliders, CheckCircle } from 'lucide-react';
import PipStepIllustration from './ExerciseStoryboardPip';
import ExerciseMiniAnimation from './ExerciseMiniAnimations';
import { useWellness } from '../../context/WellnessContext';
import confetti from 'canvas-confetti';

export const EXERCISE_BREAKDOWNS = {
  squat: {
    id: 'squat',
    title: 'Squat',
    subtitle: 'Stronger legs, better balance, and core stability.',
    category: 'Legs & Balance',
    icon: '🌱',
    focusPoint: 'Keep your chest up, knees tracking over toes, and push hips back.',
    steps: [
      { num: 1, text: 'Stand tall with feet about hip-width apart.' },
      { num: 2, text: 'Push your hips back and bend your knees.' },
      { num: 3, text: 'Lower until thighs are roughly parallel (90°).' },
      { num: 4, text: 'Pause for a moment at the bottom.' },
      { num: 5, text: 'Push through your heels to stand tall.' },
      { num: 6, text: "That's one strong rep!" },
      { num: 7, text: 'Keep going at your own comfortable pace.' },
      { num: 8, text: "You're doing great!" }
    ]
  },
  march: {
    id: 'march',
    title: 'Marching in Place',
    subtitle: 'Gentle cardio, joint mobility, and quick energy.',
    category: 'Gentle Cardio',
    icon: '🚶',
    focusPoint: 'Lift each knee to hip level and swing the opposite arm.',
    steps: [
      { num: 1, text: 'Stand tall with arms relaxed at your sides.' },
      { num: 2, text: 'Lift your left knee up toward hip height.' },
      { num: 3, text: 'Swing your opposite (right) arm forward.' },
      { num: 4, text: 'Pause briefly at the top of your march.' },
      { num: 5, text: 'Lower smoothly and lift your right knee.' },
      { num: 6, text: "That's one full marching rep!" },
      { num: 7, text: 'Maintain a smooth, rhythmic pace.' },
      { num: 8, text: "You're doing great!" }
    ]
  },
  heel_raise: {
    id: 'heel_raise',
    title: 'Heel & Calf Raises',
    subtitle: 'Stronger ankles, calf strength, and steady balance.',
    category: 'Ankles & Lower Body',
    icon: '👟',
    focusPoint: 'Press onto the balls of your feet and lower with control.',
    steps: [
      { num: 1, text: 'Stand tall with feet flat, hands on hips.' },
      { num: 2, text: 'Press firmly into the balls of your feet.' },
      { num: 3, text: 'Lift both heels high off the floor.' },
      { num: 4, text: 'Pause at the top for 1–2 seconds.' },
      { num: 5, text: 'Slowly lower heels back down.' },
      { num: 6, text: "That's one calf raise rep!" },
      { num: 7, text: 'Keep ankles steady throughout.' },
      { num: 8, text: "You're doing great!" }
    ]
  },
  stretch: {
    id: 'stretch',
    title: 'Neck & Shoulder Reset',
    subtitle: 'Relieve desk stiffness, tension release, and easy breathing.',
    category: 'Postural Reset',
    icon: '🍃',
    focusPoint: 'Move gently without forcing or straining; let shoulders drop away.',
    steps: [
      { num: 1, text: 'Sit or stand tall, relaxing shoulders down.' },
      { num: 2, text: 'Gently tilt right ear toward right shoulder.' },
      { num: 3, text: 'Hold softly and take a deep breath.' },
      { num: 4, text: 'Return head to center and roll shoulders.' },
      { num: 5, text: 'Gently tilt left ear toward left shoulder.' },
      { num: 6, text: 'Hold softly and exhale tension away.' },
      { num: 7, text: 'Return center with a relaxed, tall spine.' },
      { num: 8, text: "You're feeling more grounded!" }
    ]
  }
};

const EXERCISE_LIST = Object.values(EXERCISE_BREAKDOWNS);

export default function ExerciseBreakdownModal({ isOpen, onClose, initialExerciseId = 'squat' }) {
  const { addWellnessEvent } = useWellness();
  const [activeExerciseId, setActiveExerciseId] = useState(initialExerciseId || 'squat');
  const [viewMode, setViewMode] = useState('demo'); // 'demo' | 'storyboard'
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isSlowMode, setIsSlowMode] = useState(false);
  const [isPlayingSteps, setIsPlayingSteps] = useState(false);
  const [loggedReps, setLoggedReps] = useState(10);
  const [isPracticing, setIsPracticing] = useState(false);
  const [justLogged, setJustLogged] = useState(false);

  const chipsContainerRef = useRef(null);
  const activeChipRef = useRef(null);

  const exercise = EXERCISE_BREAKDOWNS[activeExerciseId] || EXERCISE_BREAKDOWNS.squat;
  const totalSteps = exercise.steps.length;

  useEffect(() => {
    if (activeChipRef.current && chipsContainerRef.current) {
      activeChipRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeExerciseId]);

  useEffect(() => {
    setCurrentStepIdx(0);
    setIsPlayingSteps(false);
    setJustLogged(false);
  }, [activeExerciseId, viewMode]);

  // Auto-play steps when in Storyboard mode and Play is active
  useEffect(() => {
    let timer;
    if (viewMode === 'storyboard' && isPlayingSteps) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlayingSteps(false);
            return 0;
          }
          return prev + 1;
        });
      }, isSlowMode ? 3500 : 2000);
    }
    return () => clearInterval(timer);
  }, [viewMode, isPlayingSteps, totalSteps, isSlowMode]);

  if (!isOpen) return null;

  const handlePracticeAndLog = () => {
    if (addWellnessEvent) {
      addWellnessEvent({
        type: 'activity',
        activityType: 'break_it_down',
        name: exercise.title,
        durationMinutes: 5,
        reps: loggedReps,
        timestamp: new Date().toISOString()
      });
    }
    setJustLogged(true);
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    } catch (e) {}
    setTimeout(() => {
      setJustLogged(false);
      setIsPracticing(false);
    }, 2000);
  };

  const currentStep = exercise.steps[currentStepIdx] || exercise.steps[0];

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 250, alignItems: 'flex-end', padding: 0 }}>
      <div
        className="modal-sheet"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 600,
          maxHeight: '92vh',
          borderRadius: '24px 24px 0 0',
          padding: '1.25rem 1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          boxSizing: 'border-box'
        }}
      >
        {/* Drag Handle */}
        <div style={{ width: 36, height: 4, background: 'var(--border-subtle)', borderRadius: 2, margin: '0 auto -0.25rem' }} />

        {/* 1. Header Row (~56dp, Section 6.2.3) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>{exercise.icon}</span>
              <span>{exercise.title}</span>
            </h3>
            <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.76rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {exercise.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'var(--bg-tertiary)',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 2. Exercise Selection Chips (Horizontal Scrollable Row) */}
        <div
          ref={chipsContainerRef}
          className="hide-scrollbar"
          style={{
            display: 'flex',
            gap: '0.35rem',
            overflowX: 'auto',
            paddingBottom: '0.2rem'
          }}
        >
          {EXERCISE_LIST.map((item) => {
            const isSelected = item.id === activeExerciseId;
            return (
              <button
                key={item.id}
                ref={isSelected ? activeChipRef : null}
                type="button"
                onClick={() => setActiveExerciseId(item.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.35rem 0.75rem',
                  minHeight: '36px',
                  borderRadius: 'var(--radius-pill)',
                  border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: isSelected ? '#ffffff' : 'var(--text-primary)',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                <span>{item.icon}</span>
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>

        {/* 3. Mode Toggle (Storyboard | Live Demo) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: '2px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={() => setViewMode('demo')}
              style={{
                padding: '0.3rem 0.85rem',
                minHeight: '32px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: viewMode === 'demo' ? 'var(--bg-secondary)' : 'transparent',
                color: viewMode === 'demo' ? 'var(--text-primary)' : 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: viewMode === 'demo' ? 700 : 500,
                cursor: 'pointer',
                boxShadow: viewMode === 'demo' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              Live Demo
            </button>
            <button
              type="button"
              onClick={() => setViewMode('storyboard')}
              style={{
                padding: '0.3rem 0.85rem',
                minHeight: '32px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: viewMode === 'storyboard' ? 'var(--bg-secondary)' : 'transparent',
                color: viewMode === 'storyboard' ? 'var(--text-primary)' : 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: viewMode === 'storyboard' ? 700 : 500,
                cursor: 'pointer',
                boxShadow: viewMode === 'storyboard' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              Storyboard
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsSlowMode(!isSlowMode)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.25rem 0.6rem',
              minHeight: '32px',
              borderRadius: 'var(--radius-pill)',
              border: isSlowMode ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              background: isSlowMode ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
              color: isSlowMode ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <span>Slow 0.5x</span>
            {isSlowMode && <Check size={11} />}
          </button>
        </div>

        {/* 4. Stage (4:3, max ~260dp, Section 6.2.3) */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 240,
            borderRadius: 'var(--radius-card)',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)'
          }}
        >
          {/* Small Pip Instructor Chip (Top-Left inside stage) */}
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              zIndex: 10,
              background: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(8px)',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.6875rem',
              fontWeight: 700,
              color: 'var(--accent-primary)',
              border: '1px solid var(--border-glass)'
            }}
          >
            🌱 Pip Instructor
          </div>

          {viewMode === 'demo' ? (
            <ExerciseMiniAnimation exerciseId={activeExerciseId} isSlowMode={isSlowMode} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)' }}>
              <PipStepIllustration exerciseId={activeExerciseId} stepNumber={currentStep.num} isActive={true} />
            </div>
          )}

          {/* Form Cue Caption Bar (Pinned Bottom inside Stage - never overlapped) */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'rgba(30, 45, 36, 0.85)',
              backdropFilter: 'blur(8px)',
              color: '#ffffff',
              padding: '0.4rem 0.75rem',
              fontSize: '0.76rem',
              fontWeight: 600,
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {viewMode === 'storyboard' ? `Step ${currentStep.num}: ${currentStep.text}` : exercise.focusPoint}
          </div>
        </div>

        {/* 5. Controls Row (for Storyboard Pager) */}
        {viewMode === 'storyboard' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', padding: '0.2rem 0' }}>
            <button
              type="button"
              onClick={() => setCurrentStepIdx((p) => Math.max(0, p - 1))}
              disabled={currentStepIdx === 0}
              aria-label="Previous step"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                color: currentStepIdx === 0 ? 'var(--text-muted)' : 'var(--text-primary)',
                cursor: currentStepIdx === 0 ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: currentStepIdx === 0 ? 0.5 : 1
              }}
            >
              <ChevronLeft size={16} />
            </button>

            {/* Step Dots Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {exercise.steps.map((s, idx) => (
                <div
                  key={s.num}
                  onClick={() => setCurrentStepIdx(idx)}
                  style={{
                    width: idx === currentStepIdx ? 16 : 6,
                    height: 6,
                    borderRadius: 'var(--radius-pill)',
                    background: idx === currentStepIdx ? 'var(--accent-primary)' : 'var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setCurrentStepIdx((p) => Math.min(totalSteps - 1, p + 1))}
              disabled={currentStepIdx === totalSteps - 1}
              aria-label="Next step"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                color: currentStepIdx === totalSteps - 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                cursor: currentStepIdx === totalSteps - 1 ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: currentStepIdx === totalSteps - 1 ? 0.5 : 1
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* 6. Quick Tip Banner (Max 2 lines) */}
        <div
          style={{
            background: 'var(--accent-primary-light)',
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            lineHeight: 1.35
          }}
        >
          <Sparkles size={14} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
          <span><strong>Quick Tip:</strong> {exercise.focusPoint}</span>
        </div>

        {/* 7. Sticky Practice & Log Footer */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '0.5rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Reps:</span>
            {[5, 10, 15].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setLoggedReps(count)}
                style={{
                  padding: '0.2rem 0.5rem',
                  minHeight: '32px',
                  borderRadius: 'var(--radius-pill)',
                  border: loggedReps === count ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  background: loggedReps === count ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                  color: loggedReps === count ? '#ffffff' : 'var(--text-primary)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {count}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handlePracticeAndLog}
            className="btn-primary"
            style={{
              padding: '0.55rem 1.25rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              cursor: 'pointer',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            {justLogged ? (
              <>
                <CheckCircle size={15} />
                <span>Logged! 🎉</span>
              </>
            ) : (
              <span>Practice & Log Reps</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
