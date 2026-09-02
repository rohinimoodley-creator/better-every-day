// Natural Language Voice Parser & Intelligent Extraction Engine (Prompt 13 - Tell Me About Your Day)
// Parses natural speech into Wellness (Sleep, Hydration, Movement, Meals, Mood, Energy, Stress),
// Body Signals (Headaches, Tummy Aches, Back Aches, Fatigue), Gratitude Moments, and Journal Reflections.
// Follows non-diagnostic safety principles: observations only, zero assumptions.

export function parseNaturalVoiceInput(text, existingData = {}) {
  const rawText = (text || '').trim();
  const lower = rawText.toLowerCase();

  const updates = {
    rawTranscript: rawText,
    timestamp: new Date().toISOString(),
    items: [],
    hasDuplicates: false,
    discoveredGratitude: null,
    safetyNotes: []
  };

  if (!rawText) return updates;

  const wordToNum = {
    one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    eleven: 11, twelve: 12, fifteen: 15, twenty: 20, thirty: 30, 'forty-five': 45, sixty: 60
  };

  // =========================================================================
  // 1. SLEEP PARSING (e.g. "slept about six hours", "got 7.5 hours of sleep", "barely slept last night", "slept 8 hours")
  // =========================================================================
  const sleepHourMatch = lower.match(/(?:slept|got|slept\s+about|had)\s+(?:about\s+)?(\d+(?:\.\d+)?|one|two|three|four|five|six|seven|eight|nine|ten)\s*(?:hours?|hrs?|h)\s*(?:of\s+)?(?:sleep)?/i)
    || lower.match(/(\d+(?:\.\d+)?|one|two|three|four|five|six|seven|eight|nine|ten)\s*(?:hours?|hrs?|h)\s*(?:of\s+)?sleep/i);

  if (sleepHourMatch) {
    const numStr = sleepHourMatch[1].toLowerCase();
    const hours = wordToNum[numStr] || parseFloat(numStr) || 7;
    const quality = hours >= 7.5 ? 'Restful' : hours >= 6 ? 'Adequate' : 'Light / Interrupted';

    updates.items.push({
      id: 'item_sleep_' + Date.now(),
      category: 'SLEEP',
      icon: '🌙',
      label: `Sleep: ${hours} Hours (${quality})`,
      actionType: 'log_sleep',
      value: { hours, quality, notes: rawText },
      details: `Logged ${hours} hours of sleep from your reflection.`,
      isDuplicate: false,
      selected: true
    });
  } else if (lower.includes('barely slept') || lower.includes("couldn't sleep") || lower.includes('insomnia') || lower.includes('terrible sleep') || lower.includes('woke up multiple times')) {
    updates.items.push({
      id: 'item_sleep_' + Date.now(),
      category: 'SLEEP',
      icon: '🌙',
      label: `Sleep: Interrupted / Restless Night`,
      actionType: 'log_sleep',
      value: { hours: 4.5, quality: 'Restless', notes: 'Reported difficulty sleeping' },
      details: `Logged light/interrupted rest. Take it gently today.`,
      isDuplicate: false,
      selected: true
    });
  }

  // =========================================================================
  // 2. HYDRATION PARSING (e.g. "drank five cups of water", "3 glasses of water", "1 liter of water", "500ml water")
  // =========================================================================
  const waterMatch = lower.match(/(?:drank|had|logged|drinking|finished)\s+(?:about\s+)?(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s*(cups?|glasses?|bottles?|liters?|litres?|l|ml)?\s*(?:of\s+)?water/i)
    || lower.match(/(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s*(cups?|glasses?|bottles?|liters?|litres?|l|ml)\s*(?:of\s+)?water/i);

  if (waterMatch) {
    const numStr = waterMatch[1].toLowerCase();
    const count = wordToNum[numStr] || parseInt(numStr, 10) || 1;
    const unit = (waterMatch[2] || 'glasses').toLowerCase();

    let amountMl = 250 * count; // default 1 cup/glass = 250ml
    if (unit.startsWith('bottle')) amountMl = 500 * count;
    else if (unit.startsWith('liter') || unit.startsWith('litre') || unit === 'l') amountMl = 1000 * count;
    else if (unit === 'ml') amountMl = count;

    updates.items.push({
      id: 'item_hydrate_' + Date.now(),
      category: 'HYDRATION',
      icon: '💧',
      label: `Water Intake (+${amountMl}ml / ${count} ${unit})`,
      actionType: 'increment_hydration',
      value: amountMl,
      details: `Added ${amountMl}ml toward your daily hydration goal.`,
      isDuplicate: false,
      selected: true
    });
  }

  // =========================================================================
  // 3. MOVEMENT / EXERCISE PARSING (e.g. "walked for 20 minutes", "went for a quick walk after work", "ran 5k", "30 min yoga")
  // =========================================================================
  const walkMatch = lower.match(/(?:walked|walking|walk|stroll|ran|running|run|jog|jogging|yoga|pilates|stretched|workout|cycling|swim|swimming)\s+(?:for\s+)?(?:about\s+)?(\d+|one|two|three|four|five|six|seven|eight|nine|ten|fifteen|twenty|thirty|forty-five|sixty)\s*(?:minutes?|mins?|m)/i)
    || lower.match(/(\d+|one|two|three|four|five|six|seven|eight|nine|ten|fifteen|twenty|thirty|forty-five|sixty)\s*(?:minutes?|mins?|m)\s*(?:of\s+)?(walk|walking|run|running|yoga|stretch|pilates|cycling|workout|stretching)/i)
    || lower.match(/(?:went for a|went on a)\s+(quick\s+)?(walk|run|jog|bike ride|swim)/i);

  if (walkMatch) {
    let durationMin = 20;
    let activityType = 'Walking';

    if (walkMatch[1] && wordToNum[walkMatch[1].toLowerCase()]) {
      durationMin = wordToNum[walkMatch[1].toLowerCase()];
    } else if (walkMatch[1] && parseInt(walkMatch[1], 10)) {
      durationMin = parseInt(walkMatch[1], 10);
    } else if (walkMatch[0].includes('quick')) {
      durationMin = 15;
    }

    if (lower.includes('ran') || lower.includes('running') || lower.includes('jog')) activityType = 'Running';
    else if (lower.includes('yoga')) activityType = 'Yoga Flow';
    else if (lower.includes('pilates')) activityType = 'Pilates';
    else if (lower.includes('stretch')) activityType = 'Mobility & Stretch';
    else if (lower.includes('cycling') || lower.includes('bike')) activityType = 'Cycling';
    else if (lower.includes('swim')) activityType = 'Swimming';

    const estSteps = activityType === 'Walking' ? durationMin * 110 : activityType === 'Running' ? durationMin * 160 : 0;

    const isDuplicate = existingData.activeWorkoutMinutes >= durationMin && existingData.activeWorkoutMinutes > 0;
    if (isDuplicate) updates.hasDuplicates = true;

    updates.items.push({
      id: 'item_move_' + Date.now(),
      category: 'MOVE',
      icon: activityType === 'Running' ? '🏃' : activityType === 'Yoga Flow' ? '🧘' : '🚶',
      label: `${activityType} (${durationMin} mins)`,
      actionType: 'log_movement',
      value: { durationMin, activityType, estSteps },
      details: `${durationMin} mins of ${activityType} (~${estSteps} estimated steps).`,
      isDuplicate,
      duplicateWarning: isDuplicate ? `It sounds like you may have already logged ${existingData.activeWorkoutMinutes} mins of movement today. Would you like to add this again?` : null,
      selected: !isDuplicate
    });
  }

  // =========================================================================
  // 4. NOURISH / MEALS PARSING (e.g. "had eggs for breakfast", "ate an apple", "quinoa salad for lunch")
  // =========================================================================
  const foodKeywords = [
    'eggs', 'oatmeal', 'oats', 'toast', 'avocado', 'apple', 'banana', 'berries', 'salad', 'smoothie',
    'bowl', 'salmon', 'chicken', 'tofu', 'rice', 'soup', 'lentils', 'nuts', 'yogurt', 'pasta', 'sandwich'
  ];

  let detectedFood = null;
  for (const food of foodKeywords) {
    if (lower.includes(food)) {
      detectedFood = food.charAt(0).toUpperCase() + food.slice(1);
      break;
    }
  }

  const eatMatch = lower.match(/(?:ate|had|eating|cooked)\s+(?:a|an|some)?\s*([a-z\s]+?)(?:\s+(?:for|and|with|at)|\.|$)/i);
  if (!detectedFood && eatMatch && eatMatch[1] && eatMatch[1].length < 25 && !eatMatch[1].includes('day') && !eatMatch[1].includes('walk') && !eatMatch[1].includes('hug') && !eatMatch[1].includes('hour')) {
    detectedFood = eatMatch[1].trim();
    detectedFood = detectedFood.charAt(0).toUpperCase() + detectedFood.slice(1);
  }

  if (detectedFood) {
    let mealType = 'Snack';
    if (lower.includes('breakfast') || lower.includes('morning')) mealType = 'Breakfast';
    else if (lower.includes('lunch') || lower.includes('midday') || lower.includes('noon') || lower.includes('lunchtime')) mealType = 'Lunch';
    else if (lower.includes('dinner') || lower.includes('evening') || lower.includes('supper')) mealType = 'Dinner';

    updates.items.push({
      id: 'item_nourish_' + Date.now(),
      category: 'NOURISH',
      icon: '🥗',
      label: `Meal Log (${mealType}: ${detectedFood})`,
      actionType: 'log_meal',
      value: { title: detectedFood, mealType, calories: 280 },
      details: `Logged ${detectedFood} under ${mealType}.`,
      isDuplicate: false,
      selected: true
    });
  }

  // =========================================================================
  // 5. MOOD, ENERGY & STRESS PARSING (e.g. "I was really happy", "work was stressful", "exhausted")
  // =========================================================================
  let detectedMood = null;
  if (lower.includes('really happy') || lower.includes('great') || lower.includes('joyful') || lower.includes('wonderful') || lower.includes('made me so happy')) {
    detectedMood = { mood: 'great', label: 'Feeling Joyful & Uplifted 😊' };
  } else if (lower.includes('calm') || lower.includes('peaceful') || lower.includes('relaxed') || lower.includes('content') || lower.includes('good')) {
    detectedMood = { mood: 'good', label: 'Feeling Calm & Centered 🍃' };
  } else if (lower.includes('tired') || lower.includes('exhausted') || lower.includes('low energy') || lower.includes('drained')) {
    detectedMood = { mood: 'low', label: 'Reported Low Energy / Fatigue 🌙' };
  } else if (lower.includes('stressed') || lower.includes('overwhelmed') || lower.includes('anxious') || lower.includes('stressful')) {
    detectedMood = { mood: 'difficult', label: 'Reported Stress / Pressure 🌬️' };
  }

  if (detectedMood) {
    updates.items.push({
      id: 'item_mood_' + Date.now(),
      category: 'MOOD & ENERGY',
      icon: '💛',
      label: `Mood Reflection (${detectedMood.label})`,
      actionType: 'update_mood',
      value: detectedMood.mood,
      details: `Updated daily mood reflection.`,
      isDuplicate: false,
      selected: true
    });
  }

  // =========================================================================
  // 6. BODY SIGNALS PARSING (Prompt 11 & 13) (Headache, Tummy ache, Back ache, Fatigue, Neck stiffness, Pain)
  // =========================================================================
  let detectedSignal = null;
  if (lower.includes('headache') || lower.includes('migraine')) {
    const isSevere = lower.includes('really bad') || lower.includes('severe') || lower.includes('terrible');
    detectedSignal = { signal: 'Headache', icon: '🤕', severity: isSevere ? 'Moderate' : 'Mild' };
  } else if (lower.includes('tummy ache') || lower.includes('stomach ache') || lower.includes('bloated') || lower.includes('indigestion') || lower.includes('upset stomach')) {
    detectedSignal = { signal: 'Tummy Ache', icon: '🤢', severity: 'Mild' };
  } else if (lower.includes('back ache') || lower.includes('back pain') || lower.includes('sore back') || lower.includes('tight back') || lower.includes('neck stiffness') || lower.includes('neck pain')) {
    detectedSignal = { signal: lower.includes('neck') ? 'Neck Stiffness' : 'Back Ache', icon: '🩹', severity: 'Mild' };
  } else if (lower.includes('nausea') || lower.includes('nauseous') || lower.includes('dizzy') || lower.includes('lightheaded')) {
    detectedSignal = { signal: 'Nausea / Lightheadedness', icon: '💫', severity: 'Mild' };
  } else if (lower.includes('bathroom') || lower.includes('toilet frequency') || lower.includes('urgency')) {
    detectedSignal = { signal: 'Digestive / Toilet Frequency', icon: '🚽', severity: 'Mild' };
  }

  if (detectedSignal) {
    updates.items.push({
      id: 'item_bodysignal_' + Date.now(),
      category: 'BODY SIGNALS',
      icon: detectedSignal.icon,
      label: `Body Signal: ${detectedSignal.signal} (${detectedSignal.severity})`,
      actionType: 'log_body_signal',
      value: {
        signal: detectedSignal.signal,
        severity: detectedSignal.severity,
        notes: rawText,
        icon: detectedSignal.icon,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      details: `Logged to your private Body Signals timeline.`,
      isDuplicate: false,
      selected: true
    });

    updates.safetyNotes.push({
      signal: detectedSignal.signal,
      message: `If your ${detectedSignal.signal.toLowerCase()} is recurring or severe, consider resting and consulting a healthcare professional.`
    });
  }

  // =========================================================================
  // 7. GRATITUDE RECOGNITION (Prompt 13 - Section 6, 18)
  // Handles positive experiences, hugs, calls, companionship.
  // CRITICAL: Preserves repeats over time as separate distinct moments.
  // =========================================================================
  let gratitudeMoment = null;

  // Person hug check (e.g. "Devante gave me a hug when I got home and it made me really happy", "Lucas hugged me")
  if (lower.includes('hugged') || lower.includes('hug') || lower.includes('gave me a hug')) {
    const personMatch = rawText.match(/([A-Z][a-z]+)\s+(?:gave me a hug|hugged me|hugged)/)
      || rawText.match(/(?:from|with)\s+([A-Z][a-z]+).*(?:hug|hugged)/i);
    const person = personMatch ? personMatch[1] : 'a loved one';
    gratitudeMoment = {
      text: `I'm grateful that ${person} gave me a hug today.`,
      rawQuote: rawText,
      theme: 'Relationships & Affection',
      icon: '🫂'
    };
  } else if (lower.match(/(?:friend|mom|dad|sister|brother|partner|colleague|caller)\s+(?:called|texted|messaged|visited)\s+me/i) || lower.includes('called me today')) {
    const friendMatch = rawText.match(/([A-Z][a-z]+)\s+(?:called|texted|visited)\s+me/);
    const friendName = friendMatch ? friendMatch[1] : 'My friend';
    gratitudeMoment = {
      text: `I'm grateful that ${friendName} called me today and brightened my day.`,
      rawQuote: rawText,
      theme: 'Connection & Friends',
      icon: '💛'
    };
  } else if (lower.includes('coffee') || lower.includes('tea') || lower.includes('warm drink')) {
    gratitudeMoment = {
      text: `I'm grateful for a comforting moment of coffee or tea today.`,
      rawQuote: rawText,
      theme: 'Small Daily Comforts',
      icon: '☕'
    };
  } else if (lower.includes('sunshine') || lower.includes('sun') || lower.includes('nature') || lower.includes('fresh air') || lower.includes('walk in the park')) {
    gratitudeMoment = {
      text: `I'm grateful for the refreshing sunshine and fresh air today.`,
      rawQuote: rawText,
      theme: 'Nature & Peace',
      icon: '🌿'
    };
  } else if (lower.includes('pet') || lower.includes('dog') || lower.includes('cat') || lower.includes('puppy')) {
    gratitudeMoment = {
      text: `I'm grateful for the joyful companionship of my pet today.`,
      rawQuote: rawText,
      theme: 'Pets & Companionship',
      icon: '🐾'
    };
  } else if (lower.includes('grateful for') || lower.includes('thankful for') || lower.includes('blessed') || (lower.includes('made me') && lower.includes('happy'))) {
    gratitudeMoment = {
      text: `I'm grateful for this uplifting positive moment in my day.`,
      rawQuote: rawText,
      theme: 'Joy & Wellbeing',
      icon: '✨'
    };
  }

  if (gratitudeMoment) {
    updates.discoveredGratitude = gratitudeMoment;
    updates.items.push({
      id: 'item_gratitude_' + Date.now(),
      category: 'GRATITUDE MOMENT',
      icon: gratitudeMoment.icon,
      label: `Gratitude: "${gratitudeMoment.text}"`,
      actionType: 'add_discovered_gratitude',
      value: gratitudeMoment,
      details: `Recognized from your reflection. Kept as an authentic personal blessing.`,
      isDuplicate: false,
      selected: true
    });
  }

  // =========================================================================
  // 8. JOURNAL NARRATIVE ENTRY (Preserves spoken story)
  // =========================================================================
  if (rawText.length >= 10) {
    const cleanTitle = rawText.length > 35 ? rawText.substring(0, 32) + '...' : rawText;
    updates.items.push({
      id: 'item_journal_' + Date.now(),
      category: 'JOURNAL REFLECTION',
      icon: '📖',
      label: `Voice Journal Entry ("${cleanTitle}")`,
      actionType: 'save_journal_entry',
      value: {
        title: `Spoken Reflection: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        content: rawText,
        type: 'general',
        moodStamp: detectedMood ? detectedMood.label : 'Reflective',
        source: 'voice_record'
      },
      details: `Saves full spoken reflection to your private journal vault.`,
      isDuplicate: false,
      selected: true
    });
  }

  return updates;
}
