"use client";

import { ResultsProvider } from "@/components/results/context";
import { Results } from "@/components/results/Results";

export default function ResultsPage() {
  return (
    <ResultsProvider>
      <Results />
    </ResultsProvider>
  );
}
