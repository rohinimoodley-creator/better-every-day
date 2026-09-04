export const DEFAULT_DAILY_RHYTHM = {
  dayStartTime: '07:00', // e.g. '16:00' for night-shift
  sleepTime: '23:00',    // e.g. '08:00' for day-sleepers
  scheduleVariability: 'same', // 'same' | 'changes'
  shiftType: 'regular',  // 'regular' | 'night_shift' | 'rotating' | 'flexible' | 'custom'
  isShiftOverrideActive: false,
  todayStartOverride: null,
  todaySleepOverride: null,
  customShifts: [],
  shiftNotes: ''
};

export const DEFAULT_HOW_I_THRIVE = {
  // 1. Daily Rhythm & Non-Traditional Schedule Support
  dailyRhythm: DEFAULT_DAILY_RHYTHM,

  // 1. Initial / Progressive Setup
  onboardingCompleted: true,
  feelPreference: 'calm_natural', // 'calm_natural', 'soft_gentle', 'fresh_bright', 'calm_dark', 'energetic', 'playful', 'custom', 'default'

  // 2. Attention & Task Preferences
  taskStyle: 'full_day', // 'one_at_a_time' | 'full_day'
  breakdownTasks: true,
  reminderFormat: 'visual', // 'visual' | 'written' | 'audio'
  routineStyle: 'flexible', // 'flexible' | 'predictable'
  timerPreference: 'countdowns', // 'countdowns' | 'stopwatch' | 'none'
  taskPacing: 'standard', // 'quick' | 'standard' | 'extra_time'
  familiarityPreference: 'variety', // 'variety' | 'familiar'

  // 3. Progressive Complexity
  complexityLevel: 'standard', // 'simple' | 'standard' | 'advanced'

  // 4. Focus & Flow / Quick Start
  focusFlowEnabled: true,
  breakdownDepth: 'moderate', // 'quick' | 'moderate' | 'detailed'
  oneThingModeActive: false,
  quickStartEnabled: true,

  // 5. Flexible Streaks & Breaks
  streaksEnabled: true,
  streakPaused: false,
  streakPauseReason: null, // 'planned_break' | 'recovery' | 'travel' | 'rest_day'

  // 6. Low Energy & Overwhelm Modes
  lowEnergyMode: false,
  overwhelmMode: false,

  // 7. "Don't Rush Me" & Instruction Speed
  instructionSpeed: 'standard', // 'standard' | 'slower' | 'manual_advance'

  // 8. Sensory Preferences
  animationLevel: 'standard', // 'standard' | 'reduced' | 'minimal'
  soundLevel: 'standard', // 'standard' | 'reduced' | 'muted'
  soundNotification: true,
  soundInterface: true,
  soundMascot: true,
  soundWellness: true,
  visualComplexity: 'standard', // 'standard' | 'simplified' | 'minimal'

  // 9. Communication Style
  communicationStyle: 'soft_gentle', // 'soft_gentle' | 'direct_practical' | 'detailed' | 'playful' | 'minimal'

  // 10. Mascot Personalization
  mascotInteractionLevel: 'full', // 'full' | 'occasional' | 'minimal' | 'off'

  // 11. Routines & Visual Daily Schedule
  visualScheduleEnabled: true,

  // 12. Content Preferences & Exclusions
  contentPreferences: {
    showMore: ['Walking', 'Gentle Movement', 'Hydration', 'Gratitude'],
    showLess: [],
    hidden: []
  },

  // 13. Appearance & Themes
  appearanceMode: 'system', // 'light' | 'dark' | 'system'
  themeId: 'sage',
  highContrast: false,
  textSize: 'standard', // 'standard' | 'large' | 'extra_large'
  seasonalSuggestions: true,
  customThemes: [],

  // 14. Notification Personalization & Budget (Consolidated)
  notificationBudget: 3, // 'none' | 1 | 2 | 3 | 5 | 10 | 'unlimited'
  reminderTime: '08:30', // Morning Intention Nudge
  eveningReviewTime: '21:00', // Evening Reflection Reminder
  nudgesEnabled: true, // Mid-day hydration nudges
  quietMode: false,
  focusMode: false,
  sleepModeSchedule: { start: '22:00', end: '07:00' },
  notificationCategories: {
    hydration: true,
    exercise: true,
    meals: true,
    journaling: true,
    affirmations: true,
    calendar: true,
    social: true,
    cycle: false,
    sleep: true,
    insights: true
  }
};

export const DEFAULT_VOICE_SETTINGS = {
  updateMode: 'ask_each_time', // 'always_update' | 'ask_each_time' | 'never_update'
  saveAudio: true,
  saveTranscript: true
};

export const DEFAULT_GRATITUDE_SETTINGS = {
  discoveryMode: 'ask_each_time' // 'always' | 'ask_each_time' | 'never'
};

export const DEFAULT_AI_MEMORY_ITEMS = [
  { id: 'mem_1', category: 'Movement', preference: 'Prefers 15-20 min gentle walks over high-intensity morning workouts', dateAdded: '2026-08-15' },
  { id: 'mem_2', category: 'Hydration', preference: 'Drinks water more consistently when a dedicated bottle is kept at workstation', dateAdded: '2026-08-18' },
  { id: 'mem_3', category: 'Nutrition', preference: 'Enjoys whole plant bowls, quinoa, and fresh berries; avoids rigid calorie restrictions', dateAdded: '2026-08-19' },
  { id: 'mem_4', category: 'Mind & Peace', preference: 'Grounded by 3-bullet evening gratitude reflections and outdoor nature moments', dateAdded: '2026-08-20' }
];

export const DEFAULT_WELLNESS_INTELLIGENCE_SETTINGS = {
  alertsEnabled: true,
  recommendationsEnabled: true,
  positiveInsightsEnabled: true,
  weeklySummaryEnabled: true,
  nutritionalObservationsEnabled: true,
  patternDetectionEnabled: true,
  goalProgressEnabled: true,
  alertDisplayMode: 'on', // 'on' | 'summary_only' | 'off'
  recommendationDisplayMode: 'active', // 'active' | 'insights_only' | 'off'
  insightFrequency: 'smart', // 'smart' | 'daily' | 'weekly' | 'monthly' | 'off'
  insightDeliveryMode: 'everywhere', // 'everywhere' | 'summary_only' | 'ask_first' | 'off'
  density: 'balanced', // 'minimal' | 'balanced' | 'detailed'
  focusCategories: ['Fitness', 'Nutrition', 'Hydration', 'Mind', 'Journaling', 'Gratitude'],
  aiMemoryEnabled: true,
  dismissedInsights: [],
  insightFeedback: {},
  recommendationDismissalReasons: {}
};

export const DEFAULT_USER = {
  id: 'user_1',
  name: 'Rohini',
  avatar: '🌱',
  wellnessGoal: 'energy_vitality',
  affirmationStyle: 'soft_love',
  cycleTrackingEnabled: true,
  syncCycleRecommendations: true,
  cycleLength: 28,
  periodLength: 5,
  lastPeriodStart: '2026-08-10',
  hydrationGoalMl: 2250,
  stepGoal: 8000,
  theme: 'sage',
  mascotHat: 'flower',
  mascotColor: 'sprout',
  howIThrive: DEFAULT_HOW_I_THRIVE,
  voiceSettings: DEFAULT_VOICE_SETTINGS,
  gratitudeSettings: DEFAULT_GRATITUDE_SETTINGS,
  wellnessIntelligenceSettings: DEFAULT_WELLNESS_INTELLIGENCE_SETTINGS
};

export const INITIAL_DISCOVERED_GRATITUDE = [
  {
    id: 'dg_1',
    text: "I'm grateful that I received a warm hug from Devante.",
    rawSource: "Devante hugged me today and I felt really happy.",
    date: '2026-08-21',
    theme: 'People & Relationships',
    icon: '🫂',
    status: 'discovered', // 'discovered' | 'added' | 'rejected' | 'saved_later'
    sourceType: 'voice'
  },
  {
    id: 'dg_2',
    text: "I'm grateful for a quiet morning coffee while listening to bird songs.",
    rawSource: "Sat on the patio drinking coffee for 10 minutes in the sun.",
    date: '2026-08-20',
    theme: 'Small Daily Comforts',
    icon: '☕',
    status: 'added',
    sourceType: 'journal'
  },
  {
    id: 'dg_3',
    text: "I'm grateful that Maya shared her homemade sourdough bread with me.",
    rawSource: "Maya brought over warm fresh sourdough.",
    date: '2026-08-19',
    theme: 'People & Relationships',
    icon: '🍞',
    status: 'added',
    sourceType: 'social'
  }
];

