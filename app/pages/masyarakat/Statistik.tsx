import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import { useApp } from "../../context/AppContext";
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  IoLeaf,
  IoTrendingUp,
  IoCalendar,
  IoStatsChart,
  IoTrophy,
  IoWater,
  IoFlash
} from "react-icons/io5";
import { RiRecycleFill } from "react-icons/ri";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Statistik() {
  const { user, getUserRequests } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const userRequests = getUserRequests(user.id);
  const completedRequests = userRequests.filter(r => r.status === "completed");

  // Generate chart data
  const wasteByCategory = {
    labels: ["Plastik", "Kertas", "Organik", "Logam", "Kaca"],
    datasets: [
      {
        label: "Berat (kg)",
        data: [
          user.statistics.plasticWaste,
          user.statistics.paperWaste,
          user.statistics.organicWaste,
          user.statistics.metalWaste,
          user.statistics.otherWaste
        ],
        backgroundColor: [
          "#3B82F6", // Blue for plastic
          "#F59E0B", // Yellow for paper
          "#10B981", // Green for organic
          "#6B7280", // Gray for metal
          "#8B5CF6"  // Purple for glass
        ],
        borderRadius: 8,
      },
    ],
  };

  // Monthly trend data (simulated)
  const monthlyTrend = {
    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul"],
    datasets: [
      {
        label: "Total Sampah (kg)",
        data: [2.5, 3.2, 4.1, 3.8, 5.2, 4.9, 6.2],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Poin Diperoleh",
        data: [25, 32, 41, 38, 52, 49, 62],
        borderColor: "#F59E0B",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        fill: true,
        tension: 0.4,
        yAxisID: 'y1',
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Berat (kg)'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Poin'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  // Calculate environmental impact
  const calculateImpact = () => {
    const totalWaste = user.statistics.totalWaste;
    const co2Saved = user.statistics.co2Saved;
    const treesEquivalent = user.statistics.treesEquivalent;
    const waterSaved = totalWaste * 2.5; // Rough calculation: 2.5L per kg
    const energySaved = totalWaste * 1.2; // Rough calculation: 1.2 kWh per kg

    return {
      co2Saved,
      treesEquivalent,
      waterSaved,
      energySaved
    };
  };

  const impact = calculateImpact();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
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
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 text-white">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-3xl font-bold mb-2">📊 Statistik Personal</h1>
                <p className="text-blue-100">
                  Pantau kontribusi Anda terhadap lingkungan
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100">Total Kontribusi</p>
                <p className="text-3xl font-bold">{user.statistics.totalWaste}kg</p>
                <p className="text-sm text-blue-100">sampah terkumpul</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Setoran</p>
                  <p className="text-2xl font-bold text-blue-600">{completedRequests.length}</p>
                </div>
                <RiRecycleFill className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Poin Terkumpul</p>
                  <p className="text-2xl font-bold text-green-600">{user.points}</p>
                </div>
                <IoTrophy className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Level</p>
                  <p className="text-2xl font-bold text-purple-600">{user.level}</p>
                </div>
                <IoTrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Badge Diraih</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {user.badges.filter(b => b.achieved).length}
                  </p>
                </div>
                <IoStatsChart className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts */}

          {/* Right Column - Environmental Impact & Achievements */}
          <div className="space-y-6">
            {/* Environmental Impact */}
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-md p-6 border border-green-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <IoLeaf className="w-5 h-5 mr-2 text-green-600" />
                🌍 Dampak Lingkungan
              </h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        🌱
                      </div>
                      <div>
                        <p className="font-medium">CO₂ Diselamatkan</p>
                        <p className="text-sm text-gray-600">Emisi karbon yang dihindari</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">
                        {impact.co2Saved.toFixed(1)}
                      </p>
                      <p className="text-sm text-gray-500">kg CO₂</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        🌳
                      </div>
                      <div>
                        <p className="font-medium">Setara Pohon</p>
                        <p className="text-sm text-gray-600">Pohon yang diselamatkan</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">
                        {impact.treesEquivalent.toFixed(1)}
                      </p>
                      <p className="text-sm text-gray-500">pohon</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <IoWater className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Air Diselamatkan</p>
                        <p className="text-sm text-gray-600">Penghematan air</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-600">
                        {impact.waterSaved.toFixed(0)}
                      </p>
                      <p className="text-sm text-gray-500">liter</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <IoFlash className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">Energi Diselamatkan</p>
                        <p className="text-sm text-gray-600">Penghematan energi</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-yellow-600">
                        {impact.energySaved.toFixed(1)}
                      </p>
                      <p className="text-sm text-gray-500">kWh</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Waste Distribution Pie Chart */}
            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">🥧 Distribusi Sampah</h3>
              <div style={{ height: "250px" }}>
                <Doughnut data={wasteByCategory} options={doughnutOptions} />
              </div>
            </motion.div>

            {/* Recent Achievements */}
            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">🏆 Pencapaian Terbaru</h3>
              <div className="space-y-3">
                {user.badges
                  .filter(b => b.achieved)
                  .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
                  .slice(0, 3)
                  .map((badge) => (
                    <motion.div
                      key={badge.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                    >
                      <span className="text-2xl mr-3">{badge.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-yellow-800">{badge.name}</p>
                        {badge.date && (
                          <p className="text-xs text-yellow-600">
                            {new Date(badge.date).toLocaleDateString("id-ID")}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>

            {/* Monthly Summary */}
            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📅 Ringkasan Bulan Ini</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Setoran:</span>
                  <span className="font-bold">{completedRequests.length} kali</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Berat:</span>
                  <span className="font-bold">{user.statistics.totalWaste.toFixed(1)} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Poin Earned:</span>
                  <span className="font-bold text-green-600">+{user.points}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Target Bulanan:</span>
                  <div className="text-right">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mb-1">
                      <div 
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: `${Math.min((user.statistics.totalWaste / 50) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {user.statistics.totalWaste.toFixed(1)}/50 kg
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">⚡ Aksi Cepat</h3>
              <div className="space-y-3">
                <button className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                  📤 Export Data
                </button>
                <button className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  📊 Laporan Bulanan
                </button>
                <button className="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                  🎯 Set Target Baru
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Comparison Section */}
        <motion.div variants={itemVariants} className="mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">🤝 Perbandingan dengan Pengguna Lain</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-3xl mb-2">🥇</div>
                <p className="font-bold text-green-800">Top 25%</p>
                <p className="text-sm text-green-600">Kontributor terbaik</p>
                <p className="text-xs text-gray-500 mt-2">
                  Anda termasuk 25% pengguna dengan kontribusi tertinggi
                </p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-3xl mb-2">📈</div>
                <p className="font-bold text-blue-800">+15% vs Rata-rata</p>
                <p className="text-sm text-blue-600">Di atas rata-rata</p>
                <p className="text-xs text-gray-500 mt-2">
                  Kontribusi Anda 15% lebih tinggi dari rata-rata pengguna
                </p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-3xl mb-2">🎯</div>
                <p className="font-bold text-purple-800">Target Tercapai</p>
                <p className="text-sm text-purple-600">120% dari target</p>
                <p className="text-xs text-gray-500 mt-2">
                  Anda telah melampaui target personal sebesar 20%
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div variants={itemVariants} className="mt-8">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">💡 Tips Peningkatan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">🎯 Fokus pada Plastik</h4>
                <p className="text-sm text-gray-600">
                  Sampah plastik memberikan poin tertinggi (10 poin/kg). 
                  Kumpulkan lebih banyak botol dan kemasan plastik.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">📅 Konsistensi</h4>
                <p className="text-sm text-gray-600">
                  Setor sampah secara rutin setiap minggu untuk mendapatkan 
                  bonus konsistensi dan badge khusus.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">👥 Ajak Teman</h4>
                <p className="text-sm text-gray-600">
                  Ajak teman dan keluarga bergabung untuk mendapatkan 
                  bonus referral dan badge komunitas.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">🔍 Pilah dengan Benar</h4>
                <p className="text-sm text-gray-600">
                  Pastikan sampah sudah dipilah dengan benar untuk 
                  menghindari penolakan dan mendapat poin maksimal.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.main>
    </>
  );
}