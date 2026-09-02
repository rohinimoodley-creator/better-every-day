// Gratitude Discovery & Pattern Analysis Engine for Better Every Day
// Classifies themes, structures Moments Worth Remembering, and filters by date range.
// Strictly non-reductive, respectful of repeated joys (e.g. coffee, hugs, pets).

export const GRATITUDE_THEMES = [
  { id: 'people', name: 'People & Relationships', icon: '🫂', description: 'Moments with friends, partners, family, and kind strangers.' },
  { id: 'nature', name: 'Nature & Outdoors', icon: '🌿', description: 'Fresh air, trees, sunlight, rain, walks, and scenic sights.' },
  { id: 'self_care', name: 'Self-Care & Mindfulness', icon: '🧘', description: 'Deep breaths, listening to your body, quiet rest, and patience.' },
  { id: 'small_comforts', name: 'Small Daily Comforts', icon: '☕', description: 'Warm coffee, cozy blankets, clean sheets, and good books.' },
  { id: 'pets', name: 'Pets & Companions', icon: '🐾', description: 'Playful moments and quiet love with furry friends.' },
  { id: 'nourishment', name: 'Nourishment & Food', icon: '🥗', description: 'Delicious home cooking, fresh fruit, and shared meals.' },
  { id: 'movement', name: 'Movement & Vitality', icon: '🏃', description: 'Stretches, brisk strolls, dancing, and energized muscles.' },
  { id: 'kindness', name: 'Acts of Kindness', icon: '✨', description: 'Giving or receiving heartfelt help and genuine appreciation.' }
];

export function categorizeGratitudeTheme(text) {
  const t = (text || '').toLowerCase();
  if (t.includes('hug') || t.includes('friend') || t.includes('family') || t.includes('partner') || t.includes('mom') || t.includes('dad') || t.includes('love') || t.includes('devante') || t.includes('lucas') || t.includes('maya')) {
    return 'People & Relationships';
  }
  if (t.includes('sun') || t.includes('nature') || t.includes('tree') || t.includes('flower') || t.includes('bird') || t.includes('walk outdoors') || t.includes('fresh air') || t.includes('ocean')) {
    return 'Nature & Outdoors';
  }
  if (t.includes('pet') || t.includes('dog') || t.includes('cat') || t.includes('puppy') || t.includes('kitten')) {
    return 'Pets & Companions';
  }
  if (t.includes('coffee') || t.includes('tea') || t.includes('bed') || t.includes('blanket') || t.includes('shower') || t.includes('sheets')) {
    return 'Small Daily Comforts';
  }
  if (t.includes('breath') || t.includes('rest') || t.includes('quiet') || t.includes('calm') || t.includes('gentle') || t.includes('meditat')) {
    return 'Self-Care & Mindfulness';
  }
  if (t.includes('food') || t.includes('meal') || t.includes('oats') || t.includes('salad') || t.includes('fruit') || t.includes('apple') || t.includes('dinner')) {
    return 'Nourishment & Food';
  }
  if (t.includes('walk') || t.includes('stretch') || t.includes('run') || t.includes('yoga') || t.includes('workout')) {
    return 'Movement & Vitality';
  }
  return 'Acts of Kindness';
}

export function filterEntriesByDateRange(entries = [], range = 'all_time') {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const getDaysAgo = (days) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
  };

  switch (range) {
    case 'today':
      return entries.filter(e => e.date === todayStr);
    case 'yesterday': {
      const yestStr = getDaysAgo(1);
      return entries.filter(e => e.date === yestStr);
    }
    case 'this_week': {
      const weekAgo = getDaysAgo(7);
      return entries.filter(e => e.date >= weekAgo);
    }
    case 'last_week': {
      const twoWeeksAgo = getDaysAgo(14);
      const oneWeekAgo = getDaysAgo(7);
      return entries.filter(e => e.date >= twoWeeksAgo && e.date < oneWeekAgo);
    }
    case 'this_month': {
      const monthAgo = getDaysAgo(30);
      return entries.filter(e => e.date >= monthAgo);
    }
    case 'this_year': {
      const yearStart = `${now.getFullYear()}-01-01`;
      return entries.filter(e => e.date >= yearStart);
    }
    case 'all_time':
    default:
      return entries;
  }
}

export function analyzeGratitudeTrends(allGratitudeEntries = []) {
  const themeCounts = {};
  const themeSamples = {};

  allGratitudeEntries.forEach(entry => {
    const themeName = entry.theme || categorizeGratitudeTheme(entry.text || entry.content);
    themeCounts[themeName] = (themeCounts[themeName] || 0) + 1;
    if (!themeSamples[themeName]) themeSamples[themeName] = [];
    themeSamples[themeName].push(entry.text || entry.content || entry.title);
  });

  return Object.entries(themeCounts)
    .map(([theme, count]) => ({
      theme,
      count,
      samples: themeSamples[theme] || [],
      insight: getCautiousThemeInsight(theme, count)
    }))
    .sort((a, b) => b.count - a.count);
}

function getCautiousThemeInsight(theme, count) {
  if (theme === 'People & Relationships') {
    return `You've recorded ${count} moments involving time with friends, family, and loved ones.`;
  }
  if (theme === 'Nature & Outdoors') {
    return `You frequently note feeling uplifted by fresh air, sunlight, and outdoor moments (${count} times).`;
  }
  if (theme === 'Small Daily Comforts') {
    return `Small pleasures like warm beverages and cozy spaces appear frequently in your reflections (${count} times).`;
  }
  if (theme === 'Self-Care & Mindfulness') {
    return `You've documented ${count} instances of intentional calm, gentle breathing, and personal restoration.`;
  }
  return `This theme has appeared ${count} times in your reflections.`;
}
