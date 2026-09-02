import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { useAudio } from '../../context/AudioContext';
import { AFFIRMATIONS_DATA } from '../../data/mockData';
import { Sparkles, Heart, RefreshCw, Bookmark, Share2, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MindsetAffirmations() {
  const { 
    affirmationStyle, 
    setAffirmationStyle, 
    favoriteAffirmations, 
    setFavoriteAffirmations 
  } = useWellness();
  const { playChime } = useAudio();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const affirmations = AFFIRMATIONS_DATA[affirmationStyle] || AFFIRMATIONS_DATA.soft_love;
  const current = affirmations[currentIndex % affirmations.length];

  const isFavorited = favoriteAffirmations.some(f => f.text === current.text);

  const nextAffirmation = () => {
    setCurrentIndex(prev => prev + 1);
    playChime(528);
  };

  const toggleFavorite = () => {
    if (isFavorited) {
      setFavoriteAffirmations(prev => prev.filter(f => f.text !== current.text));
    } else {
      setFavoriteAffirmations(prev => [...prev, current]);
      try {
        confetti({
          particleCount: 30,
          spread: 45,
          origin: { y: 0.7 }
        });
      } catch(e) {}
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`"${current.text}" — Better Every Day Wellness`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      
      {/* Style Toggle Bar */}
      <div className="card-glass" style={{ padding: '1.25rem', marginBottom: '1.25rem', textAlign: 'center' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.6rem' }}>
          Select Your Daily Motivation Tone
        </span>
        
        <div style={{ display: 'inline-flex', gap: '0.5rem', background: 'var(--bg-tertiary)', padding: '0.35rem', borderRadius: 'var(--radius-pill)' }}>
          <button
            onClick={() => { setAffirmationStyle('soft_love'); setCurrentIndex(0); }}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: affirmationStyle === 'soft_love' ? 'var(--bg-secondary)' : 'transparent',
              color: affirmationStyle === 'soft_love' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: affirmationStyle === 'soft_love' ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            🌸 Soft Love (Gentle Compassion)
          </button>
          <button
            onClick={() => { setAffirmationStyle('tough_love'); setCurrentIndex(0); }}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: affirmationStyle === 'tough_love' ? 'var(--bg-secondary)' : 'transparent',
              color: affirmationStyle === 'tough_love' ? 'var(--accent-secondary)' : 'var(--text-muted)',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: affirmationStyle === 'tough_love' ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            ⚡ Tough Love (Direct Motivation)
          </button>
        </div>
      </div>

      {/* Affirmation Display Card */}
      <div 
        className="card-glass"
        style={{
          padding: '2.5rem 2rem',
          textAlign: 'center',
          background: affirmationStyle === 'soft_love'
            ? 'linear-gradient(135deg, var(--bg-glass-card) 0%, rgba(82, 183, 136, 0.08) 100%)'
            : 'linear-gradient(135deg, var(--bg-glass-card) 0%, rgba(217, 119, 54, 0.08) 100%)',
          borderColor: affirmationStyle === 'soft_love' ? 'var(--border-glass)' : 'rgba(217, 119, 54, 0.3)',
          marginBottom: '1.25rem'
        }}
      >
        <span className={`pill-badge ${affirmationStyle === 'soft_love' ? 'primary' : 'orange'}`} style={{ marginBottom: '1.5rem' }}>
          <Sparkles size={12} /> {current.theme}
        </span>

        <h3 
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.55rem',
            fontWeight: 600,
            lineHeight: 1.5,
            color: 'var(--text-primary)',
            maxWidth: 520,
            margin: '0 auto 2rem'
          }}
        >
          "{current.text}"
        </h3>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={nextAffirmation}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.5rem' }}
          >
            <RefreshCw size={16} /> Another Daily Truth
          </button>

          <button 
            onClick={toggleFavorite}
            className={`btn ${isFavorited ? 'btn-soft' : 'btn-secondary'}`}
            style={{ padding: '0.75rem' }}
            title="Save to favorites"
          >
            <Bookmark size={18} fill={isFavorited ? 'currentColor' : 'none'} />
          </button>

          <button 
            onClick={handleShare}
            className="btn btn-secondary"
            style={{ padding: '0.75rem' }}
            title="Copy quote"
          >
            <Share2 size={18} />
          </button>
        </div>

        {copied && (
          <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
            ✓ Copied quote to clipboard!
          </div>
        )}
      </div>

      {/* Saved Favorites Section */}
      {favoriteAffirmations.length > 0 && (
        <div className="card-glass" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Bookmark size={16} color="var(--accent-primary)" /> Saved Affirmations ({favoriteAffirmations.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {favoriteAffirmations.map((fav, i) => (
              <div 
                key={i}
                style={{
                  background: 'var(--bg-tertiary)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  fontStyle: 'italic',
                  color: 'var(--text-secondary)'
                }}
              >
                "{fav.text}"
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
