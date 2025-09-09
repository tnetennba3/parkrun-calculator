import { Box, Group, Text } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

export const Logo = () => (
  <Link href="/" style={{ textDecoration: "none" }}>
    <Group gap="xs" align="baseline">
      <Box pos="relative" w={32} h={32} style={{ alignSelf: "center" }}>
        <Image src="/logo.svg" alt="" fill priority />
      </Box>
      <Text
        fz={{ base: "1.5rem", xs: "1.75rem" }}
        fw={700}
        c="var(--mantine-color-text)"
      >
        5krun
      </Text>
    </Group>
  </Link>
);
