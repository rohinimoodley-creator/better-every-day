import React, { useState } from 'react';
import { X, CheckCircle, ArrowRight, ArrowLeft, Zap } from 'lucide-react';
import ExerciseMiniAnimation from './ExerciseMiniAnimations';
import confetti from 'canvas-confetti';

export const EXERCISE_BREAKDOWNS = {
  squat: {
    id: 'squat',
    title: 'Bodyweight Squat',
    category: 'Lower Body & Mobility',
    icon: '🦵',
    overview: 'Builds leg strength, hip mobility, and knee stability without weights.',
    steps: [
      { id: '1', title: 'Stance Setup', desc: 'Stand tall with feet shoulder-width apart, toes pointing slightly outward (about 10–15°).' },
      { id: '2', title: 'Hips First (Hinge)', desc: 'Push your hips backward as if sitting into a chair behind you before bending knees.' },
      { id: '3', title: 'Smooth Knee Bend', desc: 'Bend knees smoothly, keeping knees tracking over middle toes, chest upright.' },
      { id: '4', title: 'Depth & Parallel', desc: 'Lower your body until thighs are roughly parallel with the floor, keeping heels grounded.' },
      { id: '5', title: 'Drive to Stand', desc: 'Press through mid-foot and heels to return to standing position, squeezing glutes gently at the top.' }
    ]
  },
  pushup: {
    id: 'pushup',
    title: 'Push-Up (Wall or Floor)',
    category: 'Upper Body & Core',
    icon: '💪',
    overview: 'Strengthens chest, shoulders, triceps, and anterior core with zero joint strain.',
    steps: [
      { id: '1', title: 'Hand Placement', desc: 'Place hands slightly wider than shoulder-width on wall, counter, or floor mat.' },
      { id: '2', title: 'Plank Alignment', desc: 'Form a straight, continuous line from head through hips down to heels.' },
      { id: '3', title: 'Elbows at 45°', desc: 'Inhale and bend elbows at roughly a 45-degree angle to your ribs, lowering chest smoothly.' },
      { id: '4', title: 'Press to Start', desc: 'Exhale and press firmly away from surface to return to the starting position.' }
    ]
  },
  lunge: {
    id: 'lunge',
    title: 'Step Lunge',
    category: 'Balance & Leg Stability',
    icon: '🚶',
    overview: 'Enhances single-leg stability, hip flexor mobility, and pelvic alignment.',
    steps: [
      { id: '1', title: 'Starting Posture', desc: 'Stand tall with shoulders relaxed, hands on hips or at chest for balance.' },
      { id: '2', title: 'Controlled Forward Step', desc: 'Take a comfortable step forward with one leg, keeping torso strictly upright.' },
      { id: '3', title: 'Lower Back Knee', desc: 'Drop back knee toward the floor until both front and back knees form roughly 90° angles.' },
      { id: '4', title: 'Push Off Front Heel', desc: 'Press through front heel to step back cleanly to the starting position.' }
    ]
  },
  plank: {
    id: 'plank',
    title: 'Forearm Plank Hold',
    category: 'Core Stability & Spine Protection',
    icon: '🛡️',
    overview: 'Strengthens deep abdominal wall, glutes, and shoulders while keeping lumbar spine neutral.',
    steps: [
      { id: '1', title: 'Forearms Under Shoulders', desc: 'Place elbows and forearms flat on mat directly under shoulders.' },
      { id: '2', title: 'Leg Extension', desc: 'Step feet back on toes, engaging quadriceps and glutes.' },
      { id: '3', title: 'Flat Spine & Neck', desc: 'Maintain flat upper back with gaze down between thumbs, avoiding saggy hips.' },
      { id: '4', title: 'Rhythmic Breathing', desc: 'Hold for 15–30 seconds while taking slow, unhurried breaths.' }
    ]
  },
  stretch: {
    id: 'stretch',
    title: 'Neck & Shoulder Release',
    category: 'Postural Reset & Calming',
    icon: '🍃',
    overview: 'Releases tension from desk work, screen fatigue, or emotional stress.',
    steps: [
      { id: '1', title: 'Seated or Standing Alignment', desc: 'Sit comfortably with spine tall, dropping shoulders away from ears.' },
      { id: '2', title: 'Lateral Neck Tilt', desc: 'Gently tilt right ear toward right shoulder; hold for 3 slow breaths without forcing.' },
      { id: '3', title: 'Shoulder Rolls', desc: 'Roll both shoulders up, back, and down in slow circular motions 5 times.' },
      { id: '4', title: 'Opposite Side Repeat', desc: 'Repeat gentle tilt on left side and breathe deeply.' }
    ]
  }
};

