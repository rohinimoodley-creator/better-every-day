import React, { useState, useEffect } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { 
  Heart, 
  Plus, 
  Trash2, 
  Sparkles, 
  Check, 
  Bookmark, 
  Calendar, 
  Search,
  X,
  RefreshCw,
  Info,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

const GRATITUDE_EXAMPLES = [
  "“I'm grateful for the coffee I had this morning.”",
  "“I'm grateful Luna cuddled with me.”",
  "“I'm grateful I got through a difficult day.”",
  "“I'm grateful for my family.”"
];

export default function MindHub({ initialSubModal = null }) {
  const { 
    discoveredGratitude = [], 
    setDiscoveredGratitude,
    savedGratitudeEntries = [], 
    addPersonalGratitude, 
    deletePersonalGratitude,
    approveDiscoveredGratitude, 
    rejectDiscoveredGratitude,
    stepCount,
    hydrationMl
  } = useWellness();

  // Launcher Pop-up States (3 buttons)
  const [isMyGratitudeOpen, setIsMyGratitudeOpen] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);

  // My Gratitude composer state
  const [fields, setFields] = useState([
    { id: 1, text: '' },
    { id: 2, text: '' }
  ]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Collection search state
  const [searchHistoryQuery, setSearchHistoryQuery] = useState('');

  // Discovery state
  const [keepSuccessMessage, setKeepSuccessMessage] = useState(null);

  useEffect(() => {
    if (initialSubModal === 'compose' || initialSubModal === 'my_gratitude') {
      setIsMyGratitudeOpen(true);
    } else if (initialSubModal === 'collection') {
      setIsCollectionOpen(true);
    } else if (initialSubModal === 'discovery') {
      setIsDiscoveryOpen(true);
    }
  }, [initialSubModal]);

  const pendingDiscoveries = discoveredGratitude.filter(d => d.status === 'discovered');

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

  const handleGenerateNewDiscoveries = () => {
    const newItems = [];
    const nowStr = new Date().toISOString().split('T')[0];

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

    if (!discoveredGratitude.some(d => d.id === 'dg_quiet_moment')) {
      newItems.push({
        id: 'dg_quiet_moment',
        text: "I'm grateful I gave myself a quiet moment to pause and breathe.",
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
    <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '3.5rem' }}>
      
      {/* 1. Clean Compact Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.15rem' }}>
          <span className="pill-badge purple" style={{ fontSize: '0.7rem' }}>
            <Sparkles size={11} /> Mind & Gratitude
          </span>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>
          Mind & Gratitude 🧘💚
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
          Choose an option below to capture gratitude, browse your collection, or explore suggestions.
        </p>
      </div>

      {/* 2. Sleek Launcher Grid (3 buttons) */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '0.75rem' 
        }}
      >
        {/* 1. My Gratitude */}
        <button
          type="button"
          onClick={() => setIsMyGratitudeOpen(true)}
          className="card-glass card-interactive"
          style={{
            background: 'linear-gradient(135deg, rgba(64, 145, 108, 0.12) 0%, var(--bg-glass-card) 100%)',
            border: '1.5px solid rgba(64, 145, 108, 0.22)',
            borderRadius: 'var(--radius-card)',
            padding: '1.1rem 0.85rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
            minHeight: '120px',
            boxShadow: 'var(--shadow-subtle)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <div 
            style={{ 
              width: 44, 
              height: 44, 
              borderRadius: '50%', 
              background: 'var(--accent-primary)', 
              color: '#ffffff',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(45, 106, 79, 0.25)'
            }}
          >
            <Heart size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              My Gratitude
            </h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Capture moments of joy
            </span>
          </div>
        </button>

        {/* 2. My Gratitude Collection */}
        <button
          type="button"
          onClick={() => setIsCollectionOpen(true)}
          className="card-glass card-interactive"
          style={{
            background: 'linear-gradient(135deg, rgba(123, 97, 255, 0.12) 0%, var(--bg-glass-card) 100%)',
            border: '1.5px solid rgba(123, 97, 255, 0.22)',
            borderRadius: 'var(--radius-card)',
            padding: '1.1rem 0.85rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
            minHeight: '120px',
            boxShadow: 'var(--shadow-subtle)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <div 
            style={{ 
              width: 44, 
              height: 44, 
              borderRadius: '50%', 
              background: 'var(--accent-purple)', 
              color: '#ffffff',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(123, 97, 255, 0.25)'
            }}
          >
            <BookOpen size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              My Gratitude Collection
            </h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {savedGratitudeEntries.length} saved reflection{savedGratitudeEntries.length === 1 ? '' : 's'}
            </span>
          </div>
        </button>

        {/* 3. Gratitude Discovery (Spanning 2 columns) */}
        <button
          type="button"
          onClick={() => setIsDiscoveryOpen(true)}
          className="card-glass card-interactive"
          style={{
            gridColumn: 'span 2',
            background: 'linear-gradient(135deg, rgba(224, 159, 62, 0.12) 0%, var(--bg-glass-card) 100%)',
            border: '1.5px solid rgba(224, 159, 62, 0.22)',
            borderRadius: 'var(--radius-card)',
            padding: '1.1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'left',
            gap: '1rem',
            cursor: 'pointer',
            minHeight: '80px',
            boxShadow: 'var(--shadow-subtle)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div 
              style={{ 
                width: 44, 
                height: 44, 
                borderRadius: '50%', 
                background: '#e09f3e', 
                color: '#ffffff',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(224, 159, 62, 0.25)',
                flexShrink: 0
              }}
            >
              <Sparkles size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Gratitude Discovery ✨
              </h4>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {pendingDiscoveries.length} suggestions across your daily habits
              </span>
            </div>
          </div>

          <div style={{ 
            background: 'rgba(224, 159, 62, 0.15)', 
            padding: '0.35rem 0.75rem', 
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#e09f3e'
          }}>
            Review →
          </div>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3 POP-UP MODAL SHEETS                                                     */}
      {/* ========================================================================= */}

      {/* 1. My Gratitude Composer Modal */}
      {isMyGratitudeOpen && (
        <div className="modal-backdrop" onClick={() => setIsMyGratitudeOpen(false)} style={{ zIndex: 1100 }}>
          <div 
            className="modal-sheet" 
            onClick={e => e.stopPropagation()}
            style={{ 
              maxWidth: 580, 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Heart size={18} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Capture Gratitude
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsMyGratitudeOpen(false)}
                style={{ 
                  background: 'var(--bg-tertiary)', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: 32, 
                  height: 32, 
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

            <form onSubmit={handleSaveEntry} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Write down what brought you comfort, joy, or relief today.
                </p>
                <button
                  type="button"
                  onClick={handleAddField}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.25rem', fontSize: '0.74rem' }}
                >
                  <Plus size={13} /> Add Line
                </button>
              </div>

              {/* Inspiration examples */}
              <div style={{ background: 'var(--bg-tertiary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>Examples:</span>
                {GRATITUDE_EXAMPLES.map((ex, i) => (
                  <span key={i} style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    {ex}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {fields.map((f, idx) => (
                  <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--accent-primary)', display: 'block', marginBottom: '0.25rem' }}>
                        I'm grateful for...
                      </label>
                      <input
                        type="text"
                        placeholder={`e.g. coffee this morning, quiet breeze, cozy rest...`}
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

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ padding: '0.55rem 1.35rem', fontSize: '0.88rem', gap: '0.35rem' }}
                >
                  <Check size={16} /> Save Gratitude Entry
                </button>

                {savedSuccess && (
                  <span style={{ fontSize: '0.82rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                    ✓ Saved to your collection!
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. My Gratitude Collection Modal */}
      {isCollectionOpen && (
        <div className="modal-backdrop" onClick={() => setIsCollectionOpen(false)} style={{ zIndex: 1100 }}>
          <div 
            className="modal-sheet" 
            onClick={e => e.stopPropagation()}
            style={{ 
              maxWidth: 580, 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <BookOpen size={18} color="var(--accent-purple)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  My Gratitude Collection ({savedGratitudeEntries.length})
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsCollectionOpen(false)}
                style={{ 
                  background: 'var(--bg-tertiary)', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: 32, 
                  height: 32, 
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

            {/* Search filter */}
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                placeholder="Search reflections by keyword or date..."
                value={searchHistoryQuery}
                onChange={e => setSearchHistoryQuery(e.target.value)}
                className="input-field"
                style={{ fontSize: '0.82rem', padding: '0.45rem 0.75rem 0.45rem 2rem', width: '100%', boxSizing: 'border-box' }}
              />
              <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
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
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.86rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                No gratitude moments match your search.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Gratitude Discovery Modal */}
      {isDiscoveryOpen && (
        <div className="modal-backdrop" onClick={() => setIsDiscoveryOpen(false)} style={{ zIndex: 1100 }}>
          <div 
            className="modal-sheet" 
            onClick={e => e.stopPropagation()}
            style={{ 
              maxWidth: 580, 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={18} color="#e09f3e" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Gratitude Discovery
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsDiscoveryOpen(false)}
                style={{ 
                  background: 'var(--bg-tertiary)', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: 32, 
                  height: 32, 
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

            {/* Banner */}
            <div style={{ background: 'var(--bg-secondary)', padding: '0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 0.65rem 0', lineHeight: 1.45 }}>
                Better Every Day looks across your daily habits (walks, water, rest, rhythm) to surface moments worth appreciating. <strong>You decide whether to keep or discard each suggestion.</strong>
              </p>
              <button
                type="button"
                onClick={handleGenerateNewDiscoveries}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', gap: '0.35rem' }}
              >
                <RefreshCw size={12} /> Scan for New Moments
              </button>
            </div>

            {keepSuccessMessage && (
              <div style={{ background: 'var(--accent-primary-light)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                ✓ {keepSuccessMessage}
              </div>
            )}

            {/* Pending List */}
            {pendingDiscoveries.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {pendingDiscoveries.map(disc => (
                  <div
                    key={disc.id}
                    style={{
                      padding: '1rem',
                      background: 'var(--bg-secondary)',
                      borderLeft: '4px solid var(--accent-primary)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="pill-badge primary" style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                        {disc.icon || '🌱'} From {disc.sourceType || 'Your Day'}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {disc.date || 'Today'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                      {disc.text.startsWith("I'm grateful") ? disc.text : `I'm grateful for ${disc.text}`}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.35rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <button
                        type="button"
                        onClick={() => handleKeepDiscovery(disc.id, disc.text)}
                        className="btn btn-primary btn-sm"
                        style={{ gap: '0.35rem', padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}
                      >
                        <span>💚 Keep</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveDiscovery(disc.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ gap: '0.35rem', padding: '0.35rem 0.85rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}
                      >
                        <Trash2 size={12} /> Discard
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                No pending discovery moments. You've reviewed all suggestions!
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
