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
import type { AdjustedParkrunResult } from "@/types";

ChartJS.register(LineElement, LinearScale, TimeScale, PointElement, Tooltip);

export const LineChart = ({ data }: { data: AdjustedParkrunResult[] }) => {
  const getCSSVariable = (name: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const contrastColor = getCSSVariable("--mantine-color-default-color");
  const mutedColor = getCSSVariable("--mantine-color-body");
  const primaryColor = getCSSVariable("--mantine-primary-color-filled");
  const textColor = getCSSVariable("--mantine-color-dimmed");

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
        ticks: {
          color: textColor,
          callback: (value: string | number) =>
            formatParkrunTime(value as number),
        },
      },
      x: {
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

  return <Line data={chartData} options={options} />;
};
