/**
 * Better Every Day — Number, Unit, and Text Formatters
 * Enforces design system rules:
 * - Thousands separators ("1,500")
 * - Space before units ("250 ml", "30 mins")
 * - Never a unit without a number ("0 mins" fallback)
 * - Singular / Plural correct wording ("1 step" vs "2 steps")
 */

/**
 * Format a number with thousands separators (e.g. 1500 -> "1,500")
 */
export function formatNumber(val, fallback = '0') {
  if (val === null || val === undefined || isNaN(Number(val))) return fallback;
  return Number(val).toLocaleString('en-US');
}

/**
 * Format a number with a unit, ensuring a space before unit and never a naked unit.
 * e.g. (250, 'ml') -> "250 ml"
 * e.g. (null, 'mins') -> "0 mins"
 */
export function formatUnit(val, unit, fallback = 0) {
  const num = (val === null || val === undefined || isNaN(Number(val))) ? fallback : Number(val);
  return `${formatNumber(num)} ${unit}`.trim();
}

/**
 * Format singular vs plural text based on count.
 * e.g. formatPlural(1, 'step', 'steps') -> "1 step"
 * e.g. formatPlural(4, 'step', 'steps') -> "4 steps"
 */
export function formatPlural(count, singular, plural = `${singular}s`, showCount = true) {
  const n = (count === null || count === undefined || isNaN(Number(count))) ? 0 : Number(count);
  const word = n === 1 ? singular : plural;
  return showCount ? `${formatNumber(n)} ${word}` : word;
}

/**
 * Format minutes into compact duration string.
 * e.g. 75 -> "1h 15m" or 30 -> "30m"
 */
export function formatDuration(mins, compact = true) {
  const m = Math.max(0, Math.round(Number(mins) || 0));
  if (m < 60) return compact ? `${m}m` : `${m} mins`;
  const hours = Math.floor(m / 60);
  const remainingMins = m % 60;
  if (remainingMins === 0) return compact ? `${hours}h` : `${hours} hrs`;
  return compact ? `${hours}h ${remainingMins}m` : `${hours}h ${remainingMins}m`;
}

/**
 * Format seconds into mm:ss or hh:mm:ss with tabular padding
 */
export function formatTimer(totalSeconds) {
  const s = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  const pad = (n) => String(n).padStart(2, '0');

  if (hrs > 0) {
    return `${hrs}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}
