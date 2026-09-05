import React, { useState } from 'react';
import { X, Sparkles, ChevronDown, ChevronUp, Plus, Minus, Check, RotateCcw } from 'lucide-react';
import ExerciseMiniAnimation from './ExerciseMiniAnimations';
import ContextualPip from '../mascot/ContextualPip';
import { useWellness } from '../../context/WellnessContext';
import { useAudio } from '../../context/AudioContext';
import confetti from 'canvas-confetti';

export const EXERCISE_BREAKDOWNS = {
  squat: {
    id: 'squat',
    title: 'Bodyweight Squat',
    category: 'Legs & Balance',
    icon: '🦵',
    overview: 'Learn how to bend your knees and hips smoothly without any weights.',
    focusPoint: 'Keep your back straight and feet flat on the floor.',
    steps: [
      { id: '1', title: 'Get ready', desc: 'Stand with your feet about shoulder-width apart.' },
      { id: '2', title: 'Move', desc: 'Push your hips back and slowly bend your knees like sitting in a chair.' },
      { id: '3', title: 'Hold', desc: 'Stay here for a moment with your chest upright.' },
      { id: '4', title: 'Return', desc: 'Slowly push through your feet to stand back up.' }
    ]
  },
  pushup: {
    id: 'pushup',
    title: 'Push-Up (Wall or Floor)',
    category: 'Arms & Chest',
    icon: '💪',
    overview: 'Learn how to push away from a wall, counter, or the floor with good form.',
    focusPoint: 'Gently tighten your tummy so your whole body moves as one piece.',
    steps: [
      { id: '1', title: 'Get ready', desc: 'Place your hands flat, slightly wider than your shoulders.' },
      { id: '2', title: 'Move', desc: 'Keep your body in a straight line and gently tighten your tummy.' },
      { id: '3', title: 'Hold', desc: 'Slowly bend your elbows to lower your chest toward the surface.' },
      { id: '4', title: 'Return', desc: 'Push firmly away with your hands to return to the start.' }
    ]
  },
  lunge: {
    id: 'lunge',
    title: 'Step Lunge',
    category: 'Legs & Stability',
    icon: '🚶',
    overview: 'Step forward one leg at a time to build strong legs and steady balance.',
    focusPoint: 'Keep your chest tall and look straight ahead.',
    steps: [
      { id: '1', title: 'Get ready', desc: 'Stand tall with your hands on your hips.' },
      { id: '2', title: 'Move', desc: 'Take a comfortable step forward with one foot.' },
      { id: '3', title: 'Hold', desc: 'Bend both knees until they make a gentle square shape.' },
      { id: '4', title: 'Return', desc: 'Push off your front heel to step back and stand tall again.' }
    ]
  },
  plank: {
    id: 'plank',
    title: 'Forearm Plank Hold',
    category: 'Core & Tummy',
    icon: '🛡️',
    overview: 'Hold a steady, straight line on your elbows to strengthen your tummy.',
    focusPoint: 'Breathe normally — don\'t let your hips sag toward the floor.',
    steps: [
      { id: '1', title: 'Get ready', desc: 'Rest your elbows and forearms flat on the floor right under your shoulders.' },
      { id: '2', title: 'Move', desc: 'Step your feet back so your whole body makes a straight line.' },
      { id: '3', title: 'Hold', desc: 'Gently tighten your tummy and take slow, steady breaths for 10–20 seconds.' },
      { id: '4', title: 'Return', desc: 'Gently lower your knees down to rest.' }
    ]
  },
  stretch: {
    id: 'stretch',
    title: 'Neck & Shoulder Reset',
    category: 'Postural Reset',
    icon: '🍃',
    overview: 'Release tightness in your neck and shoulders from screen time or sitting.',
    focusPoint: 'Move softly and never force a stretch.',
    steps: [
      { id: '1', title: 'Get ready', desc: 'Sit or stand tall and relax your shoulders away from your ears.' },
      { id: '2', title: 'Move', desc: 'Gently tilt your right ear toward your right shoulder.' },
      { id: '3', title: 'Hold', desc: 'Take 2 slow breaths without pulling or straining.' },
      { id: '4', title: 'Return', desc: 'Bring your head up, roll your shoulders, and repeat on your left side.' }
    ]
  }
};

