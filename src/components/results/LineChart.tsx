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

import { useResults } from "./context";

import { formatParkrunTime } from "@/lib/formatParkrunTime";
ChartJS.register(LineElement, LinearScale, TimeScale, PointElement, Tooltip);

export const LineChart = () => {
  const { adjustedResults, targetParkrun } = useResults();

  const getCSSVariable = (name: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const contrastColor = getCSSVariable("--mantine-color-default-color");
  const mutedColor = getCSSVariable("--mantine-color-body");
  const primaryColor = getCSSVariable("--mantine-primary-color-filled");
  const textColor = getCSSVariable("--mantine-color-dimmed");
  const gridColor = getCSSVariable("--mantine-color-default-border");

  const chartData = {
    labels: adjustedResults.map((d) => d.date.toLocaleString()),
    datasets: [
      {
        data: adjustedResults.map((d) => d.time),
        borderColor: primaryColor,
        backgroundColor: adjustedResults.map((d) =>
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
            const { time, parkrun, originalTime } =
              adjustedResults[context.dataIndex];

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
        Adjusted parkrun results (as if all were run at {targetParkrun})
      </Title>
      <Line data={chartData} options={options} />
    </Box>
  );
};
