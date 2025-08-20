import { Box, Stack, Text, Title } from "@mantine/core";
import Image from "next/image";

import { ParkrunIdForm } from "./ParkrunIdForm";

export const Hero = () => (
  <Stack align="center" pt="xl">
    <Box maw={600}>
      <Title order={1} ta="center" mb="md" fz={{ base: "2rem", xs: "3rem" }}>
        See how your parkrun results compare
      </Title>

      <Text ta="center" c="dimmed">
        Every parkrun is different! Some are fast and flat, others are muddy or
        hilly. Enter your parkrun ID to instantly see all your results, adjusted
        for course difficulty.
      </Text>
    </Box>

    <ParkrunIdForm />

    <Box
      mt="lg"
      pos="relative"
      w="var(--container-size-md)"
      h="calc(245 / 562 * var(--container-size-md))"
    >
      <Image
        src="/hero.svg"
        alt=""
        fill
        style={{
          objectFit: "cover",
          objectPosition: "top",
        }}
      />
    </Box>
  </Stack>
);
