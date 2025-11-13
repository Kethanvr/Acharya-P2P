'use client';

/* eslint-disable import/no-extraneous-dependencies */
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface LineChartProps {
  labels: string[];
  values: number[];
  label?: string;
  color?: string;
}

export default function LineChart({
  labels,
  values,
  label = "Power (kW)",
  color = "#14B8A6",
}: LineChartProps) {
  const data = {
    labels,
    datasets: [
      {
        label,
        data: values,
        fill: false,
        borderColor: color,
        backgroundColor: color,
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: "minute" as const,
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#E2E8F0",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
  };

  return <Line data={data} options={options} />;
}

