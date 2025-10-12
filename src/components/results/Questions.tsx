import { Accordion, Anchor, List, Table, Text } from "@mantine/core";
import { DateTime } from "luxon";

import { useResults } from "./context";

import { formatParkrunTime } from "@/lib/formatParkrunTime";

const PowerOf10Hyperlink = (
  <Anchor
    href="https://www.thepowerof10.info/content/itemdisplay.aspx?itemid=1706"
    target="_blank"
    rel="noopener noreferrer"
  >
    Power of 10
  </Anchor>
);

const ParkrunTime = ({ time }: { time: string }) => (
  <span style={{ fontWeight: "600" }}>{time}</span>
);

const MissingResultsTable = () => {
  const { results } = useResults();

  const tableData = {
    caption: "Results that could not be adjusted and the reason why",
    head: ["Date", "Parkrun", "Time", "Reason"],
    body: results.excluded.map(({ date, parkrun, time, reason }) => [
      DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED),
      parkrun,
      formatParkrunTime(time),
      reason,
    ]),
  };

  return (
    <Table
      highlightOnHover
      fz={{ base: "xs", xs: "sm" }}
      ml="-8px"
      data={tableData}
    />
  );
};

export const Questions = () => {
  const { results } = useResults();

  return (
    <Accordion defaultValue={["CALCULATION_METHOD"]} multiple order={3}>
      <Accordion.Item value="CALCULATION_METHOD" py="xs">
        <Accordion.Control>
          <Text fw="600" size="lg">
            How are these results calculated?
          </Text>
        </Accordion.Control>
        <Accordion.Panel>
          <Text>
            The {PowerOf10Hyperlink} publishes a Standard Scratch Score (SSS)
            for every UK parkrun. SSS reflects how fast or slow a course
            typically is. To compare results across different courses, each
            finish time is adjusted by the difference in SSS between courses.
            The adjustment scales with finishing time. For example, if one
            course is 1 SSS point harder than another, then a result of:
          </Text>
          <List mt="xs" withPadding>
            <List.Item>
              <ParkrunTime time="20:00" /> would adjust to{" "}
              <ParkrunTime time="20:29" />
            </List.Item>
            <List.Item>
              <ParkrunTime time="25:00" /> would adjust to{" "}
              <ParkrunTime time="25:34" />
            </List.Item>
            <List.Item>
              <ParkrunTime time="30:00" /> would adjust to{" "}
              <ParkrunTime time="30:45" />
            </List.Item>
          </List>
        </Accordion.Panel>
      </Accordion.Item>
      {results.excluded.length > 0 && (
        <Accordion.Item value="EXCLUDED_RESULTS" py="xs">
          <Accordion.Control>
            <Text fw="600" size="lg">
              Why are some results missing?
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Text>Not every result can be adjusted: </Text>
            <List my="xs" withPadding>
              <List.Item>
                Only UK parkruns with an SSS on the {PowerOf10Hyperlink} are
                supported
              </List.Item>
              <List.Item>
                Times that would adjust to an hour or longer cannot be
                calculated reliably
              </List.Item>
            </List>
            <MissingResultsTable />
          </Accordion.Panel>
        </Accordion.Item>
      )}
    </Accordion>
  );
};
