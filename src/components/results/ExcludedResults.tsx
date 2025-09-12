import { Anchor, List } from "@mantine/core";

import { ExpandableContent } from "../common/ExpandableContent";

import { useResults } from "./context";

export const ExcludedResults = () => {
  const { excludedResults, targetParkrun } = useResults();
  const { total, unrecognisedParkruns, timesOutsideRange } = excludedResults;

  if (total === 0) return;

  return (
    <ExpandableContent
      buttonText={`${total} result${total > 1 ? "s" : ""} not shown (why?)`}
    >
      <List c="dimmed" ml="xs">
        {unrecognisedParkruns > 0 && (
          <List.Item>
            {unrecognisedParkruns}
            {unrecognisedParkruns === 1
              ? " result was at an unrecognised parkrun"
              : " results were at unrecognised parkruns"}
            . Only UK parkruns with a Standard Scratch Score (SSS) on the{" "}
            <Anchor href="https://www.thepowerof10.info/content/itemdisplay.aspx?itemid=1706">
              Power of 10
            </Anchor>{" "}
            are supported.
          </List.Item>
        )}
        {timesOutsideRange > 0 && (
          <List.Item>
            {timesOutsideRange}
            {timesOutsideRange === 1 ? " result was" : " results were"} were
            outside the supported time range of 13:00 to 59:59 when adjusted for
            the course difficulty of {targetParkrun}.
          </List.Item>
        )}
      </List>
    </ExpandableContent>
  );
};
