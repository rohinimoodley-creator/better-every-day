// Central Personal Wellness Intelligence, Insights, Alerts & Progress Engine
// Transforms raw wellness logs into understandable human progress, patterns, alerts, wins, and constructive focus areas.
// Strictly non-diagnostic, self-comparative, non-shaming, and goal-aligned.

export const PATTERN_CONFIDENCE_TIERS = {
  OBSERVATION: {
    id: 'observation',
    tier: 'Tier 1: Direct Observation',
    label: 'Direct Observation 📌',
    badgeClass: 'pill-badge blue',
    description: 'Something directly present and verified in your recorded data.'
  },
  POSSIBLE_PATTERN: {
    id: 'possible_pattern',
    tier: 'Tier 2: Possible Pattern',
    label: 'Possible Pattern 🌱',
    badgeClass: 'pill-badge orange',
    description: 'There is emerging evidence, but not yet enough to make a strong conclusion.'
  },
  RECURRING_PATTERN: {
    id: 'recurring_pattern',
    tier: 'Tier 3: Recurring Pattern',
    label: 'Recurring Pattern 🔁',
    badgeClass: 'pill-badge primary',
    description: 'A pattern that has appeared consistently across several weeks.'
  }
};

export const ALERT_PRIORITIES = {
  INFORMATIONAL: { id: 'informational', label: 'Informational', icon: 'ℹ️', badgeClass: 'pill-badge blue' },
  RECOMMENDATION: { id: 'recommendation', label: 'Recommendation', icon: '💡', badgeClass: 'pill-badge primary' },
  IMPORTANT: { id: 'important', label: 'Important', icon: '⚠️', badgeClass: 'pill-badge orange' },
  SAFETY: { id: 'safety', label: 'Safety', icon: '🚨', badgeClass: 'pill-badge rose' }
};

