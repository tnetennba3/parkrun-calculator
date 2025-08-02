import { Box, Group, Text } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

export const Logo = () => (
  <Link href="/" style={{ textDecoration: "none" }}>
    <Group gap="sm">
      <Box pos="relative" w={36} h={36}>
        <Image src="/logo.svg" alt="" fill priority />
      </Box>
      <Text size="1.75rem" fw={700} c="var(--mantine-color-text)">
        5krun
      </Text>
    </Group>
  </Link>
);
