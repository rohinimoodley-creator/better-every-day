/**
 * PIP REACTION ENGINE & CONTEXT SYSTEM
 * 
 * "One Pip. Many little moments."
 * 
 * Provides:
 * - Context configurations for all app features
 * - Appropriate, non-judgmental reaction pools
 * - Cooldown protection (prevents spamming or chaotic animation)
 * - Accessibility and Reduced-Motion filtering
 * - Gentle web audio mascot chime synthesis
 */

export const PIP_CONTEXTS = {
  home: {
    id: 'home',
    title: 'Home Companion',
    level: 1, // Major
    defaultMood: 'happy',
    defaultMessage: "One small step at your own pace today. I'm right here with you! 🌱",
    reactionPool: [
      { id: 'h1', mood: 'celebrate', anim: 'bounce', text: "So good to see you! What feels right to explore today? ✨" },
      { id: 'h2', mood: 'happy', anim: 'sway', text: "Remember: small steps lead to sustainable wellbeing. 🌿" },
      { id: 'h3', mood: 'calm', anim: 'breathe', text: "No rush, no pressure. Just be here right now. 💚" },
      { id: 'h4', mood: 'playful', anim: 'wink', text: "Ready for a Dance Break whenever you need a boost! 💃" },
      { id: 'h5', mood: 'encouraging', anim: 'nod', text: "Every day is a fresh opportunity to treat yourself kindly. 🌸" }
    ]
  },

  take_a_moment: {
    id: 'take_a_moment',
    title: 'Take a Moment',
    level: 1, // Major
    defaultMood: 'calm',
    defaultMessage: "You have nothing to prove. All statistics and goals are paused. Just breathe with me. 🫧",
    reactionPool: [
      { id: 'tm1', mood: 'breathing', anim: 'breathe', text: "Slow breath in... and gentle release out. 🌿" },
      { id: 'tm2', mood: 'calm', anim: 'sway', text: "I'm right beside you. Take all the time you need. 💚" },
      { id: 'tm3', mood: 'sleepy', anim: 'yawn', text: "Release your shoulders and soften your jaw. 🕊️" },
      { id: 'tm4', mood: 'calm', anim: 'nod', text: "You are doing just fine. Exactly as you are. 🌸" },
      { id: 'tm5', mood: 'peaceful', anim: 'breathe', text: "This moment belongs entirely to you. Settle in gently. 🫧" }
    ]
  },

  dance_party: {
    id: 'dance_party',
    title: 'Dance Break',
    level: 1, // Major
    defaultMood: 'celebrate',
    defaultMessage: "Move because it feels good! Zero minimum time, zero pressure! 🎉",
    reactionPool: [
      { id: 'dp1', mood: 'celebrate', anim: 'bounce', text: "Wiggle it out! Any amount of dance is 100% valid! 💃✨" },
      { id: 'dp2', mood: 'playful', anim: 'wiggle', text: "Feel the rhythm! Even 10 seconds brings joyful energy! 🎵" },
      { id: 'dp3', mood: 'celebrate', anim: 'sparkle', text: "Look at those moves! Joy in motion! 🌟" },
      { id: 'dp4', mood: 'happy', anim: 'bounce', text: "Dancing just because we can! Keep grooving! 🕺💚" }
    ]
  },

  move: {
    id: 'move',
    title: 'Move & Activity',
    level: 2, // Contextual
    defaultMood: 'encouraging',
    defaultMessage: "Gentle movement that fits your day — stretch, walk, or reset your posture. 🌱",
    reactionPool: [
      { id: 'm1', mood: 'stretching', anim: 'stretch', text: "A gentle stretch feels so refreshing! 🤸" },
      { id: 'm2', mood: 'encouraging', anim: 'bounce', text: "Every bit of movement counts, big or tiny! 🌿" },
      { id: 'm3', mood: 'playful', anim: 'wiggle', text: "Shake out tension from sitting. Reset your posture! 🚶" },
      { id: 'm4', mood: 'happy', anim: 'nod', text: "Move for how it makes you feel, never for a score! 💚" }
    ]
  },

  pet_play: {
    id: 'pet_play',
    title: 'Pet Play',
    level: 2, // Contextual
    defaultMood: 'playful',
    defaultMessage: "Spending active, loving time with your pet counts as meaningful movement! 🐾",
    reactionPool: [
      { id: 'pp1', mood: 'playful', anim: 'bounce', text: "Pet play zoomies are pure joy! 🐾💚" },
      { id: 'pp2', mood: 'curious', anim: 'tilt', text: "What fun activity are you playing together today? 🎾" },
      { id: 'pp3', mood: 'happy', anim: 'wiggle', text: "Loving bonds and happy wiggles! 🐶🐱" },
      { id: 'pp4', mood: 'celebrate', anim: 'sparkle', text: "Moving together makes both of your hearts happy! ✨" }
    ]
  },

  rest: {
    id: 'rest',
    title: 'Rest & Unwind',
    level: 2, // Contextual
    defaultMood: 'sleepy',
    defaultMessage: "Rest is restorative and essential. Cozy up and unwind peacefully. 🌙",
    reactionPool: [
      { id: 'r1', mood: 'sleepy', anim: 'yawn', text: "Yaaawn... Time to let your mind and body soften. 😴" },
      { id: 'r2', mood: 'calm', anim: 'sway', text: "Curling up in a cozy bubble. Peaceful rest! 🌌" },
      { id: 'r3', mood: 'calm', anim: 'breathe', text: "Dim the lights and let the quiet soothe you. 🕯️" },
      { id: 'r4', mood: 'peaceful', anim: 'blink', text: "You did enough today. Let tomorrow wait until morning. 🌙" }
    ]
  },

  record: {
    id: 'record',
    title: 'Record & Journal',
    level: 2, // Contextual
    defaultMood: 'listening',
    defaultMessage: "I'm quietly listening. Write or record whatever is on your heart. ✍️",
    reactionPool: [
      { id: 'rec1', mood: 'listening', anim: 'tilt', text: "Your thoughts are safe here. Take your time. 💭" },
      { id: 'rec2', mood: 'encouraging', anim: 'nod', text: "Getting thoughts onto paper brings such clarity. 🌿" },
      { id: 'rec3', mood: 'calm', anim: 'blink', text: "A quiet, peaceful space to reflect. 📖" },
      { id: 'rec4', mood: 'warm', anim: 'nod', text: "Honoring whatever you feel today with kindness. 💛" }
    ]
  },

  gratitude: {
    id: 'gratitude',
    title: 'Gratitude Studio',
    level: 2, // Contextual
    defaultMood: 'warm',
    defaultMessage: "Appreciating small micro-moments cultivates lasting peace. 💛",
    reactionPool: [
      { id: 'g1', mood: 'celebrate', anim: 'sparkle', text: "What a beautiful little moment to treasure! ✨" },
      { id: 'g2', mood: 'calm', anim: 'breathe', text: "Feeling grateful warms the whole soul. 💛" },
      { id: 'g3', mood: 'happy', anim: 'sway', text: "Noticing good things trains our minds toward joy. 🌱" },
      { id: 'g4', mood: 'warm', anim: 'nod', text: "The simplest joys are often the deepest. 🌸" }
    ]
  },

  nourish: {
    id: 'nourish',
    title: 'Nourish',
    level: 2, // Contextual
    defaultMood: 'neutral',
    defaultMessage: "Eat with intention and kindness to your body. Zero food guilt here. 🥗",
    reactionPool: [
      { id: 'n1', mood: 'happy', anim: 'nod', text: "Nourish yourself with what fuels your energy and joy. 🥑" },
      { id: 'n2', mood: 'curious', anim: 'tilt', text: "Listening to your body's natural hunger and craving signals! 🍎" },
      { id: 'n3', mood: 'calm', anim: 'sway', text: "Every meal is a peaceful opportunity to care for yourself. 🥣" }
    ]
  },

  hydrate: {
    id: 'hydrate',
    title: 'Hydrate',
    level: 2, // Contextual
    defaultMood: 'encouraging',
    defaultMessage: "A cool glass of water refreshes your body from the inside out. 💧",
    reactionPool: [
      { id: 'hy1', mood: 'happy', anim: 'bounce', text: "Ahhh, so refreshing! Sip gently. 💧✨" },
      { id: 'hy2', mood: 'encouraging', anim: 'nod', text: "Staying hydrated keeps your energy and focus steady. 🌊" },
      { id: 'hy3', mood: 'playful', anim: 'wiggle', text: "One fresh sip at a time! 💧🌱" }
    ]
  },

  breathwork: {
    id: 'breathwork',
    title: 'Breathwork',
    level: 2, // Contextual
    defaultMood: 'breathing',
    defaultMessage: "Synchronize with the rhythm. Let your breath restore your nervous system. 🌬️",
    reactionPool: [
      { id: 'bw1', mood: 'breathing', anim: 'breathe', text: "Inhale calm... Exhale release... 🍃" },
      { id: 'bw2', mood: 'calm', anim: 'sway', text: "Grounded and centered right here in this breath. 🧘" },
      { id: 'bw3', mood: 'peaceful', anim: 'blink', text: "Let each breath bring ease throughout your body. 🫧" }
    ]
  },

  insights: {
    id: 'insights',
    title: 'Wellness Intelligence',
    level: 2, // Contextual
    defaultMood: 'curious',
    defaultMessage: "Here are gentle patterns we noticed in your rhythms. 💡",
    reactionPool: [
      { id: 'ins1', mood: 'curious', anim: 'tilt', text: "Fascinating patterns! Self-knowledge is empowering. 🔍" },
      { id: 'ins2', mood: 'celebrate', anim: 'sparkle', text: "Look at your steady consistency over time! 🎉" },
      { id: 'ins3', mood: 'encouraging', anim: 'nod', text: "Understanding your natural cycles helps life flow smoothly. 🌿" }
    ]
  },

  calendar: {
    id: 'calendar',
    title: 'Life & Rhythm Calendar',
    level: 2, // Contextual
    defaultMood: 'calm',
    defaultMessage: "Honoring your daily, weekly, and seasonal rhythms. 📅",
    reactionPool: [
      { id: 'cal1', mood: 'happy', anim: 'nod', text: "Each day has its own natural pace. 🌿" },
      { id: 'cal2', mood: 'calm', anim: 'sway', text: "Living in harmony with your natural cycles. 🌸" }
    ]
  },

  empty_state: {
    id: 'empty_state',
    title: 'Empty State',
    level: 3, // Micro
    defaultMood: 'calm',
    defaultMessage: "Nothing here yet — we'll build it together when you're ready. 🌱",
    reactionPool: [
      { id: 'es1', mood: 'happy', anim: 'nod', text: "Whenever you are ready, we can start right here. ✨" },
      { id: 'es2', mood: 'calm', anim: 'sway', text: "A fresh blank page is a peaceful place to begin. 🌿" }
    ]
  },

  completion: {
    id: 'completion',
    title: 'Completion Moment',
    level: 3, // Micro
    defaultMood: 'celebrate',
    defaultMessage: "Wonderful step! Proportional, genuine celebration. 🎉",
    reactionPool: [
      { id: 'comp1', mood: 'celebrate', anim: 'bounce', text: "Nice work taking care of yourself today! 🌱💚" },
      { id: 'comp2', mood: 'happy', anim: 'sparkle', text: "Every small step truly adds up! ✨" },
      { id: 'comp3', mood: 'encouraging', anim: 'nod', text: "Proud of you for showing up for yourself! 🌸" }
    ]
  }
};