export const DEFAULT_ROUTINES = [
  {
    id: 'rt_morning',
    title: '☀️ Morning Ease Routine',
    category: 'Morning',
    estimatedMin: 15,
    steps: [
      { id: 'ms_1', text: 'Gentle wake up & stretch in bed', durationMin: 2, completed: true, icon: '🛏️' },
      { id: 'ms_2', text: 'Drink 1 tall glass of room-temp water', durationMin: 1, completed: true, icon: '💧' },
      { id: 'ms_3', text: 'Nourishing breakfast & tea', durationMin: 8, completed: false, icon: '🥣' },
      { id: 'ms_4', text: '3-minute morning gratitude or intention', durationMin: 3, completed: false, icon: '✨' }
    ]
  },
  {
    id: 'rt_evening',
    title: '🌙 Evening Calm & Wind-Down',
    category: 'Evening',
    estimatedMin: 20,
    steps: [
      { id: 'es_1', text: 'Dim overhead screens & lights', durationMin: 2, completed: false, icon: '💡' },
      { id: 'es_2', text: 'Herbal chamomile or mint tea', durationMin: 5, completed: false, icon: '🍵' },
      { id: 'es_3', text: 'Evening reflection in journal', durationMin: 5, completed: false, icon: '📖' },
      { id: 'es_4', text: 'Guided 4-7-8 breathing or calm sounds', durationMin: 8, completed: false, icon: '🌬️' }
    ]
  }
];

export const DEFAULT_SCHEDULE = [
  { id: 'sch_1', time: '08:00', title: 'Morning Ease Routine', category: 'Routine', icon: '☀️', status: 'completed' },
  { id: 'sch_2', time: '10:30', title: 'Mid-Morning Hydration Reset', category: 'Hydration', icon: '💧', status: 'completed' },
  { id: 'sch_3', time: '13:00', title: 'Rainbow Nourishment Bowl', category: 'Nourish', icon: '🥗', status: 'current' },
  { id: 'sch_4', time: '17:30', title: 'Fresh Air 15-Min Stroll', category: 'Move', icon: '🚶', status: 'upcoming' },
  { id: 'sch_5', time: '21:00', title: 'Evening Calm & Wind-Down', category: 'Mind', icon: '🌙', status: 'upcoming' }
];

export const CONTENT_CATEGORIES = [
  { id: 'walking', name: 'Walking & Strolls', icon: '🚶' },
  { id: 'gentle_move', name: 'Gentle Mobility & Stretching', icon: '🧘' },
  { id: 'strength', name: 'Strength & Resistance Training', icon: '🏋️' },
  { id: 'running', name: 'Running & Cardio', icon: '🏃' },
  { id: 'nutrition', name: 'Healthy Recipes & Nourishment', icon: '🥗' },
  { id: 'weight_mgmt', name: 'Weight Management', icon: '⚖️' },
  { id: 'mindfulness', name: 'Meditation & Breathwork', icon: '🌬️' },
  { id: 'journaling', name: 'Gratitude & Self-Reflection', icon: '📖' },
  { id: 'menstrual', name: 'Menstrual Wellness & Cycles', icon: '🩸' },
  { id: 'social', name: 'Circles & Group Cheers', icon: '👥' }
];

export const CONNECTED_PROFILES = [
  {
    id: 'user_1',
    name: 'Rohini (You)',
    relation: 'self',
    avatar: '🌱',
    status: 'Feeling energized & calm',
    consistencyStreak: 12,
    privacy: {
      journal: false,
      cycle: false,
      goals: true,
      exercise: true,
      meals: true,
      calendar: true,
      mood: true
    }
  },
  {
    id: 'user_2',
    name: 'Maya',
    relation: 'partner',
    avatar: '🌸',
    status: 'Completed 15-min stretch 🧘',
    consistencyStreak: 9,
    privacy: {
      journal: false,
      cycle: true, // voluntarily shared with partner
      goals: true,
      exercise: true,
      meals: true,
      calendar: true,
      mood: true
    }
  },
  {
    id: 'user_3',
    name: 'Lucas',
    relation: 'friend',
    avatar: '⚡',
    status: 'Crushed a 5k evening walk 👟',
    consistencyStreak: 15,
    privacy: {
      journal: false,
      cycle: false,
      goals: true,
      exercise: true,
      meals: false,
      calendar: true,
      mood: false
    }
  },
  {
    id: 'user_4',
    name: 'Elena',
    relation: 'family',
    avatar: '🌻',
    status: 'Made golden turmeric broth 🍵',
    consistencyStreak: 6,
    privacy: {
      journal: false,
      cycle: false,
      goals: true,
      exercise: false,
      meals: true,
      calendar: false,
      mood: true
    }
  }
];

