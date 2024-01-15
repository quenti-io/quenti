import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

/**
 * https://github.com/calcom/cal.com/blob/main/packages/lib/date-fns/index.ts
 */

// converts a date to 2022-04-25 for example.
export const yyyymmdd = (date: Date | Dayjs) =>
  date instanceof Date
    ? dayjs(date).format("YYYY-MM-DD")
    : date.format("YYYY-MM-DD");

// @see: https://github.com/iamkun/dayjs/issues/1272 - for the reason we're not using dayjs to do this.
export const daysInMonth = (date: Date | Dayjs) => {
  const [year, month] =
    date instanceof Date
      ? [date.getFullYear(), date.getMonth()]
      : [date.year(), date.month()];
  // strange JS quirk: new Date(2022, 12, 0).getMonth() = 11
  return new Date(year, month + 1, 0).getDate();
};
