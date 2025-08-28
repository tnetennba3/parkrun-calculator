import { Box, Button, Space, Stack, Text, Title } from "@mantine/core";
import { IconArrowNarrowLeft } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export const NoResults = () => (
  <Stack align="center" pt="xl" h="calc(100vh - 44px)" gap="5vh">
    <Box maw={600}>
      <Title order={1} ta="center" my="md" fz={{ base: "2rem", xs: "3rem" }}>
        No parkrun results
      </Title>
      <Text ta="center" c="dimmed">
        You do not have any official parkrun results yet. Join a parkrun this
        Saturday and check back!
      </Text>
    </Box>
    <Box pos="relative" aspect-ratio="270/240" w="100%" h="100%">
      <Image src="/no_results.svg" alt="" fill priority />
    </Box>
    <Link href="/">
      <Button variant="default" leftSection={<IconArrowNarrowLeft size={20} />}>
        Try another parkrun ID
      </Button>
    </Link>
    <Space h="5vh" />
  </Stack>
);
