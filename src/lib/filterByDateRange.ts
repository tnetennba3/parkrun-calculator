import { DateTime, Interval } from "luxon";

import { ParkrunResult } from "@/types";

export type DateRange = [string | null, string | null];

export const isInDateRange = (
  date: string,
  [startDate, endDate]: [string, string],
) => {
  const interval = Interval.fromDateTimes(
    DateTime.fromISO(startDate),
    DateTime.fromISO(endDate).plus({ days: 1 }),
  );

  return interval.contains(DateTime.fromISO(date));
};

export const filterByDateRange = (
  parkrunResults: ParkrunResult[],
  dateRange: DateRange,
): ParkrunResult[] => {
  const [startDate, endDate] = dateRange;

  if (!startDate || !endDate) {
    return parkrunResults;
  }

  return parkrunResults.filter(({ date }) =>
    isInDateRange(date, [startDate, endDate]),
  );
};
