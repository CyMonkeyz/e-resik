// app/pages/pengelola/Monitoring.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import { useApp } from "../../context/AppContext";
import CountUp from "react-countup";
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { WasteStockCard } from "../../components/WasteStockCard";
import { 
  IoStatsChart,
  IoPeople,
  IoWallet,
  IoCube,
  IoTrendingUp,
  IoCalendarOutline,
  IoCheckmarkCircle
} from "react-icons/io5";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Monitoring() {
  const { kpiData, wasteStock, requests } = useApp();
  const [timeframe, setTimeframe] = useState("monthly");

  // Chart Data Preparation
  const wasteByCategoryData = {
    labels: Object.keys(kpiData.wasteByCategory),
    datasets: [
      {
        label: "Berat (kg)",
        data: Object.values(kpiData.wasteByCategory),
        backgroundColor: [
          '#3B82F6', '#10B981', '#F59E0B', '#6B7280', '#8B5CF6'
        ],
        borderRadius: 5,
      },
    ],
  };

  const monthlyTrendData = {
    labels: kpiData.monthlyTrend.map((d: any) => d.month),
    datasets: [
      {
        label: "Total Sampah (kg)",
        data: kpiData.monthlyTrend.map((d: any) => d.waste),
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: "Pendapatan (Rp)",
        data: kpiData.monthlyTrend.map((d: any) => d.revenue),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: { display: true, text: 'Berat (kg)' }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: { display: true, text: 'Pendapatan (Rp)' },
        grid: { drawOnChartArea: false },
      },
    },
  };

  const recentActivities = requests
    .filter(r => r.status === 'completed')
    .sort((a, b) => new Date(b.verifiedAt!).getTime() - new Date(a.verifiedAt!).getTime())
    .slice(0, 5);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Navbar />
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Monitoring & Analitik</h1>
          <p className="text-gray-600 mt-2">
            Pantau performa operasional dan pertumbuhan e-Resik secara real-time.
          </p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card: Total Sampah */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Sampah (Bulan Ini)</p>
                <p className="text-3xl font-bold text-gray-800">
                  <CountUp end={kpiData.totalWasteCollected} duration={1.5} separator="." /> kg
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <IoCube className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          {/* Card: Warga Aktif */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Warga Aktif</p>
                <p className="text-3xl font-bold text-gray-800">
                  <CountUp end={kpiData.activeUsers} duration={1.5} />
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <IoPeople className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          {/* Card: Pendapatan */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pendapatan (Bulan Ini)</p>
                <p className="text-3xl font-bold text-gray-800">
                  Rp <CountUp end={kpiData.revenue} duration={1.5} separator="." />
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <IoWallet className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          {/* Card: Target Bulanan */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <p className="text-sm font-medium text-gray-500">Target Sampah Bulanan</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
              <motion.div
                className="bg-purple-600 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(kpiData.totalWasteCollected / kpiData.monthlyTarget) * 100}%` }}
                transition={{ duration: 1.5 }}
              />
            </div>
            <p className="text-right text-sm font-medium text-gray-700">
              {((kpiData.totalWasteCollected / kpiData.monthlyTarget) * 100).toFixed(1)}% tercapai
            </p>
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
          {/* Monthly Trend Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Tren Bulanan</h3>
            <div style={{ height: "350px" }}>
              <Line data={monthlyTrendData} options={chartOptions as any} />
            </div>
          </motion.div>
          {/* Waste by Category Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Sampah per Kategori</h3>
            <div style={{ height: "350px" }}>
              <Bar data={wasteByCategoryData} options={{ maintainAspectRatio: false, responsive: true }} />
            </div>
          </motion.div>
        </div>

        {/* Waste Stock Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Stok Sampah Terkini</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wasteStock.map(stock => (
              <WasteStockCard key={stock.id} stock={stock} />
            ))}
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Aktivitas Verifikasi Terkini</h2>
          <div className="bg-white rounded-lg shadow-md">
            <ul className="divide-y divide-gray-200">
              {recentActivities.map(activity => (
                <li key={activity.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-full mr-4">
                      <IoCheckmarkCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        Verifikasi untuk <span className="font-bold">{activity.userName}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.actualWeight}kg {activity.wasteType} (+{activity.points} poin)
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(activity.verifiedAt!).toLocaleDateString("id-ID")}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </motion.main>
    </>
  );
}
