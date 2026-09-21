import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import PetProfileModal from './PetProfileModal';
import PetPlayHistoryModal from './PetPlayHistoryModal';
import {
  X,
  Plus,
  BookOpen,
  Settings,
  ChevronLeft,
  CheckCircle,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatUnit } from '../../utils/formatters';

const SPECIES_ACTIVITY_SUGGESTIONS = {
  Dog: [
    { name: 'Ball Fetch & Running', icon: '🎾' },
    { name: 'Gentle Walk', icon: '🦮' },
    { name: 'Tug of War', icon: '🪢' },
    { name: 'Park Romp & Agility', icon: '🌳' },
    { name: 'Sniff Walk & Exploration', icon: '👃' }
  ],
  Cat: [
    { name: 'Laser Pointer Chase', icon: '🔴' },
    { name: 'Feather Wand & Jumping', icon: '🪶' },
    { name: 'Box & Tunnel Exploration', icon: '📦' },
    { name: 'Ribbon & String Agility', icon: '🧶' }
  ],
  Rabbit: [
    { name: 'Hop Obstacle Course', icon: '🌿' },
    { name: 'Floor Play & Zoomies', icon: '🐰' }
  ],
  Other: [
    { name: 'Gentle Active Play', icon: '✨' },
    { name: 'Exploration & Pacing', icon: '🐾' }
  ]
};

const DURATION_PRESETS = [10, 15, 20, 30, 45];

