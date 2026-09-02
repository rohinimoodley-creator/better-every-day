// Body Translator Engine
// Decodes cravings into physiological, emotional, habit, and gentle nutritional considerations.
// Uses non-diagnostic, respectful phrasing at all times.

import { CRAVINGS_DATABASE } from '../data/mockData';

export function lookupCraving(query) {
  if (!query) return null;
  const q = query.toLowerCase().trim();
  
  const match = CRAVINGS_DATABASE.find(item => 
    item.name.toLowerCase().includes(q) || 
    item.id.toLowerCase().includes(q) ||
    item.category.toLowerCase().includes(q)
  );

  if (match) return match;

  // Generic fallback if unknown craving
  return {
    id: 'custom_craving',
    name: query,
    icon: '🍽️',
    category: 'custom',
    bodySignals: [
      { type: 'Hunger Check', desc: 'When was your last balanced meal containing protein and fibre?' },
      { type: 'Emotional / Stress', desc: 'Are you feeling overwhelmed, bored, or seeking a soothing sensory pause?' },
      { type: 'Nutritional Consideration', desc: 'One possible nutritional consideration is overall caloric or hydration balance throughout the afternoon.' }
    ],
    healthyOptions: [
      { name: 'Tall Glass of Water + Handful of Mixed Nuts', tip: 'Satisfies cellular hydration and provides steady fats and minerals.' },
      { name: 'Fresh Fruit with Greek Yogurt or Seed Butter', tip: 'Delivers natural sweetness paired with stabilizing protein.' }
    ]
  };
}
