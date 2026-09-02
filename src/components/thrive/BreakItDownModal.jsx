import React, { useState } from 'react';
import { X, Sparkles, CheckCircle, ArrowRight, ListPlus } from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_BREAKDOWNS = {
  dinner: {
    title: 'Prepare Healthy Dinner',
    icon: '🥗',
    quick: [
      { id: '1', text: 'Pick a simple 15-minute recipe' },
      { id: '2', text: 'Cook the main protein & greens' },
      { id: '3', text: 'Enjoy dinner sitting down' }
    ],
    moderate: [
      { id: '1', text: 'Choose recipe or reheat wholesome leftovers' },
      { id: '2', text: 'Gather ingredients on the kitchen counter' },
      { id: '3', text: 'Chop veggies & prep ingredients' },
      { id: '4', text: 'Cook on stove/oven' },
      { id: '5', text: 'Plate meal, eat unhurried, and quick wipe down' }
    ],
    detailed: [
      { id: '1', text: 'Drink a glass of water before starting' },
      { id: '2', text: 'Select recipe with 5 or fewer ingredients' },
      { id: '3', text: 'Put cutting board and knife out' },
      { id: '4', text: 'Take produce & protein from the fridge' },
      { id: '5', text: 'Chop and season ingredients' },
      { id: '6', text: 'Cook food while listening to calm music' },
      { id: '7', text: 'Enjoy meal & soak pans in warm water' }
    ]
  },
  workout: {
    title: 'Start Movement Routine',
    icon: '🏃',
    quick: [
      { id: '1', text: 'Put on walking shoes' },
      { id: '2', text: 'Do 5 minutes of movement' },
      { id: '3', text: 'Drink a glass of water' }
    ],
    moderate: [
      { id: '1', text: 'Change into comfortable clothes' },
      { id: '2', text: 'Put on shoes & fill water bottle' },
      { id: '3', text: 'Do 2 minutes of gentle joint mobility' },
      { id: '4', text: 'Complete your chosen 10-15m session' },
      { id: '5', text: '1 minute cooldown & deep breath' }
    ],
    detailed: [
      { id: '1', text: 'Put on favorite movement outfit' },
      { id: '2', text: 'Pick an upbeat or calming audio track' },
      { id: '3', text: 'Place water bottle nearby' },
      { id: '4', text: 'Do 5 slow ankle rolls & shoulder rolls' },
      { id: '5', text: 'Step 1 of movement flow' },
      { id: '6', text: 'Step 2 & peak effort' },
      { id: '7', text: 'Hydrate and celebrate showing up' }
    ]
  },
  winddown: {
    title: 'Evening Calm & Sleep Prep',
    icon: '🌙',
    quick: [
      { id: '1', text: 'Dim overhead lights' },
      { id: '2', text: 'Write 1 sentence gratitude' },
      { id: '3', text: 'Get into bed 15m early' }
    ],
    moderate: [
      { id: '1', text: 'Turn off work notifications' },
      { id: '2', text: 'Brew chamomile or mint tea' },
      { id: '3', text: 'Wash face and brush teeth' },
      { id: '4', text: 'Open journal for 3 minutes' },
      { id: '5', text: 'Start sleep sounds or breathing' }
    ],
    detailed: [
      { id: '1', text: 'Put phone to charge across the room' },
      { id: '2', text: 'Switch to warm amber or candlelight' },
      { id: '3', text: 'Prepare a warm soothing herbal tea' },
      { id: '4', text: 'Night skincare / hygiene routine' },
      { id: '5', text: 'Write down tomorrow’s top priority to clear mind' },
      { id: '6', text: 'Do 3 gentle bed stretches' },
      { id: '7', text: '4-7-8 breathing until drifting off' }
    ]
  }
};

export default function BreakItDownModal({ isOpen, onClose, initialTask = 'dinner' }) {
  const [selectedTaskKey, setSelectedTaskKey] = useState(initialTask);
  const [depth, setDepth] = useState('moderate'); // 'quick' | 'moderate' | 'detailed'
  const [completedStepIds, setCompletedStepIds] = useState([]);

  if (!isOpen) return null;

  const currentTask = SAMPLE_BREAKDOWNS[selectedTaskKey] || SAMPLE_BREAKDOWNS.dinner;
  const steps = currentTask[depth] || currentTask.moderate;

  const toggleStep = (id) => {
    setCompletedStepIds(prev => {
      const next = prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id];
      if (next.length === steps.length) {
        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch(e) {}
      }
      return next;
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <span className="pill-badge primary" style={{ marginBottom: '0.25rem' }}>
              <ListPlus size={12} /> Executive Function Tool
            </span>
            <h3 style={{ fontSize: '1.3rem' }}>Break It Down 🧩</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          When a task feels too big, breaking it into micro-actions eliminates hesitation.
        </p>

        {/* Task Selection Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {Object.entries(SAMPLE_BREAKDOWNS).map(([key, task]) => (
            <button
              key={key}
              onClick={() => { setSelectedTaskKey(key); setCompletedStepIds([]); }}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-pill)',
                border: selectedTaskKey === key ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                background: selectedTaskKey === key ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                color: selectedTaskKey === key ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {task.icon} {task.title}
            </button>
          ))}
        </div>

        {/* Depth Level Selector */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', background: 'var(--bg-tertiary)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Breakdown Detail:</span>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            {[
              { id: 'quick', label: 'Quick (3 steps)' },
              { id: 'moderate', label: 'Moderate (5 steps)' },
              { id: 'detailed', label: 'Detailed (7 steps)' }
            ].map(d => (
              <button
                key={d.id}
                onClick={() => { setDepth(d.id); setCompletedStepIds([]); }}
                style={{
                  border: 'none',
                  background: depth === d.id ? 'var(--bg-secondary)' : 'transparent',
                  color: depth === d.id ? 'var(--accent-primary)' : 'var(--text-muted)',
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: depth === d.id ? 'var(--shadow-sm)' : 'none'
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Micro-Steps Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {steps.map((step, idx) => {
            const isDone = completedStepIds.includes(step.id);
            return (
              <div
                key={step.id}
                onClick={() => toggleStep(step.id)}
                style={{
                  background: isDone ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                  border: `1px solid ${isDone ? 'var(--accent-primary)' : 'var(--border-glass)'}`,
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div 
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    border: `2px solid ${isDone ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    background: isDone ? 'var(--accent-primary)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    flexShrink: 0
                  }}
                >
                  {isDone && <CheckCircle size={14} />}
                </div>

                <div style={{ flex: 1, fontSize: '0.88rem', color: isDone ? 'var(--accent-primary)' : 'var(--text-primary)', textDecoration: isDone ? 'line-through' : 'none', fontWeight: isDone ? 600 : 500 }}>
                  <span style={{ color: 'var(--text-muted)', marginRight: '0.4rem', textDecoration: 'none' }}>{idx + 1}.</span>
                  {step.text}
                </div>
              </div>
            );
          })}
        </div>

        <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
          {completedStepIds.length === steps.length ? '🎉 All Micro-Steps Complete!' : 'Close Break It Down'}
        </button>
      </div>
    </div>
  );
}
