import React, { useState, useEffect, useRef } from 'react';
import { useWellness } from '../../context/WellnessContext';
import PipSproutAvatar from './PipSproutAvatar';
import { PIP_CONTEXTS, getPipContextReaction, checkPipCooldown, playPipChime } from '../../engine/pipReactions';
import { Sparkles, Heart } from 'lucide-react';

export default function ContextualPip({
  context = 'home',
  size = 48,
  layout = 'badge', // 'badge' | 'banner' | 'avatar-only' | 'subtle'
  customMessage,
  moodOverride,
  interactive = true,
  className = '',
  style = {}
}) {
  const { howIThrive } = useWellness();
  const contextDef = PIP_CONTEXTS[context] || PIP_CONTEXTS.home;

  const [currentMood, setCurrentMood] = useState(moodOverride || contextDef.defaultMood || 'happy');
  const [currentAnim, setCurrentAnim] = useState('float');
  const [currentMessage, setCurrentMessage] = useState(customMessage || contextDef.defaultMessage);
  const [isReacting, setIsReacting] = useState(false);
  const [lastReactionId, setLastReactionId] = useState(null);
  const reactionTimerRef = useRef(null);

  // If mascot is turned off globally in How I Thrive
  if (howIThrive?.mascotInteractionLevel === 'off') {
    return null;
  }

  const isReducedMotion = howIThrive?.animationLevel === 'reduced' || howIThrive?.animationLevel === 'minimal';
  const isMinimal = howIThrive?.mascotInteractionLevel === 'minimal';

  // Keep mood synced if override changes
  useEffect(() => {
    if (moodOverride) {
      setCurrentMood(moodOverride);
    }
  }, [moodOverride]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
    };
  }, []);

  const handlePipClick = () => {
    if (!interactive) return;

    // Check cooldown to avoid spamming
    if (!checkPipCooldown(`contextual_${context}`)) {
      return;
    }

    // Pick random context-appropriate reaction
    const reaction = getPipContextReaction(context, lastReactionId, isReducedMotion);
    setLastReactionId(reaction.id);

    // Play gentle chime if sound is enabled
    if (howIThrive?.soundMascot !== false) {
      playPipChime(true);
    }

    // Set interactive state
    setCurrentMood(reaction.mood);
    setCurrentAnim(reaction.anim);
    setCurrentMessage(reaction.text);
    setIsReacting(true);

    if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
    reactionTimerRef.current = setTimeout(() => {
      setIsReacting(false);
      setCurrentMood(moodOverride || contextDef.defaultMood || 'happy');
      setCurrentAnim(isReducedMotion ? 'none' : 'float');
    }, 2800);
  };

  // ---------------------------------------------------------------------------
  // LAYOUT 1: AVATAR-ONLY (Compact inline or modal avatar with reaction tooltip)
  // ---------------------------------------------------------------------------
  if (layout === 'avatar-only') {
    return (
      <div 
        className={`contextual-pip-avatar-only ${className}`}
        style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', ...style }}
      >
        <PipSproutAvatar
          size={size}
          mood={currentMood}
          animated={!isReducedMotion}
          animationType={currentAnim}
          onClick={interactive ? handlePipClick : undefined}
          title={interactive ? "Tap Pip for gentle companionship 🌱" : undefined}
        />

        {/* Floating Bubble on Tap */}
        {isReacting && !isMinimal && (
          <div
            style={{
              position: 'absolute',
              bottom: '105%',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--bg-glass-card)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--accent-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '0.45rem 0.75rem',
              fontSize: '0.78rem',
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              boxShadow: 'var(--shadow-md)',
              zIndex: 30,
              pointerEvents: 'none',
              animation: 'fadeIn 0.2s ease-out',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Sparkles size={12} color="var(--accent-primary)" />
            <span>{currentMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // LAYOUT 2: SUBTLE (Quiet companion pill for cards / empty states)
  // ---------------------------------------------------------------------------
  if (layout === 'subtle') {
    return (
      <div
        onClick={interactive ? handlePipClick : undefined}
        className={`contextual-pip-subtle ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          padding: '0.5rem 0.85rem',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-pill)',
          border: '1px solid var(--border-subtle)',
          cursor: interactive ? 'pointer' : 'default',
          transition: 'all 0.2s ease',
          ...style
        }}
        title={interactive ? "Tap to interact with Pip 🌱" : undefined}
      >
        <PipSproutAvatar
          size={Math.max(28, Math.round(size * 0.7))}
          mood={currentMood}
          animated={!isReducedMotion}
          animationType={currentAnim}
        />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.35, fontWeight: 500 }}>
          {currentMessage}
        </span>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // LAYOUT 3: BANNER (Full-width supportive card banner)
  // ---------------------------------------------------------------------------
  if (layout === 'banner') {
    return (
      <div
        className={`contextual-pip-banner card-glass ${className}`}
        onClick={interactive ? handlePipClick : undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.15rem',
          padding: '1.1rem 1.35rem',
          background: 'linear-gradient(135deg, var(--bg-glass-card) 0%, var(--accent-primary-light) 100%)',
          border: '1px solid var(--border-glass)',
          cursor: interactive ? 'pointer' : 'default',
          position: 'relative',
          transition: 'all 0.2s ease',
          ...style
        }}
        title={interactive ? "Tap to interact with Pip 🌱" : undefined}
      >
        <div style={{ flexShrink: 0 }}>
          <PipSproutAvatar
            size={size}
            mood={currentMood}
            animated={!isReducedMotion}
            animationType={currentAnim}
          />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
              Pip the Sprout
            </span>
            <span className="pill-badge primary" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
              Companion
            </span>
          </div>

          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            "{currentMessage}"
          </p>
        </div>

        {interactive && (
          <div style={{ opacity: 0.6, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <Sparkles size={13} color="var(--accent-primary)" />
          </div>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // LAYOUT 4: BADGE (Default compact companion pill)
  // ---------------------------------------------------------------------------
  return (
    <div
      className={`contextual-pip-badge card-glass ${className}`}
      onClick={interactive ? handlePipClick : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        padding: '0.65rem 1rem',
        background: 'var(--bg-glass-card)',
        border: isReacting ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
        borderRadius: 'var(--radius-lg)',
        cursor: interactive ? 'pointer' : 'default',
        transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        boxShadow: isReacting ? '0 4px 14px rgba(45, 106, 79, 0.15)' : 'none',
        ...style
      }}
      title={interactive ? "Tap to interact with Pip 🌱" : undefined}
    >
      <div style={{ flexShrink: 0 }}>
        <PipSproutAvatar
          size={size}
          mood={currentMood}
          animated={!isReducedMotion}
          animationType={currentAnim}
        />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.15rem' }}>
          <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
            Pip
          </span>
          <span style={{ fontSize: '0.68rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
            • with you
          </span>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
          {currentMessage}
        </div>
      </div>
    </div>
  );
}
