import React, { useState, useMemo } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { JOURNAL_THEMES } from '../../data/themes';
import { analyzeGratitudeTrends, filterEntriesByDateRange } from '../../engine/gratitudeEngine';
import JournalThemes from './JournalThemes';
import JournalExportModal from './JournalExportModal';
import VoiceLoggingModal from '../voice/VoiceLoggingModal';
import {
  Plus,
  Palette,
  Printer,
  Mic,
  Image,
  Sparkles,
  Heart,
  Trash2,
  CheckCircle,
  Smile,
  Search,
  Calendar,
  Filter,
  Volume2,
  Play,
  Pause,
  Check,
  X,
  Edit3,
  Clock,
  Flame,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function JournalStudio() {
  const {
    journalEntries,
    addJournalEntry,
    deleteJournalEntry,
    discoveredGratitude,
    approveDiscoveredGratitude,
    rejectDiscoveredGratitude,
    saveDiscoveredGratitudeForLater
  } = useWellness();

  const [journalType, setJournalType] = useState('gratitude'); // 'gratitude' | 'general' | 'manifestation'
  const [gratitudeSubTab, setGratitudeSubTab] = useState('my_gratitude'); // 'my_gratitude' | 'discovery' | 'trends' | 'comparison'
  const [activeThemeId, setActiveThemeId] = useState('nature');
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Search & Date Filters for Past Entries
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all_time'); // 'today' | 'this_week' | 'this_month' | 'this_year' | 'all_time'
  const [typeFilter, setTypeFilter] = useState('all');

  // Form states
  const [title, setTitle] = useState('');
  const [freeText, setFreeText] = useState('');
  const [gratitude1, setGratitude1] = useState('');
  const [gratitude2, setGratitude2] = useState('');
  const [gratitude3, setGratitude3] = useState('');
  const [selectedStickers, setSelectedStickers] = useState(['🌱', '✨']);
  const [moodStamp, setMoodStamp] = useState('Calm & Grateful');
  const [editingGratitudeId, setEditingGratitudeId] = useState(null);
  const [editingGratitudeText, setEditingGratitudeText] = useState('');

  // Audio voice note simulation player state
  const [playingVoiceId, setPlayingVoiceId] = useState(null);

  const activeTheme = JOURNAL_THEMES.find(t => t.id === activeThemeId) || JOURNAL_THEMES[0];

  const handleToggleSticker = (sticker) => {
    setSelectedStickers(prev => 
      prev.includes(sticker) ? prev.filter(s => s !== sticker) : [...prev, sticker]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    let entryData = {
      title,
      type: journalType,
      aestheticId: activeThemeId,
      stickers: selectedStickers,
      moodStamp
    };

    if (journalType === 'gratitude') {
      entryData.entries = [
        gratitude1 || 'A quiet mindful moment',
        gratitude2 || 'Nourishing food',
        gratitude3 || 'Fresh air outdoors'
      ];
    } else {
      entryData.content = freeText || 'Reflections and thoughtful free writing.';
    }

    addJournalEntry(entryData);

    // Reset Form
    setTitle('');
    setFreeText('');
    setGratitude1('');
    setGratitude2('');
    setGratitude3('');

    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch(e) {}
  };

  // Filtered Past Journal Entries
  const filteredEntries = useMemo(() => {
    let result = filterEntriesByDateRange(journalEntries, dateFilter);

    if (typeFilter !== 'all') {
      result = result.filter(e => e.type === typeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e => 
        (e.title && e.title.toLowerCase().includes(q)) ||
        (e.content && e.content.toLowerCase().includes(q)) ||
        (e.entries && e.entries.some(str => str.toLowerCase().includes(q))) ||
        (e.moodStamp && e.moodStamp.toLowerCase().includes(q))
      );
    }

    return result;
  }, [journalEntries, dateFilter, typeFilter, searchQuery]);

  // Analyze Gratitude Trends
  const allGratitudeMoments = useMemo(() => {
    const fromJournals = journalEntries
      .filter(j => j.type === 'gratitude')
      .flatMap(j => (j.entries || []).map(text => ({ text, date: j.date, title: j.title })));

    const fromDiscovery = discoveredGratitude
      .filter(dg => dg.status === 'added')
      .map(dg => ({ text: dg.text, date: dg.date, title: 'Discovered Moment' }));

    return [...fromJournals, ...fromDiscovery];
  }, [journalEntries, discoveredGratitude]);

  const gratitudeTrends = useMemo(() => {
    return analyzeGratitudeTrends(allGratitudeMoments);
  }, [allGratitudeMoments]);

  const startEditDiscovered = (item) => {
    setEditingGratitudeId(item.id);
    setEditingGratitudeText(item.text);
  };

  const saveEditDiscovered = (id) => {
    approveDiscoveredGratitude(id, editingGratitudeText);
    setEditingGratitudeId(null);
  };

  return (
    <div>
      {/* Top Header & Actions */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.8rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: 'var(--radius-pill)' }}>
          <button
            onClick={() => setJournalType('gratitude')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: journalType === 'gratitude' ? 'var(--bg-secondary)' : 'transparent',
              color: journalType === 'gratitude' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: journalType === 'gratitude' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            ✨ Gratitude Space
          </button>
          <button
            onClick={() => setJournalType('general')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: journalType === 'general' ? 'var(--bg-secondary)' : 'transparent',
              color: journalType === 'general' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: journalType === 'general' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            📖 General Journal
          </button>
          <button
            onClick={() => setJournalType('manifestation')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: journalType === 'manifestation' ? 'var(--bg-secondary)' : 'transparent',
              color: journalType === 'manifestation' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: journalType === 'manifestation' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            🌟 Manifestation
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => setIsVoiceModalOpen(true)}
            className="btn btn-primary btn-sm"
            style={{ gap: '0.3rem' }}
          >
            <Mic size={14} /> Voice Log
          </button>

          <button 
            onClick={() => setIsThemeModalOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.3rem' }}
          >
            <Palette size={14} /> Aesthetic: {activeTheme.name.split(' ')[0]}
          </button>

          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.3rem' }}
          >
            <Printer size={14} /> Export (PDF/Word/CSV)
          </button>
        </div>
      </div>

      {/* GRATITUDE SUB-NAV: My Gratitude vs Gratitude Discovery vs Comparison vs Trends */}
      {journalType === 'gratitude' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.6rem' }}>
          {[
            { id: 'my_gratitude', label: '✍️ My Gratitude (What I Wrote)' },
            { id: 'discovery', label: '🌱 Gratitude Discovery' },
            { id: 'comparison', label: '⚖️ Side-by-Side Comparison' },
            { id: 'trends', label: '📈 Gratitude Themes & Patterns' }
          ].map(sub => (
            <button
              key={sub.id}
              onClick={() => setGratitudeSubTab(sub.id)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: gratitudeSubTab === sub.id ? 'var(--accent-primary-light)' : 'transparent',
                color: gratitudeSubTab === sub.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}

      {/* =========================================================================
          VIEW 1: DISCOVERED GRATITUDE QUEUE
          ========================================================================= */}
      {journalType === 'gratitude' && gratitudeSubTab === 'discovery' && (
        <div className="card-glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <span className="pill-badge primary" style={{ marginBottom: '0.2rem' }}>
                🌱 Intelligent Recognition
              </span>
              <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Gratitude Discovery</h3>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Identified from voice notes & check-ins
            </span>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.45 }}>
            Better Every Day notices small positive moments you experienced throughout your day. You choose what belongs in your gratitude journal:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {discoveredGratitude.filter(dg => dg.status !== 'rejected').map(item => {
              const isEditing = editingGratitudeId === item.id;
              const isAdded = item.status === 'added';
              return (
                <div
                  key={item.id}
                  style={{
                    background: isAdded ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                    border: `1px solid ${isAdded ? 'var(--accent-primary)' : 'var(--border-glass)'}`,
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1 }}>
                      <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{item.icon || '✨'}</span>
                      <div style={{ flex: 1 }}>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.3rem' }}>
                            <input
                              type="text"
                              value={editingGratitudeText}
                              onChange={e => setEditingGratitudeText(e.target.value)}
                              className="input-field"
                              style={{ fontSize: '0.88rem', padding: '0.35rem 0.65rem' }}
                            />
                            <button onClick={() => saveEditDiscovered(item.id)} className="btn btn-primary btn-sm">Save</button>
                          </div>
                        ) : (
                          <h4 style={{ fontSize: '1rem', margin: '0 0 0.2rem 0', color: 'var(--text-primary)', fontWeight: 700 }}>
                            "{item.text}"
                          </h4>
                        )}
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                          Source: "{item.rawSource}" • {item.theme} • {item.date}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {isAdded ? (
                        <span className="pill-badge primary" style={{ fontSize: '0.75rem' }}>
                          <Check size={13} /> In Gratitude Journal
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => approveDiscoveredGratitude(item.id)}
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: '0.75rem' }}
                            title="Add to My Gratitude Journal"
                          >
                            <Check size={14} /> Add to Journal
                          </button>
                          <button
                            onClick={() => startEditDiscovered(item)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.75rem' }}
                            title="Edit wording"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => rejectDiscoveredGratitude(item.id)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent-rose)' }}
                            title="Dismiss"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: SIDE-BY-SIDE COMPARISON (WHAT I WROTE VS WHAT APP NOTICED)
          ========================================================================= */}
      {journalType === 'gratitude' && gratitudeSubTab === 'comparison' && (
        <div className="card-glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.35rem' }}>Gratitude Reflection Comparison ⚖️</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Compare what you intentionally recognized with what Better Every Day observed from your day.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {/* Left: What I Wrote */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
              <span className="pill-badge primary" style={{ marginBottom: '0.75rem' }}>
                ✍️ What I Intentionally Wrote
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {journalEntries.filter(j => j.type === 'gratitude').slice(0, 3).map(j => (
                  <div key={j.id} style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{j.date}</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{j.title}</div>
                    <ul style={{ margin: '0.4rem 0 0 1rem', padding: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {(j.entries || []).map((e, idx) => <li key={idx}>{e}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: What Better Every Day Noticed */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
              <span className="pill-badge orange" style={{ marginBottom: '0.75rem' }}>
                🌱 What Better Every Day Noticed
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {discoveredGratitude.slice(0, 3).map(dg => (
                  <div key={dg.id} style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{dg.date} • {dg.theme}</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--accent-primary)' }}>"{dg.text}"</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '0.25rem' }}>
                      Context: {dg.rawSource}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: GRATITUDE THEMES & PATTERNS
          ========================================================================= */}
      {journalType === 'gratitude' && gratitudeSubTab === 'trends' && (
        <div className="card-glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <span className="pill-badge primary" style={{ marginBottom: '0.2rem' }}>
                📈 Longitudinal Insights
              </span>
              <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Gratitude Patterns & Themes</h3>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {allGratitudeMoments.length} total blessings recorded
            </span>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Observing what brings you joy over time without reducing your experience to a simplistic score:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
            {gratitudeTrends.map((tr, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-glass)',
                  padding: '1.15rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {tr.theme}
                    </span>
                    <span className="pill-badge primary" style={{ fontSize: '0.72rem' }}>
                      {tr.count} entries
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem 0', lineHeight: 1.4 }}>
                    {tr.insight}
                  </p>
                </div>

                {tr.samples.length > 0 && (
                  <div style={{ background: 'var(--bg-tertiary)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Sample: "{tr.samples[0]}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          MAIN WRITING STUDIO FORM (MY GRATITUDE / GENERAL / MANIFESTATION)
          ========================================================================= */}
      {(journalType !== 'gratitude' || gratitudeSubTab === 'my_gratitude') && (
        <form 
          onSubmit={handleSubmit}
          className="card-glass"
          style={{
            background: activeTheme.bg,
            borderColor: activeTheme.borderColor,
            padding: '1.75rem',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-lg)',
            backgroundImage: activeTheme.paperTexture
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.6rem' }}>{activeTheme.icon}</span>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: activeTheme.textColor, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {journalType.toUpperCase()} JOURNAL
              </span>
            </div>
            <span style={{ fontSize: '0.78rem', color: activeTheme.textColor, opacity: 0.8 }}>
              Theme: {activeTheme.name}
            </span>
          </div>

          {/* Title */}
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              required
              placeholder={
                journalType === 'gratitude' 
                  ? 'Title: e.g. Morning Light & Little Blessings...' 
                  : journalType === 'manifestation'
                  ? 'Title: e.g. Embodying Vitality & Abundance...'
                  : 'Title: What is on your mind today?...'
              }
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="input-field"
              style={{
                background: activeTheme.cardBg,
                color: activeTheme.textColor,
                borderColor: activeTheme.borderColor,
                fontSize: '1.1rem',
                fontWeight: 700
              }}
            />
          </div>

          {/* Gratitude 3 Prompts vs Freeform Content */}
          {journalType === 'gratitude' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: activeTheme.textColor, display: 'block', marginBottom: '0.3rem' }}>
                  1. What is one tiny physical comfort you appreciate today?
                </label>
                <input
                  type="text"
                  placeholder="e.g. The warmth of fresh coffee or clean sheets..."
                  value={gratitude1}
                  onChange={e => setGratitude1(e.target.value)}
                  className="input-field"
                  style={{ background: activeTheme.cardBg, color: activeTheme.textColor, borderColor: activeTheme.borderColor }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: activeTheme.textColor, display: 'block', marginBottom: '0.3rem' }}>
                  2. Who or what made you feel supported or understood?
                </label>
                <input
                  type="text"
                  placeholder="e.g. A kind text from a friend or quiet time in nature..."
                  value={gratitude2}
                  onChange={e => setGratitude2(e.target.value)}
                  className="input-field"
                  style={{ background: activeTheme.cardBg, color: activeTheme.textColor, borderColor: activeTheme.borderColor }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: activeTheme.textColor, display: 'block', marginBottom: '0.3rem' }}>
                  3. What is one thing you did well today, no matter how small?
                </label>
                <input
                  type="text"
                  placeholder="e.g. Drank water, took 5 deep breaths, spoke gently to myself..."
                  value={gratitude3}
                  onChange={e => setGratitude3(e.target.value)}
                  className="input-field"
                  style={{ background: activeTheme.cardBg, color: activeTheme.textColor, borderColor: activeTheme.borderColor }}
                />
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: '1.25rem' }}>
              <textarea
                rows={5}
                required
                placeholder="Write your reflections freely without judgment..."
                value={freeText}
                onChange={e => setFreeText(e.target.value)}
                className="input-field"
                style={{
                  background: activeTheme.cardBg,
                  color: activeTheme.textColor,
                  borderColor: activeTheme.borderColor,
                  fontSize: '0.95rem',
                  lineHeight: 1.55
                }}
              />
            </div>
          )}

          {/* Stickers & Mood Stamp */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ fontSize: '0.78rem', color: activeTheme.textColor, marginRight: '0.3rem' }}>Stickers:</span>
              {['🌱', '✨', '☕', '🌊', '🌸', '💛', '🌙'].map(sticker => {
                const active = selectedStickers.includes(sticker);
                return (
                  <button
                    key={sticker}
                    type="button"
                    onClick={() => handleToggleSticker(sticker)}
                    style={{
                      background: active ? activeTheme.accent : 'transparent',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-pill)',
                      padding: '0.2rem 0.4rem',
                      cursor: 'pointer',
                      fontSize: '0.95rem'
                    }}
                  >
                    {sticker}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.78rem', color: activeTheme.textColor }}>Mood Stamp:</span>
              <select
                value={moodStamp}
                onChange={e => setMoodStamp(e.target.value)}
                className="select-field"
                style={{ fontSize: '0.8rem', padding: '0.25rem 0.6rem', background: activeTheme.cardBg, color: activeTheme.textColor }}
              >
                <option value="Calm & Grateful">Calm & Grateful</option>
                <option value="Joyful & Light">Joyful & Light</option>
                <option value="Grounded">Grounded</option>
                <option value="Reflective">Reflective</option>
                <option value="Gentle & Restful">Gentle & Restful</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              background: activeTheme.accent,
              color: '#ffffff',
              padding: '0.85rem',
              fontWeight: 800
            }}
          >
            <Sparkles size={16} /> Save Journal Entry
          </button>
        </form>
      )}

      {/* =========================================================================
          SEARCH & DATE-FILTERED PAST JOURNAL ARCHIVE
          ========================================================================= */}
      <div className="card-glass" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Past Journal Entries & Audio Notes</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Showing {filteredEntries.length} entries
            </span>
          </div>

          {/* Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-tertiary)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-subtle)', minWidth: 220 }}>
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search reflections..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.82rem', width: '100%' }}
            />
          </div>
        </div>

        {/* Date & Type Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
          {[
            { id: 'all_time', label: 'All Time' },
            { id: 'today', label: 'Today' },
            { id: 'this_week', label: 'This Week' },
            { id: 'this_month', label: 'This Month' },
            { id: 'this_year', label: 'This Year' }
          ].map(df => (
            <button
              key={df.id}
              onClick={() => setDateFilter(df.id)}
              style={{
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-pill)',
                border: dateFilter === df.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                background: dateFilter === df.id ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                color: dateFilter === df.id ? 'var(--accent-primary)' : 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {df.label}
            </button>
          ))}
        </div>

        {/* Entries List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredEntries.map(entry => {
            const entryTheme = JOURNAL_THEMES.find(t => t.id === entry.aestheticId) || JOURNAL_THEMES[0];
            return (
              <div
                key={entry.id}
                style={{
                  background: entryTheme.bg,
                  borderColor: entryTheme.borderColor,
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${entryTheme.borderColor}`,
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span className="pill-badge primary" style={{ fontSize: '0.68rem' }}>
                      {entry.type ? entry.type.toUpperCase() : 'JOURNAL'}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: entryTheme.textColor, opacity: 0.8 }}>
                      {entry.date}
                    </span>
                    {entry.moodStamp && (
                      <span className="pill-badge purple" style={{ fontSize: '0.68rem' }}>
                        {entry.moodStamp}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => deleteJournalEntry(entry.id)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent-rose)' }}
                    title="Delete Entry"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', color: entryTheme.textColor }}>
                  {entry.title}
                </h4>

                {/* Gratitude 3 Prompts List vs Free text */}
                {entry.entries && entry.entries.length > 0 ? (
                  <ul style={{ margin: '0 0 0.75rem 1.25rem', padding: 0, fontSize: '0.88rem', color: entryTheme.textColor, lineHeight: 1.45 }}>
                    {entry.entries.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: '0.2rem' }}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: '0.88rem', color: entryTheme.textColor, lineHeight: 1.5, margin: '0 0 0.75rem 0' }}>
                    {entry.content}
                  </p>
                )}

                {/* Voice Note Audio Player Simulation if recorded */}
                {entry.source === 'voice' && (
                  <div style={{ background: 'rgba(0,0,0,0.05)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setPlayingVoiceId(playingVoiceId === entry.id ? null : entry.id)}
                      style={{ width: 28, height: 28, borderRadius: '50%', background: entryTheme.accent, color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      {playingVoiceId === entry.id ? <Pause size={13} /> : <Play size={13} />}
                    </button>
                    <span style={{ fontSize: '0.78rem', color: entryTheme.textColor, fontWeight: 600 }}>
                      🎙️ Spoken Voice Recording (0:45)
                    </span>
                  </div>
                )}

                {/* Stickers Footer */}
                {entry.stickers && entry.stickers.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.3rem', fontSize: '1.1rem' }}>
                    {entry.stickers.map((s, idx) => <span key={idx}>{s}</span>)}
                  </div>
                )}
              </div>
            );
          })}

          {filteredEntries.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No journal reflections match your search or date filter.
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <JournalThemes
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        selectedThemeId={activeThemeId}
        onSelectTheme={setActiveThemeId}
      />

      <JournalExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        journalEntries={filteredEntries}
        discoveredGratitude={discoveredGratitude}
      />

      <VoiceLoggingModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </div>
  );
}
