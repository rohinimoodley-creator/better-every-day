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
  march: {
    id: 'march',
    title: 'Marching in Place',
    category: 'Gentle Cardio & Pacing',
    icon: '🚶',
    overview: 'Lift your knees and swing your arms rhythmically to boost circulation and energy.',
    focusPoint: 'Stand tall and lift each knee to about hip level while swinging the opposite arm.',
    steps: [
      { id: '1', title: 'Get ready', desc: 'Stand tall with your feet about hip-width apart and arms relaxed.' },
      { id: '2', title: 'Move', desc: 'Lift your left knee up to hip height while swinging your right arm forward.' },
      { id: '3', title: 'Hold', desc: 'Pause briefly at the top of your march.' },
      { id: '4', title: 'Switch', desc: 'Lower your left foot down and lift your right knee while swinging your left arm.' }
    ]
  },
  heel_raise: {
    id: 'heel_raise',
    title: 'Heel & Calf Raises',
    category: 'Ankles & Lower Body',
    icon: '👟',
    overview: 'Strengthen your calves and ankles with smooth, controlled upward lifts.',
    focusPoint: 'Push straight up onto the balls of your feet and lower down with control.',
    steps: [
      { id: '1', title: 'Get ready', desc: 'Stand tall with feet flat on the floor, about hip-width apart. Rest hands on hips for balance.' },
      { id: '2', title: 'Move', desc: 'Press into the balls of your feet and lift both heels high off the floor.' },
      { id: '3', title: 'Hold', desc: 'Pause at the top for 1–2 seconds to feel your calves working.' },
      { id: '4', title: 'Return', desc: 'Slowly lower your heels back flat onto the floor without slamming down.' }
    ]
  },
  arm_swing: {
    id: 'arm_swing',
    title: 'Gentle Arm Swings',
    category: 'Shoulders & Mobility',
    icon: '🙆',
    overview: 'Loosen your shoulders and upper back with relaxed, rhythmic swinging.',
    focusPoint: 'Keep your shoulders relaxed and let your arms swing freely through their natural arc.',
    steps: [
      { id: '1', title: 'Get ready', desc: 'Stand tall with soft knees and let your arms hang loosely at your sides.' },
      { id: '2', title: 'Move', desc: 'Swing both arms forward and up in front of your chest with a smooth, easy motion.' },
      { id: '3', title: 'Hold', desc: 'Pause for a fraction of a second at the top of the swing.' },
      { id: '4', title: 'Return', desc: 'Let your arms swing naturally down and slightly behind your hips.' }
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

        {/* 3. REPETITION LOGGING: COMPACT "HOW MANY TIMES?" */}
        <div 
          style={{ 
            background: 'var(--bg-secondary)', 
            padding: '0.85rem 1rem', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-subtle)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.65rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              How many times?
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Record repetitions (optional)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Stepper Controls: − 0 + */}
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-pill)', padding: '2px', border: '1px solid var(--border-subtle)' }}>
              <button
                type="button"
                onClick={handleDecrement}
                aria-label="Decrease count"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Minus size={14} />
              </button>

              <span style={{ minWidth: 28, textAlign: 'center', fontSize: '0.98rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                {repCount}
              </span>

              <button
                type="button"
                onClick={handleIncrement}
                aria-label="Increase count"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--accent-primary)',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Plus size={14} />
              </button>
            </div>

            {repCount > 0 && (
              <button
                type="button"
                onClick={handleSaveReps}
                className="btn btn-primary btn-sm"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', gap: '0.25rem' }}
              >
                <Check size={12} /> Save
              </button>
            )}
          </div>
        </div>

        {/* Gentle Save Confirmation */}
        {savedFeedback && (
          <div style={{ marginTop: '0.65rem', marginBottom: '0.65rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', animation: 'fadeIn 0.2s ease-out' }}>
            ✓ {savedFeedback}
          </div>
        )}

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

