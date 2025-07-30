import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = {
  labels: ["Plastik", "Kertas", "Organik", "Logam", "Lainnya"],
  datasets: [
    {
      label: "Setoran (kg)",
      data: [12, 9, 6, 2, 1],
      backgroundColor: [
        "#22c55e",
        "#3b82f6",
        "#fbbf24",
        "#6b7280",
        "#a21caf",
      ],
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" as const },
    title: { display: true, text: "Statistik Setoran Sampah" },
  },
};

export default function StatistikChart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}
      className="bg-white p-4 rounded shadow"
    >
      <div style={{ height: "400px" }}>
        <Bar data={data} options={options} />
      </div>
    </motion.div>
  );
}