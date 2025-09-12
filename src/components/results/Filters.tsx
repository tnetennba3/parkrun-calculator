import { Group, Select } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { DateTime } from "luxon";

import { useResults } from "./context";

import { parkruns, sss } from "@/data/uk_parkrun_sss";
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

  const sorted = Object.entries(sss).sort((a, b) => a[1] - b[1]);
  const FASTEST_PARKRUN = sorted[0][0] as Parkrun;
  const SLOWEST_PARKRUN = sorted[sorted.length - 1][0] as Parkrun;
  const FASTEST = `Fastest (${FASTEST_PARKRUN})`;
  const SLOWEST = `Slowest (${SLOWEST_PARKRUN})`;

  const selectParkrun = (parkrun: Parkrun) => {
    switch (parkrun) {
      case FASTEST:
        setTargetParkrun(FASTEST_PARKRUN);
        break;
      case SLOWEST:
        setTargetParkrun(SLOWEST_PARKRUN);
        break;
      default:
        setTargetParkrun(parkrun);
    }
  };

  return (
    <Select
      {...responsiveProps}
      searchable
      label="As if run at"
      data={[
        {
          group: "Fastest and slowest parkruns",
          items: [{ value: FASTEST, label: FASTEST }, SLOWEST],
        },
        { group: "All parkruns", items: parkruns },
      ]}
      value={targetParkrun}
      onChange={(parkrun) => parkrun && selectParkrun(parkrun as Parkrun)}
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