export const CRAVINGS_DATABASE = [
  {
    id: 'chocolate',
    name: 'Chocolate',
    icon: '🍫',
    category: 'sweet',
    bodySignals: [
      { type: 'Physiological', desc: 'Natural craving for quick blood sugar elevation or comfort chemicals (endorphins, serotonin).' },
      { type: 'Stress / Emotions', desc: 'Chocolate stimulates the release of dopamine and phenylethylamine, soothing tension.' },
      { type: 'Nutritional Consideration', desc: 'One possible nutritional consideration is dietary magnesium, which supports muscle relaxation and nerve function.' }
    ],
    healthyOptions: [
      { name: 'Dark Chocolate (70%+ cacao) with Almonds', tip: 'Rich in antioxidants, magnesium, and healthy fats that stabilize cravings.' },
      { name: 'Warm Cacao & Oat Milk with a dash of Cinnamon', tip: 'Soothing ritual with natural theobromine and zero blood sugar spikes.' },
      { name: 'Chia Chocolate Pudding with Berries', tip: 'High fibre and omega-3s for sustained fullness.' }
    ]
  },
  {
    id: 'salty',
    name: 'Salty Snacks / Chips',
    icon: '🥨',
    category: 'savory',
    bodySignals: [
      { type: 'Hydration & Electrolytes', desc: 'Can be linked to mild dehydration or loss of sodium/potassium after sweating.' },
      { type: 'Adrenal / Stress', desc: 'During periods of chronic stress, your adrenal response can elevate salt preferences.' },
      { type: 'Habit / Crunch', desc: 'The physical act of chewing and crunching relieves jaw tension built up during high stress.' }
    ],
    healthyOptions: [
      { name: 'Lightly Salted Edamame with Sea Salt', tip: 'Packed with plant protein, fibre, and natural electrolytes.' },
      { name: 'Crispy Roasted Seaweed Snacks or Spiced Chickpeas', tip: 'Delivers the crunch and mineral richness with gentle digestion.' },
      { name: 'Cucumber Slices with Himalayan Salt & Olive Oil', tip: 'Immediate cellular hydration plus satisfying salinity.' }
    ]
  },
  {
    id: 'sugar',
    name: 'Sweet Pastries / Candy',
    icon: '🧁',
    category: 'sweet',
    bodySignals: [
      { type: 'Energy Deficit', desc: 'Body signaling a need for fast fuel, often following skipped meals, poor sleep, or an afternoon crash.' },
      { type: 'Sleep Deprivation', desc: 'Ghrelin (hunger hormone) increases when sleep is under 7 hours, amplifying sweet cravings.' },
      { type: 'Nutritional Consideration', desc: 'One possible consideration is fluctuating blood glucose levels or low chromium/zinc support.' }
    ],
    healthyOptions: [
      { name: 'Medjool Dates filled with Peanut Butter', tip: 'Natural caramel sweetness paired with protein and healthy fats.' },
      { name: 'Greek Yogurt with Frozen Blueberries & Honey', tip: 'High protein to curb further cravings, probiotics for gut health.' },
      { name: 'Apple slices with Cinnamon & Tahini', tip: 'Cinnamon helps naturally support stable glucose metabolism.' }
    ]
  },
  {
    id: 'carbs',
    name: 'Bread, Pasta & Pizza',
    icon: '🥖',
    category: 'comfort',
    bodySignals: [
      { type: 'Serotonin Production', desc: 'Carbohydrates facilitate tryptophan entry into the brain, promoting peaceful mood and serotonin.' },
      { type: 'Energy Burn', desc: 'High physical output or long work hours deplete glycogen stores in muscles and liver.' },
      { type: 'Emotional Comfort', desc: 'Warm starchy meals stimulate the parasympathetic rest-and-digest response.' }
    ],
    healthyOptions: [
      { name: 'Toasted Sourdough with Avocado & Soft-Boiled Egg', tip: 'Fermented sourdough is gentle on digestion; eggs provide B vitamins and choline.' },
      { name: 'Sweet Potato Wedges with Rosemary & Sea Salt', tip: 'Complex slow-burning carbohydrates with beta-carotene and fibre.' },
      { name: 'Whole Wheat or Lentil Pasta with Marinara & Spinach', tip: 'High fiber with 18g+ plant protein to prevent sluggishness.' }
    ]
  },
  {
    id: 'crunchy',
    name: 'Crunchy Foods (Nuts, Pretzels)',
    icon: '🥕',
    category: 'texture',
    bodySignals: [
      { type: 'Jaw Tension / Stress Release', desc: 'Chewing hard textures is a common subconscious stress-coping mechanism to release facial tension.' },
      { type: 'Boredom / Focus Trigger', desc: 'Auditory feedback from crunching stimulates alertness during tedious tasks.' }
    ],
    healthyOptions: [
      { name: 'Carrot & Celery Sticks with Creamy Hummus', tip: 'Maximal satisfying crunch with high water content and prebiotic fiber.' },
      { name: 'Handful of Raw Walnuts and Pumpkin Seeds', tip: 'Rich in zinc, magnesium, and plant-based ALA omega-3.' },
      { name: 'Air-popped Popcorn with Nutritional Yeast', tip: 'Satisfying volume food rich in B vitamins and fibre.' }
    ]
  },
  {
    id: 'red_meat',
    name: 'Red Meat / Burger',
    icon: '🥩',
    category: 'protein',
    bodySignals: [
      { type: 'Nutritional Consideration', desc: 'One possible nutritional consideration is bioavailable iron, vitamin B12, or zinc intake.' },
      { type: 'Muscle Recovery', desc: 'Body calling for high-density amino acids following demanding physical training or menstruation.' }
    ],
    healthyOptions: [
      { name: 'Grass-fed Lean Beef or Bison Steak with Greens', tip: 'High heme iron and zinc with zero inflammatory additives.' },
      { name: 'Warm Lentil & Spinach Stew with Squeeze of Lemon', tip: 'Vitamin C from lemon triples plant iron absorption.' },
      { name: 'Portobello Mushroom Burger with Goat Cheese', tip: 'Rich umami flavor with dietary minerals and potassium.' }
    ]
  },
  {
    id: 'cheese',
    name: 'Rich Cheese / Dairy',
    icon: '🧀',
    category: 'savory',
    bodySignals: [
      { type: 'Nutritional Consideration', desc: 'One possible nutritional consideration is dietary calcium, vitamin D, or fatty acid balance.' },
      { type: 'Comfort & Calming', desc: 'Casein in dairy produces casomorphins which trigger gentle soothing and contentment.' }
    ],
    healthyOptions: [
      { name: 'Aged Cheddar or Goat Cheese with Pear Slices', tip: 'Naturally low lactose with rich satisfying flavor in small portions.' },
      { name: 'Cottage Cheese with Crushed Walnuts & Fresh Herbs', tip: 'High casein protein for steady amino acid release.' },
      { name: 'Tahini & Nutritional Yeast Dip', tip: 'Non-dairy calcium and B-complex powerhouse.' }
    ]
  },
  {
    id: 'coffee',
    name: 'Extra Coffee / Energy Drinks',
    icon: '☕',
    category: 'beverage',
    bodySignals: [
      { type: 'Sleep & Circadian Rhythm', desc: 'Adenosine buildup in brain signaling genuine cellular fatigue rather than lack of caffeine.' },
      { type: 'Dehydration', desc: 'Fatigue is frequently the first noticeable symptom of mild dehydration.' },
      { type: 'Habitual Dopamine Cue', desc: 'Morning or 3 PM coffee break provides a mental pause rather than just chemical boost.' }
    ],
    healthyOptions: [
      { name: 'Ceremonial Matcha Green Tea', tip: 'L-theanine creates a smooth, sustained focus without jitters or cortisol spike.' },
      { name: 'Chilled Electrolyte Water with Fresh Lemon', tip: 'Rapid cellular hydration that often eliminates fatigue in 10 minutes.' },
      { name: 'Golden Milk Turmeric Latte with Ashwagandha', tip: 'Nourishes adrenals and promotes calm, grounded stamina.' }
    ]
  }
];

export const RECIPES_DATABASE = [
  {
    id: 'rec_1',
    title: 'Warm Quinoa & Roasted Veggie Rainbow Bowl',
    category: 'Lunch',
    timeMinutes: 20,
    tags: ['High Protein', 'Vegetarian', 'Vegan', 'Budget Friendly'],
    calories: 460,
    macros: { protein: 18, carbs: 62, fat: 16, fiber: 11 },
    micros: { iron: '3.8mg (21%)', calcium: '95mg (10%)', vitC: '65mg (72%)', vitD: '0mcg', folate: '140mcg (35%)', bVitamins: 'High B1, B6' },
    image: '🥗',
    description: 'A comforting, nutrient-dense bowl with fluffy quinoa, roasted sweet potatoes, crispy chickpeas, and a zesty tahini lemon dressing.',
    ingredients: ['1 cup cooked quinoa', '1/2 roasted sweet potato', '1/2 cup spiced chickpeas', '2 cups baby spinach', '1 tbsp pumpkin seeds', '2 tbsp lemon tahini dressing'],
    isCommunity: false
  },
  {
    id: 'rec_2',
    title: 'Wild Salmon with Herb Butter & Steamed Asparagus',
    category: 'Dinner',
    timeMinutes: 25,
    tags: ['Muscle Building', 'Weight Management', 'High Protein'],
    calories: 520,
    macros: { protein: 42, carbs: 12, fat: 32, fiber: 5 },
    micros: { iron: '2.1mg (12%)', calcium: '80mg (8%)', vitC: '22mg (24%)', vitD: '14mcg (70%)', folate: '90mcg (23%)', bVitamins: 'High B12, B3' },
    image: '🐟',
    description: 'Omega-3 rich wild salmon fillet pan-seared to golden perfection, served with lemon-garlic asparagus and steamed new potatoes.',
    ingredients: ['6 oz wild salmon fillet', '1 bunch tender asparagus', '1 tsp grass-fed butter', '1 clove minced garlic', 'Lemon wedges', 'Sea salt & dill'],
    isCommunity: false
  },
  {
    id: 'rec_3',
    title: 'Overnight Chia Berry Oats with Almond Butter',
    category: 'Breakfast',
    timeMinutes: 5,
    tags: ['Budget Friendly', 'High Protein', 'Vegetarian'],
    calories: 380,
    macros: { protein: 16, carbs: 48, fat: 14, fiber: 12 },
    micros: { iron: '3.2mg (18%)', calcium: '280mg (28%)', vitC: '18mg (20%)', vitD: '2.5mcg (12%)', folate: '60mcg (15%)', bVitamins: 'High B1, B2' },
    image: '🥣',
    description: 'Creamy rolled oats soaked in fortified almond milk with chia seeds, topped with wild blueberries and a swirl of almond butter.',
    ingredients: ['1/2 cup rolled oats', '1 tbsp chia seeds', '3/4 cup almond milk', '1/2 cup wild blueberries', '1 tbsp almond butter', '1 tsp raw honey'],
    isCommunity: false
  },
  {
    id: 'rec_4',
    title: 'Hearty Lentil & Spinach Dhal with Brown Rice',
    category: 'Dinner',
    timeMinutes: 30,
    tags: ['Budget Friendly', 'Family Friendly', 'Vegan', 'High Protein'],
    calories: 490,
    macros: { protein: 22, carbs: 74, fat: 9, fiber: 16 },
    micros: { iron: '6.4mg (36%)', calcium: '140mg (14%)', vitC: '35mg (39%)', vitD: '0mcg', folate: '280mcg (70%)', bVitamins: 'High B1, B6, B9' },
    image: '🍲',
    description: 'Traditional warming red lentil dhal infused with turmeric, ginger, cumin, and fresh baby spinach. Gentle on digestion.',
    ingredients: ['3/4 cup red lentils', '1 cup steamed brown rice', '2 cups baby spinach', '1 inch fresh ginger', '1 tsp ground turmeric', '1 can diced tomatoes'],
    isCommunity: false
  },
  {
    id: 'rec_5',
    title: 'Greek Yogurt Super-Seed Crunch Bowl',
    category: 'Snack',
    timeMinutes: 3,
    tags: ['High Protein', 'Vegetarian', 'Weight Management'],
    calories: 260,
    macros: { protein: 23, carbs: 18, fat: 8, fiber: 6 },
    micros: { iron: '1.5mg (8%)', calcium: '320mg (32%)', vitC: '12mg (13%)', vitD: '1.5mcg (8%)', folate: '40mcg (10%)', bVitamins: 'High B12, B2' },
    image: '🫐',
    description: 'Creamy 2% Greek yogurt loaded with organic hemp hearts, chia seeds, fresh raspberries, and a dusting of Ceylon cinnamon.',
    ingredients: ['1 cup plain Greek yogurt', '1 tbsp hemp hearts', '1/2 cup fresh raspberries', '1 tsp chia seeds', 'Pinch of Ceylon cinnamon'],
    isCommunity: true,
    submittedBy: 'Maya (Community Member)',
    status: 'approved'
  }
];