export default function ExerciseBreakdownModal({ isOpen, onClose, initialExercise = 'squat' }) {
  const [selectedKey, setSelectedKey] = useState(initialExercise);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  if (!isOpen) return null;

  const exercise = EXERCISE_BREAKDOWNS[selectedKey] || EXERCISE_BREAKDOWNS.squat;
  const currentStep = exercise.steps[activeStepIdx] || exercise.steps[0];
  const isAllDone = completedSteps.length === exercise.steps.length;

  const toggleStepCompleted = (stepId) => {
    setCompletedSteps(prev => {
      const next = prev.includes(stepId) ? prev.filter(s => s !== stepId) : [...prev, stepId];
      if (next.length === exercise.steps.length) {
        try {
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
      return next;
    });
  };

  const handleSelectExercise = (key) => {
    setSelectedKey(key);
    setActiveStepIdx(0);
    setCompletedSteps([]);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-sheet" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: 640, maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <span className="pill-badge primary" style={{ marginBottom: '0.25rem', fontSize: '0.72rem' }}>
              <Zap size={12} /> Movement Step Breakdown Tool
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Break It Down 🧩
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0', lineHeight: 1.45 }}>
          Master exercises one manageable movement at a time with mini-visual animations and clear form checkpoints.
        </p>

        {/* Exercise Selection Chips */}
        <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.4rem', marginBottom: '1.25rem', scrollbarWidth: 'none' }}>
          {Object.entries(EXERCISE_BREAKDOWNS).map(([key, ex]) => {
            const isSelected = selectedKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectExercise(key)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-pill)',
                  border: isSelected ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                  color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? 800 : 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {ex.icon} {ex.title}
              </button>
            );
          })}
        </div>

        {/* Active Exercise Overview & Mini-Animation */}
        <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                {exercise.category}
              </span>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0.1rem 0', color: 'var(--text-primary)' }}>
                Step {activeStepIdx + 1} of {exercise.steps.length}: {currentStep.title}
              </h4>
            </div>

            <span className="pill-badge gray" style={{ fontSize: '0.7rem' }}>
              Step {activeStepIdx + 1} / {exercise.steps.length}
            </span>
          </div>

          {/* Mini-Animation Box */}
          <div style={{ marginBottom: '1rem' }}>
            <ExerciseMiniAnimation exerciseId={selectedKey} stepIndex={activeStepIdx} />
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 600, margin: '0 0 1rem 0', lineHeight: 1.5 }}>
            {currentStep.desc}
          </p>

          {/* Stepper Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              disabled={activeStepIdx === 0}
              onClick={() => setActiveStepIdx(prev => Math.max(0, prev - 1))}
              className="btn btn-secondary btn-sm"
              style={{ opacity: activeStepIdx === 0 ? 0.4 : 1, fontSize: '0.78rem' }}
            >
              <ArrowLeft size={13} /> Previous Step
            </button>

            <button
              type="button"
              onClick={() => toggleStepCompleted(currentStep.id)}
              className="btn btn-primary btn-sm"
              style={{
                background: completedSteps.includes(currentStep.id) ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: completedSteps.includes(currentStep.id) ? '#ffffff' : 'var(--text-primary)',
                border: '1px solid var(--accent-primary)'
              }}
            >
              <CheckCircle size={14} />
              {completedSteps.includes(currentStep.id) ? 'Step Mastered ✓' : 'Mark Step Complete'}
            </button>

            <button
              type="button"
              disabled={activeStepIdx === exercise.steps.length - 1}
              onClick={() => setActiveStepIdx(prev => Math.min(exercise.steps.length - 1, prev + 1))}
              className="btn btn-secondary btn-sm"
              style={{ opacity: activeStepIdx === exercise.steps.length - 1 ? 0.4 : 1, fontSize: '0.78rem' }}
            >
              Next Step <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Full Steps Checklist */}
        <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
          <h5 style={{ fontSize: '0.84rem', fontWeight: 800, margin: '0 0 0.6rem 0', color: 'var(--text-primary)' }}>
            All Movement Checkpoints
          </h5>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {exercise.steps.map((s, idx) => {
              const isCurrent = activeStepIdx === idx;
              const isChecked = completedSteps.includes(s.id);
              return (
                <div
                  key={s.id}
                  onClick={() => setActiveStepIdx(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: isCurrent ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                    border: `1px solid ${isCurrent ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleStepCompleted(s.id);
                    }}
                    style={{ width: 16, height: 16, cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1, fontSize: '0.8rem', color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: isChecked ? 'line-through' : 'none' }}>
                    <strong>{idx + 1}. {s.title}:</strong> {s.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completion Message */}
        {isAllDone && (
          <div style={{ background: 'var(--accent-primary-light)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🎉</span>
            <h5 style={{ fontSize: '0.92rem', fontWeight: 800, margin: '0.2rem 0', color: 'var(--accent-primary)' }}>
              All Steps Explored & Practiced!
            </h5>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
              Great job breaking this exercise down. You're ready to practice at your own gentle pace.
            </p>
          </div>
        )}

        <button onClick={onClose} className="btn btn-secondary" style={{ width: '100%', padding: '0.65rem' }}>
          Done Practicing
        </button>
      </div>
    </div>
  );
}
