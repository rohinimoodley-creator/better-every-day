/**
 * Better Every Day — Unified Notification & Smart Bundling Scheduler
 * 
 * Enforces:
 * 1. Daily Notification Budget (0, 1, 2, 3, 5, 10, unlimited)
 * 2. Smart Bundling (groups multiple pending nudges into 1 gentle digest)
 * 3. Quiet Hours respect (from My Daily Rhythm: Day Starts to Day Ends)
 * 4. Hub availability & individual toggle honors
 */

import { isInQuietHours, parseTimeToMinutes } from '../utils/dayKey';

export function scheduleNotifications({
  pendingNudges = [],
  settings = {},
  currentTime = new Date()
}) {
  const rhythm = settings.rhythm || { dayStarts: '07:00', dayEnds: '23:00' };
  const budget = settings.notificationBudget !== undefined ? Number(settings.notificationBudget) : 3;
  const isSmartBundling = settings.smartBundlingEnabled !== false;
  const hubVisibility = settings.wellnessHubVisibility || {};
  const sentTodayCount = Number(settings.notificationsSentToday) || 0;

  // 1. Check if we are in quiet hours
  if (isInQuietHours(currentTime, rhythm)) {
    return {
      scheduled: [],
      skippedQuietHours: true,
      reason: 'Within quiet hours / sleep time'
    };
  }

  // 2. Check if daily budget is exhausted
  if (budget !== -1 && sentTodayCount >= budget) {
    return {
      scheduled: [],
      skippedBudgetExhausted: true,
      reason: `Daily budget of ${budget} notification(s) reached`
    };
  }

  // 3. Filter nudges by hub availability
  const validNudges = pendingNudges.filter(n => {
    if (n.hubId && hubVisibility[n.hubId] === false) return false;
    return true;
  });

  if (validNudges.length === 0) {
    return { scheduled: [], reason: 'No pending nudges for active hubs' };
  }

  // 4. Smart Bundling: if more than 1 nudge, bundle into 1 digest
  if (isSmartBundling && validNudges.length > 1) {
    const bundledTitles = validNudges.map(n => n.title).join(' · ');
    const bundledBody = validNudges.map(n => n.message || n.text).join('\n');
    return {
      scheduled: [{
        id: `bundle_${Date.now()}`,
        isBundled: true,
        itemCount: validNudges.length,
        title: `🌱 Your Wellness Moments (${validNudges.length})`,
        subtitle: bundledTitles,
        body: bundledBody,
        items: validNudges,
        timestamp: currentTime.toISOString()
      }]
    };
  }

  // 5. Individual scheduling within budget
  const availableSlots = budget === -1 ? validNudges.length : Math.max(0, budget - sentTodayCount);
  const scheduled = validNudges.slice(0, availableSlots);

  return {
    scheduled,
    remainingBudget: budget === -1 ? 'unlimited' : Math.max(0, budget - sentTodayCount - scheduled.length)
  };
}
