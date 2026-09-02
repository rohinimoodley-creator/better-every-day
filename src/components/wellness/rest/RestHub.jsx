import React, { useState } from 'react';
import { useWellness } from '../../../context/WellnessContext';
import { useAudio } from '../../../context/AudioContext';
import CalmAudioPlayer from '../../mind/CalmAudioPlayer';
import {
  Moon,
  Sparkles,
  Heart,
  Clock,
  BatteryCharging,
  Flame,
  Volume2,
  CheckCircle,
  Play,
  Pause,
  Sun,
  Shield,
  Zap,
  BedDouble,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RestHub({ onNavigateTab }) {
  const { userProfile, dailyCheckIn, howIThrive } = useWellness();
  const { isPlaying, currentTrack, togglePlay, setTrack } = useAudio();

  const [targetBedtime, setTargetBedtime] = useState('22:30');
  const [targetWakeup, setTargetWakeup] = useState('07:00');
  const [sleepLogged, setSleepLogged] = useState({ hours: 7.5, quality: 'rested', deepSleep: '1h 45m', rem: '2h 10m' });
  const [savedSuccess, setSavedSuccess] = useState(false);

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
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
          <span className="pill-badge primary" style={{ fontSize: '0.72rem' }}>
            <Moon size={12} /> Sleep & Recovery
          </span>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
          Rest & Night Recovery 🌙
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
          Restorative sleep habits, recovery indicators, and calming evening wind-down rituals.
        </p>
      </div>

      {/* Sleep Quality Snapshot */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        
        {/* Sleep Score Card */}
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
              Last Night's Sleep
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.1rem 0' }}>
              {sleepLogged.hours} hrs
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--accent-calm)', fontWeight: 700 }}>
              ✨ Optimal Deep Recovery
            </div>
          </div>
        </div>

        {/* Readiness Card */}
        <div 
          className="card-glass"
          style={{
            padding: '1.25rem',
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
              background: 'rgba(64, 145, 108, 0.15)',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <BatteryCharging size={26} />
          </div>

          <div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Recovery Battery
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.1rem 0' }}>
              88%
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
              Ready for moderate to active movement
            </div>
          </div>
        </div>
      </div>

      {/* Sleep Stages Breakdown */}
      <div className="card-glass" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.85rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Clock size={16} color="var(--accent-primary)" /> Sleep Stage Architecture
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Deep Sleep</span>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#7b61ff', marginTop: '0.2rem' }}>{sleepLogged.deepSleep}</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Physical tissue repair</span>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>REM Sleep</span>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#3a86c8', marginTop: '0.2rem' }}>{sleepLogged.rem}</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Memory consolidation</span>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Light Sleep</span>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '0.2rem' }}>3h 35m</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Restful baseline</span>
          </div>
        </div>
      </div>

      {/* Evening Wind-Down & Soundscapes */}
      <div className="card-glass" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Volume2 size={16} color="var(--accent-primary)" /> Sleep & Wind-Down Soundscapes
          </h3>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Calming audio</span>
        </div>

        <CalmAudioPlayer />
      </div>

      {/* Bedtime Routine Target */}
      <form onSubmit={handleSaveRoutine} className="card-glass" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.85rem 0' }}>
          Target Rest Schedule
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
