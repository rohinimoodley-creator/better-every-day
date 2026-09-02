// Personalization Engine for Better Every Day
// Combines user inputs (Mood, Energy, Stress, Sleep, Body tags, Goals, Cycle Phase, How I Thrive preferences)
// to generate prioritized recommendations, achievable Small Steps, and adaptive Mascot messaging.
// Strictly non-medical, gentle, and consistency-focused.

import { getCyclePhaseInfo } from './cycleEngine';

export const SMALL_STEPS_POOL = [
  { id: 'water_glass', text: 'Drink one tall glass of water before your next task.', category: 'Hydration', icon: '💧', duration: '1 min' },
  { id: 'walk_5min', text: 'Step outside for a 5-minute fresh air stroll.', category: 'Move', icon: '👟', duration: '5 min' },
  { id: 'stretch_2min', text: 'Do 2 minutes of gentle shoulder rolls and neck stretches.', category: 'Move', icon: '🧘', duration: '2 min' },
  { id: 'veg_serving', text: 'Add one handful of leafy greens or raw veggies to your next meal.', category: 'Nourish', icon: '🥗', duration: '3 min' },
  { id: 'gratitude_3', text: 'Write down 3 tiny things that made you smile today.', category: 'Mind', icon: '✨', duration: '2 min' },
  { id: 'screen_break', text: 'Take 5 minutes away from all screens and look out a window.', category: 'Mind', icon: '🌿', duration: '5 min' },
  { id: 'breathing_box', text: 'Complete 4 cycles of soothing Box Breathing.', category: 'Mind', icon: '🌬️', duration: '2 min' },
  { id: 'bed_early', text: 'Turn off overhead lights 20 minutes earlier tonight.', category: 'Sleep', icon: '🌙', duration: 'Night' }
];

export const LOW_ENERGY_STEPS = [
  { id: 'le_water', text: 'Sip half a glass of warm water or tea.', category: 'Hydration', icon: '🍵', duration: '1 min' },
  { id: 'le_breath', text: 'Take 3 deep, slow breaths in a comfortable chair.', category: 'Mind', icon: '🌬️', duration: '1 min' },
  { id: 'le_stretch', text: 'Gentle 1-minute seated ankle and wrist circles.', category: 'Move', icon: '🧘', duration: '1 min' },
  { id: 'le_gratitude', text: 'Think of 1 cozy thing you are glad exists.', category: 'Mind', icon: '💛', duration: '30s' }
];

