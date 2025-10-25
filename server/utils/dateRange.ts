/**
 * Calculate date range for event filtering
 * @param monthsBack - Number of months in the past (default: 6)
 * @param monthsForward - Number of months in the future (default: 6)
 */
export function getDateRange(
  monthsBack: number = 6,
  monthsForward: number = 6
) {
  const now = new Date();

  const start = new Date(now);
  start.setMonth(now.getMonth() - monthsBack);

  const end = new Date(now);
  end.setMonth(now.getMonth() + monthsForward);

  return { start, end };
}

/**
 * Check if a date is within the allowed range
 * @param date - Date to check
 * @param monthsBack - Number of months in the past (default: 6)
 * @param monthsForward - Number of months in the future (default: 6)
 */
export function isDateInRange(
  date: Date,
  monthsBack: number = 6,
  monthsForward: number = 6
): boolean {
  const { start, end } = getDateRange(monthsBack, monthsForward);
  return date >= start && date <= end;
}
