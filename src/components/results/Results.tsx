import {
  Box,
  Center,
  Container,
  Loader,
  Space,
  Text,
  Title,
} from "@mantine/core";

import { useResults } from "./context";
import { ExcludedResults } from "./ExcludedResults";
import { Filters } from "./Filters";
import { LineChart } from "./LineChart";
import { NoResults } from "./NoResults";
import { ResultsTable } from "./ResultsTable";

export const Results = () => {
  const { isLoading, isError, parkrunData, adjustedResults } = useResults();

  if (isLoading)
    return (
      <Center h="80%">
        <Loader size="lg" />
      </Center>
    );

  if (isError || !parkrunData) return <Text>Something went wrong.</Text>;

  if (parkrunData.results.length === 0) return <NoResults />;

  return (
    <Container size="md" pb="xl">
      <Box my="lg">
        <Title ta="center" mb="md" fz={{ base: "2rem", xs: "3rem" }}>
          Parkrun results for {parkrunData.firstName}
        </Title>
        <Text c="dimmed">
          These results are adjusted as if they were all run at the same
          parkrun. This makes it easier to compare performances across different
          courses. Use the filters to change the date range or see how times
          would change if run at a different parkrun.
        </Text>
      </Box>

      <Filters />

      {adjustedResults.length ? (
        <>
          <LineChart />
          <Space h="lg" />
          <ResultsTable />
        </>
      ) : (
        <Text ta="center" fw={600} mt="xl">
          No data to display
        </Text>
      )}

      <ExcludedResults />
    </Container>
  );
};
