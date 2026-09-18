import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { X, Check, Sparkles, MapPin, Calendar, Clock, Plus, Trash2, ChevronDown, ChevronUp, History } from 'lucide-react';
import confetti from 'canvas-confetti';

const POPULAR_ACTIVITIES = [
  { id: 'skiing', name: 'Skiing', icon: '⛷️' },
  { id: 'snowboarding', name: 'Snowboarding', icon: '🏂' },
  { id: 'rollerblading', name: 'Rollerblading', icon: '🛼' },
  { id: 'skateboarding', name: 'Skateboarding', icon: '🛹' },
  { id: 'swimming', name: 'Swimming', icon: '🏊' },
  { id: 'hiking', name: 'Hiking', icon: '🥾' },
  { id: 'kayaking', name: 'Kayaking', icon: '🚣' },
  { id: 'climbing', name: 'Climbing / Bouldering', icon: '🧗' },
  { id: 'dancing', name: 'Dancing', icon: '💃' },
  { id: 'bowling', name: 'Bowling', icon: '🎳' },
  { id: 'badminton', name: 'Badminton / Tennis', icon: '🏸' },
  { id: 'social_sports', name: 'Social Sports / Frisbee', icon: '⚽' },
  { id: 'cycling', name: 'Casual Cycling', icon: '🚴' }
];

