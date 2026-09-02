// Better Every Day Score Engine
// Measures Consistency & Daily Self-Care Actions.
// Strictly non-judgmental, shame-free, and NEVER factors body size/weight.

export function calculateBetterEveryDayScore({
  smallStepCompleted = false,
  hydrationMl = 0,
  hydrationGoalMl = 2000,
  workoutMinutes = 0,
  mealsLoggedCount = 0,
  checkInCompleted = false,
  journalLogged = false,
  calmAudioMinutes = 0
}) {
  let score = 0;
  const breakdown = [];

  // 1. Small Step Completion (25 points) - The cornerstone of small daily progress
  if (smallStepCompleted) {
    score += 25;
    breakdown.push({ label: 'Small Step', pts: 25, max: 25, achieved: true, icon: '🌱' });
  } else {
    breakdown.push({ label: 'Small Step', pts: 0, max: 25, achieved: false, icon: '🌱' });
  }

  // 2. Hydration Consistency (Up to 20 points)
  const hydRatio = Math.min(1, hydrationMl / Math.max(1000, hydrationGoalMl));
  const hydPts = Math.round(hydRatio * 20);
  score += hydPts;
  breakdown.push({ label: 'Hydration', pts: hydPts, max: 20, achieved: hydPts >= 15, icon: '💧' });

  // 3. Movement / Activity (Up to 20 points)
  // Even a 5-minute walk awards 12 points; 15+ min gives full 20.
  let movePts = 0;
  if (workoutMinutes >= 15) movePts = 20;
  else if (workoutMinutes >= 5) movePts = 12;
  else if (workoutMinutes > 0) movePts = 8;
  score += movePts;
  breakdown.push({ label: 'Movement', pts: movePts, max: 20, achieved: movePts >= 12, icon: '👟' });

  // 4. Nourishment Logged (Up to 15 points)
  const mealPts = Math.min(15, mealsLoggedCount * 5);
  score += mealPts;
  breakdown.push({ label: 'Nourishment', pts: mealPts, max: 15, achieved: mealPts >= 10, icon: '🥗' });

  // 5. Daily Check-in & Self-Awareness (10 points)
  if (checkInCompleted) {
    score += 10;
    breakdown.push({ label: 'Check-In', pts: 10, max: 10, achieved: true, icon: '✨' });
  } else {
    breakdown.push({ label: 'Check-In', pts: 0, max: 10, achieved: false, icon: '✨' });
  }

  // 6. Mindfulness / Calm / Journaling (Up to 10 points)
  let mindPts = 0;
  if (journalLogged && calmAudioMinutes > 0) mindPts = 10;
  else if (journalLogged || calmAudioMinutes > 0) mindPts = 8;
  score += mindPts;
  breakdown.push({ label: 'Mind & Calm', pts: mindPts, max: 10, achieved: mindPts >= 8, icon: '🌸' });

  // Tiered gentle reflection
  let ratingMessage = "Every small step counts.";
  let badgeColor = "#40916c";

  if (score >= 80) {
    ratingMessage = "Wonderful consistency today! Your body thanks you.";
    badgeColor = "#2d6a4f";
  } else if (score >= 50) {
    ratingMessage = "Solid rhythm! Making today a little better step by step.";
    badgeColor = "#52b788";
  } else if (score > 0) {
    ratingMessage = "Great start. Remember: consistency over perfection.";
    badgeColor = "#e09f3e";
  } else {
    ratingMessage = "Take one small step when you are ready. No pressure.";
    badgeColor = "#758a7b";
  }

  return {
    score: Math.min(100, score),
    breakdown,
    ratingMessage,
    badgeColor
  };
}
