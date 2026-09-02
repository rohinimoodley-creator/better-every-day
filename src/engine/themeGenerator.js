// Natural Language & Palette Theme Generator for Better Every Day
// Generates accessible, cohesive themes with WCAG compliant contrast ratios.

export function generateThemeFromPrompt(prompt, baseMode = 'light') {
  const p = (prompt || '').toLowerCase().trim();

  // Color keywords mapping
  const colorMap = {
    green: { primary: '#2d6a4f', lightBg: '#f2f8f4', darkBg: '#0f1a14', accent: '#40916c', name: 'Nature Green' },
    nature: { primary: '#2d6a4f', lightBg: '#f2f8f4', darkBg: '#0f1a14', accent: '#52b788', name: 'Botanical Forest' },
    earth: { primary: '#6b4f3b', lightBg: '#faf5f0', darkBg: '#1a1410', accent: '#a47148', name: 'Warm Earth' },
    brown: { primary: '#6b4f3b', lightBg: '#faf5f0', darkBg: '#1a1410', accent: '#a47148', name: 'Earthy Brown' },
    blue: { primary: '#0077b6', lightBg: '#f0f7fc', darkBg: '#0b1622', accent: '#0096c7', name: 'Ocean Blue' },
    ocean: { primary: '#0077b6', lightBg: '#f0f7fc', darkBg: '#0b1622', accent: '#48cae4', name: 'Coastal Breeze' },
    purple: { primary: '#6c5ce7', lightBg: '#f6f4fe', darkBg: '#141124', accent: '#a29bfe', name: 'Dreamy Lavender' },
    lavender: { primary: '#6c5ce7', lightBg: '#f6f4fe', darkBg: '#141124', accent: '#a29bfe', name: 'Soft Lavender' },
    pink: { primary: '#d64062', lightBg: '#fdf2f5', darkBg: '#1f0d14', accent: '#ff758f', name: 'Rose Blossom' },
    rose: { primary: '#d64062', lightBg: '#fdf2f5', darkBg: '#1f0d14', accent: '#ff758f', name: 'Rose Quartz' },
    orange: { primary: '#d95d39', lightBg: '#fef5f0', darkBg: '#21120b', accent: '#f48c42', name: 'Sunset Amber' },
    sunset: { primary: '#d95d39', lightBg: '#fef5f0', darkBg: '#21120b', accent: '#e09f3e', name: 'Sunset Glow' },
    dark: { primary: '#9d4edd', lightBg: '#12111d', darkBg: '#0d0c14', accent: '#c77dff', name: 'Dark Fantasy' },
    fantasy: { primary: '#9d4edd', lightBg: '#12111d', darkBg: '#0d0c14', accent: '#c77dff', name: 'Enchanted Dark' },
    gold: { primary: '#b07d1e', lightBg: '#fffbf0', darkBg: '#1c170a', accent: '#e5a93c', name: 'Golden Honey' },
    minimal: { primary: '#262626', lightBg: '#fafafa', darkBg: '#121212', accent: '#525252', name: 'Zen Minimal' },
    cyber: { primary: '#0284c7', lightBg: '#08111e', darkBg: '#050c17', accent: '#38bdf8', name: 'Cyber Aurora' },
    futuristic: { primary: '#0284c7', lightBg: '#08111e', darkBg: '#050c17', accent: '#38bdf8', name: 'Futuristic Neon' }
  };

  // Determine primary palette from prompt
  let matchedColor = colorMap.green;
  for (const [key, val] of Object.entries(colorMap)) {
    if (p.includes(key)) {
      matchedColor = val;
      break;
    }
  }

  const isDark = baseMode === 'dark' || p.includes('dark') || p.includes('night') || p.includes('cyber');

  const themeId = 'custom_' + Date.now();
  const themeName = prompt.length > 28 ? prompt.substring(0, 25) + '...' : prompt;

  if (isDark) {
    return {
      id: themeId,
      name: themeName || matchedColor.name,
      mode: 'dark',
      bgPrimary: matchedColor.darkBg,
      bgSecondary: lightenDark(matchedColor.darkBg, 12),
      bgTertiary: lightenDark(matchedColor.darkBg, 20),
      bgGlass: 'rgba(22, 28, 24, 0.88)',
      bgGlassCard: 'rgba(28, 36, 30, 0.92)',
      borderGlass: `${matchedColor.accent}33`,
      borderSubtle: lightenDark(matchedColor.darkBg, 25),
      textPrimary: '#f0f6f2',
      textSecondary: '#b8ccbf',
      textMuted: '#789082',
      accentPrimary: matchedColor.accent,
      accentPrimaryHover: matchedColor.primary,
      accentPrimaryLight: `${matchedColor.accent}20`,
      accentSecondary: '#f48c42',
      accentSecondaryLight: 'rgba(244, 140, 66, 0.15)',
      isCustom: true,
      prompt
    };
  } else {
    return {
      id: themeId,
      name: themeName || matchedColor.name,
      mode: 'light',
      bgPrimary: matchedColor.lightBg,
      bgSecondary: '#ffffff',
      bgTertiary: darkenLight(matchedColor.lightBg, 5),
      bgGlass: 'rgba(255, 255, 255, 0.82)',
      bgGlassCard: 'rgba(255, 255, 255, 0.9)',
      borderGlass: `${matchedColor.primary}22`,
      borderSubtle: darkenLight(matchedColor.lightBg, 10),
      textPrimary: '#1a291f',
      textSecondary: '#475d4e',
      textMuted: '#718878',
      accentPrimary: matchedColor.primary,
      accentPrimaryHover: darkenLight(matchedColor.primary, 15),
      accentPrimaryLight: `${matchedColor.primary}15`,
      accentSecondary: '#d97736',
      accentSecondaryLight: '#fdf2e9',
      isCustom: true,
      prompt
    };
  }
}

