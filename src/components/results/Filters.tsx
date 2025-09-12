import { Group, Select } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { DateTime } from "luxon";

import { useResults } from "./context";

import { parkruns } from "@/data/uk_parkrun_sss";
import { Parkrun } from "@/types";

const DateRangePicker = ({ ...responsiveProps }) => {
  const { dateRange, setDateRange } = useResults();
  const now = DateTime.now();
  const allTime: [string, string] = ["2004-10-02", now.toISO()];

  return (
    <DatePickerInput
      {...responsiveProps}
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
  );
};

const ParkrunPicker = ({ ...responsiveProps }) => {
  const { targetParkrun, setTargetParkrun } = useResults();

  return (
    <Select
      {...responsiveProps}
      searchable
      label="As if run at"
      data={parkruns}
      value={targetParkrun}
      onChange={(parkrun) => parkrun && setTargetParkrun(parkrun as Parkrun)}
    />
  );
};

export const Filters = () => (
  <Group mb="lg">
    <DateRangePicker size="xs" hiddenFrom="xs" />
    <DateRangePicker size="sm" visibleFrom="xs" />

    <ParkrunPicker size="xs" hiddenFrom="xs" />
    <ParkrunPicker size="sm" visibleFrom="xs" />
  </Group>
);
