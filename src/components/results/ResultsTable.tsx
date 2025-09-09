import { Box, Table } from "@mantine/core";
import { DateTime } from "luxon";

import { formatParkrunTime } from "@/lib/formatParkrunTime";
import { AdjustedParkrunResult } from "@/types";

export const ResultsTable = ({ data }: { data: AdjustedParkrunResult[] }) => {
  const rows = data.map((result, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        {DateTime.fromISO(result.date).toLocaleString(DateTime.DATE_MED)}
      </Table.Td>
      <Table.Td>{result.parkrun}</Table.Td>
      <Table.Td>
        {formatParkrunTime(result.originalTime || result.time)}
      </Table.Td>
      <Table.Td>{formatParkrunTime(result.time)}</Table.Td>
    </Table.Tr>
  ));

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
