import React, { useState, useEffect } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { Play, Pause, Square, Footprints, Flame, Timer, Zap, Smartphone, Watch, CheckCircle, RotateCcw, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ActivityTracker() {
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

  const handleStop = () => {
    setIsTracking(false);
    const durationMins = Math.max(1, Math.round(activeSeconds / 60));
    setActiveWorkoutMinutes(prev => prev + durationMins);

    const summary = {
      durationMins,
      steps: sessionSteps,
      distanceKm: ((sessionSteps * 0.75) / 1000).toFixed(2),
      estimatedCalories: Math.round(sessionSteps * (mode === 'run' ? 0.055 : 0.04)),
      source: source === 'wearable' ? 'Smartwatch Auto-Detect' : 'Phone Step Sensors'
    };
    setCompletedSummary(summary);

    try {
      confetti({
        particleCount: 45,
        spread: 60,
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

  return (
    <div className="card-glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.8rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="pill-badge primary">
              <Footprints size={13} /> Live Move Tracker
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              (Connected to {source === 'wearable' ? 'Apple Watch / Garmin' : 'Phone Sensors'})
            </span>
          </div>
          <h3 style={{ fontSize: '1.25rem', marginTop: '0.2rem' }}>Outdoor & Indoor Activity</h3>
        </div>

        {/* Source Toggle */}
        <div style={{ display: 'flex', gap: '0.3rem', background: 'var(--bg-tertiary)', padding: '0.2rem', borderRadius: 'var(--radius-pill)' }}>
          <button
            onClick={() => setSource('smartphone')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: source === 'smartphone' ? 'var(--bg-secondary)' : 'transparent',
              color: source === 'smartphone' ? 'var(--accent-primary)' : 'var(--text-muted)',
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
              background: source === 'wearable' ? 'var(--bg-secondary)' : 'transparent',
              color: source === 'wearable' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Watch size={12} /> Wearable
          </button>
        </div>
      </div>

      {/* Target Duration & Count Direction Selector */}
      <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        
        {/* Goal Duration Preset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Target:</span>
          {[15, 20, 30, 45, 60].map(min => (
            <button
              key={min}
              disabled={isTracking}
              onClick={() => { setTargetMinutes(min); setActiveSeconds(0); }}
              style={{
                padding: '0.25rem 0.6rem',
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
        <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-tertiary)', padding: '0.2rem', borderRadius: 'var(--radius-pill)' }}>
          <button
            onClick={() => setTimerDirection('countdown')}
            style={{
              padding: '0.25rem 0.65rem',
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
            onClick={() => setTimerDirection('countup')}
            style={{
              padding: '0.25rem 0.65rem',
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
            onClick={() => setTimerDirection('free')}
            style={{
              padding: '0.25rem 0.65rem',
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
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button
          onClick={() => setMode('walk')}
          className={`btn btn-sm ${mode === 'walk' ? 'btn-primary' : 'btn-secondary'}`}
        >
          🚶 Mindful Walk
        </button>
        <button
          onClick={() => setMode('run')}
          className={`btn btn-sm ${mode === 'run' ? 'btn-primary' : 'btn-secondary'}`}
        >
          🏃 Steady Run
        </button>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.25rem', textAlign: 'center' }}>
        <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 0.5rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
            {timerDirection === 'countdown' ? 'Remaining' : 'Duration'}
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {getDisplayDuration()}
          </div>
          <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: 2 }}>
            {timerDirection === 'countdown' ? `of ${targetMinutes}m goal` : timerDirection === 'countup' ? `Goal: ${targetMinutes}m` : 'Free'}
          </div>
        </div>

        <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 0.5rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Steps</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{sessionSteps}</div>
          <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: 2 }}>live steps</div>
        </div>

        <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 0.5rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Distance</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>{distanceKm} <span style={{ fontSize: '0.7rem' }}>km</span></div>
          <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: 2 }}>estimated</div>
        </div>

        <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 0.5rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Est. Burn *</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>{estimatedCalories} <span style={{ fontSize: '0.7rem' }}>kcal</span></div>
          <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: 2 }}>MET energy</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {!isTracking && activeSeconds === 0 ? (
          <button 
            onClick={() => { setIsTracking(true); setCompletedSummary(null); }} 
            className="btn btn-primary"
            style={{ flex: 1, padding: '0.85rem', fontWeight: 800, gap: '0.4rem' }}
          >
            <Play size={18} /> Start {mode === 'walk' ? 'Walk' : 'Run'} ({timerDirection === 'countdown' ? `${targetMinutes}m Countdown` : timerDirection === 'countup' ? `0 → ${targetMinutes}m` : 'Free'})
          </button>
        ) : (
          <>
            <button 
              onClick={() => setIsTracking(!isTracking)} 
              className="btn btn-secondary"
              style={{ flex: 1, padding: '0.85rem', gap: '0.4rem', fontWeight: 700 }}
            >
              {isTracking ? <Pause size={17} /> : <Play size={17} />}
              <span>{isTracking ? 'Pause' : 'Resume'}</span>
            </button>

            <button 
              onClick={handleStop} 
              className="btn btn-primary"
              style={{ flex: 1, padding: '0.85rem', gap: '0.4rem', fontWeight: 800 }}
            >
              <Square size={17} /> Finish & Save
            </button>

            <button 
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

      {/* Completion Summary Card */}
      {completedSummary && (
        <div 
          style={{
            marginTop: '1.25rem',
            padding: '1.25rem',
            background: 'var(--accent-primary-light)',
            border: '1.5px solid var(--accent-primary)',
            borderRadius: 'var(--radius-md)',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
            <CheckCircle size={18} color="var(--accent-primary)" />
            <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--accent-primary)', fontWeight: 800 }}>
              Activity Logged! 🎉
            </h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center', marginTop: '0.75rem' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>TIME</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{completedSummary.durationMins}m</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>STEPS</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{completedSummary.steps}</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>DIST</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{completedSummary.distanceKm}km</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>CALORIES</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>{completedSummary.estimatedCalories}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