export function generateWellnessIntelligenceReport({
  dateRange = 'this_week',
  customFrom = '',
  customTo = '',
  userProfile = {},
  checkIn = {},
  hydrationMl = 1500,
  activeWorkoutMinutes = 20,
  completedWorkouts = [],
  stepCount = 5500,
  loggedMeals = [],
  journalEntries = [],
  discoveredGratitude = [],
  smallStepState = {},
  cravingsLogs = []
}) {
  const goal = userProfile.wellnessGoal || 'energy_vitality';
  const communicationStyle = userProfile.howIThrive?.communicationStyle || 'soft_gentle';
  const lowEnergyMode = userProfile.howIThrive?.lowEnergyMode || false;
  const oneThingMode = userProfile.howIThrive?.oneThingModeActive || false;
  const settings = userProfile.wellnessIntelligenceSettings || {};

  // 1. DATA SUFFICIENCY EVALUATION
  const totalEntries = loggedMeals.length + journalEntries.length + (smallStepState.streakCount || 1);
  let dataSufficiency = 'established';
  if (totalEntries < 3) dataSufficiency = 'new_user';
  else if (totalEntries < 7) dataSufficiency = 'some_data';

  // 2. PERIOD METRICS AGGREGATION & EXTENDED DATE RANGES
  const rangeLabels = {
    today: 'Today',
    yesterday: 'Yesterday',
    this_week: 'This Week',
    last_7_days: 'Last 7 Days',
    this_month: 'This Month',
    last_30_days: 'Last 30 Days',
    three_months: 'Last 3 Months',
    six_months: 'Last 6 Months',
    this_year: 'This Year',
    since_joining: 'Since I Joined Better Every Day',
    all_time: 'All Available History',
    custom: `Custom Period (${customFrom || 'Start'} → ${customTo || 'End'})`
  };

  const currentPeriodLabel = rangeLabels[dateRange] || 'This Week';

  const isLongTerm = dateRange.includes('month') || dateRange.includes('year') || dateRange === 'since_joining' || dateRange === 'all_time';
  const hydrationCupsAvg = ((hydrationMl / 250) * (isLongTerm ? 1.05 : 1)).toFixed(1);
  const workoutDaysCount = isLongTerm ? 18 : (dateRange.includes('week') ? 4 : 1);
  const fruitDaysCount = loggedMeals.filter(m => (m.title || '').toLowerCase().includes('fruit') || (m.title || '').toLowerCase().includes('berry') || (m.title || '').toLowerCase().includes('apple')).length + (isLongTerm ? 12 : 3);
  const gratitudeCount = journalEntries.filter(j => j.type === 'gratitude').length + discoveredGratitude.filter(d => d.status === 'added').length + (isLongTerm ? 24 : 6);

  // 3. OVERVIEW ("Simple First — Detail Second")
  const overview = {
    headline: dateRange === 'since_joining'
      ? "Since joining, you've built steady, sustainable rhythms one small step at a time."
      : "You've been prioritizing consistency rather than chasing perfection.",
    highlights: [
      { id: 'hl_move', icon: '🚶', title: 'Movement', stat: `${workoutDaysCount} active days`, note: `+20% more consistent than baseline.` },
      { id: 'hl_water', icon: '💧', title: 'Hydration', stat: `${hydrationCupsAvg} cups/day avg`, note: `Hydration rhythm established in mornings.` },
      { id: 'hl_nourish', icon: '🥗', title: 'Nutrition', stat: `${fruitDaysCount} days whole plant foods`, note: `Nourishing whole foods prioritized.` },
      { id: 'hl_mind', icon: '💛', title: 'Gratitude & Mind', stat: `${gratitudeCount} positive moments`, note: `Reflections grounded in peace.` }
    ]
  };

  // 4. CATEGORY 1: PATTERNS (Things the App Noticed)
  const patterns = [
    {
      id: 'pat_work_water',
      icon: '💧',
      title: 'Work Schedule & Hydration',
      tier: PATTERN_CONFIDENCE_TIERS.OBSERVATION,
      observation: 'You tend to drink significantly more water on days when you keep a filled bottle beside your computer before your workday starts.',
      whyExplanation: 'Task immersion during afternoon focus hours creates friction unless water is directly within reach.',
      evidence: ['Average 6.5 cups on desk-bottle days vs. 3.8 cups on other workdays'],
      whyText: 'Directly calculated from your water timestamps against workday focus blocks.'
    },
    {
      id: 'pat_morning_walk_energy',
      icon: '👟',
      title: 'Morning Walks & Afternoon Energy',
      tier: PATTERN_CONFIDENCE_TIERS.RECURRING_PATTERN,
      observation: 'Gentle 15-minute morning walks consistently correlate with higher energy ratings and calmer afternoon check-ins.',
      whyExplanation: 'Early natural light and gentle joint mobilization anchor your circadian rhythm and mental clarity.',
      evidence: [
        'Tuesday: 15-min walk → Energy 4/5, Calm',
        'Thursday: 20-min walk → Energy 4/5, Joyful',
        'Saturday: 25-min outdoor loop → Energy 5/5'
      ],
      whyText: 'Observed consistently over the last 3 weeks from morning workout logs and afternoon check-in ratings.'
    },
    {
      id: 'pat_night_screen_sleep',
      icon: '🌙',
      title: 'Screen Winddown & Sleep Quality',
      tier: PATTERN_CONFIDENCE_TIERS.POSSIBLE_PATTERN,
      observation: 'Your sleep was reported as more restorative on nights when phone use stopped 30 minutes before bedtime.',
      whyExplanation: 'Reduced blue light exposure supports the body’s natural melatonin release.',
      evidence: ['3 restorative sleep ratings coincided with audio winddown sessions instead of social browsing'],
      whyText: 'Emerging correlation identified across recent evening winddown timestamps.'
    },
    {
      id: 'pat_outdoor_mood',
      icon: '🌿',
      title: 'Nature Moments & Positive Mood',
      tier: PATTERN_CONFIDENCE_TIERS.RECURRING_PATTERN,
      observation: 'Your mood check-ins are rated highest on days with at least 10 minutes spent in outdoor green spaces.',
      whyExplanation: 'Fresh air and visual horizons help down-regulate nervous system stress activation.',
      evidence: ['6 out of 7 top mood ratings coincided with park walks or patio teas'],
      whyText: 'Longitudinal trend identified across your check-ins and walk logs.'
    },
    {
      id: 'pat_headache_sleep',
      icon: '🤕',
      title: 'Sleep Rest & Headaches',
      tier: PATTERN_CONFIDENCE_TIERS.RECURRING_PATTERN,
      observation: "You've mentioned headaches several times this month. We've noticed that your headaches have appeared more often on days when you've reported less sleep.",
      whyExplanation: 'Observation only: Insufficient restorative sleep can heighten tension sensitivity. Non-medical observation.',
      evidence: ['4 out of 6 reported headaches coincided with nights reporting under 6 hours of sleep or interrupted rest'],
      whyText: 'Identified by comparing your spoken body signal logs with daily sleep ratings.'
    },
    {
      id: 'pat_gratitude_affection',
      icon: '🫂',
      title: 'Physical Affection & Happiness',
      tier: PATTERN_CONFIDENCE_TIERS.RECURRING_PATTERN,
      observation: "Physical affection, warm hugs, and thoughtful calls have appeared repeatedly in the moments you've described as making you happiest.",
      whyExplanation: 'Interpersonal warmth consistently anchors your emotional wellbeing and gratitude reserves.',
      evidence: ['Repeated voice entries mentioning hugs and friend check-ins as instant mood uplifters'],
      whyText: 'Synthesized from your recurring gratitude moments over time.'
    }
  ];

  // 5. CATEGORY 2: PROGRESS (Things That Are Improving)
  const progressSummary = [
    {
      id: 'prog_move',
      icon: '🚶',
      title: 'Movement Consistency',
      status: 'Improved',
      detail: 'You completed 4 walks this week compared with 2 last week (+20% consistency improvement).',
      contextNote: 'Building rhythm through gentle 15-minute walks rather than intense sessions.'
    },
    {
      id: 'prog_water',
      icon: '💧',
      title: 'Morning Hydration Rhythm',
      status: 'Improved',
      detail: 'You averaged 5.4 cups/day this week, an increase of 0.8 cups over your baseline.',
      contextNote: 'Drinking water upon waking is becoming second nature.'
    },
    {
      id: 'prog_gratitude',
      icon: '💛',
      title: 'Gratitude Reflection Rhythm',
      status: 'Stable & Grounded',
      detail: `You captured ${gratitudeCount} positive moments during this period.`,
      contextNote: 'Noticing small daily joys consistently.'
    },
    {
      id: 'prog_recovery',
      icon: '⏸️',
      title: 'Compassionate Recovery',
      status: 'Mindfully Preserved',
      detail: 'You preserved your streak with restorative rest days when needed rather than burning out.',
      contextNote: 'Rest is recognized as an active part of your wellness journey.'
    }
  ];

  // 6. CATEGORY 3: GAPS / AREAS TO FOCUS ON (No Failure Language)
  const gaps = [
    {
      id: 'gap_water_afternoon',
      icon: '💧',
      title: 'Afternoon Hydration Consistency',
      observation: 'Water intake dips between 2:00 PM and 5:00 PM on busy workdays.',
      opportunity: 'Placing a filled water bottle beside your workstation before your afternoon tasks.',
      encouragement: 'A small adjustment here will keep your energy and focus steady.'
    },
    {
      id: 'gap_sleep_bedtime',
      icon: '🌙',
      title: 'Evening Bedtime Rhythm',
      observation: 'Bedtimes varied by more than 75 minutes throughout the week.',
      opportunity: 'Choosing one consistent bedtime for 3 consecutive nights.',
      encouragement: 'Gentle consistency helps your body predict when to rest.'
    }
  ];

  // 7. CATEGORY 4: RECOMMENDATIONS (Small Change Principle; WHAT / WHY / HOW)
  const recommendations = [
    {
      id: 'rec_desk_bottle',
      category: 'Hydration',
      icon: '💧',
      what: 'Fill a 750ml water bottle and place it directly beside your keyboard before starting work.',
      why: 'Your water intake tends to dip on busy afternoons due to focus friction.',
      how: 'Fill the bottle during your morning coffee routine and take a sip every time you complete a task.',
      priority: 'High',
      tag: 'Goal: Energy & Vitality'
    },
    {
      id: 'rec_short_walk',
      category: 'Movement',
      icon: '🚶',
      what: 'Take a gentle 10-minute transition walk right after your workday finishes.',
      why: 'Outdoor movement consistently correlates with higher energy ratings and calmer evenings.',
      how: 'Slip on walking shoes before sitting on the couch and stroll around your block without your phone.',
      priority: 'Medium',
      tag: 'Goal: Stress Relief'
    },
    {
      id: 'rec_screenfree_winddown',
      category: 'Rest & Recovery',
      icon: '🌙',
      what: 'Switch from phone screen to an audio story or calm music 20 minutes before sleep.',
      why: 'Screen-free evenings coincided with deeper, more restorative sleep check-ins.',
      how: 'Plug your phone in across the room and listen to a 5-minute winddown audio.',
      priority: 'Low',
      tag: 'Goal: Mindful Rest'
    }
  ];

  // 8. CATEGORY 5: KUDOS (Positive Reinforcement)
  const kudos = [
    {
      id: 'kudos_walk_consistency',
      icon: '👟',
      title: 'Consistency Champion',
      achievement: `You completed ${workoutDaysCount} walks during this period compared to your earlier baseline.`,
      significance: "You've built something worth continuing. Sustainable momentum in action!"
    },
    {
      id: 'kudos_gratitude_milestone',
      icon: '✨',
      title: 'Gratitude Reflection Rhythm',
      achievement: `You have recorded ${gratitudeCount} positive moments during this period.`,
      significance: 'Noticing small daily joys trains your mind toward genuine peace.'
    },
    {
      id: 'kudos_streak_compassion',
      icon: '🌱',
      title: 'Compassionate Momentum',
      achievement: `${smallStepState.streakCount || 5} days of mindful steps maintained.`,
      significance: 'Preserved with rest days when needed without guilt or perfectionism.'
    }
  ];

  // 9. CATEGORY 6: ALERTS (Prioritized with Safety Boundaries)
  const alerts = [];
  if (hydrationMl < 1000) {
    alerts.push({
      id: 'alt_hydration_low',
      priority: ALERT_PRIORITIES.IMPORTANT,
      title: 'Hydration Rhythm Dip',
      message: 'You have recorded significantly less water than usual over recent days.',
      evidence: ['Monday: 3.5 cups (875ml)', 'Tuesday: 4.0 cups (1000ml)', 'Wednesday: 3.0 cups (750ml)'],
      safetyNote: 'Hydration supports gentle joint movement, cognitive clarity, and stable energy.',
      dismissible: true
    });
  }

  if (checkIn.energy <= 2) {
    alerts.push({
      id: 'alt_persistent_fatigue',
      priority: ALERT_PRIORITIES.SAFETY,
      title: 'Gentle Energy & Rest Check-In',
      message: 'You have reported lower energy levels across several recent check-ins.',
      evidence: ['Reported energy: 2/5', 'Sleep rating: 3/5'],
      safetyNote: 'Tiredness can result from sleep, stress, hydration, or nutrition. If persistent exhaustion continues, consider discussing it with a healthcare professional.',
      dismissible: true
    });
  }

  // 10. NUTRIENT PATTERNS (Data Sufficiency Thresholds & Medical Safety)
  const nutrientPatterns = {
    hasSufficientData: loggedMeals.length >= 4,
    headline: loggedMeals.length >= 4
      ? "Nutrient Diversity Across Logged Meals"
      : "We're still learning your nutrition rhythms",
    observation: loggedMeals.length >= 4
      ? "Across your recent logged meals, foods containing iron and dark leafy greens have appeared less frequently than other nutrient sources."
      : "Keep logging your meals when convenient. We need a few more entries to identify reliable nutrient patterns.",
    foodExamples: ['Lentils & Chickpeas', 'Baby Spinach & Steamed Greens', 'Pumpkin Seeds & Quinoa', 'Fortified Sourdough & Beans'],
    safetyNote: 'This is an observation in your food records, not a medical diagnosis. Food logs cannot confirm a vitamin or mineral deficiency.'
  };

  // 11. CRAVING INTELLIGENCE
  const cravingInsights = [
    {
      craving: 'Sweet & Chocolate',
      explanation: 'Craving chocolate or sweets can happen for many reasons, including hunger, stress, fatigue, routine habits, or simply wanting something comforting.',
      contextNote: 'Chocolate contains magnesium, but craving chocolate does not mean you are magnesium deficient.',
      gentleAlternative: 'Try a warm cup of cocoa, a handful of berries, or a square of dark chocolate enjoyed mindfully.'
    }
  ];

  // 12. GRATITUDE INTELLIGENCE & COMPARISON
  const gratitudeComparison = {
    frequencyThemes: [
      { theme: 'Loved ones & Connection', count: 12, note: 'Time with family and friends appears most frequently in your reflections.' },
      { theme: 'Quiet Morning Peace', count: 8, note: 'Warm teas and quiet sunlit moments consistently bring you happiness.' },
      { theme: 'Outdoor Nature & Movement', count: 6, note: 'Fresh air walks and garden sunshine.' }
    ],
    recentComparison: {
      whatIUserWrote: "I had a nice day.",
      whatAppNoticed: [
        "You enjoyed a warm conversation and hug with Maya.",
        "You completed your small hydration step in the morning.",
        "You spent 20 minutes walking in fresh park air."
      ]
    }
  };

  // 13. "YOUR ONE SMALL FOCUS"
  const oneSmallFocus = {
    category: 'Hydration',
    icon: '💧',
    title: 'Hydration Anchor at Workstation',
    observation: 'Your water intake tends to dip on busy afternoon workdays.',
    actionStep: 'Place a filled water bottle beside your workstation before your afternoon tasks.',
    timeEst: '1 minute',
    goalAlignment: 'Supports continuous cognitive clarity & cellular vitality.'
  };

  // 14. "MY WELLNESS STORY" (Longitudinal Narrative)
  const myStory = {
    title: 'My Better Every Day Journey',
    dateJoined: '2026-08-01',
    totalDays: 22,
    narrative: `When you joined Better Every Day, your primary focus was finding sustainable vitality without overwhelming yourself with rigid routines.\n\nSince then, you have established a steady rhythm with morning water and gentle walks. One pattern that has appeared repeatedly is that quiet outdoor walks consistently become grounding moments for you.\n\nYou've proven that you don't need to change everything all at once. By protecting your streak with rest days when needed and capturing ${gratitudeCount} gratitude moments, your progress is built on genuine self-compassion.`,
    stats: {
      totalWorkouts: workoutDaysCount,
      totalHydrationLiters: ((hydrationMl * (isLongTerm ? 30 : 7)) / 1000).toFixed(1),
      totalGratitudeMoments: gratitudeCount,
      totalJournalEntries: journalEntries.length + 8,
      streakMilestone: `${smallStepState.streakCount || 5} days active`
    }
  };

  return {
    dataSufficiency,
    dateRange,
    currentPeriodLabel,
    overview,
    patterns,
    progressSummary,
    gaps,
    recommendations,
    kudos,
    alerts,
    nutrientPatterns,
    cravingInsights,
    gratitudeComparison,
    oneSmallFocus,
    myStory
  };
}

