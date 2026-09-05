import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DEFAULT_USER,
  DEFAULT_HOW_I_THRIVE,
  DEFAULT_DAILY_RHYTHM,
  DEFAULT_VOICE_SETTINGS,
  DEFAULT_GRATITUDE_SETTINGS,
  DEFAULT_WELLNESS_INTELLIGENCE_SETTINGS,
  DEFAULT_ROUTINES,
  DEFAULT_SCHEDULE,
  INITIAL_DISCOVERED_GRATITUDE,
  CONNECTED_PROFILES,
  RECIPES_DATABASE,
  WORKOUTS_DATABASE,
  WELLNESS_CIRCLES_DATABASE,
  SOCIAL_CALENDAR_EVENTS,
  AFFIRMATIONS_DATA,
  INITIAL_JOURNAL_ENTRIES,
  VERIFIED_GYMS,
  INITIAL_GYM_COMMUNITIES,
  INITIAL_SHARED_PLANS,
  INITIAL_SOCIAL_CHALLENGES,
  INITIAL_SOCIAL_SETTINGS,
  INITIAL_RELATIONSHIPS,
  DEFAULT_AI_MEMORY_ITEMS,
  CONNECTED_DEVICES_DATABASE,
  DATA_SOURCE_TYPES,
  CONFIDENCE_LEVELS,
  INITIAL_DATA_ANOMALIES,
  INITIAL_DUPLICATE_SUGGESTIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_BADGES_DATABASE,
  INITIAL_SHARED_COMMUNITY_THEMES,
  INITIAL_SOCIAL_FEED_POSTS,
  INITIAL_BODY_SIGNALS
} from '../data/mockData';
import { getPersonalizedRecommendations } from '../engine/personalization';
import { calculateBetterEveryDayScore } from '../engine/scoreEngine';

const WellnessContext = createContext(null);

