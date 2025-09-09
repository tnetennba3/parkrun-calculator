"use client";

import { Anchor, Container, Group, Space } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";

import { IconButtons } from "./IconButtons";
import { Logo } from "./Logo";

const NavLink = ({ href, text }: { href: string; text: string }) => (
  <Anchor
    component={Link}
    href={href}
    fz={{ base: "sm", xs: "md" }}
    c="var(--mantine-color-text)"
  >
    {text}
  </Anchor>
);

export const Header = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Container size="md">
      <Group pt="xs" justify="space-between">
        <Group align="baseline">
          <Logo />
          <Space visibleFrom="xs" />
          <NavLink href="/" text="Home" />
          <NavLink href="/estimate" text="Estimate" />
        </Group>

        {mounted && <IconButtons />}
      </Group>
    </Container>
  );
};
