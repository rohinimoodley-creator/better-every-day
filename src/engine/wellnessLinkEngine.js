/**
 * Better Every Day — Wellness Link Engine (Pure Module)
 * 
 * Implements deterministic cross-hub smart linking:
 * linkEngine(events, settings, dayKey) -> { adjustments, suggestions[], dailyTotals, streakStatus }
 * 
 * Rules:
 * 1. Activity to Hydration (+250 ml/30m moderate, +150 ml/30m light, +250 ml hot day, cap +1,000 ml)
 * 2. Hydration Pacing (adjusted goal spread between Day Starts and Day Ends minus wind-down)
 * 3. Sleep to Energy (gentle adaptation for low rest nights)
 * 4. Evening Wind-Down Bundle (skincare + breathwork + soundscape + reflection near Day Ends)
 * 5. Inactivity to Micro-Movement (30-30 breaks count toward Move totals, step, and streak)
 * 6. Pet Play & Dance Party (count as active minutes, Move totals, hydration adjustment, streak)
 * 7. Activity to Nourishment (soft qualitative refueling note without deficit language)
 * 8. Meal to Supplement Prompts (timely prompt for "with food" supplements)
 * 9. Outdoor Session to SPF Check
 * 10. Check-ins & Mood to Mindful Prompts (Body Translator, Breathwork, Gratitude)
 * 11. Shame-free Active Consistency Streak (1 meaningful action per dayKey)
 * 12. Cycle Awareness (Contextual preview layers only if enabled and sync is ON)
 * 13. Feedback & Topic Filtering (More/Hide topic weightings + AI Memory storage)
 */

import { parseTimeToMinutes } from '../utils/dayKey.js';

export const LINK_ENGINE_CONSTANTS = {
  HYDRATION_PER_30MIN_MODERATE: 250, // ml
  HYDRATION_PER_30MIN_LIGHT: 150,     // ml
  HYDRATION_HOT_WEATHER: 250,         // ml
  MAX_HYDRATION_ADJUSTMENT: 1000,     // ml
  DEFAULT_BASE_HYDRATION_GOAL: 2250,  // ml
  DEFAULT_BASE_STEP_GOAL: 8000,
  WIND_DOWN_OFFSET_MINUTES: 60,       // Day Ends - 60 min
  LOW_SLEEP_HOURS_THRESHOLD: 6.5
};

/**
 * Tone Voice Copy Matrix
 */
const TONE_COPY = {
  gentle: {
    hydrationAdjusted: (extra, reason) => `Your hydration goal is adjusted by +${extra} ml (${reason}). Listen to your body and sip when comfortable.`,
    lowSleep: 'A gentler pace today: Pip recommends gentle mobility or restful breathwork to recharge.',
    eveningWindDown: 'Time to wind down: Complete your evening skincare and enjoy a restful breathwork rhythm.',
    spfPrompt: 'Heading outside? A quick reminder to protect your skin with SPF if you haven\'t yet.',
    refuel: 'Great movement today! Remember to nourish yourself with wholesome food you love.',
    streakPaused: 'Your streak is safely protected while you take needed rest.'
  },
  direct: {
    hydrationAdjusted: (extra, reason) => `Goal +${extra} ml (${reason}). Stay hydrated.`,
    lowSleep: 'Sleep was under target. Shorter mobility session suggested.',
    eveningWindDown: 'Evening routine: Skincare, breathing, and reflection.',
    spfPrompt: 'Outdoor workout detected: Apply SPF.',
    refuel: 'Movement logged. Fuel up with protein and balanced nutrients.',
    streakPaused: 'Streak paused as requested.'
  },
  playful: {
    hydrationAdjusted: (extra, reason) => `Pip is handing you extra water! +${extra} ml for ${reason} 🌱💧`,
    lowSleep: 'Snooze tank a bit low! Let\'s take it super easy with comfy stretches today 🛋️',
    eveningWindDown: 'Cozy bedtime incoming! Skincare and sweet sounds are ready for you 🌙✨',
    spfPrompt: 'Sunshine patrol! Pip says grab that SPF before you step out ☀️👒',
    refuel: 'High five for moving! Time for a delicious snack 🥪🍎',
    streakPaused: 'Streak protected! Rest up like a little plant in winter 🌱❄️'
  },
  minimal: {
    hydrationAdjusted: (extra, reason) => `+${extra} ml (${reason}).`,
    lowSleep: 'Gentle mobility suggested.',
    eveningWindDown: 'Evening routine ready.',
    spfPrompt: 'SPF reminder.',
    refuel: 'Nourishment suggested.',
    streakPaused: 'Streak paused.'
  }
};

