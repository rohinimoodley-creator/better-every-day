import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import {
  BookOpen,
  X,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import MicroMovementPromptModal from './MicroMovementPromptModal';

const POSTURE_RESETS_DATA = [
  {
    id: 'pr_shoulder',
    title: 'Shoulder Reset',
    icon: '🧍',
    duration: '15 sec',
    instruction: 'Gently roll both shoulders up, back, and down. Open your collarbones and take a slow, full breath.',
    tip: 'Eases upper-back and neck stiffness from typing.'
  },
  {
    id: 'pr_screen',
    title: 'Screen Reset',
    icon: '💻',
    duration: '20 sec',
    instruction: 'Look at an object at least 20 feet away. Blink softly, relax facial muscles, and reset your sitting alignment.',
    tip: 'Reduces digital eye strain and forward head posture.'
  },
  {
    id: 'pr_spine',
    title: 'Spine Reset',
    icon: '🦴',
    duration: '15 sec',
    instruction: 'Stand or sit tall. Gently imagine lengthening upward through the crown of your head, then relax your ribs down.',
    tip: 'Decompresses vertebrae without forced stiffness.'
  },
  {
    id: 'pr_position',
    title: 'Position Reset',
    icon: '🪑',
    duration: '10 sec',
    instruction: 'Change your current sitting position, uncross legs, place feet flat, or stand up for a moment.',
    tip: 'Interrupts sustained static pressure on your hips and lower back.'
  },
  {
    id: 'pr_movement',
    title: 'Movement Reset',
    icon: '🌱',
    duration: '30 sec',
    instruction: 'Take a gentle torso twist to the left and right, circle both wrists, and tilt your head ear-to-shoulder.',
    tip: 'Stimulates joint lubrication and gentle circulation.'
  }
];

export default function MicroMovementSection() {
  const {
    microMovementSettings,
    microMovementLogs = [],
    toggleMicroMovement,
    setMicroMovementPreference,
    togglePostureResets,
    logMicroMovement,
    getMicroMovementStats,
    getWellnessDayInfo
  } = useWellness();

  const [isSectionOpen, setIsSectionOpen] = useState(false); // Collapsed by default
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('all'); // 'all' | 'completed' | 'skipped'
  const [activePostureIndex, setActivePostureIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState('');

  const stats = getMicroMovementStats ? getMicroMovementStats() : {
    breaksTodayCount: 6,
    totalLogsCount: microMovementLogs.length,
    insight: 'Nice work — you’ve interrupted several periods of prolonged sitting today.',
    isCurrentlyActive: true
  };

  const rhythm = getWellnessDayInfo ? getWellnessDayInfo() : { dayStartTime: '07:00', sleepTime: '23:00' };

  const handleCompleteBreak = (type) => {
    logMicroMovement(type, 'completed');
    setToastMessage(`✓ ${type} logged! Nice reset 💚`);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleSkipBreak = () => {
    logMicroMovement('30-30 Break', 'skipped');
  };

  const handleCompletePosture = (posture) => {
    logMicroMovement(posture.title, 'completed');
    setToastMessage(`✓ ${posture.title} completed! 🌱`);
    setTimeout(() => setToastMessage(''), 2500);

    try {
      confetti({ particleCount: 20, spread: 40, origin: { y: 0.65 } });
    } catch {
      // Ignored
    }
  };

  const handleSkipPosture = (posture) => {
    logMicroMovement(posture.title, 'skipped');
    setActivePostureIndex(prev => (prev + 1) % POSTURE_RESETS_DATA.length);
  };

  const filteredLogs = microMovementLogs.filter(log => {
    if (historyFilter === 'completed') return log.status === 'completed';
    if (historyFilter === 'skipped') return log.status === 'skipped';
    return true;
  });

  return (
    <div 
      className={`card-glass ${!isSectionOpen ? 'card-interactive' : ''}`} 
      style={{ 
        padding: '1.25rem',
        border: isSectionOpen ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-glass)',
        transition: 'all var(--transition-smooth)'
      }}
    >
      
      {/* 1. Progressive Disclosure Header Button / Row */}
      <div 
        onClick={() => setIsSectionOpen(!isSectionOpen)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none',
          gap: '0.75rem',
          flexWrap: 'wrap'
        }}
        role="button"
        aria-expanded={isSectionOpen}
        aria-controls="micro-movement-content"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsSectionOpen(!isSectionOpen); } }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div 
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              background: isSectionOpen ? 'var(--accent-primary)' : 'var(--accent-primary-light)',
              color: isSectionOpen ? '#ffffff' : 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              flexShrink: 0,
              transition: 'all var(--transition-fast)'
            }}
          >
            🌱
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Micro-Movement & Posture Support
              </h3>
              {microMovementSettings.enabled ? (
                <span className="pill-badge primary" style={{ fontSize: '0.66rem', padding: '2px 8px', fontWeight: 700 }}>
                  {stats.breaksTodayCount} breaks today
                </span>
              ) : (
                <span className="pill-badge" style={{ fontSize: '0.66rem', padding: '2px 8px', background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                  Optional • Off
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
              {isSectionOpen ? 'Tap header to hide micro-movement options' : '30-30 movement breaks, posture resets & position changes'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className={`btn ${isSectionOpen ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={{ fontSize: '0.8rem', gap: '0.35rem', padding: '0.4rem 0.85rem' }}
            onClick={(e) => { e.stopPropagation(); setIsSectionOpen(!isSectionOpen); }}
            aria-label={isSectionOpen ? 'Hide Micro-Movement content' : 'Reveal Micro-Movement content'}
          >
            <span>{isSectionOpen ? 'Hide Content' : 'View Micro-Movement'}</span>
            {isSectionOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* 2. REVEALED CONTENT (Shown only when user clicks to open) */}
      {isSectionOpen && (
        <div id="micro-movement-content" style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeIn 0.2s ease-out' }}>
          
          {/* Master Opt-In Toggle & Quick Info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                30-30 Micro-Movement Reminders
              </strong>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                Opt in to receive gentle movement nudges every 30 minutes during your active day.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: microMovementSettings.enabled ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                {microMovementSettings.enabled ? 'Enabled' : 'Disabled'}
              </span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={microMovementSettings.enabled}
                  onChange={e => toggleMicroMovement(e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>

          {toastMessage && (
            <div style={{ background: 'var(--accent-primary-light)', border: '1px solid var(--accent-primary)', padding: '0.55rem 0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-primary)', animation: 'fadeIn 0.2s ease-out' }}>
              {toastMessage}
            </div>
          )}

          {microMovementSettings.enabled ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              
              {/* 30-30 Movement Break Panel */}
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.15rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>🚶</span>
                      <h4 style={{ fontSize: '1.02rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                        30-30 Movement Break
                      </h4>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                      A gentle reminder to move or reset your position every 30 minutes.
                    </p>
                  </div>

                  {/* Status Badge respecting My Daily Rhythm */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', background: 'var(--bg-tertiary)', padding: '0.3rem 0.65rem', borderRadius: 'var(--radius-pill)' }}>
                    {stats.isCurrentlyActive ? (
                      <>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-primary)' }} />
                        <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>Active (Day {rhythm.dayStartTime}–{rhythm.sleepTime})</span>
                      </>
                    ) : (
                      <>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-gold)' }} />
                        <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Paused outside active day</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Reminder Preference Selector */}
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Preferred 30-Min Option:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {[
                      { id: 'choose', label: 'Let Me Choose Each Time' },
                      { id: 'steps', label: '🚶 30 Steps' },
                      { id: 'stretch', label: '🧘 Stretch & Reposition' }
                    ].map(pref => {
                      const active = microMovementSettings.preference === pref.id;
                      return (
                        <button
                          key={pref.id}
                          type="button"
                          onClick={() => setMicroMovementPreference(pref.id)}
                          style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: 'var(--radius-pill)',
                            border: `1.5px solid ${active ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                            background: active ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                            color: active ? 'var(--accent-primary)' : 'var(--text-primary)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)'
                          }}
                        >
                          {pref.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Daily Lightweight Counter & Insight (No streaks!) */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', background: 'var(--bg-tertiary)', padding: '0.75rem 0.95rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.9rem' }}>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                      {stats.breaksTodayCount} movement {stats.breaksTodayCount === 1 ? 'break' : 'breaks'} today 🌱
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      {stats.insight}
                    </div>
                  </div>

                  <button
                    onClick={() => setIsPromptOpen(true)}
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '0.78rem', gap: '0.3rem' }}
                  >
                    <span>Check In Now 🌱</span>
                  </button>
                </div>

                {/* Link to Progressive Disclosure History */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setIsHistoryOpen(true)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--accent-primary)',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <BookOpen size={12} />
                    <span>Review Time Log History ({stats.totalLogsCount})</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              30-30 Micro-Movement is currently turned off. Switch the toggle above on to receive gentle 30-minute position-change nudges.
            </div>
          )}

          {/* Bottom collapse action for convenience */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '0.25rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.76rem', gap: '0.35rem', padding: '0.35rem 0.85rem' }}
              onClick={() => setIsSectionOpen(false)}
            >
              <ChevronUp size={13} />
              <span>Hide Micro-Movement Options</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Interactive Movement Prompt Modal */}
      <MicroMovementPromptModal
        isOpen={isPromptOpen}
        onClose={() => setIsPromptOpen(false)}
        onCompleteBreak={handleCompleteBreak}
        onSkipBreak={handleSkipBreak}
        preference={microMovementSettings.preference}
      />

      {/* 4. Review Time Log History Modal (Progressive Disclosure) */}
      {isHistoryOpen && (
        <div className="modal-backdrop" onClick={() => setIsHistoryOpen(false)}>
          <div 
            className="modal-sheet" 
            onClick={e => e.stopPropagation()} 
            style={{ maxWidth: 520, maxHeight: '80vh', overflowY: 'auto' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ fontSize: '1.2rem' }}>📖</span>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Review Time Log History
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {microMovementLogs.length} logged micro-movement intervals
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setIsHistoryOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-tertiary)', padding: '0.2rem', borderRadius: 'var(--radius-pill)', marginBottom: '1rem' }}>
              {[
                { id: 'all', label: `All (${microMovementLogs.length})` },
                { id: 'completed', label: `Completed (${microMovementLogs.filter(l => l.status === 'completed').length})` },
                { id: 'skipped', label: `Skipped (${microMovementLogs.filter(l => l.status === 'skipped').length})` }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setHistoryFilter(f.id)}
                  style={{
                    flex: 1,
                    padding: '0.35rem 0.6rem',
                    borderRadius: 'var(--radius-pill)',
                    border: 'none',
                    background: historyFilter === f.id ? 'var(--accent-primary)' : 'transparent',
                    color: historyFilter === f.id ? '#ffffff' : 'var(--text-secondary)',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Log Entries List */}
            {filteredLogs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {filteredLogs.map(log => (
                  <div
                    key={log.id}
                    style={{
                      background: 'var(--bg-secondary)',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      borderLeft: log.status === 'completed' ? '3px solid var(--accent-primary)' : '3px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.82rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {log.time}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>—</span>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {log.type}
                      </span>
                    </div>

                    <span 
                      className="pill-badge"
                      style={{
                        fontSize: '0.66rem',
                        fontWeight: 700,
                        background: log.status === 'completed' ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                        color: log.status === 'completed' ? 'var(--accent-primary)' : 'var(--text-muted)'
                      }}
                    >
                      {log.status === 'completed' ? 'Completed ✓' : 'Skipped'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                No movement logs match this filter.
              </div>
            )}

            <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
              <button 
                onClick={() => setIsHistoryOpen(false)}
                className="btn btn-secondary btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
