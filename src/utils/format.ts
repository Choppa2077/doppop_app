// Date/time formatting helpers used across lobby cards, venue slots, and details.

const WEEKDAYS_LONG = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isTomorrow(a: Date, today: Date) {
  const t = new Date(today);
  t.setDate(t.getDate() + 1);
  return isSameDay(a, t);
}

function pad2(n: number) {
  return n.toString().padStart(2, '0');
}

export function formatTime(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export function formatTimeRange(startISO: string, endISO: string) {
  const start = new Date(startISO);
  const end = new Date(endISO);
  return `${formatTime(start)} — ${formatTime(end)}`;
}

export function formatDayLabel(date: Date, today = new Date()) {
  if (isSameDay(date, today)) return 'Today';
  if (isTomorrow(date, today)) return 'Tomorrow';
  return WEEKDAYS_SHORT[date.getDay()];
}

// Compact variant for narrow chips. "Tomorrow" wraps in a 64px chip; "Tmrw"
// keeps the rhythm with the 3-letter weekdays.
export function formatDayLabelCompact(date: Date, today = new Date()) {
  if (isSameDay(date, today)) return 'Today';
  if (isTomorrow(date, today)) return 'Tmrw';
  return WEEKDAYS_SHORT[date.getDay()];
}

export function formatLongDate(date: Date) {
  return `${WEEKDAYS_LONG[date.getDay()]}, ${date.getDate()} ${
    MONTHS_SHORT[date.getMonth()]
  }`;
}

export function formatLobbyTimeRange(
  startISO: string,
  endISO: string,
  today = new Date(),
): string {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const dayLabel = isSameDay(start, today)
    ? 'Today'
    : isTomorrow(start, today)
    ? 'Tomorrow'
    : `${WEEKDAYS_SHORT[start.getDay()]} ${start.getDate()} ${
        MONTHS_SHORT[start.getMonth()]
      }`;
  return `${dayLabel}, ${formatTime(start)} → ${formatTime(end)}`;
}

export function isoDateOnly(date: Date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function buildNextDays(count: number, from = new Date()): Date[] {
  const start = new Date(from);
  start.setHours(0, 0, 0, 0);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export function formatPrice(perHour: string) {
  // Backend returns prices as decimal strings like "12000.00".
  const n = Number.parseFloat(perHour);
  if (!Number.isFinite(n)) return perHour;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatTimeUntil(targetISO: string, now = new Date()): string {
  const diffMs = new Date(targetISO).getTime() - now.getTime();
  if (diffMs <= 0) return 'Started';
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 60) return `in ${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remMin = minutes % 60;
  if (hours < 24) {
    return remMin > 0 ? `in ${hours}h ${remMin}m` : `in ${hours}h`;
  }
  const days = Math.floor(hours / 24);
  return `in ${days}d`;
}
