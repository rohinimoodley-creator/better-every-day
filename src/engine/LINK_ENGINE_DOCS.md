# Better Every Day — Wellness Link Engine Documentation

## Overview
The **Wellness Link Engine** is a pure, deterministic cross-hub intelligence module that unifies individual user logs into an interconnected daily picture. It ensures suggestions are supportive, explainable, dismissible, and completely respect user privacy, tone, and active modules.

---

## 1. Core Principles
- **Supportive & Non-Prescriptive**: Every suggestion provides a short "why" line explaining the rationale (e.g. *"Because you walked 40 min today"*) with dismiss and helpful actions.
- **User Sovereignty**: Respects hubs turned off in *You > Wellness Hub Availability*, Topic Filters (*More / Hide*), Communication Tone (*Gentle, Direct, Playful, Minimal*), and quiet hours.
- **Rhythm-Aware (`dayKey`)**: Day boundary computed from user's *My Daily Rhythm* (*Day Starts* to *Day Ends*); no artificial midnight resets.
- **Local-First & Non-Judgmental**: Zero external data sharing. No calorie-deficit or weight-loss language.

---

## 2. Rule Registry & Constants

| Rule Name | Trigger & Data Sources | Constants & Calculation | Output / Effect |
| :--- | :--- | :--- | :--- |
| **Activity → Hydration Adjustment** | Logged workout, walks, runs, active minutes, warm weather | `+250 ml` per 30m moderate activity<br>`+150 ml` per 30m light activity<br>`+250 ml` for warm weather<br>Cap: `+1,000 ml` total adjustment | Updates today's adjusted hydration goal on Hydrate & Home overview with an Undo chip. Base goal is never overwritten. |
| **Hydration Pacing** | Adjusted goal + `dayStarts` / `dayEnds` | Sleep offset: stops reminders 60 min before `dayEnds` | Hydrate pacing bar and smart nudge schedule. |
| **Sleep → Energy & Pacing** | Logged sleep duration from wearable or manual log | Low rest threshold: `< 6.5 hours` | Adapts daily suggestions to gentle mobility / beginner plans. Never judgmental. |
| **Evening Wind-Down Bundle** | Current time within `60 min` of `dayEnds` | Offset: `Day Ends - 60 min` | Bundles evening skincare, breathwork rhythm, ambient sounds, and reflection into one nudge. |
| **Inactivity → Micro-Movement** | 30-30 reminders enabled | 30 min sedentary interval | 30-30 movement breaks count toward Move totals, gentle step, and streak. |
| **Pet Play & Dance Party** | Logged pet play session or Dance Party completion | Direct duration minutes | Count as active minutes in Move totals, hydration adjustment, and streak consistency. |
| **Activity → Nourishment** | Active session `≥ 45 min` & 0 meals logged | Requires Nutrition topic active | Gentle qualitative refueling reminder (*"Fuel up with wholesome food you enjoy"*). No numbers. |
| **Meal → Supplement Prompt** | Meal logged with pending "with food" vitamins | 1 meal event + pending vitamins | Friendly reminder to take with-food supplements. Feeds Nutritional Insight. |
| **Outdoor Session → SPF Check** | Outdoor walk / run logged | Morning skincare without SPF | Timely sun protection prompt before outdoor movement. |
| **Shame-Free Active Consistency** | Any 1 meaningful action per `dayKey` | Steps `≥ 500`, water, meals, skincare, reflection, breathwork | Advances or protects streak. If streak counter is OFF, numbers vanish everywhere. |
| **Cycle Context Layer** | Cycle module enabled + Sync ON | Menstrual phase (Follicular, Luteal, etc.) | Contextual info layer in Move, Nourish, and Calendar. When disabled, zero mentions exist. |

---

## 3. Data Flow & Interface

```javascript
import { linkEngine } from './wellnessLinkEngine';

const output = linkEngine(
  events,    // Array of timestamped events
  settings,  // Profile, rhythm, hub availability, tone, filters
  dayKey     // Effective day boundary string "YYYY-MM-DD"
);

// Returns:
// {
//   adjustments: { baseHydrationGoal, activityHydrationBonus, adjustedHydrationGoal, isUndoApplied },
//   dailyTotals: { hydrationMl, steps, activeMinutes, microBreaks, mealsCount, ... },
//   streakStatus: { isStreakCounterEnabled, isStreakPaused, hasMeaningfulActionToday, ... },
//   suggestions: [ { id, hubId, title, text, why, actionLabel, deepLink, ... } ],
//   primaryGentleStep: { ... }
// }
```
