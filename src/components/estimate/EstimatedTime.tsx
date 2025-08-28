import { Anchor, Container, Group, Text } from "@mantine/core";
import { IconRun } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";

import { ExpandableContent } from "../common/ExpandableContent";

import { formatParkrunTime } from "@/lib/formatParkrunTime";

export const EstimatedTime = ({
  targetParkrun,
  estimatedTime,
  animationKey,
}: {
  targetParkrun: string;
  estimatedTime: number;
  animationKey: number;
}) => (
  <>
    <Container
      mt="lg"
      pt="lg"
      pb="lg"
      ta="center"
      c="black"
      style={{
        borderRadius: "var(--mantine-radius-default)",
        backgroundColor: "var(--secondary-shade)",
      }}
    >
      <Text size="lg">Estimated time at {targetParkrun}:</Text>
      <Group mt="sm" justify="center" gap="xs">
        <AnimatePresence mode="wait">
          <motion.span
            key={`time-${animationKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <Text size="xl" fw="bold">
              {formatParkrunTime(estimatedTime)}
            </Text>
          </motion.span>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.span
            key={`icon-${animationKey}`}
            initial={{ x: -95 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ height: "24px" }}
          >
            <IconRun />
          </motion.span>
        </AnimatePresence>
      </Group>
    </Container>
    <ExpandableContent buttonText="How is this calculated?">
      <Text size="sm" c="dimmed">
        The{" "}
        <Anchor href="https://www.thepowerof10.info/content/itemdisplay.aspx?itemid=1706">
          Power of 10
        </Anchor>{" "}
        publishes a Standard Scratch Score (SSS) for every parkrun in the UK.
        This score reflects how fast or slow each parkrun is. To estimate your
        time at a different parkrun, we adjust your original time based on the
        difference in SSS between the two courses. For example, a 1-point SSS
        difference adds 29 seconds to a 20 minute time, 34 seconds to a 25
        minute time, and 45 seconds to a 30 minute time.
      </Text>
    </ExpandableContent>
  </>
);
