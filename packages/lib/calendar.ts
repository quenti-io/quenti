import dayjs from "dayjs";

import { daysInMonth, yyyymmdd } from "./date-fns";

export const getAvailableDatesInMonth = ({
  browsingDate,
  minDate = new Date(),
  includedDates,
}: {
  browsingDate: Date;
  minDate?: Date;
  includedDates?: string[];
}) => {
  const dates = [];
  const lastDateOfMonth = new Date(
    browsingDate.getFullYear(),
    browsingDate.getMonth(),
    daysInMonth(browsingDate),
  );

  for (
    let date = browsingDate > minDate ? browsingDate : minDate;
    // Check if date is before the last date of the month
    // or is the same day, in the same month, in the same year.
    date < lastDateOfMonth || dayjs(date).isSame(lastDateOfMonth, "day");
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
  ) {
    // intersect included dates
    if (includedDates && !includedDates.includes(yyyymmdd(date))) {
      continue;
    }

    dates.push(yyyymmdd(date));
  }

  return dates;
};
