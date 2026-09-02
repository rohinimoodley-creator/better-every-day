import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, X, CheckCircle, RotateCcw, Timer, Sparkles, Trash2 } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { useWellness } from '../../context/WellnessContext';
import confetti from 'canvas-confetti';

export default function WorkoutPlayer({ workout, onClose, onComplete }) {
  const { playChime } = useAudio();
  const { setActiveWorkoutMinutes, howIThrive } = useWellness();

  const instructionSpeed = howIThrive?.instructionSpeed || 'standard';
  const isManualAdvance = instructionSpeed === 'manual_advance';

  // Timer modes: 'countdown' (start from target down to 0) | 'countup' (start from 0 up to goal) | 'free' (start from 0 open-ended)
  const [timerMode, setTimerMode] = useState('countdown');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [stepElapsedSeconds, setStepElapsedSeconds] = useState(0);
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState(0);
  
  const initialDuration = (workout?.durationMin || 15) * 60;
  const steps = workout?.steps || [{ id: 1, title: 'Movement Session', durationSec: initialDuration }];
  const currentStep = steps[currentStepIdx] || steps[0];
  const totalSteps = steps.length;
  const targetStepDuration = currentStep.durationSec || initialDuration;

  const [secondsRemaining, setSecondsRemaining] = useState(targetStepDuration);
  const [isRunning, setIsRunning] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [waitingForManualAdvance, setWaitingForManualAdvance] = useState(false);

  useEffect(() => {
    let timer = null;
    if (isRunning && !isCompleted && !waitingForManualAdvance) {
      timer = setInterval(() => {
        setTotalElapsedSeconds(prev => prev + 1);
        setStepElapsedSeconds(prev => prev + 1);

        if (timerMode === 'countdown') {
          setSecondsRemaining(prev => {
            if (prev > 1) return prev - 1;
            handleStepDone();
            return 0;
          });
        } else if (timerMode === 'countup') {
          setSecondsRemaining(prev => {
            if (prev > 1) return prev - 1;
            handleStepDone();
            return 0;
          });
        }
        // free mode counts up indefinitely
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timerMode, isCompleted, waitingForManualAdvance]);

  const handleStepDone = () => {
    if (howIThrive?.soundWellness !== false) {
      try { playChime(528); } catch(e) {}
    }

    if (isManualAdvance) {
      setWaitingForManualAdvance(true);
      setIsRunning(false);
    } else {
      if (currentStepIdx < totalSteps - 1) {
        const nextIdx = currentStepIdx + 1;
        setCurrentStepIdx(nextIdx);
        setSecondsRemaining(steps[nextIdx].durationSec);
        setStepElapsedSeconds(0);
      } else {
        finishWorkout();
      }
    }
  };

  const finishWorkout = () => {
    setIsCompleted(true);
    setIsRunning(false);
    const durationMins = Math.max(1, Math.round(totalElapsedSeconds / 60));
    setActiveWorkoutMinutes(prev => prev + durationMins);
    if (howIThrive?.soundWellness !== false) {
      try { playChime(660); } catch(e) {}
    }
    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch(e) {}
    if (onComplete) onComplete(workout.id);
  };

  const handleNextStep = () => {
    setWaitingForManualAdvance(false);
    setIsRunning(true);
    if (currentStepIdx < totalSteps - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      setSecondsRemaining(steps[nextIdx].durationSec);
      setStepElapsedSeconds(0);
    } else {
      finishWorkout();
    }
  };

  const handleSwitchMode = (mode) => {
    setTimerMode(mode);
  };

  const handleReset = () => {
    setSecondsRemaining(targetStepDuration);
    setStepElapsedSeconds(0);
    setTotalElapsedSeconds(0);
    setIsRunning(false);
    setIsCompleted(false);
    setWaitingForManualAdvance(false);
  };

  const formatTime = (secs) => {
    const safeSecs = Math.max(0, secs);
    const m = Math.floor(safeSecs / 60);
    const s = safeSecs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Determine displayed time based on mode
  const getDisplayTime = () => {
    if (timerMode === 'countdown') {
      return formatTime(secondsRemaining);
    }
    if (timerMode === 'countup') {
      return formatTime(stepElapsedSeconds);
    }
    return formatTime(stepElapsedSeconds);
  };

  const progressPercent = Math.min(100, Math.round((stepElapsedSeconds / targetStepDuration) * 100));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-sheet" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 540, textAlign: 'center', padding: '1.75rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span className="pill-badge primary" style={{ fontSize: '0.72rem' }}>
            {workout.category} • Step {currentStepIdx + 1} of {totalSteps}
          </span>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Count Up vs Count Down Mode Selector */}
        <div style={{ background: 'var(--bg-tertiary)', padding: '0.35rem', borderRadius: 'var(--radius-pill)', display: 'inline-flex', gap: '0.3rem', marginBottom: '1.25rem' }}>
          <button
            onClick={() => handleSwitchMode('countdown')}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: timerMode === 'countdown' ? 'var(--accent-primary)' : 'transparent',
              color: timerMode === 'countdown' ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            ⏱️ Count Down ({formatTime(targetStepDuration)} → 0:00)
          </button>

          <button
            onClick={() => handleSwitchMode('countup')}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: timerMode === 'countup' ? 'var(--accent-primary)' : 'transparent',
              color: timerMode === 'countup' ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            🎯 Count Up (0:00 → {formatTime(targetStepDuration)})
          </button>

          <button
            onClick={() => handleSwitchMode('free')}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: timerMode === 'free' ? 'var(--accent-primary)' : 'transparent',
              color: timerMode === 'free' ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            🌊 Free
          </button>
        </div>

        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--text-primary)' }}>
          {currentStep.title}
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0 0 1.25rem 0', lineHeight: 1.45 }}>
          {currentStep.guidance || workout.description}
        </p>

        {/* Timer Circular Clock */}
        <div 
          style={{
            width: 180,
            height: 180,
            borderRadius: '50%',
            margin: '0 auto 1.25rem auto',
            border: '4px solid var(--accent-primary)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)',
            position: 'relative'
          }}
        >
          <span style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>
            {getDisplayTime()}
          </span>

          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: 6 }}>
            {timerMode === 'countdown' && `Counting down from ${formatTime(targetStepDuration)}`}
            {timerMode === 'countup' && `Goal: ${formatTime(targetStepDuration)} (${progressPercent}%)`}
            {timerMode === 'free' && 'Free Movement (Counting Up)'}
          </span>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.65rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.4rem', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 800 }}
          >
            {isRunning ? <Pause size={17} /> : <Play size={17} />}
            <span>{isRunning ? 'Pause' : 'Resume'}</span>
          </button>

          {currentStepIdx < totalSteps - 1 ? (
            <button
              onClick={handleNextStep}
              className="btn btn-secondary"
              style={{ padding: '0.65rem 0.95rem', gap: '0.35rem', fontSize: '0.84rem' }}
            >
              <SkipForward size={16} /> Skip
            </button>
          ) : (
            <button
              onClick={finishWorkout}
              className="btn btn-primary"
              style={{ padding: '0.65rem 1.2rem', gap: '0.35rem', fontWeight: 800 }}
            >
              <CheckCircle size={16} /> Finish & Save
            </button>
          )}

          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.65rem 0.95rem', gap: '0.35rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)', fontSize: '0.84rem', fontWeight: 700 }}
            title="Cancel and discard session without saving"
          >
            <Trash2 size={16} />
            <span>Stop & Delete</span>
          </button>
        </div>

        {waitingForManualAdvance && (
          <div style={{ background: 'var(--accent-primary-light)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginTop: '0.75rem' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
              Step Complete! Take a deep breath, then tap Next when ready.
            </span>
            <div style={{ marginTop: '0.5rem' }}>
              <button onClick={handleNextStep} className="btn btn-primary btn-sm">
                Next Step →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
