import React, { useState, useMemo } from 'react';
import { useWellness } from '../../../context/WellnessContext';
import { useAudio } from '../../../context/AudioContext';
import {
  Moon,
  Sparkles,
  Heart,
  Clock,
  Volume2,
  CheckCircle,
  Sun,
  Shield,
  Zap,
  BedDouble,
  ChevronRight,
  Watch,
  Plus,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ContextualPip from '../../mascot/ContextualPip';

// Helper to calculate duration between sleep time (HH:MM) and wake time (HH:MM)
function calculateSleepDuration(sleepTimeStr, wakeTimeStr) {
  if (!sleepTimeStr || !wakeTimeStr) return { hours: 7, minutes: 30, decimal: 7.5, text: '7h 30m' };
  
  const [sH, sM] = sleepTimeStr.split(':').map(Number);
  const [wH, wM] = wakeTimeStr.split(':').map(Number);

  let sTotal = sH * 60 + sM;
  let wTotal = wH * 60 + wM;

  if (wTotal <= sTotal) {
    wTotal += 24 * 60; // Next day
  }

  const diffMin = wTotal - sTotal;
  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;
  const decimal = parseFloat((diffMin / 60).toFixed(1));

  return {
    hours: h,
    minutes: m,
    decimal,
    text: `${h}h ${m > 0 ? `${m}m` : ''}`
  };
}

export default function RestHub({ onNavigateTab }) {
  const { 
    userProfile, 
    dailyCheckIn, 
    sleepLogs, 
    logSleepManual, 
    syncDeviceSleep 
  } = useWellness();

  // Manual Sleep Form State
  const [sleepTime, setSleepTime] = useState('22:45');
  const [wakeTime, setWakeTime] = useState('07:15');
  const [sleepQuality, setSleepQuality] = useState('Deep & Restorative');
  const [showLogForm, setShowLogForm] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState('');

  // Bedtime Routine Target
  const [targetBedtime, setTargetBedtime] = useState('22:30');
  const [targetWakeup, setTargetWakeup] = useState('07:00');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Calculate live duration for form preview
  const liveDuration = useMemo(() => {
    return calculateSleepDuration(sleepTime, wakeTime);
  }, [sleepTime, wakeTime]);

  const latestSleep = sleepLogs[0] || {
    hours: 7.5,
    sleepTime: '22:45',
    wakeTime: '07:15',
    quality: 'Deep & Restorative',
    deepSleep: '1h 45m',
    rem: '2h 10m',
    light: '3h 35m'
  };

  const handleSaveManualSleep = (e) => {
    e.preventDefault();
    logSleepManual({
      sleepTime,
      wakeTime,
      quality: sleepQuality
    });
    setShowLogForm(false);
    try {
      confetti({ particleCount: 25, spread: 45, origin: { y: 0.7 } });
    } catch(err) {}
  };

  const handleDeviceSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const synced = syncDeviceSleep();
      setIsSyncing(false);
      setSyncSuccessMsg(`Synced with ${synced.source}! (${synced.hours} hrs logged)`);
      setTimeout(() => setSyncSuccessMsg(''), 3000);
      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      } catch(err) {}
    }, 1000);
  };

  const handleSaveRoutine = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    try {
      confetti({ particleCount: 20, spread: 35, origin: { y: 0.7 } });
    } catch(err) {}
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <span className="pill-badge primary" style={{ fontSize: '0.72rem' }}>
              <Moon size={12} /> Sleep & Night Recovery
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Rest & Night Recovery 🌙
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            Restorative sleep habits, wearable syncing, and calming ambient soundscapes.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleDeviceSync}
            disabled={isSyncing}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem', gap: '0.35rem', padding: '0.4rem 0.75rem' }}
            title="Sync sleep records from Apple Watch, Garmin, Fitbit or Oura"
          >
            <Watch size={13} color="var(--accent-primary)" />
            <span>{isSyncing ? 'Syncing...' : 'Sync Device Sleep ⌚'}</span>
          </button>

          <button
            onClick={() => setShowLogForm(prev => !prev)}
            className="btn btn-primary btn-sm"
            style={{ fontSize: '0.78rem', gap: '0.35rem', padding: '0.4rem 0.75rem' }}
          >
            <Plus size={13} />
            <span>{showLogForm ? 'Close Log Form' : 'Log Sleep Manually'}</span>
          </button>
        </div>
      </div>

      {syncSuccessMsg && (
        <div style={{ background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', fontWeight: 700 }}>
          ✓ {syncSuccessMsg}
        </div>
      )}

      {/* Contextual Sleepy / Cosy Pip */}
      <ContextualPip context="rest" layout="subtle" size={32} />

      {/* Manual Sleep Logging Form (Expandable) */}
      {showLogForm && (
        <form onSubmit={handleSaveManualSleep} className="card-glass" style={{ padding: '1.25rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)' }}>
          <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0 0 0.85rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Moon size={15} color="var(--accent-primary)" /> Log Last Night's Sleep
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                Sleep Time (Bedtime)
              </label>
              <input
                type="time"
                value={sleepTime}
                onChange={e => setSleepTime(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                Wake-Up Time
              </label>
              <input
                type="time"
                value={wakeTime}
                onChange={e => setWakeTime(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                How Rested Do You Feel?
              </label>
              <select
                value={sleepQuality}
                onChange={e => setSleepQuality(e.target.value)}
                className="select-field"
              >
                <option value="Deep & Restorative">Deep & Restorative 🌿</option>
                <option value="Good & Refreshed">Good & Refreshed ✨</option>
                <option value="Light / Broken">Light / Broken 🌙</option>
                <option value="Restless">Restless ☁️</option>
              </select>
            </div>
          </div>

          {/* Auto-calculated duration banner */}
          <div style={{ background: 'var(--bg-secondary)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Calculated Sleep Duration:
            </span>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
              {liveDuration.text} ({liveDuration.decimal} hrs)
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
              Save Sleep Entry
            </button>
            <button type="button" onClick={() => setShowLogForm(false)} className="btn btn-secondary btn-sm">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Sleep Quality Snapshot (Without Recovery Battery) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        
        {/* Latest Sleep Score Card */}
        <div 
          className="card-glass"
          style={{
            padding: '1.25rem',
            background: 'linear-gradient(135deg, rgba(123, 97, 255, 0.08) 0%, rgba(58, 134, 200, 0.08) 100%)',
            border: '1px solid rgba(123, 97, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div 
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7b61ff 0%, #3a86c8 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(123, 97, 255, 0.3)'
            }}
          >
            <Moon size={26} />
          </div>

          <div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Last Logged Sleep
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.1rem 0' }}>
              {latestSleep.hours} hrs
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--accent-calm)', fontWeight: 700 }}>
              ✨ {latestSleep.quality} ({latestSleep.sleepTime} → {latestSleep.wakeTime})
            </div>
          </div>
        </div>

        {/* Ambient Calm Soundscapes Action Card */}
        <div 
          className="card-glass card-interactive"
          onClick={() => onNavigateTab && onNavigateTab('soundscapes')}
          style={{
            padding: '1.25rem',
            background: 'linear-gradient(135deg, rgba(64, 145, 108, 0.08) 0%, rgba(123, 97, 255, 0.08) 100%)',
            border: '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div 
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(123, 97, 255, 0.15)',
                color: '#7b61ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Volume2 size={22} />
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Evening Wind-Down
              </div>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 800, margin: '0.1rem 0', color: 'var(--text-primary)' }}>
                Listen to Ambient Calm 🎧
              </h4>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                Rain, ocean, 528Hz forest & theta drones
              </span>
            </div>
          </div>

          <ChevronRight size={18} color="var(--text-muted)" />
        </div>
      </div>

      {/* Sleep Stages Architecture */}
      <div className="card-glass" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.85rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Clock size={16} color="var(--accent-primary)" /> Sleep Stage Architecture
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Deep Sleep</span>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#7b61ff', marginTop: '0.2rem' }}>{latestSleep.deepSleep || '1h 45m'}</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Physical tissue repair</span>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>REM Sleep</span>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#3a86c8', marginTop: '0.2rem' }}>{latestSleep.rem || '2h 10m'}</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Memory & mood reset</span>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Light Sleep</span>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '0.2rem' }}>{latestSleep.light || '3h 35m'}</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Restful baseline</span>
          </div>
        </div>
      </div>

      {/* Bedtime Routine Target */}
      <form onSubmit={handleSaveRoutine} className="card-glass" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.85rem 0' }}>
          Target Rest Rhythm
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
              Target Wind-Down Bedtime
            </label>
            <input
              type="time"
              value={targetBedtime}
              onChange={e => setTargetBedtime(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
              Target Wake-up Time
            </label>
            <input
              type="time"
              value={targetWakeup}
              onChange={e => setTargetWakeup(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button type="submit" className="btn btn-primary btn-sm">
            Save Rest Rhythm
          </button>
          {savedSuccess && (
            <span style={{ fontSize: '0.76rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
              ✓ Bedtime schedule updated!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

