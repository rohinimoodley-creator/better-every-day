import React, { useRef, useEffect } from 'react';
import {
  Footprints,
  Utensils,
  Droplet,
  Moon,
  Sparkles,
  Wind,
  Heart,
  Calendar as CalendarIcon,
  Music
} from 'lucide-react';
import { useWellness } from '../../context/WellnessContext';

export const ALL_WELLNESS_CATEGORIES = [
  { id: 'move', label: 'Move', icon: Footprints, emoji: '🏃' },
  { id: 'nourish', label: 'Nourish', icon: Utensils, emoji: '🥗' },
  { id: 'hydrate', label: 'Hydrate', icon: Droplet, emoji: '💧' },
  { id: 'rest', label: 'Rest', icon: Moon, emoji: '🌙' },
  { id: 'skincare', label: 'Skincare', icon: Sparkles, emoji: '✨' },
  { id: 'mind', label: 'Mind', icon: Sparkles, emoji: '🧘' },
  { id: 'breathwork', label: 'Breathwork', icon: Wind, emoji: '🌬️' },
  { id: 'soundscapes', label: 'Soundscapes', icon: Music, emoji: '🎵' },
  { id: 'cycle', label: 'Cycle', icon: Heart, emoji: '🌸' },
  { id: 'calendar', label: 'Calendar', icon: CalendarIcon, emoji: '📅' }
];

export default function WellnessCategoryChips({
  activeCategory,
  onSelectCategory,
  className = '',
  style = {}
}) {
  const { wellnessHubVisibility = {} } = useWellness();
  const containerRef = useRef(null);
  const activeBtnRef = useRef(null);

  // Filter only enabled hubs
  const visibleCategories = ALL_WELLNESS_CATEGORIES.filter((cat) => {
    return wellnessHubVisibility[cat.id] !== false;
  });

  useEffect(() => {
    if (activeBtnRef.current && containerRef.current) {
      activeBtnRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [activeCategory]);

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label="Wellness Categories"
      className={`wellness-category-chips-row hide-scrollbar ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        padding: '0.2rem 0.2rem 0.6rem',
        margin: '0 -0.2rem 0.75rem',
        ...style
      }}
    >
      {visibleCategories.map((cat) => {
        const isSelected = activeCategory === cat.id;
        const Icon = cat.icon;

        return (
          <button
            key={cat.id}
            ref={isSelected ? activeBtnRef : null}
            role="tab"
            aria-selected={isSelected}
            aria-label={`${cat.label} Hub`}
            onClick={() => onSelectCategory(cat.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.9rem',
              minHeight: '44px',
              borderRadius: 'var(--radius-pill)',
              border: isSelected
                ? '1px solid var(--accent-primary)'
                : '1px solid var(--border-subtle)',
              background: isSelected
                ? 'var(--accent-primary)'
                : 'var(--bg-secondary)',
              color: isSelected ? '#ffffff' : 'var(--text-primary)',
              fontWeight: isSelected ? 700 : 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              boxShadow: isSelected
                ? '0 3px 10px rgba(45, 106, 79, 0.25)'
                : 'var(--shadow-sm)',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Icon size={16} strokeWidth={isSelected ? 2.5 : 2} color={isSelected ? '#ffffff' : 'var(--accent-primary)'} />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
