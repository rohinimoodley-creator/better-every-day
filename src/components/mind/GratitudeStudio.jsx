import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { 
  Heart, 
  Plus, 
  Trash2, 
  Sparkles, 
  Check, 
  Bookmark, 
  Calendar, 
  ArrowRight, 
  Share2, 
  Search,
  CheckCircle2,
  X,
  RefreshCw,
  Info,
  Footprints,
  Utensils,
  Droplets,
  Moon,
  Smile,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ContextualPip from '../mascot/ContextualPip';

const GRATITUDE_EXAMPLES = [
  "“I'm grateful for the coffee I had this morning.”",
  "“I'm grateful Luna cuddled with me.”",
  "“I'm grateful I got through a difficult day.”",
  "“I'm grateful for my family.”"
];

export default function GratitudeStudio({ defaultTab = 'my_gratitude' }) {
  const { 
    discoveredGratitude = [], 
    setDiscoveredGratitude,
    savedGratitudeEntries = [], 
    addPersonalGratitude, 
    deletePersonalGratitude,
    approveDiscoveredGratitude, 
    rejectDiscoveredGratitude,
    stepCount,
    hydrationMl,
    completedWorkouts,
    dailyCheckIn
  } = useWellness();

  const [activeSubTab, setActiveSubTab] = useState(defaultTab); // 'my_gratitude' | 'discovery'
  const [fields, setFields] = useState([
    { id: 1, text: '' },
    { id: 2, text: '' }
  ]);

  const [isCollectionRevealed, setIsCollectionRevealed] = useState(false);
  const [searchHistoryQuery, setSearchHistoryQuery] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [keepSuccessMessage, setKeepSuccessMessage] = useState(null);

  // Filter unresolved discoveries (status === 'discovered')
  const pendingDiscoveries = discoveredGratitude.filter(d => d.status === 'discovered');

  // Filter saved entries
  const filteredSavedEntries = savedGratitudeEntries.filter(e => {
    if (!searchHistoryQuery.trim()) return true;
    const q = searchHistoryQuery.toLowerCase();
    return e.items?.some(item => item.toLowerCase().includes(q)) ||
           e.date?.toLowerCase().includes(q);
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

    if (addPersonalGratitude) {
      addPersonalGratitude(validItems);
    }

    setFields([
      { id: Date.now() + 1, text: '' },
      { id: Date.now() + 2, text: '' }
    ]);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);

    try {
      confetti({ particleCount: 35, spread: 55, origin: { y: 0.6 } });
    } catch(err) {}
  };

  const handleKeepDiscovery = (id, text) => {
    if (approveDiscoveredGratitude) {
      approveDiscoveredGratitude(id);
    } else if (setDiscoveredGratitude) {
      setDiscoveredGratitude(prev => prev.map(g => g.id === id ? { ...g, status: 'added' } : g));
      if (addPersonalGratitude) addPersonalGratitude([text]);
    }

    setKeepSuccessMessage(`Added to your gratitude collection! 💚`);
    setTimeout(() => setKeepSuccessMessage(null), 3000);

    try {
      confetti({ particleCount: 25, spread: 45, origin: { y: 0.7 } });
    } catch(e) {}
  };

  const handleRemoveDiscovery = (id) => {
    if (rejectDiscoveredGratitude) {
      rejectDiscoveredGratitude(id);
    } else if (setDiscoveredGratitude) {
      setDiscoveredGratitude(prev => prev.map(g => g.id === id ? { ...g, status: 'rejected' } : g));
    }
  };

  // AI Discovery Generator: Scans current daily context
  const handleGenerateNewDiscoveries = () => {
    const newItems = [];
    const nowStr = new Date().toISOString().split('T')[0];

    // From Move / Steps
    if (stepCount && stepCount > 2000 && !discoveredGratitude.some(d => d.id === 'dg_move_today')) {
      newItems.push({
        id: 'dg_move_today',
        text: "I'm grateful for the walk I made time for today.",
        sourceType: 'Move',
        icon: '🌱',
        date: nowStr,
        status: 'discovered'
      });
    }

    // From Hydration
    if (hydrationMl && hydrationMl > 1000 && !discoveredGratitude.some(d => d.id === 'dg_hydrate_today')) {
      newItems.push({
        id: 'dg_hydrate_today',
        text: "I'm grateful I remembered to take care of myself with refreshing water today.",
        sourceType: 'Hydrate',
        icon: '💧',
        date: nowStr,
        status: 'discovered'
      });
    }

    // From Pet Play
    if (!discoveredGratitude.some(d => d.id === 'dg_pet_play')) {
      newItems.push({
        id: 'dg_pet_play',
        text: "I'm grateful for the time I spent playing with Luna.",
        sourceType: 'Pet Play',
        icon: '🐾',
        date: nowStr,
        status: 'discovered'
      });
    }

    // From Quiet Rest / Morning
    if (!discoveredGratitude.some(d => d.id === 'dg_quiet_morning')) {
      newItems.push({
        id: 'dg_quiet_morning',
        text: "I'm grateful I gave myself a quiet moment this morning.",
        sourceType: 'Daily Rhythm',
        icon: '☕',
        date: nowStr,
        status: 'discovered'
      });
    }

    if (newItems.length > 0 && setDiscoveredGratitude) {
      setDiscoveredGratitude(prev => [...newItems, ...prev]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Sub-navigation */}
      <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
        <button
          id="tab-my-gratitude"
          type="button"
          onClick={() => setActiveSubTab('my_gratitude')}
          style={{
            padding: '0.45rem 1rem',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            background: activeSubTab === 'my_gratitude' ? 'var(--accent-primary-light)' : 'transparent',
            color: activeSubTab === 'my_gratitude' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.84rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <span>💚</span>
          <span>My Gratitude</span>
        </button>

        <button
          id="tab-gratitude-discovery"
          type="button"
          onClick={() => setActiveSubTab('discovery')}
          style={{
            padding: '0.45rem 1rem',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            background: activeSubTab === 'discovery' ? 'var(--accent-primary-light)' : 'transparent',
            color: activeSubTab === 'discovery' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.84rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <span>✨</span>
          <span>Gratitude Discovery</span>
          {pendingDiscoveries.length > 0 && (
            <span style={{ 
              background: 'var(--accent-primary)', 
              color: '#ffffff', 
              fontSize: '0.68rem', 
              borderRadius: 'var(--radius-pill)', 
              padding: '1px 6px',
              fontWeight: 800
            }}>
              {pendingDiscoveries.length}
            </span>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. MY GRATITUDE (Personal Creation & Collection) */}
      {/* ========================================================================= */}
      {activeSubTab === 'my_gratitude' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Form to Capture Personal Gratitude */}
          <form onSubmit={handleSaveEntry} className="card-glass" style={{ padding: '1.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
              <div>
                <h3 style={{ fontSize: '1.12rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Capture What You're Grateful For 💚
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                  A personal space to write what brought you comfort, joy, or relief today.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddField}
                className="btn btn-secondary btn-sm"
                style={{ gap: '0.25rem', fontSize: '0.76rem' }}
              >
                <Plus size={13} /> Add Line
              </button>
            </div>

            {/* Inspiration prompts */}
            <div style={{ background: 'var(--bg-tertiary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>Examples:</span>
              {GRATITUDE_EXAMPLES.map((ex, i) => (
                <span key={i} style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  {ex}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {fields.map((f, idx) => (
                <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--accent-primary)', display: 'block', marginBottom: '0.25rem' }}>
                      I'm grateful for...
                    </label>
                    <input
                      type="text"
                      placeholder={`e.g. coffee this morning, quiet breeze, cuddles...`}
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
                      title="Remove line"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
              <button 
                id="save-my-gratitude-btn"
                type="submit" 
                className="btn btn-primary" 
                style={{ padding: '0.55rem 1.35rem', fontSize: '0.88rem', gap: '0.35rem' }}
              >
                <Check size={16} /> Save Gratitude Entry
              </button>

              {savedSuccess && (
                <span style={{ fontSize: '0.82rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                  ✓ Moments saved to your library!
                </span>
              )}
            </div>
          </form>

          {/* User's Gratitude Collection (Progressive Disclosure) */}
          <div className="card-glass" style={{ padding: '1.25rem' }}>
            <div 
              onClick={() => setIsCollectionRevealed(prev => !prev)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                userSelect: 'none',
                flexWrap: 'wrap',
                gap: '0.6rem'
              }}
            >
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  My Gratitude Collection 📖
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.1rem 0 0 0' }}>
                  {savedGratitudeEntries.length} reflection{savedGratitudeEntries.length === 1 ? '' : 's'} in your private library.
                </p>
              </div>

              <button
                type="button"
                className={`btn ${isCollectionRevealed ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', gap: '0.3rem' }}
                onClick={(e) => { e.stopPropagation(); setIsCollectionRevealed(prev => !prev); }}
              >
                <span>{isCollectionRevealed ? 'Hide Collection' : `View My Gratitude Collection (${savedGratitudeEntries.length})`}</span>
                {isCollectionRevealed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            {isCollectionRevealed && (
              <div style={{ marginTop: '1.15rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.15rem', animation: 'fadeIn 0.2s ease-out' }}>
                {/* Search filter */}
                <div style={{ position: 'relative', width: '100%', maxWidth: 260, marginBottom: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Search moments..."
                    value={searchHistoryQuery}
                    onChange={e => setSearchHistoryQuery(e.target.value)}
                    className="input-field"
                    style={{ fontSize: '0.78rem', padding: '0.4rem 0.65rem 0.4rem 1.8rem', width: '100%', boxSizing: 'border-box' }}
                  />
                  <Search size={13} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>

                {/* List of Saved Entries */}
                {filteredSavedEntries.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {filteredSavedEntries.map(entry => (
                      <div
                        key={entry.id}
                        style={{
                          padding: '1rem 1.2rem',
                          background: 'var(--bg-secondary)',
                          borderLeft: '4px solid var(--accent-primary)',
                          borderRadius: 'var(--radius-md)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.45rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            📅 {entry.date}
                          </span>
                          {deletePersonalGratitude && (
                            <button
                              type="button"
                              onClick={() => deletePersonalGratitude(entry.id)}
                              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                              title="Delete entry"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>

                        <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                          {entry.items?.map((item, i) => (
                            <li key={i} style={{ marginBottom: '0.2rem' }}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                    No gratitude moments match your search. Capture a new moment above!
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      ) : (
        /* ========================================================================= */
        /* 2. GRATITUDE DISCOVERY (AI Suggestions with Keep / Remove) */
        /* ========================================================================= */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          {/* Framed Gently as Suggestions */}
          <div 
            style={{ 
              background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(64, 145, 108, 0.08) 100%)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.35rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🌱</span>
              <h3 style={{ fontSize: '1.08rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                We noticed a little moment that might be worth appreciating.
              </h3>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 0.85rem 0' }}>
              Better Every Day looks across your daily rhythm (walks, water, meals, rest, check-ins, pet play) to surface gentle moments. <strong>You decide whether each one resonates.</strong>
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={handleGenerateNewDiscoveries}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', gap: '0.35rem' }}
              >
                <RefreshCw size={12} /> Scan for New Moments
              </button>
            </div>
          </div>

          {keepSuccessMessage && (
            <div style={{ background: 'var(--accent-primary-light)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-primary)', fontSize: '0.84rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
              ✓ {keepSuccessMessage}
            </div>
          )}

          {/* Pending Discovered Moments Queue */}
          {pendingDiscoveries.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {pendingDiscoveries.map(disc => (
                <div
                  key={disc.id}
                  id={`discovery-card-${disc.id}`}
                  className="card-glass"
                  style={{
                    padding: '1.25rem',
                    borderLeft: '4px solid var(--accent-primary)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="pill-badge primary" style={{ fontSize: '0.72rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span>{disc.icon || '🌱'}</span>
                      <span>From {disc.sourceType || disc.theme || 'Your Day'}</span>
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {disc.date || 'Today'}
                    </span>
                  </div>

                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.45 }}>
                    {disc.text.startsWith("I'm grateful") ? disc.text : `I'm grateful for ${disc.text}`}
                  </div>

                  {disc.rawSource && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Context: “{disc.rawSource}”
                    </div>
                  )}

                  {/* Keep or Remove Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.65rem', paddingTop: '0.35rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      id={`keep-discovery-${disc.id}`}
                      type="button"
                      onClick={() => handleKeepDiscovery(disc.id, disc.text)}
                      className="btn btn-primary btn-sm"
                      style={{ gap: '0.35rem', padding: '0.45rem 1rem', fontSize: '0.82rem' }}
                    >
                      <span>💚</span>
                      <span>Keep</span>
                    </button>

                    <button
                      id={`remove-discovery-${disc.id}`}
                      type="button"
                      onClick={() => handleRemoveDiscovery(disc.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '0.35rem', padding: '0.45rem 1rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}
                    >
                      <Trash2 size={13} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-glass" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌱</div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--text-primary)' }}>
                No Unresolved Discoveries
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '0 auto 1rem auto', maxWidth: 420 }}>
                You have reviewed all current suggestions. As you log your walks, water, rest, and check-ins, Better Every Day will gently look for moments worth appreciating.
              </p>
              <button
                type="button"
                onClick={() => setActiveSubTab('my_gratitude')}
                className="btn btn-secondary btn-sm"
                style={{ gap: '0.35rem' }}
              >
                <span>💚</span>
                <span>Go to My Gratitude</span>
              </button>
            </div>
          )}

          {/* Zero Pressure Guarantees */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.65rem 0.9rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            <Info size={13} style={{ flexShrink: 0 }} />
            <span>
              Gratitude Discovery is here to support you without streaks, daily quotas, or completion pressure.
            </span>
          </div>

        </div>
      )}

    </div>
  );
}