export default function SocialActivityModal({ isOpen, onClose }) {
  const { logSocialActivity, setActiveWorkoutMinutes, socialActivities = [], deleteSocialActivity } = useWellness();

  const [selectedPreset, setSelectedPreset] = useState('hiking');
  const [isCustom, setIsCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customIcon, setCustomIcon] = useState('🌟');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [activityDate, setActivityDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [savedMessage, setSavedMessage] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false); // Hidden by default

  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset.id);
    setIsCustom(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const activeObj = isCustom
      ? { name: customName.trim() || 'Active Session', icon: customIcon || '🌟' }
      : POPULAR_ACTIVITIES.find(a => a.id === selectedPreset) || { name: 'Recreational Activity', icon: '🏃' };

    const newActivity = {
      id: 'act_' + Date.now(),
      name: activeObj.name,
      icon: activeObj.icon,
      durationMinutes: Number(durationMinutes) || 30,
      date: activityDate,
      location: location.trim(),
      notes: notes.trim(),
      timestamp: Date.now()
    };

    if (logSocialActivity) {
      logSocialActivity(newActivity);
    } else if (setActiveWorkoutMinutes) {
      setActiveWorkoutMinutes(prev => prev + (Number(durationMinutes) || 30));
    }

    setSavedMessage(`Logged "${activeObj.icon} ${activeObj.name}"! Wonderful movement 🌱`);

    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 }
      });
    } catch(err) {}

    setTimeout(() => {
      setSavedMessage('');
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-sheet card-glass" 
        onClick={e => e.stopPropagation()} 
        style={{ 
          maxWidth: 540, 
          maxHeight: '90vh', 
          overflowY: 'auto',
          borderRadius: 'var(--radius-xl)',
          padding: '1.6rem',
          border: '1.5px solid var(--accent-primary)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          animation: 'scaleUp 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span className="pill-badge primary" style={{ fontSize: '0.72rem', padding: '2px 8px', fontWeight: 800 }}>
              <Sparkles size={12} /> Recreational & Social Movement
            </span>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'var(--bg-tertiary)', 
              border: 'none', 
              borderRadius: '50%', 
              width: 30, 
              height: 30, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer', 
              color: 'var(--text-muted)' 
            }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>
          Social Activity ⛷️
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 1.25rem 0', lineHeight: 1.45 }}>
          Record fun, social, seasonal, or recreational activities that don't fit into traditional workouts. No calories, intensity scores, or competitive metrics.
        </p>

        {/* 1. Add Social Activity Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {/* Activity Presets Grid */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
              Choose an Activity:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))', gap: '0.4rem', maxHeight: '170px', overflowY: 'auto', padding: '2px' }}>
              {POPULAR_ACTIVITIES.map(preset => {
                const active = !isCustom && selectedPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    style={{
                      padding: '0.45rem 0.4rem',
                      borderRadius: 'var(--radius-md)',
                      border: active ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      background: active ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                      color: active ? 'var(--accent-primary)' : 'var(--text-primary)',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      fontWeight: active ? 800 : 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>{preset.icon}</span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{preset.name}</span>
                  </button>
                );
              })}

              {/* Custom Activity Button */}
              <button
                type="button"
                onClick={() => setIsCustom(true)}
                style={{
                  padding: '0.45rem 0.4rem',
                  borderRadius: 'var(--radius-md)',
                  border: isCustom ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  background: isCustom ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                  color: isCustom ? 'var(--accent-primary)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: isCustom ? 800 : 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  textAlign: 'left'
                }}
              >
                <span>➕</span>
                <span>Custom</span>
              </button>
            </div>
          </div>

          {/* Custom Activity Name Input (when Custom is selected) */}
          {isCustom && (
            <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', animation: 'fadeIn 0.2s ease-out' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Emoji</label>
                  <input
                    type="text"
                    value={customIcon}
                    onChange={e => setCustomIcon(e.target.value)}
                    className="input-field"
                    style={{ textAlign: 'center', fontSize: '1.2rem', padding: '0.35rem' }}
                    placeholder="🌟"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Activity Name *</label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    className="input-field"
                    style={{ fontSize: '0.82rem' }}
                    placeholder="e.g. Backyard Frisbee, Trampoline Park"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Duration & Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.3rem' }}>
                <Clock size={13} /> Duration (mins)
              </label>
              <input
                type="number"
                min="5"
                max="600"
                step="5"
                value={durationMinutes}
                onChange={e => setDurationMinutes(e.target.value)}
                className="input-field"
                style={{ fontSize: '0.84rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.3rem' }}>
                <Calendar size={13} /> Date
              </label>
              <input
                type="date"
                value={activityDate}
                onChange={e => setActivityDate(e.target.value)}
                className="input-field"
                style={{ fontSize: '0.84rem' }}
              />
            </div>
          </div>

          {/* Optional Location & Notes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.65rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
                <MapPin size={12} /> Location / Context (Optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Pine Valley Trail, With friends"
                className="input-field"
                style={{ fontSize: '0.82rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                Notes / Context (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Sunny day, felt refreshed and energized"
                className="input-field"
                style={{ fontSize: '0.82rem' }}
              />
            </div>
          </div>

          {savedMessage && (
            <div style={{ padding: '0.65rem', background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', fontWeight: 800, fontSize: '0.84rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', animation: 'fadeIn 0.2s ease-out' }}>
              ✓ {savedMessage}
            </div>
          )}

          {/* Submit Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1, padding: '0.75rem', fontWeight: 800, gap: '0.35rem' }}
            >
              <Check size={16} /> Save Activity
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* 2. Collapsible Show / Hide History (Hidden by Default) */}
        <div style={{ marginTop: '1.4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <button
            type="button"
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: isHistoryOpen ? 'var(--bg-tertiary)' : 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 0.95rem',
              color: 'var(--text-primary)',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <History size={15} color="var(--accent-primary)" />
              <span>
                {isHistoryOpen ? 'Hide History' : `Show History (${socialActivities.length})`}
              </span>
            </div>
            {isHistoryOpen ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
          </button>

          {isHistoryOpen && (
            <div style={{ marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', animation: 'fadeIn 0.2s ease-out' }}>
              {socialActivities.length === 0 ? (
                <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  No previous social activities logged yet.
                </div>
              ) : (
                socialActivities.map(act => (
                  <div
                    key={act.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.7rem 0.9rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      gap: '0.6rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ fontSize: '1.3rem' }}>{act.icon || '🏃'}</span>
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {act.name || act.activityName}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.15rem' }}>
                          <span>⏱️ {act.durationMinutes} mins</span>
                          {act.date && <span>📅 {act.date}</span>}
                          {act.location && <span>📍 {act.location}</span>}
                          {act.notes && <span>💬 {act.notes}</span>}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteSocialActivity && deleteSocialActivity(act.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '0.35rem',
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '4px',
                        transition: 'color 0.15s ease'
                      }}
                      title="Delete activity record"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

