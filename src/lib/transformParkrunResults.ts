import { adjustParkrunResult } from "./adjustParkrunResult";

import { sss } from "@/data/uk_parkrun_sss";
import {
  AdjustedParkrunResult,
  ExcludedParkrunResult,
  Parkrun,
  ParkrunResult,
} from "@/types";

export const transformParkrunResults = (
  results: ParkrunResult[],
  targetParkrun: Parkrun,
) =>
  results.reduce(
    (
      acc: {
        adjusted: AdjustedParkrunResult[];
        excluded: ExcludedParkrunResult[];
      },
      result,
    ) => {
      if (result.parkrun in sss) {
        const adjustedResult = adjustParkrunResult(result, targetParkrun);

        if (adjustedResult) acc.adjusted.push(adjustedResult);
        else acc.excluded.push({ ...result, reason: "Adjusted time > 59:59" });
      } else {
        acc.excluded.push({ ...result, reason: "No SSS" });
      }

      return acc;
    },
    {
      adjusted: [],
      excluded: [],
    },
  );
