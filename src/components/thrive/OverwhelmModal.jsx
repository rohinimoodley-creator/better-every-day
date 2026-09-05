import React, { useState, useEffect } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { useAudio } from '../../context/AudioContext';
import { X, Heart, Wind, Compass, Sparkles, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import ContextualPip from '../mascot/ContextualPip';

export default function OverwhelmModal({ isOpen, onClose }) {
  const { toggleOverwhelmMode, incrementHydration } = useWellness();
  const { playChime } = useAudio();

  const [activePillar, setActivePillar] = useState('pause'); // 'pause' | 'reset' | 'small_thing'
  const [breathSeconds, setBreathSeconds] = useState(60);
  const [isBreathingActive, setIsBreathingActive] = useState(true);
  const [groundingStep, setGroundingStep] = useState(0);
  const [smallThingDone, setSmallThingDone] = useState(false);

  useEffect(() => {
    let timer = null;
    if (isBreathingActive && breathSeconds > 0) {
      timer = setInterval(() => {
        setBreathSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [isBreathingActive, breathSeconds]);

  if (!isOpen) return null;

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
        />

        {/* 3 Pillars Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setActivePillar('pause')}
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
            <span>1. PAUSE</span>
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

        {/* Pillar 1: PAUSE (Breath) */}
        {activePillar === 'pause' && (
          <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>60 Seconds of Soft Breathing</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Drop your shoulders away from your ears. Inhale gently for 4s, exhale slowly for 6s.
            </p>

            <div 
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-calm) 100%)',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                boxShadow: '0 8px 24px rgba(45, 106, 79, 0.25)'
              }}
            >
              <span style={{ fontSize: '2rem', fontWeight: 800 }}>{breathSeconds}s</span>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Breathe</span>
            </div>

            <button 
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className="btn btn-secondary btn-sm"
            >
              {isBreathingActive ? 'Pause Timer' : 'Resume Timer'}
            </button>
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