export default function PetPlayFlowModal({ isOpen, onClose }) {
  const {
    petProfiles = [],
    logPetPlayActivity,
    getPetPlayStats,
    addWellnessEvent
  } = useWellness();

  const [step, setStep] = useState('select_pet'); // 'select_pet' | 'activity_duration' | 'completed'
  const [selectedPetId, setSelectedPetId] = useState(petProfiles[0]?.id || '');
  const [activityType, setActivityType] = useState('');
  const [durationMin, setDurationMin] = useState(15);
  const [notes, setNotes] = useState('');

  const [isManageProfilesOpen, setIsManageProfilesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  if (!isOpen) return null;

  const currentPet = petProfiles.find((p) => p.id === selectedPetId) || petProfiles[0] || null;
  const petSpecies = currentPet?.type || 'Dog';
  const suggestions = SPECIES_ACTIVITY_SUGGESTIONS[petSpecies] || SPECIES_ACTIVITY_SUGGESTIONS.Other;

  const handleSelectPet = (petId) => {
    setSelectedPetId(petId);
    const pet = petProfiles.find((p) => p.id === petId);
    const defaultSugg = SPECIES_ACTIVITY_SUGGESTIONS[pet?.type || 'Dog']?.[0]?.name || 'Gentle Play';
    setActivityType(defaultSugg);
    setStep('activity_duration');
  };

  const handleSavePlay = (e) => {
    e.preventDefault();
    if (!currentPet) return;

    if (logPetPlayActivity) {
      logPetPlayActivity({
        petId: currentPet.id,
        activityType: activityType || 'Active Playtime',
        durationMin,
        notes: notes.trim()
      });
    }

    if (addWellnessEvent) {
      addWellnessEvent({
        type: 'pet_play',
        petName: currentPet.name,
        petType: currentPet.type,
        activityType: activityType || 'Active Playtime',
        durationMinutes: durationMin,
        timestamp: new Date().toISOString()
      });
    }

    try {
      confetti({ particleCount: 35, spread: 55, origin: { y: 0.7 } });
    } catch (err) {}

    setStep('completed');
  };

  const resetFlow = () => {
    setStep('select_pet');
    setNotes('');
    setDurationMin(15);
  };

  const stats = getPetPlayStats ? getPetPlayStats() : { totalMinsThisWeek: 0 };
  const weeklyTotalMins = (stats && typeof stats.totalMinsThisWeek === 'number') ? stats.totalMinsThisWeek : 0;

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 260, alignItems: 'flex-end', padding: 0 }}>
      <div
        className="modal-sheet"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 540,
          maxHeight: '85vh',
          borderRadius: '24px 24px 0 0',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          boxSizing: 'border-box'
        }}
      >
        {/* Drag handle */}
        <div style={{ width: 36, height: 4, background: 'var(--border-subtle)', borderRadius: 2, margin: '0 auto -0.25rem' }} />

        {/* 1. Header Row (~56dp, Section 6.2.5) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0, flex: 1 }}>
            <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>🐾</span>
            <h3
              style={{
                fontSize: '1.05rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Pet Play & Movement
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              aria-label="Pet Play History"
              className="touch-target-44"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
              title="History"
            >
              <BookOpen size={18} />
            </button>

            <button
              type="button"
              onClick={() => setIsManageProfilesOpen(true)}
              aria-label="Manage Pet Profiles"
              className="touch-target-44"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
              title="Pets"
            >
              <Settings size={18} />
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="touch-target-44"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Subtitle */}
        <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
          Time spent moving with pets you love counts toward your daily active minutes.
        </p>

        {/* STEP 1: SELECT PET */}
        {step === 'select_pet' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '0.2rem 0 0 0', color: 'var(--text-primary)' }}>
              Who were you moving with today? 🐶🐱
            </h4>

            {/* Horizontal Row of Compact Pet Chips */}
            <div
              className="hide-scrollbar"
              style={{
                display: 'flex',
                gap: '0.5rem',
                overflowX: 'auto',
                paddingBottom: '0.2rem'
              }}
            >
              {petProfiles.map((pet) => (
                <button
                  key={pet.id}
                  type="button"
                  onClick={() => handleSelectPet(pet.id)}
                  style={{
                    width: 96,
                    minHeight: 88,
                    borderRadius: 'var(--radius-card)',
                    border: selectedPetId === pet.id ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    background: 'var(--bg-secondary)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.2rem',
                    cursor: 'pointer',
                    flexShrink: 0,
                    padding: '0.5rem 0.25rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <span style={{ fontSize: '1.6rem' }}>{pet.avatar || (pet.type === 'Cat' ? '🐱' : '🐶')}</span>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '84px' }}>
                    {pet.name}
                  </strong>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{pet.type}</span>
                </button>
              ))}

              {/* + Add Pet Chip */}
              <button
                type="button"
                onClick={() => setIsManageProfilesOpen(true)}
                style={{
                  width: 96,
                  minHeight: 88,
                  borderRadius: 'var(--radius-card)',
                  border: '1px dashed var(--accent-primary)',
                  background: 'var(--bg-tertiary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                  cursor: 'pointer',
                  flexShrink: 0,
                  color: 'var(--accent-primary)'
                }}
              >
                <Plus size={20} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>+ Add</span>
              </button>
            </div>

            {/* Weekly Total Row (Bug 4 Fix: null-safe formatUnit) */}
            <div
              style={{
                background: 'var(--bg-tertiary)',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8125rem'
              }}
            >
              <span style={{ color: 'var(--text-secondary)' }}>This week with pets:</span>
              <span className="tabular-nums" style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>
                {formatUnit(weeklyTotalMins, 'mins')}
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: LOG PLAY DETAILS */}
        {step === 'activity_duration' && currentPet && (
          <form onSubmit={handleSavePlay} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--accent-primary-light)', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '1.2rem' }}>{currentPet.avatar || '🐾'}</span>
                <strong style={{ fontSize: '0.85rem', color: 'var(--accent-primary)' }}>
                  {currentPet.name} ({currentPet.type})
                </strong>
              </div>
              <button
                type="button"
                onClick={resetFlow}
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Change Pet
              </button>
            </div>

            {/* Activity Presets */}
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Activity:</span>
              <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', padding: '0.25rem 0' }} className="hide-scrollbar">
                {suggestions.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => setActivityType(s.name)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.3rem 0.65rem',
                      minHeight: '34px',
                      borderRadius: 'var(--radius-pill)',
                      border: activityType === s.name ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      background: activityType === s.name ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                      color: activityType === s.name ? '#ffffff' : 'var(--text-primary)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    <span>{s.icon}</span>
                    <span>{s.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Presets */}
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Duration:</span>
              <div style={{ display: 'flex', gap: '0.35rem', padding: '0.25rem 0' }}>
                {DURATION_PRESETS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDurationMin(m)}
                    style={{
                      flex: 1,
                      padding: '0.35rem 0',
                      minHeight: '34px',
                      borderRadius: 'var(--radius-chip)',
                      border: durationMin === m ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      background: durationMin === m ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                      color: durationMin === m ? '#ffffff' : 'var(--text-primary)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                marginTop: '0.25rem',
                padding: '0.65rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '0.88rem',
                minHeight: '44px'
              }}
            >
              Save Pet Movement ({durationMin}m)
            </button>
          </form>
        )}

        {/* STEP 3: COMPLETED CONFIRMATION */}
        {step === 'completed' && (
          <div style={{ textAlign: 'center', padding: '1rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={36} color="var(--accent-primary)" />
            <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
              Pet Play Logged! 🎉
            </strong>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              +{durationMin} mins added to your Move totals and Link Engine picture.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="btn-primary"
              style={{ marginTop: '0.5rem', padding: '0.5rem 1.5rem', borderRadius: 'var(--radius-pill)', border: 'none', cursor: 'pointer' }}
            >
              Done
            </button>
          </div>
        )}
      </div>

      {isManageProfilesOpen && (
        <PetProfileModal
          isOpen={isManageProfilesOpen}
          onClose={() => setIsManageProfilesOpen(false)}
        />
      )}

      {isHistoryOpen && (
        <PetPlayHistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}
    </div>
  );
}
