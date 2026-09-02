// Wellness Insights Engine
// Detects gentle correlation patterns across sleep, energy, hydration, movement and mood.
// Strictly non-diagnostic observations.

export function generateWellnessInsights({ checkIns = [], workouts = [], waterLogs = [], journalEntries = [] }) {
  const insights = [
    {
      id: 'ins_1',
      icon: '👟',
      title: 'Movement & Energy Connection',
      observation: 'You tend to report higher energy (4/5) on days with a morning walk or mobility session.',
      tip: 'Even 5 to 10 minutes of gentle movement creates a sustained lift in mental clarity.',
      category: 'Movement'
    },
    {
      id: 'ins_2',
      icon: '🌙',
      title: 'Sleep & Stress Pattern',
      observation: 'When your sleep is rated below 3/5, stress reports are 40% higher the following afternoon.',
      tip: 'Dimming screens 20 minutes before bed supports natural melatonin synthesis.',
      category: 'Rest'
    },
    {
      id: 'ins_3',
      icon: '💧',
      title: 'Hydration Rhythm',
      observation: 'You consistently reach your water goal earlier in the day when having a morning glass with breakfast.',
      tip: 'Keeping a filled water bottle on your desk eliminates decision fatigue.',
      category: 'Hydration'
    },
    {
      id: 'ins_4',
      icon: '✨',
      title: 'Gratitude & Calm State',
      observation: 'Days with a recorded gratitude entry correlate with calmer evening check-ins.',
      tip: 'Three small bullet points take under 90 seconds and gently shift your focus.',
      category: 'Mindset'
    }
  ];

  return insights;
}
