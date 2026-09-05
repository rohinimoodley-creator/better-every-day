import React from 'react';
import { useAudio } from '../../../context/AudioContext';
import { Volume2, Play, Pause, Square, Clock, Sparkles, Sliders, Moon, Wind, Flame, Droplets, Waves, Trees, Radio } from 'lucide-react';
import ContextualPip from '../../mascot/ContextualPip';

export default function SoundscapesHub() {
  const {
    isPlaying,
    activeSoundId,
    activeSoundObj,
    volumes,
    soundLibrary = [],
    playSingleSound,
    toggleSingleSound,
    stopAll,
    setTrackVolume,
    selectedTimerMinutes,
    setSelectedTimerMinutes,
    timerSecondsRemaining
  } = useAudio();

  const currentVolume = activeSoundId && volumes ? (volumes[activeSoundId] || 0.5) : 0.5;

  const TIMER_OPTIONS = [
    { label: 'Endless (No Timer)', minutes: null },
    { label: '5 min', minutes: 5 },
    { label: '10 min', minutes: 10 },
    { label: '15 min', minutes: 15 },
    { label: '20 min', minutes: 20 },
    { label: '25 min', minutes: 25 },
    { label: '30 min', minutes: 30 },
    { label: '45 min', minutes: 45 },
    { label: '60 min', minutes: 60 }
  ];

  const formatTimerDisplay = (totalSec) => {
    if (totalSec == null) return '';
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getSoundIcon = (id) => {
    switch (id) {
      case 'rain': return <Droplets size={20} color="#3a86c8" />;
      case 'ocean': return <Waves size={20} color="#2a9d8f" />;
      case 'forest': return <Trees size={20} color="#40916c" />;
      case 'wind': return <Wind size={20} color="#52b788" />;
      case 'brownNoise': return <Radio size={20} color="#d97736" />;
      case 'whiteNoise': return <Radio size={20} color="#8d99ae" />;
      case 'fireplace': return <Flame size={20} color="#e76f51" />;
      case 'gentleAmbience': return <Sparkles size={20} color="#8b5cf6" />;
      case 'sleepDrone': return <Moon size={20} color="#7b61ff" />;
      default: return <Volume2 size={20} color="var(--accent-primary)" />;
    }
  };

  const handleTimerSelect = (mins) => {
    setSelectedTimerMinutes(mins);
    if (activeSoundId && isPlaying) {
      playSingleSound(activeSoundId, mins);
    }
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
          <span className="pill-badge primary">
            <Volume2 size={12} /> Ambient Calm & Soundscapes
          </span>
        </div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
          Ambient Soundscapes 🎧
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
          Pure synthesized natural soundscapes and restorative drones for deep sleep, focused calm, and mindful rest.
        </p>
      </div>

      {/* Contextual Rest Pip */}
      <ContextualPip context="rest" layout="subtle" size={32} />

      {/* Active Sound Bar / Now Playing Hero */}
      <div 
        className="card-glass"
        style={{
          padding: '1.5rem',
          background: isPlaying 
            ? 'linear-gradient(135deg, rgba(123, 97, 255, 0.12) 0%, rgba(58, 134, 200, 0.12) 100%)' 
            : 'var(--bg-secondary)',
          border: `1.5px solid ${isPlaying ? '#7b61ff' : 'var(--border-glass)'}`,
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div 
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: isPlaying ? 'linear-gradient(135deg, #7b61ff, #3a86c8)' : 'var(--bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isPlaying ? '#ffffff' : 'var(--text-muted)',
                boxShadow: isPlaying ? '0 4px 16px rgba(123, 97, 255, 0.35)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              {activeSoundObj ? getSoundIcon(activeSoundObj.id) : <Volume2 size={24} />}
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {isPlaying ? 'Currently Playing' : 'Selected Sound'}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {activeSoundObj ? `${activeSoundObj.icon} ${activeSoundObj.name}` : 'Choose a Sound Below'}
              </h3>
              {activeSoundObj && (
                <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                  {activeSoundObj.desc}
                </span>
              )}
            </div>
          </div>

          {/* Main Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              onClick={() => {
                const targetId = activeSoundId || soundLibrary[0]?.id || 'rain';
                toggleSingleSound(targetId, selectedTimerMinutes);
              }}
              className="btn btn-primary"
              style={{
                padding: '0.65rem 1.4rem',
                fontSize: '0.9rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: isPlaying ? 'var(--accent-primary)' : 'linear-gradient(135deg, #7b61ff, #3a86c8)',
                boxShadow: '0 4px 14px rgba(123, 97, 255, 0.3)'
              }}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              <span>{isPlaying ? 'Pause' : 'Play Sound'}</span>
            </button>

            {isPlaying && (
              <button
                onClick={stopAll}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.65rem 0.85rem' }}
                title="Stop playback"
              >
                <Square size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Volume & Timer Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', background: 'var(--bg-tertiary)', padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-md)' }}>
          {/* Volume Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Sliders size={16} color="var(--text-muted)" />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', minWidth: 50 }}>
              Volume
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={currentVolume}
              onChange={e => {
                const val = parseFloat(e.target.value);
                if (activeSoundId) {
                  setTrackVolume(activeSoundId, val);
                }
              }}
              style={{ flex: 1, accentColor: '#7b61ff', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', minWidth: 35, textAlign: 'right' }}>
              {Math.round(currentVolume * 100)}%
            </span>
          </div>

          {/* Timer Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', justifyContent: 'flex-end' }}>
            <Clock size={16} color={timerSecondsRemaining ? '#7b61ff' : 'var(--text-muted)'} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {timerSecondsRemaining ? (
                <>
                  Timer: <strong style={{ color: '#7b61ff' }}>{formatTimerDisplay(timerSecondsRemaining)} remaining</strong>
                </>
              ) : (
                'Timer: <strong>Endless Play</strong>'
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Customizable Countdown Timer Increments */}
      <div className="card-glass" style={{ padding: '1.25rem' }}>
        <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: '0 0 0.6rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Clock size={15} color="var(--accent-primary)" /> Set Sleep / Focus Timer (5-Minute Intervals)
        </h4>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 0.85rem 0' }}>
          Audio will gently fade out when the countdown completes, or choose Endless to play continuously throughout the night.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
          {TIMER_OPTIONS.map(opt => {
            const isSelected = selectedTimerMinutes === opt.minutes;
            return (
              <button
                key={opt.label}
                onClick={() => handleTimerSelect(opt.minutes)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-pill)',
                  border: `1.5px solid ${isSelected ? '#7b61ff' : 'var(--border-subtle)'}`,
                  background: isSelected ? 'rgba(123, 97, 255, 0.15)' : 'var(--bg-secondary)',
                  color: isSelected ? '#7b61ff' : 'var(--text-secondary)',
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sound Selection Grid (One-sound-at-a-time rule) */}
      <div className="card-glass" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.2rem 0' }}>
            Sound Library 🌿
          </h4>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Tap any sound to start playback instantly. Switching sounds stops previous audio seamlessly.
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
          {(soundLibrary || []).map(s => {
            const isCurrent = activeSoundId === s.id;
            const isThisPlaying = isCurrent && isPlaying;

            return (
              <div
                key={s.id}
                onClick={() => toggleSingleSound(s.id, selectedTimerMinutes)}
                style={{
                  background: isCurrent ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                  border: `1.5px solid ${isCurrent ? '#7b61ff' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                className="card-interactive"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.6rem' }}>{s.icon}</span>
                  <div 
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: isThisPlaying ? '#7b61ff' : 'var(--bg-tertiary)',
                      color: isThisPlaying ? '#fff' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {isThisPlaying ? <Pause size={14} /> : <Play size={14} />}
                  </div>
                </div>

                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isCurrent ? '#7b61ff' : 'var(--text-primary)' }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.15rem', lineHeight: 1.35 }}>
                    {s.desc}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.4rem', borderTop: '1px solid var(--border-glass)', fontSize: '0.7rem' }}>
                  <span className="pill-badge primary" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                    Ambient Calm
                  </span>
                  {isThisPlaying && (
                    <span style={{ color: '#7b61ff', fontWeight: 700, animation: 'pulse 1.5s infinite' }}>
                      ● Playing
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

