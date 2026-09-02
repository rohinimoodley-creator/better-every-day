import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import {
  X,
  Plus,
  Trash2,
  AlertCircle,
  Clock,
  Calendar,
  Sparkles,
  ShieldCheck,
  HeartPulse,
  Activity,
  Info,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SIGNAL_PRESETS = [
  { id: 'headache', label: 'Headache', icon: '🤕' },
  { id: 'tummy_ache', label: 'Tummy Ache', icon: '🤢' },
  { id: 'back_ache', label: 'Back / Neck Ache', icon: '🩹' },
  { id: 'fatigue', label: 'Fatigue & Low Energy', icon: '🥱' },
  { id: 'nausea', label: 'Nausea / Dizziness', icon: '💫' },
  { id: 'toilet_freq', label: 'Toilet Frequency', icon: '🚽' },
  { id: 'sore_muscles', label: 'Muscle Soreness', icon: '💪' }
];

export default function BodySignalsModal({ isOpen, onClose }) {
  const { bodySignals, logBodySignal, deleteBodySignal } = useWellness();

  const [selectedSignal, setSelectedSignal] = useState('Headache');
  const [selectedIcon, setSelectedIcon] = useState('🤕');
  const [severity, setSeverity] = useState('Mild');
  const [duration, setDuration] = useState('30 mins');
  const [notes, setNotes] = useState('');
  const [showLogForm, setShowLogForm] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    setSelectedSignal(preset.label);
    setSelectedIcon(preset.icon);
    setShowLogForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    logBodySignal({
      signal: selectedSignal,
      icon: selectedIcon,
      severity,
      duration,
      notes: notes.trim(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    setNotes('');
    setShowLogForm(false);
    try {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.6 }
      });
    } catch(e) {}
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-sheet" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: 640, maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <span className="pill-badge primary" style={{ marginBottom: '0.25rem' }}>
              <HeartPulse size={12} /> Physical Sensations & Signals
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.2rem 0' }}>
              Body Signals Tracker 🩹
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              Track physical sensations over time to identify gentle patterns without judgment.
            </p>
          </div>

          <button 
            onClick={onClose} 
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Log Action or Toggle */}
        {!showLogForm ? (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <strong style={{ fontSize: '0.88rem' }}>Log a New Body Signal:</strong>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.5rem' }}>
              {SIGNAL_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className="card-glass card-interactive"
                  style={{
                    padding: '0.65rem 0.5rem',
                    border: '1px solid var(--border-glass)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem',
                    cursor: 'pointer',
                    background: 'var(--bg-glass-card)'
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{preset.icon}</span>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center' }}>
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Form for Logging Signal */
          <form onSubmit={handleSubmit} className="card-glass" style={{ padding: '1.25rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--accent-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>{selectedIcon}</span> Logging: {selectedSignal}
              </h4>
              <button 
                type="button" 
                onClick={() => setShowLogForm(false)} 
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.74rem' }}
              >
                Change Signal
              </button>
            </div>

            {/* Severity Pill Selector */}
            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Severity:
              </label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {['Mild', 'Moderate', 'Strong'].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeverity(s)}
                    style={{
                      flex: 1,
                      padding: '0.4rem',
                      borderRadius: 'var(--radius-pill)',
                      border: severity === s ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      background: severity === s ? 'var(--accent-primary-light)' : 'transparent',
                      color: severity === s ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Selector */}
            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Approximate Duration:
              </label>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {['15 mins', '30 mins', '1-2 hours', 'All afternoon', 'Ongoing'].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    style={{
                      padding: '0.3rem 0.65rem',
                      borderRadius: 'var(--radius-pill)',
                      border: duration === d ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      background: duration === d ? 'var(--accent-primary-light)' : 'transparent',
                      color: duration === d ? 'var(--accent-primary)' : 'var(--text-muted)',
                      fontSize: '0.72rem',
                      cursor: 'pointer'
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes Input */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Optional Notes & Context:
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g., Happened after 4 hours of screen time; drank water and rested eyes."
                rows={2}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button 
                type="button" 
                onClick={() => setShowLogForm(false)} 
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary btn-sm"
              >
                Save Signal Entry
              </button>
            </div>
          </form>
        )}

        {/* Non-Causal Pattern Observation Card */}
        <div 
          style={{
            background: 'var(--accent-primary-light)',
            borderLeft: '4px solid var(--accent-primary)',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            fontSize: '0.8rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontWeight: 700, marginBottom: '0.25rem' }}>
            <Sparkles size={14} /> Observed Signal Pattern (Non-Diagnostic)
          </div>
          <p style={{ color: 'var(--text-primary)', margin: '0 0 0.4rem 0', lineHeight: 1.4 }}>
            "Your headaches have appeared more often on days with lower sleep or higher screen time. Staying hydrated and taking short eye breaks may help support your comfort."
          </p>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            ⚕️ Non-Causal Note: Better Every Day is not a diagnostic tool. If physical symptoms persist or cause discomfort, consider consulting a healthcare professional.
          </div>
        </div>

        {/* Recent History Timeline */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <strong style={{ fontSize: '0.9rem' }}>Recent Signal Timeline ({bodySignals.length}):</strong>
          </div>

          {bodySignals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              No body signals recorded yet. Log one above or mention it in Voice Logging.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {bodySignals.map(signal => (
                <div
                  key={signal.id}
                  className="card-glass"
                  style={{
                    padding: '0.75rem 0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.3rem' }}>{signal.icon || '🩹'}</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.15rem' }}>
                        <strong style={{ fontSize: '0.86rem' }}>{signal.signal}</strong>
                        <span className="pill-badge primary" style={{ fontSize: '0.66rem', padding: '0.1rem 0.4rem' }}>
                          {signal.severity || 'Mild'}
                        </span>
                        {signal.duration && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            • {signal.duration}
                          </span>
                        )}
                      </div>
                      {signal.notes && (
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 0.15rem 0' }}>
                          {signal.notes}
                        </p>
                      )}
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {signal.date} at {signal.time}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteBodySignal(signal.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '0.3rem'
                    }}
                    title="Remove signal entry"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
