import React, { useState, useRef } from 'react';
import { useWellness } from '../../context/WellnessContext';
import {
  Droplet,
  Sparkles,
  Edit2,
  AlertCircle,
  RotateCcw,
  Sun,
  Undo2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import SectionHeader from '../common/SectionHeader';
import Expander from '../common/Expander';
import { formatNumber, formatUnit } from '../../utils/formatters';

export default function HydrateHub() {
  const {
    userProfile,
    setUserProfile,
    hydrationMl,
    incrementHydration,
    isHotWeather,
    toggleHotWeather,
    linkEngineOutput,
    undoHydrationAdjustment
  } = useWellness();

  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [pacingWarning, setPacingWarning] = useState('');
  const [goalEditing, setGoalEditing] = useState(false);
  const [newGoal, setNewGoal] = useState(userProfile?.hydrationGoalMl || 2250);
  const [cupSizeEditing, setCupSizeEditing] = useState(false);
  const [cupSizeMl, setCupSizeMl] = useState(userProfile?.cupSizeMl || 250);
  const [newCupSize, setNewCupSize] = useState(userProfile?.cupSizeMl || 250);

  const recentIntakeRef = useRef([]);

  // Link Engine Computed Goals & Adjustments
  const baseGoal = userProfile?.hydrationGoalMl || 2250;
  const activityBonus = linkEngineOutput?.adjustments?.activityHydrationBonus || 0;
  const adjustmentReasons = linkEngineOutput?.adjustments?.hydrationAdjustmentReasons || [];
  const adjustedGoal = linkEngineOutput?.adjustments?.adjustedHydrationGoal || baseGoal;
  const isUndoApplied = linkEngineOutput?.adjustments?.isUndoApplied;

  const currentIntake = hydrationMl || 0;
  const percentage = Math.min(100, Math.round((currentIntake / adjustedGoal) * 100));
  const remainingMl = Math.max(0, adjustedGoal - currentIntake);
  const remainingCups = Math.max(0, Math.ceil(remainingMl / cupSizeMl));
  const targetCups = Math.max(1, Math.round(adjustedGoal / cupSizeMl));
  const currentCups = Math.floor(currentIntake / cupSizeMl);

  const handleSaveCupSize = () => {
    const val = parseInt(newCupSize, 10);
    if (val && val >= 100 && val <= 1000) {
      setCupSizeMl(val);
      setUserProfile((prev) => ({ ...prev, cupSizeMl: val }));
      setCupSizeEditing(false);
    }
  };

  const handleQuickAdd = (amount) => {
    if (incrementHydration) {
      incrementHydration(amount);
      setCelebrationMessage(`+${amount} ml logged! 💧`);
      setTimeout(() => setCelebrationMessage(''), 3000);

      const now = Date.now();
      recentIntakeRef.current = [
        ...recentIntakeRef.current.filter((entry) => now - entry.time < 180000),
        { amount, time: now }
      ];
      const rapidSum = recentIntakeRef.current.reduce((sum, entry) => sum + entry.amount, 0);

      if (amount >= 750 || rapidSum >= 800) {
        setPacingWarning('Take it slowly 💧 — Sip throughout the day rather than all at once.');
        setTimeout(() => setPacingWarning(''), 8000);
      } else {
        setPacingWarning('');
      }

      try {
        confetti({
          particleCount: 24,
          spread: 40,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    }
  };

  const handleSaveGoal = () => {
    const val = parseInt(newGoal, 10);
    if (val && val >= 500) {
      setUserProfile((prev) => ({
        ...prev,
        hydrationGoalMl: val
      }));
      setGoalEditing(false);
    }
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Section Header */}
      <SectionHeader
        title="Hydrate & Refresh"
        emoji="💧"
        caption="Steady cellular hydration to support vitality and focus."
        action={
          <button
            id="hydrate-hot-weather-toggle"
            type="button"
            onClick={toggleHotWeather}
            aria-pressed={isHotWeather}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.75rem',
              minHeight: '38px',
              borderRadius: 'var(--radius-pill)',
              border: isHotWeather ? '1px solid #e09f3e' : '1px solid var(--border-subtle)',
              background: isHotWeather ? 'rgba(224, 159, 62, 0.15)' : 'var(--bg-secondary)',
              color: isHotWeather ? '#e09f3e' : 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Toggle warm weather recommendation boost"
          >
            <Sun size={13} color={isHotWeather ? '#e09f3e' : 'var(--text-muted)'} />
            <span>{isHotWeather ? 'Hot Day (+250 ml)' : 'Warm Weather?'}</span>
          </button>
        }
      />

      {/* Pacing safety notice */}
      {pacingWarning && (
        <div
          className="card-compact"
          style={{
            background: 'rgba(58, 134, 200, 0.1)',
            border: '1px solid rgba(58, 134, 200, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.8rem',
            color: 'var(--text-primary)'
          }}
        >
          <AlertCircle size={16} color="#3a86c8" style={{ flexShrink: 0 }} />
          <span>{pacingWarning}</span>
        </div>
      )}

      {/* 1. MAIN INTAKE CARD (Section 6.4.3 ~220dp) */}
      <div
        className="card-compact"
        style={{
          background: 'linear-gradient(135deg, var(--bg-glass-card) 0%, rgba(58, 134, 200, 0.06) 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          {/* 88dp Water Ring */}
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              background: `conic-gradient(#3a86c8 0deg ${percentage * 3.6}deg, var(--bg-tertiary) ${percentage * 3.6}deg 360deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(58, 134, 200, 0.2)',
              flexShrink: 0
            }}
          >
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                background: 'var(--bg-secondary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Droplet size={18} color="#3a86c8" />
              <span className="tabular-nums" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                {percentage}%
              </span>
            </div>
          </div>

          {/* Intake Text & Status */}
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span className="tabular-nums" style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {formatNumber(currentIntake)}
              </span>
              <span className="tabular-nums" style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                / {formatNumber(adjustedGoal)} ml
              </span>

              {/* Activity adjustment note with Undo chip */}
              {activityBonus > 0 && !isUndoApplied && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    background: 'rgba(58, 134, 200, 0.12)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#3a86c8'
                  }}
                >
                  <span>(+{activityBonus} for {adjustmentReasons[0] || 'activity'})</span>
                  <button
                    type="button"
                    onClick={undoHydrationAdjustment}
                    aria-label="Undo hydration goal adjustment"
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      color: '#3a86c8',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Undo bonus"
                  >
                    <Undo2 size={11} />
                  </button>
                </div>
              )}
            </div>

            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {remainingMl === 0
                ? '🎉 Daily target reached! Sip gently to thirst.'
                : `${formatNumber(remainingMl)} ml left (~${remainingCups} ${remainingCups === 1 ? 'cup' : 'cups'})`}
            </p>

            {/* Same-style Adjustment Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => { setGoalEditing(prev => !prev); setCupSizeEditing(false); }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  minHeight: '32px'
                }}
              >
                <Edit2 size={11} color="var(--accent-primary)" />
                <span>{goalEditing ? 'Cancel' : 'Adjust goal'}</span>
              </button>

              <button
                type="button"
                onClick={() => { setCupSizeEditing(prev => !prev); setGoalEditing(false); }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  minHeight: '32px'
                }}
              >
                <span>Cup size: {cupSizeMl} ml</span>
              </button>
            </div>
          </div>
        </div>

        {/* Goal Edit Inline Inputs */}
        {goalEditing && (
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', paddingTop: '0.4rem', borderTop: '1px solid var(--border-subtle)' }}>
            <input
              type="number"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              style={{
                width: 110,
                padding: '0.35rem 0.6rem',
                borderRadius: 'var(--radius-chip)',
                border: '1px solid var(--border-glass)',
                fontSize: '0.85rem'
              }}
              placeholder="2250"
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ml base goal</span>
            <button
              type="button"
              onClick={handleSaveGoal}
              className="btn-soft"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: 'var(--radius-pill)', border: 'none', cursor: 'pointer' }}
            >
              Save
            </button>
          </div>
        )}

        {/* Cup Size Edit Inline Inputs */}
        {cupSizeEditing && (
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', paddingTop: '0.4rem', borderTop: '1px solid var(--border-subtle)' }}>
            <input
              type="number"
              value={newCupSize}
              onChange={(e) => setNewCupSize(e.target.value)}
              style={{
                width: 90,
                padding: '0.35rem 0.6rem',
                borderRadius: 'var(--radius-chip)',
                border: '1px solid var(--border-glass)',
                fontSize: '0.85rem'
              }}
              placeholder="250"
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ml per cup</span>
            <button
              type="button"
              onClick={handleSaveCupSize}
              className="btn-soft"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: 'var(--radius-pill)', border: 'none', cursor: 'pointer' }}
            >
              Save
            </button>
          </div>
        )}

        {celebrationMessage && (
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
            {celebrationMessage}
          </div>
        )}

        {/* Quick Add Row: 3 Equal Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', marginTop: '0.2rem' }}>
          <button
            type="button"
            onClick={() => handleQuickAdd(cupSizeMl)}
            className="btn-primary"
            style={{
              padding: '0.65rem 0.5rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-chip)',
              minHeight: '44px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem'
            }}
          >
            <span>🥛</span>
            <span>+1 cup ({cupSizeMl} ml)</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickAdd(500)}
            className="btn-secondary"
            style={{
              padding: '0.65rem 0.5rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-chip)',
              minHeight: '44px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem'
            }}
          >
            <span>🍶</span>
            <span>+500 ml</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickAdd(750)}
            className="btn-secondary"
            style={{
              padding: '0.65rem 0.5rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-chip)',
              minHeight: '44px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem'
            }}
          >
            <span>🫗</span>
            <span>+750 ml</span>
          </button>
        </div>
      </div>

      {/* 2. RECOMMENDATION & PACING CARD (Section 6.4.3) */}
      <div
        className="card-compact"
        style={{
          borderLeft: '3px solid var(--accent-primary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Sparkles size={15} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Recommended Hydration & Pacing
          </h3>
        </div>

        {/* 3-Cell Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.5rem', borderRadius: 'var(--radius-chip)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Your Goal</div>
            <div className="tabular-nums" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {targetCups} cups
            </div>
            <div className="tabular-nums" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              ({formatNumber(adjustedGoal)} ml)
            </div>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '0.5rem', borderRadius: 'var(--radius-chip)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Remaining</div>
            <div className="tabular-nums" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#3a86c8' }}>
              {remainingCups} cups
            </div>
            <div className="tabular-nums" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              ({formatNumber(remainingMl)} ml)
            </div>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '0.5rem', borderRadius: 'var(--radius-chip)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pacing</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '0.15rem' }}>
              {remainingCups <= 0 ? 'Target Met' : '~1 cup / 2h'}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>before sleep</div>
          </div>
        </div>

        {/* Highlight Banner */}
        <div
          style={{
            background: 'var(--accent-primary-light)',
            padding: '0.45rem 0.75rem',
            borderRadius: 'var(--radius-chip)',
            fontSize: '0.8rem',
            color: 'var(--accent-primary)',
            fontWeight: 600,
            lineHeight: 1.35
          }}
        >
          {remainingCups <= 0
            ? 'Target met for today! Sip gently as comfortable.'
            : `Try approximately 1 cup every 2 hours until your wind-down rhythm.`}
        </div>

        {/* Expander for detailed explanation */}
        <Expander moreLabel="How this is calculated" lessLabel="Hide explanation">
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Your hydration target dynamically reflects your base goal ({baseGoal} ml) plus adjustments for logged movement
            {activityBonus > 0 ? ` (+${activityBonus} ml today)` : ''} and environmental weather. Pacing automatically stops before your scheduled sleep time so you can rest uninterrupted.
          </p>
        </Expander>
      </div>
    </div>
  );
}
