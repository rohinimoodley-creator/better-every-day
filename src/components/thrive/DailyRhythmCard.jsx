import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import {
  Sun,
  Moon,
  Clock,
  RotateCw,
  Sparkles,
  Calendar,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Sunrise,
  Sunset,
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DailyRhythmCard() {
  const {
    dailyRhythm,
    updateDailyRhythm,
    setTemporaryShiftOverride,
    clearTemporaryShiftOverride,
    getWellnessDayInfo
  } = useWellness();

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const dayStartTime = dailyRhythm.dayStartTime || '07:00';
  const sleepTime = dailyRhythm.sleepTime || '23:00';
  const scheduleVariability = dailyRhythm.scheduleVariability || 'same';
  const isShiftOverrideActive = dailyRhythm.isShiftOverrideActive || false;
  const todayStartOverride = dailyRhythm.todayStartOverride || dayStartTime;
  const todaySleepOverride = dailyRhythm.todaySleepOverride || sleepTime;

  const info = getWellnessDayInfo();

  const handleStartTimeChange = (newTime) => {
    updateDailyRhythm({ dayStartTime: newTime });
    showToast('Day start time updated 🌱');
  };

  const handleSleepTimeChange = (newTime) => {
    updateDailyRhythm({ sleepTime: newTime });
    showToast('Sleep time updated 🌙');
  };

  const handleVariabilityChange = (val) => {
    updateDailyRhythm({ scheduleVariability: val });
    showToast(`Schedule variability set to ${val === 'same' ? 'consistent' : 'flexible/shifts'} 🌱`);
  };

  const handleClearShiftOverride = () => {
    clearTemporaryShiftOverride();
    showToast('Reset today to default rhythm 🌱');
  };

  const [editingShiftKey, setEditingShiftKey] = useState(null);
  const [shiftStartInput, setShiftStartInput] = useState('');
  const [shiftSleepInput, setShiftSleepInput] = useState('');
  const [isAddingCustomShift, setIsAddingCustomShift] = useState(false);
  const [newShiftName, setNewShiftName] = useState('');
  const [newShiftStart, setNewShiftStart] = useState('10:00');
  const [newShiftSleep, setNewShiftSleep] = useState('02:00');

  const defaultShiftTypes = [
    { key: 'day', label: '🌅 Day Shift', start: '07:00', sleep: '23:00', desc: 'Standard daytime schedule' },
    { key: 'evening', label: '🌆 Evening Shift', start: '15:00', sleep: '07:00', desc: 'Afternoon start with late rest' },
    { key: 'night', label: '🌙 Night Shift', start: '23:00', sleep: '07:00', desc: 'Overnight work with daytime sleep' },
    { key: 'post_night', label: '🌤️ Post-Night Rest Day', start: '08:00', sleep: '16:00', desc: 'Recovery sleep & evening wakefulness' }
  ];

  const userCustomShifts = dailyRhythm.customShifts || [];
  const allShifts = [
    ...defaultShiftTypes,
    ...userCustomShifts.map(cs => ({ key: cs.id, label: `${cs.icon || '⚡'} ${cs.label}`, start: cs.start, sleep: cs.sleep, desc: 'User custom shift', isCustom: true }))
  ];

  const calculateDuration = (start, sleep) => {
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = sleep.split(':').map(Number);
    let diff = (eH * 60 + (eM || 0)) - (sH * 60 + (sM || 0));
    if (diff < 0) diff += 24 * 60;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
  };

  const handleApplyShift = (start, sleep, label) => {
    setTemporaryShiftOverride(start, sleep);
    setEditingShiftKey(null);
    showToast(`Switched today to ${label} (${start} – ${sleep}) ⚡`);
    try {
      confetti({ particleCount: 20, spread: 45, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleOpenEditShift = (shift) => {
    setEditingShiftKey(shift.key);
    setShiftStartInput(shift.start);
    setShiftSleepInput(shift.sleep);
  };

  const handleSaveCustomShift = (e) => {
    e.preventDefault();
    if (!newShiftName.trim()) return;

    const newShift = {
      id: 'custom_' + Date.now(),
      label: newShiftName,
      start: newShiftStart,
      sleep: newShiftSleep,
      icon: '✨'
    };

    updateDailyRhythm({
      customShifts: [...userCustomShifts, newShift]
    });

    setIsAddingCustomShift(false);
    setNewShiftName('');
    showToast(`Created shift "${newShiftName}"!`);
  };

  return (
    <div className="card-glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
      
      {/* Title & Introduction */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
          <span className="pill-badge primary" style={{ fontSize: '0.72rem' }}>
            <Sunrise size={12} /> Schedule Personalization
          </span>
          {info.isOvernight && (
            <span className="pill-badge purple" style={{ fontSize: '0.72rem' }}>
              <Moon size={12} /> Overnight / Night-Shift Rhythm
            </span>
          )}
        </div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--text-primary)' }}>
          My Daily Rhythm 🌅🌙
        </h3>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
          Better Every Day adapts to your biological clock. Whether you work day shifts, night shifts, rotating shifts, or irregular hours, your wellness tracking stays continuous without an arbitrary midnight reset.
        </p>
      </div>

      {/* 1. Day Start & Sleep Schedule (Manual selection, no imposed recommendations) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        
        {/* Day Start Card */}
        <div style={{ background: 'var(--bg-secondary)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(217, 93, 57, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-secondary)' }}>
              <Sunrise size={16} />
            </div>
            <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              When does your day usually start?
            </label>
          </div>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '0 0 0.85rem 0' }}>
            The preferred start time of your personalized wellness day.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <input
              type="time"
              value={dayStartTime}
              onChange={e => handleStartTimeChange(e.target.value)}
              className="input-field"
              style={{ fontSize: '1.05rem', fontWeight: 800, padding: '0.5rem 0.85rem', width: 140 }}
            />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Day start: {dayStartTime}
            </span>
          </div>
        </div>

        {/* Sleep Schedule Card */}
        <div style={{ background: 'var(--bg-secondary)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(123, 97, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)' }}>
              <Moon size={16} />
            </div>
            <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              When do you usually go to sleep?
            </label>
          </div>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '0 0 0.85rem 0' }}>
            When you complete your wellness cycle and rest.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <input
              type="time"
              value={sleepTime}
              onChange={e => handleSleepTimeChange(e.target.value)}
              className="input-field"
              style={{ fontSize: '1.05rem', fontWeight: 800, padding: '0.5rem 0.85rem', width: 140 }}
            />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Sleep time: {sleepTime}
            </span>
          </div>
        </div>

      </div>

      {/* 2. Does your schedule change? */}
      <div style={{ background: 'var(--bg-secondary)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
        <h4 style={{ fontSize: '0.94rem', fontWeight: 700, margin: '0 0 0.4rem 0', color: 'var(--text-primary)' }}>
          Does your schedule change?
        </h4>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 0.85rem 0' }}>
          Supports regular schedules, irregular schedules, shift work, night work, and rotating patterns:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.65rem', marginBottom: '1rem' }}>
          <label
            onClick={() => handleVariabilityChange('same')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.75rem 0.95rem',
              borderRadius: 'var(--radius-md)',
              background: scheduleVariability === 'same' ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
              border: `1.5px solid ${scheduleVariability === 'same' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
              cursor: 'pointer'
            }}
          >
            <input
              type="radio"
              name="scheduleVariability"
              checked={scheduleVariability === 'same'}
              onChange={() => {}}
              style={{ width: 16, height: 16 }}
            />
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                My schedule is usually the same
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Consistent daily wake & sleep rhythm
              </div>
            </div>
          </label>

          <label
            onClick={() => handleVariabilityChange('changes')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.75rem 0.95rem',
              borderRadius: 'var(--radius-md)',
              background: scheduleVariability === 'changes' ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
              border: `1.5px solid ${scheduleVariability === 'changes' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
              cursor: 'pointer'
            }}
          >
            <input
              type="radio"
              name="scheduleVariability"
              checked={scheduleVariability === 'changes'}
              onChange={() => {}}
              style={{ width: 16, height: 16 }}
            />
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                My schedule changes
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Rotating shifts, night work, or changing patterns
              </div>
            </div>
          </label>
        </div>

        {/* ⚡ Quick Shift Adjustment for Today (Fully Customizable) */}
        <div style={{ background: 'var(--bg-tertiary)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                ⚡ Quick Shift Adjustment for Today
              </strong>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>
                Select, edit, or create shifts. Your manually entered times take priority for today.
              </span>
            </div>

            {isShiftOverrideActive && (
              <button
                type="button"
                onClick={handleClearShiftOverride}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.74rem', padding: '0.3rem 0.7rem', gap: '0.25rem' }}
              >
                <RotateCw size={12} /> Reset to Default ({dayStartTime} – {sleepTime})
              </button>
            )}
          </div>

          {/* Shifts Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem', marginBottom: '1rem' }}>
            {allShifts.map(shift => {
              const isActive = isShiftOverrideActive && todayStartOverride === shift.start && todaySleepOverride === shift.sleep;
              const isEditing = editingShiftKey === shift.key;
              const duration = calculateDuration(shift.start, shift.sleep);

              return (
                <div
                  key={shift.key}
                  style={{
                    background: isActive ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                    border: `1.5px solid ${isActive ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong style={{ fontSize: '0.86rem', color: 'var(--text-primary)', display: 'block' }}>
                        {shift.label}
                      </strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {shift.desc}
                      </span>
                    </div>

                    {isActive && (
                      <span className="pill-badge primary" style={{ fontSize: '0.62rem' }}>
                        Active
                      </span>
                    )}
                  </div>

                  {!isEditing ? (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        <span>🕒 {shift.start} → {shift.sleep}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({duration})</span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          type="button"
                          onClick={() => handleApplyShift(shift.start, shift.sleep, shift.label)}
                          className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                          style={{ flex: 1, fontSize: '0.74rem', padding: '0.3rem 0.5rem' }}
                        >
                          {isActive ? '✓ Applied' : 'Apply Today'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditShift(shift)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.74rem', padding: '0.3rem 0.55rem' }}
                          title="Edit shift hours"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Shift Inline Editor */
                    <div style={{ background: 'var(--bg-tertiary)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem' }}>
                        <div>
                          <label style={{ fontSize: '0.66rem', color: 'var(--text-muted)', display: 'block' }}>Start</label>
                          <input
                            type="time"
                            value={shiftStartInput}
                            onChange={e => setShiftStartInput(e.target.value)}
                            className="input-field"
                            style={{ fontSize: '0.78rem', padding: '0.25rem 0.35rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.66rem', color: 'var(--text-muted)', display: 'block' }}>Sleep</label>
                          <input
                            type="time"
                            value={shiftSleepInput}
                            onChange={e => setShiftSleepInput(e.target.value)}
                            className="input-field"
                            style={{ fontSize: '0.78rem', padding: '0.25rem 0.35rem' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.2rem' }}>
                        <button
                          type="button"
                          onClick={() => handleApplyShift(shiftStartInput, shiftSleepInput, shift.label)}
                          className="btn btn-primary btn-sm"
                          style={{ flex: 1, fontSize: '0.72rem', padding: '0.25rem 0.4rem' }}
                        >
                          Save & Apply
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingShiftKey(null)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.72rem', padding: '0.25rem 0.4rem' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add Additional Custom Shift */}
          {!isAddingCustomShift ? (
            <button
              type="button"
              onClick={() => setIsAddingCustomShift(true)}
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.3rem', fontSize: '0.76rem' }}
            >
              <span>➕ Add Custom Shift</span>
            </button>
          ) : (
            <form onSubmit={handleSaveCustomShift} style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Create Custom Shift
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Shift Name (e.g. Split Shift, On-Call)"
                  value={newShiftName}
                  onChange={e => setNewShiftName(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '0.8rem' }}
                  required
                />
                <input
                  type="time"
                  value={newShiftStart}
                  onChange={e => setNewShiftStart(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '0.8rem' }}
                  required
                />
                <input
                  type="time"
                  value={newShiftSleep}
                  onChange={e => setNewShiftSleep(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '0.8rem' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsAddingCustomShift(false)} className="btn btn-secondary btn-sm" style={{ fontSize: '0.74rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ fontSize: '0.74rem' }}>
                  Save Custom Shift
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* 3. Visual Wellness Day Logic Explanation */}
      <div 
        style={{
          background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--accent-primary-light) 100%)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
          <Info size={16} color="var(--accent-primary)" />
          <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            How Your Wellness Day Works
          </h4>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem 0', lineHeight: 1.45 }}>
          Your rhythm creates a seamless <strong>Wellness Day</strong> window (<strong>{info.dayStartTime} to {info.sleepTime}</strong>). 
          {info.isOvernight ? (
            <span> Activities logged across midnight (e.g. at 18:00, 01:00, 05:00, or 07:00) all count toward the <strong>same wellness period</strong>.</span>
          ) : (
            <span> Activities logged between {info.dayStartTime} and {info.sleepTime} all count toward your daily wellness score and habit meters.</span>
          )}
        </p>

        {/* Timeline representation */}
        <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '1rem' }}>🌅</span>
            <div>
              <strong>Start: {info.dayStartTime}</strong>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Meters begin</div>
            </div>
          </div>

          <div style={{ flex: 1, margin: '0 0.75rem', height: 4, background: 'linear-gradient(90deg, var(--accent-secondary) 0%, var(--accent-primary) 50%, var(--accent-purple) 100%)', borderRadius: 2, position: 'relative' }}>
            <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', fontSize: '0.64rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              {info.isOvernight ? 'Continuous Overnight Cycle (No Midnight Reset)' : 'Active Daytime Cycle'}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '1rem' }}>🌙</span>
            <div>
              <strong>Sleep: {info.sleepTime}</strong>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Reflection & Rest</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.6rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <Calendar size={12} />
          <span><strong>Calendar Dates:</strong> Standard calendar dates remain exact real-world dates for all calendar events.</span>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div 
          style={{
            position: 'fixed',
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--accent-primary)',
            color: '#ffffff',
            padding: '0.45rem 1.15rem',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.82rem',
            fontWeight: 700,
            boxShadow: 'var(--shadow-lg)',
            zIndex: 300,
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {toastMessage}
        </div>
      )}

    </div>
  );
}
