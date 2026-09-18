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
import SocialActivityModal from './SocialActivityModal';
import { getCyclePhaseInfo } from '../../engine/cycleEngine';
import { 
  Zap, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Compass, 
  Activity,
  ArrowRight,
  ShieldCheck,
  Plus
} from 'lucide-react';

export default function MoveHub() {
  const { 
    completedWorkouts, 
    setCompletedWorkouts, 
    userProfile,
    isCycleSyncActive
  } = useWellness();

  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isBreakItDownOpen, setIsBreakItDownOpen] = useState(false);
  const [isPetPlayModalOpen, setIsPetPlayModalOpen] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [isBeginnerPlanModalOpen, setIsBeginnerPlanModalOpen] = useState(false);
  const [isMicroMovementOpen, setIsMicroMovementOpen] = useState(false);
  const [isCyclePreviewOpen, setIsCyclePreviewOpen] = useState(false);
  const [isStrategyOpen, setIsStrategyOpen] = useState(false);

  const cycleInfo = isCycleSyncActive && userProfile?.lastPeriodStart
    ? getCyclePhaseInfo(userProfile.lastPeriodStart, userProfile.cycleLength || 28)
    : null;

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
      
      {/* 1. Header */}
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

      {/* ========================================================================= */}
      {/* 2. PRIMARY BUTTONS (Clean, Lightweight, 3 Simple Action Buttons)          */}
      {/* 1. Micro-Movement | 2. Break It Down | 3. Pet Play                        */}
      {/* ========================================================================= */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem'
        }}
      >
        {/* Button 1: Micro-Movement */}
        <button
          type="button"
          onClick={() => setIsMicroMovementOpen(!isMicroMovementOpen)}
          className="btn"
          style={{
            background: isMicroMovementOpen ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: isMicroMovementOpen ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-lg)',
            fontSize: '0.92rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🧍</span>
            <span>Micro-Movement</span>
          </div>
          {isMicroMovementOpen ? <ChevronUp size={16} color="var(--accent-primary)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
        </button>

        {/* Button 2: Break It Down */}
        <button
          type="button"
          onClick={() => setIsBreakItDownOpen(true)}
          className="btn"
          style={{
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-lg)',
            fontSize: '0.92rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🧩</span>
            <span>Break It Down</span>
          </div>
          <ArrowRight size={15} color="var(--accent-primary)" />
        </button>

        {/* Button 3: Pet Play */}
        <button
          type="button"
          onClick={() => setIsPetPlayModalOpen(true)}
          className="btn"
          style={{
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-lg)',
            fontSize: '0.92rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🐾</span>
            <span>Pet Play</span>
          </div>
          <ArrowRight size={15} color="var(--accent-primary)" />
        </button>

        {/* Button 4: Social Activity (Recreational Movement) */}
        <button
          type="button"
          onClick={() => setIsSocialModalOpen(true)}
          className="btn"
          style={{
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-lg)',
            fontSize: '0.92rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.25rem' }}>⛷️</span>
            <span>Social Activity</span>
          </div>
          <ArrowRight size={15} color="var(--accent-primary)" />
        </button>
      </div>

      {/* Revealed Micro-Movement Experience */}
      {isMicroMovementOpen && (
        <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
          <MicroMovementSection />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🌸 OPTIONAL PREVIEW SUGGESTION LAYER (Only when Cycle Sync is ON)         */}
      {/* ========================================================================= */}
      {isCycleSyncActive && cycleInfo && (
        <div 
          className="card-glass" 
          style={{
            padding: '1.1rem 1.35rem',
            background: 'linear-gradient(135deg, rgba(214, 64, 98, 0.06) 0%, rgba(123, 97, 255, 0.06) 100%)',
            border: '1.5px solid rgba(214, 64, 98, 0.28)',
            borderRadius: 'var(--radius-lg)',
            transition: 'all 0.2s ease'
          }}
        >
          <div 
            onClick={() => setIsCyclePreviewOpen(!isCyclePreviewOpen)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div 
                style={{ 
                  width: 38, 
                  height: 38, 
                  borderRadius: '50%', 
                  background: 'rgba(214, 64, 98, 0.15)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '1.2rem',
                  flexShrink: 0
                }}
              >
                {cycleInfo.icon}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.1rem' }}>
                  <span className="pill-badge rose" style={{ fontSize: '0.66rem', padding: '1px 6px', fontWeight: 800 }}>
                    🌸 Preview Suggestion Layer
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {cycleInfo.phase} Phase • Day {cycleInfo.day} of {cycleInfo.totalDays}
                  </span>
                </div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Preview Cycle-Aware Suggestions
                </h4>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--accent-rose)' }}>
                {isCyclePreviewOpen ? 'Hide Preview' : 'View Preview'}
              </span>
              {isCyclePreviewOpen ? <ChevronUp size={16} color="var(--accent-rose)" /> : <ChevronDown size={16} color="var(--accent-rose)" />}
            </div>
          </div>

          {isCyclePreviewOpen && (
            <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(214, 64, 98, 0.18)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', animation: 'fadeIn 0.2s ease-out' }}>
              
              {/* Current Plan vs Cycle-Aware Preview Side-by-Side */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Current Move Plan
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>
                    Your usual plan remains unchanged.
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block', lineHeight: 1.35 }}>
                    Your workout plans, difficulty settings, and streak goals are never automatically replaced.
                  </span>
                </div>

                <div style={{ background: 'rgba(214, 64, 98, 0.08)', padding: '0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(214, 64, 98, 0.3)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-rose)', textTransform: 'uppercase', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Sparkles size={12} /> 🌸 Cycle-Aware Preview
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>
                    Based on your current cycle phase ({cycleInfo.phase}):
                  </p>
                  <p style={{ fontSize: '0.79rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0', lineHeight: 1.45 }}>
                    {cycleInfo.workoutGuidance}
                  </p>
                </div>
              </div>

              {/* Explicit User Agency Guarantee */}
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.45rem', lineHeight: 1.4 }}>
                <ShieldCheck size={15} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Preview only.</strong> You remain in full control of what activity you choose today. Feel free to follow your usual routine, scale down, or rest as feels right for your body.
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE MOVEMENT HIERARCHY                                         */}
      {/* 1. Quick Start 🌱 | 2. Outdoor & Indoor Activity 🌳 | 3. Exercise Strategy 🧩 */}
      {/* ========================================================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Compass size={16} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '1.08rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Interactive Movement
          </h3>
        </div>

        {/* 1. Quick Start (Beginner Plan) */}
        <div 
          className="card-glass card-interactive"
          onClick={() => setIsBeginnerPlanModalOpen(true)}
          style={{
            padding: '1.15rem 1.35rem',
            border: '1.5px solid var(--accent-primary)',
            background: 'linear-gradient(135deg, var(--accent-primary-light) 0%, var(--bg-glass-card) 100%)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
              🌱
            </div>
            <div>
              <span className="pill-badge primary" style={{ fontSize: '0.65rem', marginBottom: '0.15rem' }}>ACCESSIBLE ENTRY POINT</span>
              <h4 style={{ fontSize: '1.02rem', fontWeight: 800, margin: '0.1rem 0', color: 'var(--text-primary)' }}>
                1. Quick Start — Beginner Plan
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                Low-pressure, bite-sized starting movements for new, reluctant, or returning movers.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem', gap: '0.3rem' }}
          >
            <span>Start Plan</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* 2. Live Move Tracker — Outdoor & Indoor Activity (Always Visible & Full Screen Accessible) */}
        <ActivityTracker />

        {/* 3. Exercise Strategy (Reveals: My Exercise Plan, Browse Plans, Favourites) */}
        <div className="card-glass" style={{ padding: '1.15rem 1.35rem', borderRadius: 'var(--radius-lg)' }}>
          <div 
            onClick={() => setIsStrategyOpen(!isStrategyOpen)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                🧩
              </div>
              <div>
                <h4 style={{ fontSize: '1.02rem', fontWeight: 800, margin: '0 0 0.1rem 0', color: 'var(--text-primary)' }}>
                  3. Exercise Strategy
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                  My Exercise Plan, Browse Exercise Plans & Favourite Exercise Plans.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                type="button"
                className={`btn ${isStrategyOpen ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', gap: '0.3rem' }}
                onClick={(e) => { e.stopPropagation(); setIsStrategyOpen(!isStrategyOpen); }}
              >
                <span>{isStrategyOpen ? 'Hide Strategy' : 'Open Strategy'}</span>
                {isStrategyOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </div>

          {isStrategyOpen && (
            <div style={{ marginTop: '1.15rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.15rem', animation: 'fadeIn 0.2s ease-out' }}>
              <ExercisePlansSection
                onStartBeginnerPlan={() => setIsBeginnerPlanModalOpen(true)}
                onStartWorkout={(workout) => setSelectedWorkout(workout)}
                onOpenCustomModal={() => setIsCustomModalOpen(true)}
                onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
              />
            </div>
          )}
        </div>
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

      {/* Social Activity Modal */}
      {isSocialModalOpen && (
        <SocialActivityModal
          isOpen={isSocialModalOpen}
          onClose={() => setIsSocialModalOpen(false)}
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

