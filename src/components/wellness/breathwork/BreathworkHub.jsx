import React, { useState, useEffect } from 'react';
import { Wind, Play, Pause, RotateCcw, Sparkles, Heart, Volume2, ShieldCheck, Check } from 'lucide-react';
import { useAudio } from '../../../context/AudioContext';
import confetti from 'canvas-confetti';
import ContextualPip from '../../mascot/ContextualPip';

const BREATH_TECHNIQUES = [
  {
    id: 'box',
    name: 'Box Breathing (4-4-4-4)',
    desc: 'Equal pacing to calm the nervous system and steady pulse.',
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdPost: 4,
    color: 'var(--accent-primary)',
    category: 'Grounding'
  },
  {
    id: '478',
    name: '4-7-8 Relaxing Breath',
    desc: 'Dr. Weil rhythm for deep parasympathetic down-regulation and sleep.',
    inhale: 4,
    hold: 7,
    exhale: 8,
    holdPost: 0,
    color: '#7b61ff',
    category: 'Sleep & Anxiety'
  },
  {
    id: 'calm',
    name: 'Calm Flow (4-6)',
    desc: 'Extended exhale rhythm to release muscle tension.',
    inhale: 4,
    hold: 0,
    exhale: 6,
    holdPost: 0,
    color: '#3a86c8',
    category: 'De-stress'
  },
  {
    id: 'energize',
    name: 'Vitality Breath (6-2)',
    desc: 'Active inhale to clear brain fog and re-energize cells.',
    inhale: 6,
    hold: 0,
    exhale: 2,
    holdPost: 0,
    color: '#d97736',
    category: 'Energy'
  }
];

export default function BreathworkHub({ onNavigateTab }) {
  const { playChime } = useAudio();

  const [selectedTech, setSelectedTech] = useState(BREATH_TECHNIQUES[0]);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('inhale'); // 'inhale' | 'hold' | 'exhale' | 'holdPost'
  const [countdown, setCountdown] = useState(selectedTech.inhale);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  useEffect(() => {
    setCountdown(selectedTech.inhale);
    setPhase('inhale');
    setIsActive(false);
    setCyclesCompleted(0);
  }, [selectedTech]);

  useEffect(() => {
    let timer = null;
    if (isActive) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev > 1) return prev - 1;

          // Phase transition
          if (phase === 'inhale') {
            if (selectedTech.hold > 0) {
              setPhase('hold');
              return selectedTech.hold;
            } else {
              setPhase('exhale');
              return selectedTech.exhale;
            }
          } else if (phase === 'hold') {
            setPhase('exhale');
            return selectedTech.exhale;
          } else if (phase === 'exhale') {
            if (selectedTech.holdPost > 0) {
              setPhase('holdPost');
              return selectedTech.holdPost;
            } else {
              setCyclesCompleted(c => c + 1);
              setPhase('inhale');
              return selectedTech.inhale;
            }
          } else if (phase === 'holdPost') {
            setCyclesCompleted(c => c + 1);
            setPhase('inhale');
            return selectedTech.inhale;
          }
          return 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, phase, selectedTech]);

  const toggleBreath = () => {
    if (!isActive) {
      setIsActive(true);
      try { playChime(432); } catch (e) {}
    } else {
      setIsActive(false);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setCountdown(selectedTech.inhale);
    setCyclesCompleted(0);
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In Slowly';
      case 'hold': return 'Gently Hold';
      case 'exhale': return 'Softly Exhale';
      case 'holdPost': return 'Rest & Hold';
      default: return 'Breathe';
    }
  };

  const getCircleScale = () => {
    if (!isActive) return 1;
    if (phase === 'inhale') return 1.4;
    if (phase === 'hold') return 1.4;
    if (phase === 'exhale') return 0.9;
    if (phase === 'holdPost') return 0.9;
    return 1;
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
          <span className="pill-badge primary" style={{ fontSize: '0.72rem' }}>
            <Wind size={12} /> Nervous System Regulation
          </span>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
          Guided Breathwork 🌬️
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
          Regulate your heart rate, lower cortisol, and restore internal calm with rhythmic breath pacing.
        </p>

        {/* Contextual Breathing Pip */}
        <ContextualPip context="breathwork" layout="subtle" size={32} style={{ marginTop: '0.75rem' }} />
      </div>

      {/* Main Breathing Visualizer Card */}
      <div 
        className="card-glass"
        style={{
          padding: '2.5rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          background: 'radial-gradient(circle, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
          minHeight: 340
        }}
      >
        {/* Animated Breath Bubble */}
        <div 
          style={{
            width: 170,
            height: 170,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${selectedTech.color}33 0%, ${selectedTech.color}11 70%)`,
            border: `3px solid ${selectedTech.color}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${getCircleScale()})`,
            transition: 'transform 3.5s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: `0 0 35px ${selectedTech.color}44`,
            userSelect: 'none'
          }}
        >
          <span style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {countdown}s
          </span>
          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>
            {getPhaseText()}
          </span>
        </div>

        {/* Cycles Counter */}
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Completed Cycles: <strong style={{ color: 'var(--text-primary)' }}>{cyclesCompleted}</strong>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={toggleBreath}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.75rem', fontSize: '0.92rem', gap: '0.4rem' }}
          >
            {isActive ? <Pause size={17} /> : <Play size={17} />}
            <span>{isActive ? 'Pause' : 'Start Rhythm'}</span>
          </button>

          <button
            onClick={handleReset}
            className="btn btn-secondary"
            style={{ padding: '0.65rem 1rem', fontSize: '0.88rem' }}
            title="Reset"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Rhythms Selection Grid */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.85rem 0', color: 'var(--text-primary)' }}>
          Select Breathwork Rhythm
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
          {BREATH_TECHNIQUES.map(tech => {
            const isSelected = selectedTech.id === tech.id;
            return (
              <div
                key={tech.id}
                className="card-glass card-interactive"
                onClick={() => setSelectedTech(tech)}
                style={{
                  padding: '1.1rem',
                  cursor: 'pointer',
                  borderLeft: `4px solid ${tech.color}`,
                  background: isSelected ? 'var(--accent-primary-light)' : 'var(--bg-glass-card)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: tech.color, textTransform: 'uppercase' }}>
                    {tech.category}
                  </span>
                  {isSelected && <Check size={14} color="var(--accent-primary)" />}
                </div>

                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>
                  {tech.name}
                </h4>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  {tech.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