/**
 * Cooldown tracker to prevent rapid spamming of animations
 */
const lastInteractionTimestamps = new Map();
const COOLDOWN_MS = 1400;

export function checkPipCooldown(instanceKey = 'global') {
  const now = Date.now();
  const last = lastInteractionTimestamps.get(instanceKey) || 0;
  if (now - last < COOLDOWN_MS) {
    return false; // Still in cooldown
  }
  lastInteractionTimestamps.set(instanceKey, now);
  return true; // Cooldown cleared
}

/**
 * Get a random reaction from a context pool, avoiding immediate repetition
 */
export function getPipContextReaction(contextKey = 'home', lastReactionId = null, isReducedMotion = false) {
  const ctx = PIP_CONTEXTS[contextKey] || PIP_CONTEXTS.home;
  const pool = ctx.reactionPool || [];
  
  if (pool.length === 0) {
    return { mood: ctx.defaultMood || 'happy', anim: 'none', text: ctx.defaultMessage };
  }

  // Filter out last reaction if possible to prevent looping
  const available = pool.filter(r => r.id !== lastReactionId);
  const candidates = available.length > 0 ? available : pool;
  const chosen = candidates[Math.floor(Math.random() * candidates.length)];

  // If reduced motion is active, sanitize animations
  const anim = isReducedMotion ? 'none' : chosen.anim;

  return {
    ...chosen,
    anim
  };
}

/**
 * Synthesize a soft, serene pentatonic mascot chime using Web Audio
 */
export function playPipChime(soundEnabled = true) {
  if (!soundEnabled || typeof window === 'undefined') return;

  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    
    // Play a gentle two-note harmonic chime (e.g. C5 -> E5)
    const notes = [523.25, 659.25];
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.08 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.5);
    });
  } catch (err) {
    // Non-critical audio chime fallback
  }
}