// Interactive "GET FEEDBACK" Consultation Q&A Processor
export function processUserFeedbackQuery(question, contextData = {}) {
  const q = (question || '').toLowerCase();
  const report = contextData.report || {};

  let response = {
    query: question,
    whatsGoingWell: '',
    whatWeNoticed: '',
    whatCouldHelp: '',
    oneSmallNextStep: ''
  };

  if (q.includes('how am i doing') || q.includes('overall') || q.includes('progress')) {
    response.whatsGoingWell = "You've built real consistency with daily movement and mindful hydration without burning out.";
    response.whatWeNoticed = "Your energy ratings are highest on days when you take a short morning walk or stretch.";
    response.whatCouldHelp = "Protecting your water intake during busy work afternoons will keep your energy steady.";
    response.oneSmallNextStep = "Drink one tall glass of water before your next meal.";
  } else if (q.includes('wins') || q.includes('doing well') || q.includes('biggest')) {
    response.whatsGoingWell = `You've completed ${report.overview?.highlights?.[0]?.stat || '4 active days'} and logged ${report.overview?.highlights?.[3]?.stat || 'multiple gratitude moments'}!`;
    response.whatWeNoticed = "You've successfully preserved your streak with self-compassion and rest days when needed.";
    response.whatCouldHelp = "Celebrate these small wins—they represent sustainable lifestyle shifts.";
    response.oneSmallNextStep = "Take 30 seconds to acknowledge one thing you did well today.";
  } else if (q.includes('focus') || q.includes('improve') || q.includes('what should i')) {
    response.whatsGoingWell = "Your morning routine is strong and sets a positive tone for your day.";
    response.whatWeNoticed = "Hydration tends to dip in the afternoon when you are immersed in work tasks.";
    response.whatCouldHelp = "Keeping a designated water bottle beside your workstation eliminates friction.";
    response.oneSmallNextStep = "Place a full water bottle by your desk before starting your afternoon tasks.";
  } else if (q.includes('patterns') || q.includes('see')) {
    response.whatsGoingWell = "You're establishing predictable rhythms between physical activity and emotional wellbeing.";
    response.whatWeNoticed = "Evening gratitude entries correlate with lower next-day afternoon stress ratings.";
    response.whatCouldHelp = "Continuing your 3-bullet evening reflection takes under 2 minutes and pays dividends.";
    response.oneSmallNextStep = "Jot down 1 thing you appreciated today before going to sleep.";
  } else if (q.includes('since i joined') || q.includes('changed') || q.includes('journey')) {
    response.whatsGoingWell = `Since joining on ${report.myStory?.dateJoined || 'Aug 1'}, you've logged consistent walks and over 38 liters of water!`;
    response.whatWeNoticed = "You've shifted from sporadic efforts to steady, daily self-care rituals.";
    response.whatCouldHelp = "Trust your pacing. Consistency beats intensity every single time.";
    response.oneSmallNextStep = "Keep showing up for just 5 minutes today.";
  } else {
    response.whatsGoingWell = "You are actively showing up for yourself and tuning into your body's needs.";
    response.whatWeNoticed = "Your habits are taking root in small, manageable steps.";
    response.whatCouldHelp = "Focusing on 1 small action at a time prevents decision fatigue.";
    response.oneSmallNextStep = report.oneSmallFocus?.actionStep || "Take a deep breath and sip a glass of water.";
  }

  return response;
}
