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
  const [isMicroMovementOpen, setIsMicroMovementOpen] = useState(false);
  const [isStrategyOpen, setIsStrategyOpen] = useState(false);
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
      </div>

      {/* Revealed Micro-Movement Experience */}
      {isMicroMovementOpen && (
        <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
          <MicroMovementSection />
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

        {/* 2. Outdoor & Indoor Activity */}
        <div className="card-glass" style={{ padding: '1.15rem 1.35rem', borderRadius: 'var(--radius-lg)' }}>
          <div 
            onClick={() => setIsTrackerOpen(!isTrackerOpen)}
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
                🌳
              </div>
              <div>
                <h4 style={{ fontSize: '1.02rem', fontWeight: 800, margin: '0 0 0.1rem 0', color: 'var(--text-primary)' }}>
                  2. Outdoor & Indoor Activity
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                  Walking, running, hiking, indoor stretches & pet-linked adventures.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                type="button"
                className={`btn ${isTrackerOpen ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', gap: '0.3rem' }}
                onClick={(e) => { e.stopPropagation(); setIsTrackerOpen(!isTrackerOpen); }}
              >
                <span>{isTrackerOpen ? 'Hide Activities' : 'Open Activities'}</span>
                {isTrackerOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </div>

          {isTrackerOpen && (
            <div style={{ marginTop: '1.15rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.15rem', animation: 'fadeIn 0.2s ease-out' }}>
              <ActivityTracker />
            </div>
          )}
        </div>

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

