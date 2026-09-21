import React from 'react';

/**
 * EmptyState (Section 2.8)
 * One friendly line + one action.
 */
export default function EmptyState({
  icon = '🌱',
  message,
  actionLabel,
  onAction,
  className = '',
  style = {}
}) {
  return (
    <div
      className={`empty-state-compact ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-tertiary)',
        border: '1px dashed var(--border-subtle)',
        ...style
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0, flex: 1 }}>
        {typeof icon === 'string' ? (
          <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{icon}</span>
        ) : (
          React.createElement(icon, { size: 18, color: 'var(--text-muted)', style: { flexShrink: 0 } })
        )}
        <p
          style={{
            margin: 0,
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {message}
        </p>
      </div>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="btn-soft"
          style={{
            padding: '0.35rem 0.75rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            cursor: 'pointer',
            flexShrink: 0,
            minHeight: '36px'
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