export const WORKOUTS_DATABASE = [
  {
    id: 'w_1',
    title: 'Gentle Morning Spine & Hip Mobility',
    category: 'Mobility & Stretching',
    intensity: 'Gentle',
    durationMin: 8,
    equipment: 'None (Mat Optional)',
    caloriesEst: 35,
    energyLevelNeeded: 1, // 1 (low) to 5 (high)
    description: 'Wake up your joints with soft cat-cows, low lunges, gentle spinal twists, and diaphragmatic breathing.',
    steps: [
      { name: 'Deep Diaphragmatic Breath', durationSec: 60, tip: 'Expand into your ribs and belly.' },
      { name: 'Cat-Cow Flow', durationSec: 90, tip: 'Move vertebra by vertebra with your inhale and exhale.' },
      { name: 'Low Lunge Hip Opener (Left & Right)', durationSec: 120, tip: 'Keep chest lifted and glute gently engaged.' },
      { name: 'Gentle Seated Spinal Twist', durationSec: 90, tip: 'Lengthen your spine before gently rotating.' },
      { name: 'Child’s Pose Relax', durationSec: 120, tip: 'Surrender tension into the floor.' }
    ]
  },
  {
    id: 'w_2',
    title: 'Mindful Nature Walk & Power Stride',
    category: 'Walking',
    intensity: 'Moderate',
    durationMin: 20,
    equipment: 'Walking Shoes',
    caloriesEst: 110,
    energyLevelNeeded: 2,
    description: 'A calming outdoor walk incorporating 3 minutes of sensory awareness followed by steady brisk walking.',
    steps: [
      { name: '5-Sense Grounding Walk', durationSec: 180, tip: 'Notice 3 colors, 2 sounds, and the breeze on your skin.' },
      { name: 'Brisk Pace Stride', durationSec: 600, tip: 'Swing arms naturally and maintain proud posture.' },
      { name: 'Interval Strides', durationSec: 300, tip: 'Walk at 75% effort for 30s, then steady for 30s.' },
      { name: 'Gentle Cool-Down Stroll', durationSec: 120, tip: 'Slow your breathing down.' }
    ]
  },
  {
    id: 'w_3',
    title: 'Full Body Functional Strength Flow',
    category: 'Strength Training',
    intensity: 'Energizing',
    durationMin: 22,
    equipment: 'Bodyweight or Light Dumbbells',
    caloriesEst: 175,
    energyLevelNeeded: 4,
    description: 'Accessible functional movement patterns: squats, hinge, push, pull, and core stability.',
    steps: [
      { name: 'Arm Circles & Hip Openers', durationSec: 120, tip: 'Warm up shoulder and hip capsules.' },
      { name: 'Goblet Squats (or Bodyweight)', durationSec: 180, tip: 'Press through entire foot, knees track toes.' },
      { name: 'Romanian Deadlift Hinge', durationSec: 180, tip: 'Hinge hips back like closing a door with your glutes.' },
      { name: 'Incline or Floor Push-Ups', durationSec: 150, tip: 'Core braced, elbows at 45-degree angle.' },
      { name: 'Alternating Reverse Lunges', durationSec: 180, tip: 'Step back softly, lower back knee gently.' },
      { name: 'Plank Hold with Shoulder Taps', durationSec: 150, tip: 'Keep hips rock steady.' }
    ]
  },
  {
    id: 'w_4',
    title: 'Deep Evening Restorative Yoga for Sleep',
    category: 'Yoga',
    intensity: 'Restorative',
    durationMin: 15,
    equipment: 'Pillows / Bed or Mat',
    caloriesEst: 45,
    energyLevelNeeded: 1,
    description: 'Calm the central nervous system before bed with soothing supported forward folds and legs-up-the-wall.',
    steps: [
      { name: 'Supported Child’s Pose on Pillows', durationSec: 180, tip: 'Let your entire upper body melt into the support.' },
      { name: 'Reclining Butterfly Pose (Supta Baddha)', durationSec: 180, tip: 'Soles of feet together, arms open wide.' },
      { name: 'Supported Bridge Pose', durationSec: 180, tip: 'Place pillow under sacrum for gentle elevation.' },
      { name: 'Legs Up The Wall (Viparita Karani)', durationSec: 240, tip: 'Drains lymphatic fluid and lowers heart rate.' },
      { name: 'Final Deep Body Scan', durationSec: 120, tip: 'Release jaw, brow, and shoulders.' }
    ]
  },
  {
    id: 'w_5',
    title: 'Pilates Core & Posture Alignment',
    category: 'Pilates',
    intensity: 'Moderate',
    durationMin: 15,
    equipment: 'Mat',
    caloriesEst: 95,
    energyLevelNeeded: 3,
    description: 'Strengthen the deep transverse abdominis and posterior chain for taller, pain-free posture.',
    steps: [
      { name: 'Pelvic Tilts & Imprint', durationSec: 90, tip: 'Engage pelvic floor and lower belly gently.' },
      { name: 'The Pilates Hundred (Modified)', durationSec: 120, tip: 'Pump arms rhythmically with 5-count breath.' },
      { name: 'Single Leg Stretch', durationSec: 180, tip: 'Keep lower back stable against the mat.' },
      { name: 'Bird-Dog Stability', durationSec: 180, tip: 'Extend opposite arm and leg without arching spine.' },
      { name: 'Swimming Posture Strengthener', durationSec: 150, tip: 'Strengthen upper back muscles and lats.' }
    ]
  }
];

export const VERIFIED_GYMS = [
  { id: 'gym_1', name: 'Fit24 — Oceans Mall', city: 'Durban', address: '12 Oceans Dr, Umhlanga', memberCount: 142, icon: '🏋️' },
  { id: 'gym_2', name: 'Virgin Active — Gateway', city: 'Durban', address: 'Gateway Theatre of Shopping', memberCount: 215, icon: '💪' },
  { id: 'gym_3', name: 'Metropolitan YMCA Community Hub', city: 'Central', address: '45 Community Way', memberCount: 88, icon: '🏊' },
  { id: 'gym_home', name: 'Home Workout Sanctuary', city: 'Home', address: 'Personal Living Space', memberCount: 1, icon: '🏡' },
  { id: 'gym_outdoors', name: 'Emerald River Park Trails', city: 'Outdoors', address: 'River Loop Trailhead', memberCount: 64, icon: '🌲' },
  { id: 'gym_none', name: "I don't have a gym (No gym preference)", city: 'N/A', address: 'None', memberCount: 0, icon: '✨' }
];

