// 9 Distinct Journal Aesthetics for Better Every Day
export const JOURNAL_THEMES = [
  {
    id: 'nature',
    name: 'Botanical Nature',
    icon: '🌿',
    bg: 'linear-gradient(135deg, #f0f7f2 0%, #e3ede6 100%)',
    textColor: '#1a3323',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    borderColor: '#b8d8c2',
    accentColor: '#2d6a4f',
    font: "'Plus Jakarta Sans', sans-serif",
    paperTexture: 'radial-gradient(#2d6a4f15 1px, transparent 1px)',
    stickers: ['🌱', '🍃', '🌸', '🍄', '🪵', '🪴', '✨', '☕']
  },
  {
    id: 'beach',
    name: 'Coastal Breeze',
    icon: '🏖️',
    bg: 'linear-gradient(135deg, #f0f8ff 0%, #e2f1fc 50%, #fff9f0 100%)',
    textColor: '#163b50',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    borderColor: '#badcf5',
    accentColor: '#0077b6',
    font: "'Outfit', sans-serif",
    paperTexture: 'radial-gradient(#0077b615 1px, transparent 1px)',
    stickers: ['🌊', '🐚', '☀️', '🏄', '🌴', '🐬', '🍹', '🌅']
  },
  {
    id: 'pastel',
    name: 'Soft Pastel',
    icon: '🌸',
    bg: 'linear-gradient(135deg, #fdf2f8 0%, #fae8ff 50%, #eff6ff 100%)',
    textColor: '#4a2545',
    cardBg: 'rgba(255, 255, 255, 0.94)',
    borderColor: '#f5d0fe',
    accentColor: '#c084fc',
    font: "'Plus Jakarta Sans', sans-serif",
    paperTexture: 'radial-gradient(#d946ef15 1px, transparent 1px)',
    stickers: ['🎀', '🌸', '☁️', '🍬', '🧁', '💖', '🧸', '🧋']
  },
  {
    id: 'dark-fantasy',
    name: 'Dark Fantasy',
    icon: '🔮',
    bg: 'linear-gradient(135deg, #0d0e15 0%, #171626 50%, #121c24 100%)',
    textColor: '#e6e6f0',
    cardBg: 'rgba(28, 27, 46, 0.88)',
    borderColor: '#4d4b70',
    accentColor: '#9d4edd',
    font: "'Outfit', sans-serif",
    paperTexture: 'radial-gradient(#9d4edd25 1px, transparent 1px)',
    stickers: ['🔮', '🌙', '⚔️', '✨', '🕯️', '🐉', '🗝️', '🌌']
  },
  {
    id: 'fairytale',
    name: 'Fairytale Woods',
    icon: '🧚',
    bg: 'linear-gradient(135deg, #fbf7ec 0%, #f7efff 50%, #edfbf2 100%)',
    textColor: '#3b2f4a',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    borderColor: '#e9d5ff',
    accentColor: '#a855f7',
    font: "'Caveat', cursive, sans-serif",
    paperTexture: 'radial-gradient(#a855f715 1px, transparent 1px)',
    stickers: ['🧚', '🦄', '🍄', '👑', '🏰', '✨', '🦋', '🌷']
  },
  {
    id: 'minimalist',
    name: 'Zen Minimalist',
    icon: '⚪',
    bg: 'linear-gradient(135deg, #fafafa 0%, #f2f2f2 100%)',
    textColor: '#171717',
    cardBg: '#ffffff',
    borderColor: '#e5e5e5',
    accentColor: '#404040',
    font: "'Plus Jakarta Sans', sans-serif",
    paperTexture: 'none',
    stickers: ['▪️', '▫️', '◾', '◽', '⚫', '⚪', '〰️', '✔️']
  },
  {
    id: 'futuristic',
    name: 'Cyber Aurora',
    icon: '⚡',
    bg: 'linear-gradient(135deg, #090d16 0%, #0d1e2d 100%)',
    textColor: '#e0f2fe',
    cardBg: 'rgba(15, 23, 42, 0.9)',
    borderColor: '#0284c7',
    accentColor: '#38bdf8',
    font: "'Outfit', sans-serif",
    paperTexture: 'linear-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.05) 1px, transparent 1px)',
    stickers: ['⚡', '🤖', '🛸', '🌐', '🚀', '💫', '🔋', '🧬']
  },
  {
    id: 'animation',
    name: 'Retro Animation',
    icon: '🎨',
    bg: 'linear-gradient(135deg, #fffbeb 0%, #fee2e2 50%, #fef3c7 100%)',
    textColor: '#451a03',
    cardBg: 'rgba(255, 255, 255, 0.94)',
    borderColor: '#fcd34d',
    accentColor: '#f59e0b',
    font: "'Outfit', sans-serif",
    paperTexture: 'radial-gradient(#f59e0b20 1px, transparent 1px)',
    stickers: ['🎨', '🌟', '🍿', '🎬', '🛹', '👾', '🕹️', '🎸']
  },
  {
    id: 'cozy-parchment',
    name: 'Cozy Parchment',
    icon: '📜',
    bg: 'linear-gradient(135deg, #fbf7ee 0%, #f3ebd8 100%)',
    textColor: '#382b1d',
    cardBg: 'rgba(255, 252, 245, 0.94)',
    borderColor: '#dccab0',
    accentColor: '#926038',
    font: "'Caveat', cursive, sans-serif",
    paperTexture: 'radial-gradient(#92603815 1px, transparent 1px)',
    stickers: ['📜', '☕', '📖', '🍂', '🕯️', '✍️', '🧶', '🐈']
  }
];

