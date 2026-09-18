import React from 'react';
import { useAudio } from '../../../context/AudioContext';
import { Volume2, Play, Pause, Square, Clock, Sparkles, Sliders, Moon, Wind, Flame, Droplets, Waves, Trees, Radio, ChevronDown } from 'lucide-react';
import ContextualPip from '../../mascot/ContextualPip';

export default function SoundscapesHub() {
  const {
    isPlaying,
    activeSoundId,
    setActiveSoundId,
    activeSoundObj,
    volumes,
    soundLibrary = [],
    playSingleSound,
    toggleSingleSound,
    pauseSound,
    stopAll,
    setTrackVolume,
    selectedTimerMinutes,
    setSelectedTimerMinutes,
    timerSecondsRemaining
  } = useAudio();

  const selectedSoundId = activeSoundId || soundLibrary[0]?.id || 'rain';
  const selectedSound = soundLibrary.find(s => s.id === selectedSoundId) || soundLibrary[0];
  const currentVolume = selectedSoundId && volumes ? (volumes[selectedSoundId] || 0.5) : 0.5;

  const TIMER_OPTIONS = [
    { label: '5 min', minutes: 5 },
    { label: '10 min', minutes: 10 },
    { label: '15 min', minutes: 15 },
    { label: '20 min', minutes: 20 },
    { label: '25 min', minutes: 25 },
    { label: '30 min', minutes: 30 },
    { label: '45 min', minutes: 45 },
    { label: '60 min', minutes: 60 },
    { label: 'No Timer', minutes: null }
  ];

  const formatTimerDisplay = (totalSec) => {
    if (totalSec == null) return '';
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getSoundIcon = (id) => {
    switch (id) {
      case 'rain': return <Droplets size={22} color="#3a86c8" />;
      case 'ocean': return <Waves size={22} color="#2a9d8f" />;
      case 'forest': return <Trees size={22} color="#40916c" />;
      case 'wind': return <Wind size={22} color="#52b788" />;
      case 'brownNoise': return <Radio size={22} color="#d97736" />;
      case 'whiteNoise': return <Radio size={22} color="#8d99ae" />;
      case 'fireplace': return <Flame size={22} color="#e76f51" />;
      case 'gentleAmbience': return <Sparkles size={22} color="#8b5cf6" />;
      case 'sleepDrone': return <Moon size={22} color="#7b61ff" />;
      default: return <Volume2 size={22} color="var(--accent-primary)" />;
    }
  };

  const handleSoundChange = (e) => {
    const newId = e.target.value;
    if (isPlaying) {
      // One sound at a time: switch directly to new sound without overlap
      playSingleSound(newId, selectedTimerMinutes);
    } else {
      if (setActiveSoundId) {
        setActiveSoundId(newId);
      }
    }
  };

  const handleTimerSelect = (mins) => {
    setSelectedTimerMinutes(mins);
    if (selectedSoundId && isPlaying) {
      playSingleSound(selectedSoundId, mins);
    }
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      if (pauseSound) pauseSound();
      else stopAll();
    } else {
      playSingleSound(selectedSoundId, selectedTimerMinutes);
    }
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
      
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

      {/* =========================================================================
          CONSOLIDATED AMBIENT SOUNDSCAPE PLAYER CARD
          ========================================================================= */}
      <div 
        className="card-glass"
        style={{
          padding: '1.75rem',
          background: isPlaying 
            ? 'linear-gradient(135deg, rgba(123, 97, 255, 0.12) 0%, rgba(58, 134, 200, 0.12) 100%)' 
            : 'var(--bg-secondary)',
          border: `1.5px solid ${isPlaying ? '#7b61ff' : 'var(--border-glass)'}`,
          boxShadow: isPlaying ? '0 12px 36px rgba(123, 97, 255, 0.18)' : 'var(--shadow-md)',
          borderRadius: 'var(--radius-xl, 20px)',
          transition: 'all 0.3s ease'
        }}
      >
        {/* 1. CHOOSE A SOUND (DROPDOWN CONTROL) */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label 
            htmlFor="ambient-sound-select"
            style={{ 
              display: 'block', 
              fontSize: '0.84rem', 
              fontWeight: 800, 
              color: 'var(--text-primary)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.04em',
              marginBottom: '0.5rem' 
            }}
          >
            Choose a Sound
          </label>
          
          <div style={{ position: 'relative', maxWidth: 440 }}>
            <select
              id="ambient-sound-select"
              value={selectedSoundId}
              onChange={handleSoundChange}
              style={{
                width: '100%',
                padding: '0.75rem 2.4rem 0.75rem 1rem',
                borderRadius: 'var(--radius-md, 12px)',
                border: '1.5px solid var(--border-glass, rgba(0,0,0,0.15))',
                background: 'var(--bg-card, #ffffff)',
                color: 'var(--text-primary)',
                fontSize: '0.96rem',
                fontWeight: 700,
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease'
              }}
            >
              {soundLibrary.map(s => (
                <option key={s.id} value={s.id}>
                  {s.icon} {s.name} — {s.desc}
                </option>
              ))}
            </select>
            
            <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>
              <ChevronDown size={18} />
            </div>
          </div>
        </div>

        {/* 2. SOUND STATUS & MAIN PLAYBACK HERO */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '1.25rem', 
          marginBottom: '1.5rem',
          background: 'var(--bg-tertiary)',
          padding: '1.2rem',
          borderRadius: 'var(--radius-lg, 16px)'
        }}>
          {/* Sound Icon & Details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div 
              style={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                background: isPlaying ? 'linear-gradient(135deg, #7b61ff, #3a86c8)' : 'var(--bg-card, #ffffff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isPlaying ? '#ffffff' : 'var(--text-muted)',
                boxShadow: isPlaying ? '0 6px 20px rgba(123, 97, 255, 0.4)' : '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease',
                flexShrink: 0
              }}
            >
              {selectedSound ? getSoundIcon(selectedSound.id) : <Volume2 size={24} />}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.15rem' }}>
                <span style={{ 
                  fontSize: '0.72rem', 
                  fontWeight: 800, 
                  color: isPlaying ? '#7b61ff' : 'var(--text-muted)', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.04em' 
                }}>
                  {isPlaying ? '● Currently Playing' : activeSoundId ? '⏸ Paused' : 'Selected Sound'}
                </span>
                {isPlaying && (
                  <span className="pill-badge primary" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                    Live Synthesis
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {selectedSound ? `${selectedSound.icon} ${selectedSound.name}` : 'Choose a Sound'}
              </h3>
              
              {selectedSound && (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                  {selectedSound.desc}
                </p>
              )}
            </div>
          </div>

          {/* Primary Play / Pause & Stop Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              onClick={handlePlayToggle}
              className="btn btn-primary"
              style={{
                padding: '0.75rem 1.6rem',
                fontSize: '0.96rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderRadius: 'var(--radius-pill)',
                background: isPlaying ? 'var(--accent-primary, #2d6a4f)' : 'linear-gradient(135deg, #7b61ff, #3a86c8)',
                boxShadow: '0 4px 16px rgba(123, 97, 255, 0.35)',
                cursor: 'pointer'
              }}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              <span>{isPlaying ? 'Pause' : 'Play Sound'}</span>
            </button>

            {(isPlaying || activeSoundId) && (
              <button
                onClick={stopAll}
                className="btn btn-secondary"
                style={{ 
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-pill)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer'
                }}
                title="Stop playback"
              >
                <Square size={14} />
                <span>Stop</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. DURATION / TIMER SELECTION BAR */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <h4 style={{ fontSize: '0.86rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <Clock size={15} color="var(--accent-primary)" /> Duration
            </h4>
            
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {timerSecondsRemaining ? (
                <>
                  Timer: <strong style={{ color: '#7b61ff' }}>{formatTimerDisplay(timerSecondsRemaining)} remaining</strong>
                </>
              ) : (
                'Timer: <strong>No Timer (Endless)</strong>'
              )}
            </span>
          </div>

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
                    background: isSelected ? 'rgba(123, 97, 255, 0.15)' : 'var(--bg-tertiary)',
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

        {/* 4. VOLUME CONTROL */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem', 
          background: 'var(--bg-tertiary)', 
          padding: '0.85rem 1.25rem', 
          borderRadius: 'var(--radius-md)' 
        }}>
          <Sliders size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', minWidth: 55 }}>
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
              if (selectedSoundId) {
                setTrackVolume(selectedSoundId, val);
              }
            }}
            style={{ flex: 1, accentColor: '#7b61ff', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', minWidth: 40, textAlign: 'right' }}>
            {Math.round(currentVolume * 100)}%
          </span>
        </div>

      </div>

    </div>
  );
}
