import React, { useState, useEffect, useMemo } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { 
  Play, 
  Pause, 
  Check, 
  RotateCcw, 
  Trash2,
  Maximize2,
  Minimize2,
  X,
  Footprints,
  Flame,
  Timer,
  Zap,
  Activity,
  Heart,
  Smartphone,
  Watch,
  ChevronDown,
  ChevronUp,
  Plus
} from 'lucide-react';
import ConfirmationModal from '../common/ConfirmationModal';
import Expander from '../common/Expander';
import confetti from 'canvas-confetti';

const ACTIVITY_TYPES = [
  { id: 'walk', label: 'Walking', icon: '🚶', defaultIntensity: 'light' },
  { id: 'run', label: 'Running', icon: '🏃', defaultIntensity: 'moderate' },
  { id: 'cycle', label: 'Cycling', icon: '🚴', defaultIntensity: 'moderate' },
  { id: 'pet_play', label: 'Pet Play', icon: '🐾', defaultIntensity: 'light' },
  { id: 'custom', label: 'Custom', icon: '✨', defaultIntensity: 'moderate' }
];

const DURATION_PRESETS = [
  { mins: 10, label: '10m' },
  { mins: 15, label: '15m' },
  { mins: 20, label: '20m' },
  { mins: 30, label: '30m' },
  { mins: 0, label: 'Open' }
];

const ENCOURAGEMENTS = [
  "Every step counts toward feeling good.",
  "Finding your comfortable rhythm today 🌱",
  "Gentle progress, zero pressure.",
  "Listening to your body is strength.",
  "Enjoying the feeling of movement!"
];

