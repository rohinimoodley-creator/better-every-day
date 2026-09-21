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
  Plus,
  PawPrint,
  Layers,
  Heart
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
  const [isCyclePreviewOpen, setIsCyclePreviewOpen] = useState(false);

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
    <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '3.5rem' }}>
      
      {/* 1. Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.15rem' }}>
          <span className="pill-badge primary" style={{ fontSize: '0.7rem' }}>
            <Zap size={11} /> Movement & Pacing
          </span>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>
          Move 🏃
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
          Listen to your body, celebrate gentle consistency, and move freely.
        </p>
      </div>

      {/* 2. Activity Tracker (Idle ~280dp / Focused Workout view) */}
      <ActivityTracker />

      {/* 3. Beginner Plan Quick Start Hero (~120-140dp) */}
      <div 
        className="card-glass card-interactive"
        onClick={() => setIsBeginnerPlanModalOpen(true)}
        style={{
          padding: '1rem 1.15rem',
          border: '1.5px solid var(--accent-primary)',
          background: 'linear-gradient(135deg, var(--accent-primary-light) 0%, var(--bg-glass-card) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div 
            style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 'var(--radius-md)', 
              background: 'var(--accent-primary)', 
              color: '#fff', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '1.25rem' 
            }}
          >
            🌱
          </div>
          <div>
            <span className="pill-badge primary" style={{ fontSize: '0.65rem', marginBottom: '0.1rem' }}>
              ACCESSIBLE ENTRY POINT
            </span>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0.1rem 0', color: 'var(--text-primary)' }}>
              Beginner Plan · Start Gentle
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
              Bite-sized starting movements for new or returning movers.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          style={{ minHeight: 44, fontSize: '0.8rem', padding: '0.4rem 0.85rem', gap: '0.3rem' }}
          aria-label="Open beginner plan"
        >
          <span>Start</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* 4. Micro-Movements Section (~300dp inline panel) */}
      <MicroMovementSection 
        onTryOneNow={() => setIsBreakItDownOpen(true)}
      />

      {/* 5. Exercise Plans & Library (Segmented: My Plan / Browse / Favourites) */}
      <ExercisePlansSection
        onStartBeginnerPlan={() => setIsBeginnerPlanModalOpen(true)}
        onStartWorkout={(workout) => setSelectedWorkout(workout)}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
        onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
      />

      {/* 6. Quick Launchers: Pet Play & Exercise Storyboard (~80dp cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.65rem' }}>
        {/* Pet Play Launcher */}
        <div
          className="card-glass card-interactive"
          onClick={() => setIsPetPlayModalOpen(true)}
          style={{
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🐾</span>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Pet Play
              </h4>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                Log active playtime & walks
              </p>
            </div>
          </div>
          <ArrowRight size={14} color="var(--accent-primary)" />
        </div>

        {/* Exercise Breakdown Launcher */}
        <div
          className="card-glass card-interactive"
          onClick={() => setIsBreakItDownOpen(true)}
          style={{
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🧩</span>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Break It Down
              </h4>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                Pip storyboard & live demos
              </p>
            </div>
          </div>
          <ArrowRight size={14} color="var(--accent-primary)" />
        </div>
      </div>

      {/* 7. Cycle Sync Preview Banner (if active) */}
      {isCycleSyncActive && cycleInfo && (
        <div 
          className="card-glass" 
          style={{
            padding: '0.9rem 1.15rem',
            background: 'linear-gradient(135deg, rgba(214, 64, 98, 0.06) 0%, rgba(123, 97, 255, 0.06) 100%)',
            border: '1px solid rgba(214, 64, 98, 0.25)',
            borderRadius: 'var(--radius-md)'
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '1.2rem' }}>{cycleInfo.icon}</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span className="pill-badge rose" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
                    Cycle Sync
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {cycleInfo.phase} Phase
                  </span>
                </div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 800, margin: '0.1rem 0 0 0', color: 'var(--text-primary)' }}>
                  Movement Guidance
                </h4>
              </div>
            </div>

            <span style={{ fontSize: '0.74rem', color: 'var(--accent-rose)', fontWeight: 700 }}>
              {isCyclePreviewOpen ? 'Hide' : 'View'}
            </span>
          </div>

          {isCyclePreviewOpen && (
            <div style={{ marginTop: '0.75rem', borderTop: '1px solid rgba(214, 64, 98, 0.15)', paddingTop: '0.75rem', animation: 'fadeIn 0.2s ease-out' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0', lineHeight: 1.45 }}>
                {cycleInfo.workoutGuidance}
              </p>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={13} color="var(--accent-primary)" />
                <span>You remain in full control of your workout intensity.</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ALL MODALS & INTERACTIVE FLOWS                                            */}
      {/* ========================================================================= */}

      {/* Beginner Plan Progressive Modal */}
      {isBeginnerPlanModalOpen && (
        <BeginnerPlanFlowModal
          isOpen={isBeginnerPlanModalOpen}
          onClose={() => setIsBeginnerPlanModalOpen(false)}
        />
      )}

      {/* Break It Down Exercise Breakdown Modal */}
      {isBreakItDownOpen && (
        <ExerciseBreakdownModal
          isOpen={isBreakItDownOpen}
          onClose={() => setIsBreakItDownOpen(false)}
        />
      )}

      {/* Pet Play Flow Modal */}
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


