import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { lookupCraving } from '../../engine/bodyTranslator';
import { CRAVINGS_DATABASE } from '../../data/mockData';
import { Search, Sparkles, Heart, CheckCircle, HelpCircle, ArrowRight, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BodyTranslator() {
  const { cravingsLogs, logCraving } = useWellness();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCraving, setSelectedCraving] = useState(null); // Starts with manual input (no auto-suggestions / pre-selection)
  const [satisfiedItem, setSatisfiedItem] = useState('');
  const [feelingAfter, setFeelingAfter] = useState('Satisfied & Content');
  const [showLogForm, setShowLogForm] = useState(false);
  const [showRecentCravings, setShowRecentCravings] = useState(false); // Hidden by default

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const result = lookupCraving(searchQuery);
    if (result) {
      setSelectedCraving(result);
    } else {
      // Fallback custom craving representation
      setSelectedCraving({
        id: 'custom_' + Date.now(),
        name: searchQuery,
        icon: '💡',
        bodySignals: [
          { type: 'Physiological', desc: 'Could signal need for steady energy, hydration, or mineral balance.' },
          { type: 'Mindset & Rhythm', desc: 'Check if you have had a long stretch without a pause or mindful break.' }
        ],
        healthyOptions: [
          { name: 'Pair with water or tea', tip: 'Drink a glass of water first to check if dehydration is masking as hunger.' },
          { name: 'Enjoy mindfully', tip: 'Savor a moderate portion without distraction or guilt.' }
        ]
      });
    }
  };

  const selectChip = (item) => {
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
          <Sparkles size={12} /> Mindful Body Signals
        </span>
        <h3 style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>The Body Translator 🧭</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
          Cravings are not failures of willpower—they are gentle communication from your body about hunger, stress, fatigue, or dietary rhythm.
        </p>

        {/* Primary Direct Input Form */}
        <div style={{ marginTop: '1rem' }}>
          <label style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: '0.45rem' }}>
            What is your body telling you? 🧭
          </label>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: 13, color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder='Type what you are experiencing in your own words (e.g. "I feel bloated", "I have a headache", "Unusually hungry", "Craving something sweet")...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '2.4rem', fontSize: '0.86rem' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem', fontWeight: 700 }}>
              Decode Signal
            </button>
          </form>
        </div>
      </div>

      {/* Selected Craving Deep Dive (Shown only when user enters or taps a craving) */}
      {selectedCraving ? (
        <div className="card-glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '2rem' }}>{selectedCraving.icon}</span>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Decoding: {selectedCraving.name}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                  Possible Physiological, Emotional & Dietary Drivers
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

          {/* Body Signals List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
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

          {/* Healthy & Realistic Food Swaps */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Heart size={16} color="var(--accent-rose)" /> Nourishing Ways to Honor This Craving
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

          {/* Log Reflection Button / Form */}
          {!showLogForm ? (
            <button 
              onClick={() => setShowLogForm(true)}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '0.75rem' }}
            >
              📝 Record How You Handled This Craving
            </button>
          ) : (
            <form onSubmit={handleSaveReflection} style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>Post-Craving Reflection</h4>
              
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                  What did you enjoy?
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
                  <option value="Slightly Sluggish (Learning for next time)">Slightly Sluggish (Learning for next time)</option>
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
        /* Helpful empty state prompt */
        <div className="card-glass" style={{ padding: '1.25rem', textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          <p style={{ margin: 0, fontSize: '0.88rem' }}>
            🔍 Type what you are experiencing in the box above to decode your body's signals with zero judgment.
          </p>
        </div>
      )}

      {/* Craving History & Reflections: Progressive Disclosure */}
      {cravingsLogs.length > 0 && (
        <div className="card-glass" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: 0 }}>Craving Reflections</h4>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Your saved mindful reflections and decoded signals.
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