export const INITIAL_GYM_COMMUNITIES = {
  gym_1: {
    gymId: 'gym_1',
    name: 'Fit24 — Oceans Mall Community',
    joined: false,
    promptState: 'pending', // 'pending' | 'joined' | 'maybe_later' | 'dont_show'
    discussions: [
      {
        id: 'disc_1',
        author: 'Sarah M. (Anonymous Member)',
        avatar: '🌱',
        title: 'Beginner friendly hours?',
        content: 'Hi everyone! What are the quietest times for the free weights section? Just starting out!',
        time: '3 hours ago',
        repliesCount: 4,
        likes: 6,
        isLiked: false
      },
      {
        id: 'disc_2',
        author: 'Coach Marcus',
        avatar: '💪',
        title: 'Weekend Group Stretch & Mobility',
        content: 'Free 20-min community mobility flow this Saturday at 08:30 AM on the turf area. All fitness levels welcome!',
        time: 'Yesterday',
        repliesCount: 8,
        likes: 15,
        isLiked: true
      }
    ],
    tips: [
      { id: 'tip_1', author: 'Alex T.', text: 'The treadmills facing the garden view are usually less busy before 9:00 AM!', likes: 12 },
      { id: 'tip_2', author: 'Priya K.', text: 'Staff can show you how to adjust the cable machine height—they are super helpful.', likes: 9 },
      { id: 'tip_3', author: 'David L.', text: 'The 2km walking loop around Oceans Mall is shaded and great for warmups.', likes: 14 }
    ],
    activities: [
      { id: 'act_1', title: 'Saturday Morning Community Walk', time: 'Saturday, 08:00 AM', meetingPoint: 'Main Entrance Cafe', participants: 7, joined: false },
      { id: 'act_2', title: 'Gentle Evening Stretch & Foam Roll', time: 'Tuesday, 18:00 PM', meetingPoint: 'Studio B', participants: 5, joined: true }
    ],
    members: [
      { id: 'mem_1', name: 'Sarah M.', avatar: '🌱', displayNameType: 'anonymous', interests: ['Walking', 'Gentle Mobility'] },
      { id: 'mem_2', name: 'Coach Marcus', avatar: '💪', displayNameType: 'username', interests: ['Strength', 'Recovery'] },
      { id: 'mem_3', name: 'Priya K.', avatar: '✨', displayNameType: 'real_name', interests: ['Yoga', 'Cardio'] }
    ]
  }
};

export const INITIAL_SHARED_PLANS = [
  {
    id: 'plan_1',
    title: 'Couple Sunset Walking Rhythm',
    type: 'partner', // 'individual' | 'partner' | 'group'
    category: 'Movement',
    icon: '🚶',
    participants: [
      { userId: 'user_1', name: 'Rohini (You)', target: '30-minute walk', targetDaysPerWeek: 3, completedThisWeek: 2 },
      { userId: 'user_2', name: 'Maya (Partner)', target: '20-minute gentle stroll', targetDaysPerWeek: 3, completedThisWeek: 2 }
    ],
    schedule: 'Mon, Wed, Fri at 18:00',
    notes: 'Gentle, conversational pace. No phone notifications.'
  },
  {
    id: 'plan_2',
    title: 'Friends Weekend Movement & Coffee',
    type: 'group',
    category: 'Movement & Social',
    icon: '👟',
    participants: [
      { userId: 'user_1', name: 'Rohini', target: '5,000 steps', completedThisWeek: 1 },
      { userId: 'user_3', name: 'Lucas', target: '8,000 steps', completedThisWeek: 1 },
      { userId: 'user_4', name: 'Elena', target: '20-min mobility', completedThisWeek: 1 }
    ],
    schedule: 'Saturday Morning at 09:00',
    notes: 'Coffee at the green market after the park loop.'
  },
  {
    id: 'plan_3',
    title: 'Household Rainbow Meal Prep',
    type: 'partner',
    category: 'Nutrition',
    icon: '🥗',
    permissions: { view: true, edit: true, suggest: true, approve: true },
    participants: [
      { userId: 'user_1', name: 'Rohini', role: 'Produce & Slicing' },
      { userId: 'user_2', name: 'Maya', role: 'Grains & Sauces' }
    ],
    dishes: ['Quinoa Salad with Roasted Chickpeas', 'Steamed Greens with Sesame Dressing', 'Fresh Berry Chia Pots'],
    schedule: 'Sunday at 16:00'
  }
];

export const INITIAL_SOCIAL_CHALLENGES = [
  {
    id: 'chal_walk',
    title: '7-Day Gentle Walking Rhythm',
    category: 'Movement',
    icon: '🚶',
    description: 'Walk for at least 10 minutes each day at whatever pace feels good to you. Flexible and non-punitive.',
    participantsCount: 38,
    daysLeft: 3,
    joined: true,
    userProgress: 4, // 4 of 7 days completed
    totalDays: 7,
    isPaused: false,
    pauseReason: '',
    type: 'community',
    individualBaseline: '10 mins daily',
    groupProgressPercent: 78
  },
  {
    id: 'chal_water',
    title: 'Hydration Week: Savor Every Glass',
    category: 'Hydration',
    icon: '💧',
    description: 'Drink a glass of water mindfully upon waking and before each meal.',
    participantsCount: 52,
    daysLeft: 5,
    joined: true,
    userProgress: 2,
    totalDays: 7,
    isPaused: false,
    pauseReason: '',
    type: 'friend',
    individualBaseline: '5 cups daily',
    groupProgressPercent: 64
  },
  {
    id: 'chal_gratitude',
    title: 'Gratitude Reflection Challenge',
    category: 'Mind',
    icon: '✨',
    description: 'Capture 1 moment of appreciation or peace each evening.',
    participantsCount: 64,
    daysLeft: 4,
    joined: false,
    userProgress: 0,
    totalDays: 7,
    isPaused: false,
    pauseReason: '',
    type: 'community',
    individualBaseline: '1 reflection daily',
    groupProgressPercent: 82
  },
  {
    id: 'chal_screenfree',
    title: '30-Min Screen-Free Evening Winddown',
    category: 'Rest & Recovery',
    icon: '🌙',
    description: 'Put your phone away 30 minutes before sleep to support natural melatonin production.',
    participantsCount: 29,
    daysLeft: 6,
    joined: false,
    userProgress: 0,
    totalDays: 7,
    isPaused: false,
    pauseReason: '',
    type: 'partner',
    individualBaseline: '20 mins audio',
    groupProgressPercent: 50
  }
];

export const INITIAL_BADGES_DATABASE = [
  { id: 'badge_1', title: '🌱 First Small Step', category: 'Momentum', icon: '🌱', description: 'Completed your first daily mindful wellness action.', dateEarned: '2026-08-01', unlocked: true },
  { id: 'badge_2', title: '🚶 First 10 Walks', category: 'Movement', icon: '👟', description: 'Showed up for 10 gentle walking sessions.', dateEarned: '2026-08-15', unlocked: true },
  { id: 'badge_3', title: '💧 Hydration Habit', category: 'Nourishment', icon: '💧', description: 'Consistently drank water upon waking for 7 consecutive days.', dateEarned: '2026-08-18', unlocked: true },
  { id: 'badge_4', title: '📖 First Journal Week', category: 'Mindfulness', icon: '📖', description: 'Captured your thoughts and emotions across 7 daily entries.', dateEarned: '2026-08-20', unlocked: true },
  { id: 'badge_5', title: '💛 Gratitude Practice', category: 'Peace', icon: '💛', description: 'Recorded 20 micro-moments of joy and gratitude.', dateEarned: '2026-08-21', unlocked: true },
  { id: 'badge_6', title: '🔥 Consistency Builder', category: 'Habits', icon: '🔥', description: 'Maintained sustainable rhythm while protecting rest days.', dateEarned: null, unlocked: false, progressText: '5 / 14 Days' },
  { id: 'badge_7', title: '🏃 Movement Milestone', category: 'Vitality', icon: '🏃', description: 'Accumulated 100 active walking and mobility minutes.', dateEarned: null, unlocked: false, progressText: '65 / 100 Mins' }
];