export function getPersonalizedRecommendations({ checkIn, userProfile, cycleInfo, activeWorkout, hydrationMl, meals }) {
  const energy = checkIn?.energy || 3;
  const stress = checkIn?.stress || 3;
  const sleep = checkIn?.sleep || 3;
  const mood = checkIn?.mood || 'neutral';
  const bodyTags = checkIn?.bodyTags || [];

  const thrive = userProfile?.howIThrive || {};
  const isLowEnergy = thrive.lowEnergyMode || energy <= 2;
  const commStyle = thrive.communicationStyle || 'soft_gentle';
  const hiddenContent = thrive.contentPreferences?.hidden || [];

  const recommendations = [];
  let smallStep = SMALL_STEPS_POOL[0];
  let mascotMessage = "Hey there! Let's make today a little gentler together.";

  // 1. Evaluate Cycle Phase if enabled
  let cycleSignal = null;
  if (userProfile?.cycleTrackingEnabled && userProfile?.lastPeriodStart && !hiddenContent.includes('menstrual')) {
    cycleSignal = getCyclePhaseInfo(userProfile.lastPeriodStart, userProfile.cycleLength || 28);
  }

  // 2. Low Energy Mode vs Normal Energy Logic
  if (isLowEnergy) {
    // Low Energy Mode Activated -> Scaled Down Micro Steps & Zero Pressure
    smallStep = LOW_ENERGY_STEPS[Math.floor(Math.random() * LOW_ENERGY_STEPS.length)];

    recommendations.push({
      id: 'rec_le_1',
      title: 'Gentle Nervous System Rest',
      desc: 'No high output needed. Rest your shoulders and do 60 seconds of soft breathing.',
      actionText: '60s Calm',
      tab: 'MIND',
      tag: 'Rest',
      icon: '🌬️'
    });

    recommendations.push({
      id: 'rec_le_2',
      title: 'Warm Hydration & Salt',
      desc: 'A warm herbal infusion or water with a pinch of sea salt supports cellular energy.',
      actionText: 'Log Hydration',
      tab: 'TODAY',
      tag: 'Hydrate',
      icon: '🍵'
    });

    recommendations.push({
      id: 'rec_le_3',
      title: 'Simple Nourishing Bowl',
      desc: 'Choose an effortless snack like sliced fruit with nut butter or warm broth.',
      actionText: 'View Nourish',
      tab: 'NOURISH',
      tag: 'Nourish',
      icon: '🍲'
    });

  } else if (energy >= 4 && stress <= 2) {
    // High Vitality Mode
    smallStep = SMALL_STEPS_POOL.find(s => s.id === 'walk_5min') || SMALL_STEPS_POOL[1];

    if (!hiddenContent.includes('strength') && !hiddenContent.includes('running')) {
      recommendations.push({
        id: 'rec_vitality_1',
        title: 'Energizing Strength or Brisk Walk',
        desc: 'Your energy is primed for a 20-minute brisk walk or functional strength session.',
        actionText: 'Start Workout',
        tab: 'MOVE',
        tag: 'Movement',
        icon: '⚡'
      });
    }

    if (!hiddenContent.includes('nutrition')) {
      recommendations.push({
        id: 'rec_vitality_2',
        title: 'Protein-Rich Recovery Meal',
        desc: 'Fuel your active day with 20g+ clean protein to sustain muscle repair and steady energy.',
        actionText: 'Browse Recipes',
        tab: 'NOURISH',
        tag: 'Nourish',
        icon: '🥗'
      });
    }

    recommendations.push({
      id: 'rec_vitality_3',
      title: 'Future Vision Journaling',
      desc: 'Capture your clear, focused state with a quick Manifestation journal prompt.',
      actionText: 'Open Journal',
      tab: 'MIND',
      tag: 'Mindset',
      icon: '✍️'
    });

  } else {
    // Balanced Mode
    smallStep = SMALL_STEPS_POOL.find(s => s.id === 'veg_serving') || SMALL_STEPS_POOL[3];

    recommendations.push({
      id: 'rec_balance_1',
      title: 'Daily Hydration Milestone',
      desc: 'Keep your focus sharp with a glass of water before your next activity.',
      actionText: 'Log Hydration',
      tab: 'TODAY',
      tag: 'Hydration',
      icon: '💧'
    });

    if (!hiddenContent.includes('gentle_move')) {
      recommendations.push({
        id: 'rec_balance_2',
        title: 'Mindful 15-Minute Movement',
        desc: 'A gentle walk or pilates core flow will keep your posture tall and mind clear.',
        actionText: 'Choose Routine',
        tab: 'MOVE',
        tag: 'Movement',
        icon: '👟'
      });
    }

    recommendations.push({
      id: 'rec_balance_3',
      title: 'Gratitude Reflection',
      desc: 'Note down 3 things that bring warmth to your day in your gratitude space.',
      actionText: 'Write Gratitude',
      tab: 'MIND',
      tag: 'Mind',
      icon: '✨'
    });
  }

  // 3. Cycle Phase Overrides if active
  if (cycleSignal && (cycleSignal.phase === 'Luteal' || cycleSignal.phase === 'Menstrual')) {
    if (recommendations.length > 1) {
      recommendations[1] = {
        id: 'rec_cycle_phase',
        title: `${cycleSignal.phase} Phase Care: ${cycleSignal.headline}`,
        desc: cycleSignal.recommendationTip,
        actionText: 'Learn Phase Tips',
        tab: 'NOURISH',
        tag: 'Cycle Sync',
        icon: '🌙'
      };
    }
  }

  // 4. Body Tags Override
  if (bodyTags.includes('Craving something') && !hiddenContent.includes('nutrition')) {
    recommendations[0] = {
      id: 'rec_body_translator',
      title: 'Explore Your Cravings Mindfully',
      desc: 'Use the Body Translator to decode what your body might be signaling.',
      actionText: 'Translate Craving',
      tab: 'NOURISH',
      tag: 'Body Translator',
      icon: '🔍'
    };
  }

  // 5. Adapt Tone to Communication Style
  switch (commStyle) {
    case 'direct_practical':
      mascotMessage = isLowEnergy
        ? "Low energy detected. Scale down: 1 glass of water, 1 minute rest."
        : "Energy is good. Next action: 5-minute walk.";
      break;
    case 'detailed':
      mascotMessage = isLowEnergy
        ? "You've activated Low Energy Mode today. Recommendations are scaled to 1–5 minute micro-habits to protect your recovery."
        : `Based on your check-in (Energy ${energy}/5, Sleep ${sleep}/5), your cardiovascular readiness is optimal for a 15-20 min routine.`;
      break;
    case 'playful':
      mascotMessage = isLowEnergy
        ? "Cozy slug mode engaged! 🐌✨ Let's just sip some warm tea and be super gentle today."
        : "Let's get that tiny win, bestie! 🦊👟 Ready for today's adventure?";
      break;
    case 'minimal':
      mascotMessage = isLowEnergy
        ? "Rest & hydrate."
        : "Drink water. Move 5 min.";
      break;
    case 'soft_gentle':
    default:
      mascotMessage = isLowEnergy
        ? "I notice your energy is gentle today. Let's focus on nourishment, soft breath, and giving yourself grace."
        : "You don't need to change everything today. Just take one small step at your own pace.";
      break;
  }

  return {
    recommendations: recommendations.slice(0, 3),
    smallStep,
    mascotMessage
  };
}
