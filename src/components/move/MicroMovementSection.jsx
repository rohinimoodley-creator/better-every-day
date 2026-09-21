import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import {
  Sparkles,
  Volume2,
  Vibrate,
  Play,
  Check,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import SegmentedControl from '../common/SegmentedControl';
import MicroMovementPromptModal from './MicroMovementPromptModal';

const MOVEMENT_OPTIONS = [
  { id: 'choose', label: 'Let Me Choose' },
  { id: 'steps', label: '30 Steps' },
  { id: 'stretch', label: 'Stretch & Reposition' },
  { id: 'shoulder', label: 'Shoulder Roll' },
  { id: 'breath', label: 'Deep Breath & Stand' }
];

const INTERVAL_OPTIONS = [
  { id: '30', label: '30m' },
  { id: '45', label: '45m' },
  { id: '60', label: '60m' }
];

export default function MicroMovementSection({ onTryOneNow }) {
  const {
    microMovementSettings = { enabled: true, preference: 'choose', interval: 30, soundEnabled: true, vibrateEnabled: true },
    toggleMicroMovement,
    setMicroMovementPreference,
    logMicroMovement,
    getMicroMovementStats
  } = useWellness();

  const [interval, setIntervalVal] = useState(String(microMovementSettings.interval || '30'));
  const [soundOn, setSoundOn] = useState(microMovementSettings.soundEnabled !== false);
  const [vibrateOn, setVibrateOn] = useState(microMovementSettings.vibrateEnabled !== false);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const stats = getMicroMovementStats ? getMicroMovementStats() : { breaksTodayCount: 4, insight: 'Gentle resets throughout the day' };

  const handleCompleteBreak = (type) => {
    if (logMicroMovement) logMicroMovement(type, 'completed');
    setToastMessage(`✓ ${type} completed! 🌱`);
    setTimeout(() => setToastMessage(''), 2500);
    try {
      confetti({ particleCount: 25, spread: 50, origin: { y: 0.65 } });
    } catch (e) {}
  };

  const handleSkipBreak = () => {
    if (logMicroMovement) logMicroMovement('Micro-Movement', 'skipped');
  };

  const isEnabled = microMovementSettings.enabled !== false;

  return (
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
      {/* Header Row with Toggle Switch */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div 
            style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-md)',
              background: isEnabled ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
              color: isEnabled ? 'var(--accent-primary)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              flexShrink: 0
            }}
          >
            🌱
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Micro-Movements
              </h3>
              {isEnabled && (
                <span className="pill-badge primary" style={{ fontSize: '0.66rem', padding: '1px 6px' }}>
                  {stats.breaksTodayCount} today
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: '0.1rem 0 0 0' }}>
              Subtle shifts during long sitting sessions
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <label className="toggle-switch" style={{ margin: 0 }}>
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={e => toggleMicroMovement && toggleMicroMovement(e.target.checked)}
            aria-label="Toggle micro-movements"
          />
          <span className="toggle-slider" />
        </label>
      </div>

      {toastMessage && (
        <div style={{ background: 'var(--accent-primary-light)', border: '1px solid var(--accent-primary)', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-primary)', animation: 'fadeIn 0.2s ease-out' }}>
          {toastMessage}
        </div>
      )}

      {/* Expanded Content (when enabled) */}
      {isEnabled && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', animation: 'fadeIn 0.2s ease-out' }}>
          {/* Interval Setting: Segmented Control */}
          <div>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Reminder Interval:
            </span>
            <SegmentedControl
              options={INTERVAL_OPTIONS}
              value={interval}
              onChange={setIntervalVal}
              size="sm"
            />
          </div>

          {/* Movement Type: Horizontal Chips */}
          <div>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Default Movement:
            </span>
            <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '0.15rem' }}>
              {MOVEMENT_OPTIONS.map(opt => {
                const active = (microMovementSettings.preference || 'choose') === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setMicroMovementPreference && setMicroMovementPreference(opt.id)}
                    style={{
                      minHeight: 36,
                      padding: '0.3rem 0.65rem',
                      borderRadius: 'var(--radius-pill)',
                      border: `1px solid ${active ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      background: active ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                      color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontSize: '0.76rem',
                      fontWeight: active ? 800 : 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound & Vibrate Compact Toggles */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Volume2 size={13} color="var(--text-muted)" /> Sound
              </span>
              <label className="toggle-switch" style={{ transform: 'scale(0.8)', margin: 0 }}>
                <input
                  type="checkbox"
                  checked={soundOn}
                  onChange={e => setSoundOn(e.target.checked)}
                  aria-label="Sound alert"
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Vibrate size={13} color="var(--text-muted)" /> Vibrate
              </span>
              <label className="toggle-switch" style={{ transform: 'scale(0.8)', margin: 0 }}>
                <input
                  type="checkbox"
                  checked={vibrateOn}
                  onChange={e => setVibrateOn(e.target.checked)}
                  aria-label="Vibrate alert"
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => {
                if (onTryOneNow) {
                  onTryOneNow();
                } else {
                  setIsPromptOpen(true);
                }
              }}
              className="btn btn-secondary"
              style={{
                flex: 1,
                minHeight: 40,
                fontSize: '0.82rem',
                fontWeight: 700,
                gap: '0.35rem'
              }}
            >
              <Play size={14} />
              <span>Try One Now (30s)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPromptOpen(true)}
              className="btn btn-primary"
              style={{
                minHeight: 40,
                fontSize: '0.82rem',
                fontWeight: 800,
                gap: '0.35rem',
                padding: '0.4rem 0.9rem'
              }}
            >
              <Check size={14} />
              <span>Log Break</span>
            </button>
          </div>
        </div>
      )}

      {/* Interactive Movement Prompt Modal */}
      <MicroMovementPromptModal
        isOpen={isPromptOpen}
        onClose={() => setIsPromptOpen(false)}
        onCompleteBreak={handleCompleteBreak}
        onSkipBreak={handleSkipBreak}
        preference={microMovementSettings.preference || 'choose'}
      />
    </div>
  );
}

