import React from 'react';
import { BookOpen, Palette, Calendar, Gift, Sparkles, Printer } from 'lucide-react';

export default function EcosystemPreview() {
  const ecosystemItems = [
    {
      id: 'eco_1',
      title: 'Physical Wellness Binder & Daily Sheets',
      category: 'Printable Stationery',
      icon: '📖',
      desc: 'High-resolution printable 90-day daily check-in sheets and dot-grid habit reflection logs designed to fit standard A5/Letter binders.',
      badge: 'Print Ready'
    },
    {
      id: 'eco_2',
      title: 'Pip the Sprout Mindfulness Coloring Book',
      category: 'Art Therapy',
      icon: '🎨',
      desc: 'Relaxing line-art illustrations featuring Pip exploring cozy tea houses, botanical gardens, and tranquil starry nights.',
      badge: 'Companion Book'
    },
    {
      id: 'eco_3',
      title: 'Companion Cycle & Habit Desk Planner',
      category: 'Physical Planner',
      icon: '📅',
      desc: 'Soft-touch undated physical desk planner structured around the 4 phases and consistency-over-perfection scoring.',
      badge: 'Desk Companion'
    },
    {
      id: 'eco_4',
      title: 'Mascot Plushies, Enamel Pins & Sticker Packs',
      category: 'Wellness Merch',
      icon: '🌱',
      desc: 'Tactile tactile reminders of your daily self-care journey: Pip flower crown plushies and matte water bottle vinyl stickers.',
      badge: 'Merchandise'
    }
  ];

  return (
    <div className="card-glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <div>
          <span className="pill-badge orange" style={{ marginBottom: '0.25rem' }}>
            <Sparkles size={12} /> Physical Products & Extensions
          </span>
          <h3 style={{ fontSize: '1.3rem' }}>Future Wellness Ecosystem</h3>
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
        Better Every Day translates seamlessly into physical tactile journals, habit planners, printable challenge cards, and delightful mascot companions.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.85rem' }}>
        {ecosystemItems.map(item => (
          <div
            key={item.id}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.15rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                <span className="pill-badge primary" style={{ fontSize: '0.68rem' }}>
                  {item.badge}
                </span>
              </div>

              <h4 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>{item.title}</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                {item.desc}
              </p>
            </div>

            <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Category: {item.category}</span>
              <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>Preview</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
