"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { sss } from "@/data/uk_parkrun_sss";
import { getParkrunResults } from "@/lib/api";
import { DateRange, filterByDateRange } from "@/lib/filterByDateRange";
import { findMostVisitedParkrun } from "@/lib/findMostVisitedParkrun";
import { transformParkrunResults } from "@/lib/transformParkrunResults";
import type {
  AdjustedParkrunResult,
  ExcludedParkrunResult,
  Parkrun,
  ParkrunData,
} from "@/types";

type Context = {
  isLoading: boolean;
  isError: boolean;
  parkrunData?: ParkrunData;

  // filters
  dateRange: DateRange;
  setDateRange: (dateRange: DateRange) => void;
  targetParkrun: Parkrun;
  setTargetParkrun: (parkrun: Parkrun) => void;

  // results
  results: {
    adjusted: AdjustedParkrunResult[];
    excluded: ExcludedParkrunResult[];
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

  const results = useMemo(() => {
    if (!data) return { adjusted: [], excluded: [] };

    const filtered = filterByDateRange(data.results, dateRange);
    return transformParkrunResults(filtered, targetParkrun);
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
        results,
      }}
    >
      {children}
    </ResultsContext.Provider>
  );
};
