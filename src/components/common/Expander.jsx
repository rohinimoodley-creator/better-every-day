import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Expander (Section 2.6)
 * Clamps long text to maxLines (default 3), with a clean "More / Less" inline action.
 * Ensures full text, explanations, and disclaimers are always reachable.
 */
export default function Expander({
  children,
  text,
  maxLines = 3,
  moreLabel = 'More',
  lessLabel = 'Less',
  className = '',
  style = {}
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const content = text || children;

  return (
    <div className={`expander-container ${className}`} style={{ ...style }}>
      <div
        style={{
          display: isExpanded ? 'block' : '-webkit-box',
          WebkitLineClamp: isExpanded ? 'none' : maxLines,
          WebkitBoxOrient: 'vertical',
          overflow: isExpanded ? 'visible' : 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: 1.45
        }}
      >
        {content}
      </div>

      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.2rem',
          marginTop: '0.25rem',
          padding: '0.2rem 0',
          background: 'none',
          border: 'none',
          color: 'var(--accent-primary)',
          fontSize: '0.8125rem',
          fontWeight: 600,
          cursor: 'pointer',
          minHeight: '32px'
        }}
        aria-expanded={isExpanded}
      >
        <span>{isExpanded ? lessLabel : moreLabel}</span>
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
    </div>
  );
}
