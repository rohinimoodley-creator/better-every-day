import React, { useState, useEffect } from 'react';
import { X, Play, ArrowRight, Check, Sparkles, ChevronDown, ChevronUp, RotateCcw, Heart, Shield } from 'lucide-react';
import ContextualPip from '../mascot/ContextualPip';
import ExerciseMiniAnimation from './ExerciseMiniAnimations';
import { useWellness } from '../../context/WellnessContext';
import { useAudio } from '../../context/AudioContext';
import confetti from 'canvas-confetti';

const BEGINNER_PLAN_EXERCISES = [
  // Stage 1: Ease In (Gentle Stretching & Mobility)
  {
    id: 'bp_1',
    stage: 1,
    stageName: 'Stage 1 — Ease In',
    stageBadge: '🌿 Gentle Mobility',
    name: 'Gentle Neck & Shoulder Release',
    animationId: 'stretch',
    durationSec: 45,
    seatedAlt: 'Sit tall in a supportive chair with feet flat.',
    tip: 'Drop your shoulders down from your ears and breathe slowly.',
    steps: [
      { title: 'Get ready', desc: 'Sit or stand tall and relax your shoulders.' },
      { title: 'Move', desc: 'Gently tilt your right ear toward your right shoulder.' },
      { title: 'Hold', desc: 'Take 2 slow, easy breaths.' },
      { title: 'Return', desc: 'Bring your head up, roll shoulders, and repeat on your left side.' }
    ]
  },
  {
    id: 'bp_2',
    stage: 1,
    stageName: 'Stage 1 — Ease In',
    stageBadge: '🌿 Gentle Mobility',
    name: 'Shoulder Circles & Arm Reaches',
    animationId: 'stretch',
    durationSec: 50,
    seatedAlt: 'Can be done sitting or standing.',
    tip: 'Roll both shoulders up, back, and down in slow circular motions.',
    steps: [
      { title: 'Get ready', desc: 'Stand or sit with your arms resting at your sides.' },
      { title: 'Move', desc: 'Roll your shoulders up toward your ears, then back and down.' },
      { title: 'Reach', desc: 'Gently reach one arm up toward the ceiling and breathe in.' },
      { title: 'Return', desc: 'Lower arm down softly and repeat with the other side.' }
    ]
  },
  {
    id: 'bp_3',
    stage: 1,
    stageName: 'Stage 1 — Ease In',
    stageBadge: '🌿 Gentle Mobility',
    name: 'Side Body Reaches & Wrist Circles',
    animationId: 'stretch',
    durationSec: 50,
    seatedAlt: 'Sit tall and gently reach side-to-side.',
    tip: 'Feel a gentle, comfortable stretch along the side of your ribs.',
    steps: [
      { title: 'Get ready', desc: 'Stand or sit tall with feet shoulder-width apart.' },
      { title: 'Move', desc: 'Gently reach right arm overhead to the left side.' },
      { title: 'Hold', desc: 'Circle both wrists slowly to loosen fingers.' },
      { title: 'Return', desc: 'Return to center and switch sides.' }
    ]
  },

  // Stage 2: Wake Up (Very Easy Movement & Rhythm)
  {
    id: 'bp_4',
    stage: 2,
    stageName: 'Stage 2 — Wake Up',
    stageBadge: '🌱 Easy Rhythm',
    name: 'Easy March in Place',
    animationId: 'lunge',
    durationSec: 60,
    seatedAlt: 'Seated march: lift one knee at a time while seated.',
    tip: 'Keep it gentle — you do not need to lift your knees high.',
    steps: [
      { title: 'Get ready', desc: 'Stand tall with relaxed shoulders.' },
      { title: 'Move', desc: 'Gently lift one foot, then the other, in a soft walking rhythm.' },
      { title: 'Breathe', desc: 'Swing your arms naturally at your sides.' },
      { title: 'Return', desc: 'Slow down to a gentle stop when ready.' }
    ]
  },
  {
    id: 'bp_5',
    stage: 2,
    stageName: 'Stage 2 — Wake Up',
    stageBadge: '🌱 Easy Rhythm',
    name: 'Step Touches with Arm Swings',
    animationId: 'lunge',
    durationSec: 60,
    seatedAlt: 'Tap toes side-to-side while seated.',
    tip: 'Step side to side comfortably at your own easy pace.',
    steps: [
      { title: 'Get ready', desc: 'Stand with feet together and hands relaxed.' },
      { title: 'Move', desc: 'Step your right foot out to the side and tap your left foot next to it.' },
      { title: 'Repeat', desc: 'Step left foot out and tap right foot.' },
      { title: 'Return', desc: 'Keep a soft, rhythmic sway that feels good.' }
    ]
  },
  {
    id: 'bp_6',
    stage: 2,
    stageName: 'Stage 2 — Wake Up',
    stageBadge: '🌱 Easy Rhythm',
    name: 'Gentle Heel & Calf Raises',
    animationId: 'squat',
    durationSec: 50,
    seatedAlt: 'Lift heels while seated with feet flat on the floor.',
    tip: 'Hold a wall, counter, or chair back for balance.',
    steps: [
      { title: 'Get ready', desc: 'Stand tall with fingers lightly resting on a table or wall for balance.' },
      { title: 'Move', desc: 'Slowly rise up onto the balls of your feet.' },
      { title: 'Hold', desc: 'Pause at the top for 1 second.' },
      { title: 'Return', desc: 'Slowly lower your heels back to the floor.' }
    ]
  },

  // Stage 3: Get Moving (Comfortable Bodyweight & Light Cardio)
  {
    id: 'bp_7',
    stage: 3,
    stageName: 'Stage 3 — Get Moving',
    stageBadge: '✨ Gentle Strength',
    name: 'Comfortable Bodyweight Squats (or Chair Sits)',
    animationId: 'squat',
    durationSec: 60,
    seatedAlt: 'Chair Sits: gently sit down onto chair and stand back up.',
    tip: 'Only bend as deep as feels comfortable for your knees.',
    steps: [
      { title: 'Get ready', desc: 'Stand with feet shoulder-width apart.' },
      { title: 'Move', desc: 'Push hips back and bend knees slightly like sitting down.' },
      { title: 'Hold', desc: 'Keep chest upright for a brief moment.' },
      { title: 'Return', desc: 'Press through feet to stand back up.' }
    ]
  },
  {
    id: 'bp_8',
    stage: 3,
    stageName: 'Stage 3 — Get Moving',
    stageBadge: '✨ Gentle Strength',
    name: 'Low-Impact Side Steps with Reach',
    animationId: 'lunge',
    durationSec: 60,
    seatedAlt: 'Side step and reach while seated in a chair.',
    tip: 'A rhythmic full-body movement with zero jumping.',
    steps: [
      { title: 'Get ready', desc: 'Stand with soft knees and hands at chest.' },
      { title: 'Move', desc: 'Step out to the right and reach right hand upward.' },
      { title: 'Switch', desc: 'Step to the left and reach left hand upward.' },
      { title: 'Return', desc: 'Keep your breath smooth and natural.' }
    ]
  },

  // Stage 4: Optional Challenge (Light Progression)
  {
    id: 'bp_9',
    stage: 4,
    stageName: 'Stage 4 — Optional Challenge',
    stageBadge: '🌟 Optional Challenge',
    name: 'Light Wall / Incline Push-Up',
    animationId: 'pushup',
    durationSec: 50,
    seatedAlt: 'Press arms forward against air or light wall.',
    tip: 'Standing closer to the wall makes it easier and gentler.',
    steps: [
      { title: 'Get ready', desc: 'Place hands flat against a wall at shoulder height.' },
      { title: 'Move', desc: 'Gently tighten your tummy and bend elbows toward wall.' },
      { title: 'Hold', desc: 'Keep your body in a straight line.' },
      { title: 'Return', desc: 'Push firmly away from the wall to return to start.' }
    ]
  }
];