export default function ExerciseBreakdownModal({ isOpen, onClose, initialExercise = 'squat' }) {
  const { logMicroMovement } = useWellness();
  const { playChime } = useAudio();

  const [selectedKey, setSelectedKey] = useState(initialExercise);
  const [isSlowMode, setIsSlowMode] = useState(false);
  const [showWrittenInstructions, setShowWrittenInstructions] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [savedFeedback, setSavedFeedback] = useState('');
  const [pipMood, setPipMood] = useState('happy');

  if (!isOpen) return null;

  const exercise = EXERCISE_BREAKDOWNS[selectedKey] || EXERCISE_BREAKDOWNS.squat;

  const handleSelectExercise = (key) => {
    setSelectedKey(key);
    setRepCount(0);
    setSavedFeedback('');
    setPipMood('curious');
    setTimeout(() => setPipMood('happy'), 1500);
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
      try { confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } }); } catch(e) {}
      setSavedFeedback(`Saved ${repCount} ${repCount === 1 ? 'time' : 'times'}! Nice work 🌱`);
      setPipMood('celebrate');
      setTimeout(() => setPipMood('happy'), 2500);
    } else {
      setSavedFeedback('Practice noted! 🌱');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-sheet card-glass" 
        onClick={e => e.stopPropagation()} 
        style={{ 
          maxWidth: 580, 
          maxHeight: '90vh', 
          overflowY: 'auto',
          borderRadius: 'var(--radius-xl)',
          padding: '1.6rem 1.4rem',
          border: '1.5px solid var(--accent-primary)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          animation: 'scaleUp 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span className="pill-badge primary" style={{ fontSize: '0.72rem', padding: '2px 8px', fontWeight: 800 }}>
              <Sparkles size={12} /> Break It Down 🧩
            </span>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'var(--bg-tertiary)', 
              border: 'none', 
              borderRadius: '50%', 
              width: 30, 
              height: 30, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer', 
              color: 'var(--text-muted)' 
            }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Exercise Selection Chips */}
        <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.4rem', marginBottom: '1rem', scrollbarWidth: 'none' }}>
          {Object.entries(EXERCISE_BREAKDOWNS).map(([key, ex]) => {
            const isSelected = selectedKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectExercise(key)}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-pill)',
                  border: isSelected ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                  color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
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

        {/* 1. PRIMARY TEACHING: ANIMATED DEMONSTRATION */}
        <div style={{ background: 'var(--bg-secondary)', padding: '1.15rem', borderRadius: 'var(--radius-lg)', marginBottom: '1rem', border: '1px solid var(--border-subtle)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {exercise.icon} {exercise.title}
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
                {exercise.overview}
              </p>
            </div>

            {/* Slow Mode Toggle (Adapted from Stance Setup) */}
            <button
              type="button"
              onClick={() => setIsSlowMode(!isSlowMode)}
              className={`btn btn-sm ${isSlowMode ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                fontSize: '0.75rem',
                padding: '0.35rem 0.7rem',
                gap: '0.3rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-pill)'
              }}
              title="Slow down the demonstration to see every detail"
            >
              <span>{isSlowMode ? '🐢 Slow Mode On' : '🐢 Slow Mode'}</span>
            </button>
          </div>

          {/* Continuous Animated Demonstration Box */}
          <ExerciseMiniAnimation exerciseId={selectedKey} isSlowMode={isSlowMode} />

          {/* Quick Key Checkpoint */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.65rem', background: 'var(--bg-tertiary)', padding: '0.5rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.85rem' }}>💡</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 600 }}>
              <strong>Quick Tip:</strong> {exercise.focusPoint}
            </span>
          </div>
        </div>

        {/* 2. OPTIONAL WRITTEN INSTRUCTIONS (13-year-old reading level) */}
        <div style={{ marginBottom: '1.15rem' }}>
          <button
            type="button"
            onClick={() => setShowWrittenInstructions(!showWrittenInstructions)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 0.95rem',
              color: 'var(--text-primary)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <span>{showWrittenInstructions ? '📖 Hide Written Instructions' : '📖 Show Written Instructions'}</span>
            {showWrittenInstructions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showWrittenInstructions && (
            <div style={{ marginTop: '0.5rem', background: 'var(--bg-tertiary)', padding: '0.9rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.55rem', animation: 'fadeIn 0.2s ease-out' }}>
              {exercise.steps.map((step, idx) => (
                <div 
                  key={step.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.6rem'
                  }}
                >
                  <span 
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'var(--accent-primary-light)',
                      color: 'var(--accent-primary)',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <strong style={{ fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                      {step.title}
                    </strong>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0', lineHeight: 1.45 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. REPETITION LOGGING: "HOW MANY TIMES DID YOU DO IT?" */}
        <div 
          style={{ 
            background: 'radial-gradient(circle at top, var(--accent-primary-light) 0%, var(--bg-secondary) 100%)', 
            padding: '1.15rem', 
            borderRadius: 'var(--radius-lg)', 
            border: '1.5px solid var(--accent-primary)',
            marginBottom: '1rem',
            textAlign: 'center'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
            <ContextualPip 
              context="move" 
              size={48} 
              mood={pipMood}
              message="Give it a try! Zero pressure."
              showSpeechBubble={false}
            />
            <div style={{ textAlign: 'left' }}>
              <h4 style={{ fontSize: '1.02rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                How many times did you do it?
              </h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Practice at your own pace. Logging is completely optional.
              </span>
            </div>
          </div>

          {/* Stepper Controls: − 0 + */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', margin: '0.85rem 0' }}>
            <button
              type="button"
              onClick={handleDecrement}
              aria-label="Decrease count"
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: 'var(--bg-secondary)',
                border: '1.5px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.1rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Minus size={18} />
            </button>

            <div 
              style={{
                minWidth: 70,
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-glass-card)',
                border: '1.5px solid var(--accent-primary)',
                fontSize: '1.6rem',
                fontWeight: 900,
                color: 'var(--accent-primary)'
              }}
            >
              {repCount}
            </div>

            <button
              type="button"
              onClick={handleIncrement}
              aria-label="Increase count"
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: 'var(--accent-primary)',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.1rem',
                boxShadow: '0 4px 12px rgba(46, 125, 90, 0.3)'
              }}
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Save Action */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleSaveReps}
              className="btn btn-primary btn-sm"
              style={{
                padding: '0.45rem 1.4rem',
                fontSize: '0.84rem',
                fontWeight: 800,
                borderRadius: 'var(--radius-pill)',
                gap: '0.35rem'
              }}
            >
              <Check size={14} /> Save
            </button>

            {repCount > 0 && (
              <button
                type="button"
                onClick={() => { setRepCount(0); setSavedFeedback(''); }}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-pill)' }}
                title="Reset counter"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>

          {/* Gentle Save Confirmation */}
          {savedFeedback && (
            <div style={{ marginTop: '0.65rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', animation: 'fadeIn 0.2s ease-out' }}>
              ✓ {savedFeedback}
            </div>
          )}
        </div>

        {/* Done / Close Button */}
        <button 
          onClick={onClose} 
          className="btn btn-secondary" 
          style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem' }}
        >
          Done
        </button>
      </div>
    </div>
  );
}

