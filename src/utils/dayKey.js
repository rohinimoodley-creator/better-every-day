/**
 * Better Every Day — Day Boundary Engine
 * Computes a standardized dayKey (YYYY-MM-DD) based on the user's My Daily Rhythm
 * (Day Starts and Day Ends). Ensures no artificial midnight cutoffs.
 * 
 * If a user goes to sleep at 02:00 AM (Day Ends 02:00, Day Starts 08:00),
 * activity logged at 01:30 AM belongs to the previous day's cycle.
 */

export function parseTimeToMinutes(timeStr = '07:00') {
  if (!timeStr || typeof timeStr !== 'string') return 420; // 07:00 default
  const parts = timeStr.split(':');
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  return h * 60 + m;
}

/**
 * Returns the effective date key (YYYY-MM-DD) for any timestamp given the user's rhythm settings.
 * @param {Date|string|number} dateInput
 * @param {Object} rhythm - { dayStarts: "07:00", dayEnds: "23:00" }
 * @returns {string} "YYYY-MM-DD"
 */
export function getDayKey(dateInput = new Date(), rhythm = { dayStarts: '07:00', dayEnds: '23:00' }) {
  const d = dateInput instanceof Date ? new Date(dateInput) : new Date(dateInput || Date.now());
  if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];

  const dayStartsMins = parseTimeToMinutes(rhythm?.dayStarts || '07:00');
  const currentMins = d.getHours() * 60 + d.getMinutes();

  // If the current time is before the user's Day Starts (e.g. 03:00 AM when day starts at 07:00),
  // it is part of the previous day's evening / sleep cycle.
  if (currentMins < dayStartsMins) {
    const prevDate = new Date(d.getTime() - 24 * 60 * 60 * 1000);
    const year = prevDate.getFullYear();
    const month = String(prevDate.getMonth() + 1).padStart(2, '0');
    const day = String(prevDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Checks if a given timestamp falls into the user's quiet hours / sleep time.
 */
export function isInQuietHours(dateInput = new Date(), rhythm = { dayStarts: '07:00', dayEnds: '23:00' }) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput || Date.now());
  const currentMins = d.getHours() * 60 + d.getMinutes();
  const dayStartsMins = parseTimeToMinutes(rhythm?.dayStarts || '07:00');
  const dayEndsMins = parseTimeToMinutes(rhythm?.dayEnds || '23:00');

  if (dayEndsMins > dayStartsMins) {
    // Standard daytime: quiet hours are before dayStarts or after dayEnds
    return currentMins < dayStartsMins || currentMins >= dayEndsMins;
  } else {
    // Overnight schedule: quiet hours are between dayEnds and dayStarts
    return currentMins >= dayEndsMins && currentMins < dayStartsMins;
  }
}
