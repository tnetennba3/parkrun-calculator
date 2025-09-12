import { Group, Select, SelectProps } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { DateTime } from "luxon";

import { useResults } from "./context";

import { parkruns } from "@/data/uk_parkrun_sss";

export const Filters = () => {
  const { dateRange, setDateRange, targetParkrun, setTargetParkrun } =
    useResults();
  const now = DateTime.now();
  const allTime: [string, string] = ["2004-10-02", now.toISO()];

  return (
    <Group mb="lg">
      <DatePickerInput
        type="range"
        label="Date range"
        placeholder="Select date range"
        value={dateRange}
        onChange={setDateRange}
        presets={[
          {
            value: allTime,
            label: "All time",
          },
          {
            value: [now.startOf("year").toISO(), now.endOf("year").toISO()],
            label: "This year",
          },
          {
            value: [now.minus({ months: 12 }).toISO(), now.toISO()],
            label: "Last 12 months",
          },
        ]}
      />
      <Group>
        <Select
          searchable
          label="As if run at"
          data={parkruns}
          value={targetParkrun}
          onChange={setTargetParkrun as SelectProps["onChange"]}
        />
      </Group>
    </Group>
  );
};
