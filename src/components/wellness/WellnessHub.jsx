import React, { useState, useEffect } from 'react';
import WellnessCategoryChips, { ALL_WELLNESS_CATEGORIES } from './WellnessCategoryChips';
export const WELLNESS_CATEGORIES = ALL_WELLNESS_CATEGORIES;
import MoveHub from '../move/MoveHub';
import NourishHub from '../nourish/NourishHub';
import HydrateHub from '../hydrate/HydrateHub';
import RestHub from './rest/RestHub';
import MindHub from '../mind/MindHub';
import BreathworkHub from './breathwork/BreathworkHub';
import CycleHub from './cycle/CycleHub';
import SoundscapesHub from './soundscapes/SoundscapesHub';
import WellnessCalendar from './calendar/WellnessCalendar';
import SkincareHub from './skincare/SkincareHub';
import { useWellness } from '../../context/WellnessContext';

export default function WellnessHub({ initialCategory = 'move', onNavigateTab }) {
  const { wellnessHubVisibility } = useWellness();
  const [activeCategory, setActiveCategory] = useState(initialCategory || 'move');

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  const visibleCategories = ALL_WELLNESS_CATEGORIES.filter((cat) => {
    if (!wellnessHubVisibility) return true;
    return wellnessHubVisibility[cat.id] !== false;
  });

  useEffect(() => {
    if (visibleCategories.length > 0 && !visibleCategories.some((c) => c.id === activeCategory)) {
      setActiveCategory(visibleCategories[0].id);
    }
  }, [visibleCategories, activeCategory]);

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Horizontally Scrollable Category Chips (Section 2.3) */}
      <WellnessCategoryChips
        activeCategory={activeCategory}
        onSelectCategory={(catId) => setActiveCategory(catId)}
      />

      {/* Active Category Content */}
      <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
        {activeCategory === 'move' && <MoveHub />}
        {activeCategory === 'nourish' && <NourishHub />}
        {activeCategory === 'hydrate' && <HydrateHub />}
        {activeCategory === 'rest' && <RestHub onNavigateTab={(cat) => setActiveCategory(cat.toLowerCase())} />}
        {activeCategory === 'skincare' && <SkincareHub />}
        {activeCategory === 'soundscapes' && <SoundscapesHub />}
        {activeCategory === 'mind' && <MindHub />}
        {activeCategory === 'breathwork' && <BreathworkHub onNavigateTab={onNavigateTab} />}
        {activeCategory === 'cycle' && <CycleHub onNavigateTab={onNavigateTab} />}
        {activeCategory === 'calendar' && <WellnessCalendar onNavigateTab={onNavigateTab} />}
      </div>
    </div>
  );
}
