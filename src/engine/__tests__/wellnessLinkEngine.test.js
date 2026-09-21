/**
 * Automated Unit Test Suite for Wellness Link Engine
 */

import { linkEngine, LINK_ENGINE_CONSTANTS } from '../wellnessLinkEngine.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

export function runLinkEngineTests() {
  console.log('\n=== RUNNING WELLNESS LINK ENGINE UNIT TESTS ===\n');

  const testDay = '2026-09-20';

  // Test 1: Empty events & default fallback
  {
    const res = linkEngine([], {}, testDay);
    assert(res.dayKey === testDay, 'Properly assigns effective dayKey');
    assert(res.adjustments.baseHydrationGoal === 2250, 'Default base hydration goal 2250 ml');
    assert(res.adjustments.activityHydrationBonus === 0, 'No bonus when no activity');
    assert(res.adjustments.adjustedHydrationGoal === 2250, 'Adjusted goal matches base when 0 bonus');
  }

  // Test 2: Activity to Hydration calculation (+250 ml for 30m, +150 for remainder)
  {
    const events = [
      { type: 'activity', durationMinutes: 45, dayKey: testDay, name: 'Mindful Walk' }
    ];
    const res = linkEngine(events, { hydrationGoalMl: 2000 }, testDay);
    // 45 mins = 30 mins (+250) + 15 mins (+150) = +400 ml
    assert(res.adjustments.activityHydrationBonus === 400, '45m activity gives +400ml bonus');
    assert(res.adjustments.adjustedHydrationGoal === 2400, 'Adjusted goal is 2400 ml');
    assert(res.suggestions.some(s => s.type === 'hydration_adjustment'), 'Generates hydration adjustment suggestion');
  }

  // Test 3: Hot Weather addition and Max Cap at 1,000 ml
  {
    const events = [
      { type: 'activity', durationMinutes: 120, dayKey: testDay } // 120m = 4 * 250 = 1000
    ];
    const res = linkEngine(events, { hydrationGoalMl: 2000, isHotWeather: true }, testDay);
    // 1000 + 250 hot = 1250 -> capped at 1000
    assert(res.adjustments.activityHydrationBonus === 1000, 'Capped at 1,000 ml adjustment max');
    assert(res.adjustments.adjustedHydrationGoal === 3000, 'Adjusted goal is 3,000 ml');
  }

  // Test 4: Hydration Undo
  {
    const events = [
      { type: 'activity', durationMinutes: 30, dayKey: testDay }
    ];
    const res = linkEngine(events, { hydrationGoalMl: 2000, manualHydrationUndo: true }, testDay);
    assert(res.adjustments.activityHydrationBonus === 0, 'Bonus is 0 when manualHydrationUndo is true');
    assert(res.adjustments.adjustedHydrationGoal === 2000, 'Adjusted goal reverts to base goal');
  }

  // Test 5: Low Sleep suggests Gentle Pacing
  {
    const events = [
      { type: 'sleep', durationHours: 5.5, dayKey: testDay }
    ];
    const res = linkEngine(events, {}, testDay);
    const gentleSugg = res.suggestions.find(s => s.type === 'gentle_energy');
    assert(gentleSugg !== undefined, 'Generates gentle pacing suggestion for low sleep (< 6.5h)');
    assert(gentleSugg.why.includes('5.5 hrs'), 'Includes explainable why reason');
  }

  // Test 6: Hub Availability honors (Disabled hub produces no suggestions)
  {
    const events = [
      { type: 'sleep', durationHours: 5.0, dayKey: testDay },
      { type: 'activity', durationMinutes: 60, dayKey: testDay }
    ];
    const res = linkEngine(events, {
      wellnessHubVisibility: { rest: false, move: true, hydrate: false }
    }, testDay);

    assert(!res.suggestions.some(s => s.hubId === 'rest'), 'No suggestions for disabled Rest hub');
    assert(!res.suggestions.some(s => s.hubId === 'hydrate'), 'No suggestions for disabled Hydrate hub');
  }

  // Test 7: Topic Filter honors (Hidden topic suppresses suggestions)
  {
    const events = [
      { type: 'activity', durationMinutes: 60, dayKey: testDay }
    ];
    const res = linkEngine(events, {
      topicFilters: { nutrition: 'hide' }
    }, testDay);

    assert(!res.suggestions.some(s => s.type === 'nourish_refuel'), 'No refuel suggestion when nutrition topic is hidden');
  }

  // Test 8: Pet Play and Dance Party count toward active minutes and hydration
  {
    const events = [
      { type: 'pet_play', durationMinutes: 30, dayKey: testDay },
      { type: 'dance_party', durationMinutes: 15, dayKey: testDay }
    ];
    const res = linkEngine(events, {}, testDay);
    assert(res.dailyTotals.activeMinutes === 45, 'Pet play + Dance Party sum to 45 active minutes');
    assert(res.adjustments.activityHydrationBonus === 400, 'Pet play + Dance Party trigger +400ml hydration bonus');
    assert(res.streakStatus.hasMeaningfulActionToday === true, 'Counts as meaningful action for streak');
  }

  // Test 9: Streak counter toggle
  {
    const res = linkEngine([], { trackStreakCounter: false }, testDay);
    assert(res.streakStatus.isStreakCounterEnabled === false, 'Streak counter correctly disabled');
  }

  console.log(`\n=== TEST SUMMARY: ${passed} passed, ${failed} failed ===\n`);
  return failed === 0;
}

// Auto-run if executed directly via Node
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('wellnessLinkEngine.test.js')) {
  const success = runLinkEngineTests();
  process.exit(success ? 0 : 1);
}
