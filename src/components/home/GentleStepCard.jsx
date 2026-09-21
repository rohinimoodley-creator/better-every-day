import React from 'react';
import { Sparkles, X, ChevronRight, Droplet, Footprints, Moon, Utensils, Heart } from 'lucide-react';

const HUB_ICONS = {
  hydrate: Droplet,
  move: Footprints,
  rest: Moon,
  nourish: Utensils,
  skincare: Sparkles,
  cycle: Heart
};

export default function GentleStepCard({
  suggestion,
  onAction,
  onDismiss,
  className = '',
  style = {}
}) {
  if (!suggestion) return null;

  const Icon = HUB_ICONS[suggestion.hubId] || Sparkles;

  return (
    <div
      className={`card-compact gentle-step-card ${className}`}
      style={{
        background: 'linear-gradient(135deg, var(--bg-glass-card) 0%, var(--accent-primary-light) 100%)',
        border: '1px solid var(--border-glass)',
        borderLeft: '3.5px solid var(--accent-primary)',
        padding: '0.65rem 0.85rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        minHeight: '68px',
        boxSizing: 'border-box',
        ...style
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0, flex: 1 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'var(--accent-primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(45, 106, 79, 0.25)'
          }}
        >
          <Icon size={16} />
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Today's Gentle Step
            </span>
          </div>

          <p
            style={{
              margin: '0.1rem 0 0 0',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1.25,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {suggestion.text || suggestion.title}
          </p>

          {suggestion.why && (
            <span
              style={{
                display: 'block',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginTop: '0.05rem'
              }}
            >
              {suggestion.why}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
        {suggestion.actionLabel && (
          <button
            type="button"
            onClick={() => onAction && onAction(suggestion)}
            className="btn-soft"
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem',
              minHeight: '36px'
            }}
          >
            <span>{suggestion.actionLabel}</span>
            <ChevronRight size={12} />
          </button>
        )}

        {onDismiss && (
          <button
            type="button"
            onClick={() => onDismiss(suggestion.id)}
            aria-label="Dismiss suggestion"
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
            title="Dismiss"
          >
            <X size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
