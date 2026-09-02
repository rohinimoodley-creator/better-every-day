import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import {
  Droplet,
  Plus,
  Minus,
  Clock,
  Sparkles,
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Calendar,
  Zap,
  Info,
  ShieldCheck,
  RefreshCw,
  Sun,
  Moon,
  Coffee,
  Heart,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';

const HYDRATION_PRESETS = [
  { amount: 250, label: 'Glass', icon: '🥛', desc: 'Standard cup (250 ml)' },
  { amount: 330, label: 'Can / Mug', icon: '☕', desc: 'Warm tea or mug (330 ml)' },
  { amount: 500, label: 'Bottle', icon: '🍶', desc: 'Active water bottle (500 ml)' },
  { amount: 750, label: 'Large Flask', icon: '🚰', desc: 'Hydro flask (750 ml)' },
  { amount: 1000, label: '1 Liter', icon: '🧊', desc: 'Full liter bottle (1000 ml)' }
];

const BEVERAGE_TYPES = [
  { id: 'water', label: 'Pure Water', icon: '💧', boost: '100% Hydrating' },
  { id: 'lemon_water', label: 'Lemon / Fruit Water', icon: '🍋', boost: 'Digestive Glow' },
  { id: 'herbal_tea', label: 'Herbal Infusion', icon: '🍵', boost: 'Calming & Warm' },
  { id: 'electrolytes', label: 'Electrolytes', icon: '⚡', boost: 'Mineral Replenish' },
  { id: 'coconut_water', label: 'Coconut Water', icon: '🥥', boost: 'Potassium Rich' }
];

export default function HydrateHub({ onNavigateTab }) {
  const {
    userProfile,
    setUserProfile,
    hydrationMl,
    incrementHydration,
    howIThrive
  } = useWellness();

  const [selectedBeverage, setSelectedBeverage] = useState('water');
  const [customInput, setCustomInput] = useState('');
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [goalEditing, setGoalEditing] = useState(false);
  const [newGoal, setNewGoal] = useState(userProfile.hydrationGoalMl || 2250);

  const goalMl = userProfile.hydrationGoalMl || 2250;
  const percentage = Math.min(100, Math.round((hydrationMl / goalMl) * 100));
  const remainingMl = Math.max(0, goalMl - hydrationMl);
  const cupsDrunk = (hydrationMl / 250).toFixed(1);
  const cupsTarget = (goalMl / 250).toFixed(0);

  const handleQuickAdd = (amount) => {
    if (incrementHydration) {
      incrementHydration(amount);
      const bev = BEVERAGE_TYPES.find(b => b.id === selectedBeverage)?.label || 'Water';
      setCelebrationMessage(`+${amount}ml ${bev} logged! 💧`);
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

  const handleCustomAdd = (e) => {
    e.preventDefault();
    const val = parseInt(customInput, 10);
    if (val && val > 0) {
      handleQuickAdd(val);
      setCustomInput('');
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
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Under Nourishment Pillar
            </span>
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            Hydrate & Refresh 💧
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Steady, gentle cellular hydration to fuel mental clarity and physical vitality.
          </p>
        </div>

        {onNavigateTab && (
          <button
            onClick={() => onNavigateTab('NOURISH')}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.35rem', fontSize: '0.8rem' }}
          >
            <span>Back to Nourish Hub 🥗</span>
          </button>
        )}
      </div>

      {/* 1. MAIN HYDRATION STATUS & PROGRESS GAUGE */}
      <div 
        className="card-glass"
        style={{
          background: 'linear-gradient(135deg, var(--bg-glass-card) 0%, rgba(58, 134, 200, 0.08) 100%)',
          padding: '1.75rem',
          border: '1px solid var(--border-glass)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          alignItems: 'center'
        }}
      >
        {/* Visual Water Wave Card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div 
            style={{
              width: 108,
              height: 108,
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
                width: 86,
                height: 86,
                borderRadius: '50%',
                background: 'var(--bg-secondary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Droplet size={24} color="#3a86c8" style={{ marginBottom: 2 }} />
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                {percentage}%
              </span>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                of daily goal
              </span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
              Today's Water Intake
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {hydrationMl.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>/ {goalMl.toLocaleString()} ml</span>
            </div>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {remainingMl === 0 
                ? '🎉 Daily target reached! Sip gently as you feel thirsty.'
                : `${remainingMl} ml remaining (~${(remainingMl / 250).toFixed(1)} glasses).`}
            </p>

            {celebrationMessage && (
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: 800, marginTop: '0.4rem', animation: 'fadeIn 0.2s ease-out' }}>
                {celebrationMessage}
              </div>
            )}
          </div>
        </div>

        {/* Target Goal Modifier & Stats */}
        <div style={{ background: 'var(--bg-secondary)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              Comfortable Daily Goal
            </span>
            <button
              onClick={() => setGoalEditing(prev => !prev)}
              style={{ background: 'transparent', border: 'none', color: '#3a86c8', cursor: 'pointer', fontSize: '0.76rem', fontWeight: 700 }}
            >
              {goalEditing ? 'Cancel' : 'Adjust Goal ⚙️'}
            </button>
          </div>

          {goalEditing ? (
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <input
                type="number"
                value={newGoal}
                onChange={e => setNewGoal(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.4rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-glass)',
                  fontSize: '0.85rem'
                }}
                placeholder="2250 ml"
              />
              <button
                onClick={handleSaveGoal}
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}
              >
                Save
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {goalMl} ml
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 4 }}>
                  (~{cupsTarget} cups)
                </span>
              </div>
              <span className="pill-badge primary" style={{ fontSize: '0.7rem' }}>
                Tailored for Energy
              </span>
            </div>
          )}

          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            💡 <strong>Hydration Tip:</strong> Drinking a small glass right when you wake up primes your digestion and clears morning brain fog.
          </div>
        </div>
      </div>

      {/* 2. BEVERAGE TYPE SELECTOR & QUICK LOG PRESETS */}
      <div className="card-glass" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: '0.2rem' }}>
            1. Select Beverage Type
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Choose what you're sipping to record wholesome hydration nuances:
          </span>
        </div>

        {/* Beverage Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {BEVERAGE_TYPES.map(bev => {
            const isSelected = selectedBeverage === bev.id;
            return (
              <button
                key={bev.id}
                onClick={() => setSelectedBeverage(bev.id)}
                style={{
                  padding: '0.55rem 0.95rem',
                  borderRadius: 'var(--radius-pill)',
                  border: `1.5px solid ${isSelected ? '#3a86c8' : 'var(--border-subtle)'}`,
                  background: isSelected ? 'rgba(58, 134, 200, 0.15)' : 'var(--bg-secondary)',
                  color: isSelected ? '#3a86c8' : 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <span>{bev.icon}</span>
                <span>{bev.label}</span>
              </button>
            );
          })}
        </div>

        <div style={{ marginBottom: '0.85rem' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: '0.2rem' }}>
            2. Tap Amount to Log Instantly
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            One-touch quick addition:
          </span>
        </div>

        {/* Presets Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {HYDRATION_PRESETS.map(preset => (
            <button
              key={preset.amount}
              onClick={() => handleQuickAdd(preset.amount)}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                textAlign: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                transition: 'all var(--transition-fast)'
              }}
              className="card-interactive"
            >
              <span style={{ fontSize: '1.4rem' }}>{preset.icon}</span>
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                +{preset.amount} ml
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {preset.label}
              </span>
            </button>
          ))}
        </div>

        {/* Custom Amount Form */}
        <form onSubmit={handleCustomAdd} style={{ display: 'flex', gap: '0.5rem', maxWidth: 360 }}>
          <input
            type="number"
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            placeholder="Custom ml (e.g. 400)"
            style={{
              flex: 1,
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border-glass)',
              fontSize: '0.84rem'
            }}
          />
          <button
            type="submit"
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', gap: '0.3rem' }}
          >
            <Plus size={14} /> Add Custom
          </button>
        </form>
      </div>

      {/* 3. OPTIMAL HYDRATION RHYTHMS & CELLULAR SCIENCE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        
        {/* Rhythm Schedule Card */}
        <div className="card-glass" style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
            <Clock size={16} color="#3a86c8" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Optimal Daily Rhythm
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem' }}>
              <Sun size={15} color="var(--accent-gold)" style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Morning Wakeup (250–500 ml):</strong>
                <div style={{ color: 'var(--text-secondary)' }}>Replenishes fluids lost during sleep and jumpstarts gut motility.</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem' }}>
              <Zap size={15} color="#3a86c8" style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Midday Focus (500–750 ml):</strong>
                <div style={{ color: 'var(--text-secondary)' }}>Prevents the common 2:30 PM energy dip and tension headaches.</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem' }}>
              <Moon size={15} color="#7b61ff" style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Evening Winddown (250 ml):</strong>
                <div style={{ color: 'var(--text-secondary)' }}>Gentle warm herbal tea or water without overloading the bladder before sleep.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Body Signals Connection */}
        <div className="card-glass" style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
            <Heart size={16} color="var(--accent-rose)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Hydration & Body Signals
            </h3>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: '0 0 0.75rem 0' }}>
            Dehydration frequently disguises itself as sugar cravings, afternoon sluggishness, or dull temple tension.
          </p>

          <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem 0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
              🧠 Did you know?
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              Even a 1.5% drop in hydration can reduce working memory and elevate perceived task difficulty.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