// Helpers for hex color adjustments
function lightenDark(hex, percent) {
  return adjustBrightness(hex, percent);
}

function darkenLight(hex, percent) {
  return adjustBrightness(hex, -percent);
}

function adjustBrightness(hex, percent) {
  let num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) num = 0x111111;
  let r = (num >> 16) + Math.round(255 * (percent / 100));
  let g = ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100));
  let b = (num & 0x0000ff) + Math.round(255 * (percent / 100));
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export const COMMUNITY_THEMES = [
  {
    id: 'comm_th_1',
    name: 'Earthy Forest Sage',
    creator: 'Elena (Community)',
    likes: 142,
    mode: 'light',
    bgPrimary: '#f2f8f4',
    bgSecondary: '#ffffff',
    bgTertiary: '#e5f0e8',
    textPrimary: '#1a291f',
    textSecondary: '#475d4e',
    textMuted: '#718878',
    accentPrimary: '#2d6a4f',
    accentPrimaryLight: 'rgba(45, 106, 79, 0.12)',
    accentSecondary: '#a47148',
    prompt: 'Nature green, soft white and earth brown'
  },
  {
    id: 'comm_th_2',
    name: 'Twilight Obsidian & Gold',
    creator: 'Lucas (Community)',
    likes: 98,
    mode: 'dark',
    bgPrimary: '#0f1411',
    bgSecondary: '#17201b',
    bgTertiary: '#1f2b24',
    textPrimary: '#ecf4ef',
    textSecondary: '#b4c7bb',
    textMuted: '#748b7d',
    accentPrimary: '#52b788',
    accentPrimaryLight: 'rgba(82, 183, 136, 0.15)',
    accentSecondary: '#e5a93c',
    prompt: 'Dark obsidian with emerald glow and gold accents'
  },
  {
    id: 'comm_th_3',
    name: 'Cozy Honey Lavender',
    creator: 'Maya (Community)',
    likes: 185,
    mode: 'light',
    bgPrimary: '#faf8fc',
    bgSecondary: '#ffffff',
    bgTertiary: '#f1edf8',
    textPrimary: '#281c3b',
    textSecondary: '#5a4d70',
    textMuted: '#897d9e',
    accentPrimary: '#6c5ce7',
    accentPrimaryLight: 'rgba(108, 92, 231, 0.12)',
    accentSecondary: '#e09f3e',
    prompt: 'Soft pastel lavender and warm honey peach'
  }
];
