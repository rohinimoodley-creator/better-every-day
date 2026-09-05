// Body Translator Engine
// Decodes cravings and sensations into physiological, emotional, habit, and gentle nutritional considerations.
// Uses non-diagnostic, respectful phrasing at all times.

import { CRAVINGS_DATABASE } from '../data/mockData';

export function lookupCraving(query) {
  if (!query) return null;
  const q = query.toLowerCase().trim();
  
  // 1. Check exact/substring match in database
  const match = CRAVINGS_DATABASE.find(item => 
    item.name.toLowerCase().includes(q) || 
    q.includes(item.name.toLowerCase()) ||
    item.id.toLowerCase().includes(q) ||
    item.category.toLowerCase().includes(q)
  );

  if (match) return match;

  // 2. Intelligent semantic interpretations for common body signals
  if (q.includes('bloat') || q.includes('stomach') || q.includes('digest') || q.includes('full') || q.includes('uncomfortable')) {
    return {
      id: 'signal_bloat',
      name: 'Stomach Fullness or Bloating',
      icon: '🌿',
      category: 'digestion',
      bodySignals: [
        { type: 'Digestion Rhythm', desc: 'Could indicate eating quickly, carbonated drinks, or high sodium intake.' },
        { type: 'Gentle Motility', desc: 'A short 5–10 minute slow stroll can stimulate digestive motility and relieve pressure.' },
        { type: 'Mindset & Posture', desc: 'Sitting upright and taking slow diaphragm breaths gives your abdomen room to relax.' }
      ],
      healthyOptions: [
        { name: 'Warm Peppermint or Ginger Tea', tip: 'Naturally relaxes digestive tract smooth muscles and eases trapped gas.' },
        { name: '5-Minute Post-Meal Stroll', tip: 'Gentle walking helps accelerate gastric emptying and eases bloating.' }
      ]
    };
  }

  if (q.includes('headache') || q.includes('head') || q.includes('migraine')) {
    return {
      id: 'signal_headache',
      name: 'Head Tension or Headache',
      icon: '💆',
      category: 'hydration_rest',
      bodySignals: [
        { type: 'Hydration Check', desc: 'Mild dehydration is the most common hidden driver of midday head tension.' },
        { type: 'Screen & Posture Strain', desc: 'Prolonged focus without blinking causes suboccipital neck stiffness.' },
        { type: 'Blood Sugar Pacing', desc: 'A long gap between meals can cause a dip in steady blood glucose.' }
      ],
      healthyOptions: [
        { name: 'Large Glass of Water with a Pinch of Electrolytes / Lemon', tip: 'Rehydrates cellular fluids quickly.' },
        { name: '20-Second Eye & Neck Reset', tip: 'Look into the distance, soften jaw muscles, and gently roll shoulders down.' }
      ]
    };
  }

  if (q.includes('hungry') || q.includes('hunger') || q.includes('starv') || q.includes('famished') || q.includes('appetite')) {
    return {
      id: 'signal_hunger',
      name: 'Unusually Hungry / Quick Appetite',
      icon: '🥑',
      category: 'energy',
      bodySignals: [
        { type: 'Protein & Fibre Balance', desc: 'Your previous meal might have been light on stabilizing proteins or healthy fats.' },
        { type: 'Active Recovery', desc: 'Increased daily movement or a busy day raises your metabolic fuel requirement.' },
        { type: 'Cycle & Hormonal Rhythm', desc: 'During the luteal cycle phase, metabolic rate naturally increases by 100–300 kcal/day.' }
      ],
      healthyOptions: [
        { name: 'Balanced Protein + Complex Carb Snack', tip: 'Apple slices with almond butter, or hummus with seeded crackers.' },
        { name: 'Hearty Whole-Food Meal', tip: 'Honor real hunger with a nourishing plate containing protein, greens, and complex grains.' }
      ]
    };
  }

  if (q.includes('tired') || q.includes('fatigue') || q.includes('sluggish') || q.includes('exhaust')) {
    return {
      id: 'signal_tired',
      name: 'Midday Sluggishness & Low Energy',
      icon: '🔋',
      category: 'rest',
      bodySignals: [
        { type: 'Circadian Dip', desc: 'Natural early-afternoon body temperature drop triggers biological drowsiness.' },
        { type: 'Hydration & Fresh Air', desc: 'Stale indoor air or low fluid levels amplify feelings of physical heaviness.' },
        { type: 'Rest Need', desc: 'Your nervous system may be requesting a 5-minute quiet sensory pause rather than sugar.' }
      ],
      healthyOptions: [
        { name: 'Cold Water + 3 Deep Diaphragmatic Breaths', tip: 'Instantly increases oxygen delivery and wakes up the autonomic nervous system.' },
        { name: 'Step into Natural Daylight for 3 Minutes', tip: 'Suppresses daytime melatonin and restores natural alertness.' }
      ]
    };
  }

  // 3. Generic fallback
  return {
    id: 'custom_signal_' + Date.now(),
    name: query,
    icon: '🧭',
    category: 'custom',
    bodySignals: [
      { type: 'Physiological Check', desc: 'Could signal a need for steady hydration, nutrient balance, or physical position reset.' },
      { type: 'Mindset & Rhythm', desc: 'Notice if prolonged sitting, emotional stress, or fatigue is influencing this sensation.' },
      { type: 'Gentle Care', desc: 'Honor what your body is experiencing with compassion and zero guilt.' }
    ],
    healthyOptions: [
      { name: 'Sip Water & Pause Mindfully', tip: 'Drink a glass of water first and check in with your breath.' },
      { name: 'Nourish with Whole Foods', tip: 'Choose a satisfying snack with natural ingredients that support sustained energy.' }
    ]
  };
}
