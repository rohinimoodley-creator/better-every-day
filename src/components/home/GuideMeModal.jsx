import React, { useState, useEffect, useRef } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { useAudio } from '../../context/AudioContext';
import PipSproutAvatar from '../mascot/PipSproutAvatar';
import MascotWardrobeModal from '../mascot/MascotWardrobeModal';
import {
  X,
  CheckCircle,
  RotateCcw,
  Play,
  Pause,
  Droplet,
  Wind,
  Footprints,
  Utensils,
  Moon,
  Sparkles,
  Compass,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Comprehensive Category-Specific Exercises Data
const CATEGORY_ACTIVITIES = [
  {
    id: 'hydrate',
    categoryName: 'Hydrate',
    icon: Droplet,
    color: '#3a86c8',
    options: [
      {
        id: 'water_250',
        title: 'Sip a Gentle Glass of Water',
        desc: 'Hydration clears brain fog and supports cellular recovery. Take 3 mindful sips right now.',
        volumeMl: 250,
        tip: 'Best practice: Drink room temperature water with slow, relaxed breaths.'
      },
      {
        id: 'water_500',
        title: 'Hydration Catch-Up (Full Bottle)',
        desc: 'Refill your water glass or bottle and hydrate deeply to replenish energy.',
        volumeMl: 500,
        tip: 'Staying hydrated boosts cognitive stamina by up to 14%.'
      },
      {
        id: 'tea_300',
        title: 'Warm Calming Herbal Infusion',
        desc: 'Sip a warm cup of chamomile, peppermint, or green tea to nourish and soothe.',
        volumeMl: 300,
        tip: 'Warm fluids promote gentle digestion and calm the vagus nerve.'
      },
      {
        id: 'citrus_400',
        title: 'Citrus & Electrolyte Boost',
        desc: 'Water with a squeeze of lemon and a tiny pinch of sea salt for natural cellular hydration.',
        volumeMl: 400,
        tip: 'Natural electrolytes enhance mineral absorption and cellular hydration.'
      }
    ]
  },
  {
    id: 'breathwork',
    categoryName: 'Breathwork',
    icon: Wind,
    color: '#40916c',
    options: [
      {
        id: 'box_breath',
        title: '4-4-4-4 Box Breathing (Focus & Reset)',
        desc: 'Equal-cadence breathing used by athletes to instantly balance cortisol and sharpen clarity.',
        pattern: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
        totalCycles: 3
      },
      {
        id: '478_calm',
        title: '4-7-8 Deep Calm (Nervous System Soother)',
        desc: 'Extended exhalation rapidly engages the parasympathetic rest-and-digest response.',
        pattern: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
        totalCycles: 3
      },
      {
        id: 'heart_resonance',
        title: '4-6 Heart Resonance (Ease & Flow)',
        desc: 'Gentle rhythm optimizing heart rate variability (HRV) and emotional coherence.',
        pattern: { inhale: 4, hold1: 0, exhale: 6, hold2: 0 },
        totalCycles: 4
      },
      {
        id: 'physio_sigh',
        title: 'Physiological Sigh (Instant Stress Release)',
        desc: 'Double inhalation followed by a long, slow sigh to reinflate alveoli and release carbon dioxide.',
        pattern: { inhale: 3, hold1: 1, exhale: 6, hold2: 0 },
        totalCycles: 3
      }
    ]
  },
  {
    id: 'move',
    categoryName: 'Move',
    icon: Footprints,
    color: '#2d6a4f',
    options: [
      {
        id: 'spine_flow',
        title: '5-Minute Spine Awakening',
        desc: 'Gentle standing spinal twists, shoulder rolls, and side-body stretches to counter stiffness.',
        durationSec: 180,
        minsToAdd: 5,
        stepsToAdd: 120
      },
      {
        id: 'neck_relief',
        title: '3-Minute Neck & Posture Decompression',
        desc: 'Chin tucks, side neck tilts, and shoulder blade pinches to relieve screen posture tension.',
        durationSec: 120,
        minsToAdd: 3,
        stepsToAdd: 60
      },
      {
        id: 'wrist_release',
        title: '2-Minute Desk Wrist & Arm Relief',
        desc: 'Wrist rotations, finger extensions, and forearm flexes to prevent repetitive strain.',
        durationSec: 90,
        minsToAdd: 2,
        stepsToAdd: 40
      },
      {
        id: 'shakeout',
        title: '60-Step Energy Shakeout',
        desc: 'Light bouncy steps in place, gentle arm shaking, and taking 5 deep belly breaths.',
        durationSec: 60,
        minsToAdd: 2,
        stepsToAdd: 80
      }
    ]
  },
  {
    id: 'mind',
    categoryName: 'Mind',
    icon: Sparkles,
    color: '#8b5cf6',
    options: [
      {
        id: 'grateful_moment',
        title: 'Notice 1 Grateful Moment',
        desc: 'Think of one small comfort, kind word, or cozy warmth you experienced today.',
        chips: ['Warm mug of tea', 'Soft morning light', 'A kind message', 'Progress on my tasks', 'Quiet moment alone']
      },
      {
        id: 'self_compassion',
        title: 'Self-Compassion Check-In',
        desc: 'Acknowledge one thing you showed up for or handled with patience recently.',
        chips: ['Showed up despite fatigue', 'Listened to my body', 'Kept trying', 'Spoke kindly to myself', 'Took a healthy pause']
      },
      {
        id: 'sensory_grounding',
        title: '5-4-3-2-1 Sensory Grounding',
        desc: 'Notice 3 soothing colors, 2 textures under your hands, and 1 gentle sound.',
        chips: ['Cool fresh air', 'Smooth wooden desk', 'Gentle bird songs', 'Green leafy plants', 'Soft comfortable clothing']
      },
      {
        id: 'anchor_word',
        title: 'Daily Anchor Word',
        desc: 'Choose one gentle word to anchor your thoughts and calm your pace today.',
        chips: ['Peace', 'Grounded', 'Steady', 'Patience', 'Lightness', 'Ease']
      }
    ]
  },
  {
    id: 'nourish',
    categoryName: 'Nourish',
    icon: Utensils,
    color: '#d97736',
    options: [
      {
        id: 'water_pause',
        title: 'Mindful Water-First Pause',
        desc: 'Drink half a glass of water before deciding what snack your body needs next.',
        tip: 'Often mild dehydration presents as a sudden appetite for salty or sugary foods.'
      },
      {
        id: 'plant_addition',
        title: 'Add 1 Colorful Plant to Your Next Plate',
        desc: 'Think of one vibrant plant (berries, leafy greens, avocado, nuts) to add to your next meal.',
        tip: 'Eating 30+ plant varieties weekly supports optimal gut microbiome diversity.'
      },
      {
        id: 'three_bite_pace',
        title: 'Distraction-Free 3-Bite Pause',
        desc: 'Commit to savoring your first 3 bites of your next meal with full mindfulness and no screens.',
        tip: 'Mindful eating improves cephalic-phase digestion and enhances satiety signals.'
      },
      {
        id: 'herbal_warmth',
        title: 'Herbal Digestif Ritual',
        desc: 'Prepare a warm peppermint or ginger infusion to support digestive comfort.',
        tip: 'Ginger and peppermint relax intestinal smooth muscle and reduce bloat.'
      }
    ]
  },
  {
    id: 'rest',
    categoryName: 'Rest',
    icon: Moon,
    color: '#7b61ff',
    options: [
      {
        id: 'eye_palming',
        title: '60-Second Eye Rest & Warm Palms',
        desc: 'Rub your hands together until warm, then cup them gently over closed eyes to relax optic nerves.',
        durationSec: 60,
        tip: 'Complete darkness allows photoreceptor cells in the retina to regenerate rhodopsin.'
      },
      {
        id: 'shoulder_drop',
        title: 'Shoulder Drop Tension Release',
        desc: 'Inhale deeply as you lift shoulders to ears, then exhale with an audible sigh and let them drop.',
        durationSec: 45,
        tip: 'Releases the trapezius muscles where psychological tension accumulates.'
      },
      {
        id: 'screen_break',
        title: '2-Minute Distance Visual Break',
        desc: 'Look at an object at least 20 feet away (out a window) to relax the ciliary eye muscles.',
        durationSec: 60,
        tip: 'The 20-20-20 rule prevents digital eye strain and headache onset.'
      },
      {
        id: 'body_scan_sigh',
        title: 'Nervous System Softening Sigh',
        desc: 'Take 3 slow belly breaths, softening your jaw, unclasping your teeth, and releasing your brow.',
        durationSec: 60,
        tip: 'Unclenching the jaw immediately signals physical safety to the autonomic nervous system.'
      }
    ]
  }
];

export default function GuideMeModal({ isOpen, onClose, onNavigateTab }) {
  const {
    incrementHydration,
    setActiveWorkoutMinutes,
    setStepCount,
    addJournalEntry
  } = useWellness();

  const { playChime } = useAudio();

  // Navigation State inside modal
  const [categoryIdx, setCategoryIdx] = useState(0);
  const [exerciseIdxMap, setExerciseIdxMap] = useState({});
  const [completionState, setCompletionState] = useState({ isCompleting: false, message: '' });

  // Hydration local state
  const [selectedMl, setSelectedMl] = useState(250);

  // Breathwork local timer/pacer state
  const [breathActive, setBreathActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState('inhale'); // 'inhale' | 'hold1' | 'exhale' | 'hold2'
  const [breathPhaseSec, setBreathPhaseSec] = useState(4);
  const [breathCycleCount, setBreathCycleCount] = useState(1);

  // Movement timer state
  const [moveTimerActive, setMoveTimerActive] = useState(false);
  const [moveTimerSec, setMoveTimerSec] = useState(180);

  // Mind reflection local state
  const [reflectionText, setReflectionText] = useState('');

  // Rest timer local state
  const [restTimerActive, setRestTimerActive] = useState(false);
  const [restTimerSec, setRestTimerSec] = useState(60);

  // Wardrobe customization modal state
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);

  const breathIntervalRef = useRef(null);
  const moveIntervalRef = useRef(null);
  const restIntervalRef = useRef(null);

  const currentCategory = CATEGORY_ACTIVITIES[categoryIdx % CATEGORY_ACTIVITIES.length];
  const currentOptionIdx = (exerciseIdxMap[currentCategory.id] || 0) % currentCategory.options.length;
  const currentExercise = currentCategory.options[currentOptionIdx];

  // Cycle to next exercise in the same category
  const handleTryAnotherExercise = () => {
    setExerciseIdxMap(prev => ({
      ...prev,
      [currentCategory.id]: (prev[currentCategory.id] || 0) + 1
    }));
    // Reset any ongoing timers
    resetCategoryTimers();
  };

  const resetCategoryTimers = () => {
    setBreathActive(false);
    setBreathPhase('inhale');
    setBreathPhaseSec(4);
    setBreathCycleCount(1);
    setMoveTimerActive(false);
    setRestTimerActive(false);
    setReflectionText('');
  };

  // Breathwork Pacer Effect
  useEffect(() => {
    if (!breathActive || currentCategory.id !== 'breathwork') {
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
      return;
    }

    const pattern = currentExercise.pattern || { inhale: 4, hold1: 4, exhale: 4, hold2: 4 };

    breathIntervalRef.current = setInterval(() => {
      setBreathPhaseSec(prev => {
        if (prev > 1) return prev - 1;

        // Advance to next phase
        if (breathPhase === 'inhale') {
          if (pattern.hold1 > 0) {
            setBreathPhase('hold1');
            return pattern.hold1;
          } else {
            setBreathPhase('exhale');
            return pattern.exhale;
          }
        } else if (breathPhase === 'hold1') {
          setBreathPhase('exhale');
          return pattern.exhale;
        } else if (breathPhase === 'exhale') {
          if (pattern.hold2 > 0) {
            setBreathPhase('hold2');
            return pattern.hold2;
          } else {
            // Cycle finished
            advanceBreathCycle(pattern);
            return pattern.inhale;
          }
        } else if (breathPhase === 'hold2') {
          advanceBreathCycle(pattern);
          return pattern.inhale;
        }
        return 4;
      });
    }, 1000);

    return () => {
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
    };
  }, [breathActive, breathPhase, currentExercise, currentCategory.id]);

  const advanceBreathCycle = (pattern) => {
    setBreathCycleCount(prev => {
      const next = prev + 1;
      if (next > (currentExercise.totalCycles || 3)) {
        setBreathActive(false);
        try { playChime(528); } catch(e) {}
        try { confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } }); } catch(e) {}
        return 1;
      }
      return next;
    });
    setBreathPhase('inhale');
  };

  // Movement Timer Effect
  useEffect(() => {
    if (!moveTimerActive || currentCategory.id !== 'move') {
      if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
      return;
    }

    moveIntervalRef.current = setInterval(() => {
      setMoveTimerSec(prev => {
        if (prev > 1) return prev - 1;
        setMoveTimerActive(false);
        try { playChime(528); } catch(e) {}
        try { confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } }); } catch(e) {}
        return 0;
      });
    }, 1000);

    return () => {
      if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
    };
  }, [moveTimerActive, currentCategory.id]);

  // Rest Timer Effect
  useEffect(() => {
    if (!restTimerActive || currentCategory.id !== 'rest') {
      if (restIntervalRef.current) clearInterval(restIntervalRef.current);
      return;
    }

    restIntervalRef.current = setInterval(() => {
      setRestTimerSec(prev => {
        if (prev > 1) return prev - 1;
        setRestTimerActive(false);
        try { playChime(528); } catch(e) {}
        try { confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } }); } catch(e) {}
        return 0;
      });
    }, 1000);

    return () => {
      if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    };
  }, [restTimerActive, currentCategory.id]);

  // COMPLETE & AUTO-UPDATE RELEVANT HUB
  const handleCompleteAndNext = () => {
    let successMessage = '';

    if (currentCategory.id === 'hydrate') {
      const ml = currentExercise.volumeMl || selectedMl;
      incrementHydration(ml);
      successMessage = `💧 Logged +${ml}ml into Hydrate Hub!`;
    } else if (currentCategory.id === 'breathwork') {
      successMessage = `🌬️ Completed ${currentExercise.title}! Updated Breathwork stats.`;
    } else if (currentCategory.id === 'move') {
      const mins = currentExercise.minsToAdd || 3;
      const steps = currentExercise.stepsToAdd || 80;
      setActiveWorkoutMinutes(prev => prev + mins);
      setStepCount(prev => prev + steps);
      successMessage = `🏃 Added +${mins}m movement & +${steps} steps to Move Hub!`;
    } else if (currentCategory.id === 'mind') {
      const note = reflectionText || currentExercise.chips?.[0] || 'A peaceful moment of gratitude.';
      addJournalEntry({
        id: `guide_mind_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'gratitude',
        text: `Guided Reflection: ${currentExercise.title} — "${note}"`,
        mood: 'calm',
        tags: ['Guided Moment', 'Mindfulness', 'Pip Companion']
      });
      successMessage = `🙏 Saved reflection to Mind & Journal Hub!`;
    } else if (currentCategory.id === 'nourish') {
      successMessage = `🥗 Logged mindful nourishment practice to Nourish Hub!`;
    } else if (currentCategory.id === 'rest') {
      successMessage = `🌙 Restored nervous system balance in Rest Hub!`;
    }

    try { playChime(660); } catch(e) {}
    try { confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } }); } catch (e) {}

    setCompletionState({ isCompleting: true, message: successMessage });

    // Smoothly transition to next micro-activity
    setTimeout(() => {
      setCategoryIdx(prev => prev + 1);
      setCompletionState({ isCompleting: false, message: '' });
      resetCategoryTimers();
    }, 1100);
  };

  // SKIP TO NEXT MICRO-ACTIVITY
  const handleSkip = () => {
    resetCategoryTimers();
    setCategoryIdx(prev => prev + 1);
  };

  const handleOpenFullView = () => {
    onClose();
    if (onNavigateTab) {
      onNavigateTab('WELLNESS', { category: currentCategory.id });
    }
  };

  const formatSeconds = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-sheet card-glass" 
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 560,
          textAlign: 'center',
          padding: '1.85rem 1.75rem',
          background: 'radial-gradient(circle at top, var(--bg-glass-card) 0%, var(--bg-primary) 100%)',
          border: '1.5px solid var(--accent-primary)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
          position: 'relative'
        }}
      >
        {/* Header with Step indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span className="pill-badge primary" style={{ fontSize: '0.74rem', padding: '0.25rem 0.65rem', fontWeight: 800 }}>
              🌱 GUIDED BY PIP • ONE THING AT A TIME
            </span>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.2rem' }}
            title="Close"
          >
            <X size={20} />
          </button>
        </div>



        {/* Pip The Sprout Mascot Header */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <PipSproutAvatar 
            size={66} 
            mood={completionState.isCompleting ? 'celebrate' : 'happy'} 
            onClick={() => setIsWardrobeOpen(true)} 
          />
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Step { (categoryIdx % CATEGORY_ACTIVITIES.length) + 1 } of { CATEGORY_ACTIVITIES.length }
              </span>
              <span className="pill-badge" style={{ fontSize: '0.65rem', background: currentCategory.color, color: '#ffffff' }}>
                {currentCategory.categoryName}
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.1rem 0', color: 'var(--text-primary)' }}>
              {currentExercise.title}
            </h3>
          </div>
        </div>

        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
          {currentExercise.desc}
        </p>

        {/* ============================================================ */}
        {/* IN-PLACE INTERACTIVE WIDGET PER CATEGORY                      */}
        {/* ============================================================ */}

        <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-glass)', marginBottom: '1.25rem' }}>
          
          {/* 1. HYDRATE IN-PLACE WIDGET */}
          {currentCategory.id === 'hydrate' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div 
                  style={{
                    width: 56,
                    height: 72,
                    borderRadius: '0 0 16px 16px',
                    border: '3px solid #3a86c8',
                    borderTop: 'none',
                    background: 'rgba(58, 134, 200, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'flex-end'
                  }}
                >
                  <div 
                    style={{
                      width: '100%',
                      height: '70%',
                      background: 'linear-gradient(to top, #3a86c8, #60a5fa)',
                      borderRadius: '0 0 12px 12px',
                      transition: 'height 0.4s ease'
                    }}
                  />
                  <div style={{ position: 'absolute', top: 4, left: 0, right: 0, fontSize: '0.65rem', fontWeight: 800, color: '#3a86c8', textAlign: 'center' }}>
                    {currentExercise.volumeMl}ml
                  </div>
                </div>

                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    +{currentExercise.volumeMl}ml mindful drink
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    {currentExercise.tip}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. BREATHWORK IN-PLACE WIDGET */}
          {currentCategory.id === 'breathwork' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Expanding Breathing Bubble */}
              <div 
                style={{
                  width: breathPhase === 'inhale' || breathPhase === 'hold1' ? 140 : 90,
                  height: breathPhase === 'inhale' || breathPhase === 'hold1' ? 140 : 90,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(64, 145, 108, 0.35) 0%, rgba(64, 145, 108, 0.85) 100%)',
                  boxShadow: '0 0 25px rgba(64, 145, 108, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  transition: `all ${breathPhaseSec}s cubic-bezier(0.4, 0, 0.2, 1)`,
                  margin: '0.5rem auto'
                }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {breathPhase === 'inhale' ? 'Inhale 🌬️' : breathPhase === 'hold1' ? 'Hold 🫧' : breathPhase === 'exhale' ? 'Exhale 🌊' : 'Hold Softly 🌿'}
                </span>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1, marginTop: '0.2rem' }}>
                  {breathPhaseSec}s
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.85rem' }}>
                <button
                  onClick={() => setBreathActive(!breathActive)}
                  className={`btn ${breathActive ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                  style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', gap: '0.35rem' }}
                >
                  {breathActive ? <Pause size={14} /> : <Play size={14} />}
                  <span>{breathActive ? 'Pause Breath' : 'Start Pacer'}</span>
                </button>

                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                  Cycle {breathCycleCount} of {currentExercise.totalCycles || 3}
                </span>
              </div>
            </div>
          )}

          {/* 3. MOVE IN-PLACE WIDGET */}
          {currentCategory.id === 'move' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Timer</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    {formatSeconds(moveTimerSec)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Stats</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    +{currentExercise.minsToAdd}m • +{currentExercise.stepsToAdd} steps
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => setMoveTimerActive(!moveTimerActive)}
                  className={`btn ${moveTimerActive ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                  style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', gap: '0.35rem' }}
                >
                  {moveTimerActive ? <Pause size={14} /> : <Play size={14} />}
                  <span>{moveTimerActive ? 'Pause Stretch' : 'Start Movement Timer'}</span>
                </button>
                <button
                  onClick={() => { setMoveTimerActive(false); setMoveTimerSec(currentExercise.durationSec || 180); }}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.45rem 0.75rem' }}
                  title="Reset"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          )}

          {/* 4. MIND & GRATITUDE IN-PLACE WIDGET */}
          {currentCategory.id === 'mind' && (
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center', marginBottom: '0.75rem' }}>
                {(currentExercise.chips || []).map((chip, i) => (
                  <button
                    key={i}
                    onClick={() => setReflectionText(chip)}
                    style={{
                      padding: '0.3rem 0.65rem',
                      borderRadius: 'var(--radius-pill)',
                      border: reflectionText === chip ? '1.5px solid #8b5cf6' : '1px solid var(--border-subtle)',
                      background: reflectionText === chip ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-tertiary)',
                      color: reflectionText === chip ? '#8b5cf6' : 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    ✨ {chip}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={reflectionText}
                onChange={e => setReflectionText(e.target.value)}
                placeholder="Or type your own mindful reflection here..."
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-glass)',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.84rem'
                }}
              />
            </div>
          )}

          {/* 5. NOURISH IN-PLACE WIDGET */}
          {currentCategory.id === 'nourish' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textAlign: 'left' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(217, 119, 54, 0.15)', color: '#d97736', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                🥗
              </div>
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Mindful Nutrition Insight
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                  {currentExercise.tip}
                </div>
              </div>
            </div>
          )}

          {/* 6. REST IN-PLACE WIDGET */}
          {currentCategory.id === 'rest' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.25rem', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#7b61ff' }}>
                  {formatSeconds(restTimerSec)}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Guided Relax Timer
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                    {currentExercise.tip}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => setRestTimerActive(!restTimerActive)}
                  className={`btn ${restTimerActive ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                  style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', gap: '0.35rem' }}
                >
                  {restTimerActive ? <Pause size={14} /> : <Play size={14} />}
                  <span>{restTimerActive ? 'Pause Rest' : 'Start 60s Rest'}</span>
                </button>
                <button
                  onClick={() => { setRestTimerActive(false); setRestTimerSec(currentExercise.durationSec || 60); }}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.45rem 0.75rem' }}
                  title="Reset"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Completion Toast Notification */}
        {completionState.isCompleting && (
          <div 
            style={{
              padding: '0.65rem 1rem',
              background: 'var(--accent-primary-light)',
              border: '1.5px solid var(--accent-primary)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--accent-primary)',
              fontWeight: 800,
              fontSize: '0.86rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              animation: 'fadeIn 0.2s ease'
            }}
          >
            <CheckCircle size={17} />
            <span>{completionState.message}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* PRIMARY ACTIONS: COMPLETE & NEXT, TRY ANOTHER, SKIP          */}
        {/* ============================================================ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          
          {/* 1. Complete & Auto-Update to Relevant Hub */}
          <button
            onClick={handleCompleteAndNext}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.8rem 1.25rem',
              fontSize: '0.92rem',
              fontWeight: 800,
              gap: '0.45rem',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(45, 106, 79, 0.3)'
            }}
          >
            <CheckCircle size={18} />
            <span>Complete & Move to Next Micro-Activity</span>
          </button>

          {/* 2. Try Another Exercise in this same Category */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleTryAnotherExercise}
              className="btn btn-secondary"
              style={{
                flex: 1,
                padding: '0.65rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                gap: '0.35rem',
                justifyContent: 'center'
              }}
              title="Switch to another exercise in this category"
            >
              <RefreshCw size={14} color="var(--accent-primary)" />
              <span>Try Another {currentCategory.categoryName} Exercise ({currentOptionIdx + 1}/{currentCategory.options.length})</span>
            </button>

            {/* 3. Skip to Next Activity */}
            <button
              onClick={handleSkip}
              className="btn btn-secondary"
              style={{
                padding: '0.65rem 1rem',
                fontSize: '0.82rem',
                justifyContent: 'center',
                color: 'var(--text-muted)'
              }}
            >
              Skip
            </button>
          </div>

        </div>

        {/* Footer Link: Full View */}
        <div style={{ marginTop: '1.4rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={handleOpenFullView}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              margin: '0 auto'
            }}
          >
            <Compass size={14} color="var(--accent-primary)" />
            <span>I prefer the full view (Open {currentCategory.categoryName} in Wellness Hub)</span>
          </button>
        </div>

      </div>

      {isWardrobeOpen && (
        <MascotWardrobeModal onClose={() => setIsWardrobeOpen(false)} />
      )}
    </div>
  );
}
