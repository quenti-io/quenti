/**
 * https://github.com/calcom/cal.com/blob/main/packages/lib/weekday.ts
 */

type WeekdayFormat = "short" | "long";

// By default starts on Sunday (Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday)
export const weekdayNames = (
  locale: string | string[],
  weekStart = 0,
  format: WeekdayFormat = "long",
) => {
  return Array(7)
    .fill(null)
    .map((_, day) => nameOfDay(locale, day + weekStart, format));
};

export const nameOfDay = (
  locale: string | string[] | undefined,
  day: number,
  format: WeekdayFormat = "long",
) => {
  return new Intl.DateTimeFormat(locale, { weekday: format }).format(
    new Date(1970, 0, day + 4),
  );
};
