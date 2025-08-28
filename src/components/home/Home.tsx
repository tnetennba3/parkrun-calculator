import { Box, Container, Stack, Text, Title } from "@mantine/core";
import Image from "next/image";

import { ParkrunIdForm } from "./ParkrunIdForm";

export const Home = () => (
  // Set height to viewpport height minus header height
  <Container size="md" h="calc(100vh - 44px)" style={{ overflow: "hidden" }}>
    <Stack h="100%" align="center" pt="xl">
      <Box maw={600}>
        <Title order={1} ta="center" mb="md" fz={{ base: "2rem", xs: "3rem" }}>
          See how your parkrun results compare
        </Title>

        <Text ta="center" c="dimmed">
          Every parkrun is different! Some are fast and flat, others are muddy
          or hilly. Enter your parkrun ID to instantly see all your results,
          adjusted for course difficulty.
        </Text>
      </Box>

      <ParkrunIdForm />

      <Box
        mt="lg"
        pos="relative"
        aspect-ratio="562 / 245"
        w="var(--container-size-md)"
        h="100%"
      >
        <Image src="/home.svg" alt="" fill priority />
      </Box>
    </Stack>
  </Container>
);
