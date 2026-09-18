import React, { useState, useEffect } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { useAudio } from '../../context/AudioContext';
import { X, Heart, Wind, Compass, Sparkles, CheckCircle, Play, Pause, RotateCcw, Square } from 'lucide-react';
import confetti from 'canvas-confetti';
import ContextualPip from '../mascot/ContextualPip';

export default function OverwhelmModal({ isOpen, onClose }) {
  const { toggleOverwhelmMode, incrementHydration, howIThrive } = useWellness();
  const { playChime } = useAudio();

  const [activePillar, setActivePillar] = useState('pause'); // 'pause' | 'reset' | 'small_thing'
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [breathSeconds, setBreathSeconds] = useState(60);
  const [elapsedActiveSeconds, setElapsedActiveSeconds] = useState(0);
  const [recordedDuration, setRecordedDuration] = useState(0);
  const [isBreathingStarted, setIsBreathingStarted] = useState(false);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathCompleted, setBreathCompleted] = useState(false);
  const [groundingStep, setGroundingStep] = useState(0);
  const [smallThingDone, setSmallThingDone] = useState(false);

  // Reset to clean ready-to-start state whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setIsBreathingStarted(false);
      setIsBreathingActive(false);
      setBreathCompleted(false);
      setBreathSeconds(selectedDuration);
      setElapsedActiveSeconds(0);
      setRecordedDuration(0);
    }
  }, [isOpen]);

  // Timer & participation counter only run when isBreathingActive is true (after user explicitly taps Breathe)
  useEffect(() => {
    let timer = null;
    if (isBreathingActive && breathSeconds > 0) {
      timer = setInterval(() => {
        setBreathSeconds(prev => {
          if (prev <= 1) {
            setBreathCompleted(true);
            setIsBreathingActive(false);
            setIsBreathingStarted(false);
            setRecordedDuration(selectedDuration);
            try { playChime(528); } catch (e) {}
            try {
              confetti({
                particleCount: 35,
                spread: 50,
                origin: { y: 0.65 }
              });
            } catch (e) {}
            try {
              localStorage.setItem('bed_last_breath_session', JSON.stringify({
                completedAt: new Date().toISOString(),
                durationSeconds: selectedDuration
              }));
            } catch (e) {}
            return 0;
          }
          return prev - 1;
        });
        setElapsedActiveSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [isBreathingActive, breathSeconds, selectedDuration, playChime]);

  if (!isOpen) return null;

  const handleStartBreathe = () => {
    setIsBreathingStarted(true);
    setIsBreathingActive(true);
    setBreathCompleted(false);
    setElapsedActiveSeconds(0);
    setRecordedDuration(0);
    try { playChime(432); } catch (e) {}
  };

  const handleTogglePause = () => {
    setIsBreathingActive(prev => !prev);
  };

  const handleStop = () => {
    setIsBreathingActive(false);
    setIsBreathingStarted(false);
    if (elapsedActiveSeconds > 0) {
      setRecordedDuration(elapsedActiveSeconds);
      setBreathCompleted(true);
      try {
        localStorage.setItem('bed_last_breath_session', JSON.stringify({
          completedAt: new Date().toISOString(),
          durationSeconds: elapsedActiveSeconds,
          stoppedEarly: true
        }));
      } catch (e) {}
    } else {
      setBreathSeconds(selectedDuration);
      setBreathCompleted(false);
    }
  };

  const handleResetOrAgain = () => {
    setIsBreathingActive(false);
    setIsBreathingStarted(false);
    setBreathSeconds(selectedDuration);
    setElapsedActiveSeconds(0);
    setBreathCompleted(false);
    setRecordedDuration(0);
  };

  const handleDurationChange = (sec) => {
    if (!isBreathingStarted) {
      setSelectedDuration(sec);
      setBreathSeconds(sec);
      setElapsedActiveSeconds(0);
      setBreathCompleted(false);
      setRecordedDuration(0);
    }
  };

  // 10s breath cycle: 4s Inhale (0-3), 6s Exhale (4-9)
  const elapsedBreathSeconds = selectedDuration - breathSeconds;
  const cycleSecond = elapsedBreathSeconds % 10;
  const isInhale = cycleSecond < 4;

  const isReducedMotion = howIThrive?.animationLevel === 'reduced' || howIThrive?.animationLevel === 'minimal';

  // Visual circle scale
  let circleScale = 1;
  if (isBreathingActive && !isReducedMotion) {
    circleScale = isInhale ? 1.25 : 0.92;
  }

  const groundingSteps = [
    { count: '5', label: 'Things you can SEE around you right now (a plant, a shadow, a color)' },
    { count: '4', label: 'Things you can physically FEEL (feet on the ground, clothing texture, chair)' },
    { count: '3', label: 'Things you can HEAR (ambient room hum, birds, your own breath)' },
    { count: '2', label: 'Things you can SMELL (fresh air, warm tea, soap)' },
    { count: '1', label: 'Kind thought or physical comfort you appreciate' }
  ];

  const handleSmallThingComplete = () => {
    setSmallThingDone(true);
    incrementHydration(250);
    playChime(528);
    try {
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.7 }
      });
    } catch(e) {}
  };

  const handleExit = () => {
    toggleOverwhelmMode();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-sheet" 
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 580,
          background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--accent-primary-light) 100%)',
          border: '2px solid var(--accent-primary)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <span className="pill-badge primary" style={{ marginBottom: '0.25rem' }}>
              <Heart size={12} /> Safe Space • Zero Pressure
            </span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Take a Moment 🫧
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Contextual Calm Pip Companion (Level 1 Major Presence) */}
        <ContextualPip 
          context="take_a_moment" 
          layout="banner" 
          size={56} 
          style={{ marginBottom: '1.25rem' }} 
          moodOverride={breathCompleted ? 'peaceful' : isBreathingActive ? 'breathing' : 'calm'}
        />

        {/* 3 Pillars Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            id="take-moment-breath-tab"
            onClick={() => {
              setActivePillar('pause');
              if (!isBreathingStarted && !breathCompleted) {
                setBreathSeconds(selectedDuration);
              }
            }}
            style={{
              padding: '0.75rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: activePillar === 'pause' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              background: activePillar === 'pause' ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
              color: activePillar === 'pause' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Wind size={18} />
            <span>1. PAUSE / BREATH</span>
          </button>

          <button
            onClick={() => setActivePillar('reset')}
            style={{
              padding: '0.75rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: activePillar === 'reset' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              background: activePillar === 'reset' ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
              color: activePillar === 'reset' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Compass size={18} />
            <span>2. RESET</span>
          </button>

          <button
            onClick={() => setActivePillar('small_thing')}
            style={{
              padding: '0.75rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: activePillar === 'small_thing' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              background: activePillar === 'small_thing' ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
              color: activePillar === 'small_thing' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Sparkles size={18} />
            <span>3. ONE THING</span>
          </button>
        </div>

        {/* Pillar 1: PAUSE / BREATH — Ready-to-start state until user taps Breathe */}
        {activePillar === 'pause' && (
          <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.3rem', color: 'var(--text-primary)' }}>
              {selectedDuration} Seconds of Soft Breathing
            </h4>

            {/* Duration Selector (Only shown before starting) */}
            {!isBreathingStarted && !breathCompleted && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '0.2rem' }}>Duration:</span>
                {[30, 60, 120].map(sec => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => handleDurationChange(sec)}
                    style={{
                      border: selectedDuration === sec ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      background: selectedDuration === sec ? 'var(--accent-primary-light)' : 'transparent',
                      color: selectedDuration === sec ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      borderRadius: 'var(--radius-pill)',
                      padding: '0.2rem 0.65rem',
                      fontSize: '0.75rem',
                      fontWeight: selectedDuration === sec ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            )}
            
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem', minHeight: '2.4rem' }}>
              {breathCompleted ? (
                <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
                  ✨ {recordedDuration} seconds of calm completed! You did wonderfully.
                </span>
              ) : isBreathingActive ? (
                isInhale ? (
                  <span>🌬️ <strong>Inhale gently</strong> through your nose (4s)...</span>
                ) : (
                  <span>🫧 <strong>Exhale slowly</strong> and release tension (6s)...</span>
                )
              ) : isBreathingStarted ? (
                <span>⏸️ <em>Paused — take your time and resume whenever you're ready.</em></span>
              ) : (
                <span>Drop your shoulders away from your ears. Inhale gently for 4s, exhale slowly for 6s. Tap <strong>Breathe</strong> to begin.</span>
              )}
            </p>

            {/* Breathing Visualizer Circle */}
            <div 
              style={{
                width: 124,
                height: 124,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-calm, #40916c) 100%)',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                boxShadow: isBreathingActive ? '0 10px 30px rgba(45, 106, 79, 0.35)' : '0 6px 18px rgba(45, 106, 79, 0.2)',
                transform: `scale(${circleScale})`,
                transition: isBreathingActive ? (isInhale ? 'transform 4s ease-in-out' : 'transform 6s ease-in-out') : 'transform 0.3s ease'
              }}
            >
              <span style={{ fontSize: '2rem', fontWeight: 800 }}>
                {breathCompleted ? '0s' : `${breathSeconds}s`}
              </span>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.9 }}>
                {breathCompleted ? 'Done ✨' : isBreathingActive ? (isInhale ? 'Inhale' : 'Exhale') : isBreathingStarted ? 'Paused' : 'Ready'}
              </span>
            </div>

            {/* Recorded Breathing Time Badge on Completion */}
            {breathCompleted && recordedDuration > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <span 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'var(--accent-primary-light)',
                    padding: '0.3rem 0.85rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.78rem',
                    color: 'var(--accent-primary)',
                    fontWeight: 700
                  }}
                >
                  <CheckCircle size={13} /> Recorded: {recordedDuration}s active breathing
                </span>
              </div>
            )}

            {/* Breathing Button States */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
              {breathCompleted ? (
                <button 
                  id="take-moment-breathe-again-btn"
                  onClick={handleResetOrAgain}
                  className="btn btn-primary btn-sm"
                  style={{ padding: '0.55rem 1.3rem', gap: '0.4rem', fontWeight: 700, borderRadius: 'var(--radius-pill)' }}
                >
                  <RotateCcw size={14} />
                  <span>Breathe Again</span>
                </button>
              ) : !isBreathingStarted ? (
                <button 
                  id="take-moment-breathe-btn"
                  onClick={handleStartBreathe}
                  className="btn btn-primary btn-sm"
                  style={{ padding: '0.55rem 1.5rem', gap: '0.45rem', fontSize: '0.92rem', fontWeight: 700, borderRadius: 'var(--radius-pill)' }}
                >
                  <Play size={16} fill="#ffffff" />
                  <span>Breathe</span>
                </button>
              ) : (
                <>
                  <button 
                    id="take-moment-pause-resume-btn"
                    onClick={handleTogglePause}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.5rem 1.15rem', gap: '0.4rem', fontWeight: 700, borderRadius: 'var(--radius-pill)' }}
                  >
                    {isBreathingActive ? (
                      <>
                        <Pause size={14} />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play size={14} fill="currentColor" />
                        <span>Resume</span>
                      </>
                    )}
                  </button>

                  <button 
                    id="take-moment-stop-btn"
                    onClick={handleStop}
                    className="btn btn-soft btn-sm"
                    style={{ padding: '0.5rem 1rem', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600, borderRadius: 'var(--radius-pill)' }}
                    title="Stop breathing session"
                  >
                    <Square size={13} fill="currentColor" />
                    <span>Stop</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Pillar 2: RESET (5-4-3-2-1 Grounding) */}
        {activePillar === 'reset' && (
          <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>5-4-3-2-1 Sensory Grounding</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Anchoring your attention to physical reality calms amygdala overwhelm.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {groundingSteps.map((step, idx) => (
                <div 
                  key={idx}
                  onClick={() => setGroundingStep(idx)}
                  style={{
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: groundingStep >= idx ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                    border: `1px solid ${groundingStep === idx ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
                    {step.count}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.35 }}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setGroundingStep(prev => Math.min(4, prev + 1))}
              className="btn btn-primary btn-sm"
              style={{ width: '100%' }}
            >
              {groundingStep === 4 ? '✓ Grounding Complete' : 'Next Sensory Anchor'}
            </button>
          </div>
        )}

        {/* Pillar 3: ONE SMALL THING */}
        {activePillar === 'small_thing' && (
          <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>One Simple Kindness For Yourself</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Just one tiny supportive action. Nothing else is required today.
            </p>

            <div style={{ background: 'var(--accent-primary-light)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.3rem' }}>💧</span>
              <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.2rem 0' }}>Drink one glass of fresh water</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                Sit comfortably and sip slowly. Notice the cool sensation.
              </p>
            </div>

            <button
              onClick={handleSmallThingComplete}
              className={`btn ${smallThingDone ? 'btn-soft' : 'btn-primary'}`}
              style={{ width: '100%', padding: '0.85rem' }}
            >
              {smallThingDone ? <><CheckCircle size={16} /> Done • You Did Wonderfully</> : 'I Did This Small Step'}
            </button>
          </div>
        )}

        {/* Exit & Return to Dashboard */}
        <button
          onClick={handleExit}
          className="btn btn-secondary"
          style={{ width: '100%', padding: '0.8rem' }}
        >
          Exit Overwhelm Mode & Return
        </button>
      </div>
    </div>
  );
}
