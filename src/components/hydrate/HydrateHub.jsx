import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import {
  Droplet,
  Sparkles,
  Edit2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ContextualPip from '../mascot/ContextualPip';

export default function HydrateHub() {
  const {
    userProfile,
    setUserProfile,
    hydrationMl,
    incrementHydration,
    getWaterRecommendation
  } = useWellness();

  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [goalEditing, setGoalEditing] = useState(false);
  const [newGoal, setNewGoal] = useState(userProfile.hydrationGoalMl || 2250);
  const [cupSizeEditing, setCupSizeEditing] = useState(false);
  const [cupSizeMl, setCupSizeMl] = useState(userProfile.cupSizeMl || 250);
  const [newCupSize, setNewCupSize] = useState(userProfile.cupSizeMl || 250);

  const goalMl = userProfile.hydrationGoalMl || 2250;
  const percentage = Math.min(100, Math.round((hydrationMl / goalMl) * 100));
  const remainingMl = Math.max(0, goalMl - hydrationMl);
  const cupsDrunk = (hydrationMl / cupSizeMl).toFixed(1);
  const cupsTarget = (goalMl / cupSizeMl).toFixed(0);

  // Dynamic Personal Water Recommendation
  const waterRec = getWaterRecommendation ? getWaterRecommendation() : {
    cupsTarget: Number(cupsTarget),
    currentCups: Math.floor(hydrationMl / cupSizeMl),
    remainingCups: Math.max(0, Number(cupsTarget) - Math.floor(hydrationMl / cupSizeMl)),
    pacingText: 'Try approximately 1 cup every 2 hours before sleep.'
  };

  const handleSaveCupSize = () => {
    const val = parseInt(newCupSize, 10);
    if (val && val >= 100 && val <= 1000) {
      setCupSizeMl(val);
      setUserProfile(prev => ({ ...prev, cupSizeMl: val }));
      setCupSizeEditing(false);
    }
  };

  const handleQuickAdd = (amount) => {
    if (incrementHydration) {
      incrementHydration(amount);
      setCelebrationMessage(`+${amount}ml water logged! 💧`);
      setTimeout(() => setCelebrationMessage(''), 2500);

      try {
        confetti({
          particleCount: 28,
          spread: 45,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    }
  };

  const handleSaveGoal = () => {
    const val = parseInt(newGoal, 10);
    if (val && val >= 500) {
      setUserProfile(prev => ({
        ...prev,
        hydrationGoalMl: val
      }));
      setGoalEditing(false);
    }
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
            <span className="pill-badge blue">
              <Droplet size={12} /> Hydration & Cellular Flow
            </span>
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            Hydrate & Refresh 💧
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Steady, gentle cellular hydration to fuel mental clarity and physical vitality.
          </p>
        </div>
      </div>

      {/* 1. MAIN HYDRATION STATUS & PROGRESS GAUGE */}
      <div 
        className="card-glass"
        style={{
          background: 'linear-gradient(135deg, var(--bg-glass-card) 0%, rgba(58, 134, 200, 0.08) 100%)',
          padding: '1.75rem',
          border: '1px solid var(--border-glass)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          {/* Visual Water Wave Gauge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div 
              style={{
                width: 104,
                height: 104,
                borderRadius: '50%',
                background: `conic-gradient(#3a86c8 0deg ${percentage * 3.6}deg, var(--bg-tertiary) ${percentage * 3.6}deg 360deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(58, 134, 200, 0.25)',
                flexShrink: 0
              }}
            >
              <div 
                style={{
                  width: 82,
                  height: 82,
                  borderRadius: '50%',
                  background: 'var(--bg-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Droplet size={22} color="#3a86c8" style={{ marginBottom: 2 }} />
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                  {percentage}%
                </span>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  of goal
                </span>
              </div>
            </div>

            <div>
              {/* Goal & Cup Size Adjusters */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Today's Water Intake
                </span>
                <button
                  onClick={() => { setGoalEditing(prev => !prev); setCupSizeEditing(false); }}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '0.2rem 0.55rem',
                    color: '#3a86c8',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                  title="Adjust your daily hydration goal"
                >
                  <Edit2 size={11} /> {goalEditing ? 'Cancel' : 'Adjust Goal'}
                </button>
                <button
                  onClick={() => { setCupSizeEditing(prev => !prev); setGoalEditing(false); }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '0.2rem 0.4rem',
                    color: '#3a86c8',
                    cursor: 'pointer',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    textDecoration: 'underline'
                  }}
                  title="Set your default cup size"
                >
                  Adjust cup size ({cupSizeMl} ml)
                </button>
              </div>

              {goalEditing && (
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem', marginBottom: '0.4rem' }}>
                  <input
                    type="number"
                    value={newGoal}
                    onChange={e => setNewGoal(e.target.value)}
                    style={{
                      width: 130,
                      padding: '0.35rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-glass)',
                      fontSize: '0.84rem'
                    }}
                    placeholder="2250 ml"
                  />
                  <button
                    onClick={handleSaveGoal}
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                  >
                    Save Goal
                  </button>
                </div>
              )}

              {cupSizeEditing && (
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginTop: '0.4rem', marginBottom: '0.4rem' }}>
                  <input
                    type="number"
                    value={newCupSize}
                    onChange={e => setNewCupSize(e.target.value)}
                    style={{
                      width: 110,
                      padding: '0.35rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-glass)',
                      fontSize: '0.84rem'
                    }}
                    placeholder="250 ml"
                  />
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>ml per cup</span>
                  <button
                    onClick={handleSaveCupSize}
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                  >
                    Save Cup Size
                  </button>
                </div>
              )}

              {!goalEditing && !cupSizeEditing && (
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                  {hydrationMl.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>/ {goalMl.toLocaleString()} ml</span>
                </div>
              )}

              <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                {remainingMl === 0 
                  ? '🎉 Daily target reached! Sip gently as you feel thirsty.'
                  : `${remainingMl} ml remaining (~${(remainingMl / cupSizeMl).toFixed(1)} cups).`}
              </p>

              {celebrationMessage && (
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: 800, marginTop: '0.4rem', animation: 'fadeIn 0.2s ease-out' }}>
                  {celebrationMessage}
                </div>
              )}
            </div>
          </div>

          {/* Quick 1-Cup Hero Button */}
          <button
            onClick={() => handleQuickAdd(cupSizeMl)}
            className="btn btn-primary"
            style={{
              padding: '0.75rem 1.4rem',
              fontSize: '0.92rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 16px rgba(58, 134, 200, 0.35)'
            }}
          >
            <span>🥛</span>
            <span>+ 1 Cup ({cupSizeMl} ml)</span>
          </button>
        </div>

        {/* Contextual Hydrate Pip */}
        <ContextualPip context="hydrate" layout="subtle" size={32} style={{ marginTop: '1.25rem' }} />
      </div>

      {/* 2. PERSONAL WATER RECOMMENDATION & PACING CARD */}
      <div 
        className="card-glass"
        style={{
          padding: '1.4rem',
          background: 'linear-gradient(135deg, var(--bg-glass-card) 0%, rgba(64, 145, 108, 0.08) 100%)',
          borderLeft: '4px solid var(--accent-primary)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Sparkles size={16} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Personal Water Recommendation & Pacing
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginTop: '0.85rem', marginBottom: '0.85rem' }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Personal Target</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>{waterRec.cupsTarget} cups</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({waterRec.cupsTarget * cupSizeMl} ml)</div>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Cups Remaining</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#3a86c8' }}>{waterRec.remainingCups} cups</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({waterRec.currentCups} of {waterRec.cupsTarget} logged)</div>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>Pacing Suggestion</div>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--accent-primary)', lineHeight: 1.35 }}>
              {waterRec.pacingText}
            </div>
          </div>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
          Calculated dynamically from your daily rhythm, logged activity, and hydration target to ensure comfortable, sustained cellular flow without night waking.
        </p>
      </div>

    </div>
  );
}


