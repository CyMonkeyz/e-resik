// app/pages/pengelola/Dashboard.tsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useApp } from "../../context/AppContext";
import { StatusBadge } from "../../components/StatusBadge";
import CountUp from "react-countup";
import { 
  IoArrowForward, 
  IoNotifications, 
  IoCheckmarkDoneCircle, 
  IoCash,
  IoCube,
  IoPeople
} from "react-icons/io5";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardPengelola() {
  const { requests, salesTransactions, kpiData } = useApp();

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const recentSales = salesTransactions.slice(0, 3);

  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Warga Baru Bergabung',
        data: [5, 8, 12, 10, 15, 18, kpiData.newUsersThisWeek],
        backgroundColor: '#3B82F6',
        borderRadius: 5,
      },
    ],
  };

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
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Pengelola</h1>
          <p className="text-gray-600 mt-2">Selamat datang! Berikut ringkasan aktivitas hari ini.</p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <IoNotifications className="text-3xl text-yellow-500 mb-2"/>
                <p className="text-sm font-medium text-gray-500">Verifikasi Tertunda</p>
                <p className="text-2xl font-bold text-gray-800">{pendingRequests.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <IoCube className="text-3xl text-green-500 mb-2"/>
                <p className="text-sm font-medium text-gray-500">Sampah Terkumpul (Bulan Ini)</p>
                <p className="text-2xl font-bold text-gray-800">{kpiData.totalWasteCollected} kg</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <IoPeople className="text-3xl text-blue-500 mb-2"/>
                <p className="text-sm font-medium text-gray-500">Warga Aktif</p>
                <p className="text-2xl font-bold text-gray-800">{kpiData.activeUsers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <IoCash className="text-3xl text-purple-500 mb-2"/>
                <p className="text-sm font-medium text-gray-500">Pendapatan (Bulan Ini)</p>
                <p className="text-2xl font-bold text-gray-800">Rp {kpiData.revenue.toLocaleString('id-ID')}</p>
            </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pending Verifications */}
            <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Verifikasi Tertunda</h2>
                <Link to="/pengelola/verifikasi" className="text-sm font-medium text-blue-600 hover:underline">Lihat Semua</Link>
              </div>
              <div className="space-y-3">
                {pendingRequests.slice(0, 3).map(req => (
                  <div key={req.id} className="p-3 bg-yellow-50 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium">{req.userName} - {req.wasteType}</p>
                      <p className="text-sm text-gray-500">{new Date(req.scheduledDate).toLocaleDateString('id-ID')}</p>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                ))}
                {pendingRequests.length === 0 && <p className="text-gray-500 text-center py-4">Tidak ada permintaan verifikasi.</p>}
              </div>
            </motion.div>

            {/* Recent Sales */}
            <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Penjualan Terkini</h2>
                <Link to="/pengelola/penjualan" className="text-sm font-medium text-blue-600 hover:underline">Lihat Semua</Link>
              </div>
              <ul className="divide-y divide-gray-200">
                {recentSales.map(sale => (
                  <li key={sale.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Penjualan {sale.category} ke {sale.buyer}</p>
                      <p className="text-sm text-gray-500">{new Date(sale.date).toLocaleDateString('id-ID')}</p>
                    </div>
                    <p className="font-medium text-green-600">+Rp {sale.totalAmount.toLocaleString('id-ID')}</p>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Aksi Cepat</h2>
              <div className="space-y-3">
                <Link to="/pengelola/verifikasi" className="block w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg">
                  <p className="font-semibold">Verifikasi Setoran</p>
                  <p className="text-sm text-gray-500">Lihat & setujui permintaan baru.</p>
                </Link>
                <Link to="/pengelola/monitoring" className="block w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg">
                  <p className="font-semibold">Monitoring Stok</p>
                  <p className="text-sm text-gray-500">Pantau inventaris sampah.</p>
                </Link>
                <Link to="/pengelola/penjualan" className="block w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg">
                  <p className="font-semibold">Catat Penjualan</p>
                  <p className="text-sm text-gray-500">Input transaksi penjualan baru.</p>
                </Link>
              </div>
            </motion.div>

            {/* User Growth Chart */}
            <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Pertumbuhan Warga</h3>
                <div style={{ height: "200px" }}>
                    <Bar data={userGrowthData} options={{ maintainAspectRatio: false, responsive: true, plugins: { legend: { display: false } } }} />
                </div>
            </motion.div>
          </div>
        </div>
      </motion.main>
    </>
  );
}
