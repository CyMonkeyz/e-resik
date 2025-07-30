import { useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ProgressChartProps {
  progress: number; // nilai 0-100
}

export default function ProgressChart({ progress }: ProgressChartProps) {
  const data = {
    labels: ["Tercapai", "Belum"],
    datasets: [
      {
        data: [progress, 100 - progress],
        backgroundColor: ["#22c55e", "#d1fae5"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "bottom" as const },
    },
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div style={{ height: "300px" }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}