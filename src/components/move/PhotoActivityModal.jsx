import React, { useState } from 'react';
import { Camera, Upload, Sparkles, Check, X, Edit3, Plus, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

const PHOTO_AI_PRESETS = [
  {
    name: 'Dumbbell Incline Chest Press',
    category: 'Strength Training',
    durationMin: 15,
    difficulty: 'Moderate',
    description: 'Upper chest and tricep strengthening with controlled descent.'
  },
  {
    name: 'Cable Lat Pulldown & Posture Row',
    category: 'Strength Training',
    durationMin: 12,
    difficulty: 'Gentle',
    description: 'Upper back and posture stabilization to counter desk sitting.'
  },
  {
    name: 'Treadmill Incline Paced Walk',
    category: 'Walking',
    durationMin: 20,
    difficulty: 'Gentle',
    description: 'Low-impact cardiovascular conditioning at 6% incline.'
  }
];

export default function PhotoActivityModal({ isOpen, onClose, onSaveActivity }) {
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [identifiedActivity, setIdentifiedActivity] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form edit fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Strength Training');
  const [durationMin, setDurationMin] = useState(15);
  const [difficulty, setDifficulty] = useState('Gentle');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSimulatePhoto = (presetIndex = 0) => {
    setIsAnalyzing(true);
    setPhotoPreview('gym_equipment_preview.jpg');

    setTimeout(() => {
      const recognized = PHOTO_AI_PRESETS[presetIndex % PHOTO_AI_PRESETS.length];
      setIdentifiedActivity(recognized);
      setName(recognized.name);
      setCategory(recognized.category);
      setDurationMin(recognized.durationMin);
      setDifficulty(recognized.difficulty);
      setDescription(recognized.description);
      setIsAnalyzing(false);

      try {
        confetti({ particleCount: 20, spread: 35, origin: { y: 0.6 } });
      } catch (e) {}
    }, 1200);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newActivity = {
      id: 'photo_act_' + Date.now(),
      title: name,
      category,
      durationMin: Number(durationMin),
      difficulty,
      description,
      isCustom: true,
      steps: [
        { id: 1, title: 'Warmup & Setup', durationSec: 60, guidance: 'Align body and adjust safety catches.' },
        { id: 2, title: 'Working Sets', durationSec: Number(durationMin) * 50, guidance: 'Perform with controlled pacing.' },
        { id: 3, title: 'Cool Down & Stretch', durationSec: 60, guidance: 'Decompress joints and hydrate.' }
      ]
    };

    if (onSaveActivity) {
      onSaveActivity(newActivity);
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-sheet" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="pill-badge primary" style={{ fontSize: '0.7rem' }}>
                <Camera size={12} /> AI Activity Scanner
              </span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0.2rem 0 0 0' }}>
              Add Activity from Picture 📸
            </h3>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {!identifiedActivity && !isAnalyzing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Snap or upload a photo of gym machines, dumbbells, yoga setups, or outdoor paths. Better Every Day will identify the movement for your library.
            </p>

            <div 
              style={{
                border: '2px dashed var(--accent-primary)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                background: 'var(--bg-secondary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.85rem'
              }}
            >
              <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Camera size={26} />
              </div>

              <div>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block' }}>
                  Upload Equipment or Exercise Picture
                </strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Supports PNG, JPG, or device camera
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                <button 
                  onClick={() => handleSimulatePhoto(0)}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '0.35rem' }}
                >
                  <Camera size={14} /> Scan Machine (Dumbbell)
                </button>
                <button 
                  onClick={() => handleSimulatePhoto(1)}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.35rem' }}
                >
                  <Upload size={14} /> Scan Cable Pulldown
                </button>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              🔒 Photos are analyzed privately on-device and never shared publicly.
            </div>
          </div>
        ) : isAnalyzing ? (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Sparkles size={36} color="var(--accent-primary)" style={{ animation: 'spin 2s linear infinite' }} />
            <div>
              <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.25rem 0' }}>Analyzing Equipment & Exercise Setup...</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Identifying optimal movement mechanics and safety cues</p>
            </div>
          </div>
        ) : (
          /* IDENTIFIED ACTIVITY REVIEW & EDIT */
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--accent-primary-light)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={16} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                  Movement Detected! Review & customize:
                </span>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                Exercise / Activity Title *
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                  Category
                </label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="select-field">
                  <option value="Strength Training">Strength Training</option>
                  <option value="Walking">Walking / Cardio</option>
                  <option value="Mobility & Stretching">Mobility & Stretching</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Pilates">Pilates</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                  Target Duration (mins)
                </label>
                <input
                  type="number"
                  min="2"
                  max="120"
                  value={durationMin}
                  onChange={e => setDurationMin(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                Form Guidance & Description
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="input-field"
                rows={2}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                Save to Movement Library
              </button>
              <button 
                type="button" 
                onClick={() => setIdentifiedActivity(null)}
                className="btn btn-secondary"
              >
                Scan Another
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
