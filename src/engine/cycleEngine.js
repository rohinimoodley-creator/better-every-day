// Menstrual Wellness & Cycle-Syncing Engine (Strictly Optional & Non-Medical)

export function getCyclePhaseInfo(lastPeriodDateStr, cycleLength = 28, periodLength = 5) {
  if (!lastPeriodDateStr) return null;

  const lastPeriod = new Date(lastPeriodDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  lastPeriod.setHours(0, 0, 0, 0);

  const diffTime = today - lastPeriod;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Normalize cycle day (1 to cycleLength)
  let currentDayOfCycle = ((diffDays % cycleLength) + cycleLength) % cycleLength + 1;

  let phase = 'Follicular';
  let headline = 'Rising Energy & Renewal';
  let icon = '🌱';
  let color = '#40916c';
  let recommendationTip = 'Focus on fresh, vibrant foods and progressive strength building.';
  let workoutGuidance = 'Ideal for moderate-to-high intensity workouts, strength, and trying new activities.';
  let nutritionGuidance = 'Prioritize lean proteins, sprouted foods, complex carbs, and fermented vegetables.';
  let restGuidance = 'Energy is building naturally. Great time for creative brainstorming and social connection.';

  if (currentDayOfCycle <= periodLength) {
    phase = 'Menstrual';
    headline = 'Rest, Renewal & Inward Focus';
    icon = '🩸';
    color = '#d64062';
    recommendationTip = 'Prioritize warm iron-rich meals, gentle stretching, and extra restful sleep.';
    workoutGuidance = 'Gentle walks, restorative yoga, mobility, or taking a complete rest day.';
    nutritionGuidance = 'Warm stews, bone or vegetable broths, iron-rich greens, vitamin C, and dark chocolate.';
    restGuidance = 'Give yourself permission to slow down, journal, and protect your evening boundary.';
  } else if (currentDayOfCycle > periodLength && currentDayOfCycle <= 13) {
    phase = 'Follicular';
    headline = 'Vibrant Energy & Clarity';
    icon = '🌱';
    color = '#52b788';
    recommendationTip = 'Estrogen is gently rising. Great time for stamina, creative projects, and light workouts.';
    workoutGuidance = 'Brisk walking, cardio, Pilates, and resistance training feel especially good.';
    nutritionGuidance = 'Fresh greens, pumpkin & flax seeds, light stir-fries, and citrus fruits.';
    restGuidance = 'Mental alertness is high. Channel this into your favorite habits and new routines.';
  } else if (currentDayOfCycle >= 14 && currentDayOfCycle <= 16) {
    phase = 'Ovulation';
    headline = 'Peak Stamina & Connection';
    icon = '🌸';
    color = '#f4a261';
    recommendationTip = 'Energy and social confidence peak. Great window for challenging workouts and social events.';
    workoutGuidance = 'HIIT, group workouts, heavier resistance lifting, and outdoor adventures.';
    nutritionGuidance = 'Antioxidant-rich berries, leafy greens, wild salmon, and ample hydration.';
    restGuidance = 'High communicative energy. Great for connecting with friends or wellness circles.';
  } else {
    phase = 'Luteal';
    headline = 'Comfort, Calm & Grounding';
    icon = '🌙';
    color = '#7b61ff';
    recommendationTip = 'Progesterone creates a calming inward pull. Prioritize magnesium-rich foods and steady movement.';
    workoutGuidance = 'Pilates, steady-state walking, yoga, and gentle bodyweight strength.';
    nutritionGuidance = 'Magnesium-rich foods (dark cacao, sunflower seeds, pumpkin seeds, sweet potatoes), soothing herbal teas.';
    restGuidance = 'Wind down earlier in the evening. Keep your environment cozy and unhurried.';
  }

  return {
    day: currentDayOfCycle,
    totalDays: cycleLength,
    phase,
    headline,
    icon,
    color,
    recommendationTip,
    workoutGuidance,
    nutritionGuidance,
    restGuidance
  };
}

// Calculate cycle phase for any specific date on the calendar
export function getCyclePhaseForDate(targetDateStr, lastPeriodDateStr, cycleLength = 28, periodLength = 5) {
  if (!targetDateStr || !lastPeriodDateStr) return null;

  const target = new Date(targetDateStr);
  const lastPeriod = new Date(lastPeriodDateStr);
  const today = new Date();

  target.setHours(0, 0, 0, 0);
  lastPeriod.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = target - lastPeriod;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const cycleDay = (((diffDays % cycleLength) + cycleLength) % cycleLength) + 1;
  const isPrediction = target > today;

  let phase = 'Follicular';
  let icon = '🌱';
  let color = '#52b788';
  let bg = 'rgba(82, 183, 136, 0.12)';
  let label = 'Follicular Phase';

  if (cycleDay <= periodLength) {
    phase = 'Menstrual';
    icon = '🩸';
    color = '#d64062';
    bg = 'rgba(214, 64, 98, 0.12)';
    label = isPrediction ? 'Predicted Menstrual Phase' : 'Menstrual Phase';
  } else if (cycleDay > periodLength && cycleDay <= 13) {
    phase = 'Follicular';
    icon = '🌱';
    color = '#52b788';
    bg = 'rgba(82, 183, 136, 0.12)';
    label = isPrediction ? 'Predicted Follicular Phase' : 'Follicular Phase';
  } else if (cycleDay >= 14 && cycleDay <= 16) {
    phase = 'Ovulation';
    icon = '🌸';
    color = '#f4a261';
    bg = 'rgba(244, 162, 97, 0.14)';
    label = isPrediction ? 'Predicted Ovulation' : 'Ovulation Phase';
  } else {
    phase = 'Luteal';
    icon = '🌙';
    color = '#7b61ff';
    bg = 'rgba(123, 97, 255, 0.12)';
    label = isPrediction ? 'Predicted Luteal Phase' : 'Luteal Phase';
  }

  return {
    date: targetDateStr,
    cycleDay,
    phase,
    icon,
    color,
    bg,
    label,
    isPrediction,
    shortLabel: isPrediction ? `Pred. ${phase}` : phase
  };
}
