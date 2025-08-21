"use client";

import { createTheme, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const theme = createTheme({
  primaryColor: "indigo",
  primaryShade: { light: 2, dark: 3 },
  autoContrast: true,
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2.5rem",
  },
});

const queryClient = new QueryClient();

export default function Providers({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="auto">
        {children}
      </MantineProvider>
    </QueryClientProvider>
  );
}