export const INITIAL_SHARED_COMMUNITY_THEMES = [
  { id: 'th_beach_sunset', title: 'Beach Sunset Glow', author: 'Maya', avatar: '👩', primaryColor: '#d95d39', accentColor: '#e07a5f', icon: '🌅', description: 'Warm peachy hues inspired by golden hour strolls by the coastline.', sharesCount: 38 },
  { id: 'th_forest_sanctuary', title: 'Forest Canopy Sanctuary', author: 'Lucas', avatar: '👨', primaryColor: '#2d6a4f', accentColor: '#52b788', icon: '🌲', description: 'Deep moss greens and earthy tones for a grounded, tranquil headspace.', sharesCount: 45 },
  { id: 'th_lavender_mist', title: 'Lavender Mist', author: 'Elena', avatar: '🌸', primaryColor: '#6c5ce7', accentColor: '#a29bfe', icon: '🌸', description: 'Soft lilac and purple pastels to calm an overstimulated nervous system.', sharesCount: 29 }
];

export const INITIAL_SOCIAL_FEED_POSTS = [
  {
    id: 'post_1',
    author: 'Maya',
    avatar: '👩',
    relationship: 'Partner',
    time: '2h ago',
    text: 'Completed our sunset walk loop around the park trail! Feeling so grounded 🌿✨',
    activityBadge: '🚶 3.2 km Sunset Walk',
    reactions: { love: 5, clap: 4, proud: 6, momentum: 3 },
    userReaction: 'love'
  },
  {
    id: 'post_2',
    author: 'Lucas',
    avatar: '👨',
    relationship: 'Friend',
    time: '4h ago',
    text: 'Hit my daily hydration target before 4:00 PM for the 3rd day in a row 💧',
    activityBadge: '💧 2.25L Hydration Goal',
    reactions: { love: 3, clap: 7, proud: 2, momentum: 5 },
    userReaction: null
  },
  {
    id: 'post_3',
    author: 'Elena',
    avatar: '🌸',
    relationship: 'Gym Crew',
    time: 'Yesterday',
    text: 'Finished a 15-minute restorative foam rolling flow after work 🧘',
    activityBadge: '🧘 15-Min Foam Roll Flow',
    reactions: { love: 4, clap: 3, proud: 5, momentum: 2 },
    userReaction: 'proud'
  }
];

export const INITIAL_SOCIAL_SETTINGS = {
  socialQuietMode: false,
  socialParticipationLevel: 'friends', // 'private' | 'friends' | 'community' | 'competitive'
  calendarInvitationPolicy: 'friends_only', // 'friends_only' | 'followers' | 'anyone'
  gymDiscoverability: false,
  gymListedOnProfile: true,
  communityDisplayName: 'Rohini',
  displayNameType: 'real_name', // 'real_name' | 'username' | 'custom' | 'anonymous'
  leaderboardOptIn: false, // OFF by default
  leaderboardMode: 'supportive', // 'supportive' | 'competitive' | 'private'
  leaderboardScope: 'friends', // 'friends' | 'gym' | 'regional' | 'global'
  themeSharingPrivacy: 'friends', // 'private' | 'friends' | 'public'
  cheersEnabled: true,
  partnerMenstrualSharing: true // simplified non-invasive partner supportive advice
};

export const INITIAL_RELATIONSHIPS = [
  {
    id: 'user_2',
    name: 'Maya',
    avatar: '👩',
    relationshipType: 'friend', // 'friend' (mutual) | 'following' | 'follower'
    labels: ['Partner', 'Accountability Partner'],
    accountabilityFocus: 'Daily Evening Walk & Hydration',
    isMutual: true,
    status: 'Feeling peaceful today 🌿',
    privacy: {
      exercise: true,
      steps: true,
      water: true,
      meals: true,
      calendar: true,
      mood: true,
      cycle: true, // Partner support enabled
      journal: false,
      insights: false
    }
  },
  {
    id: 'user_3',
    name: 'Lucas',
    avatar: '👨',
    relationshipType: 'friend',
    labels: ['Friend', 'Gym buddy'],
    accountabilityFocus: 'Weekend Movement',
    isMutual: true,
    status: 'Prepping for Saturday morning walk 👟',
    privacy: {
      exercise: true,
      steps: true,
      water: false,
      meals: false,
      calendar: true,
      mood: false,
      cycle: false,
      journal: false,
      insights: false
    }
  },
  {
    id: 'user_4',
    name: 'Elena',
    avatar: '✨',
    relationshipType: 'following', // One-way following
    labels: ['Wellness buddy'],
    isMutual: false,
    status: 'Enjoying mindful morning coffee ☕',
    privacy: {
      exercise: false,
      steps: false,
      water: false,
      meals: false,
      calendar: false,
      mood: false,
      cycle: false,
      journal: false,
      insights: false
    }
  }
];

export const WELLNESS_CIRCLES_DATABASE = [
  {
    id: 'c_1',
    name: '💛 Besties & Daily Steps',
    type: 'Friends',
    membersCount: 3,
    avatar: '💛',
    labels: ['Besties', 'Daily Movement'],
    members: ['Rohini', 'Maya', 'Lucas'],
    currentChallenge: {
      title: '7-Day Gentle Movement Rhythm',
      desc: 'Move for 15+ mins daily. No shaming, just daily cheers!',
      progressPercent: 78,
      daysLeft: 2
    },
    activityFeed: [
      { user: 'Maya', text: 'Just completed 20-min sunset stroll with Rohini 🌿', time: '1 hr ago', cheers: 3 },
      { user: 'Lucas', text: 'Hit 7k steps around the park trail 👟', time: '3 hrs ago', cheers: 4 },
      { user: 'Rohini', text: 'Completed today’s Small Step (hydration & stretch)! 🌱', time: '4 hrs ago', cheers: 2 }
    ]
  },
  {
    id: 'c_2',
    name: '🏃 Fit24 Gym Crew',
    type: 'Gym buddies',
    membersCount: 4,
    avatar: '🏃',
    labels: ['Gym Crew', 'Strength & Mobility'],
    members: ['Rohini', 'Lucas', 'Coach Marcus', 'Sarah M.'],
    currentChallenge: {
      title: 'Mobility & Form Week',
      desc: 'Complete 2 stretch/foam roll recovery sessions.',
      progressPercent: 85,
      daysLeft: 4
    },
    activityFeed: [
      { user: 'Coach Marcus', text: 'Great mobility session today team! Rest well tonight 🧘', time: '2 hrs ago', cheers: 5 },
      { user: 'Rohini', text: 'Tried the new hamstring mobility flow—felt amazing ✨', time: '5 hrs ago', cheers: 6 }
    ]
  },
  {
    id: 'c_3',
    name: '🏡 Family Vitality',
    type: 'Family',
    membersCount: 4,
    avatar: '🏡',
    labels: ['Family', 'Nourishment'],
    members: ['Rohini', 'Maya', 'Mom', 'David'],
    currentChallenge: {
      title: 'Whole Plant Diversity',
      desc: 'Incorporate 1 colorful vegetable into dinner.',
      progressPercent: 90,
      daysLeft: 3
    },
    activityFeed: [
      { user: 'Mom', text: 'Made fresh butternut soup with rosemary from the garden 🍲', time: '4 hrs ago', cheers: 5 }
    ]
  }
];

export const SOCIAL_CALENDAR_EVENTS = [
  {
    id: 'evt_1',
    title: 'Sunset Park Walk & Catch-Up',
    date: '2026-08-22',
    time: '18:30',
    location: 'Emerald River Park Trail',
    withUser: 'Maya (Partner)',
    category: 'Walk & Talk',
    status: 'accepted', // 'pending' | 'accepted' | 'declined' | 'reschedule_requested'
    proposedBy: 'Rohini',
    notes: 'Grab a matcha and walk the 3km loop together.'
  },
  {
    id: 'evt_2',
    title: 'Weekend Farmer’s Market & Meal Prep',
    date: '2026-08-23',
    time: '10:00',
    location: 'City Green Market',
    withUser: 'Lucas (Friend)',
    category: 'Nourish',
    status: 'pending',
    proposedBy: 'Lucas',
    notes: 'Pick up seasonal berries, sourdough, and fresh greens.'
  },
  {
    id: 'evt_3',
    title: 'Restorative Sunday Partner Yoga',
    date: '2026-08-24',
    time: '19:00',
    location: 'Living Room Studio',
    withUser: 'Maya (Partner)',
    category: 'Move',
    status: 'reschedule_requested',
    proposedBy: 'Devan',
    rescheduleNote: 'Can we do 19:30 instead after dinner wraps up? 🧘'
  }
];

