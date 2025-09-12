import { Box, Group, Table, Text, Tooltip } from "@mantine/core";
import { IconHelpCircle } from "@tabler/icons-react";
import { minBy } from "lodash";
import { DateTime } from "luxon";

import { useResults } from "./context";

import { sss } from "@/data/uk_parkrun_sss";
import { formatParkrunTime } from "@/lib/formatParkrunTime";

export const ResultsTable = () => {
  const { adjustedResults, targetParkrun } = useResults();

  const results = adjustedResults.map((result) => ({
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
        <Table.Td>{sss[parkrun]}</Table.Td>
        <Table.Td>
          <Text
            fw={originalTime === originalTimePB ? 700 : 400}
            inherit
          >{`${formatParkrunTime(originalTime)} ${originalTime === originalTimePB ? "(PB)" : ""}`}</Text>
        </Table.Td>
        <Table.Td>
          <Text
            fw={adjustedTime === adjustedTimePB ? 700 : 400}
            inherit
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
      <Table highlightOnHover fz={{ base: "xs", xs: "sm" }}>
        <Table.Thead fw={700}>
          <Table.Tr>
            <Table.Th>Date</Table.Th>
            <Table.Th>Parkrun</Table.Th>
            <Table.Th>
              <Tooltip
                multiline
                w={300}
                events={{ hover: true, touch: true, focus: false }}
                label="SSS (Standard Scratch Score) — measures course difficulty. Most parkruns fall between 1 (easy/fast) and 4 (harder/slower), but a few of the toughest courses score much higher."
              >
                <Group gap={4} wrap="nowrap">
                  <Text inherit>SSS</Text>
                  <IconHelpCircle size={18} />
                </Group>
              </Tooltip>
            </Table.Th>
            <Table.Th visibleFrom="xs">Original Time</Table.Th>
            <Table.Th hiddenFrom="xs">Original</Table.Th>
            <Table.Th>
              <Tooltip
                multiline
                w={300}
                events={{ hover: true, touch: true, focus: false }}
                label={`Estimated time if instead run at ${targetParkrun}, taking into account any differences in course difficulty (SSS).`}
              >
                <Group gap={4} wrap="nowrap">
                  <Text inherit visibleFrom="xs">
                    Adjusted Time
                  </Text>
                  <Text inherit hiddenFrom="xs">
                    Adjusted
                  </Text>
                  <IconHelpCircle size={18} />
                </Group>
              </Tooltip>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Box>
  );
};
