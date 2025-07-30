import { useEffect, useRef } from "react";
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

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = {
  labels: ["Plastik", "Kertas", "Organik", "Logam"],
  datasets: [
    {
      label: "Total (kg)",
      data: [32, 15, 19, 4],
      backgroundColor: ["#22d3ee", "#fde68a", "#a7f3d0", "#fca5a5"],
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" as const },
    title: { display: true, text: "Rekap Setoran per Kategori" },
  },
};

export default function KPIChart() {
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

