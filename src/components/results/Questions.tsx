import { Accordion, Anchor, List, Text, Title } from "@mantine/core";

import { useResults } from "./context";

const PowerOf10Hyperlink = (
  <Anchor href="https://www.thepowerof10.info/content/itemdisplay.aspx?itemid=1706">
    Power of 10
  </Anchor>
);

const ParkrunTime = ({ time }: { time: string }) => (
  <span style={{ fontWeight: "600" }}>{time}</span>
);

export const Questions = () => {
  const { excludedResults, parkrunData } = useResults();
  const { total } = excludedResults;

  return (
    <Accordion defaultValue={["CALCULATION_METHOD"]} multiple>
      <Accordion.Item value="CALCULATION_METHOD" py="xs">
        <Accordion.Control>
          <Title order={3}>How are these results calculated?</Title>
        </Accordion.Control>
        <Accordion.Panel>
          <Text>
            The {PowerOf10Hyperlink} publishes a Standard Scratch Score (SSS)
            for every UK parkrun. SSS measures how fast or slow a course
            typically is. To compare performances across different courses, we
            adjust each result using the difference in SSS. The adjustment
            scales with finishing time. For example, if one parkrun is harder
            than another by 1 SSS point, then a result of:
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
      {total > 0 && (
        <Accordion.Item value="EXCLUDED_RESULTS" py="xs">
          <Accordion.Control>
            <Title order={3}>Why are some results missing?</Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Text>Not all results can be adjusted: </Text>
            <List mt="xs" withPadding>
              <List.Item>
                Only UK parkruns with an SSS listed on the {PowerOf10Hyperlink}{" "}
                are supported
              </List.Item>
              <List.Item>
                Times that would adjust to 60:00 or longer cannot be calculated
                reliably
              </List.Item>
            </List>
            <Text mt="sm">
              {parkrunData!.firstName} has {total} result
              {total === 1 ? "" : "s"} that could not be adjusted.
              {/* Table goes here */}
            </Text>
          </Accordion.Panel>
        </Accordion.Item>
      )}
    </Accordion>
  );
};
