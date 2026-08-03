/**
 * Formats a Date object or ISO string into a human-readable localized string.
 */
export function formatDateTime(dateInput?: string | Date): string {
  if (!dateInput) return 'N/A';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

/**
 * Formats uptime in seconds to a human-readable duration string.
 */
export function formatUptime(seconds?: number): string {
  if (seconds === undefined) return '0s';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];
  if (hrs > 0) parts.push(`${hrs}h`);
  if (mins > 0) parts.push(`${mins}m`);
  parts.push(`${secs}s`);

  return parts.join(' ');
}
