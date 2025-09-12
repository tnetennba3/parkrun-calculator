"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { sss } from "@/data/uk_parkrun_sss";
import { adjustParkrunResult } from "@/lib/adjustParkrunResult";
import { getParkrunResults } from "@/lib/api";
import { DateRange, filterByDateRange } from "@/lib/filterByDateRange";
import { findMostVisitedParkrun } from "@/lib/findMostVisitedParkrun";
import type { AdjustedParkrunResult, Parkrun, ParkrunData } from "@/types";

type Context = {
  isLoading: boolean;
  isError: boolean;
  parkrunData?: ParkrunData;

  // filters
  dateRange: DateRange;
  setDateRange: (dateRange: DateRange) => void;
  targetParkrun: Parkrun;
  setTargetParkrun: (parkrun: Parkrun) => void;

  // derived
  adjustedResults: AdjustedParkrunResult[];
  excludedResults: {
    total: number;
    unrecognisedParkruns: number;
    timesOutsideRange: number;
  };
};

const ResultsContext = createContext<Context | null>(null);
export const useResults = () => {
  const context = useContext(ResultsContext);
  if (!context)
    throw new Error("useResults must be used within <ResultsProvider>");
  return context;
};

export const ResultsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { parkrunId } = useParams<{ parkrunId: string }>();
  const isValidParkrunId = !isNaN(Number(parkrunId));

  useEffect(() => {
    if (!isValidParkrunId) {
      router.replace("/");
    }
  }, [isValidParkrunId, router]);

  const [dateRange, setDateRange] = useState<DateRange>([
    "2004-10-02",
    new Date().toISOString(),
  ]);
  const [targetParkrun, setTargetParkrun] = useState<Parkrun>("Bushy Park");

  const { data, isLoading, isError } = useQuery<ParkrunData>({
    queryKey: ["results", parkrunId],
    queryFn: () => getParkrunResults(parkrunId),
    enabled: isValidParkrunId,
  });

  useEffect(() => {
    if (!data) return;

    const uk = data.results.filter(({ parkrun }) => parkrun in sss);
    const mostVisited = findMostVisitedParkrun(uk) as Parkrun;
    setTargetParkrun(mostVisited);
  }, [data]);

  const derived = useMemo(() => {
    if (!data) {
      return {
        adjustedResults: [],
        excludedResults: {
          total: 0,
          unrecognisedParkruns: 0,
          timesOutsideRange: 0,
        },
      };
    }
    const uk = data.results.filter(({ parkrun }) => parkrun in sss);
    const filtered = filterByDateRange(uk, dateRange);
    const adjusted = filtered.map((r) => adjustParkrunResult(r, targetParkrun));
    const adjustedResults = adjusted.filter((r) => r !== undefined);

    const unrecognisedParkruns = data.results.length - uk.length;
    const timesOutsideRange = adjusted.length - adjustedResults.length;
    const total = unrecognisedParkruns + timesOutsideRange;

    return {
      adjustedResults,
      excludedResults: { total, unrecognisedParkruns, timesOutsideRange },
    };
  }, [data, dateRange, targetParkrun]);

  return (
    <ResultsContext.Provider
      value={{
        isLoading,
        isError,
        parkrunData: data,
        dateRange,
        setDateRange,
        targetParkrun,
        setTargetParkrun,
        adjustedResults: derived.adjustedResults,
        excludedResults: derived.excludedResults,
      }}
    >
      {children}
    </ResultsContext.Provider>
  );
};