export const AFFIRMATIONS_DATA = {
  soft_love: [
    { text: "You don't need to change everything. Just making today a tiny bit gentler is enough.", theme: "Peace" },
    { text: "Your worth is not measured by your productivity. Rest is a form of nourishment.", theme: "Self-Compassion" },
    { text: "Honor where your body is right now. Healing and growth happen in soft, steady increments.", theme: "Listening" },
    { text: "Tomorrow is another opportunity. Breathe in ease, exhale self-criticism.", theme: "Kindness" },
    { text: "Small steps taken with love create lasting transformations.", theme: "Patience" },
    { text: "You are allowed to go slow. Slowness is not stagnation; it is presence.", theme: "Presence" }
  ],
  tough_love: [
    { text: "Consistency beats motivation every single time. Show up for yourself for just five minutes today.", theme: "Accountability" },
    { text: "The discipline you build today is the peace you enjoy tomorrow. Put the phone down and take the walk.", theme: "Focus" },
    { text: "You don't need the perfect routine—you just need to take one real action right now.", theme: "Action" },
    { text: "Excuses comfort your comfort zone, not your future self. Drink your water and move.", theme: "Strength" },
    { text: "Stop waiting for the 'ideal time'. The time you have right now is enough to take one small step.", theme: "Grit" }
  ]
};

export const INITIAL_JOURNAL_ENTRIES = [
  {
    id: 'j_1',
    type: 'gratitude',
    title: 'Morning Light & Fresh Start',
    date: '2026-08-21',
    aestheticId: 'nature',
    entries: [
      'The cool morning breeze coming through the open window.',
      'A warm cup of chamomile tea before anyone else woke up.',
      'Feeling rested after getting to bed before 10:30 PM.'
    ],
    stickers: ['🌱', '☕', '✨'],
    moodStamp: 'Calm & Content',
    notes: 'Today I reminded myself that I don’t have to rush through the day to be worthy of rest.'
  },
  {
    id: 'j_2',
    type: 'manifestation',
    title: 'Future Self: Grounded & Energized',
    date: '2026-08-20',
    aestheticId: 'beach',
    entries: [
      'I wake up feeling refreshed and unhurried in my body.',
      'I prioritize daily movement not for aesthetics, but for mental clarity and joy.',
      'I listen to what my body asks for with curiosity instead of judgment.'
    ],
    stickers: ['🌊', '🌅', '🏄'],
    moodStamp: 'Inspired',
    notes: 'Visualizing my daily rituals becoming effortless second nature.'
  }
];

// =========================================================================
// PROMPT 7: DATA RELIABILITY, WEARABLES, SYNC & USER TRUST
// =========================================================================

export const DATA_SOURCE_TYPES = {
  USER_ENTERED: { id: 'manual', label: 'User Entered (Manual)', icon: '✍️', badgeClass: 'pill-badge blue' },
  AUTO_DETECTED_PHONE: { id: 'phone', label: 'Phone Sensors', icon: '📱', badgeClass: 'pill-badge gray' },
  AUTO_DETECTED_WEARABLE: { id: 'smartwatch', label: 'Smartwatch / Wearable', icon: '⌚', badgeClass: 'pill-badge primary' },
  IMPORTED_PLATFORM: { id: 'imported', label: 'Health Platform Import', icon: '🌐', badgeClass: 'pill-badge green' },
  AI_INTERPRETED_VOICE: { id: 'voice', label: 'Voice AI Interpreted', icon: '🎙️', badgeClass: 'pill-badge orange' }
};

export const CONFIDENCE_LEVELS = {
  HIGH: { id: 'high', label: 'High Confidence', score: 0.95 },
  MEDIUM: { id: 'medium', label: 'Medium (Interpreted)', score: 0.75 },
  LOW: { id: 'low', label: 'Low (Tentative)', score: 0.5 }
};

export const CONNECTED_DEVICES_DATABASE = [
  {
    id: 'dev_apple_watch',
    name: 'Apple Watch Ultra',
    category: 'Smartwatch',
    icon: '⌚',
    connected: true,
    lastSynced: '2 mins ago',
    status: 'synced', // 'synced' | 'syncing' | 'error' | 'disconnected'
    batteryPercent: 82,
    permissions: [
      { key: 'steps', name: 'Step Cadence & Daily Walking', granted: true, reason: 'Automatically sync movement without manual tracking' },
      { key: 'workouts', name: 'Workout Heart Rate & Duration', granted: true, reason: 'Log completed exercise sessions' },
      { key: 'sleep', name: 'Sleep Stages & Rest Duration', granted: true, reason: 'Provide gentle rest and recovery observations' }
    ]
  },
  {
    id: 'dev_garmin',
    name: 'Garmin Venu 3',
    category: 'Sport Watch',
    icon: '⌚',
    connected: false,
    lastSynced: 'Yesterday',
    status: 'disconnected',
    permissions: [
      { key: 'gps_tracks', name: 'Outdoor Trail GPS & Pace', granted: false, reason: 'Calculate accurate walking distances' },
      { key: 'body_battery', name: 'Rest & Recovery Metrics', granted: false, reason: 'Support low energy day adaptations' }
    ]
  },
  {
    id: 'dev_health_connect',
    name: 'Google Health Connect / Apple Health',
    category: 'Health Platform',
    icon: '📱',
    connected: true,
    lastSynced: '15 mins ago',
    status: 'synced',
    permissions: [
      { key: 'hydration', name: 'Water & Hydration Sync', granted: true, reason: 'Sync water logged in third-party bottles/apps' },
      { key: 'nutrition', name: 'Dietary Macros & Meals', granted: false, reason: 'Import meals logged in nutrition apps' }
    ]
  },
  {
    id: 'dev_fitbit',
    name: 'Fitbit Charge 6',
    category: 'Fitness Tracker',
    icon: '⌚',
    connected: false,
    lastSynced: 'Never',
    status: 'disconnected',
    permissions: [
      { key: 'active_zone', name: 'Active Zone Minutes', granted: false, reason: 'Track movement goals' }
    ]
  }
];

export const INITIAL_DATA_ANOMALIES = [
  {
    id: 'anom_1',
    metric: 'Step Cadence',
    detectedValue: '34,200 steps in 45 mins',
    timestamp: 'Today, 14:15',
    source: 'Smartwatch Sensor Sync',
    neutralExplanation: 'This activity looks unusual compared with your recent average (possible device bump, transit vibration, or sync delay).',
    status: 'pending_review', // 'pending_review' | 'confirmed' | 'corrected' | 'dismissed'
    possibleCauses: ['Device sensor error during bumpy transit', 'Sync delay backlog from previous days', 'Manual step entry adjustment', 'Genuine high-output endurance session']
  }
];

export const INITIAL_DUPLICATE_SUGGESTIONS = [
  {
    id: 'dup_1',
    category: 'Movement & Walking',
    timestamp: 'Today, 18:30 - 19:00',
    itemA: { id: 'log_a', title: 'Sunset Park Walk (30 mins)', source: 'Smartwatch Auto-Detect', steps: 3420, calories: 120 },
    itemB: { id: 'log_b', title: 'Sunset Loop with Maya (30 mins)', source: 'Manual User Log', steps: 3500, calories: 125 },
    neutralPrompt: 'This looks similar to an activity already recorded on your Apple Watch. Would you like to combine them into one complete log?',
    status: 'pending' // 'pending' | 'combined' | 'kept_both' | 'ignored'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'aud_1',
    timestamp: 'Today, 18:45',
    category: 'Exercise',
    original: 'Voice interpreted: "I walked for 20 minutes"',
    modified: 'User corrected to: "15-minute gentle stroll"',
    author: 'Rohini (User)',
    source: 'Voice AI → User Edit'
  },
  {
    id: 'aud_2',
    timestamp: 'Today, 11:30',
    category: 'Hydration',
    original: 'Voice interpreted: "Drank 5 cups of water"',
    modified: 'Confirmed as 1250ml water intake',
    author: 'Rohini (User Confirmation)',
    source: 'Voice AI Confirmation'
  }
];