const GENTLE_PRAISES = [
  "Nice! Let's keep it easy.",
  "You did it! Ready for the next one?",
  "Great start! You're already moving 🌱",
  "Well done. Here's the next one.",
  "Looking good! Move at whatever pace feels kind.",
  "Awesome ease. One small step at a time."
];

export default function BeginnerPlanFlowModal({ isOpen, onClose }) {
  const { setActiveWorkoutMinutes, setStepCount, logMicroMovement } = useWellness();
  const { playChime } = useAudio();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [completedExerciseIds, setCompletedExerciseIds] = useState([]);
  const [isSlowMode, setIsSlowMode] = useState(false);
  const [showWrittenInstructions, setShowWrittenInstructions] = useState(false);
  const [gentlePraiseText, setGentlePraiseText] = useState('');
  const [isSessionSummaryOpen, setIsSessionSummaryOpen] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Track session timer
  useEffect(() => {
    let interval = null;
    if (isOpen && isTimerRunning && !isSessionSummaryOpen) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, isTimerRunning, isSessionSummaryOpen]);

  if (!isOpen) return null;

  const currentExercise = BEGINNER_PLAN_EXERCISES[currentIdx] || BEGINNER_PLAN_EXERCISES[0];
  const isLastExercise = currentIdx === BEGINNER_PLAN_EXERCISES.length - 1;

  // Pip mood gets progressively more active by stage
  const getPipMoodForStage = (stage) => {
    if (stage === 1) return 'calm';
    if (stage === 2) return 'happy';
    if (stage === 3) return 'playful';
    return 'celebrate';
  };

  // Continue to Next Exercise
  const handleContinue = () => {
    const currentId = currentExercise.id;
    const nextCompleted = completedExerciseIds.includes(currentId) 
      ? completedExerciseIds 
      : [...completedExerciseIds, currentId];
    setCompletedExerciseIds(nextCompleted);

    try { playChime(528); } catch(e) {}
    try { confetti({ particleCount: 20, spread: 40, origin: { y: 0.6 } }); } catch(e) {}

    // Random gentle praise
    const praise = GENTLE_PRAISES[Math.floor(Math.random() * GENTLE_PRAISES.length)];
    setGentlePraiseText(praise);

    if (isLastExercise) {
      setTimeout(() => {
        handleStopAndSave();
      }, 700);
    } else {
      setTimeout(() => {
        setCurrentIdx(prev => prev + 1);
        setGentlePraiseText('');
        setShowWrittenInstructions(false);
      }, 700);
    }
  };

  // Stop & Save (Valid at any point)
  const handleStopAndSave = () => {
    setIsTimerRunning(false);
    const totalMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
    const estimatedSteps = Math.round(totalMinutes * 40);

    // Update Wellness Context
    if (setActiveWorkoutMinutes) {
      setActiveWorkoutMinutes(prev => prev + totalMinutes);
    }
    if (setStepCount) {
      setStepCount(prev => prev + estimatedSteps);
    }
    if (logMicroMovement) {
      logMicroMovement(`Beginner Plan (${completedExerciseIds.length + 1} movements)`, 'completed');
    }

    try { playChime(660); } catch(e) {}
    try { confetti({ particleCount: 45, spread: 65, origin: { y: 0.6 } }); } catch(e) {}

    setIsSessionSummaryOpen(true);
  };

  // Stop Without Saving
  const handleStopWithoutSaving = () => {
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-sheet card-glass" 
        onClick={e => e.stopPropagation()} 
        style={{ 
          maxWidth: 580, 
          maxHeight: '92vh', 
          overflowY: 'auto',
          borderRadius: 'var(--radius-xl)',
          padding: '1.6rem 1.4rem',
          border: '1.5px solid var(--accent-primary)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          animation: 'scaleUp 0.2s ease-out'
        }}
      >
        {isSessionSummaryOpen ? (
          /* SUPPORTIVE SESSION SUMMARY (No failure states, no checklists) */
          <div style={{ textAlign: 'center', padding: '1.25rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', animation: 'fadeIn 0.3s ease-out' }}>
            <ContextualPip 
              context="move" 
              size={72} 
              mood="celebrate"
              message="Wonderful movement today! 🌱"
              showSpeechBubble={false}
            />

            <div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--accent-primary)', margin: '0 0 0.3rem 0' }}>
                Nice work 🌱
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 700, margin: 0 }}>
                You moved for {Math.max(1, Math.round(elapsedSeconds / 60))} minutes today.
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.35rem 0 0 0' }}>
                Every small movement enlivens your body and refreshes your mind.
              </p>
            </div>

            {/* Stats summary chip */}
            <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', width: '100%', maxWidth: 320 }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Activity Added to Move Hub</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '0.15rem' }}>
                +{Math.max(1, Math.round(elapsedSeconds / 60))} mins • +{Math.round(Math.max(1, Math.round(elapsedSeconds / 60)) * 40)} steps
              </div>
            </div>

            <button 
              onClick={onClose} 
              className="btn btn-primary" 
              style={{ width: '100%', maxWidth: 320, padding: '0.75rem', fontSize: '0.88rem', fontWeight: 800 }}
            >
              Done & Feeling Good ✨
            </button>
          </div>
        ) : (
          /* ONE EXERCISE AT A TIME VIEW */
          <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span className="pill-badge primary" style={{ fontSize: '0.72rem', padding: '2px 8px', fontWeight: 800 }}>
                  🌱 Beginner Plan
                </span>
                <span className="pill-badge gray" style={{ fontSize: '0.7rem' }}>
                  {currentExercise.stageBadge}
                </span>
              </div>

              <button 
                onClick={handleStopWithoutSaving} 
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
                title="Exit"
              >
                <X size={18} />
              </button>
            </div>

            {/* Exercise Title & Pip Companion */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {currentExercise.stageName}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.1rem 0', color: 'var(--text-primary)' }}>
                  {currentExercise.name}
                </h3>
              </div>

              <ContextualPip 
                context="move" 
                size={46} 
                mood={getPipMoodForStage(currentExercise.stage)}
                message="Keep it easy!"
                showSpeechBubble={false}
              />
            </div>

            {/* Primary Visual Animation Demonstration */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  ⏱️ Approx ~{currentExercise.durationSec}s easy movement
                </span>

                <button
                  type="button"
                  onClick={() => setIsSlowMode(!isSlowMode)}
                  className={`btn btn-sm ${isSlowMode ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.74rem', padding: '0.3rem 0.65rem', borderRadius: 'var(--radius-pill)', fontWeight: 700 }}
                  title="Slow down demonstration"
                >
                  <span>{isSlowMode ? '🐢 Slow Demo On' : '🐢 Slow Mode'}</span>
                </button>
              </div>

              <ExerciseMiniAnimation exerciseId={currentExercise.animationId} isSlowMode={isSlowMode} />

              {/* Seated Alternative & Tip */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.75rem' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 600, background: 'var(--bg-tertiary)', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  💡 <strong>Tip:</strong> {currentExercise.tip}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', paddingLeft: '0.25rem' }}>
                  🪑 <strong>Seated option:</strong> {currentExercise.seatedAlt}
                </div>
              </div>
            </div>

            {/* Optional Written Instructions (13-year-old level) */}
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
                  padding: '0.6rem 0.9rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <span>{showWrittenInstructions ? '📖 Hide Written Instructions' : '📖 Show Written Instructions'}</span>
                {showWrittenInstructions ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>

              {showWrittenInstructions && (
                <div style={{ marginTop: '0.45rem', background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.45rem', animation: 'fadeIn 0.2s ease-out' }}>
                  {currentExercise.steps.map((s, idx) => (
                    <div key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '0.45rem 0.7rem', borderRadius: 'var(--radius-sm)' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{idx + 1}. {s.title}:</strong> {s.desc}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Gentle Praise Notification on Advance */}
            {gentlePraiseText && (
              <div style={{ background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', padding: '0.5rem 0.8rem', borderRadius: 'var(--radius-md)', fontWeight: 800, fontSize: '0.84rem', textAlign: 'center', marginBottom: '0.85rem', animation: 'fadeIn 0.2s ease-out' }}>
                ✨ {gentlePraiseText}
              </div>
            )}

            {/* Primary Action: Continue (Auto-completes and smoothly advances) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <button
                type="button"
                onClick={handleContinue}
                className="btn btn-primary"
                style={{
                  padding: '0.8rem',
                  fontSize: '0.94rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 4px 14px rgba(46, 125, 90, 0.25)'
                }}
              >
                <span>{isLastExercise ? 'Finish & Save Routine 🎉' : 'Continue to Next Movement'}</span>
                <ArrowRight size={16} />
              </button>

              {/* Stop & Save vs Stop Without Saving (Valid at any point) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem' }}>
                <button
                  type="button"
                  onClick={handleStopAndSave}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.78rem', gap: '0.3rem', padding: '0.4rem 0.8rem' }}
                >
                  <Check size={13} /> Stop & Save Activity
                </button>

                <button
                  type="button"
                  onClick={handleStopWithoutSaving}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                    padding: '0.35rem'
                  }}
                >
                  Stop Without Saving
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
