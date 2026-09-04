import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { X, Check, Plus, Clock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const PET_ACTIVITY_SUGGESTIONS = {
  Dog: [
    { name: 'Playing fetch', icon: '🎾', category: 'Playing' },
    { name: 'Tug-of-war', icon: '🪢', category: 'Playing' },
    { name: 'Running together', icon: '🏃', category: 'Moving Together' },
    { name: 'Neighborhood walk', icon: '🦮', category: 'Moving Together' },
    { name: 'Chasing & agility', icon: '⚡', category: 'Playing' },
    { name: 'Backyard play', icon: '🌳', category: 'Gentle Activities' }
  ],
  Cat: [
    { name: 'Feather wand chase', icon: '🪶', category: 'Playing' },
    { name: 'Laser & floor play', icon: '🔴', category: 'Playing' },
    { name: 'Box & tunnel crawl', icon: '📦', category: 'Gentle Activities' },
    { name: 'Interactive hunt', icon: '🐾', category: 'Playing' }
  ],
  Rabbit: [
    { name: 'Gentle free roaming', icon: '🌿', category: 'Gentle Activities' },
    { name: 'Foraging & tunnel play', icon: '🥕', category: 'Playing' },
    { name: 'Binky & hop time', icon: '🐇', category: 'Moving Together' }
  ],
  Bird: [
    { name: 'Flight & perch play', icon: '🦜', category: 'Moving Together' },
    { name: 'Foraging toy play', icon: '🔔', category: 'Playing' },
    { name: 'Dancing & chirping', icon: '🎶', category: 'Gentle Activities' }
  ],
  Horse: [
    { name: 'Groundwork & grooming walk', icon: '🐴', category: 'Gentle Activities' },
    { name: 'Trail movement', icon: '🌲', category: 'Moving Together' },
    { name: 'Turnout & free movement', icon: '🌾', category: 'Playing' }
  ],
  Other: [
    { name: 'Active playtime', icon: '🐾', category: 'Playing' },
    { name: 'Exploring together', icon: '🌱', category: 'Moving Together' },
    { name: 'Floor movement', icon: '🎾', category: 'Gentle Activities' }
  ]
};

const DURATION_PRESETS = [10, 15, 20, 30, 45, 60];

export default function LogPetPlayModal({ isOpen, onClose, onOpenManagePets, defaultPetId }) {
  const { petProfiles = [], logPetPlayActivity } = useWellness();

  const [selectedPetId, setSelectedPetId] = useState(defaultPetId || petProfiles[0]?.id || '');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [customActivityName, setCustomActivityName] = useState('');
  const [isCustomActivity, setIsCustomActivity] = useState(false);
  const [durationMin, setDurationMin] = useState(30);
  const [notes, setNotes] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  if (!isOpen) return null;

  const currentPet = petProfiles.find(p => p.id === selectedPetId) || petProfiles[0];
  const suggestions = (currentPet && PET_ACTIVITY_SUGGESTIONS[currentPet.type]) 
    ? PET_ACTIVITY_SUGGESTIONS[currentPet.type] 
    : PET_ACTIVITY_SUGGESTIONS.Other;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalActivityName = isCustomActivity 
      ? customActivityName.trim() || 'Custom Pet Play' 
      : selectedActivity || suggestions[0]?.name || 'Play & Movement';

    if (!finalActivityName) return;

    logPetPlayActivity({
      petId: currentPet ? currentPet.id : 'pet_default',
      activityName: finalActivityName,
      category: isCustomActivity ? 'Custom Play' : (suggestions.find(s => s.name === finalActivityName)?.category || 'Playing'),
      durationMin: Number(durationMin) || 15,
      notes
    });

    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    } catch {}

    setToastMessage(`✓ Logged ${durationMin}m with ${currentPet ? currentPet.name : 'your pet'}! 🐾💚`);
    setTimeout(() => {
      setToastMessage('');
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-sheet"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 500,
          background: 'var(--bg-glass-card)',
          backdropFilter: 'blur(20px)',
          border: '1.5px solid var(--accent-primary)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          maxHeight: '88vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem'
              }}
            >
              🐾
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Log Pet Play
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.1rem 0 0 0' }}>
                You were spending time with someone you love — and moved together too.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {toastMessage && (
          <div style={{ background: 'var(--accent-primary-light)', border: '1px solid var(--accent-primary)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.84rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '1rem', textAlign: 'center', animation: 'fadeIn 0.2s ease-out' }}>
            {toastMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* 1. Who were you with? */}
          <div>
            <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.45rem' }}>
              1. 🐾 Who were you moving with?
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {petProfiles.map(p => {
                const active = (currentPet?.id === p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedPetId(p.id);
                      setSelectedActivity('');
                      setIsCustomActivity(false);
                    }}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: 'var(--radius-pill)',
                      border: active ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      background: active ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                      color: active ? 'var(--accent-primary)' : 'var(--text-primary)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{p.icon || '🐾'}</span>
                    <span>{p.name}</span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenManagePets) onOpenManagePets();
                }}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', gap: '0.25rem', borderRadius: 'var(--radius-pill)', padding: '0.4rem 0.75rem' }}
              >
                <Plus size={13} /> Add Pet
              </button>
            </div>
          </div>

          {/* 2. What did you do? */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                2. 🎾 What did you do?
              </label>
              {isCustomActivity && (
                <button
                  type="button"
                  onClick={() => setIsCustomActivity(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  ← Show Suggestions
                </button>
              )}
            </div>

            {!isCustomActivity ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.45rem' }}>
                {suggestions.map(s => {
                  const active = selectedActivity === s.name;
                  return (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => {
                        setSelectedActivity(s.name);
                        setIsCustomActivity(false);
                      }}
                      style={{
                        padding: '0.6rem 0.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: active ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        background: active ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                        color: active ? 'var(--accent-primary)' : 'var(--text-primary)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.25rem',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
                      <span>{s.name}</span>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => {
                    setIsCustomActivity(true);
                    setSelectedActivity('');
                  }}
                  style={{
                    padding: '0.6rem 0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px dashed var(--accent-primary)',
                    background: 'var(--bg-tertiary)',
                    color: 'var(--accent-primary)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <Plus size={16} />
                  <span>Custom Activity</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <input
                  type="text"
                  required
                  placeholder="e.g. Garden exploration, Agility tunnel, Frisbee catch"
                  value={customActivityName}
                  onChange={e => setCustomActivityName(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* 3. Duration */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={14} color="var(--accent-primary)" /> 3. ⏱️ Duration
              </label>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                {durationMin} minutes
              </span>
            </div>

            {/* Quick Chips */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.35rem', marginBottom: '0.5rem' }}>
              {DURATION_PRESETS.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDurationMin(d)}
                  style={{
                    padding: '0.45rem 0.2rem',
                    borderRadius: 'var(--radius-md)',
                    border: durationMin === d ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    background: durationMin === d ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                    color: durationMin === d ? '#ffffff' : 'var(--text-primary)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  {d}m
                </button>
              ))}
            </div>

            {/* Custom Minutes Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Or enter custom:</span>
              <input
                type="number"
                min="1"
                max="360"
                value={durationMin}
                onChange={e => setDurationMin(Math.max(1, Number(e.target.value)))}
                style={{
                  width: 65,
                  padding: '0.3rem 0.4rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontWeight: 800,
                  textAlign: 'center'
                }}
              />
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>minutes</span>
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
              Optional Notes or Memory
            </label>
            <input
              type="text"
              placeholder="e.g. Loved running across the grass today!"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="input-field"
              style={{ width: '100%', padding: '0.55rem 0.75rem', fontSize: '0.8rem' }}
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              padding: '0.85rem',
              fontSize: '0.95rem',
              fontWeight: 800,
              gap: '0.45rem',
              marginTop: '0.25rem'
            }}
          >
            <Check size={16} strokeWidth={3} />
            <span>Log Pet Activity ({durationMin}m)</span>
          </button>

        </form>
      </div>
    </div>
  );
}
