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
import { 
  Zap, 
  Activity, 
  PawPrint, 
  Clock, 
  Dumbbell, 
  X, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function MoveHub() {
  const { 
    completedWorkouts, 
    setCompletedWorkouts, 
    userProfile 
  } = useWellness();

  // Launcher Pop-up States
  const [isActivityTrackerOpen, setIsActivityTrackerOpen] = useState(false);
  const [isPetPlayOpen, setIsPetPlayOpen] = useState(false);
  const [isMicroMovementOpen, setIsMicroMovementOpen] = useState(false);
  const [isExercisePlansOpen, setIsExercisePlansOpen] = useState(false);

  // Sub-modal Flows
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isBreakItDownOpen, setIsBreakItDownOpen] = useState(false); // Entry hidden, code preserved
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [isBeginnerPlanModalOpen, setIsBeginnerPlanModalOpen] = useState(false);

  const handleWorkoutComplete = (workoutId) => {
    if (!completedWorkouts.includes(workoutId)) {
      setCompletedWorkouts(prev => [...prev, workoutId]);
    }
  };

  const handleSaveCustom = () => {
    // Custom workout saved
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '3.5rem' }}>
      
      {/* 1. Clean Compact Header */}
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
          Choose an option below to track, play, move, or explore plans.
        </p>
      </div>

      {/* 2. Compact 2x2 Launcher Grid */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '0.75rem' 
        }}
      >
        {/* 1. Activity Tracker */}
        <button
          type="button"
          onClick={() => setIsActivityTrackerOpen(true)}
          className="card-glass card-interactive"
          style={{
            background: 'linear-gradient(135deg, var(--accent-primary-light) 0%, var(--bg-glass-card) 100%)',
            border: '1.5px solid var(--accent-primary-light)',
            borderRadius: 'var(--radius-card)',
            padding: '1.1rem 0.85rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
            minHeight: '120px',
            boxShadow: 'var(--shadow-subtle)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <div 
            style={{ 
              width: 44, 
              height: 44, 
              borderRadius: '50%', 
              background: 'var(--accent-primary)', 
              color: '#ffffff',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(45, 106, 79, 0.25)'
            }}
          >
            <Activity size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Activity Tracker
            </h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Live steps & pacing
            </span>
          </div>
        </button>

        {/* 2. Pet Play */}
        <button
          type="button"
          onClick={() => setIsPetPlayOpen(true)}
          className="card-glass card-interactive"
          style={{
            background: 'linear-gradient(135deg, var(--accent-secondary-light) 0%, var(--bg-glass-card) 100%)',
            border: '1.5px solid var(--accent-secondary-light)',
            borderRadius: 'var(--radius-card)',
            padding: '1.1rem 0.85rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
            minHeight: '120px',
            boxShadow: 'var(--shadow-subtle)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <div 
            style={{ 
              width: 44, 
              height: 44, 
              borderRadius: '50%', 
              background: 'var(--accent-secondary)', 
              color: '#ffffff',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '1.3rem',
              boxShadow: '0 4px 12px rgba(217, 119, 54, 0.25)'
            }}
          >
            🐾
          </div>
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Pet Play
            </h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Joyful play & walks
            </span>
          </div>
        </button>

        {/* 3. Micro-Movement */}
        <button
          type="button"
          onClick={() => setIsMicroMovementOpen(true)}
          className="card-glass card-interactive"
          style={{
            background: 'linear-gradient(135deg, rgba(64, 145, 108, 0.12) 0%, var(--bg-glass-card) 100%)',
            border: '1.5px solid rgba(64, 145, 108, 0.2)',
            borderRadius: 'var(--radius-card)',
            padding: '1.1rem 0.85rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
            minHeight: '120px',
            boxShadow: 'var(--shadow-subtle)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <div 
            style={{ 
              width: 44, 
              height: 44, 
              borderRadius: '50%', 
              background: 'var(--accent-calm)', 
              color: '#ffffff',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(64, 145, 108, 0.25)'
            }}
          >
            <Clock size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Micro-Movement
            </h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              30-30 & Dance breaks
            </span>
          </div>
        </button>

        {/* 4. Exercise Plans */}
        <button
          type="button"
          onClick={() => setIsExercisePlansOpen(true)}
          className="card-glass card-interactive"
          style={{
            background: 'linear-gradient(135deg, rgba(123, 97, 255, 0.12) 0%, var(--bg-glass-card) 100%)',
            border: '1.5px solid rgba(123, 97, 255, 0.2)',
            borderRadius: 'var(--radius-card)',
            padding: '1.1rem 0.85rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
            minHeight: '120px',
            boxShadow: 'var(--shadow-subtle)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <div 
            style={{ 
              width: 44, 
              height: 44, 
              borderRadius: '50%', 
              background: 'var(--accent-purple)', 
              color: '#ffffff',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(123, 97, 255, 0.25)'
            }}
          >
            <Dumbbell size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Exercise Plans
            </h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Browse & create routines
            </span>
          </div>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 4 FEATURE POP-UP SHEETS / MODALS                                          */}
      {/* ========================================================================= */}

      {/* 1. Activity Tracker Pop-Up */}
      {isActivityTrackerOpen && (
        <div className="modal-backdrop" onClick={() => setIsActivityTrackerOpen(false)} style={{ zIndex: 1100 }}>
          <div 
            className="modal-sheet" 
            onClick={e => e.stopPropagation()}
            style={{ 
              maxWidth: 540, 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Activity size={18} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Activity Tracker
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsActivityTrackerOpen(false)}
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
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <ActivityTracker />
          </div>
        </div>
      )}

      {/* 2. Pet Play Pop-Up */}
      {isPetPlayOpen && (
        <PetPlayFlowModal
          isOpen={isPetPlayOpen}
          onClose={() => setIsPetPlayOpen(false)}
        />
      )}

      {/* 3. Micro-Movement Pop-Up */}
      {isMicroMovementOpen && (
        <div className="modal-backdrop" onClick={() => setIsMicroMovementOpen(false)} style={{ zIndex: 1100 }}>
          <div 
            className="modal-sheet" 
            onClick={e => e.stopPropagation()}
            style={{ 
              maxWidth: 540, 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={18} color="var(--accent-calm)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Micro-Movement & Breaks
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsMicroMovementOpen(false)}
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
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <MicroMovementSection onTryOneNow={() => {}} />
          </div>
        </div>
      )}

      {/* 4. Exercise Plans Pop-Up */}
      {isExercisePlansOpen && (
        <div className="modal-backdrop" onClick={() => setIsExercisePlansOpen(false)} style={{ zIndex: 1100 }}>
          <div 
            className="modal-sheet" 
            onClick={e => e.stopPropagation()}
            style={{ 
              maxWidth: 580, 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Dumbbell size={18} color="var(--accent-purple)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Exercise Plans
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsExercisePlansOpen(false)}
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
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <ExercisePlansSection
              onStartBeginnerPlan={() => setIsBeginnerPlanModalOpen(true)}
              onStartWorkout={(workout) => setSelectedWorkout(workout)}
              onOpenCustomModal={() => setIsCustomModalOpen(true)}
              onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECONDARY MODAL FLOWS & WORKOUT PLAYER                                    */}
      {/* ========================================================================= */}

      {/* Beginner Plan Flow Modal */}
      {isBeginnerPlanModalOpen && (
        <BeginnerPlanFlowModal
          isOpen={isBeginnerPlanModalOpen}
          onClose={() => setIsBeginnerPlanModalOpen(false)}
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

      {/* Photo Activity AI Scanner Modal */}
      {isPhotoModalOpen && (
        <PhotoActivityModal
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
          onSaveActivity={handleSaveCustom}
        />
      )}

      {/* Social Activity Modal */}
      {isSocialModalOpen && (
        <SocialActivityModal
          isOpen={isSocialModalOpen}
          onClose={() => setIsSocialModalOpen(false)}
        />
      )}

      {/* Exercise Breakdown Storyboard Modal (Hidden for now, preserved) */}
      {isBreakItDownOpen && (
        <ExerciseBreakdownModal
          isOpen={isBreakItDownOpen}
          onClose={() => setIsBreakItDownOpen(false)}
        />
      )}

    </div>
  );
}



