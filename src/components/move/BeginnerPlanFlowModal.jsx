import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  ArrowRight, 
  Check, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  Heart, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import ExerciseMiniAnimation from './ExerciseMiniAnimations';
import { useWellness } from '../../context/WellnessContext';
import { useAudio } from '../../context/AudioContext';
import confetti from 'canvas-confetti';

const BEGINNER_PLAN_EXERCISES = [
  // Stage 1: Ease In (Gentle Stretching & Mobility)
  {
    id: 'bp_1',
    stage: 1,
    stageName: 'Stage 1 · Ease In',
    stageBadge: 'Gentle Mobility',
    name: 'Gentle Neck & Shoulder Release',
    animationId: 'stretch',
    durationSec: 45,
    equipment: 'None needed',
    whyThisHelps: 'Releases neck tension from sitting and promotes calm breathing.',
    seatedAlt: 'Sit tall in a supportive chair with feet flat.',
    tip: 'Drop shoulders down from ears and breathe slowly.',
    steps: [
      { title: 'Get ready', desc: 'Sit or stand tall with relaxed shoulders.' },
      { title: 'Move', desc: 'Gently tilt right ear toward right shoulder.' },
      { title: 'Hold & return', desc: 'Take 2 slow breaths, then switch to left side.' }
    ]
  },
  {
    id: 'bp_2',
    stage: 1,
    stageName: 'Stage 1 · Ease In',
    stageBadge: 'Gentle Mobility',
    name: 'Shoulder Circles & Arm Reaches',
    animationId: 'wrist',
    durationSec: 50,
    equipment: 'None needed',
    whyThisHelps: 'Restores upper-back mobility and eases shoulder stiffness.',
    seatedAlt: 'Can be done sitting or standing.',
    tip: 'Roll both shoulders up, back, and down in slow circular motions.',
    steps: [
      { title: 'Get ready', desc: 'Stand or sit with arms resting easily at sides.' },
      { title: 'Circle', desc: 'Roll shoulders up toward ears, then back and down.' },
      { title: 'Reach', desc: 'Gently reach one arm up, breathe in, and alternate sides.' }
    ]
  },
  {
    id: 'bp_3',
    stage: 1,
    stageName: 'Stage 1 · Ease In',
    stageBadge: 'Gentle Mobility',
    name: 'Side Body Reaches & Wrist Circles',
    animationId: 'wrist',
    durationSec: 50,
    equipment: 'None needed',
    whyThisHelps: 'Opens the ribcage and mobilizes tired wrist joints.',
    seatedAlt: 'Sit tall and gently reach side-to-side.',
    tip: 'Feel a gentle, comfortable stretch along the side ribs.',
    steps: [
      { title: 'Get ready', desc: 'Stand or sit tall with feet shoulder-width apart.' },
      { title: 'Reach', desc: 'Gently reach right arm overhead to the left.' },
      { title: 'Circle', desc: 'Rotate wrists softly and repeat on the opposite side.' }
    ]
  },

  // Stage 2: Wake Up (Very Easy Movement & Rhythm)
  {
    id: 'bp_4',
    stage: 2,
    stageName: 'Stage 2 · Wake Up',
    stageBadge: 'Easy Rhythm',
    name: 'Easy March in Place',
    animationId: 'squat',
    durationSec: 60,
    equipment: 'None needed',
    whyThisHelps: 'Gets blood flowing gently through legs without joint strain.',
    seatedAlt: 'Seated march: lift one knee at a time while seated.',
    tip: 'Keep it gentle — no need to lift your knees high.',
    steps: [
      { title: 'Get ready', desc: 'Stand tall with relaxed shoulders.' },
      { title: 'March', desc: 'Gently lift one foot, then the other, in a soft rhythm.' },
      { title: 'Breathe', desc: 'Swing arms naturally and stop whenever you like.' }
    ]
  },
  {
    id: 'bp_5',
    stage: 2,
    stageName: 'Stage 2 · Wake Up',
    stageBadge: 'Easy Rhythm',
    name: 'Gentle Ankle Rolls & Calf Pumps',
    animationId: 'ankle',
    durationSec: 50,
    equipment: 'None needed',
    whyThisHelps: 'Improves circulation in lower legs and relieves heavy feet.',
    seatedAlt: 'Lift heels while seated with feet flat.',
    tip: 'Hold a counter or chair back for balance.',
    steps: [
      { title: 'Get ready', desc: 'Stand tall with fingers lightly resting on a table.' },
      { title: 'Move', desc: 'Slowly rise up onto the balls of your feet.' },
      { title: 'Lower', desc: 'Pause 1 second, then slowly lower heels back down.' }
    ]
  },

  // Stage 3: Get Moving (Comfortable Bodyweight & Light Movement)
  {
    id: 'bp_6',
    stage: 3,
    stageName: 'Stage 3 · Get Moving',
    stageBadge: 'Gentle Strength',
    name: 'Comfortable Bodyweight Squats (or Chair Sits)',
    animationId: 'squat',
    durationSec: 60,
    equipment: 'Chair (optional)',
    whyThisHelps: 'Builds functional leg strength for daily activities.',
    seatedAlt: 'Chair Sits: gently sit down onto chair and stand back up.',
    tip: 'Only bend as deep as feels comfortable for your knees.',
    steps: [
      { title: 'Get ready', desc: 'Stand with feet shoulder-width apart.' },
      { title: 'Lower', desc: 'Push hips back and bend knees slightly like sitting.' },
      { title: 'Rise', desc: 'Press through feet to return to standing.' }
    ]
  },

  // Stage 4: Optional Progression
  {
    id: 'bp_7',
    stage: 4,
    stageName: 'Stage 4 · Progression',
    stageBadge: 'Optional Progression',
    name: 'Gentle Dance Flow & Shake Out',
    animationId: 'dance',
    durationSec: 50,
    equipment: 'None needed',
    whyThisHelps: 'Celebrates movement and shakes off stored body tension.',
    seatedAlt: 'Seated sway and arm rhythm.',
    tip: 'Move in whatever fun way makes your body feel alive!',
    steps: [
      { title: 'Get ready', desc: 'Stand relaxed with your favorite music.' },
      { title: 'Flow', desc: 'Sway hips, bounce knees softly, and wave arms.' },
      { title: 'Celebrate', desc: 'Take a deep breath and smile.' }
    ]
  }
];

