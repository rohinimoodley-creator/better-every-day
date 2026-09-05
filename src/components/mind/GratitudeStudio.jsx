import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { Heart, Plus, Trash2, Sparkles, Check, Bookmark, Calendar, ArrowRight, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const GRATITUDE_PROMPTS = [
  "A small sensory comfort that felt cozy today (warm coffee, clean sheets, cool breeze)",
  "Someone who listened, smiled, or offered a gentle word",
  "A challenge you navigated with patience or gentle breathing",
  "A tiny moment of personal progress you made today",
  "A part of your body that carried and supported you through today"
];

export default function GratitudeStudio() {
  const { discoveredGratitude, approveDiscoveredGratitude, rejectDiscoveredGratitude } = useWellness();

  const [activeSubTab, setActiveSubTab] = useState('my_gratitude'); // 'my_gratitude' | 'discovery'
  const [fields, setFields] = useState([
    { id: 1, text: '' },
    { id: 2, text: '' },
    { id: 3, text: '' }
  ]);

  const [savedEntries, setSavedEntries] = useState([
    {
      id: 'g_1',
      date: 'Today, 09:15 AM',
      items: [
        'Warm morning tea in the quiet sunlight before starting work.',
        'A kind text from Maya checking in on my energy.',
        'Taking a deep belly breath when feeling rushed.'
      ]
    },
    {
      id: 'g_2',
      date: 'Yesterday, 08:40 PM',
      items: [
        'Finishing a 20-minute gentle stretch after sitting all day.',
        'The sound of rainfall outside while resting.'
      ]
    }
  ]);

  const [showSavedGratitude, setShowSavedGratitude] = useState(false);
  const [searchHistoryQuery, setSearchHistoryQuery] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const filteredSavedEntries = savedEntries.filter(e => {
    if (!searchHistoryQuery.trim()) return true;
    return e.items.some(item => item.toLowerCase().includes(searchHistoryQuery.toLowerCase())) ||
           e.date.toLowerCase().includes(searchHistoryQuery.toLowerCase());
  });

  const handleFieldChange = (id, value) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, text: value } : f));
  };

  const handleAddField = () => {
    setFields(prev => [...prev, { id: Date.now(), text: '' }]);
  };

  const handleRemoveField = (id) => {
    if (fields.length <= 1) return;
    setFields(prev => prev.filter(f => f.id !== id));
  };

  const handleSaveEntry = (e) => {
    e.preventDefault();
    const validItems = fields.map(f => f.text.trim()).filter(t => t.length > 0);
    if (validItems.length === 0) return;

    const newEntry = {
      id: 'g_' + Date.now(),
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: validItems
    };

    setSavedEntries(prev => [newEntry, ...prev]);
    setFields([
      { id: Date.now() + 1, text: '' },
      { id: Date.now() + 2, text: '' },
      { id: Date.now() + 3, text: '' }
    ]);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);

    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    } catch(err) {}
  };

  const handleUsePrompt = (prompt) => {
    // Find first empty field or add a new field
    const emptyField = fields.find(f => !f.text.trim());
    if (emptyField) {
      handleFieldChange(emptyField.id, prompt);
    } else {
      setFields(prev => [...prev, { id: Date.now(), text: prompt }]);
    }
    setActiveSubTab('my_gratitude');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Sub-navigation */}
      <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveSubTab('my_gratitude')}
          style={{
            padding: '0.4rem 0.9rem',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            background: activeSubTab === 'my_gratitude' ? 'var(--accent-primary-light)' : 'transparent',
            color: activeSubTab === 'my_gratitude' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer'
          }}
        >
          🙏 My Gratitude
        </button>

        <button
          onClick={() => setActiveSubTab('discovery')}
          style={{
            padding: '0.4rem 0.9rem',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            background: activeSubTab === 'discovery' ? 'var(--accent-primary-light)' : 'transparent',
            color: activeSubTab === 'discovery' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer'
          }}
        >
          🌱 Gratitude Discovery
        </button>
      </div>

      {activeSubTab === 'my_gratitude' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* New Gratitude Entry Form */}
          <form onSubmit={handleSaveEntry} className="card-glass" style={{ padding: '1.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Today's Gratitude Moments ✨
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.15rem 0 0 0' }}>
                  Write 1 or more micro-joys you noticed today.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddField}
                className="btn btn-secondary btn-sm"
                style={{ gap: '0.25rem', fontSize: '0.76rem' }}
              >
                <Plus size={13} /> Add Field
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {fields.map((f, idx) => (
                <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>
                      I'm grateful for...
                    </div>
                    <input
                      type="text"
                      placeholder={`Moment ${idx + 1}...`}
                      value={f.text}
                      onChange={e => handleFieldChange(f.id, e.target.value)}
                      className="input-field"
                      style={{ fontSize: '0.85rem', width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveField(f.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '0.3rem',
                        marginTop: '1.1rem'
                      }}
                      title="Remove field"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}>
                Save Gratitude Entry
              </button>
              {savedSuccess && (
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                  ✓ Moments saved!
                </span>
              )}
            </div>
          </form>

          {/* Progressive Disclosure: View My Gratitude */}
          <div className="card-glass" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0 0 0.15rem 0', color: 'var(--text-primary)' }}>
                  Saved Gratitude Library
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                  Your private collection of appreciated moments.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowSavedGratitude(!showSavedGratitude)}
                className="btn btn-secondary btn-sm"
                style={{ gap: '0.35rem', fontSize: '0.78rem' }}
              >
                <Bookmark size={13} color="var(--accent-primary)" />
                <span>{showSavedGratitude ? 'Hide Gratitude History' : 'View Previous Gratitude'}</span>
              </button>
            </div>

            {/* Revealed Gratitude Entries */}
            {showSavedGratitude && (
              <div style={{ marginTop: '1.15rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.15rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {savedEntries.length} saved {savedEntries.length === 1 ? 'reflection' : 'reflections'}
                  </span>
                </div>
                {/* Search / Filter Input */}
                <input
                  type="text"
                  placeholder="Search your saved gratitude moments..."
                  value={searchHistoryQuery}
                  onChange={e => setSearchHistoryQuery(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '0.82rem', padding: '0.45rem 0.75rem' }}
                />

                {filteredSavedEntries.length > 0 ? (
                  filteredSavedEntries.map(entry => (
                    <div
                      key={entry.id}
                      style={{
                        padding: '1rem 1.2rem',
                        background: 'var(--bg-secondary)',
                        borderLeft: '4px solid var(--accent-primary)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        <span>📅 {entry.date}</span>
                        <span className="pill-badge primary" style={{ fontSize: '0.64rem' }}>
                          {entry.items.length} Moments
                        </span>
                      </div>

                      <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                        {entry.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                    No matching gratitude moments found.
                  </p>
                )}
              </div>
            )}
          </div>

        </div>
      ) : (
        /* GRATITUDE DISCOVERY PROMPTS */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card-glass" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--text-primary)' }}>
              Gentle Gratitude Inspiration 🌱
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
              Sometimes we need a gentle question to notice the warmth already around us. Tap any prompt to begin.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {GRATITUDE_PROMPTS.map((prompt, idx) => (
                <div
                  key={idx}
                  onClick={() => handleUsePrompt(prompt)}
                  className="card-interactive"
                  style={{
                    padding: '0.85rem 1rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    💭 "{prompt}"
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--accent-primary)', fontSize: '0.74rem', fontWeight: 700, flexShrink: 0 }}>
                    <span>Use</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
