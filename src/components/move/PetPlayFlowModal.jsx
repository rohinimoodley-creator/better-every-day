import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import PetProfileModal from './PetProfileModal';
import PetPlayHistoryModal from './PetPlayHistoryModal';
import {
  X,
  Plus,
  Clock,
  Sparkles,
  Flame,
  CheckCircle,
  BookOpen,
  Settings,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SPECIES_ACTIVITY_SUGGESTIONS = {
  Dog: [
    { name: 'Ball Fetch & Running', icon: '🎾', calPerMin: 5.5 },
    { name: 'Gentle Walk', icon: '🦮', calPerMin: 4.0 },
    { name: 'Tug of War', icon: '🪢', calPerMin: 5.0 },
    { name: 'Park Romp & Agility', icon: '🌳', calPerMin: 6.0 },
    { name: 'Sniff Walk & Exploration', icon: '👃', calPerMin: 3.5 },
    { name: 'Backyard Agility', icon: '🏃‍♂️', calPerMin: 6.2 },
    { name: 'Floor Play & Wrestling', icon: '🐾', calPerMin: 4.8 }
  ],
  Cat: [
    { name: 'Laser Pointer Chase', icon: '🔴', calPerMin: 3.5 },
    { name: 'Feather Wand & Jumping', icon: '🪶', calPerMin: 4.2 },
    { name: 'Box & Tunnel Exploration', icon: '📦', calPerMin: 3.0 },
    { name: 'Ribbon & String Agility', icon: '🧶', calPerMin: 3.8 },
    { name: 'High-Pounce Play', icon: '🐾', calPerMin: 4.0 }
  ],
  Rabbit: [
    { name: 'Hop Obstacle Course', icon: '🌿', calPerMin: 4.0 },
    { name: 'Floor Play & Zoomies', icon: '🐰', calPerMin: 4.5 },
    { name: 'Cardboard Tunnel Fun', icon: '📦', calPerMin: 3.2 }
  ],
  Bird: [
    { name: 'Flying & Perch Training', icon: '🦜', calPerMin: 3.2 },
    { name: 'Shoulder Pacing & Dance', icon: '🎶', calPerMin: 3.0 },
    { name: 'Foraging Play', icon: '🌾', calPerMin: 2.8 }
  ],
  Horse: [
    { name: 'Paddock Leading & Walking', icon: '🐴', calPerMin: 6.5 },
    { name: 'Grooming & Active Care', icon: '🧽', calPerMin: 5.0 },
    { name: 'Groundwork & Lunging', icon: '🌾', calPerMin: 7.0 }
  ],
  Other: [
    { name: 'Gentle Active Play', icon: '✨', calPerMin: 3.8 },
    { name: 'Exploration & Pacing', icon: '🐾', calPerMin: 3.5 },
    { name: 'Habit Care & Movement', icon: '🌱', calPerMin: 3.2 }
  ]
};

const DURATION_PRESETS = [10, 15, 20, 30, 45, 60];

export default function PetPlayFlowModal({ isOpen, onClose }) {
  const {
    petProfiles = [],
    logPetPlayActivity,
    getPetPlayStats
  } = useWellness();

  // Multi-step Flow: 'select_pet' | 'activity_duration' | 'completed'
  const [step, setStep] = useState('select_pet');
  const [selectedPetId, setSelectedPetId] = useState(petProfiles[0]?.id || '');
  
  // Activity Selection & Input
  const [activityType, setActivityType] = useState('');
  const [customActivity, setCustomActivity] = useState('');
  const [isManualInput, setIsManualInput] = useState(false);
  
  // Duration & Notes
  const [durationMin, setDurationMin] = useState(20);
  const [customDurationInput, setCustomDurationInput] = useState('20');
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [notes, setNotes] = useState('');

  // Submodals
  const [isManageProfilesOpen, setIsManageProfilesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  if (!isOpen) return null;

  const currentPet = petProfiles.find(p => p.id === selectedPetId) || petProfiles[0] || null;
  const petSpecies = currentPet?.type || 'Dog';
  const suggestions = SPECIES_ACTIVITY_SUGGESTIONS[petSpecies] || SPECIES_ACTIVITY_SUGGESTIONS['Other'];

  const activeDuration = isCustomDuration ? (parseInt(customDurationInput, 10) || 15) : durationMin;
  const effectiveActivityName = isManualInput ? customActivity : (activityType || suggestions[0]?.name || 'Active Play');

  // Dynamic Calorie Range Estimation
  const matchedSuggestion = suggestions.find(s => s.name === effectiveActivityName);
  const baseRate = matchedSuggestion ? matchedSuggestion.calPerMin : 4.2;
  const estLow = Math.round(activeDuration * (baseRate * 0.85));
  const estHigh = Math.round(activeDuration * (baseRate * 1.15));

  const handleSelectPet = (petId) => {
    setSelectedPetId(petId);
    const pet = petProfiles.find(p => p.id === petId);
    const defaultSugg = SPECIES_ACTIVITY_SUGGESTIONS[pet?.type || 'Dog']?.[0]?.name || 'Gentle Play';
    setActivityType(defaultSugg);
    setIsManualInput(false);
    setCustomActivity('');
    setStep('activity_duration');
  };

  const handleSavePlay = (e) => {
    e.preventDefault();
    if (!currentPet) return;

    const finalActivity = isManualInput ? (customActivity.trim() || 'Active Playtime') : (activityType || 'Active Playtime');
    const finalDuration = Math.max(1, activeDuration);

    logPetPlayActivity({
      petId: currentPet.id,
      activityType: finalActivity,
      durationMin: finalDuration,
      notes: notes.trim()
    });

    try {
      confetti({ particleCount: 45, spread: 65, origin: { y: 0.6 } });
    } catch {}

    setStep('completed');
  };

  const resetFlow = () => {
    setStep('select_pet');
    setCustomActivity('');
    setIsManualInput(false);
    setNotes('');
    setDurationMin(20);
    setIsCustomDuration(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-sheet"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 540,
          background: 'var(--bg-glass-card)',
          backdropFilter: 'blur(20px)',
          border: '1.5px solid var(--accent-primary)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.4rem',
          position: 'relative'
        }}
      >
        {/* Top Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
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
                fontSize: '1.25rem',
                boxShadow: '0 4px 12px rgba(46, 125, 90, 0.25)'
              }}
            >
              🐾
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                🐾 Pet Play & Movement
              </h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: '0.1rem 0 0 0' }}>
                You were spending time with someone you love — and you moved together too.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.74rem', gap: '0.25rem', padding: '0.3rem 0.6rem' }}
              title="Review history"
            >
              <BookOpen size={12} /> History
            </button>

            <button
              type="button"
              onClick={() => setIsManageProfilesOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.74rem', gap: '0.25rem', padding: '0.3rem 0.6rem' }}
              title="Manage pet profiles"
            >
              <Settings size={12} /> Pets
            </button>

            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginLeft: '0.2rem' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: SELECT COMPANION PET                                              */}
        {/* ========================================================================= */}
        {step === 'select_pet' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', animation: 'fadeIn 0.2s ease-out' }}>
            <div>
              <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)', display: 'block', marginBottom: '0.3rem' }}>
                Who were you moving with today? 🐶🐱
              </strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                Select a pet companion or create a new profile.
              </p>
            </div>

            {/* Pet Profiles Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.65rem' }}>
              {petProfiles.map(pet => (
                <div
                  key={pet.id}
                  onClick={() => handleSelectPet(pet.id)}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1.5px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1rem 0.85rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.1rem' }}>
                    {pet.avatar || '🐾'}
                  </div>
                  <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                    {pet.name}
                  </strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {pet.type}
                  </span>
                </div>
              ))}

              {/* Add New Pet Button */}
              <div
                onClick={() => setIsManageProfilesOpen(true)}
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1.5px dashed var(--accent-primary)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem 0.85rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  color: 'var(--accent-primary)'
                }}
              >
                <Plus size={22} />
                <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Add New Pet</span>
              </div>
            </div>

            {/* Quick Weekly Activity Insight Badge */}
            {(() => {
              const stats = getPetPlayStats ? getPetPlayStats() : { totalMinsThisWeek: 0 };
              return (
                <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    🐾 Total Active Time with Pets This Week:
                  </span>
                  <span style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>
                    {stats.totalMinsThisWeek} mins
                  </span>
                </div>
              );
            })()}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: LOG ACTIVITY & DURATION                                           */}
        {/* ========================================================================= */}
        {step === 'activity_duration' && currentPet && (
          <form onSubmit={handleSavePlay} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', animation: 'fadeIn 0.2s ease-out' }}>
            
            {/* Selected Pet Banner with Back button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--accent-primary-light)', padding: '0.65rem 0.95rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.4rem' }}>{currentPet.avatar || '🐾'}</span>
                <div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--accent-primary)' }}>
                    Moving with {currentPet.name} ({currentPet.type})
                  </strong>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    Tailored suggestions for {currentPet.type}s
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep('select_pet')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', gap: '0.25rem', padding: '0.25rem 0.55rem' }}
              >
                <ChevronLeft size={12} /> Switch Pet
              </button>
            </div>

            {/* 1. Suggested Activities & Manual Entry */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ✨ What did you do together?
                </label>
                <button
                  type="button"
                  onClick={() => setIsManualInput(!isManualInput)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isManualInput ? '✨ Show Suggestions' : '✍️ Add Manually'}
                </button>
              </div>

              {!isManualInput ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {suggestions.map(s => {
                    const isSelected = activityType === s.name;
                    return (
                      <button
                        key={s.name}
                        type="button"
                        onClick={() => {
                          setActivityType(s.name);
                          setIsManualInput(false);
                        }}
                        style={{
                          padding: '0.45rem 0.8rem',
                          borderRadius: 'var(--radius-pill)',
                          border: isSelected ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                          background: isSelected ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                          color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
                          fontSize: '0.8rem',
                          fontWeight: isSelected ? 800 : 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span>{s.icon}</span>
                        <span>{s.name}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    required
                    placeholder={`e.g. Backyard zoomies with ${currentPet.name}, hallway fetch, obstacle fun...`}
                    value={customActivity}
                    onChange={e => setCustomActivity(e.target.value)}
                    className="input-field"
                    style={{ fontSize: '0.85rem' }}
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* 2. Duration Selector */}
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.45rem' }}>
                <Clock size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                How long did you play? ({activeDuration} mins)
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.35rem' }}>
                {DURATION_PRESETS.map(d => {
                  const isSelected = !isCustomDuration && durationMin === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setIsCustomDuration(false);
                        setDurationMin(d);
                      }}
                      style={{
                        padding: '0.45rem 0.2rem',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        background: isSelected ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                        color: isSelected ? '#ffffff' : 'var(--text-primary)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {d}m
                    </button>
                  );
                })}

                {/* Custom Duration Toggle */}
                <button
                  type="button"
                  onClick={() => setIsCustomDuration(true)}
                  style={{
                    padding: '0.45rem 0.2rem',
                    borderRadius: 'var(--radius-md)',
                    border: isCustomDuration ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    background: isCustomDuration ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                    color: isCustomDuration ? '#ffffff' : 'var(--text-primary)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  ⏱️
                </button>
              </div>

              {isCustomDuration && (
                <div style={{ marginTop: '0.55rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-tertiary)', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Minutes:</span>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={customDurationInput}
                    onChange={e => setCustomDurationInput(e.target.value)}
                    style={{
                      width: 60,
                      padding: '0.25rem 0.4rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid var(--accent-primary)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      textAlign: 'center'
                    }}
                  />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>minutes</span>
                </div>
              )}
            </div>

            {/* 3. Estimated Movement Calories (Clearly marked as optional estimate) */}
            <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 0.95rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Flame size={15} color="var(--accent-primary)" />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Estimated movement calories:
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Approximate energy expenditure based on active playtime
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--accent-primary)' }}>
                ~{estLow}–{estHigh} kcal
              </div>
            </div>

            {/* Submit & Cancel */}
            <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.35rem' }}>
              <button
                type="button"
                onClick={() => setStep('select_pet')}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '0.75rem' }}
              >
                Back
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 2, padding: '0.75rem', fontWeight: 800, gap: '0.4rem' }}
              >
                <CheckCircle size={15} /> Save Pet Playtime 🐾
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: COMPLETION CELEBRATION                                            */}
        {/* ========================================================================= */}
        {step === 'completed' && currentPet && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem 0', textAlign: 'center', animation: 'fadeIn 0.2s ease-out' }}>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                boxShadow: '0 8px 24px rgba(46, 125, 90, 0.3)'
              }}
            >
              {currentPet.avatar || '🐾'}
            </div>

            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>
                Joyful Playtime Recorded! 🐾
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                You spent {activeDuration} active minutes together with {currentPet.name}.
              </p>
            </div>

            <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', width: '100%', maxWidth: 340 }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Everyday Natural Movement
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '0.15rem' }}>
                +{activeDuration} mins of companionship & movement 🌱
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Estimated movement calories: ~{estLow}–{estHigh} kcal
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', width: '100%', maxWidth: 340, marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={resetFlow}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '0.7rem', fontSize: '0.84rem' }}
              >
                Log Another
              </button>

              <button
                type="button"
                onClick={onClose}
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.7rem', fontSize: '0.84rem' }}
              >
                Done ✨
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Pet Profiles Manager Modal */}
      {isManageProfilesOpen && (
        <PetProfileModal
          isOpen={isManageProfilesOpen}
          onClose={() => setIsManageProfilesOpen(false)}
        />
      )}

      {/* Pet Play History Modal */}
      {isHistoryOpen && (
        <PetPlayHistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}
    </div>
  );
}