export const INITIAL_BODY_SIGNALS = [
  {
    id: 'bs_1',
    signal: 'Headache',
    date: '2026-08-20',
    time: '15:30',
    severity: 'Mild',
    duration: '45 mins',
    notes: 'Afternoon screen fatigue; subsided after a tall glass of water and 10 mins away from desk.',
    icon: '🤕'
  },
  {
    id: 'bs_2',
    signal: 'Tummy Ache',
    date: '2026-08-18',
    time: '13:15',
    severity: 'Moderate',
    duration: '30 mins',
    notes: 'Felt slight bloat/cramp after eating lunch in a hurry.',
    icon: '🤢'
  },
  {
    id: 'bs_3',
    signal: 'Fatigue',
    date: '2026-08-16',
    time: '16:00',
    severity: 'Mild',
    duration: '1 hour',
    notes: 'Afternoon lull following a night of 5.5 hours sleep.',
    icon: '🥱'
  }
];

export const TRACKING_CATEGORIES_DIRECTORY = [
  {
    id: 'body_wellness',
    name: 'Body & Wellness',
    icon: '💧',
    badge: '9 Signals',
    desc: 'Hydration, rest, energy, and physical sensations.',
    voiceExample: 'Say: "I had a mild headache this afternoon"',
    targetTab: 'NOURISH',
    subcategories: [
      { id: 'hydration', label: 'Hydration & Water Intake', targetTab: 'HYDRATE', actionType: 'hydration' },
      { id: 'sleep', label: 'Sleep Quality & Wind-Down', targetTab: 'TODAY', actionType: 'checkin' },
      { id: 'energy', label: 'Daily Energy Rhythm', targetTab: 'TODAY', actionType: 'checkin' },
      { id: 'headaches', label: 'Headaches & Tension', targetModal: 'body_signals', actionType: 'signal_headache' },
      { id: 'tummy_aches', label: 'Tummy & Digestive Aches', targetModal: 'body_signals', actionType: 'signal_tummy' },
      { id: 'back_aches', label: 'Back & Posture Aches', targetModal: 'body_signals', actionType: 'signal_back' },
      { id: 'toilet_freq', label: 'Toilet & Digestion Frequency', targetModal: 'body_signals', actionType: 'signal_toilet' },
      { id: 'fatigue', label: 'Fatigue & Low Energy Dips', targetModal: 'body_signals', actionType: 'signal_fatigue' },
      { id: 'nausea', label: 'Nausea & Dizziness', targetModal: 'body_signals', actionType: 'signal_nausea' }
    ]
  },
  {
    id: 'nourish',
    name: 'Nourish & Food',
    icon: '🥗',
    badge: '5 Features',
    desc: 'Wholesome meals, fiber diversity, and cravings.',
    voiceExample: 'Say: "I ate an apple and chicken for lunch"',
    targetTab: 'NOURISH',
    subcategories: [
      { id: 'meals', label: 'Meal & Dish Logging', targetTab: 'NOURISH' },
      { id: 'plant_diversity', label: 'Plant Diversity & Colors', targetTab: 'NOURISH' },
      { id: 'cravings', label: 'Craving Body Translator', targetTab: 'NOURISH' },
      { id: 'nutrition_gaps', label: 'Nutrient Pattern Awareness', targetTab: 'NOURISH' },
      { id: 'recipes', label: 'Community Recipes', targetTab: 'NOURISH' }
    ]
  },
  {
    id: 'move',
    name: 'Move & Activity',
    icon: '🏃',
    badge: '4 Features',
    desc: 'Walking, running, workout timers, and custom routines.',
    voiceExample: 'Say: "I walked for 20 minutes in the sunshine"',
    targetTab: 'MOVE',
    subcategories: [
      { id: 'live_tracker', label: 'Live Walking & Running Tracker', targetTab: 'MOVE' },
      { id: 'step_sync', label: 'Pedometer & Step Count', targetTab: 'MOVE' },
      { id: 'workouts', label: 'Guided Workout Player', targetTab: 'MOVE' },
      { id: 'custom_builder', label: 'Custom Workout Creator', targetTab: 'MOVE' }
    ]
  },
  {
    id: 'mind',
    name: 'Mind & Mindfulness',
    icon: '🧠',
    badge: '5 Features',
    desc: 'Unified journal, gratitude, affirmations, and calm audio.',
    voiceExample: 'Say: "I am grateful that Devante hugged me today"',
    targetTab: 'MIND',
    subcategories: [
      { id: 'unified_journal', label: 'Unified Journal Studio', targetTab: 'MIND' },
      { id: 'gratitude_journal', label: 'Gratitude Discoveries', targetTab: 'MIND' },
      { id: 'affirmations', label: 'Mindset Affirmations', targetTab: 'MIND' },
      { id: 'soundscapes', label: 'Ambient Soundscapes', targetTab: 'MIND' },
      { id: 'guided_breathing', label: 'Box & 4-7-8 Breathing', targetTab: 'MIND' }
    ]
  },
  {
    id: 'cycle',
    name: 'Cycle & Hormones',
    icon: '🩷',
    badge: 'Phase-Aware',
    desc: 'Cycle phase tracking, symptoms, and energy alignment.',
    voiceExample: 'Say: "Feeling ovulation energy today"',
    targetTab: 'PROFILE',
    subcategories: [
      { id: 'cycle_phase', label: 'Current Cycle Phase', targetTab: 'PROFILE' },
      { id: 'cycle_symptoms', label: 'Cycle Sensation Tracking', targetTab: 'PROFILE' },
      { id: 'phase_recommendations', label: 'Cycle-Aware Guidance', targetTab: 'PROFILE' }
    ]
  },
  {
    id: 'together',
    name: 'Together & Social',
    icon: '👥',
    badge: '6 Hubs',
    desc: 'Circles, social calendar, shared plans, gym clubs, and cheers.',
    voiceExample: 'Say: "Logged a workout with Maya"',
    targetTab: 'TOGETHER',
    subcategories: [
      { id: 'circles', label: 'Friends & Circles', targetTab: 'TOGETHER' },
      { id: 'social_calendar', label: 'Activity Invitations & Calendar', targetTab: 'TOGETHER' },
      { id: 'shared_plans', label: 'Shared Wellness Plans', targetTab: 'TOGETHER' },
      { id: 'gym_community', label: 'Verified Gym Communities', targetTab: 'TOGETHER' },
      { id: 'challenges', label: 'Supportive Challenges & Badges', targetTab: 'TOGETHER' },
      { id: 'social_feed', label: 'Social Feed & Cheer Reactions', targetTab: 'TOGETHER' }
    ]
  },
  {
    id: 'life_routines',
    name: 'Life & Routines',
    icon: '📅',
    badge: '3 Tools',
    desc: 'Visual daily schedule, break-it-down assistant, and overwhelm calm.',
    voiceExample: 'Say: "Need to break down cleaning my kitchen"',
    targetTab: 'TODAY',
    subcategories: [
      { id: 'visual_schedule', label: 'Visual Daily Flow Schedule', targetTab: 'TODAY' },
      { id: 'break_it_down', label: 'Break It Down Task Assistant', targetModal: 'break_it_down' },
      { id: 'overwhelm_mode', label: 'Overwhelm Reset Mode', targetModal: 'overwhelm' }
    ]
  },
  {
    id: 'insights',
    name: 'Insights & Progress',
    icon: '✨',
    badge: '6 Categories',
    desc: 'Patterns, progress, growth gaps, recommendations, kudos, and alerts.',
    voiceExample: 'Say: "Show me what patterns you noticed"',
    targetTab: 'INTELLIGENCE',
    subcategories: [
      { id: 'patterns', label: 'Pattern Detection with Confidence', targetTab: 'INTELLIGENCE' },
      { id: 'progress', label: 'Shame-Free Period Progress', targetTab: 'INTELLIGENCE' },
      { id: 'gaps', label: 'Gentle Growth Opportunities', targetTab: 'INTELLIGENCE' },
      { id: 'recommendations', label: 'Goal-Aligned Recommendations', targetTab: 'INTELLIGENCE' },
      { id: 'kudos', label: 'Milestones & Positive Kudos', targetTab: 'INTELLIGENCE' },
      { id: 'ai_memory', label: 'AI Memory & Boundaries', targetModal: 'ai_memory' }
    ]
  }
];