export const BEANIE_COLORS = [
  { id: 'cream', name: 'Cream', hex: '#f7f4ea', cuffHex: '#eae3d2', pompomHex: '#ffffff' },
  { id: 'brown', name: 'Terracotta', hex: '#8d6e63', cuffHex: '#6d4c41', pompomHex: '#5d4037' },
  { id: 'pink', name: 'Dusty Pink', hex: '#f48fb1', cuffHex: '#ec407a', pompomHex: '#f8bbd0' },
  { id: 'blue', name: 'Sky Blue', hex: '#64b5f6', cuffHex: '#42a5f5', pompomHex: '#90caf9' },
  { id: 'green', name: 'Sage Green', hex: '#81c784', cuffHex: '#66bb6a', pompomHex: '#a5d6a7' },
  { id: 'yellow', name: 'Warm Honey', hex: '#ffd54f', cuffHex: '#ffca28', pompomHex: '#ffe082' },
  { id: 'purple', name: 'Lavender', hex: '#ba68c8', cuffHex: '#ab47bc', pompomHex: '#ce93d8' },
  { id: 'black', name: 'Charcoal', hex: '#37474f', cuffHex: '#263238', pompomHex: '#455a64' },
  { id: 'coral', name: 'Sunset Coral', hex: '#e57373', cuffHex: '#ef5350', pompomHex: '#ef9a9a' }
];

export const MASCOT_WARDROBE = {
  hats: [
    { id: 'none', name: 'Natural Leaf', category: 'nature', desc: 'A fresh little sprout sprouting directly from Pip' },
    { id: 'flower', name: 'Daisy Crown', category: 'flowers', desc: 'A joyful white daisy blooming on Pip\'s head' },
    { id: 'sunflower', name: 'Sunflower', category: 'flowers', desc: 'Radiant golden sunflower petals' },
    { id: 'tulip', name: 'Spring Tulip', category: 'flowers', desc: 'A graceful pink tulip bloom' },
    { id: 'sakura', name: 'Cherry Blossom', category: 'flowers', desc: 'Delicate pastel sakura blossom' },
    { id: 'rose', name: 'Crimson Rose', category: 'flowers', desc: 'Elegant velvety rosebud' },
    { id: 'hibiscus', name: 'Hibiscus', category: 'flowers', desc: 'Vibrant tropical flower with golden stamen' },
    { id: 'beanie', name: 'Cozy Beanie', category: 'hats', desc: 'Warm knitted beanie hat with custom colors' },
    { id: 'wizard', name: 'Starry Wizard', category: 'hats', desc: 'Magical pointed hat with glowing golden stars' },
    { id: 'headband', name: 'Workout Band', category: 'hats', desc: 'Athletic sweatband with sporty stripes' },
    { id: 'chef', name: 'Chef Hat', category: 'hats', desc: 'Puffed classic white chef toque' },
    { id: 'glasses', name: 'Reading Glasses', category: 'eyewear', desc: 'Chic frames sitting perfectly over Pip\'s eyes' },
    { id: 'sunglasses', name: 'Cool Shades', category: 'eyewear', desc: 'Dark tinted sunglasses with cool glint' },
    { id: 'halo', name: 'Golden Halo', category: 'special', desc: 'A radiant golden halo floating above Pip' }
  ],
  colors: [
    { id: 'sprout', name: 'Sprout Green', hex: '#40916c', bodyColor: '#52b788', blush: '#ff9ebb' },
    { id: 'berry', name: 'Sunset Berry', hex: '#d95d39', bodyColor: '#f48c42', blush: '#ffb3c6' },
    { id: 'lavender', name: 'Dreamy Lavender', hex: '#7b61ff', bodyColor: '#9d8df1', blush: '#ffccd5' },
    { id: 'honey', name: 'Golden Honey', hex: '#e09f3e', bodyColor: '#f4c05f', blush: '#ff9ebb' },
    { id: 'ocean', name: 'Ocean Calm', hex: '#0077b6', bodyColor: '#48cae4', blush: '#ff9ebb' }
  ]
};
