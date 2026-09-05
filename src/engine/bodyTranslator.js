// Body Translator Engine
// Decodes cravings and sensory desires into flavor profiles, texture preferences, and satisfying mindful food choices.
// Purely educational and non-diagnostic.

import { CRAVINGS_DATABASE } from '../data/mockData';

export const EXPANDED_CRAVINGS = [
  ...CRAVINGS_DATABASE,
  {
    id: 'ice_cream',
    name: 'Ice Cream / Creamy Cold Treats',
    icon: '🍦',
    category: 'creamy_sweet',
    bodySignals: [
      { type: 'Sensory Profile', desc: 'Looking for a cooling temperature sensation paired with smooth, creamy mouthfeel and sweetness.' },
      { type: 'Emotional Comfort', desc: 'Cold creamy textures activate soothing sensory feedback and nostalgic comfort associations.' },
      { type: 'Energy & Pacing', desc: 'Can signal an afternoon dip or body seeking a soothing treat after a warm or demanding stretch.' }
    ],
    healthyOptions: [
      { name: 'Frozen Banana & Cocoa "Nice Cream"', tip: 'Blended frozen bananas create an identical velvety soft-serve texture with natural potassium.' },
      { name: 'Greek Yogurt with Swirled Honey & Frozen Berries', tip: 'Creamy cold richness with 15g+ gut-friendly protein.' },
      { name: 'Chilled Coconut Milk Chia Pudding', tip: 'Satisfying silky mouthfeel with omega-3s and plant fiber.' }
    ]
  },
  {
    id: 'fried_crunchy',
    name: 'Fried / Crispy Finger Foods',
    icon: '🍟',
    category: 'crispy_savory',
    bodySignals: [
      { type: 'Sensory Profile', desc: 'Desire for intense auditory and tactile crunch combined with savory richness.' },
      { type: 'Stress & Chewing', desc: 'Rhythmic chewing of crunchy, audible textures helps release built-up jaw tension.' },
      { type: 'Flavor Saturation', desc: 'Seeking rapid flavor satisfaction with salt and comforting warmth.' }
    ],
    healthyOptions: [
      { name: 'Air-Fried Crispy Spiced Chickpeas or Edamame', tip: 'Delivers a loud, satisfying crunch packed with plant protein and fiber.' },
      { name: 'Baked Sweet Potato Fries with Sea Salt & Paprika', tip: 'Golden crispy edges with slow-burning complex carbs.' },
      { name: 'Crunchy Seed Crackers with Whipped Feta or Guacamole', tip: 'High-satisfaction crunch paired with rich healthy fats.' }
    ]
  },
  {
    id: 'spicy_sour',
    name: 'Spicy / Tangy / Sour Foods',
    icon: '🌶️',
    category: 'zesty',
    bodySignals: [
      { type: 'Sensory Profile', desc: 'Seeking sensory stimulation, palate awakening, or a break from bland routine.' },
      { type: 'Circulation & Alertness', desc: 'Capsaicin and citric acids trigger instant endorphin release and sensory wakefulness.' },
      { type: 'Digestive Spark', desc: 'Tangy and fermented flavors naturally stimulate saliva and digestive interest.' }
    ],
    healthyOptions: [
      { name: 'Cucumber Slices with Lime Juice, Tajín & Sea Salt', tip: 'Ultra-refreshing, zesty, and crunchy with zero heaviness.' },
      { name: 'Kimchi or Sauerkraut with Brown Rice & Sesame', tip: 'Tangy fermented umami with trillions of living probiotics.' },
      { name: 'Spiced Roasted Pumpkin Seeds with Chili & Lime', tip: 'Zesty heat and satisfying mineral crunch.' }
    ]
  },
  {
    id: 'refreshing_fruit',
    name: 'Juicy Fruit / Cold Soda / Fresh Hydration',
    icon: '🍉',
    category: 'refreshing',
    bodySignals: [
      { type: 'Sensory Profile', desc: 'Body seeking high water content, crisp temperature, and natural brightness.' },
      { type: 'Hydration Desire', desc: 'Often the clearest sensory cue that your fluid intake has been low today.' },
      { type: 'Light Energy', desc: 'Seeking gentle, effortless fuel that leaves you feeling light and clear.' }
    ],
    healthyOptions: [
      { name: 'Chilled Watermelon or Pineapple Chunks with Fresh Mint', tip: '90%+ water volume with natural enzymes and vitamin C.' },
      { name: 'Sparkling Water with Crushed Berries & Lime Slice', tip: 'Crisp fizz and natural fruit essence without refined syrup.' },
      { name: 'Frozen Grapes or Mango Chunks', tip: 'Nature’s bite-sized sorbet with natural fructose and antioxidants.' }
    ]
  }
];