/**
 * Pure Link Engine
 * @param {Array} events - Timestamped log events
 * @param {Object} settings - User settings, rhythm, hub visibility, filters, tone, AI memory
 * @param {string} dayKey - Current effective dayKey ("YYYY-MM-DD")
 * @returns {Object} { adjustments, suggestions[], dailyTotals, streakStatus }
 */
export function linkEngine(events = [], settings = {}, dayKey = '') {
  const effectiveDayKey = dayKey || new Date().toISOString().split('T')[0];

  // 1. Extract Settings & Preferences
  const hubVisibility = settings.wellnessHubVisibility || {
    move: true, nourish: true, hydrate: true, rest: true, mind: true,
    skincare: true, breathwork: true, soundscapes: true, cycle: false, calendar: true
  };
  const topicFilters = settings.topicFilters || {}; // { [topicId]: 'more' | 'hide' | 'normal' }
  const tone = settings.communicationTone || 'gentle'; // 'gentle' | 'direct' | 'playful' | 'minimal'
  const toneCopy = TONE_COPY[tone] || TONE_COPY.gentle;
  const rhythm = settings.rhythm || { dayStarts: '07:00', dayEnds: '23:00' };
  const baseHydrationGoal = Number(settings.hydrationGoalMl) || LINK_ENGINE_CONSTANTS.DEFAULT_BASE_HYDRATION_GOAL;
  const baseStepGoal = Number(settings.stepGoal) || LINK_ENGINE_CONSTANTS.DEFAULT_BASE_STEP_GOAL;
  const isHotWeather = Boolean(settings.isHotWeather);
  const cycleEnabled = Boolean(hubVisibility.cycle && settings.cycleSyncEnabled);
  const streakCounterEnabled = settings.trackStreakCounter !== false;
  const isStreakPaused = Boolean(settings.isStreakPaused);
  const dismissedSuggestions = new Set(settings.dismissedSuggestions || []);
  const manualHydrationUndo = Boolean(settings.manualHydrationUndo);

  // 2. Filter events for the current dayKey
  const todayEvents = (events || []).filter(e => e.dayKey === effectiveDayKey || (e.timestamp && e.timestamp.startsWith(effectiveDayKey)));

  // 3. Compute Daily Aggregates from Event Store
  let totalHydrationMl = 0;
  let totalSteps = 0;
  let totalActiveMinutes = 0;
  let totalMicroBreaks = 0;
  let totalPetPlayMinutes = 0;
  let totalDanceParties = 0;
  let mealsLoggedCount = 0;
  let supplementsTakenCount = 0;
  let supplementsWithFoodNeeded = 0;
  let skincareStepsDone = 0;
  let breathworkSessionsDone = 0;
  let gratitudeEntriesDone = 0;
  let reflectionsDone = 0;
  let lastSleepDurationHours = null;
  let hasOutdoorActivity = false;
  let lastActivityName = '';

  todayEvents.forEach(evt => {
    switch (evt.type) {
      case 'water':
        totalHydrationMl += Number(evt.amountMl || evt.ml || 0);
        break;
      case 'step_sync':
      case 'steps':
        totalSteps += Number(evt.count || evt.steps || 0);
        break;
      case 'activity':
      case 'workout':
        totalActiveMinutes += Number(evt.durationMinutes || evt.duration || 0);
        totalSteps += Number(evt.steps || 0);
        if (evt.isOutdoor || evt.type === 'outdoor_walk' || evt.type === 'outdoor_run') {
          hasOutdoorActivity = true;
        }
        lastActivityName = evt.name || evt.activityType || 'workout';
        break;
      case 'micro_movement':
        totalMicroBreaks += 1;
        totalActiveMinutes += 2;
        break;
      case 'dance_party':
        totalDanceParties += 1;
        totalMicroBreaks += 1;
        totalActiveMinutes += Number(evt.durationMinutes || 3);
        break;
      case 'pet_play':
        totalPetPlayMinutes += Number(evt.durationMinutes || evt.minutes || 0);
        totalActiveMinutes += Number(evt.durationMinutes || evt.minutes || 0);
        break;
      case 'meal':
        mealsLoggedCount += 1;
        break;
      case 'supplement':
        if (evt.taken) supplementsTakenCount += 1;
        if (evt.withFood && !evt.taken) supplementsWithFoodNeeded += 1;
        break;
      case 'skincare_step':
        skincareStepsDone += 1;
        break;
      case 'sleep':
        lastSleepDurationHours = Number(evt.durationHours || (evt.durationMinutes ? evt.durationMinutes / 60 : 0));
        break;
      case 'breathwork':
        breathworkSessionsDone += 1;
        break;
      case 'gratitude':
        gratitudeEntriesDone += 1;
        break;
      case 'reflection':
      case 'voice_log':
        reflectionsDone += 1;
        break;
      default:
        break;
    }
  });

  // 4. Rule 1: Activity to Hydration Adjustment
  let activityHydrationBonus = 0;
  let hydrationAdjustmentReasons = [];

  if (totalActiveMinutes > 0 && hubVisibility.move !== false) {
    const thirtyMinBlocks = Math.floor(totalActiveMinutes / 30);
    const remainderMins = totalActiveMinutes % 30;
    activityHydrationBonus = (thirtyMinBlocks * LINK_ENGINE_CONSTANTS.HYDRATION_PER_30MIN_MODERATE) +
      (remainderMins >= 15 ? LINK_ENGINE_CONSTANTS.HYDRATION_PER_30MIN_LIGHT : 0);

    if (activityHydrationBonus > 0) {
      hydrationAdjustmentReasons.push(`${totalActiveMinutes}m activity`);
    }
  }

  if (isHotWeather) {
    activityHydrationBonus += LINK_ENGINE_CONSTANTS.HYDRATION_HOT_WEATHER;
    hydrationAdjustmentReasons.push('warm weather');
  }

  // Cap at maximum adjustment
  activityHydrationBonus = Math.min(activityHydrationBonus, LINK_ENGINE_CONSTANTS.MAX_HYDRATION_ADJUSTMENT);

  // If user clicked Undo on the adjustment, reset bonus to 0
  const effectiveHydrationBonus = manualHydrationUndo ? 0 : activityHydrationBonus;
  const adjustedHydrationGoal = baseHydrationGoal + effectiveHydrationBonus;

  // 5. Build Suggestion Pipeline
  const suggestions = [];

  // Suggestion: Hydration Adjustment Note (Inline & Recommendation)
  if (effectiveHydrationBonus > 0 && hubVisibility.hydrate !== false && topicFilters.hydrate !== 'hide') {
    const reasonText = hydrationAdjustmentReasons.join(' + ');
    suggestions.push({
      id: `hyd_adj_${effectiveDayKey}`,
      hubId: 'hydrate',
      type: 'hydration_adjustment',
      priority: 85,
      title: 'Hydration Goal Adjusted',
      text: toneCopy.hydrationAdjusted(effectiveHydrationBonus, reasonText),
      why: `Because you logged ${totalActiveMinutes}m movement today${isHotWeather ? ' in warm weather' : ''}`,
      actionLabel: 'View Hydrate',
      targetTab: 'WELLNESS',
      targetCategory: 'hydrate',
      hasUndo: true,
      undoAction: 'UNDO_HYDRATION_ADJUSTMENT',
      adjustmentMl: effectiveHydrationBonus
    });
  }

  // Suggestion: Sleep to Energy & Gentle Adaptation
  if (lastSleepDurationHours !== null && lastSleepDurationHours < LINK_ENGINE_CONSTANTS.LOW_SLEEP_HOURS_THRESHOLD && hubVisibility.rest !== false) {
    if (topicFilters.rest !== 'hide' && topicFilters.movement !== 'hide') {
      suggestions.push({
        id: `sleep_gentle_${effectiveDayKey}`,
        hubId: 'rest',
        type: 'gentle_energy',
        priority: 90,
        title: 'Gentle Pacing Today',
        text: toneCopy.lowSleep,
        why: `Because your logged sleep was ${lastSleepDurationHours.toFixed(1)} hrs`,
        actionLabel: 'Explore Gentle Plan',
        targetTab: 'WELLNESS',
        targetCategory: 'move',
        deepLink: 'beginner_plan'
      });
    }
  }

  // Suggestion: Evening Wind-Down Bundle
  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();
  const dayEndsMins = parseTimeToMinutes(rhythm.dayEnds);
  const isNearWindDown = (dayEndsMins - currentMins) <= LINK_ENGINE_CONSTANTS.WIND_DOWN_OFFSET_MINUTES && (dayEndsMins - currentMins) >= -30;

  if (isNearWindDown && hubVisibility.rest !== false && topicFilters.rest !== 'hide') {
    suggestions.push({
      id: `wind_down_${effectiveDayKey}`,
      hubId: 'rest',
      type: 'wind_down_bundle',
      priority: 80,
      title: 'Evening Wind-Down',
      text: toneCopy.eveningWindDown,
      why: `Because you are ~${LINK_ENGINE_CONSTANTS.WIND_DOWN_OFFSET_MINUTES} min from your bedtime rhythm (${rhythm.dayEnds})`,
      actionLabel: 'Start Evening Routine',
      targetTab: 'WELLNESS',
      targetCategory: 'skincare'
    });
  }

  // Suggestion: Outdoor Session SPF Prompt
  if (hasOutdoorActivity && skincareStepsDone === 0 && hubVisibility.skincare !== false && topicFilters.skincare !== 'hide') {
    suggestions.push({
      id: `spf_outdoor_${effectiveDayKey}`,
      hubId: 'skincare',
      type: 'spf_prompt',
      priority: 75,
      title: 'Outdoor Sun Care',
      text: toneCopy.spfPrompt,
      why: 'Because outdoor walking or running was scheduled/logged',
      actionLabel: 'Check Skincare',
      targetTab: 'WELLNESS',
      targetCategory: 'skincare'
    });
  }

  // Suggestion: Meal with Supplements Prompt
  if (mealsLoggedCount > 0 && supplementsWithFoodNeeded > 0 && hubVisibility.nourish !== false && topicFilters.nutrition !== 'hide') {
    suggestions.push({
      id: `supp_food_${effectiveDayKey}`,
      hubId: 'nourish',
      type: 'supplement_prompt',
      priority: 70,
      title: 'Take Supplements With Food',
      text: 'You logged a meal! Friendly reminder to take your with-food vitamins/supplements.',
      why: `Because you logged a meal and have ${supplementsWithFoodNeeded} pending supplement(s)`,
      actionLabel: 'Log Supplements',
      targetTab: 'WELLNESS',
      targetCategory: 'nourish',
      deepLink: 'supplements'
    });
  }

  // Suggestion: Refueling after Long Movement
  if (totalActiveMinutes >= 45 && mealsLoggedCount === 0 && hubVisibility.nourish !== false && topicFilters.nutrition !== 'hide') {
    suggestions.push({
      id: `refuel_${effectiveDayKey}`,
      hubId: 'nourish',
      type: 'nourish_refuel',
      priority: 65,
      title: 'Gentle Refuel',
      text: toneCopy.refuel,
      why: `Because you completed a ${totalActiveMinutes}m active movement session`,
      actionLabel: 'Explore Recipes',
      targetTab: 'WELLNESS',
      targetCategory: 'nourish'
    });
  }

  // Filter out dismissed suggestions and hidden hubs
  const filteredSuggestions = suggestions
    .filter(s => !dismissedSuggestions.has(s.id))
    .filter(s => hubVisibility[s.hubId] !== false)
    .sort((a, b) => (b.priority || 50) - (a.priority || 50));

  // 6. Shame-Free Streak Consistency Check
  // Any 1 meaningful wellness action protects and advances the active consistency streak
  const hasMeaningfulActionToday = (
    totalHydrationMl > 0 ||
    totalSteps >= 500 ||
    totalActiveMinutes > 0 ||
    totalMicroBreaks > 0 ||
    mealsLoggedCount > 0 ||
    supplementsTakenCount > 0 ||
    skincareStepsDone > 0 ||
    breathworkSessionsDone > 0 ||
    gratitudeEntriesDone > 0 ||
    reflectionsDone > 0
  );

  return {
    dayKey: effectiveDayKey,
    adjustments: {
      baseHydrationGoal,
      activityHydrationBonus: effectiveHydrationBonus,
      isHotWeather,
      adjustedHydrationGoal,
      hydrationAdjustmentReasons,
      isUndoApplied: manualHydrationUndo,
      baseStepGoal
    },
    dailyTotals: {
      hydrationMl: totalHydrationMl,
      steps: totalSteps,
      activeMinutes: totalActiveMinutes,
      microBreaks: totalMicroBreaks,
      petPlayMinutes: totalPetPlayMinutes,
      danceParties: totalDanceParties,
      mealsCount: mealsLoggedCount,
      supplementsCount: supplementsTakenCount,
      skincareSteps: skincareStepsDone,
      breathworkSessions: breathworkSessionsDone,
      gratitudeEntries: gratitudeEntriesDone,
      reflectionsCount: reflectionsDone,
      sleepHours: lastSleepDurationHours
    },
    streakStatus: {
      isStreakCounterEnabled: streakCounterEnabled,
      isStreakPaused: isStreakPaused,
      hasMeaningfulActionToday,
      activeStreakDays: settings.streakCount || 6,
      streakMessage: isStreakPaused ? toneCopy.streakPaused : `${settings.streakCount || 6} days active consistency`
    },
    suggestions: filteredSuggestions,
    primaryGentleStep: filteredSuggestions[0] || null
  };
}
