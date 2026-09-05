import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { lookupCraving, EXPANDED_CRAVINGS } from '../../engine/bodyTranslator';
import { Search, Sparkles, Heart, CheckCircle, HelpCircle, ArrowRight, Eye, EyeOff, Utensils } from 'lucide-react';
import confetti from 'canvas-confetti';
import ContextualPip from '../mascot/ContextualPip';

export default function BodyTranslator() {
  const { cravingsLogs, logCraving } = useWellness();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCraving, setSelectedCraving] = useState(null);
  const [satisfiedItem, setSatisfiedItem] = useState('');
  const [feelingAfter, setFeelingAfter] = useState('Satisfied & Content');
  const [showLogForm, setShowLogForm] = useState(false);
  const [showRecentCravings, setShowRecentCravings] = useState(false);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    const result = lookupCraving(searchQuery);
    if (result) {
      setSelectedCraving(result);
    }
  };

  const selectQuickChip = (item) => {
    setSelectedCraving(item);
    setSearchQuery(item.name);
  };

  const handleSaveReflection = (e) => {
    e.preventDefault();
    if (!selectedCraving) return;

    logCraving({
      cravingName: selectedCraving.name,
      satisfiedWith: satisfiedItem || selectedCraving.healthyOptions?.[0]?.name || 'Mindful portion',
      feelingAfter
    });
    setSatisfiedItem('');
    setShowLogForm(false);
    try {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.7 }
      });
    } catch(err) {}
  };

  return (
    <div>
      {/* Intro Header */}
      <div className="card-glass" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, var(--bg-glass-card) 0%, rgba(217, 119, 54, 0.08) 100%)' }}>
        <span className="pill-badge orange" style={{ marginBottom: '0.4rem' }}>
          <Sparkles size={12} /> Cravings & Food Explorer
        </span>
        <h3 style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>The Body Translator 🧭</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0', lineHeight: 1.45 }}>
          Cravings are not mistakes or failures of willpower—they are gentle sensory cues about texture, comfort, flavor satisfaction, or daily rhythm.
        </p>

        {/* Contextual Nourish Pip */}
        <ContextualPip context="nourish" layout="subtle" size={32} style={{ marginBottom: '1rem' }} />

        {/* Primary Direct Craving Input */}
        <div>
          <label style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: '0.45rem' }}>
            What are you craving or feeling like eating? 🧭
          </label>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: 13, color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder='Type a craving or texture (e.g. "Chocolate", "Something salty & crunchy", "Ice cream", "Warm bread")...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '2.4rem', fontSize: '0.86rem' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem', fontWeight: 700 }}>
              Explore Craving
            </button>
          </form>

          {/* Quick Flavor & Texture Explorer Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {EXPANDED_CRAVINGS.slice(0, 6).map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectQuickChip(item)}
                style={{
                  background: selectedCraving?.id === item.id ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                  color: selectedCraving?.id === item.id ? '#fff' : 'var(--text-secondary)',
                  border: '1px solid var(--border-glass)',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{item.icon}</span>
                <span>{item.name.split('/')[0].trim()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Craving Deep Dive */}
      {selectedCraving ? (
        <div className="card-glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '2rem' }}>{selectedCraving.icon}</span>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Exploring: {selectedCraving.name}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                  Sensory & Flavor Context (Non-Diagnostic & Educational)
                </p>
              </div>
            </div>

            <button
              onClick={() => { setSelectedCraving(null); setSearchQuery(''); }}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
            >
              Clear Selection
            </button>
          </div>

          {/* What might I be looking for? */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <HelpCircle size={15} color="var(--accent-primary)" /> What Might I Be Looking For?
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              {selectedCraving.bodySignals?.map((sig, idx) => (
                <div key={idx} style={{ background: 'var(--bg-tertiary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    {sig.type}
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                    {sig.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sensory-Satisfying Alternatives */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 800, marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Heart size={16} color="var(--accent-rose)" /> Sensory-Satisfying Alternatives & Mindful Ideas
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {selectedCraving.healthyOptions?.map((opt, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-glass)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem'
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                    ✨ {opt.name}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {opt.tip}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Log Reflection Form */}
          {!showLogForm ? (
            <button 
              onClick={() => setShowLogForm(true)}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '0.75rem', fontWeight: 700 }}
            >
              📝 Record How You Mindfully Enjoyed This
            </button>
          ) : (
            <form onSubmit={handleSaveReflection} style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>Mindful Reflection</h4>
              
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                  What did you choose to enjoy?
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2 squares of 85% dark chocolate with mint tea"
                  value={satisfiedItem}
                  onChange={e => setSatisfiedItem(e.target.value)}
                  className="input-field"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                  How did you feel afterwards?
                </label>
                <select
                  value={feelingAfter}
                  onChange={e => setFeelingAfter(e.target.value)}
                  className="select-field"
                >
                  <option value="Satisfied & Content">Satisfied & Content</option>
                  <option value="Energized & Grounded">Energized & Grounded</option>
                  <option value="Comforted & Relaxed">Comforted & Relaxed</option>
                  <option value="Mindfully Noticed (Learning for next time)">Mindfully Noticed (Learning for next time)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Save Reflection
                </button>
                <button type="button" onClick={() => setShowLogForm(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="card-glass" style={{ padding: '1.25rem', textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          <p style={{ margin: 0, fontSize: '0.88rem' }}>
            🔍 Type a food craving or tap a flavor profile above to explore satisfying textures and gentle mindful ideas.
          </p>
        </div>
      )}

      {/* Craving History & Reflections */}
      {cravingsLogs.length > 0 && (
        <div className="card-glass" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: 0 }}>Craving Reflections</h4>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Your saved mindful reflections and sensory explorations.
              </span>
            </div>

            <button
              onClick={() => setShowRecentCravings(prev => !prev)}
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.35rem', fontSize: '0.78rem' }}
            >
              {showRecentCravings ? <EyeOff size={13} /> : <Eye size={13} />}
              <span>{showRecentCravings ? 'Hide Craving Reflections' : 'View Craving Reflections'}</span>
            </button>
          </div>

          {showRecentCravings && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem', animation: 'fadeIn 0.2s ease-out' }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                {cravingsLogs.length} saved mindful {cravingsLogs.length === 1 ? 'reflection' : 'reflections'}
              </div>
              {cravingsLogs.map(log => (
                <div 
                  key={log.id}
                  style={{
                    background: 'var(--bg-tertiary)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.83rem'
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{log.cravingName}: </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{log.satisfiedWith}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="pill-badge primary" style={{ fontSize: '0.7rem' }}>{log.feelingAfter}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

