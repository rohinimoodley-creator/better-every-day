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
  let recommendationTip = 'Some people notice steady vitality returning. You might enjoy fresh, colorful meals and progressive movement.';
  let workoutGuidance = 'You might prefer brisk walks, strength training, or cardio routines if your vitality feels high.';
  let nutritionGuidance = 'Some people enjoy fresh greens, citrus fruits, sprouted foods, and lighter proteins as energy returns.';
  let restGuidance = 'If mental alertness feels high, channel this into your favorite routines at your own comfortable pace.';

  if (currentDayOfCycle <= periodLength) {
    phase = 'Menstrual';
    headline = 'Rest, Renewal & Inward Focus';
    icon = '🩸';
    color = '#d64062';
    recommendationTip = 'You may want to include warm, iron-rich meals or take extra rest if this feels good for you.';
    workoutGuidance = 'Some people find that gentle walks, mobility, or restorative yoga feel comforting. Your usual workouts remain fully available if you feel energized.';
    nutritionGuidance = 'You may want to include meals containing foods rich in iron and vitamin C (such as dark leafy greens, citrus, lentils, or warm vegetable broths) during this part of your cycle.';
    restGuidance = 'Give yourself permission to slow down, rest, or wind down earlier in the evening if your body asks for quiet time.';
  } else if (currentDayOfCycle > periodLength && currentDayOfCycle <= 13) {
    phase = 'Follicular';
    headline = 'Vibrant Energy & Clarity';
    icon = '🌱';
    color = '#52b788';
    recommendationTip = 'Estrogen gently rises. You might enjoy stamina, creative habits, or exploring new activities.';
    workoutGuidance = 'You might prefer brisk walking, cardio, Pilates, or resistance routines if you feel energized.';
    nutritionGuidance = 'Some people enjoy fresh greens, pumpkin & flax seeds, light stir-fries, and citrus fruits.';
    restGuidance = 'Mental alertness is often clear. Channel this into your favorite habits and routines at your own pace.';
  } else if (currentDayOfCycle >= 14 && currentDayOfCycle <= 16) {
    phase = 'Ovulation';
    headline = 'Peak Stamina & Connection';
    icon = '🌸';
    color = '#f4a261';
    recommendationTip = 'Some people experience peak stamina around this window. Energetic movement or social connections might feel appealing.';
    workoutGuidance = 'One option could be higher-tempo workouts, resistance training, or outdoor activities if you feel up for it.';
    nutritionGuidance = 'Staying well-hydrated and enjoying colorful antioxidant-rich berries and balanced fiber can support your daily vitality.';
    restGuidance = 'High communicative energy. Great for connecting with friends or wellness circles if you feel inclined.';
  } else {
    phase = 'Luteal';
    headline = 'Comfort, Calm & Grounding';
    icon = '🌙';
    color = '#7b61ff';
    recommendationTip = 'Progesterone creates a calming inward cadence. You might prefer grounding meals and steady movement.';
    workoutGuidance = 'Some people prefer steady-state walking, mindful Pilates, yoga, or gentle bodyweight mobility.';
    nutritionGuidance = 'Some people find that grounding complex carbohydrates (sweet potatoes, oats) and magnesium-rich foods (dark cacao, pumpkin seeds) feel nourishing.';
    restGuidance = 'An unhurried wind-down routine in the evening and cozy surroundings may feel comforting.';
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
