import {
  Box,
  Center,
  Container,
  Group,
  Loader,
  Radio,
  RadioGroupProps,
  Select,
  SelectProps,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ExcludedResults } from "./ExcludedResults";
import { LineChart } from "./LineChart";
import { NoResults } from "./NoResults";
import { ResultsTable } from "./ResultsTable";

import { parkruns, sss } from "@/data/uk_parkrun_sss";
import { adjustParkrunResult } from "@/lib/adjustParkrunResult";
import { getParkrunResults } from "@/lib/api";
import { DateRange, filterByDateRange } from "@/lib/filterByDateRange";
import { findMostVisitedParkrun } from "@/lib/findMostVisitedParkrun";
import type { Parkrun, ParkrunData } from "@/types";

export const Results = () => {
  const [dateRange, setDateRange] = useState<DateRange>("allTime");
  const [targetParkrun, setTargetParkrun] = useState<Parkrun>("Bushy Park");

  const router = useRouter();
  const { parkrunId } = useParams<{ parkrunId: string }>();
  const isValid = !isNaN(Number(parkrunId));

  useEffect(() => {
    if (!isValid) {
      router.replace("/");
    }
  }, [isValid, router]);

  const { data, isLoading, isError } = useQuery<ParkrunData>({
    queryKey: ["results", parkrunId],
    queryFn: () => getParkrunResults(parkrunId),
    enabled: isValid,
  });

  useEffect(() => {
    if (!data) return;

    const ukResults = data.results.filter(({ parkrun }) => parkrun in sss);
    const mostVisited = findMostVisitedParkrun(ukResults) as Parkrun;
    setTargetParkrun(mostVisited);
  }, [data]);

  if (!isValid) return null;

  if (isLoading)
    return (
      <Center h="80%">
        <Loader size="lg" />
      </Center>
    );

  if (isError || !data) {
    return <Text>Something went wrong.</Text>;
  }

  if (data.results.length === 0) {
    return <NoResults />;
  }

  const { firstName, results } = data;
  const ukResults = results.filter(({ parkrun }) => parkrun in sss);
  const filteredResults = filterByDateRange(ukResults, dateRange);
  const adjustedResults = filteredResults.map((result) =>
    adjustParkrunResult(result, targetParkrun),
  );
  const chartData = adjustedResults.filter((result) => result !== undefined);

  const unrecognisedParkruns = results.length - ukResults.length;
  const timesOutsideRange = adjustedResults.length - chartData.length;
  const excludedResults = unrecognisedParkruns + timesOutsideRange;

  return (
    <Container size="md" pb="xl">
      <Box my="lg">
        <Title order={1} ta="center" mb="md" fz={{ base: "2rem", xs: "3rem" }}>
          Parkrun results for {firstName}
        </Title>
        <Text c="dimmed">
          These results are adjusted as if they were all run at the same
          parkrun. This makes it easier to compare performances across different
          courses. Use the filters to change the date range or see how times
          would change if run at a different parkrun.
        </Text>
      </Box>

      <Group justify="space-between" mb="lg">
        <Group>
          <Text size="sm">Date range:</Text>
          <Radio.Group
            value={dateRange}
            onChange={setDateRange as RadioGroupProps["onChange"]}
          >
            <Group>
              <Radio value="twelveMonths" label="Last 12 months" />
              <Radio value="allTime" label="All time" />
            </Group>
          </Radio.Group>
        </Group>
        <Group>
          <Text size="sm">As if run at:</Text>
          <Select
            searchable
            data={parkruns}
            value={targetParkrun}
            onChange={setTargetParkrun as SelectProps["onChange"]}
            styles={{
              input: { fontSize: "var(--mantine-font-size-xs)" },
              option: { fontSize: "var(--mantine-font-size-xs)" },
            }}
          />
        </Group>
      </Group>

      {chartData.length ? (
        <>
          <LineChart parkrun={targetParkrun} data={chartData} />
          <Space h="lg" />
          <ResultsTable data={chartData} />
        </>
      ) : (
        <Text ta="center" fw={600} mt="xl">
          No data to display
        </Text>
      )}
      {excludedResults > 0 && (
        <ExcludedResults
          total={excludedResults}
          unrecognisedParkruns={unrecognisedParkruns}
          timesOutsideRange={timesOutsideRange}
          targetParkrun="Bushy Park"
        />
      )}
    </Container>
  );
};
