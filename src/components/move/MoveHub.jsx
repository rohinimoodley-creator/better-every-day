import React, { useState } from 'react';
import { WORKOUTS_DATABASE } from '../../data/mockData';
import { useWellness } from '../../context/WellnessContext';
import MicroMovementSection from './MicroMovementSection';
import PetPlayFlowModal from './PetPlayFlowModal';
import WorkoutPlayer from './WorkoutPlayer';
import CustomWorkoutModal from './CustomWorkoutModal';
import PhotoActivityModal from './PhotoActivityModal';
import ExerciseBreakdownModal from './ExerciseBreakdownModal';
import BeginnerPlanFlowModal from './BeginnerPlanFlowModal';
import ExercisePlansSection from './ExercisePlansSection';
import ActivityTracker from './ActivityTracker';
import ContextualPip from '../mascot/ContextualPip';
import { 
  Zap, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Compass, 
  Activity,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function MoveHub() {
  const { completedWorkouts, setCompletedWorkouts } = useWellness();

  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isBreakItDownOpen, setIsBreakItDownOpen] = useState(false);
  const [isPetPlayModalOpen, setIsPetPlayModalOpen] = useState(false);
  const [isBeginnerPlanModalOpen, setIsBeginnerPlanModalOpen] = useState(false);
  const [isExploreMoreOpen, setIsExploreMoreOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  const handleWorkoutComplete = (workoutId) => {
    if (!completedWorkouts.includes(workoutId)) {
      setCompletedWorkouts(prev => [...prev, workoutId]);
    }
  };

  const handleSaveCustom = (newWorkout) => {
    // Custom workout added
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.4rem', paddingBottom: '3.5rem' }}>
      
      {/* 1. Header with Calm Contextual Pip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <span className="pill-badge primary" style={{ fontSize: '0.72rem' }}>
              <Zap size={12} /> Movement & Pacing
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>
            MOVE 🏃
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Listen to your body, celebrate gentle consistency, and move freely.
          </p>
        </div>

        <ContextualPip
          context="move"
          size={58}
          mood="calm"
          message="One gentle step at a time 🌱"
          showSpeechBubble={false}
        />
      </div>

      {/* ========================================================================= */}
      {/* PRIMARY MOVE HUB OPTIONS (Calm, 3 Immediately Accessible Choices)         */}
      {/* 1. 🧍 Micro-Movement                                                      */}
      {/* 2. 🧩 Break It Down                                                       */}
      {/* 3. 🐾 Pet Play                                                            */}
      {/* ========================================================================= */}

      {/* 1. Micro-Movement 🧍 */}
      <MicroMovementSection />

      {/* Primary 2-Column Cards for Break It Down & Pet Play */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        
        {/* 2. Break It Down 🧩 */}
        <div 
          className="card-glass card-interactive"
          onClick={() => setIsBreakItDownOpen(true)}
          style={{
            padding: '1.35rem',
            border: '1.5px solid var(--accent-primary)',
            background: 'radial-gradient(circle at top left, var(--accent-primary-light) 0%, var(--bg-glass-card) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1rem',
            cursor: 'pointer'
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsBreakItDownOpen(true); } }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--accent-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                🧩
              </div>
              <span className="pill-badge primary" style={{ fontSize: '0.68rem', fontWeight: 800 }}>
                WATCH & UNDERSTAND
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0.2rem 0 0.35rem 0', color: 'var(--text-primary)' }}>
              Break It Down
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
              Learn movements visually with animated demonstrations, slow mode, and simple tips.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.45rem', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Squats, Push-Ups, Lunges & Stretches
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-primary)', fontWeight: 800, fontSize: '0.82rem' }}>
              <span>Try Movement</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>

        {/* 3. Pet Play 🐾 */}
        <div 
          className="card-glass card-interactive"
          onClick={() => setIsPetPlayModalOpen(true)}
          style={{
            padding: '1.35rem',
            border: '1.5px solid var(--accent-primary)',
            background: 'radial-gradient(circle at top left, var(--accent-primary-light) 0%, var(--bg-glass-card) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1rem',
            cursor: 'pointer'
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsPetPlayModalOpen(true); } }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--accent-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                🐾
              </div>
              <span className="pill-badge primary" style={{ fontSize: '0.68rem', fontWeight: 800 }}>
                PLAY TOGETHER
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0.2rem 0 0.35rem 0', color: 'var(--text-primary)' }}>
              Pet Play
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
              Active play, walks, runs, and meaningful movement time spent with your pet companion.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.45rem', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              All pets welcome • No tracking pressure
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-primary)', fontWeight: 800, fontSize: '0.82rem' }}>
              <span>Open Pet Play</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* PROGRESSIVE DISCLOSURE: EXPLORE MORE MOVEMENT                              */}
      {/* Reveals: 🌱 Beginner Plan | My Exercises | Exercise Plans | Favourite Plans */}
      {/* ========================================================================= */}
      <div className="card-glass" style={{ padding: '1.25rem' }}>
        <div 
          onClick={() => setIsExploreMoreOpen(!isExploreMoreOpen)}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            userSelect: 'none',
            gap: '0.75rem',
            flexWrap: 'wrap'
          }}
          role="button"
          aria-expanded={isExploreMoreOpen}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsExploreMoreOpen(!isExploreMoreOpen); } }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div 
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                background: isExploreMoreOpen ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: isExploreMoreOpen ? '#ffffff' : 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem'
              }}
            >
              <Compass size={18} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.02rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Explore More Movement
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.15rem 0 0 0' }}>
                {isExploreMoreOpen 
                  ? 'Showing Beginner Plan, My Exercises, Exercise Plans, and Favourites' 
                  : 'Beginner Plan 🌱, My Exercises, Community Plans & Favourites'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              className={`btn ${isExploreMoreOpen ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              style={{ fontSize: '0.8rem', gap: '0.35rem', padding: '0.35rem 0.8rem' }}
              onClick={(e) => { e.stopPropagation(); setIsExploreMoreOpen(!isExploreMoreOpen); }}
            >
              <span>{isExploreMoreOpen ? 'Hide' : 'Explore More'}</span>
              {isExploreMoreOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        {/* Revealed Content */}
        {isExploreMoreOpen && (
          <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', animation: 'fadeIn 0.2s ease-out' }}>
            <ExercisePlansSection
              onStartBeginnerPlan={() => setIsBeginnerPlanModalOpen(true)}
              onStartWorkout={(workout) => setSelectedWorkout(workout)}
              onOpenCustomModal={() => setIsCustomModalOpen(true)}
              onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
            />
          </div>
        )}
      </div>

      {/* Optional Live Activity & Step Tracker (Progressive Disclosure) */}
      <div className="card-glass" style={{ padding: '1.1rem' }}>
        <div 
          onClick={() => setIsTrackerOpen(!isTrackerOpen)}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            userSelect: 'none'
          }}
          role="button"
          aria-expanded={isTrackerOpen}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={17} color="var(--accent-primary)" />
            <div>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Activity & Step Tracker
              </h4>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {isTrackerOpen ? 'Hide timer and session trackers' : 'Open live timer, step logger, and session pacer'}
              </span>
            </div>
          </div>

          <div style={{ color: 'var(--text-muted)' }}>
            {isTrackerOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>

        {isTrackerOpen && (
          <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', animation: 'fadeIn 0.2s ease-out' }}>
            <ActivityTracker />
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* ALL MODALS & INTERACTIVE FLOWS                                            */}
      {/* ========================================================================= */}

      {/* 🌱 Beginner Plan Progressive Modal */}
      {isBeginnerPlanModalOpen && (
        <BeginnerPlanFlowModal
          isOpen={isBeginnerPlanModalOpen}
          onClose={() => setIsBeginnerPlanModalOpen(false)}
        />
      )}

      {/* 🧩 Break It Down Exercise Breakdown Modal */}
      {isBreakItDownOpen && (
        <ExerciseBreakdownModal
          isOpen={isBreakItDownOpen}
          onClose={() => setIsBreakItDownOpen(false)}
        />
      )}

      {/* 🐾 Pet Play Flow Modal */}
      {isPetPlayModalOpen && (
        <PetPlayFlowModal
          isOpen={isPetPlayModalOpen}
          onClose={() => setIsPetPlayModalOpen(false)}
        />
      )}

      {/* Workout Player Modal */}
      {selectedWorkout && (
        <WorkoutPlayer
          workout={selectedWorkout}
          onClose={() => setSelectedWorkout(null)}
          onComplete={handleWorkoutComplete}
        />
      )}

      {/* Custom Workout Modal */}
      {isCustomModalOpen && (
        <CustomWorkoutModal
          isOpen={isCustomModalOpen}
          onClose={() => setIsCustomModalOpen(false)}
          onSave={handleSaveCustom}
        />
      )}

      {/* Photo Activity AI Modal */}
      {isPhotoModalOpen && (
        <PhotoActivityModal
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
          onSaveActivity={handleSaveCustom}
        />
      )}

    </div>
  );
}

