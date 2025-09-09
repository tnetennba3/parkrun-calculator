import { Box, Title } from "@mantine/core";
import {
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-luxon";

import { formatParkrunTime } from "@/lib/formatParkrunTime";
import type { AdjustedParkrunResult, Parkrun } from "@/types";

ChartJS.register(LineElement, LinearScale, TimeScale, PointElement, Tooltip);

export const LineChart = ({
  parkrun,
  data,
}: {
  parkrun: Parkrun;
  data: AdjustedParkrunResult[];
}) => {
  const getCSSVariable = (name: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const contrastColor = getCSSVariable("--mantine-color-default-color");
  const mutedColor = getCSSVariable("--mantine-color-body");
  const primaryColor = getCSSVariable("--mantine-primary-color-filled");
  const textColor = getCSSVariable("--mantine-color-dimmed");
  const gridColor = getCSSVariable("--mantine-color-default-border");

  const chartData = {
    labels: data.map((d) => d.date.toLocaleString()),
    datasets: [
      {
        data: data.map((d) => d.time),
        borderColor: primaryColor,
        backgroundColor: data.map((d) =>
          d.originalTime ? contrastColor : mutedColor,
        ),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        displayColors: false,
        callbacks: {
          label: (context: { dataIndex: number }) => {
            const { time, parkrun, originalTime } = data[context.dataIndex];

            if (originalTime)
              return [
                `Time: ${formatParkrunTime(time)}`,
                `Original: ${formatParkrunTime(originalTime)} (${parkrun})`,
              ];

            return `Time: ${formatParkrunTime(time)} (${parkrun})`;
          },
        },
      },
    },
    scales: {
      y: {
        grid: { color: gridColor },
        ticks: {
          color: textColor,
          callback: (value: string | number) =>
            formatParkrunTime(value as number),
        },
      },
      x: {
        grid: { display: false },
        type: "time" as const,
        time: {
          tooltipFormat: "DD",
        },
        ticks: {
          color: textColor,
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 8,
      },
      line: {
        borderJoinStyle: "round" as const,
      },
    },
  };

  return (
    <Box
      bd={{ base: "none", xs: "1px solid var(--mantine-color-default-border)" }}
      bdrs="md"
      py={{ base: 0, xs: "md" }}
      px={{ base: 0, xs: "lg" }}
    >
      <Title order={2} size="md" mb="sm">
        Adjusted results (as if run at {parkrun})
      </Title>
      <Line data={chartData} options={options} />
    </Box>
  );
};
