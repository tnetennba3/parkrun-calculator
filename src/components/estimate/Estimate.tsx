import {
  Alert,
  Box,
  Button,
  Container,
  Group,
  NumberInput,
  Select,
  Text,
  Title,
} from "@mantine/core";
import { isInRange, useForm } from "@mantine/form";
import { IconAlertTriangle } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";

import { EstimatedTime } from "./EstimatedTime";

import { parkruns } from "@/data/uk_parkrun_sss";
import { adjustTimeBySSS } from "@/lib/adjustTimeBySSS";
import type { Parkrun } from "@/types";

type Result = {
  targetParkrun: Parkrun;
  estimatedTime?: number;
  error?: Error;
};

export const Estimate = () => {
  const [result, setResult] = useState<Result | undefined>(undefined);
  const [animationKey, setAnimationKey] = useState(0);

  const form = useForm({
    mode: "uncontrolled",
    validateInputOnBlur: true,
    initialValues: {
      minutes: "",
      seconds: 0,
      currentParkrun: "Bushy Park" as Parkrun,
      targetParkrun: "Highbury Fields" as Parkrun,
    },

    validate: {
      minutes: (value) =>
        isNaN(Number(value)) || Number(value) < 13
          ? "Minutes must be 13 or more"
          : undefined,
      seconds: isInRange(
        { min: 0, max: 59 },
        "Seconds must be between 0 and 59",
      ),
    },
  });

  const handleSubmit = ({
    minutes,
    seconds,
    currentParkrun,
    targetParkrun,
  }: typeof form.values) => {
    const time = Number(minutes) * 60 + Number(seconds);
    const result: Result = {
      targetParkrun,
      estimatedTime: adjustTimeBySSS(time, currentParkrun, targetParkrun),
    };

    if (result.estimatedTime === undefined) {
      const errorMessage =
        time < 13 * 60 || time > 60 * 60
          ? "Only estimated times between 13:00 and 60:00 are supported. Try entering a different time."
          : `We can only estimate times between 13:00 and 60:00. Your original time is within that range, but adjusting for the difference in difficulty between ${currentParkrun} and ${targetParkrun} would push it outside the range.`;
      result.error = new Error(errorMessage);
    }

    setResult(result);
    setAnimationKey((prev) => prev + 1); // Force re-animation
  };

  return (
    <Container size="md" mt="xl">
      <Title order={1} ta="center" fz={{ base: "2rem", xs: "3rem" }}>
        Estimate your parkrun time
      </Title>
      <Group
        align="top"
        justify="center"
        mt={{ base: "md", xs: "lg" }}
        gap="xl"
      >
        <Box miw="60%" style={{ flex: 3 }}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Text c="dimmed">
              See what your parkrun time would be on a different course.
            </Text>
            <Group grow align="flex-start" mt="md">
              <NumberInput
                mb="sm"
                label="Minutes"
                placeholder="e.g. 25"
                clampBehavior="none"
                min={0}
                key={form.key("minutes")}
                {...form.getInputProps("minutes")}
              />

              <NumberInput
                mb="sm"
                label="Seconds"
                placeholder="e.g. 30"
                min={0}
                max={59}
                clampBehavior="none"
                key={form.key("seconds")}
                {...form.getInputProps("seconds")}
              />
            </Group>

            <Select
              mb="sm"
              searchable
              label="Current parkrun"
              data={parkruns}
              key={form.key("currentParkrun")}
              {...form.getInputProps("currentParkrun")}
            />

            <Select
              mb="sm"
              searchable
              label="Target parkrun"
              data={parkruns}
              key={form.key("targetParkrun")}
              {...form.getInputProps("targetParkrun")}
            />

            <Button fullWidth mt="lg" type="submit">
              Estimate Time
            </Button>

            {result?.estimatedTime && (
              <EstimatedTime
                targetParkrun={result.targetParkrun}
                estimatedTime={result.estimatedTime}
                animationKey={animationKey}
              />
            )}

            {result?.error && (
              <Alert
                mt="lg"
                variant="outline"
                color="var(--mantine-color-error)"
                title="Estimated time outside supported range"
                icon={<IconAlertTriangle />}
              >
                {result.error.message}
              </Alert>
            )}
          </form>
        </Box>
        <Box
          miw="250"
          maw="50%"
          style={{
            flex: 2,
          }}
        >
          <Image
            src="/estimate.svg"
            alt=""
            width="466"
            height="458"
            style={{ maxWidth: "100%", height: "auto" }}
            priority
          />
        </Box>
      </Group>
    </Container>
  );
};