export function WellnessProvider({ children }) {
  // 1. User Profile & Settings
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('bed_user_profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      const updatedName = (!parsed.name || parsed.name === 'Devan') ? 'Rohini' : parsed.name;
      return {
        ...DEFAULT_USER,
        ...parsed,
        name: updatedName,
        howIThrive: { ...DEFAULT_HOW_I_THRIVE, ...(parsed.howIThrive || {}) },
        voiceSettings: { ...DEFAULT_VOICE_SETTINGS, ...(parsed.voiceSettings || {}) },
        gratitudeSettings: { ...DEFAULT_GRATITUDE_SETTINGS, ...(parsed.gratitudeSettings || {}) },
        wellnessIntelligenceSettings: { ...DEFAULT_WELLNESS_INTELLIGENCE_SETTINGS, ...(parsed.wellnessIntelligenceSettings || {}) }
      };
    }
    return DEFAULT_USER;
  });

  // 2. Theme & Accessibility Attributes on HTML Root
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('bed_theme') || userProfile.theme || 'sage';
  });

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('bed_theme', newTheme);
    setUserProfile(prev => ({ ...prev, theme: newTheme }));
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Wellness Overview Display Frequency ('daily' | 'weekly' | 'monthly', default: 'weekly')
  const [overviewFrequency, setOverviewFrequency] = useState(() => {
    return localStorage.getItem('bed_overview_freq') || userProfile.wellnessOverviewFrequency || 'weekly';
  });

  const updateOverviewFrequency = (freq) => {
    setOverviewFrequency(freq);
    localStorage.setItem('bed_overview_freq', freq);
    setUserProfile(prev => ({ ...prev, wellnessOverviewFrequency: freq }));
  };

  // Customizable Weekly Overview Pillars
  const [overviewPillars, setOverviewPillars] = useState(() => {
    const saved = localStorage.getItem('bed_overview_pillars');
    return saved ? JSON.parse(saved) : ['hydrate', 'move', 'nourish', 'rest', 'mind'];
  });

  const updateOverviewPillars = (pillars) => {
    setOverviewPillars(pillars);
    localStorage.setItem('bed_overview_pillars', JSON.stringify(pillars));
  };

  // Interaction Mode ('guide_me' | 'explore' | 'decide_as_i_go')
  const [interactionMode, setInteractionMode] = useState(() => {
    return localStorage.getItem('bed_interaction_mode') || 'decide_as_i_go';
  });

  const updateInteractionMode = (mode) => {
    setInteractionMode(mode);
    localStorage.setItem('bed_interaction_mode', mode);
  };

  useEffect(() => {
    const thrive = userProfile.howIThrive || DEFAULT_HOW_I_THRIVE;
    const doc = document.documentElement;

    doc.setAttribute('data-theme', theme);
    doc.setAttribute('data-contrast', thrive.highContrast ? 'high' : 'standard');
    doc.setAttribute('data-text-size', thrive.textSize || 'standard');
    doc.setAttribute('data-motion', thrive.animationLevel || 'standard');
    doc.setAttribute('data-visual', thrive.visualComplexity || 'standard');

    const customMatch = thrive.customThemes?.find(t => t.id === theme);
    if (customMatch) {
      doc.style.setProperty('--bg-primary', customMatch.bgPrimary);
      doc.style.setProperty('--bg-secondary', customMatch.bgSecondary);
      doc.style.setProperty('--bg-tertiary', customMatch.bgTertiary);
      doc.style.setProperty('--text-primary', customMatch.textPrimary);
      doc.style.setProperty('--text-secondary', customMatch.textSecondary);
      doc.style.setProperty('--accent-primary', customMatch.accentPrimary);
      doc.style.setProperty('--accent-primary-light', customMatch.accentPrimaryLight);
      doc.style.setProperty('--accent-secondary', customMatch.accentSecondary);
    } else {
      doc.style.removeProperty('--bg-primary');
      doc.style.removeProperty('--bg-secondary');
      doc.style.removeProperty('--bg-tertiary');
      doc.style.removeProperty('--text-primary');
      doc.style.removeProperty('--text-secondary');
      doc.style.removeProperty('--accent-primary');
      doc.style.removeProperty('--accent-primary-light');
      doc.style.removeProperty('--accent-secondary');
    }
  }, [theme, userProfile.howIThrive]);


  // 3. Daily Check-in
  const [dailyCheckIn, setDailyCheckIn] = useState(() => {
    const saved = localStorage.getItem('bed_daily_checkin');
    return saved ? JSON.parse(saved) : {
      isCompleted: true,
      date: new Date().toISOString().split('T')[0],
      mood: 'good',
      energy: 4,
      stress: 2,
      sleep: 4,
      bodyTags: ['Energized', 'Calm']
    };
  });

  // 4. Small Step State & Flexible Streaks
  const [smallStepState, setSmallStepState] = useState(() => {
    const saved = localStorage.getItem('bed_small_step');
    return saved ? JSON.parse(saved) : {
      isCompleted: false,
      streakCount: 5,
      lastCompletedDate: null
    };
  });

  // 5. Hydration Tracking
  const [hydrationMl, setHydrationMl] = useState(() => {
    const saved = localStorage.getItem('bed_hydration_ml');
    return saved ? Number(saved) : 1250;
  });

  // 6. Steps & Activity Tracking
  const [stepCount, setStepCount] = useState(() => {
    const saved = localStorage.getItem('bed_steps');
    return saved ? Number(saved) : 5420;
  });

  const [activeWorkoutMinutes, setActiveWorkoutMinutes] = useState(15);
  const [completedWorkouts, setCompletedWorkouts] = useState(['w_1']);

  // 7. Meals & Nutrition Tracking
  const [loggedMeals, setLoggedMeals] = useState(() => {
    const saved = localStorage.getItem('bed_logged_meals');
    return saved ? JSON.parse(saved) : [
      { id: 'm_1', mealType: 'Breakfast', title: 'Overnight Chia Berry Oats', calories: 380, protein: 16, carbs: 48, fat: 14, fiber: 12 },
      { id: 'm_2', mealType: 'Lunch', title: 'Quinoa & Roasted Veggie Rainbow Bowl', calories: 460, protein: 18, carbs: 62, fat: 16, fiber: 11 }
    ];
  });

  // 8. Cravings Log
  const [cravingsLogs, setCravingsLogs] = useState(() => {
    const saved = localStorage.getItem('bed_cravings_logs');
    return saved ? JSON.parse(saved) : [
      {
        id: 'cl_1',
        cravingName: 'Chocolate',
        time: 'Yesterday 3:30 PM',
        satisfiedWith: 'Dark chocolate 85% with almonds',
        feelingAfter: 'Comforted & Content'
      }
    ];
  });

  // 9. Journals & Multimodal Media
  const [journalEntries, setJournalEntries] = useState(() => {
    const saved = localStorage.getItem('bed_journals');
    return saved ? JSON.parse(saved) : INITIAL_JOURNAL_ENTRIES;
  });

  // 10. Discovered Gratitude Queue
  const [discoveredGratitude, setDiscoveredGratitude] = useState(() => {
    const saved = localStorage.getItem('bed_discovered_gratitude');
    return saved ? JSON.parse(saved) : INITIAL_DISCOVERED_GRATITUDE;
  });

  // 11. Social Calendar Events & Invitations
  const [socialEvents, setSocialEvents] = useState(() => {
    const saved = localStorage.getItem('bed_social_events');
    return saved ? JSON.parse(saved) : SOCIAL_CALENDAR_EVENTS;
  });

  // 12. Wellness Circles
  const [circles, setCircles] = useState(() => {
    const saved = localStorage.getItem('bed_circles');
    return saved ? JSON.parse(saved) : WELLNESS_CIRCLES_DATABASE;
  });

  // 13. Connected Profiles & Granular Privacy Matrix
  const [connectedProfiles, setConnectedProfiles] = useState(() => {
    const saved = localStorage.getItem('bed_connected_profiles');
    return saved ? JSON.parse(saved) : CONNECTED_PROFILES;
  });
  const [activeProfileId, setActiveProfileId] = useState('user_1');

  // 14. Mindset Affirmation Preference
  const [affirmationStyle, setAffirmationStyle] = useState(userProfile.affirmationStyle || 'soft_love');
  const [favoriteAffirmations, setFavoriteAffirmations] = useState([]);

  // 15. Community Recipes & Submission Queue
  const [communityRecipes, setCommunityRecipes] = useState(() => {
    const saved = localStorage.getItem('bed_community_recipes');
    return saved ? JSON.parse(saved) : RECIPES_DATABASE;
  });
  const [moderationQueue, setModerationQueue] = useState([
    {
      id: 'mod_1',
      title: 'Golden Coconut Anti-Inflammatory Broth',
      submittedBy: 'Lucas (Friend)',
      date: 'Today, 11:20 AM',
      category: 'Dinner',
      calories: 240,
      macros: { protein: 8, carbs: 14, fat: 18, fiber: 4 },
      status: 'pending_moderation',
      notes: 'Contains fresh turmeric, ginger, coconut cream, and bone broth.'
    }
  ]);

  // 16. Routines & Visual Daily Schedule
  const [routines, setRoutines] = useState(() => {
    const saved = localStorage.getItem('bed_routines');
    return saved ? JSON.parse(saved) : DEFAULT_ROUTINES;
  });

  const [visualSchedule, setVisualSchedule] = useState(() => {
    const saved = localStorage.getItem('bed_visual_schedule');
    return saved ? JSON.parse(saved) : DEFAULT_SCHEDULE;
  });

  // 17. Gym, Communities, Shared Plans, and Challenges (Prompt 5)
  const [selectedGymId, setSelectedGymId] = useState(userProfile.selectedGymId || 'gym_1');

  const [gymCommunities, setGymCommunities] = useState(() => {
    const saved = localStorage.getItem('bed_gym_communities');
    return saved ? JSON.parse(saved) : INITIAL_GYM_COMMUNITIES;
  });

  const [sharedPlans, setSharedPlans] = useState(() => {
    const saved = localStorage.getItem('bed_shared_plans');
    return saved ? JSON.parse(saved) : INITIAL_SHARED_PLANS;
  });

  const [socialChallenges, setSocialChallenges] = useState(() => {
    const saved = localStorage.getItem('bed_social_challenges');
    return saved ? JSON.parse(saved) : INITIAL_SOCIAL_CHALLENGES;
  });

  const [socialSettings, setSocialSettings] = useState(() => {
    const saved = localStorage.getItem('bed_social_settings');
    return saved ? JSON.parse(saved) : INITIAL_SOCIAL_SETTINGS;
  });

  const [relationships, setRelationships] = useState(() => {
    const saved = localStorage.getItem('bed_relationships');
    return saved ? JSON.parse(saved) : INITIAL_RELATIONSHIPS;
  });

  // 18. AI Memory & Context Boundaries (Prompt 6)
  const [aiMemories, setAiMemories] = useState(() => {
    const saved = localStorage.getItem('bed_ai_memories');
    return saved ? JSON.parse(saved) : DEFAULT_AI_MEMORY_ITEMS;
  });

  // 19. Connected Devices, Wearables, Sync & Data Trust (Prompt 7)
  const [connectedDevices, setConnectedDevices] = useState(() => {
    const saved = localStorage.getItem('bed_connected_devices');
    return saved ? JSON.parse(saved) : CONNECTED_DEVICES_DATABASE;
  });

  const [syncStatus, setSyncStatus] = useState('synced'); // 'synced' | 'syncing' | 'offline' | 'error'
  const [lastSyncTime, setLastSyncTime] = useState('Just now');

  const [dataAnomalies, setDataAnomalies] = useState(() => {
    const saved = localStorage.getItem('bed_data_anomalies');
    return saved ? JSON.parse(saved) : INITIAL_DATA_ANOMALIES;
  });

  const [duplicateSuggestions, setDuplicateSuggestions] = useState(() => {
    const saved = localStorage.getItem('bed_duplicate_suggestions');
    return saved ? JSON.parse(saved) : INITIAL_DUPLICATE_SUGGESTIONS;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('bed_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [voiceAudioRetention, setVoiceAudioRetention] = useState(() => {
    return localStorage.getItem('bed_voice_audio_retention') || 'transcribe_and_delete';
  });

  // 20. Badges, Community Themes & Social Feed (Prompt 8)
  const [userBadges, setUserBadges] = useState(() => {
    const saved = localStorage.getItem('bed_user_badges');
    return saved ? JSON.parse(saved) : INITIAL_BADGES_DATABASE;
  });

  const [sharedCommunityThemes, setSharedCommunityThemes] = useState(() => {
    const saved = localStorage.getItem('bed_shared_community_themes');
    return saved ? JSON.parse(saved) : INITIAL_SHARED_COMMUNITY_THEMES;
  });

  const [socialFeedPosts, setSocialFeedPosts] = useState(() => {
    const saved = localStorage.getItem('bed_social_feed_posts');
    return saved ? JSON.parse(saved) : INITIAL_SOCIAL_FEED_POSTS;
  });

  // 21. Body Signals & Physical Sensations (Prompt 11)
  const [bodySignals, setBodySignals] = useState(() => {
    const saved = localStorage.getItem('bed_body_signals');
    return saved ? JSON.parse(saved) : INITIAL_BODY_SIGNALS;
  });

  // 22. Voice Recordings Vault (Prompt 13)
  const [voiceRecordings, setVoiceRecordings] = useState(() => {
    const saved = localStorage.getItem('bed_voice_recordings');
    return saved ? JSON.parse(saved) : [
      {
        id: 'rec_1',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        date: 'Today, 2:30 PM',
        durationSec: 18,
        transcript: "Walked 20 minutes around the botanical park, drank three cups of fresh water and had a berry bowl. Devante gave me a hug when I got home.",
        status: 'applied',
        itemsExtracted: 4,
        categoryBadges: ['Move', 'Hydration', 'Nourish', 'Gratitude']
      }
    ];
  });

  // 23. Custom Beverages (Added in Hydrate/Nourish)
  const [customBeverages, setCustomBeverages] = useState(() => {
    const saved = localStorage.getItem('bed_custom_beverages');
    return saved ? JSON.parse(saved) : [];
  });

  const addCustomBeverage = (bev) => {
    const newBev = {
      id: 'bev_' + Date.now(),
      label: bev.label || 'Custom Drink',
      icon: bev.icon || '🥤',
      boost: bev.boost || 'Wholesome Hydration',
      ...bev
    };
    setCustomBeverages(prev => [newBev, ...prev]);
    return newBev;
  };

  // 24. Show Meal Log & Macro Summary Toggle (Nourish)
  const [showMealSummary, setShowMealSummary] = useState(() => {
    const saved = localStorage.getItem('bed_show_meal_summary');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const toggleMealSummary = () => {
    setShowMealSummary(prev => {
      const next = !prev;
      localStorage.setItem('bed_show_meal_summary', JSON.stringify(next));
      return next;
    });
  };

  // 25. 30-30 Micro-Movement & Posture Support (Move)
  const [microMovementSettings, setMicroMovementSettings] = useState(() => {
    const saved = localStorage.getItem('bed_micro_movement_settings');
    return saved ? JSON.parse(saved) : {
      enabled: true,
      preference: 'choose', // 'choose' | 'steps' | 'stretch'
      postureResetsEnabled: true,
      lastBreakTime: Date.now() - 15 * 60 * 1000 // 15 mins ago
    };
  });

  const [microMovementLogs, setMicroMovementLogs] = useState(() => {
    const saved = localStorage.getItem('bed_micro_movement_logs');
    return saved ? JSON.parse(saved) : [
      { id: 'mm_1', date: 'Today', time: '09:30 AM', type: '30 Steps', status: 'completed' },
      { id: 'mm_2', date: 'Today', time: '10:00 AM', type: 'Stretch & Reposition', status: 'completed' },
      { id: 'mm_3', date: 'Today', time: '10:30 AM', type: 'Shoulder Reset', status: 'completed' },
      { id: 'mm_4', date: 'Today', time: '11:00 AM', type: '30 Steps', status: 'completed' },
      { id: 'mm_5', date: 'Today', time: '11:30 AM', type: 'Stretch & Reposition', status: 'completed' },
      { id: 'mm_6', date: 'Today', time: '12:00 PM', type: '30 Steps', status: 'completed' }
    ];
  });

  const toggleMicroMovement = (enabledVal) => {
    setMicroMovementSettings(prev => {
      const next = typeof enabledVal === 'boolean' ? enabledVal : !prev.enabled;
      return { ...prev, enabled: next };
    });
  };

  const setMicroMovementPreference = (pref) => {
    setMicroMovementSettings(prev => ({
      ...prev,
      preference: pref
    }));
  };

  const togglePostureResets = (enabledVal) => {
    setMicroMovementSettings(prev => {
      const next = typeof enabledVal === 'boolean' ? enabledVal : !prev.postureResetsEnabled;
      return { ...prev, postureResetsEnabled: next };
    });
  };

  const logMicroMovement = (type = '30 Steps', status = 'completed') => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLog = {
      id: 'mm_' + Date.now(),
      date: 'Today',
      time: timeStr,
      type,
      status,
      timestamp: Date.now()
    };

    setMicroMovementLogs(prev => [newLog, ...prev]);
    setMicroMovementSettings(prev => ({
      ...prev,
      lastBreakTime: Date.now()
    }));

    return newLog;
  };

  const isWithinActiveWellnessDay = () => {
    const rhythm = getWellnessDayInfo();
    const now = new Date();
    const currentH = now.getHours();
    const currentM = now.getMinutes();
    const currentTotalMin = currentH * 60 + currentM;

    const [startH, startM] = rhythm.dayStartTime.split(':').map(Number);
    const startTotalMin = startH * 60 + (startM || 0);

    const [sleepH, sleepM] = rhythm.sleepTime.split(':').map(Number);
    const sleepTotalMin = sleepH * 60 + (sleepM || 0);

    if (rhythm.isOvernight) {
      // e.g. starts 23:00, ends 07:30
      return currentTotalMin >= startTotalMin || currentTotalMin <= sleepTotalMin;
    } else {
      // standard day schedule
      return currentTotalMin >= startTotalMin && currentTotalMin <= sleepTotalMin;
    }
  };

  const getMicroMovementStats = () => {
    const completedToday = microMovementLogs.filter(l => l.status === 'completed');
    const breaksTodayCount = completedToday.length;

    let insight = 'You have not taken any movement breaks yet today.';
    if (breaksTodayCount >= 6) {
      insight = 'Nice work — you’ve interrupted several periods of prolonged sitting today.';
    } else if (breaksTodayCount > 0) {
      insight = 'Great rhythm — every small position change supports vitality and blood flow.';
    }

    return {
      breaksTodayCount,
      totalLogsCount: microMovementLogs.length,
      insight,
      isCurrentlyActive: isWithinActiveWellnessDay()
    };
  };

  // 26. Move Hub Plans & Custom Exercises (Saved, Favourites, Custom Library)
  const [savedPlanIds, setSavedPlanIds] = useState(() => {
    const saved = localStorage.getItem('bed_saved_plan_ids');
    return saved ? JSON.parse(saved) : ['w_1', 'w_2'];
  });

  const [favouritePlanIds, setFavouritePlanIds] = useState(() => {
    const saved = localStorage.getItem('bed_favourite_plan_ids');
    return saved ? JSON.parse(saved) : ['w_1'];
  });

  const [customExercises, setCustomExercises] = useState(() => {
    const saved = localStorage.getItem('bed_custom_exercises');
    return saved ? JSON.parse(saved) : [
      {
        id: 'ce_1',
        name: 'Desk Wrist & Forearm Release',
        category: 'Mobility & Stretching',
        durationSec: 60,
        reps: 10,
        notes: 'Gentle circular movements while sitting at desk.',
        tip: 'Keep shoulders relaxed and breathe steadily.'
      },
      {
        id: 'ce_2',
        name: 'Morning Sunshine Calf Raises',
        category: 'Walking & Balance',
        durationSec: 90,
        reps: 15,
        notes: 'Slow rise on toes by the kitchen counter.',
        tip: 'Hold at the top for 1 second.'
      }
    ];
  });

  const savePlanToHub = (planId) => {
    setSavedPlanIds(prev => {
      if (prev.includes(planId)) return prev;
      const next = [...prev, planId];
      localStorage.setItem('bed_saved_plan_ids', JSON.stringify(next));
      return next;
    });
  };

  const removePlanFromHub = (planId) => {
    setSavedPlanIds(prev => {
      const next = prev.filter(id => id !== planId);
      localStorage.setItem('bed_saved_plan_ids', JSON.stringify(next));
      return next;
    });
  };

  const toggleFavouritePlan = (planId) => {
    setFavouritePlanIds(prev => {
      const next = prev.includes(planId) ? prev.filter(id => id !== planId) : [...prev, planId];
      localStorage.setItem('bed_favourite_plan_ids', JSON.stringify(next));
      return next;
    });
  };

  const addCustomExercise = (exerciseData) => {
    const newEx = {
      id: 'ce_' + Date.now(),
      name: exerciseData.name || 'Custom Movement',
      category: exerciseData.category || 'Mobility & Stretching',
      durationSec: Number(exerciseData.durationSec) || 60,
      reps: Number(exerciseData.reps) || 0,
      notes: exerciseData.notes || '',
      tip: exerciseData.tip || 'Move at your own gentle pace.',
      createdAt: Date.now()
    };
    setCustomExercises(prev => {
      const next = [newEx, ...prev];
      localStorage.setItem('bed_custom_exercises', JSON.stringify(next));
      return next;
    });
    return newEx;
  };

  const deleteCustomExercise = (exerciseId) => {
    setCustomExercises(prev => {
      const next = prev.filter(e => e.id !== exerciseId);
      localStorage.setItem('bed_custom_exercises', JSON.stringify(next));
      return next;
    });
  };

  // 17. Dance Party (Flexible Durations, Built-In Sound & Custom MP4 Media)
  const [dancePartySettings, setDancePartySettings] = useState(() => {
    const saved = localStorage.getItem('bed_dance_party_settings');
    return saved ? JSON.parse(saved) : {
      defaultDuration: 15,
      soundType: 'builtin', // 'builtin' | 'custom'
      customMediaId: null,
      customDuration: 22,
      startOffset: 0
    };
  });

  const [dancePartyLogs, setDancePartyLogs] = useState(() => {
    const saved = localStorage.getItem('bed_dance_party_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const updateDancePartySettings = (newSettings) => {
    setDancePartySettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const logDanceParty = (durationSec = 15, soundUsed = 'Better Every Day', customMediaName = '') => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLog = {
      id: 'dp_' + Date.now(),
      date: 'Today',
      time: timeStr,
      durationSec: Number(durationSec) || 15,
      soundUsed,
      customMediaName: customMediaName || null,
      label: `🎉 Dance Party — ${durationSec} sec`,
      timestamp: Date.now()
    };

    setDancePartyLogs(prev => [newLog, ...prev]);

    // Gently increment active workout minutes slightly without turning it into a rigid gym workout
    const minutesAdded = Math.max(1, Math.round(durationSec / 60));
    setActiveWorkoutMinutes(prev => prev + minutesAdded);

    return newLog;
  };

  // 18. 🐾 Pet Play (Movement & Companionship with All Pets)
  const [petProfiles, setPetProfiles] = useState(() => {
    const saved = localStorage.getItem('bed_pet_profiles');
    return saved ? JSON.parse(saved) : [
      { id: 'pet_1', name: 'Luna', type: 'Dog', icon: '🐶', photoUrl: null, createdAt: Date.now() - 30 * 86400000 },
      { id: 'pet_2', name: 'Felix', type: 'Cat', icon: '🐱', photoUrl: null, createdAt: Date.now() - 20 * 86400000 }
    ];
  });

  const [petPlayLogs, setPetPlayLogs] = useState(() => {
    const saved = localStorage.getItem('bed_pet_play_logs');
    return saved ? JSON.parse(saved) : [
      { id: 'pp_1', petId: 'pet_1', petName: 'Luna', petIcon: '🐶', activityName: 'Playing fetch', category: 'Playing', durationMin: 30, notes: 'Tennis ball in the park', date: 'Today', timestamp: Date.now() - 3600000 },
      { id: 'pp_2', petId: 'pet_1', petName: 'Luna', petIcon: '🐶', activityName: 'Tug-of-war', category: 'Playing', durationMin: 60, notes: 'Rope toy in the living room', date: 'Yesterday', timestamp: Date.now() - 86400000 },
      { id: 'pp_3', petId: 'pet_1', petName: 'Luna', petIcon: '🐶', activityName: 'Running together', category: 'Moving Together', durationMin: 30, notes: 'Morning trail loop', date: '3 days ago', timestamp: Date.now() - 3 * 86400000 },
      { id: 'pp_4', petId: 'pet_2', petName: 'Felix', petIcon: '🐱', activityName: 'Feather wand chase', category: 'Gentle Activities', durationMin: 20, notes: 'Hallway zoomies', date: '2 days ago', timestamp: Date.now() - 2 * 86400000 }
    ];
  });

  const addPetProfile = (petData) => {
    const newPet = {
      id: 'pet_' + Date.now(),
      name: petData.name?.trim() || 'My Pet',
      type: petData.type || 'Dog',
      icon: petData.icon || '🐾',
      photoUrl: petData.photoUrl || null,
      createdAt: Date.now()
    };
    setPetProfiles(prev => [...prev, newPet]);
    return newPet;
  };

  const updatePetProfile = (id, petData) => {
    setPetProfiles(prev => prev.map(p => p.id === id ? { ...p, ...petData } : p));
    // Also update cached name in logs
    if (petData.name || petData.icon) {
      setPetPlayLogs(prev => prev.map(log => {
        if (log.petId === id) {
          return {
            ...log,
            petName: petData.name || log.petName,
            petIcon: petData.icon || log.petIcon
          };
        }
        return log;
      }));
    }
  };

  const deletePetProfile = (id, keepHistory = true) => {
    setPetProfiles(prev => prev.filter(p => p.id !== id));
    if (!keepHistory) {
      setPetPlayLogs(prev => prev.filter(l => l.petId !== id));
    }
  };

  const logPetPlayActivity = ({ petId, activityName, category = 'Playing', durationMin = 30, notes = '', linkedWorkoutId = null }) => {
    const pet = petProfiles.find(p => p.id === petId) || petProfiles[0] || { id: 'pet_custom', name: 'Pet', icon: '🐾' };
    const dur = Number(durationMin) || 15;

    const newLog = {
      id: 'pp_' + Date.now(),
      petId: pet.id,
      petName: pet.name,
      petIcon: pet.icon,
      activityName: activityName?.trim() || 'Play & Movement',
      category,
      durationMin: dur,
      notes: notes?.trim() || '',
      linkedWorkoutId: linkedWorkoutId || null,
      date: 'Today',
      timestamp: Date.now()
    };

    setPetPlayLogs(prev => [newLog, ...prev]);

    // If not already linked to an existing Move workout, contribute once to active workout minutes
    if (!linkedWorkoutId) {
      setActiveWorkoutMinutes(prev => prev + dur);
    }

    return newLog;
  };

  const deletePetPlayLog = (id) => {
    setPetPlayLogs(prev => prev.filter(l => l.id !== id));
  };

  const getPetPlayStats = (selectedPetId = 'all') => {
    const relevantLogs = selectedPetId === 'all' 
      ? petPlayLogs 
      : petPlayLogs.filter(l => l.petId === selectedPetId);

    const totalMinutes = relevantLogs.reduce((sum, l) => sum + (Number(l.durationMin) || 0), 0);
    const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

    // Activity counts & duration breakdown
    const activityMap = {};
    relevantLogs.forEach(l => {
      const act = l.activityName || 'General Play';
      if (!activityMap[act]) activityMap[act] = { name: act, minutes: 0, count: 0, category: l.category || 'Playing' };
      activityMap[act].minutes += Number(l.durationMin) || 0;
      activityMap[act].count += 1;
    });

    const breakdownList = Object.values(activityMap).sort((a, b) => b.minutes - a.minutes);
    const topActivity = breakdownList[0]?.name || 'Playing';

    // Friendly, celebration-focused insight (no guilt)
    const petObj = petProfiles.find(p => p.id === selectedPetId);
    const petLabel = petObj ? petObj.name : 'your pets';

    let insight = `You spent ${totalHours} hours moving and bonding together this week! 🐾💚`;
    if (breakdownList.length > 0) {
      insight = `${topActivity} was your most common active moment with ${petLabel} this week.`;
    }
    if (totalMinutes === 0) {
      insight = `Ready for some joyful play time with ${petLabel}? Any small movement together counts!`;
    }

    return {
      totalMinutes,
      totalHours,
      sessionCount: relevantLogs.length,
      breakdownList,
      topActivity,
      insight,
      petName: petObj ? petObj.name : 'All Pets',
      petIcon: petObj ? petObj.icon : '🐾'
    };
  };

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem('bed_pet_profiles', JSON.stringify(petProfiles));
  }, [petProfiles]);

  useEffect(() => {
    localStorage.setItem('bed_pet_play_logs', JSON.stringify(petPlayLogs));
  }, [petPlayLogs]);

  useEffect(() => {
    localStorage.setItem('bed_dance_party_settings', JSON.stringify(dancePartySettings));
  }, [dancePartySettings]);

  useEffect(() => {
    localStorage.setItem('bed_dance_party_logs', JSON.stringify(dancePartyLogs));
  }, [dancePartyLogs]);

  useEffect(() => {
    localStorage.setItem('bed_micro_movement_settings', JSON.stringify(microMovementSettings));
  }, [microMovementSettings]);

  useEffect(() => {
    localStorage.setItem('bed_micro_movement_logs', JSON.stringify(microMovementLogs));
  }, [microMovementLogs]);

  useEffect(() => {
    localStorage.setItem('bed_custom_beverages', JSON.stringify(customBeverages));
  }, [customBeverages]);

  useEffect(() => {
    localStorage.setItem('bed_show_meal_summary', JSON.stringify(showMealSummary));
  }, [showMealSummary]);

  useEffect(() => {
    localStorage.setItem('bed_voice_recordings', JSON.stringify(voiceRecordings));
  }, [voiceRecordings]);

  useEffect(() => {
    localStorage.setItem('bed_body_signals', JSON.stringify(bodySignals));
  }, [bodySignals]);

  useEffect(() => {
    localStorage.setItem('bed_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('bed_daily_checkin', JSON.stringify(dailyCheckIn));
  }, [dailyCheckIn]);

  useEffect(() => {
    localStorage.setItem('bed_small_step', JSON.stringify(smallStepState));
  }, [smallStepState]);

  useEffect(() => {
    localStorage.setItem('bed_hydration_ml', hydrationMl.toString());
  }, [hydrationMl]);

  useEffect(() => {
    localStorage.setItem('bed_steps', stepCount.toString());
  }, [stepCount]);

  useEffect(() => {
    localStorage.setItem('bed_logged_meals', JSON.stringify(loggedMeals));
  }, [loggedMeals]);

  useEffect(() => {
    localStorage.setItem('bed_cravings_logs', JSON.stringify(cravingsLogs));
  }, [cravingsLogs]);

  useEffect(() => {
    localStorage.setItem('bed_journals', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem('bed_discovered_gratitude', JSON.stringify(discoveredGratitude));
  }, [discoveredGratitude]);

  useEffect(() => {
    localStorage.setItem('bed_social_events', JSON.stringify(socialEvents));
  }, [socialEvents]);

  useEffect(() => {
    localStorage.setItem('bed_circles', JSON.stringify(circles));
  }, [circles]);

  useEffect(() => {
    localStorage.setItem('bed_routines', JSON.stringify(routines));
  }, [routines]);

  useEffect(() => {
    localStorage.setItem('bed_visual_schedule', JSON.stringify(visualSchedule));
  }, [visualSchedule]);

  useEffect(() => {
    localStorage.setItem('bed_gym_communities', JSON.stringify(gymCommunities));
  }, [gymCommunities]);

  useEffect(() => {
    localStorage.setItem('bed_shared_plans', JSON.stringify(sharedPlans));
  }, [sharedPlans]);

  useEffect(() => {
    localStorage.setItem('bed_social_challenges', JSON.stringify(socialChallenges));
  }, [socialChallenges]);

  useEffect(() => {
    localStorage.setItem('bed_social_settings', JSON.stringify(socialSettings));
  }, [socialSettings]);

  useEffect(() => {
    localStorage.setItem('bed_relationships', JSON.stringify(relationships));
  }, [relationships]);

  useEffect(() => {
    localStorage.setItem('bed_ai_memories', JSON.stringify(aiMemories));
  }, [aiMemories]);

  useEffect(() => {
    localStorage.setItem('bed_connected_devices', JSON.stringify(connectedDevices));
  }, [connectedDevices]);

  useEffect(() => {
    localStorage.setItem('bed_data_anomalies', JSON.stringify(dataAnomalies));
  }, [dataAnomalies]);

  useEffect(() => {
    localStorage.setItem('bed_duplicate_suggestions', JSON.stringify(duplicateSuggestions));
  }, [duplicateSuggestions]);

  useEffect(() => {
    localStorage.setItem('bed_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('bed_voice_audio_retention', voiceAudioRetention);
  }, [voiceAudioRetention]);

  useEffect(() => {
    localStorage.setItem('bed_user_badges', JSON.stringify(userBadges));
  }, [userBadges]);

  useEffect(() => {
    localStorage.setItem('bed_shared_community_themes', JSON.stringify(sharedCommunityThemes));
  }, [sharedCommunityThemes]);

  useEffect(() => {
    localStorage.setItem('bed_social_feed_posts', JSON.stringify(socialFeedPosts));
  }, [socialFeedPosts]);

  // Actions & Mutators
  const recordCheckIn = (newCheckIn) => {
    setDailyCheckIn({
      ...newCheckIn,
      isCompleted: true,
      date: new Date().toISOString().split('T')[0]
    });
  };

  const completeSmallStep = () => {
    if (!smallStepState.isCompleted) {
      setSmallStepState(prev => ({
        isCompleted: true,
        streakCount: prev.streakCount + 1,
        lastCompletedDate: new Date().toISOString()
      }));
    }
  };

  const incrementHydration = (amountMl = 250) => {
    setHydrationMl(prev => Math.min(5000, prev + amountMl));
  };

  const logMeal = (meal) => {
    const newMeal = {
      id: 'meal_' + Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...meal
    };
    setLoggedMeals(prev => [newMeal, ...prev]);
  };

  const logCraving = (entry) => {
    const newLog = {
      id: 'cl_' + Date.now(),
      time: 'Today ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...entry
    };
    setCravingsLogs(prev => [newLog, ...prev]);
  };

  const addJournalEntry = (entry) => {
    const newEntry = {
      id: 'j_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...entry
    };
    setJournalEntries(prev => [newEntry, ...prev]);
  };

  const deleteJournalEntry = (id) => {
    setJournalEntries(prev => prev.filter(j => j.id !== id));
  };

  // =========================================================================
  // VOICE LOGGING & INTELLIGENT PARTIAL UPDATES
  // =========================================================================

  const applyParsedVoiceUpdates = (itemsToApply) => {
    itemsToApply.forEach(item => {
      switch (item.actionType) {
        case 'increment_hydration':
          incrementHydration(item.value);
          break;
        case 'log_movement':
          setActiveWorkoutMinutes(prev => prev + item.value.durationMin);
          if (item.value.estSteps > 0) {
            setStepCount(prev => prev + item.value.estSteps);
          }
          break;
        case 'log_meal':
          logMeal({
            title: item.value.title,
            mealType: item.value.mealType,
            calories: item.value.calories || 150,
            protein: 4,
            carbs: 22,
            fat: 2,
            fiber: 4
          });
          break;
        case 'update_mood':
          setDailyCheckIn(prev => ({ ...prev, mood: item.value }));
          break;
        case 'add_discovered_gratitude': {
          const newDg = {
            id: 'dg_' + Date.now(),
            text: item.value.text,
            rawSource: item.value.rawQuote,
            date: new Date().toISOString().split('T')[0],
            theme: item.value.theme || 'Joy & Wellbeing',
            icon: item.value.icon || '✨',
            status: userProfile.gratitudeSettings?.discoveryMode === 'always' ? 'added' : 'discovered',
            sourceType: 'voice'
          };
          setDiscoveredGratitude(prev => [newDg, ...prev]);
          if (userProfile.gratitudeSettings?.discoveryMode === 'always') {
            // Auto add to gratitude journal if user set "always"
            addJournalEntry({
              type: 'gratitude',
              title: 'Discovered Blessing',
              entries: [newDg.text, 'Noticed from my daily voice check-in.', 'Feeling supported.'],
              stickers: ['✨', '🌱'],
              moodStamp: 'Grateful'
            });
          }
          break;
        }
        case 'save_journal_entry':
          addJournalEntry({
            ...item.value,
            date: new Date().toISOString().split('T')[0],
            stickers: ['🎙️', '✨']
          });
          break;
        case 'log_sleep':
          setDailyCheckIn(prev => ({
            ...prev,
            sleep: (item.value.hours || 7) >= 7 ? 5 : (item.value.hours || 7) >= 6 ? 4 : 2,
            sleepHours: item.value.hours || 7,
            sleepQuality: item.value.quality || 'Restful'
          }));
          break;
        case 'log_body_signal':
          logBodySignal({
            signal: item.value.signal || item.value.type || 'Body Sensation',
            date: item.value.date || new Date().toISOString().split('T')[0],
            time: item.value.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            notes: item.value.notes || item.value.note || 'Logged via voice reflection',
            severity: item.value.severity || 'Mild',
            icon: item.value.icon || '🩹'
          });
          break;
        default:
          break;
      }
    });
  };

  const addVoiceRecording = (recording) => {
    setVoiceRecordings(prev => [recording, ...prev]);
  };

  const deleteVoiceRecording = (id) => {
    setVoiceRecordings(prev => prev.filter(r => r.id !== id));
  };

  // =========================================================================
  // BODY SIGNAL MUTATORS (Prompt 11)
  // =========================================================================

  const logBodySignal = (signalData) => {
    const newSignal = {
      id: 'bs_' + Date.now(),
      date: signalData.date || new Date().toISOString().split('T')[0],
      time: signalData.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      signal: signalData.signal || 'General Sensation',
      severity: signalData.severity || 'Mild',
      duration: signalData.duration || 'Short',
      notes: signalData.notes || '',
      icon: signalData.icon || '🩹',
      ...signalData
    };
    setBodySignals(prev => [newSignal, ...prev]);
  };

  const deleteBodySignal = (id) => {
    setBodySignals(prev => prev.filter(bs => bs.id !== id));
  };

  // =========================================================================
  // GRATITUDE DISCOVERY APPROVALS & DISMISSALS
  // =========================================================================

  const approveDiscoveredGratitude = (id, customText = '') => {
    setDiscoveredGratitude(prev => prev.map(dg => {
      if (dg.id === id) {
        const finalText = customText || dg.text;
        // Also write a dedicated gratitude journal entry
        addJournalEntry({
          type: 'gratitude',
          title: 'Added from Gratitude Discovery',
          entries: [finalText, `Source: "${dg.rawSource}"`, 'Grateful for this small moment.'],
          stickers: ['✨', '💛'],
          moodStamp: 'Grateful'
        });
        return { ...dg, status: 'added', text: finalText };
      }
      return dg;
    }));
  };

  const rejectDiscoveredGratitude = (id) => {
    setDiscoveredGratitude(prev => prev.map(dg => dg.id === id ? { ...dg, status: 'rejected' } : dg));
  };

  const saveDiscoveredGratitudeForLater = (id) => {
    setDiscoveredGratitude(prev => prev.map(dg => dg.id === id ? { ...dg, status: 'saved_later' } : dg));
  };

  const updateVoiceSettings = (newSettings) => {
    setUserProfile(prev => ({
      ...prev,
      voiceSettings: { ...(prev.voiceSettings || DEFAULT_VOICE_SETTINGS), ...newSettings }
    }));
  };

  const updateGratitudeSettings = (newSettings) => {
    setUserProfile(prev => ({
      ...prev,
      gratitudeSettings: { ...(prev.gratitudeSettings || DEFAULT_GRATITUDE_SETTINGS), ...newSettings }
    }));
  };

  // =========================================================================
  // WELLNESS INTELLIGENCE ACTIONS & FEEDBACK
  // =========================================================================

  const [customMyStory, setCustomMyStory] = useState(() => {
    return localStorage.getItem('bed_custom_my_story') || '';
  });

  const updateCustomMyStory = (text) => {
    setCustomMyStory(text);
    localStorage.setItem('bed_custom_my_story', text);
  };

  const updateWellnessIntelligenceSettings = (newSettings) => {
    setUserProfile(prev => ({
      ...prev,
      wellnessIntelligenceSettings: {
        ...(prev.wellnessIntelligenceSettings || DEFAULT_WELLNESS_INTELLIGENCE_SETTINGS),
        ...newSettings
      }
    }));
  };

  const provideInsightFeedback = (insightId, feedbackType) => {
    setUserProfile(prev => {
      const current = prev.wellnessIntelligenceSettings || DEFAULT_WELLNESS_INTELLIGENCE_SETTINGS;
      const updatedFeedback = { ...(current.insightFeedback || {}), [insightId]: feedbackType };
      const updatedDismissed = feedbackType === 'dont_show'
        ? [...(current.dismissedInsights || []), insightId]
        : (current.dismissedInsights || []);

      return {
        ...prev,
        wellnessIntelligenceSettings: {
          ...current,
          insightFeedback: updatedFeedback,
          dismissedInsights: updatedDismissed
        }
      };
    });
  };

  const dismissInsight = (insightId) => {
    provideInsightFeedback(insightId, 'dont_show');
  };

  const updateGoalSetting = (goalKey, newValue) => {
    setUserProfile(prev => ({
      ...prev,
      [goalKey]: newValue
    }));
  };

  // AI Memory Mutators (Prompt 6)
  const deleteAIMemory = (memoryId) => {
    setAiMemories(prev => prev.filter(m => m.id !== memoryId));
  };

  const clearAllAIMemory = () => {
    setAiMemories([]);
  };

  const toggleAIMemory = (enabled) => {
    updateWellnessIntelligenceSettings({ aiMemoryEnabled: enabled });
  };

  const submitRecommendationFeedback = (recId, feedbackType, reason = '') => {
    setUserProfile(prev => {
      const current = prev.wellnessIntelligenceSettings || DEFAULT_WELLNESS_INTELLIGENCE_SETTINGS;
      const updatedFeedback = { ...(current.insightFeedback || {}), [recId]: feedbackType };
      const updatedReasons = reason
        ? { ...(current.recommendationDismissalReasons || {}), [recId]: reason }
        : (current.recommendationDismissalReasons || {});
      const updatedDismissed = (feedbackType === 'dont_show' || feedbackType === 'not_helpful')
        ? [...(current.dismissedInsights || []), recId]
        : (current.dismissedInsights || []);

      return {
        ...prev,
        wellnessIntelligenceSettings: {
          ...current,
          insightFeedback: updatedFeedback,
          recommendationDismissalReasons: updatedReasons,
          dismissedInsights: updatedDismissed
        }
      };
    });
  };

  // Connected Devices, Sync & Data Trust Mutators (Prompt 7)
  const toggleDeviceConnection = (deviceId) => {
    setConnectedDevices(prev => prev.map(d => {
      if (d.id === deviceId) {
        const nextConnected = !d.connected;
        return {
          ...d,
          connected: nextConnected,
          status: nextConnected ? 'synced' : 'disconnected',
          lastSynced: nextConnected ? 'Just now' : d.lastSynced
        };
      }
      return d;
    }));
  };

  const syncDeviceNow = (deviceId) => {
    setConnectedDevices(prev => prev.map(d => {
      if (d.id === deviceId) {
        return { ...d, status: 'syncing' };
      }
      return d;
    }));

    setSyncStatus('syncing');

    setTimeout(() => {
      setConnectedDevices(prev => prev.map(d => {
        if (d.id === deviceId) {
          return { ...d, status: 'synced', lastSynced: 'Just now' };
        }
        return d;
      }));
      setSyncStatus('synced');
      setLastSyncTime('Just now');
    }, 900);
  };

  const triggerManualSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
      setLastSyncTime('Just now');
    }, 800);
  };

  const resolveDuplicateActivity = (duplicateId, action) => {
    setDuplicateSuggestions(prev => prev.map(dup => {
      if (dup.id === duplicateId) {
        return { ...dup, status: action };
      }
      return dup;
    }));

    if (action === 'combine') {
      const newAudit = {
        id: 'aud_' + Date.now(),
        timestamp: 'Just now',
        category: 'Movement',
        original: 'Smartwatch Walk + Manual Walk (Separate)',
        modified: 'Combined into single verified 30-min walk session (3,500 steps, ~125 kcal)',
        author: 'Rohini (User)',
        source: 'Duplicate Resolution'
      };
      setAuditLogs(prev => [newAudit, ...prev]);
    }
  };

  const resolveAnomaly = (anomalyId, action) => {
    setDataAnomalies(prev => prev.map(anom => {
      if (anom.id === anomalyId) {
        return { ...anom, status: action };
      }
      return anom;
    }));

    const newAudit = {
      id: 'aud_' + Date.now(),
      timestamp: 'Just now',
      category: 'Data Anomaly',
      original: 'Step Cadence: 34,200 steps in 45 mins',
      modified: action === 'confirmed' ? 'Confirmed as legitimate endurance activity by user' : 'Corrected sensor spike to baseline',
      author: 'Rohini (User)',
      source: 'Anomaly Review'
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  const updateVoiceAudioRetention = (retentionType) => {
    setVoiceAudioRetention(retentionType);
  };

  const eraseAllUserData = () => {
    localStorage.clear();
    window.location.reload();
  };

  // Social & Circle Handlers
  const updateEventStatus = (eventId, newStatus, counterNote = '') => {
    setSocialEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          status: newStatus,
          rescheduleNote: counterNote || evt.rescheduleNote
        };
      }
      return evt;
    }));
  };

  const createSocialEvent = (eventData) => {
    const newEvt = {
      id: 'evt_' + Date.now(),
      proposedBy: userProfile.name,
      status: 'accepted',
      ...eventData
    };
    setSocialEvents(prev => [newEvt, ...prev]);
    return newEvt;
  };

  const updateSocialEvent = (eventId, updatedFields) => {
    setSocialEvents(prev => prev.map(evt => evt.id === eventId ? { ...evt, ...updatedFields } : evt));
  };

  const deleteSocialEvent = (eventId) => {
    setSocialEvents(prev => prev.filter(evt => evt.id !== eventId));
  };

  const cheerCircleMember = (circleId, feedIndex) => {
    setCircles(prev => prev.map(c => {
      if (c.id === circleId) {
        const newFeed = [...c.activityFeed];
        newFeed[feedIndex].cheers = (newFeed[feedIndex].cheers || 0) + 1;
        return { ...c, activityFeed: newFeed };
      }
      return c;
    }));
  };

  const updatePrivacySetting = (profileId, settingKey, value) => {
    setConnectedProfiles(prev => prev.map(p => {
      if (p.id === profileId) {
        return {
          ...p,
          privacy: { ...p.privacy, [settingKey]: value }
        };
      }
      return p;
    }));
  };

  // Gym & Community Mutators (Prompt 5)
  const setSelectedGym = (gymId) => {
    setSelectedGymId(gymId);
    setUserProfile(prev => ({ ...prev, selectedGymId: gymId }));
  };

  const updateGymCommunityPrompt = (gymId, promptState) => {
    setGymCommunities(prev => {
      const current = prev[gymId] || { gymId, name: 'Gym Community', joined: false, discussions: [], tips: [], activities: [], members: [] };
      return {
        ...prev,
        [gymId]: {
          ...current,
          promptState,
          joined: promptState === 'joined'
        }
      };
    });
  };

  const joinGymCommunity = (gymId) => {
    updateGymCommunityPrompt(gymId, 'joined');
  };

  const leaveGymCommunity = (gymId) => {
    updateGymCommunityPrompt(gymId, 'maybe_later');
  };

  const addGymDiscussion = (gymId, post) => {
    setGymCommunities(prev => {
      const current = prev[gymId] || { gymId, name: 'Gym Community', joined: true, discussions: [], tips: [], activities: [], members: [] };
      const newPost = {
        id: 'disc_' + Date.now(),
        author: socialSettings.displayNameType === 'anonymous' ? 'Anonymous Member' : `${userProfile.name} (You)`,
        avatar: userProfile.avatar || '🌱',
        title: post.title,
        content: post.content,
        time: 'Just now',
        repliesCount: 0,
        likes: 0,
        isLiked: false
      };
      return {
        ...prev,
        [gymId]: {
          ...current,
          discussions: [newPost, ...(current.discussions || [])]
        }
      };
    });
  };

  const addGymTip = (gymId, text) => {
    setGymCommunities(prev => {
      const current = prev[gymId] || { gymId, name: 'Gym Community', joined: true, discussions: [], tips: [], activities: [], members: [] };
      const newTip = {
        id: 'tip_' + Date.now(),
        author: socialSettings.displayNameType === 'anonymous' ? 'Anonymous Member' : `${userProfile.name} (You)`,
        text,
        likes: 1
      };
      return {
        ...prev,
        [gymId]: {
          ...current,
          tips: [newTip, ...(current.tips || [])]
        }
      };
    });
  };

  const toggleGymActivity = (gymId, actId) => {
    setGymCommunities(prev => {
      const current = prev[gymId];
      if (!current) return prev;
      const updatedActs = (current.activities || []).map(act => {
        if (act.id === actId) {
          return {
            ...act,
            joined: !act.joined,
            participants: act.joined ? act.participants - 1 : act.participants + 1
          };
        }
        return act;
      });
      return {
        ...prev,
        [gymId]: {
          ...current,
          activities: updatedActs
        }
      };
    });
  };

  // Shared Plans Mutators
  const createSharedPlan = (planData) => {
    const newPlan = {
      id: 'plan_' + Date.now(),
      ...planData
    };
    setSharedPlans(prev => [newPlan, ...prev]);
  };

  const updateSharedPlan = (planId, data) => {
    setSharedPlans(prev => prev.map(p => p.id === planId ? { ...p, ...data } : p));
  };

  // Social Challenges Mutators
  const toggleChallengeJoin = (challengeId) => {
    setSocialChallenges(prev => prev.map(ch => {
      if (ch.id === challengeId) {
        return {
          ...ch,
          joined: !ch.joined,
          participantsCount: ch.joined ? ch.participantsCount - 1 : ch.participantsCount + 1
        };
      }
      return ch;
    }));
  };

  const createCustomChallenge = (challengeData) => {
    const newChallenge = {
      id: 'chal_' + Date.now(),
      title: challengeData.title,
      category: challengeData.category || 'General Wellness',
      icon: challengeData.icon || '🌱',
      description: challengeData.description || 'Gentle sustainable daily progress.',
      participantsCount: 1,
      daysLeft: Number(challengeData.totalDays) || 7,
      joined: true,
      userProgress: 0,
      totalDays: Number(challengeData.totalDays) || 7,
      isPaused: false,
      pauseReason: '',
      type: challengeData.type || 'friend',
      individualBaseline: challengeData.individualBaseline || '1 small step daily',
      groupProgressPercent: 0
    };

    setSocialChallenges(prev => [newChallenge, ...prev]);
  };

  const pauseChallenge = (challengeId, reason = 'Rest & recovery') => {
    setSocialChallenges(prev => prev.map(ch => {
      if (ch.id === challengeId) {
        return {
          ...ch,
          isPaused: true,
          pauseReason: reason
        };
      }
      return ch;
    }));
  };

  const resumeChallenge = (challengeId) => {
    setSocialChallenges(prev => prev.map(ch => {
      if (ch.id === challengeId) {
        return {
          ...ch,
          isPaused: false,
          pauseReason: ''
        };
      }
      return ch;
    }));
  };

  // Social Feed & Encouragement Mutators
  const addSocialFeedPost = (postData) => {
    const newPost = {
      id: 'post_' + Date.now(),
      author: `${userProfile.name} (You)`,
      avatar: userProfile.avatar || '🌱',
      relationship: 'Self',
      time: 'Just now',
      text: postData.text,
      activityBadge: postData.activityBadge || '🌱 Mindful Action',
      reactions: { love: 0, clap: 0, proud: 0, momentum: 0 },
      userReaction: null
    };
    setSocialFeedPosts(prev => [newPost, ...prev]);
  };

  const reactToSocialPost = (postId, reactionType) => {
    setSocialFeedPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isSameReaction = post.userReaction === reactionType;
        const nextUserReaction = isSameReaction ? null : reactionType;
        const currentReactions = { ...post.reactions };

        if (post.userReaction) {
          currentReactions[post.userReaction] = Math.max(0, (currentReactions[post.userReaction] || 1) - 1);
        }
        if (nextUserReaction) {
          currentReactions[nextUserReaction] = (currentReactions[nextUserReaction] || 0) + 1;
        }

        return {
          ...post,
          reactions: currentReactions,
          userReaction: nextUserReaction
        };
      }
      return post;
    }));
  };

  const updateSocialParticipationLevel = (level) => {
    setSocialSettings(prev => ({ ...prev, socialParticipationLevel: level }));
  };

  const updateLeaderboardMode = (mode) => {
    setSocialSettings(prev => ({ ...prev, leaderboardMode: mode }));
  };

  const updateLeaderboardScope = (scope) => {
    setSocialSettings(prev => ({ ...prev, leaderboardScope: scope }));
  };

  const shareCustomTheme = (themeData, visibility = 'friends') => {
    const newCommunityTheme = {
      id: 'th_' + Date.now(),
      title: themeData.name || 'Custom Serenity',
      author: `${userProfile.name} (You)`,
      avatar: userProfile.avatar || '🌱',
      primaryColor: themeData.primaryColor || '#2d6a4f',
      accentColor: themeData.accentColor || '#52b788',
      icon: themeData.icon || '🎨',
      description: themeData.description || 'A calming aesthetic palette created with Better Every Day Theme Studio.',
      sharesCount: 1,
      visibility
    };
    setSharedCommunityThemes(prev => [newCommunityTheme, ...prev]);
  };

  // Social Settings Mutators
  const updateSocialSettings = (newSettings) => {
    setSocialSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const toggleSocialQuietMode = () => {
    setSocialSettings(prev => ({
      ...prev,
      socialQuietMode: !prev.socialQuietMode
    }));
  };

  // Relationship & Privacy Mutators
  const updateRelationshipPrivacy = (relId, key, value) => {
    setRelationships(prev => prev.map(r => {
      if (r.id === relId) {
        return {
          ...r,
          privacy: { ...r.privacy, [key]: value }
        };
      }
      return r;
    }));
  };

  const toggleFollowRelationship = (relId) => {
    setRelationships(prev => prev.map(r => {
      if (r.id === relId) {
        const isCurrentlyFollowing = r.relationshipType === 'following' || r.relationshipType === 'friend';
        const nextType = isCurrentlyFollowing ? 'none' : (r.isMutual ? 'friend' : 'following');
        return { ...r, relationshipType: nextType };
      }
      return r;
    }));
  };

  const blockRelationship = (relId) => {
    setRelationships(prev => prev.filter(r => r.id !== relId));
  };

  const reportUser = (relId, reason) => {
    // Non-destructive safe flag
  };

  const createCircle = (circleData) => {
    const newCircle = {
      id: 'c_' + Date.now(),
      membersCount: (circleData.members || []).length + 1,
      currentChallenge: {
        title: '7-Day Gentle Habit Rhythm',
        desc: 'Support one another with daily check-ins.',
        progressPercent: 0,
        daysLeft: 7
      },
      activityFeed: [],
      ...circleData
    };
    setCircles(prev => [newCircle, ...prev]);
  };

  const leaveCircle = (circleId) => {
    setCircles(prev => prev.filter(c => c.id !== circleId));
  };

  const submitCommunityRecipe = (recipe) => {
    const submission = {
      id: 'mod_' + Date.now(),
      title: recipe.title,
      submittedBy: `${userProfile.name} (You)`,
      date: 'Just now',
      category: recipe.category,
      calories: recipe.calories,
      macros: recipe.macros,
      status: 'pending_moderation',
      notes: recipe.description
    };
    setModerationQueue(prev => [submission, ...prev]);
  };

  const approveModerationItem = (id) => {
    const item = moderationQueue.find(q => q.id === id);
    if (!item) return;

    setModerationQueue(prev => prev.filter(q => q.id !== id));
    setCommunityRecipes(prev => [{
      id: 'rec_comm_' + Date.now(),
      title: item.title,
      category: item.category,
      timeMinutes: 20,
      tags: ['Community', 'High Protein'],
      calories: item.calories,
      macros: item.macros,
      micros: { iron: '3.0mg', calcium: '120mg', vitC: '30mg', vitD: '0mcg', folate: '80mcg', bVitamins: 'High' },
      image: '🍲',
      description: item.notes || 'Delicious member-submitted wellness recipe.',
      ingredients: ['Seasonal whole foods', 'Fresh aromatic spices'],
      isCommunity: true,
      submittedBy: item.submittedBy,
      status: 'approved'
    }, ...prev]);
  };

  // How I Thrive Helpers
  const updateHowIThrive = (keyOrObject, value) => {
    setUserProfile(prev => {
      const prevThrive = prev.howIThrive || DEFAULT_HOW_I_THRIVE;
      let nextThrive;
      if (typeof keyOrObject === 'string') {
        nextThrive = { ...prevThrive, [keyOrObject]: value };
      } else {
        nextThrive = { ...prevThrive, ...keyOrObject };
      }
      return {
        ...prev,
        howIThrive: nextThrive
      };
    });
  };

  const resetHowIThrive = () => {
    setUserProfile(prev => ({
      ...prev,
      howIThrive: { ...DEFAULT_HOW_I_THRIVE },
      theme: 'sage'
    }));
    setTheme('sage');
  };

  const toggleOneThingMode = () => {
    const current = userProfile.howIThrive?.oneThingModeActive;
    updateHowIThrive('oneThingModeActive', !current);
  };

  const toggleLowEnergyMode = () => {
    const current = userProfile.howIThrive?.lowEnergyMode;
    updateHowIThrive('lowEnergyMode', !current);
  };

  const toggleOverwhelmMode = () => {
    const current = userProfile.howIThrive?.overwhelmMode;
    updateHowIThrive('overwhelmMode', !current);
  };

  const pauseStreak = (reason = 'planned_break') => {
    updateHowIThrive({
      streakPaused: true,
      streakPauseReason: reason
    });
  };

  const resumeStreak = () => {
    updateHowIThrive({
      streakPaused: false,
      streakPauseReason: null
    });
  };

  const createCustomTheme = (themeData) => {
    const customList = userProfile.howIThrive?.customThemes || [];
    const updated = [themeData, ...customList];
    updateHowIThrive('customThemes', updated);
    setUserProfile(prev => ({ ...prev, theme: themeData.id }));
    setTheme(themeData.id);
  };

  const updateRoutineStep = (routineId, stepId, completed) => {
    setRoutines(prev => prev.map(rt => {
      if (rt.id === routineId) {
        return {
          ...rt,
          steps: rt.steps.map(s => s.id === stepId ? { ...s, completed } : s)
        };
      }
      return rt;
    }));
  };

  const updateScheduleItemStatus = (itemId, newStatus) => {
    setVisualSchedule(prev => prev.map(it => it.id === itemId ? { ...it, status: newStatus } : it));
  };

  // Daily Rhythm & Personalized Wellness-Day Logic
  const dailyRhythm = userProfile.howIThrive?.dailyRhythm || DEFAULT_DAILY_RHYTHM;

  const updateDailyRhythm = (newRhythmData) => {
    updateHowIThrive('dailyRhythm', {
      ...dailyRhythm,
      ...newRhythmData
    });
  };

  const setTemporaryShiftOverride = (start, sleep) => {
    updateHowIThrive('dailyRhythm', {
      ...dailyRhythm,
      isShiftOverrideActive: true,
      todayStartOverride: start,
      todaySleepOverride: sleep
    });
  };

  const clearTemporaryShiftOverride = () => {
    updateHowIThrive('dailyRhythm', {
      ...dailyRhythm,
      isShiftOverrideActive: false,
      todayStartOverride: null,
      todaySleepOverride: null
    });
  };

  /**
   * Resolves the user's active "Wellness Day" date string (YYYY-MM-DD)
   * for any given timestamp based on their personal schedule rhythm.
   * Overnight shifts (e.g. 16:00 to 08:00) keep activity in the same wellness period
   * without an artificial midnight cutoff, while keeping calendar dates standard.
   */
  const getWellnessDayDate = (timestamp = new Date()) => {
    const d = new Date(timestamp);
    const effectiveStart = (dailyRhythm.isShiftOverrideActive && dailyRhythm.todayStartOverride) 
      ? dailyRhythm.todayStartOverride 
      : (dailyRhythm.dayStartTime || '07:00');
    
    const [startH, startM] = effectiveStart.split(':').map(Number);
    const hour = d.getHours();
    const minute = d.getMinutes();
    const timeInMinutes = hour * 60 + minute;
    const startInMinutes = startH * 60 + (startM || 0);

    // If day starts in afternoon/evening (e.g. 16:00) and current time is before that start time (e.g. 02:00, 05:00, 07:00)
    // this time belongs to the wellness day that started yesterday at startH:startM
    if (startH >= 12 && timeInMinutes < startInMinutes) {
      const yesterday = new Date(d);
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday.toISOString().split('T')[0];
    }

    return d.toISOString().split('T')[0];
  };

  const getWellnessDayInfo = () => {
    const effectiveStart = (dailyRhythm.isShiftOverrideActive && dailyRhythm.todayStartOverride) 
      ? dailyRhythm.todayStartOverride 
      : (dailyRhythm.dayStartTime || '07:00');
    const effectiveSleep = (dailyRhythm.isShiftOverrideActive && dailyRhythm.todaySleepOverride) 
      ? dailyRhythm.todaySleepOverride 
      : (dailyRhythm.sleepTime || '23:00');

    const [startH] = effectiveStart.split(':').map(Number);
    const [sleepH] = effectiveSleep.split(':').map(Number);
    const isOvernight = startH > sleepH;
    const currentWellnessDate = getWellnessDayDate();

    return {
      activeDate: currentWellnessDate,
      dayStartTime: effectiveStart,
      sleepTime: effectiveSleep,
      isOvernight,
      isShiftOverrideActive: dailyRhythm.isShiftOverrideActive || false,
      variability: dailyRhythm.scheduleVariability || 'same',
      rhythmLabel: isOvernight ? `Night/Rotating Shift (${effectiveStart} – ${effectiveSleep})` : `Daytime Rhythm (${effectiveStart} – ${effectiveSleep})`
    };
  };

  const addCustomShift = (shiftData) => {
    const newShift = {
      id: 'shift_' + Date.now(),
      label: shiftData.label || 'Custom Shift',
      start: shiftData.start || '09:00',
      sleep: shiftData.sleep || '01:00',
      icon: shiftData.icon || '⚡'
    };
    const currentList = dailyRhythm.customShifts || [];
    updateDailyRhythm({ customShifts: [...currentList, newShift] });
    return newShift;
  };

  const deleteCustomShift = (shiftId) => {
    const currentList = dailyRhythm.customShifts || [];
    updateDailyRhythm({ customShifts: currentList.filter(s => s.id !== shiftId) });
  };

  const toggleSyncCycleRecommendations = (val) => {
    setUserProfile(prev => ({
      ...prev,
      syncCycleRecommendations: typeof val === 'boolean' ? val : !prev.syncCycleRecommendations
    }));
  };

  /**
   * Estimates an appropriate daily water goal and pacing based on:
   * 1. Dietary info / meals logged
   * 2. Recorded exercise / active workout minutes / steps
   * 3. Personalized Daily Rhythm wake & sleep hours
   */
  const getWaterRecommendation = () => {
    let baseTargetMl = userProfile.hydrationGoalMl || 2250;
    if (activeWorkoutMinutes >= 20) baseTargetMl += 250;
    if (stepCount >= 7000) baseTargetMl += 250;

    const cupsTarget = Math.max(4, Math.round(baseTargetMl / 250));
    const currentCups = Math.min(cupsTarget, Math.floor(hydrationMl / 250));
    const remainingCups = Math.max(0, cupsTarget - currentCups);

    const rhythm = getWellnessDayInfo();
    const [sleepH, sleepM] = rhythm.sleepTime.split(':').map(Number);
    const now = new Date();
    const currentH = now.getHours();
    const currentM = now.getMinutes();

    let remainingHours;
    if (rhythm.isOvernight) {
      if (currentH <= sleepH) {
        remainingHours = (sleepH - currentH) + ((sleepM || 0) - currentM) / 60;
      } else {
        remainingHours = (24 - currentH + sleepH) + ((sleepM || 0) - currentM) / 60;
      }
    } else {
      if (currentH > sleepH) {
        remainingHours = 1;
      } else {
        remainingHours = (sleepH - currentH) + ((sleepM || 0) - currentM) / 60;
      }
    }

    remainingHours = Math.max(1, Math.round(remainingHours));

    let pacingText = 'Try approximately 1 cup every 2 hours.';
    if (remainingCups <= 0) {
      pacingText = 'Target met! Sip gently to thirst for the rest of your day.';
    } else {
      const hoursPerCup = Math.max(1, Math.round(remainingHours / remainingCups));
      if (hoursPerCup <= 1) {
        pacingText = `Try approximately 1 cup every hour before sleep (${rhythm.sleepTime}).`;
      } else if (hoursPerCup === 2) {
        pacingText = `Try approximately 1 cup every 2 hours before sleep (${rhythm.sleepTime}).`;
      } else {
        pacingText = `Try approximately 1 cup every ${hoursPerCup} hours before sleep (${rhythm.sleepTime}).`;
      }
    }

    return {
      targetMl: baseTargetMl,
      cupsTarget,
      currentCups,
      remainingCups,
      pacingText,
      isComplete: remainingCups === 0
    };
  };

  // Derive Better Every Day Score
  const betterEveryDayScore = calculateBetterEveryDayScore({
    smallStepCompleted: smallStepState.isCompleted,
    hydrationMl,
    hydrationGoalMl: userProfile.hydrationGoalMl || 2250,
    workoutMinutes: activeWorkoutMinutes,
    mealsLoggedCount: loggedMeals.length,
    checkInCompleted: dailyCheckIn.isCompleted,
    journalLogged: journalEntries.some(j => j.date === new Date().toISOString().split('T')[0]),
    calmAudioMinutes: 5
  });

  // Derive Daily Recommendations
  const personalizedDaily = getPersonalizedRecommendations({
    checkIn: dailyCheckIn,
    userProfile,
    activeWorkout: activeWorkoutMinutes,
    hydrationMl,
    meals: loggedMeals
  });

  return (
    <WellnessContext.Provider value={{
      userProfile,
      setUserProfile,
      theme,
      setTheme,
      overviewFrequency,
      updateOverviewFrequency,
      overviewPillars,
      updateOverviewPillars,
      interactionMode,
      updateInteractionMode,
      dailyCheckIn,
      recordCheckIn,
      smallStepState,
      completeSmallStep,
      hydrationMl,
      incrementHydration,
      stepCount,
      setStepCount,
      activeWorkoutMinutes,
      setActiveWorkoutMinutes,
      completedWorkouts,
      setCompletedWorkouts,
      loggedMeals,
      logMeal,
      cravingsLogs,
      logCraving,
      journalEntries,
      addJournalEntry,
      deleteJournalEntry,
      discoveredGratitude,
      approveDiscoveredGratitude,
      rejectDiscoveredGratitude,
      saveDiscoveredGratitudeForLater,
      applyParsedVoiceUpdates,
      voiceSettings: userProfile.voiceSettings || DEFAULT_VOICE_SETTINGS,
      gratitudeSettings: userProfile.gratitudeSettings || DEFAULT_GRATITUDE_SETTINGS,
      wellnessIntelligenceSettings: userProfile.wellnessIntelligenceSettings || DEFAULT_WELLNESS_INTELLIGENCE_SETTINGS,
      provideInsightFeedback,
      dismissInsight,
      updateWellnessIntelligenceSettings,
      updateGoalSetting,
      aiMemories,
      deleteAIMemory,
      clearAllAIMemory,
      toggleAIMemory,
      submitRecommendationFeedback,
      customMyStory,
      updateCustomMyStory,
      updateVoiceSettings,
      updateGratitudeSettings,
      socialEvents,
      updateEventStatus,
      createSocialEvent,
      updateSocialEvent,
      deleteSocialEvent,
      circles,
      createCircle,
      leaveCircle,
      cheerCircleMember,
      connectedProfiles,
      activeProfileId,
      setActiveProfileId,
      updatePrivacySetting,
      verifiedGyms: VERIFIED_GYMS,
      selectedGymId,
      setSelectedGym,
      gymCommunities,
      updateGymCommunityPrompt,
      joinGymCommunity,
      leaveGymCommunity,
      addGymDiscussion,
      addGymTip,
      toggleGymActivity,
      sharedPlans,
      createSharedPlan,
      updateSharedPlan,
      socialChallenges,
      toggleChallengeJoin,
      socialSettings,
      updateSocialSettings,
      toggleSocialQuietMode,
      relationships,
      updateRelationshipPrivacy,
      toggleFollowRelationship,
      blockRelationship,
      reportUser,
      connectedDevices,
      toggleDeviceConnection,
      syncDeviceNow,
      syncStatus,
      lastSyncTime,
      triggerManualSync,
      dataAnomalies,
      resolveAnomaly,
      duplicateSuggestions,
      resolveDuplicateActivity,
      auditLogs,
      voiceAudioRetention,
      updateVoiceAudioRetention,
      eraseAllUserData,
      userBadges,
      sharedCommunityThemes,
      socialFeedPosts,
      createCustomChallenge,
      pauseChallenge,
      resumeChallenge,
      addSocialFeedPost,
      reactToSocialPost,
      updateSocialParticipationLevel,
      updateLeaderboardMode,
      updateLeaderboardScope,
      shareCustomTheme,
      affirmationStyle,
      setAffirmationStyle,
      favoriteAffirmations,
      setFavoriteAffirmations,
      communityRecipes,
      moderationQueue,
      submitCommunityRecipe,
      approveModerationItem,
      betterEveryDayScore,
      personalizedDaily,
      howIThrive: userProfile.howIThrive || DEFAULT_HOW_I_THRIVE,
      updateHowIThrive,
      resetHowIThrive,
      toggleOneThingMode,
      toggleLowEnergyMode,
      toggleOverwhelmMode,
      pauseStreak,
      resumeStreak,
      createCustomTheme,
      routines,
      updateRoutineStep,
      visualSchedule,
      updateScheduleItemStatus,
      bodySignals,
      logBodySignal,
      deleteBodySignal,
      voiceRecordings,
      addVoiceRecording,
      deleteVoiceRecording,
      dailyRhythm,
      updateDailyRhythm,
      setTemporaryShiftOverride,
      clearTemporaryShiftOverride,
      getWellnessDayDate,
      getWellnessDayInfo,
      addCustomShift,
      deleteCustomShift,
      customBeverages,
      addCustomBeverage,
      showMealSummary,
      setShowMealSummary,
      toggleMealSummary,
      toggleSyncCycleRecommendations,
      getWaterRecommendation,
      microMovementSettings,
      microMovementLogs,
      toggleMicroMovement,
      setMicroMovementPreference,
      togglePostureResets,
      logMicroMovement,
      isWithinActiveWellnessDay,
      getMicroMovementStats,
      dancePartySettings,
      dancePartyLogs,
      logDanceParty,
      updateDancePartySettings,
      petProfiles,
      petPlayLogs,
      addPetProfile,
      updatePetProfile,
      deletePetProfile,
      logPetPlayActivity,
      deletePetPlayLog,
      getPetPlayStats,
      savedPlanIds,
      favouritePlanIds,
      customExercises,
      savePlanToHub,
      removePlanFromHub,
      toggleFavouritePlan,
      addCustomExercise,
      deleteCustomExercise
    }}>
      {children}
    </WellnessContext.Provider>
  );
}

export function useWellness() {
  return useContext(WellnessContext);
}
