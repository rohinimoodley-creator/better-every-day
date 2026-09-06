import React, { useState, useEffect } from 'react';
import MoveHub from '../move/MoveHub';
import NourishHub from '../nourish/NourishHub';
import HydrateHub from '../hydrate/HydrateHub';
import RestHub from './rest/RestHub';
import MindHub from '../mind/MindHub';
import BreathworkHub from './breathwork/BreathworkHub';
import CycleHub from './cycle/CycleHub';
import SoundscapesHub from './soundscapes/SoundscapesHub';
import WellnessCalendar from './calendar/WellnessCalendar';
import { useWellness } from '../../context/WellnessContext';
import {
  Footprints,
  Utensils,
  Droplet,
  Moon,
  Sparkles,
  Wind,
  Heart,
  Calendar as CalendarIcon,
  Volume2,
  Compass
} from 'lucide-react';

export const WELLNESS_CATEGORIES = [
  { id: 'move', label: 'Move', icon: Footprints, desc: 'Workouts & Steps', color: '#3a86c8' },
  { id: 'nourish', label: 'Nourish', icon: Utensils, desc: 'Meals & Recipes', color: '#d97736' },
  { id: 'hydrate', label: 'Hydrate', icon: Droplet, desc: 'Water & Rhythms', color: '#3a86c8' },
  { id: 'rest', label: 'Rest', icon: Moon, desc: 'Sleep & Night Recovery', color: '#7b61ff' },
  { id: 'soundscapes', label: 'Soundscapes', icon: Volume2, desc: 'Ambient Calm & Sleep Audio', color: '#7b61ff' },
  { id: 'mind', label: 'Mind', icon: Sparkles, desc: 'Gratitude & Mindset', color: '#8b5cf6' },
  { id: 'breathwork', label: 'Breathwork', icon: Wind, desc: 'Guided Regulation', color: '#40916c' },
  { id: 'cycle', label: 'Cycle', icon: Heart, desc: 'Hormone Sync', color: '#d64062' },
  { id: 'calendar', label: 'Calendar', icon: CalendarIcon, desc: 'Life & Rhythm', color: '#40916c' }
];

export default function WellnessHub({ initialCategory = 'move', onNavigateTab }) {
  const { wellnessHubVisibility } = useWellness();
  const [activeCategory, setActiveCategory] = useState(initialCategory || 'move');

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  const visibleCategories = WELLNESS_CATEGORIES.filter(cat => {
    if (!wellnessHubVisibility) return true;
    return wellnessHubVisibility[cat.id] !== false;
  });

  useEffect(() => {
    // If activeCategory is not in visibleCategories, fallback to first visible category
    if (visibleCategories.length > 0 && !visibleCategories.some(c => c.id === activeCategory)) {
      setActiveCategory(visibleCategories[0].id);
    }
  }, [visibleCategories, activeCategory]);

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
      
      {/* Category Bar Header */}
      <div 
        className="card-glass"
        style={{
          padding: '0.85rem 1.1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="pill-badge primary" style={{ fontSize: '0.72rem' }}>
              <Compass size={12} /> Wellness Categories
            </span>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Explore Hubs & Features
            </span>
          </div>

          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {WELLNESS_CATEGORIES.find(c => c.id === activeCategory)?.desc}
          </span>
        </div>

        {/* Scrollable Horizontal Category Pills */}
        <div 
          style={{
            display: 'flex',
            gap: '0.45rem',
            overflowX: 'auto',
            paddingBottom: '0.2rem',
            scrollbarWidth: 'none'
          }}
        >
          {visibleCategories.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                id={`wellness-cat-${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.5rem 0.9rem',
                  borderRadius: 'var(--radius-pill)',
                  border: isActive ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  background: isActive 
                    ? 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-calm) 100%)' 
                    : 'var(--bg-secondary)',
                  color: isActive ? '#ffffff' : 'var(--text-primary)',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 3px 10px rgba(45, 106, 79, 0.25)' : 'none',
                  transition: 'all 0.15s ease',
                  flexShrink: 0
                }}
              >
                <Icon size={16} color={isActive ? '#ffffff' : cat.color} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Category Content */}
      <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
        {activeCategory === 'move' && <MoveHub />}
        {activeCategory === 'nourish' && <NourishHub />}
        {activeCategory === 'hydrate' && <HydrateHub />}
        {activeCategory === 'rest' && <RestHub onNavigateTab={cat => setActiveCategory(cat.toLowerCase())} />}
        {activeCategory === 'soundscapes' && <SoundscapesHub />}
        {activeCategory === 'mind' && <MindHub />}
        {activeCategory === 'breathwork' && <BreathworkHub onNavigateTab={onNavigateTab} />}
        {activeCategory === 'cycle' && <CycleHub onNavigateTab={onNavigateTab} />}
        {activeCategory === 'calendar' && <WellnessCalendar onNavigateTab={onNavigateTab} />}
      </div>

    </div>
  );
}

