import React, { useState, useEffect } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { 
  Play, 
  Pause, 
  Square, 
  Footprints, 
  Flame, 
  Timer, 
  Zap, 
  Smartphone, 
  Watch, 
  CheckCircle, 
  RotateCcw, 
  Trash2,
  Maximize2,
  Minimize2,
  X,
  Activity,
  Compass,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ActivityTracker({ initialFullScreen = false }) {
  const { setStepCount, setActiveWorkoutMinutes } = useWellness();

  const [isTracking, setIsTracking] = useState(false);
  const [activeSeconds, setActiveSeconds] = useState(0);
  const [sessionSteps, setSessionSteps] = useState(0);
  const [mode, setMode] = useState('walk'); // 'walk' | 'run'
  const [source, setSource] = useState('smartphone'); // 'smartphone' | 'wearable'
  
  // Timer direction & target
  const [timerDirection, setTimerDirection] = useState('countup'); // 'countup' | 'countdown' | 'free'
  const [targetMinutes, setTargetMinutes] = useState(30);
  const [completedSummary, setCompletedSummary] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(initialFullScreen);

  const targetSeconds = targetMinutes * 60;
  const remainingSeconds = Math.max(0, targetSeconds - activeSeconds);

  useEffect(() => {
    let interval = null;
    if (isTracking) {
      interval = setInterval(() => {
        setActiveSeconds(prev => {
          const next = prev + 1;
          if (timerDirection === 'countdown' && next >= targetSeconds) {
            handleStop();
            return targetSeconds;
          }
          if (timerDirection === 'countup' && next === targetSeconds) {
            try {
              confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
            } catch (e) {}
          }
          return next;
        });

        // Simulate step cadence (~1.8 steps/sec walking, ~2.7 running)
        const stepInc = mode === 'run' ? 3 : 2;
        setSessionSteps(prev => prev + stepInc);
        setStepCount(prev => prev + stepInc);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, mode, timerDirection, targetSeconds, setStepCount]);

  const handleStart = (openFull = false) => {
    setIsTracking(true);
    setCompletedSummary(null);
    if (openFull) {
      setIsFullScreen(true);
    }
  };

  const handleStop = () => {
    setIsTracking(false);
    const durationMins = Math.max(1, Math.round(activeSeconds / 60));
    setActiveWorkoutMinutes(prev => prev + durationMins);

    const summary = {
      durationMins,
      steps: sessionSteps,
      distanceKm: ((sessionSteps * 0.75) / 1000).toFixed(2),
      estimatedCalories: Math.round(sessionSteps * (mode === 'run' ? 0.055 : 0.04)),
      source: source === 'wearable' ? 'Smartwatch Auto-Detect' : 'Phone Step Sensors',
      mode: mode === 'run' ? 'Steady Run' : 'Mindful Walk'
    };
    setCompletedSummary(summary);

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch(e) {}
  };

  const handleDiscard = () => {
    setIsTracking(false);
    setActiveSeconds(0);
    setSessionSteps(0);
    setCompletedSummary(null);
  };

  const handleReset = () => {
    setCompletedSummary(null);
    setActiveSeconds(0);
    setSessionSteps(0);
    setIsTracking(false);
  };

  const distanceKm = ((sessionSteps * 0.75) / 1000).toFixed(2);
  const estimatedCalories = Math.round(sessionSteps * (mode === 'run' ? 0.055 : 0.04));
  const estimatedPace = isTracking ? (mode === 'run' ? '5:30 /km' : '11:15 /km') : '--:-- /km';
  const liveCadence = isTracking ? (mode === 'run' ? '160 spm' : '108 spm') : '0 spm';

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const getDisplayDuration = () => {
    if (timerDirection === 'countdown') {
      return formatTime(remainingSeconds);
    }
    return formatTime(activeSeconds);
  };

  // =========================================================================
  // 1. FULL SCREEN LIVE TRACKING HUD VIEW
  // =========================================================================
  const renderFullScreenView = () => (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2200,
        background: 'linear-gradient(180deg, #090e17 0%, #0f172a 100%)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        animation: 'fadeIn 0.25s ease-out',
        padding: '1.25rem'
      }}
    >
      {/* Top HUD Header */}
      <div 
        style={{
          maxWidth: 960,
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div 
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '1.25rem'
            }}
          >
            🏃
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, letterSpacing: '0.5px' }}>
                LIVE MOVE TRACKER
              </span>
              <span 
                style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: isTracking ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  color: isTracking ? '#4ade80' : 'rgba(255, 255, 255, 0.6)',
                  border: isTracking ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(255, 255, 255, 0.2)',
                  fontWeight: 800,
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
                    background: isTracking ? '#22c55e' : 'rgba(255, 255, 255, 0.4)',
                    animation: isTracking ? 'pulse 1.5s infinite' : 'none'
                  }} 
                />
                {isTracking ? 'TRACKING ACTIVE' : (activeSeconds > 0 ? 'PAUSED' : 'READY')}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
              {mode === 'run' ? 'Steady Run' : 'Mindful Walk'} • Connected to {source === 'wearable' ? 'Apple Watch / Garmin' : 'Phone Step Sensors'}
            </p>
          </div>
        </div>

        {/* Exit / Minimize button */}
        <button
          type="button"
          onClick={() => setIsFullScreen(false)}
          className="btn btn-secondary"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            padding: '0.5rem 0.9rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.82rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer'
          }}
        >
          <Minimize2 size={16} />
          <span>Exit Full Screen</span>
        </button>
      </div>

      {/* Main Full-Screen Content */}
      <div 
        style={{
          maxWidth: 960,
          width: '100%',
          margin: 'auto',
          padding: '1.5rem 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem'
        }}
      >
        {/* Giant Live Timer & Cadence Ring */}
        <div 
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1.5rem',
            borderRadius: '24px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0.4) 100%)',
            border: '1.5px solid rgba(99, 102, 241, 0.3)',
            width: '100%',
            maxWidth: 580,
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
          }}
        >
          <span 
            style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'var(--accent-primary-light, #818cf8)',
              marginBottom: '0.4rem'
            }}
          >
            {timerDirection === 'countdown' ? 'TIME REMAINING' : 'ELAPSED DURATION'}
          </span>

          <div 
            style={{
              fontSize: '4.5rem',
              fontWeight: 900,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '3px',
              color: '#ffffff',
              lineHeight: 1,
              margin: '0.2rem 0',
              textShadow: '0 0 30px rgba(99, 102, 241, 0.6)'
            }}
          >
            {getDisplayDuration()}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
              Goal: <strong>{targetMinutes} mins</strong> ({timerDirection === 'countdown' ? 'Countdown' : timerDirection === 'countup' ? 'Count Up' : 'Free'})
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
            <span style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 700 }}>
              ⚡ Cadence: {liveCadence}
            </span>
          </div>
        </div>

        {/* 4 Big Metrics HUD Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            width: '100%'
          }}
        >
          {/* Metric 1: Steps */}
          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#a78bfa', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <Footprints size={16} /> LIVE STEPS
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>
              {sessionSteps.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '0.35rem' }}>
              {isTracking ? 'Counting in real-time...' : 'Total session steps'}
            </div>
          </div>

          {/* Metric 2: Distance */}
          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <Compass size={16} /> DISTANCE
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>
              {distanceKm} <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)' }}>km</span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '0.35rem' }}>
              GPS / Step stride estimate
            </div>
          </div>

          {/* Metric 3: Est. Calories */}
          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#fb923c', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <Flame size={16} /> EST. ENERGY BURN
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>
              {estimatedCalories} <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)' }}>kcal</span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '0.35rem' }}>
              MET Metabolic estimate
            </div>
          </div>

          {/* Metric 4: Pace */}
          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#4ade80', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <Zap size={16} /> ESTIMATED PACE
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>
              {estimatedPace}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '0.35rem' }}>
              {mode === 'run' ? 'Running Cadence' : 'Walking Cadence'}
            </div>
          </div>
        </div>

        {/* Quick Settings Bar in Full Screen */}
        <div 
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.75rem',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0.85rem 1.15rem',
            borderRadius: 'var(--radius-md)'
          }}
        >
          {/* Mode switch */}
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)' }}>Mode:</span>
            <button
              onClick={() => setMode('walk')}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                border: mode === 'walk' ? '1.5px solid var(--accent-primary)' : '1px solid rgba(255, 255, 255, 0.15)',
                background: mode === 'walk' ? 'var(--accent-primary)' : 'transparent',
                color: '#ffffff',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🚶 Mindful Walk
            </button>
            <button
              onClick={() => setMode('run')}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                border: mode === 'run' ? '1.5px solid var(--accent-primary)' : '1px solid rgba(255, 255, 255, 0.15)',
                background: mode === 'run' ? 'var(--accent-primary)' : 'transparent',
                color: '#ffffff',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🏃 Steady Run
            </button>
          </div>

          {/* Target Duration selector */}
          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)' }}>Target:</span>
            {[15, 20, 30, 45, 60].map(min => (
              <button
                key={min}
                disabled={isTracking}
                onClick={() => { setTargetMinutes(min); setActiveSeconds(0); }}
                style={{
                  padding: '0.25rem 0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  border: targetMinutes === min ? '1.5px solid var(--accent-primary)' : '1px solid rgba(255, 255, 255, 0.12)',
                  background: targetMinutes === min ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                  color: targetMinutes === min ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: isTracking ? 'not-allowed' : 'pointer',
                  opacity: isTracking && targetMinutes !== min ? 0.4 : 1
                }}
              >
                {min}m
              </button>
            ))}
          </div>

          {/* Sensor source */}
          <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)' }}>Sensor:</span>
            <button
              onClick={() => setSource('smartphone')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: source === 'smartphone' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                color: source === 'smartphone' ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Smartphone size={12} /> Phone
            </button>
            <button
              onClick={() => setSource('wearable')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: source === 'wearable' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                color: source === 'wearable' ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Watch size={12} /> Wearable
            </button>
          </div>
        </div>

        {/* Large Action Controls HUD */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            width: '100%',
            maxWidth: 650,
            marginTop: '0.5rem'
          }}
        >
          {!isTracking && activeSeconds === 0 ? (
            <button 
              onClick={() => handleStart(false)} 
              className="btn btn-primary"
              style={{
                flex: 1,
                padding: '1.25rem',
                fontSize: '1.2rem',
                fontWeight: 900,
                gap: '0.6rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 10px 30px rgba(99, 102, 241, 0.5)'
              }}
            >
              <Play size={24} /> START {mode === 'walk' ? 'WALK' : 'RUN'} ({timerDirection === 'countdown' ? `${targetMinutes}m Countdown` : timerDirection === 'countup' ? `0 → ${targetMinutes}m` : 'Free'})
            </button>
          ) : (
            <>
              <button 
                onClick={() => setIsTracking(!isTracking)} 
                className="btn btn-secondary"
                style={{
                  flex: 1,
                  padding: '1.1rem',
                  gap: '0.5rem',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: 'var(--radius-lg)'
                }}
              >
                {isTracking ? <Pause size={20} /> : <Play size={20} />}
                <span>{isTracking ? 'Pause' : 'Resume'}</span>
              </button>

              <button 
                onClick={handleStop} 
                className="btn btn-primary"
                style={{
                  flex: 1.2,
                  padding: '1.1rem',
                  gap: '0.5rem',
                  fontWeight: 900,
                  fontSize: '1.05rem',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
                }}
              >
                <Square size={20} /> Finish & Save
              </button>

              <button 
                onClick={handleDiscard} 
                className="btn btn-secondary"
                style={{
                  padding: '1.1rem 1.25rem',
                  gap: '0.4rem',
                  color: '#ef4444',
                  borderColor: 'rgba(239, 68, 68, 0.5)',
                  background: 'rgba(239, 68, 68, 0.1)',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  borderRadius: 'var(--radius-lg)'
                }}
                title="Stop and delete this activity without saving"
              >
                <Trash2 size={18} />
                <span>Discard</span>
              </button>
            </>
          )}
        </div>

        {/* Completion Summary Modal / Card in Full Screen */}
        {completedSummary && (
          <div 
            style={{
              width: '100%',
              maxWidth: 650,
              marginTop: '1rem',
              padding: '1.5rem',
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
              border: '2px solid #22c55e',
              borderRadius: 'var(--radius-lg)',
              animation: 'fadeIn 0.25s ease-out',
              textAlign: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
              <CheckCircle size={24} color="#22c55e" />
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#ffffff', fontWeight: 900 }}>
                Activity Complete! 🎉
              </h3>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 1.25rem 0' }}>
              Saved to your daily activity totals via {completedSummary.source}. Outstanding movement effort!
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.85rem 0.5rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)' }}>DURATION</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffffff' }}>{completedSummary.durationMins}m</div>
              </div>
              <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.85rem 0.5rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)' }}>STEPS</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#a78bfa' }}>{completedSummary.steps}</div>
              </div>
              <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.85rem 0.5rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)' }}>DISTANCE</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#38bdf8' }}>{completedSummary.distanceKm}km</div>
              </div>
              <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.85rem 0.5rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)' }}>CALORIES</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fb923c' }}>{completedSummary.estimatedCalories}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => { handleReset(); setIsFullScreen(false); }}
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.5rem', fontWeight: 800 }}
              >
                Done & Return to Move Hub
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-secondary"
                style={{ padding: '0.75rem 1.25rem', fontWeight: 700, background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff' }}
              >
                Track Another Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // =========================================================================
  // 2. ALWAYS-VISIBLE PROMINENT INLINE MOVE HUB CARD
  // =========================================================================
  return (
    <>
      {isFullScreen && renderFullScreenView()}

      <div 
        className="card-glass" 
        style={{ 
          padding: '1.35rem 1.5rem', 
          borderRadius: 'var(--radius-lg)',
          border: '1.5px solid var(--accent-primary)',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, var(--bg-glass-card) 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.15rem'
        }}
      >
        {/* Card Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div 
              style={{ 
                width: 44, 
                height: 44, 
                borderRadius: 'var(--radius-md)', 
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, #3b82f6 100%)', 
                color: '#ffffff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '1.35rem',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
              }}
            >
              🏃
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.15rem' }}>
                <span className="pill-badge primary" style={{ fontSize: '0.68rem', fontWeight: 800 }}>
                  <Footprints size={12} /> LIVE MOVE TRACKER
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  ({source === 'wearable' ? 'Apple Watch / Garmin' : 'Phone Step Sensors'})
                </span>
              </div>
              <h4 style={{ fontSize: '1.08rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>
                2. Live Move Tracker — Outdoor & Indoor Activity
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
                Real-time active tracking for walks, runs, hikes & daily movement.
              </p>
            </div>
          </div>

          {/* Action Buttons: Full Screen Trigger & Sensor Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Open Full Screen Button */}
            <button
              type="button"
              onClick={() => setIsFullScreen(true)}
              className="btn btn-secondary btn-sm"
              style={{
                fontSize: '0.78rem',
                padding: '0.4rem 0.8rem',
                gap: '0.35rem',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                borderColor: 'var(--accent-primary)',
                background: 'var(--accent-primary-light)'
              }}
              title="Open full-screen live tracking HUD"
            >
              <Maximize2 size={14} />
              <span>Full Screen</span>
            </button>

            {/* Source Toggle */}
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
                <Watch size={12} /> Wearable
              </button>
            </div>
          </div>
        </div>

        {/* Target Duration & Count Direction Selector */}
        <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem 0.95rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.65rem' }}>
          
          {/* Goal Duration Preset */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)' }}>Target:</span>
            {[15, 20, 30, 45, 60].map(min => (
              <button
                key={min}
                type="button"
                disabled={isTracking}
                onClick={() => { setTargetMinutes(min); setActiveSeconds(0); }}
                style={{
                  padding: '0.2rem 0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  border: targetMinutes === min ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  background: targetMinutes === min ? 'var(--accent-primary-light)' : 'transparent',
                  color: targetMinutes === min ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: isTracking ? 'not-allowed' : 'pointer',
                  opacity: isTracking && targetMinutes !== min ? 0.5 : 1
                }}
              >
                {min}m
              </button>
            ))}
          </div>

          {/* Count Up vs Count Down Toggle */}
          <div style={{ display: 'flex', gap: '0.2rem', background: 'var(--bg-tertiary)', padding: '0.2rem', borderRadius: 'var(--radius-pill)' }}>
            <button
              type="button"
              onClick={() => setTimerDirection('countdown')}
              style={{
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: timerDirection === 'countdown' ? 'var(--accent-primary)' : 'transparent',
                color: timerDirection === 'countdown' ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              ⏱️ Count Down ({targetMinutes}m → 0)
            </button>

            <button
              type="button"
              onClick={() => setTimerDirection('countup')}
              style={{
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: timerDirection === 'countup' ? 'var(--accent-primary)' : 'transparent',
                color: timerDirection === 'countup' ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🎯 Count Up (0 → {targetMinutes}m)
            </button>

            <button
              type="button"
              onClick={() => setTimerDirection('free')}
              style={{
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: timerDirection === 'free' ? 'var(--accent-primary)' : 'transparent',
                color: timerDirection === 'free' ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🌊 Free
            </button>
          </div>
        </div>

        {/* Activity Type Selection */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setMode('walk')}
            className={`btn btn-sm ${mode === 'walk' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontWeight: 700 }}
          >
            🚶 Mindful Walk
          </button>
          <button
            type="button"
            onClick={() => setMode('run')}
            className={`btn btn-sm ${mode === 'run' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontWeight: 700 }}
          >
            🏃 Steady Run
          </button>
        </div>

        {/* Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.65rem', textAlign: 'center' }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 0.5rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem', fontWeight: 700 }}>
              {timerDirection === 'countdown' ? 'Remaining' : 'Duration'}
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
              {getDisplayDuration()}
            </div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {timerDirection === 'countdown' ? `of ${targetMinutes}m goal` : timerDirection === 'countup' ? `Goal: ${targetMinutes}m` : 'Free'}
            </div>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 0.5rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem', fontWeight: 700 }}>Steps</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--accent-primary)', fontVariantNumeric: 'tabular-nums' }}>
              {sessionSteps.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: 2 }}>live steps</div>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 0.5rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem', fontWeight: 700 }}>Distance</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
              {distanceKm} <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>km</span>
            </div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: 2 }}>estimated</div>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 0.5rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem', fontWeight: 700 }}>Est. Burn</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--accent-secondary)', fontVariantNumeric: 'tabular-nums' }}>
              {estimatedCalories} <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>kcal</span>
            </div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: 2 }}>MET energy</div>
          </div>
        </div>

        {/* Primary Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {!isTracking && activeSeconds === 0 ? (
            <>
              <button 
                type="button"
                onClick={() => handleStart(false)} 
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.85rem', fontWeight: 800, gap: '0.4rem' }}
              >
                <Play size={18} /> Start {mode === 'walk' ? 'Walk' : 'Run'}
              </button>
              <button 
                type="button"
                onClick={() => handleStart(true)} 
                className="btn btn-secondary"
                style={{
                  padding: '0.85rem 1.15rem',
                  fontWeight: 800,
                  gap: '0.4rem',
                  color: 'var(--accent-primary)',
                  borderColor: 'var(--accent-primary)',
                  background: 'var(--accent-primary-light)'
                }}
              >
                <Maximize2 size={16} />
                <span>Start in Full Screen</span>
              </button>
            </>
          ) : (
            <>
              <button 
                type="button"
                onClick={() => setIsTracking(!isTracking)} 
                className="btn btn-secondary"
                style={{ flex: 1, padding: '0.85rem', gap: '0.4rem', fontWeight: 700 }}
              >
                {isTracking ? <Pause size={17} /> : <Play size={17} />}
                <span>{isTracking ? 'Pause' : 'Resume'}</span>
              </button>

              <button 
                type="button"
                onClick={handleStop} 
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.85rem', gap: '0.4rem', fontWeight: 800 }}
              >
                <Square size={17} /> Finish & Save
              </button>

              <button 
                type="button"
                onClick={handleDiscard} 
                className="btn btn-secondary"
                style={{ padding: '0.85rem 1rem', gap: '0.4rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)', fontWeight: 700 }}
                title="Stop and delete this activity without saving"
              >
                <Trash2 size={17} />
                <span>Stop & Delete</span>
              </button>
            </>
          )}
        </div>

        {/* Inline Completion Summary Card */}
        {completedSummary && (
          <div 
            style={{
              padding: '1.15rem 1.25rem',
              background: 'var(--accent-primary-light)',
              border: '1.5px solid var(--accent-primary)',
              borderRadius: 'var(--radius-md)',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={18} color="var(--accent-primary)" />
                <h4 style={{ margin: 0, fontSize: '0.98rem', color: 'var(--accent-primary)', fontWeight: 800 }}>
                  Activity Logged! 🎉
                </h4>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
              >
                Dismiss
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.55rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>TIME</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>{completedSummary.durationMins}m</div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.55rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>STEPS</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{completedSummary.steps}</div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.55rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>DIST</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>{completedSummary.distanceKm}km</div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.55rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>CALORIES</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>{completedSummary.estimatedCalories}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
