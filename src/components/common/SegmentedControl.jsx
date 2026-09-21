import React, { useRef, useEffect } from 'react';

/**
 * SegmentedControl (Section 2.5)
 * - Single-line labels, no clipping, no scroll-bar pill.
 * - Scrollable when there are more than 4 items or narrow screen.
 * - Selected tab auto-scrolls into view.
 * - Pill count badges.
 * - Variant: 'capsule' (default elevated/filled) or 'underline' (lighter second-level style).
 */
export default function SegmentedControl({
  options = [], // [{ id, label, icon: Icon, badge, ariaLabel }]
  value,
  onChange,
  variant = 'capsule', // 'capsule' | 'underline' | 'chips'
  size = 'md', // 'sm' | 'md'
  fullWidth = false,
  className = '',
  style = {}
}) {
  const containerRef = useRef(null);
  const activeBtnRef = useRef(null);

  useEffect(() => {
    if (activeBtnRef.current && containerRef.current) {
      activeBtnRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [value]);

  const isUnderline = variant === 'underline';

  return (
    <div
      ref={containerRef}
      role="tablist"
      className={`segmented-control-container hide-scrollbar ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: isUnderline ? '1rem' : '0.25rem',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        padding: isUnderline ? '0 0.25rem 0.25rem' : '0.25rem',
        borderRadius: isUnderline ? 0 : 'var(--radius-pill)',
        background: isUnderline ? 'transparent' : 'var(--bg-tertiary)',
        border: isUnderline ? 'none' : '1px solid var(--border-subtle)',
        borderBottom: isUnderline ? '1px solid var(--border-subtle)' : undefined,
        width: fullWidth ? '100%' : 'max-content',
        maxWidth: '100%',
        ...style
      }}
    >
      {options.map((opt) => {
        const isSelected = opt.id === value;
        const Icon = opt.icon;

        if (isUnderline) {
          return (
            <button
              key={opt.id}
              ref={isSelected ? activeBtnRef : null}
              role="tab"
              aria-selected={isSelected}
              aria-label={opt.ariaLabel || opt.label}
              onClick={() => onChange(opt.id)}
              className="segment-tab-underline"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: size === 'sm' ? '0.4rem 0.6rem' : '0.55rem 0.85rem',
                border: 'none',
                background: 'transparent',
                color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)',
                fontWeight: isSelected ? 700 : 500,
                fontSize: size === 'sm' ? '0.8rem' : '0.875rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                position: 'relative',
                minHeight: '44px',
                transition: 'color var(--transition-fast)'
              }}
            >
              {Icon && <Icon size={size === 'sm' ? 14 : 16} strokeWidth={isSelected ? 2.5 : 2} />}
              <span>{opt.label}</span>
              {opt.badge !== undefined && opt.badge !== null && (
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '0.1rem 0.45rem',
                    borderRadius: 'var(--radius-pill)',
                    background: isSelected ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                    color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)'
                  }}
                >
                  {opt.badge}
                </span>
              )}
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: -1,
                    left: 0,
                    right: 0,
                    height: '2.5px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--accent-primary)'
                  }}
                />
              )}
            </button>
          );
        }

        // Capsule style (Default)
        return (
          <button
            key={opt.id}
            ref={isSelected ? activeBtnRef : null}
            role="tab"
            aria-selected={isSelected}
            aria-label={opt.ariaLabel || opt.label}
            onClick={() => onChange(opt.id)}
            className={`segment-btn-capsule ${isSelected ? 'active' : ''}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              padding: size === 'sm' ? '0.35rem 0.75rem' : '0.45rem 1rem',
              minHeight: '38px',
              borderRadius: 'var(--radius-pill)',
              border: isSelected ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
              background: isSelected ? 'var(--bg-secondary)' : 'transparent',
              color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: isSelected ? 700 : 500,
              fontSize: size === 'sm' ? '0.8rem' : '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flex: fullWidth ? 1 : 'none',
              boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            {Icon && <Icon size={size === 'sm' ? 14 : 16} strokeWidth={isSelected ? 2.5 : 2} />}
            <span>{opt.label}</span>
            {opt.badge !== undefined && opt.badge !== null && (
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.45rem',
                  borderRadius: 'var(--radius-pill)',
                  background: isSelected ? 'var(--accent-primary-light)' : 'rgba(0,0,0,0.06)',
                  color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)'
                }}
              >
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
