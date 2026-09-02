import React, { useState, useEffect } from 'react';
import { useAudio } from '../../context/AudioContext';
import { Play, Pause, RotateCcw, Wind, Sparkles } from 'lucide-react';

const PATTERNS = {
  box: {
    id: 'box',
    name: 'Box Breathing (4-4-4-4)',
    desc: 'Downregulates the sympathetic nervous system and sharpens focus.',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold Gently', duration: 4 },
      { name: 'Exhale Smoothly', duration: 4 },
      { name: 'Hold Empty', duration: 4 }
    ]
  },
  relax478: {
    id: 'relax478',
    name: '4-7-8 Sleep & Deep Calm',
    desc: 'Activates the vagus nerve to slow heart rate and prepare for rest.',
    phases: [
      { name: 'Inhale through Nose', duration: 4 },
      { name: 'Hold Still', duration: 7 },
      { name: 'Exhale with Whoosh', duration: 8 }
    ]
  },
  calm46: {
    id: 'calm46',
    name: '4-6 Steady Reset',
    desc: 'A gentle extended exhale for instant daytime tension release.',
    phases: [
      { name: 'Inhale Softly', duration: 4 },
      { name: 'Exhale Slowly', duration: 6 }
    ]
  }
};

export default function GuidedBreathing() {
  const { playChime } = useAudio();

  const [patternKey, setPatternKey] = useState('box');
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsInPhase, setSecondsInPhase] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);

  const pattern = PATTERNS[patternKey];
  const currentPhase = pattern.phases[phaseIndex];

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSecondsInPhase(prev => {
          if (prev + 1 >= currentPhase.duration) {
            // Next phase
            playChime(phaseIndex === 0 ? 432 : 528);
            if (phaseIndex + 1 < pattern.phases.length) {
              setPhaseIndex(phaseIndex + 1);
            } else {
              setPhaseIndex(0);
              setCompletedCycles(c => c + 1);
            }
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, phaseIndex, currentPhase, patternKey]);

  const toggleActive = () => {
    if (!isActive) {
      playChime(528);
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setPhaseIndex(0);
    setSecondsInPhase(0);
    setCompletedCycles(0);
  };

  // Compute visual scale for circle based on inhale/exhale
  const isExhale = currentPhase.name.toLowerCase().includes('exhale');
  const isInhale = currentPhase.name.toLowerCase().includes('inhale');
  let scale = 1;
  if (isInhale) {
    scale = 1 + (secondsInPhase / currentPhase.duration) * 0.45;
  } else if (isExhale) {
    scale = 1.45 - (secondsInPhase / currentPhase.duration) * 0.45;
  } else {
    scale = 1.45; // Hold expanded or steady
  }

  return (
    <div className="card-glass" style={{ padding: '1.75rem', textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
        <span className="pill-badge primary">
          <Wind size={12} /> Somatic Nervous System Tool
        </span>
      </div>
      <h3 style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>Guided Breathwork 🌬️</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: 450, margin: '0 auto 1.25rem' }}>
        {pattern.desc}
      </p>

      {/* Pattern Selector Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.4rem', marginBottom: '2rem' }}>
        {Object.values(PATTERNS).map(p => (
          <button
            key={p.id}
            onClick={() => { setPatternKey(p.id); handleReset(); }}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              border: patternKey === p.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              background: patternKey === p.id ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
              color: patternKey === p.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Expanding Breathing Circle Visualizer */}
      <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Outer Glow Halo */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)',
            opacity: 0.2,
            transform: `scale(${scale * 1.15})`,
            transition: 'transform 1s linear'
          }}
        />

        {/* Dynamic Scaling Circle */}
        <div 
          style={{
            width: 170,
            height: 170,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-calm) 100%)',
            boxShadow: '0 8px 32px rgba(45, 106, 79, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            transform: `scale(${scale})`,
            transition: 'transform 1s linear',
            padding: '1rem',
            textAlign: 'center'
          }}
        >
          <span style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.2, textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
            {currentPhase.name}
          </span>
          <span style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.2rem', fontFamily: 'var(--font-heading)' }}>
            {currentPhase.duration - secondsInPhase}s
          </span>
        </div>
      </div>

      {/* Cycle Count */}
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
        Cycles Completed: <strong style={{ color: 'var(--text-primary)' }}>{completedCycles}</strong>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
        <button 
          onClick={toggleActive}
          className="btn btn-primary btn-lg"
          style={{ minWidth: 160 }}
        >
          {isActive ? <><Pause size={18} /> Pause Breath</> : <><Play size={18} /> Begin Session</>}
        </button>

        <button 
          onClick={handleReset}
          className="btn btn-secondary"
          title="Reset timer"
        >
          <RotateCcw size={18} /> Reset
        </button>
      </div>
    </div>
  );
}
