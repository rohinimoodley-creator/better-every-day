import React from 'react';

/**
 * SectionHeader (Section 2.4)
 * Page title on one line (20sp) with one optional emoji, plus a one-line muted caption (ellipsize).
 * No eyebrow chips or tracked-out uppercase tags.
 */
export default function SectionHeader({
  title,
  emoji,
  caption,
  action,
  className = '',
  style = {}
}) {
  return (
    <div
      className={`section-header-compact ${className}`}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '0.75rem',
        marginBottom: '0.75rem',
        ...style
      }}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            lineHeight: 1.25,
            color: 'var(--text-primary)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {title}
          {emoji && <span aria-hidden="true" style={{ fontSize: '1.15rem' }}>{emoji}</span>}
        </h2>
        {caption && (
          <p
            style={{
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
              margin: '0.15rem 0 0 0',
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {caption}
          </p>
        )}
      </div>

      {action && (
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          {action}
        </div>
      )}
    </div>
  );
}
