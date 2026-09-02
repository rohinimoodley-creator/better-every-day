import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { generateThemeFromPrompt, COMMUNITY_THEMES } from '../../engine/themeGenerator';
import { X, Sparkles, Palette, Check, Heart, Eye, Globe, Lock, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const PALETTES = [
  { id: 'earthy', name: 'Warm Earth & Sage', prompt: 'Nature green, soft white and earth brown', icon: '🌿' },
  { id: 'sunset', name: 'Sunset Peach & Gold', prompt: 'Sunset peach, golden honey and warm white', icon: '🌅' },
  { id: 'lavender', name: 'Lavender Stardust', prompt: 'Soft pastel lavender and warm honey', icon: '🌸' },
  { id: 'ocean', name: 'Deep Ocean & Foam', prompt: 'Ocean blue, coastal cyan and soft white', icon: '🌊' },
  { id: 'dark_fantasy', name: 'Midnight Obsidian & Purple', prompt: 'Dark fantasy with purple and black', icon: '🔮' },
  { id: 'minimal', name: 'Zen Charcoal & Crisp White', prompt: 'Minimalist charcoal and crisp white', icon: '⚪' }
];

export default function ThemeCreatorModal({ isOpen, onClose }) {
  const { createCustomTheme, setTheme, howIThrive, shareCustomTheme } = useWellness();

  const [promptText, setPromptText] = useState('');
  const [baseMode, setBaseMode] = useState('light'); // 'light' | 'dark'
  const [previewTheme, setPreviewTheme] = useState(null);
  const [themeVisibility, setThemeVisibility] = useState('private'); // 'private' | 'shareable' | 'public'
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'community'

  if (!isOpen) return null;

  const handleGenerate = (customPrompt = promptText) => {
    if (!customPrompt.trim()) return;
    const generated = generateThemeFromPrompt(customPrompt, baseMode);
    setPreviewTheme(generated);
  };

  const handleApply = (themeToApply = previewTheme) => {
    if (!themeToApply) return;
    createCustomTheme({
      ...themeToApply,
      visibility: themeVisibility
    });

    if (themeVisibility !== 'private') {
      shareCustomTheme({
        name: themeToApply.name || promptText || 'My Custom Palette',
        primaryColor: themeToApply.accentPrimary,
        accentColor: themeToApply.accentSecondary,
        icon: themeToApply.icon || '🎨',
        description: `Theme generated from: "${promptText || themeToApply.name}"`
      }, themeVisibility === 'public' ? 'public' : 'friends');
    }

    try {
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.6 }
      });
    } catch(e) {}
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 620 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <span className="pill-badge primary" style={{ marginBottom: '0.25rem' }}>
              <Palette size={12} /> Theme Studio & Generator
            </span>
            <h3 style={{ fontSize: '1.35rem' }}>Theme Creator 🎨</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
          <button
            onClick={() => setActiveTab('generator')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: activeTab === 'generator' ? 'var(--accent-primary-light)' : 'transparent',
              color: activeTab === 'generator' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            ✨ AI / Prompt Generator
          </button>
          <button
            onClick={() => setActiveTab('community')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: activeTab === 'community' ? 'var(--accent-primary-light)' : 'transparent',
              color: activeTab === 'community' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Globe size={13} /> Community Themes
          </button>
        </div>

        {activeTab === 'generator' ? (
          <div>
            {/* Natural Language Prompt Input */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                Describe your dream theme in words:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="e.g. Nature green, soft white and earth brown..."
                  value={promptText}
                  onChange={e => setPromptText(e.target.value)}
                  className="input-field"
                />
                <button 
                  onClick={() => handleGenerate()} 
                  className="btn btn-primary"
                  style={{ flexShrink: 0 }}
                >
                  <Sparkles size={15} /> Generate
                </button>
              </div>
            </div>

            {/* Quick Inspiration Palette Chips */}
            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                Or select a curated color vibe:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {PALETTES.map(pal => (
                  <button
                    key={pal.id}
                    onClick={() => { setPromptText(pal.prompt); handleGenerate(pal.prompt); }}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-pill)',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-tertiary)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <span>{pal.icon}</span>
                    <span>{pal.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Light / Dark Mode Toggle */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <button
                onClick={() => { setBaseMode('light'); if (promptText) handleGenerate(promptText); }}
                className={`btn btn-sm ${baseMode === 'light' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
              >
                ☀️ Light Ambience
              </button>
              <button
                onClick={() => { setBaseMode('dark'); if (promptText) handleGenerate(promptText); }}
                className={`btn btn-sm ${baseMode === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
              >
                🌙 Midnight Ambience
              </button>
            </div>

            {/* Live Interactive Preview Card */}
            {previewTheme && (
              <div 
                style={{
                  background: previewTheme.bgPrimary,
                  border: `2px solid ${previewTheme.accentPrimary}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  marginBottom: '1.25rem',
                  color: previewTheme.textPrimary
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: previewTheme.accentPrimary }}>
                    Live Preview: {previewTheme.name}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: previewTheme.textMuted }}>WCAG Compliant ✓</span>
                </div>

                <div style={{ background: previewTheme.bgSecondary, padding: '0.85rem', borderRadius: 'var(--radius-md)', border: `1px solid ${previewTheme.borderGlass}`, marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '0.95rem', margin: '0 0 0.2rem 0', color: previewTheme.textPrimary }}>Sample Dashboard Card</h4>
                  <p style={{ fontSize: '0.8rem', color: previewTheme.textSecondary, margin: '0 0 0.5rem 0' }}>
                    This is how your text, metrics, and cards will feel across Better Every Day.
                  </p>
                  <button 
                    style={{
                      background: previewTheme.accentPrimary,
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.4rem 0.85rem',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.78rem',
                      fontWeight: 700
                    }}
                  >
                    Action Button
                  </button>
                </div>

                {/* Visibility Controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: previewTheme.textSecondary }}>Publishing:</span>
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    {[
                      { id: 'private', label: '🔒 Private' },
                      { id: 'shareable', label: '👥 Friends' },
                      { id: 'public', label: '🌍 Community' }
                    ].map(v => (
                      <button
                        key={v.id}
                        onClick={() => setThemeVisibility(v.id)}
                        style={{
                          border: themeVisibility === v.id ? `1px solid ${previewTheme.accentPrimary}` : 'none',
                          background: themeVisibility === v.id ? previewTheme.accentPrimaryLight : 'transparent',
                          color: previewTheme.textPrimary,
                          padding: '0.2rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.72rem',
                          cursor: 'pointer'
                        }}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => handleApply(previewTheme)}
                disabled={!previewTheme}
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.85rem' }}
              >
                <Check size={16} /> Apply This Theme
              </button>
              <button onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* Community Themes Browser */
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Explore and use beautiful themes published by the Better Every Day community:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {COMMUNITY_THEMES.map(comm => (
                <div
                  key={comm.id}
                  style={{
                    background: comm.bgPrimary,
                    border: `1px solid ${comm.accentPrimary}44`,
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '1rem', margin: '0 0 0.15rem 0', color: comm.textPrimary }}>
                      {comm.name}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: comm.textMuted }}>
                      Created by {comm.creator} • ❤️ {comm.likes} members using
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      createCustomTheme(comm);
                      onClose();
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ background: comm.accentPrimary }}
                  >
                    Use Theme
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
