import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import {
  MessageSquare,
  ThumbsDown,
  X,
  Check,
  Shield,
  Clock,
  Sparkles
} from 'lucide-react';

const DISMISSAL_REASONS = [
  { id: 'not_relevant', label: 'Not relevant to my current routine' },
  { id: 'too_difficult', label: 'Too difficult / overwhelming right now' },
  { id: 'no_time', label: "Don't have time / busy schedule" },
  { id: 'already_doing', label: 'Already doing this regularly' },
  { id: 'not_interested', label: 'Not interested in this category' },
  { id: 'other', label: 'Other reason' }
];

export default function RecommendationFeedbackModal({ recommendation, onClose }) {
  const { submitRecommendationFeedback } = useWellness();
  const [selectedReason, setSelectedReason] = useState('not_relevant');
  const [customNote, setCustomNote] = useState('');

  if (!recommendation) return null;

  const handleSubmit = (feedbackType = 'not_helpful') => {
    submitRecommendationFeedback(recommendation.id, feedbackType, selectedReason);
    onClose();
  };

  const handleNeverShowAgain = () => {
    submitRecommendationFeedback(recommendation.id, 'dont_show', selectedReason);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🌱</span>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Help Us Improve Suggestions</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Suggestion Snippet */}
        <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem 0.95rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', borderLeft: '3px solid var(--accent-primary)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            {recommendation.category} Recommendation
          </span>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', margin: '0.2rem 0 0 0', fontWeight: 600 }}>
            "{recommendation.what}"
          </p>
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          Why wasn't this recommendation helpful? Your feedback helps tailor future ideas without repeating advice.
        </p>

        {/* Reasons Radio / Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
          {DISMISSAL_REASONS.map(r => (
            <label
              key={r.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: selectedReason === r.id ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                border: selectedReason === r.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                fontSize: '0.82rem',
                fontWeight: selectedReason === r.id ? 700 : 500,
                color: selectedReason === r.id ? 'var(--accent-primary)' : 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              <input
                type="radio"
                name="dismiss_reason"
                value={r.id}
                checked={selectedReason === r.id}
                onChange={() => setSelectedReason(r.id)}
                style={{ accentColor: 'var(--accent-primary)' }}
              />
              {r.label}
            </label>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            onClick={() => handleSubmit('not_helpful')}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem' }}
          >
            Submit Feedback & Dismiss
          </button>
          <button
            onClick={handleNeverShowAgain}
            className="btn btn-secondary"
            style={{ width: '100%', padding: '0.65rem', fontSize: '0.78rem', color: 'var(--accent-rose)' }}
          >
            Don't Show This Type of Recommendation Again
          </button>
        </div>
      </div>
    </div>
  );
}