export default function BeginnerPlanFlowModal({ isOpen, onClose }) {
  const { setActiveWorkoutMinutes, setStepCount, addWellnessEvent } = useWellness();
  const { playChime } = useAudio();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [completedIds, setCompletedIds] = useState([]);
  const [isSlowMode, setIsSlowMode] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [elapsedSecs, setElapsedSecs] = useState(0);

  useEffect(() => {
    let timer = null;
    if (isOpen && !isSummaryOpen) {
      timer = setInterval(() => setElapsedSecs(p => p + 1), 1000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [isOpen, isSummaryOpen]);

  if (!isOpen) return null;

  const currentEx = BEGINNER_PLAN_EXERCISES[currentIdx] || BEGINNER_PLAN_EXERCISES[0];
  const totalStages = 4;
  const currentStage = currentEx.stage;

  const handleNext = () => {
    const nextCompleted = [...new Set([...completedIds, currentEx.id])];
    setCompletedIds(nextCompleted);

    try { playChime(528); } catch (e) {}
    try { confetti({ particleCount: 25, spread: 50, origin: { y: 0.6 } }); } catch (e) {}

    if (currentIdx < BEGINNER_PLAN_EXERCISES.length - 1) {
      setCurrentIdx(p => p + 1);
      setShowSteps(false);
    } else {
      handleFinish();
    }
  };

  const handleSwap = () => {
    // Find next exercise in same or next stage
    setCurrentIdx(p => (p + 1) % BEGINNER_PLAN_EXERCISES.length);
  };

  const handleFinish = () => {
    const totalMinutes = Math.max(1, Math.round(elapsedSecs / 60));
    if (setActiveWorkoutMinutes) setActiveWorkoutMinutes(p => p + totalMinutes);
    if (setStepCount) setStepCount(p => p + Math.round(totalMinutes * 45));

    if (addWellnessEvent) {
      addWellnessEvent({
        type: 'activity',
        activityType: 'beginner_plan',
        durationMins: totalMinutes,
        intensity: 'light',
        timestamp: new Date().toISOString(),
        notes: `Completed Beginner Plan session (${completedIds.length + 1} movements)`
      });
    }

    try { playChime(660); } catch (e) {}
    try { confetti({ particleCount: 45, spread: 70, origin: { y: 0.6 } }); } catch (e) {}
    setIsSummaryOpen(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-sheet" 
        onClick={e => e.stopPropagation()} 
        style={{ 
          maxWidth: 480, 
          maxHeight: '90vh', 
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          animation: 'scaleUp 0.2s ease-out'
        }}
      >
        {/* Sticky Header */}
        <div 
          style={{
            padding: '1rem 1.25rem 0.75rem',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span className="pill-badge primary" style={{ fontSize: '0.72rem', fontWeight: 800 }}>
              🌱 Beginner Plan
            </span>
            <span className="pill-badge" style={{ fontSize: '0.68rem', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
              {currentEx.stageBadge}
            </span>
          </div>

          <button 
            type="button"
            onClick={onClose} 
            style={{ 
              background: 'var(--bg-tertiary)', 
              border: 'none', 
              borderRadius: '50%', 
              width: 32, 
              height: 32, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer', 
              color: 'var(--text-muted)' 
            }}
            aria-label="Close beginner plan"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div style={{ padding: '1rem 1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.9rem', flex: 1 }}>
          {isSummaryOpen ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '3rem' }}>🌱</div>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--accent-primary)', margin: '0 0 0.25rem 0' }}>
                  Nice work!
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
                  You moved gently for {Math.max(1, Math.round(elapsedSecs / 60))} minutes today.
                </p>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', width: '100%' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Logged to Move Hub</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: 2 }}>
                  +{Math.max(1, Math.round(elapsedSecs / 60))} mins • Hydration Linked 🌱
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="btn btn-primary"
                style={{ width: '100%', minHeight: 44, fontWeight: 800 }}
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Stage Eyebrow & Progress Dots */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {currentEx.stageName}
                </span>

                {/* 4 Stage dots */}
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {[1, 2, 3, 4].map(s => (
                    <span 
                      key={s}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: s <= currentStage ? 'var(--accent-primary)' : 'var(--border-subtle)',
                        transition: 'background 0.2s ease'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Title & Info */}
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>
                  {currentEx.name}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {currentEx.whyThisHelps}
                </p>
              </div>

              {/* Shared Pip Animation Rig Stage */}
              <div 
                style={{ 
                  background: 'var(--bg-secondary)', 
                  borderRadius: 'var(--radius-lg)', 
                  border: '1px solid var(--border-subtle)', 
                  padding: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <span className="pill-badge" style={{ fontSize: '0.68rem', background: 'var(--bg-tertiary)' }}>
                      ⏱️ ~{currentEx.durationSec}s
                    </span>
                    <span className="pill-badge" style={{ fontSize: '0.68rem', background: 'var(--bg-tertiary)' }}>
                      {currentEx.equipment}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSlowMode(!isSlowMode)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem', minHeight: 32 }}
                  >
                    <span>{isSlowMode ? '🐢 Slow On' : '🐢 Slow Demo'}</span>
                  </button>
                </div>

                {/* Animated Pip */}
                <ExerciseMiniAnimation exerciseId={currentEx.animationId} isSlowMode={isSlowMode} />

                {/* Quick Tip & Seated Option */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingTop: '0.35rem' }}>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)', background: 'var(--bg-tertiary)', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-sm)' }}>
                    💡 <strong>Tip:</strong> {currentEx.tip}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', paddingLeft: '0.2rem' }}>
                    🪑 <strong>Seated option:</strong> {currentEx.seatedAlt}
                  </div>
                </div>
              </div>

              {/* Expandable Step Breakdown */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowSteps(!showSteps)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.55rem 0.85rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <span>{showSteps ? 'Hide Step Instructions' : 'View Step-by-Step Instructions'}</span>
                  {showSteps ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {showSteps && (
                  <div style={{ marginTop: '0.4rem', background: 'var(--bg-tertiary)', padding: '0.65rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.35rem', animation: 'fadeIn 0.2s ease-out' }}>
                    {currentEx.steps.map((s, idx) => (
                      <div key={idx} style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{idx + 1}. {s.title}:</strong> {s.desc}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Sticky Bottom Action Bar */}
        {!isSummaryOpen && (
          <div 
            style={{
              padding: '0.85rem 1.25rem',
              borderTop: '1px solid var(--border-subtle)',
              background: 'var(--bg-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.65rem'
            }}
          >
            <button
              type="button"
              onClick={handleSwap}
              className="btn btn-secondary btn-sm"
              style={{ minHeight: 44, padding: '0.4rem 0.85rem', gap: '0.35rem', fontSize: '0.78rem' }}
            >
              <RefreshCw size={13} />
              <span>Swap Movement</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary"
              style={{
                flex: 1,
                minHeight: 44,
                fontSize: '0.88rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <span>{currentIdx === BEGINNER_PLAN_EXERCISES.length - 1 ? 'Finish & Save 🌱' : 'Continue'}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