export function lookupCraving(query) {
  if (!query) return null;
  const q = query.toLowerCase().trim();
  
  // 1. Check exact/substring match in expanded cravings list
  const match = EXPANDED_CRAVINGS.find(item => 
    item.name.toLowerCase().includes(q) || 
    q.includes(item.name.toLowerCase()) ||
    item.id.toLowerCase().includes(q) ||
    item.category?.toLowerCase().includes(q)
  );

  if (match) return match;

  // 2. Sensory & texture heuristics for food cravings
  if (q.includes('choc') || q.includes('cocoa') || q.includes('fudge') || q.includes('brownie')) {
    return EXPANDED_CRAVINGS.find(c => c.id === 'chocolate') || EXPANDED_CRAVINGS[0];
  }

  if (q.includes('salt') || q.includes('chip') || q.includes('crisp') || q.includes('pretzel')) {
    return EXPANDED_CRAVINGS.find(c => c.id === 'salty') || EXPANDED_CRAVINGS[1];
  }

  if (q.includes('sweet') || q.includes('sugar') || q.includes('candy') || q.includes('cookie') || q.includes('cake') || q.includes('donut')) {
    return EXPANDED_CRAVINGS.find(c => c.id === 'sugar') || EXPANDED_CRAVINGS[2];
  }

  if (q.includes('carb') || q.includes('bread') || q.includes('pasta') || q.includes('pizza') || q.includes('dough') || q.includes('noodle')) {
    return EXPANDED_CRAVINGS.find(c => c.id === 'carbs') || EXPANDED_CRAVINGS[3];
  }

  if (q.includes('ice cream') || q.includes('gelato') || q.includes('smoothie') || q.includes('shake') || q.includes('creamy')) {
    return EXPANDED_CRAVINGS.find(c => c.id === 'ice_cream');
  }

  if (q.includes('crunch') || q.includes('nut') || q.includes('chew')) {
    return EXPANDED_CRAVINGS.find(c => c.id === 'crunchy');
  }

  if (q.includes('cheese') || q.includes('dairy') || q.includes('mac and cheese')) {
    return EXPANDED_CRAVINGS.find(c => c.id === 'cheese');
  }

  if (q.includes('meat') || q.includes('burger') || q.includes('steak') || q.includes('protein') || q.includes('savory')) {
    return EXPANDED_CRAVINGS.find(c => c.id === 'red_meat');
  }

  if (q.includes('spice') || q.includes('spicy') || q.includes('hot sauce') || q.includes('sour') || q.includes('tangy')) {
    return EXPANDED_CRAVINGS.find(c => c.id === 'spicy_sour');
  }

  if (q.includes('fruit') || q.includes('cold') || q.includes('soda') || q.includes('refresh') || q.includes('juice')) {
    return EXPANDED_CRAVINGS.find(c => c.id === 'refreshing_fruit');
  }

  if (q.includes('coffee') || q.includes('caffeine') || q.includes('energy drink') || q.includes('tea')) {
    return EXPANDED_CRAVINGS.find(c => c.id === 'coffee');
  }

  // 3. Compassionate, non-diagnostic sensory craving fallback
  return {
    id: 'custom_craving_' + Date.now(),
    name: query,
    icon: '🍽️',
    category: 'custom_craving',
    bodySignals: [
      { type: 'Sensory & Flavor Profile', desc: `Your palate is seeking specific satisfaction from "${query}" (richness, texture, or temperature).` },
      { type: 'Mindful Context', desc: 'Notice whether you are looking for soothing comfort, a break from routine, physical fuel, or sensory enjoyment.' },
      { type: 'No-Guilt Exploration', desc: 'Food cravings are a normal human experience. You can honor this craving mindfully with complete self-compassion.' }
    ],
    healthyOptions: [
      { name: `Enjoy "${query}" Mindfully`, tip: 'Plate a satisfying portion, sit down, and savor every bite with all 5 senses.' },
      { name: 'Pair with a Glass of Water or Tea', tip: 'Combine with hydration or fresh greens to create a balanced, lasting satisfaction.' }
    ]
  };
}

