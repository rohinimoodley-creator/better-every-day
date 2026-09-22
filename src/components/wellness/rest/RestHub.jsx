import React, { useState, useMemo, useEffect } from 'react';
import { useWellness } from '../../../context/WellnessContext';
import { useAudio } from '../../../context/AudioContext';
import SoundscapesHub from '../soundscapes/SoundscapesHub';
import {
  Moon,
  Volume2,
  Watch,
  Plus,
  X,
  Clock,
  Sparkles,
  BedDouble,
  ChevronRight,
  Music
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Helper to calculate duration between sleep time (HH:MM) and wake time (HH:MM)
function calculateSleepDuration(sleepTimeStr, wakeTimeStr) {
  if (!sleepTimeStr || !wakeTimeStr) return { hours: 7, minutes: 30, decimal: 7.5, text: '7h 30m' };
  
  const [sH, sM] = sleepTimeStr.split(':').map(Number);
  const [wH, wM] = wakeTimeStr.split(':').map(Number);

  let sTotal = sH * 60 + (sM || 0);
  let wTotal = wH * 60 + (wM || 0);

  if (wTotal <= sTotal) {
    wTotal += 24 * 60; // Next day / crosses midnight
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

export default function RestHub({ initialSubModal = null, onNavigateTab }) {
  const { 
    userProfile, 
    sleepLogs, 
    logSleepManual, 
    syncDeviceSleep,
    dailyRhythm,
    getWellnessDayInfo
  } = useWellness();

  const { isPlaying, activeSoundObj, soundLibrary = [] } = useAudio();

  // Launcher Pop-up States (2 buttons)
  const [isTrackSleepOpen, setIsTrackSleepOpen] = useState(false);
  const [isSoundscapeOpen, setIsSoundscapeOpen] = useState(false);

  // Manual Sleep Form inside Track Sleep modal
  const [sleepTime, setSleepTime] = useState(dailyRhythm?.sleepTime || '22:45');
  const [wakeTime, setWakeTime] = useState(dailyRhythm?.dayStartTime || '07:15');
  const [sleepQuality, setSleepQuality] = useState('Deep & Restorative');
  const [showLogForm, setShowLogForm] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState('');

  useEffect(() => {
    if (initialSubModal === 'soundscape' || initialSubModal === 'soundscapes') {
      setIsSoundscapeOpen(true);
    } else if (initialSubModal === 'sleep' || initialSubModal === 'track') {
      setIsTrackSleepOpen(true);
    }
  }, [initialSubModal]);

  const liveDuration = useMemo(() => {
    return calculateSleepDuration(sleepTime, wakeTime);
  }, [sleepTime, wakeTime]);

  const latestSleep = (sleepLogs && sleepLogs[0]) || {
    hours: 7.5,
    sleepTime: dailyRhythm?.sleepTime || '22:45',
    wakeTime: dailyRhythm?.dayStartTime || '07:15',
    quality: 'Deep & Restorative',
    deepSleep: '1h 45m',
    rem: '2h 10m',
    light: '3h 35m',
    source: 'synced'
  };

  const handleSaveManualSleep = (e) => {
    e.preventDefault();
    if (logSleepManual) {
      logSleepManual({
        sleepTime,
        wakeTime,
        quality: sleepQuality
      });
    }
    setShowLogForm(false);
    try {
      confetti({ particleCount: 25, spread: 45, origin: { y: 0.7 } });
    } catch(err) {}
  };

  const handleDeviceSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      if (syncDeviceSleep) {
        const synced = syncDeviceSleep();
        setIsSyncing(false);
        setSyncSuccessMsg(`Synced with ${synced?.deviceName || synced?.source || 'Wearable'}! (${synced?.durationHours || synced?.hours || 7.5} hrs logged)`);
      } else {
        setIsSyncing(false);
        setSyncSuccessMsg('Synced with Apple Health / Wearables!');
      }
      setTimeout(() => setSyncSuccessMsg(''), 3000);
      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      } catch(err) {}
    }, 1000);
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '3.5rem' }}>
      
      {/* 1. Clean Compact Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.15rem' }}>
          <span className="pill-badge primary" style={{ fontSize: '0.7rem' }}>
            <Moon size={11} /> Rest & Recovery
          </span>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>
          Rest & Soundscape 🌙🎵
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
          Choose an option below to track sleep or relax with ambient soundscapes.
        </p>
      </div>

      {/* 2. Sleek Launcher Grid (2 buttons) */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '0.75rem' 
        }}
      >
        {/* 1. Track Sleep */}
        <button
          type="button"
          onClick={() => setIsTrackSleepOpen(true)}
          className="card-glass card-interactive"
          style={{
            background: 'linear-gradient(135deg, rgba(123, 97, 255, 0.12) 0%, var(--bg-glass-card) 100%)',
            border: '1.5px solid rgba(123, 97, 255, 0.22)',
            borderRadius: 'var(--radius-card)',
            padding: '1.25rem 0.95rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            minHeight: '130px',
            boxShadow: 'var(--shadow-subtle)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <div 
            style={{ 
              width: 46, 
              height: 46, 
              borderRadius: '50%', 
              background: '#7b61ff', 
              color: '#ffffff',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(123, 97, 255, 0.25)'
            }}
          >
            <Moon size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.94rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Track Sleep
            </h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {latestSleep.durationHours || latestSleep.hours} hrs • {latestSleep.quality}
            </span>
          </div>
        </button>

        {/* 2. Soundscape */}
        <button
          type="button"
          onClick={() => setIsSoundscapeOpen(true)}
          className="card-glass card-interactive"
          style={{
            background: 'linear-gradient(135deg, rgba(58, 134, 200, 0.12) 0%, var(--bg-glass-card) 100%)',
            border: '1.5px solid rgba(58, 134, 200, 0.22)',
            borderRadius: 'var(--radius-card)',
            padding: '1.25rem 0.95rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            minHeight: '130px',
            boxShadow: 'var(--shadow-subtle)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <div 
            style={{ 
              width: 46, 
              height: 46, 
              borderRadius: '50%', 
              background: '#3a86c8', 
              color: '#ffffff',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(58, 134, 200, 0.25)'
            }}
          >
            <Volume2 size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.94rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Soundscape
            </h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {isPlaying ? '● Playing ambient calm' : 'Rain, ocean & drones'}
            </span>
          </div>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2 FEATURE POP-UP SHEETS / MODALS                                          */}
      {/* ========================================================================= */}

      {/* 1. Track Sleep Pop-Up */}
      {isTrackSleepOpen && (
        <div className="modal-backdrop" onClick={() => setIsTrackSleepOpen(false)} style={{ zIndex: 1100 }}>
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
              gap: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Moon size={18} color="#7b61ff" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Sleep Tracker & Recovery
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsTrackSleepOpen(false)}
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

            {/* Quick Actions inside modal */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleDeviceSync}
                disabled={isSyncing}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', gap: '0.35rem', padding: '0.4rem 0.75rem' }}
              >
                <Watch size={13} color="var(--accent-primary)" />
                <span>{isSyncing ? 'Syncing...' : 'Sync Wearable ⌚'}</span>
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

            {syncSuccessMsg && (
              <div style={{ background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', fontWeight: 700 }}>
                ✓ {syncSuccessMsg}
              </div>
            )}

            {/* Manual Sleep Logging Form */}
            {showLogForm && (
              <form onSubmit={handleSaveManualSleep} className="card-glass" style={{ padding: '1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Moon size={14} color="var(--accent-primary)" /> Log Last Night's Sleep
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <div>
                    <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                      Bedtime
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
                    <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
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
                    <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                      How Rested?
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

                <div style={{ background: 'var(--bg-secondary)', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Calculated Duration:
                  </span>
                  <span style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
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

            {/* Latest Sleep Score Card */}
            <div 
              className="card-glass"
              style={{
                padding: '1.1rem',
                background: 'linear-gradient(135deg, rgba(123, 97, 255, 0.08) 0%, rgba(58, 134, 200, 0.08) 100%)',
                border: '1px solid rgba(123, 97, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem'
              }}
            >
              <div 
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7b61ff 0%, #3a86c8 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Moon size={24} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.1rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Last Logged Sleep
                  </span>
                  <span className="pill-badge primary" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                    {latestSleep.source === 'manual' ? 'Manual Entry' : 'Device Synced'}
                  </span>
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.1rem 0' }}>
                  {latestSleep.durationHours || latestSleep.hours} hrs
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--accent-calm)', fontWeight: 700 }}>
                  ✨ {latestSleep.quality} ({latestSleep.sleepTime} → {latestSleep.wakeTime})
                </div>
              </div>
            </div>

            {/* Sleep Stages Architecture */}
            <div className="card-glass" style={{ padding: '1.1rem' }}>
              <h3 style={{ fontSize: '0.94rem', fontWeight: 800, margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={15} color="var(--accent-primary)" /> Sleep Stage Breakdown
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.65rem' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Deep Sleep</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#7b61ff', marginTop: '0.15rem' }}>{latestSleep.deepSleep || '1h 45m'}</div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Physical tissue repair</span>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>REM Sleep</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#3a86c8', marginTop: '0.15rem' }}>{latestSleep.remSleep || latestSleep.rem || '2h 10m'}</div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Memory & mood reset</span>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Light Sleep</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '0.15rem' }}>{latestSleep.lightSleep || latestSleep.light || '3h 35m'}</div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Restful baseline</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Soundscape Pop-Up */}
      {isSoundscapeOpen && (
        <div className="modal-backdrop" onClick={() => setIsSoundscapeOpen(false)} style={{ zIndex: 1100 }}>
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
                <Volume2 size={18} color="#3a86c8" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Ambient Soundscapes
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsSoundscapeOpen(false)}
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

            <SoundscapesHub />
          </div>
        </div>
      )}

    </div>
  );
}
