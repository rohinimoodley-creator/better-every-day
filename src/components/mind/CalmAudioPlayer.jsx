import React from 'react';
import { useAudio } from '../../context/AudioContext';
import { Play, Pause, Volume2, VolumeX, Moon, Sparkles, CloudRain, Waves, Trees, Radio } from 'lucide-react';

export default function CalmAudioPlayer() {
  const {
    isPlaying,
    activeTracks,
    volumes,
    toggleTrack,
    setTrackVolume,
    stopAll,
    sleepTimerMinutes,
    timerSecondsRemaining,
    startSleepTimer
  } = useAudio();

  const tracks = [
    { id: 'rain', name: 'Gentle Rain', icon: '🌧️', desc: 'Soft drops on green leaves' },
    { id: 'ocean', name: 'Ocean Swell', icon: '🌊', desc: 'Slow rhythmic tidal breathing' },
    { id: 'brownNoise', name: 'Deep Brown Noise', icon: '📻', desc: 'Heavy soothing low-pass blanket' },
    { id: 'forest', name: '528Hz Forest Peace', icon: '🌲', desc: 'Harmonic frequency for deep calm' },
    { id: 'sleepDrone', name: 'Theta Sleep Drone', icon: '🌙', desc: '432Hz binaural wave relaxation' }
  ];

  const formatTimer = (secs) => {
    if (!secs) return '';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="card-glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.8rem', marginBottom: '1.25rem' }}>
        <div>
          <span className="pill-badge purple" style={{ marginBottom: '0.25rem' }}>
            <Radio size={12} /> Web Audio Procedural Synthesizer
          </span>
          <h3 style={{ fontSize: '1.35rem', marginTop: '0.2rem' }}>Ambient Calm Soundscapes 🎧</h3>
        </div>

        {/* Master Stop & Timer Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {timerSecondsRemaining && (
            <span className="pill-badge purple" style={{ fontSize: '0.78rem' }}>
              <Moon size={12} /> Sleep Timer: {formatTimer(timerSecondsRemaining)}
            </span>
          )}

          {isPlaying && (
            <button 
              onClick={stopAll}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', color: 'var(--accent-rose)' }}
            >
              <VolumeX size={14} /> Stop All
            </button>
          )}
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
        Synthesized live directly in your browser. Mix and blend multiple ambient sounds to build your ideal sanctuary.
      </p>

      {/* Sound Tracks Mixer Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
        {tracks.map(track => {
          const isActive = activeTracks[track.id];
          return (
            <div
              key={track.id}
              style={{
                background: isActive ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                border: `1px solid ${isActive ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{track.icon}</span>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', margin: 0 }}>{track.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{track.desc}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleTrack(track.id)}
                  className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
                >
                  {isActive ? <><Pause size={13} /> Active</> : <><Play size={13} /> Play</>}
                </button>
              </div>

              {/* Volume Slider if Active */}
              {isActive && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                  <Volume2 size={14} color="var(--accent-primary)" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volumes[track.id]}
                    onChange={e => setTrackVolume(track.id, parseFloat(e.target.value))}
                    style={{ flex: 1, accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', width: 28 }}>
                    {Math.round(volumes[track.id] * 100)}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sleep Timer Settings */}
      <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Moon size={16} color="var(--accent-purple)" />
          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Sleep Timer & Auto-Fade
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {[
            { mins: 5, label: '5m' },
            { mins: 15, label: '15m' },
            { mins: 30, label: '30m' },
            { mins: 60, label: '60m' }
          ].map(t => (
            <button
              key={t.mins}
              onClick={() => startSleepTimer(t.mins)}
              style={{
                background: sleepTimerMinutes === t.mins ? 'var(--accent-purple)' : 'var(--bg-secondary)',
                color: sleepTimerMinutes === t.mins ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-pill)',
                padding: '0.3rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
