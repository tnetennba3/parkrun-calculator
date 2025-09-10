import { Box, Table, Text } from "@mantine/core";
import { minBy } from "lodash";
import { DateTime } from "luxon";

import { formatParkrunTime } from "@/lib/formatParkrunTime";
import { AdjustedParkrunResult } from "@/types";

export const ResultsTable = ({ data }: { data: AdjustedParkrunResult[] }) => {
  const results = data.map((result) => ({
    ...result,
    originalTime: result.originalTime || result.time,
    adjustedTime: result.time,
  }));
  const originalTimePB = minBy(results, "originalTime")?.originalTime;
  const adjustedTimePB = minBy(results, "adjustedTime")?.adjustedTime;

  const rows = results.map(
    ({ date, parkrun, originalTime, adjustedTime }, index) => (
      <Table.Tr key={index}>
        <Table.Td>
          {DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED)}
        </Table.Td>
        <Table.Td>{parkrun}</Table.Td>
        <Table.Td>
          <Text
            fw={originalTime === originalTimePB ? 700 : 400}
            size="sm"
          >{`${formatParkrunTime(originalTime)} ${originalTime === originalTimePB ? "(PB)" : ""}`}</Text>
        </Table.Td>
        <Table.Td>
          <Text
            fw={adjustedTime === adjustedTimePB ? 700 : 400}
            size="sm"
          >{`${formatParkrunTime(adjustedTime)} ${adjustedTime === adjustedTimePB ? "(PB)" : ""}`}</Text>
        </Table.Td>
      </Table.Tr>
    ),
  );

  return (
    <Box
      bd={{ base: "none", xs: "1px solid var(--mantine-color-default-border)" }}
      bdrs="md"
      py={{ base: 0, xs: "sm" }}
      px={{ base: 0, xs: "lg" }}
    >
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Date</Table.Th>
            <Table.Th>Parkrun</Table.Th>
            <Table.Th>Original Time</Table.Th>
            <Table.Th>Adjusted Time</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Box>
  );
};
