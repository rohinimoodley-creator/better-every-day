import React, { useState } from 'react';
import { X, Plus, Trash2, Calendar, Sparkles } from 'lucide-react';
import { useWellness } from '../../context/WellnessContext';

export default function CustomWorkoutModal({ isOpen, onClose, onSave }) {
  const { createSocialEvent, connectedProfiles, petProfiles = [], logPetPlayActivity } = useWellness();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Mobility');
  const [durationMin, setDurationMin] = useState(15);
  const [intensity, setIntensity] = useState('Gentle');
  const [exercises, setExercises] = useState([
    { name: 'Warm-up Joint Circles', durationSec: 60, tip: 'Breathe slowly and move with control.' },
    { name: 'Bodyweight Squats', durationSec: 120, tip: 'Drive through your heels.' }
  ]);
  const [invitePartner, setInvitePartner] = useState(false);
  const [partnerId, setPartnerId] = useState(connectedProfiles[1]?.id || '');
  const [selectedPetId, setSelectedPetId] = useState('');

  if (!isOpen) return null;

  const addExercise = () => {
    setExercises(prev => [...prev, { name: 'New Exercise', durationSec: 60, tip: 'Keep form steady.' }]);
  };

  const updateExercise = (index, field, value) => {
    setExercises(prev => prev.map((ex, i) => i === index ? { ...ex, [field]: value } : ex));
  };

  const removeExercise = (index) => {
    setExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newWorkoutId = 'custom_w_' + Date.now();
    const newWorkout = {
      id: newWorkoutId,
      title,
      category,
      durationMin: Number(durationMin),
      intensity,
      equipment: 'Bodyweight',
      caloriesEst: Math.round(Number(durationMin) * 7.5),
      energyLevelNeeded: intensity === 'Energizing' ? 4 : 2,
      description: 'Your personalized custom routine.',
      steps: exercises
    };

    if (invitePartner && partnerId) {
      const partner = connectedProfiles.find(p => p.id === partnerId);
      createSocialEvent({
        title: `Workout Together: ${title}`,
        date: new Date().toISOString().split('T')[0],
        time: '18:00',
        location: 'Living Room / Gym',
        withUser: partner ? `${partner.name} (${partner.relation})` : 'Partner',
        category: 'Move',
        notes: `Let's crush this ${durationMin}-min ${title} session!`
      });
    }

    if (selectedPetId && logPetPlayActivity) {
      logPetPlayActivity({
        petId: selectedPetId,
        activityType: category || 'Exercise & Play',
        durationMin: Number(durationMin),
        notes: `Linked with routine: ${title}`,
        linkedWorkoutId: newWorkoutId
      });
    }

    onSave(newWorkout);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem' }}>Create Custom Workout 🏋️</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tailor exercises to your available time and energy.</p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
              Routine Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 15-Min Evening Core & Reset"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="input-field"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                Category
              </label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)}
                className="select-field"
              >
                <option value="Mobility & Stretching">Mobility & Stretching</option>
                <option value="Strength Training">Strength Training</option>
                <option value="Yoga">Yoga</option>
                <option value="Pilates">Pilates</option>
                <option value="Cardio & Walking">Cardio & Walking</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                Duration (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="90"
                value={durationMin}
                onChange={e => setDurationMin(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Exercises List */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Exercises in Routine
              </label>
              <button 
                type="button" 
                onClick={addExercise}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', gap: '0.2rem' }}
              >
                <Plus size={13} /> Add Exercise
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 220, overflowY: 'auto', paddingRight: '0.25rem' }}>
              {exercises.map((ex, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-tertiary)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', width: 18 }}>{idx + 1}.</span>
                  <input
                    type="text"
                    value={ex.name}
                    onChange={e => updateExercise(idx, 'name', e.target.value)}
                    placeholder="Exercise name"
                    className="input-field"
                    style={{ flex: 2, padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                  />
                  <input
                    type="number"
                    value={ex.durationSec}
                    onChange={e => updateExercise(idx, 'durationSec', Number(e.target.value))}
                    placeholder="Sec"
                    className="input-field"
                    style={{ width: 70, padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>sec</span>
                  {exercises.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeExercise(idx)} 
                      style={{ background: 'transparent', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pet Companion Tagging */}
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
              🐾 Moving with a Pet Companion? (Optional)
            </label>
            <select
              value={selectedPetId}
              onChange={e => setSelectedPetId(e.target.value)}
              className="select-field"
              style={{ fontSize: '0.85rem' }}
            >
              <option value="">Just me (No pet tagged)</option>
              {petProfiles.map(pet => (
                <option key={pet.id} value={pet.id}>
                  {pet.avatar || '🐾'} {pet.name} ({pet.type})
                </option>
              ))}
            </select>
            {selectedPetId && (
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '0.4rem 0 0 0' }}>
                ✨ This will log time spent together under Pet Play without duplicating your workout minutes.
              </p>
            )}
          </div>

          {/* Invite Partner Checkbox */}
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={invitePartner}
                onChange={e => setInvitePartner(e.target.checked)}
                style={{ accentColor: 'var(--accent-primary)', width: 16, height: 16 }}
              />
              <Calendar size={15} color="var(--accent-primary)" /> Invite Partner or Friend to this workout
            </label>
            {invitePartner && (
              <div style={{ marginTop: '0.6rem' }}>
                <select 
                  value={partnerId} 
                  onChange={e => setPartnerId(e.target.value)}
                  className="select-field"
                  style={{ fontSize: '0.85rem' }}
                >
                  {connectedProfiles.filter(p => p.relation !== 'self').map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.relation})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
            <Sparkles size={16} /> Save & Schedule Routine
          </button>
        </form>
      </div>
    </div>
  );
}