export default function ActivityTracker({ initialFullScreen = false }) {
  const { 
    setStepCount, 
    setActiveWorkoutMinutes, 
    addWellnessEvent,
    userProfile 
  } = useWellness();

  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeSeconds, setActiveSeconds] = useState(0);
  const [sessionSteps, setSessionSteps] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState('walk');
  const [targetMins, setTargetMins] = useState(20);
  const [source, setSource] = useState('smartphone');
  const [isFullScreen, setIsFullScreen] = useState(initialFullScreen);
  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false);
  const [completedSummary, setCompletedSummary] = useState(null);
  const [laps, setLaps] = useState([]);
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'walk', name: 'Mindful Walk', durationMins: 20, timeAgo: 'yesterday' },
    { id: 2, type: 'pet_play', name: 'Pet Play (Milo)', durationMins: 15, timeAgo: '2 days ago' }
  ]);

  const targetSeconds = targetMins * 60;
  const progressPercent = targetSeconds > 0 ? Math.min(100, Math.round((activeSeconds / targetSeconds) * 100)) : 0;

  // Encouragement text cycling every 5 min
  const encouragementIdx = Math.floor(activeSeconds / 300) % ENCOURAGEMENTS.length;
  const currentEncouragement = ENCOURAGEMENTS[encouragementIdx];

  useEffect(() => {
    let interval = null;
    if (isTracking && !isPaused) {
      interval = setInterval(() => {
        setActiveSeconds(prev => {
          const next = prev + 1;
          if (targetSeconds > 0 && next === targetSeconds) {
            try { confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } }); } catch (e) {}
          }
          return next;
        });

        // Simulate step cadence
        const stepInc = selectedActivity === 'run' ? 3 : selectedActivity === 'walk' ? 2 : 1;
        setSessionSteps(prev => prev + stepInc);
        setStepCount(prev => prev + stepInc);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, isPaused, targetSeconds, selectedActivity, setStepCount]);

  const handleStart = (fullScreenMode = false) => {
    setIsTracking(true);
    setIsPaused(false);
    setCompletedSummary(null);
    if (fullScreenMode) {
      setIsFullScreen(true);
    }
  };

  const handlePauseResume = () => {
    setIsPaused(prev => !prev);
  };

  const handleLap = () => {
    setLaps(prev => [
      ...prev,
      { lapNumber: prev.length + 1, time: activeSeconds, steps: sessionSteps }
    ]);
  };

  const handleStopAndSave = () => {
    setIsTracking(false);
    setIsPaused(false);
    const durationMins = Math.max(1, Math.round(activeSeconds / 60));
    setActiveWorkoutMinutes(prev => prev + durationMins);

    const actObj = ACTIVITY_TYPES.find(a => a.id === selectedActivity) || ACTIVITY_TYPES[0];
    const summary = {
      activityType: selectedActivity,
      name: actObj.label,
      icon: actObj.icon,
      durationMins,
      steps: sessionSteps,
      distanceKm: ((sessionSteps * 0.75) / 1000).toFixed(2),
      calories: Math.round(sessionSteps * (selectedActivity === 'run' ? 0.055 : 0.04)),
      intensity: actObj.defaultIntensity,
      timestamp: new Date().toISOString()
    };

    // Log to Wellness Link Engine event store
    if (addWellnessEvent) {
      addWellnessEvent({
        type: 'activity',
        activityType: selectedActivity,
        durationMins,
        intensity: summary.intensity,
        timestamp: summary.timestamp,
        notes: `${actObj.label} tracked session`
      });
    }

    setCompletedSummary(summary);
    setRecentActivities(prev => [
      { id: Date.now(), type: selectedActivity, name: actObj.label, durationMins, timeAgo: 'just now' },
      ...prev.slice(0, 4)
    ]);

    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleConfirmDiscard = () => {
    setIsTracking(false);
    setIsPaused(false);
    setActiveSeconds(0);
    setSessionSteps(0);
    setLaps([]);
    setCompletedSummary(null);
    setIsDiscardConfirmOpen(false);
    setIsFullScreen(false);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatHMS = (secs) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (hrs > 0) {
      return `${hrs < 10 ? '0' : ''}${hrs}:${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const distanceKm = ((sessionSteps * 0.75) / 1000).toFixed(2);
  const estimatedCalories = Math.round(sessionSteps * (selectedActivity === 'run' ? 0.055 : 0.04));
  // Bug 6 Fix: Explicitly "Estimated Pace" rather than "Walking Cadence"
  const estimatedPace = isTracking 
    ? (selectedActivity === 'run' ? '5:30 /km' : selectedActivity === 'cycle' ? '2:45 /km' : '11:15 /km') 
    : '—';

  const currentAct = ACTIVITY_TYPES.find(a => a.id === selectedActivity) || ACTIVITY_TYPES[0];

  // =========================================================================
  // FOCUSED WORKOUT VIEW (Full-screen HUD fitting 1 screen on 412x915)
  // =========================================================================
  const renderFocusedWorkoutView = () => (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2200,
        background: 'linear-gradient(180deg, #090e17 0%, #0f172a 100%)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflowY: 'auto',
        animation: 'fadeIn 0.2s ease-out',
        padding: '1rem',
        maxWidth: 480,
        margin: '0 auto'
      }}
    >
      {/* Top Bar */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div 
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem'
            }}
          >
            {currentAct.icon}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: 800 }}>{currentAct.label}</span>
              <span 
                style={{
                  fontSize: '0.68rem',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-pill)',
                  background: isPaused ? 'rgba(234, 179, 8, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                  color: isPaused ? '#facc15' : '#4ade80',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span 
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: isPaused ? '#facc15' : '#22c55e',
                    animation: isPaused ? 'none' : 'pulse 1.5s infinite'
                  }} 
                />
                {isPaused ? 'PAUSED' : 'IN PROGRESS'}
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              {source === 'wearable' ? 'Connected Watch' : 'Phone Sensors'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsFullScreen(false)}
          className="btn btn-secondary"
          style={{
            minHeight: 44,
            minWidth: 44,
            padding: '0.4rem 0.75rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.78rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            cursor: 'pointer'
          }}
          aria-label="Minimize workout view"
        >
          <Minimize2 size={16} />
          <span>Minimize</span>
        </button>
      </div>

      {/* Hero Timer with 180dp Arc Progress */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem 0'
        }}
      >
        <div 
          style={{
            width: 180,
            height: 180,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0.8) 70%)',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 0 30px rgba(99, 102, 241, 0.2)'
          }}
        >
          {/* SVG Progress Circle */}
          <svg style={{ position: 'absolute', inset: 0, width: 180, height: 180, transform: 'rotate(-90deg)' }}>
            <circle
              cx="90"
              cy="90"
              r="82"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="6"
            />
            {targetSeconds > 0 && (
              <circle
                cx="90"
                cy="90"
                r="82"
                fill="none"
                stroke="var(--accent-primary)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 82}`}
                strokeDashoffset={`${2 * Math.PI * 82 * (1 - progressPercent / 100)}`}
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            )}
          </svg>

          {/* Center Elapsed Time */}
          <div style={{ textAlign: 'center', zIndex: 2 }}>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>
              Elapsed Time
            </div>
            <div 
              className="tabular-nums"
              style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.1 }}
            >
              {formatHMS(activeSeconds)}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--accent-primary)', fontWeight: 700, marginTop: 2 }}>
              {targetMins > 0 ? `${progressPercent}% of ${targetMins}m goal` : 'Open workout'}
            </div>
          </div>
        </div>

        {/* Gentle encouragement banner */}
        <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.75)', margin: '0.85rem 0 0 0', textAlign: 'center', maxWidth: 280 }}>
          {currentEncouragement}
        </p>
      </div>

      {/* Live Metrics: 2x2 Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.65rem',
          margin: '0.5rem 0'
        }}
      >
        {/* Metric 1: Calories */}
        <div 
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            textAlign: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', color: '#fb923c', fontSize: '0.72rem', fontWeight: 700 }}>
            <Flame size={13} /> EST. CALORIES
          </div>
          <div className="tabular-nums" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: '0.2rem 0' }}>
            {estimatedCalories} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)' }}>kcal</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.5)' }}>MET estimate</div>
        </div>

        {/* Metric 2: Distance */}
        <div 
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            textAlign: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', color: '#38bdf8', fontSize: '0.72rem', fontWeight: 700 }}>
            <Footprints size={13} /> DISTANCE
          </div>
          <div className="tabular-nums" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: '0.2rem 0' }}>
            {distanceKm} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)' }}>km</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.5)' }}>{sessionSteps} steps</div>
        </div>

        {/* Metric 3: Estimated Pace (Bug 6 Fix: Not 'Walking Cadence') */}
        <div 
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            textAlign: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', color: '#4ade80', fontSize: '0.72rem', fontWeight: 700 }}>
            <Zap size={13} /> ESTIMATED PACE
          </div>
          <div className="tabular-nums" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: '0.2rem 0' }}>
            {estimatedPace}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.5)' }}>Estimated Pace</div>
        </div>

        {/* Metric 4: Effort / Heart Rate Zone */}
        <div 
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            textAlign: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', color: '#f472b6', fontSize: '0.72rem', fontWeight: 700 }}>
            <Heart size={13} /> EFFORT ZONE
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: '0.3rem 0' }}>
            {selectedActivity === 'run' ? 'Cardio Zone' : 'Moderate Effort'}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.5)' }}>Aerobic base</div>
        </div>
      </div>

      {/* Main Controls Row */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem' }}>
          {/* Lap / Split Button (44dp) */}
          <button
            type="button"
            onClick={handleLap}
            className="btn btn-secondary"
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff'
            }}
            title="Record lap split"
            aria-label="Record lap"
          >
            <Timer size={18} />
          </button>

          {/* Pause / Resume Button (56dp circular, center) */}
          <button
            type="button"
            onClick={handlePauseResume}
            className="btn"
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isPaused ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.15)',
              border: isPaused ? 'none' : '2px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
            }}
            aria-label={isPaused ? 'Resume workout' : 'Pause workout'}
          >
            {isPaused ? <Play size={24} /> : <Pause size={24} />}
          </button>

          {/* Stop & Finish Button (44dp, right, green checkmark) */}
          <button
            type="button"
            onClick={handleStopAndSave}
            className="btn"
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#22c55e',
              border: 'none',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
            }}
            title="Finish & Save Workout"
            aria-label="Finish and save workout"
          >
            <Check size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Stop & Delete (Red outline button below controls) */}
        <button
          type="button"
          onClick={() => setIsDiscardConfirmOpen(true)}
          style={{
            background: 'transparent',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#ef4444',
            padding: '0.45rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.78rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
            cursor: 'pointer'
          }}
          aria-label="Discard workout"
        >
          <Trash2 size={14} />
          <span>Discard Workout</span>
        </button>
      </div>

      {/* Discard Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDiscardConfirmOpen}
        title="Discard Workout?"
        message="Are you sure you want to discard this workout? No activity will be saved to your logs."
        confirmText="Yes, Discard"
        cancelText="Keep Tracking"
        isDestructive={true}
        onConfirm={handleConfirmDiscard}
        onCancel={() => setIsDiscardConfirmOpen(false)}
      />
    </div>
  );

  // =========================================================================
  // IDLE TRACKER (~280dp compact inline view)
  // =========================================================================
  return (
    <>
      {isFullScreen && isTracking && renderFocusedWorkoutView()}

      <div 
        className="card-glass" 
        style={{ 
          padding: '1.25rem', 
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.9rem'
        }}
      >
        {/* Header Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div 
              style={{ 
                width: 38, 
                height: 38, 
                borderRadius: 'var(--radius-md)', 
                background: 'var(--accent-primary-light)', 
                color: 'var(--accent-primary)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '1.2rem'
              }}
            >
              {currentAct.icon}
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Activity Tracker
              </h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0 }}>
                Outdoor & indoor movement sessions
              </p>
            </div>
          </div>

          {/* Sensor toggle */}
          <div style={{ display: 'flex', gap: '0.2rem', background: 'var(--bg-tertiary)', padding: '0.2rem', borderRadius: 'var(--radius-pill)' }}>
            <button
              type="button"
              onClick={() => setSource('smartphone')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.25rem 0.55rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: source === 'smartphone' ? 'var(--bg-secondary)' : 'transparent',
                color: source === 'smartphone' ? 'var(--accent-primary)' : 'var(--text-muted)',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Smartphone size={12} /> Phone
            </button>
            <button
              type="button"
              onClick={() => setSource('wearable')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.25rem 0.55rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: source === 'wearable' ? 'var(--bg-secondary)' : 'transparent',
                color: source === 'wearable' ? 'var(--accent-primary)' : 'var(--text-muted)',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Watch size={12} /> Watch
            </button>
          </div>
        </div>

        {/* Activity Type Horizontal Chips */}
        <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '0.2rem' }}>
          {ACTIVITY_TYPES.map(act => {
            const active = selectedActivity === act.id;
            return (
              <button
                key={act.id}
                type="button"
                onClick={() => setSelectedActivity(act.id)}
                style={{
                  minHeight: 44,
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-pill)',
                  border: `1.5px solid ${active ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  background: active ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                  color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <span>{act.icon}</span>
                <span>{act.label}</span>
              </button>
            );
          })}
        </div>

        {/* Duration Goal Preset Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)' }}>Target:</span>
          {DURATION_PRESETS.map(preset => {
            const active = targetMins === preset.mins;
            return (
              <button
                key={preset.mins}
                type="button"
                onClick={() => setTargetMins(preset.mins)}
                style={{
                  minHeight: 36,
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${active ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  background: active ? 'var(--accent-primary-light)' : 'transparent',
                  color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Start Button (Primary, 48dp height) */}
        {!isTracking ? (
          <button
            type="button"
            onClick={() => handleStart(true)}
            className="btn btn-primary"
            style={{
              minHeight: 48,
              fontSize: '0.95rem',
              fontWeight: 800,
              gap: '0.5rem',
              borderRadius: 'var(--radius-md)'
            }}
            aria-label={`Start ${currentAct.label} session`}
          >
            <Play size={18} />
            <span>Start {currentAct.label} ({targetMins > 0 ? `${targetMins}m` : 'Open'})</span>
          </button>
        ) : (
          /* Mini-bar when running inline */
          <div 
            style={{
              background: 'var(--accent-primary-light)',
              border: '1.5px solid var(--accent-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.65rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div 
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: isPaused ? 'var(--accent-gold)' : 'var(--accent-primary)',
                  animation: isPaused ? 'none' : 'pulse 1.5s infinite'
                }} 
              />
              <div>
                <div className="tabular-nums" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                  {formatTime(activeSeconds)}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {sessionSteps} steps • {distanceKm} km
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={handlePauseResume}
                className="btn btn-secondary btn-sm"
                style={{ minHeight: 36, padding: '0.35rem 0.6rem' }}
                aria-label={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? <Play size={14} /> : <Pause size={14} />}
              </button>
              <button
                type="button"
                onClick={() => setIsFullScreen(true)}
                className="btn btn-primary btn-sm"
                style={{ minHeight: 36, padding: '0.35rem 0.75rem', gap: '0.3rem' }}
                aria-label="Expand workout"
              >
                <Maximize2 size={13} />
                <span>Expand</span>
              </button>
            </div>
          </div>
        )}

        {/* Completed Summary Banner */}
        {completedSummary && (
          <div 
            style={{
              padding: '0.85rem',
              background: 'var(--accent-primary-light)',
              border: '1px solid var(--accent-primary)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                ✓ {completedSummary.name} saved ({completedSummary.durationMins}m)
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                {completedSummary.steps} steps • {completedSummary.calories} kcal • Hydration bonus linked!
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCompletedSummary(null)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', minHeight: 32 }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Collapsible Recent Activities Summary */}
        <Expander
          title="Recent activity history"
          summary={recentActivities.length > 0 ? `Last: ${recentActivities[0].durationMins}m ${recentActivities[0].name.toLowerCase()} ${recentActivities[0].timeAgo}` : 'No recent activities'}
          defaultExpanded={false}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingTop: '0.4rem' }}>
            {recentActivities.map(act => (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.45rem 0.65rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem'
                }}
              >
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{act.name}</span>
                <span style={{ color: 'var(--text-muted)' }}>{act.durationMins}m • {act.timeAgo}</span>
              </div>
            ))}
          </div>
        </Expander>
      </div>
    </>
  );
}
