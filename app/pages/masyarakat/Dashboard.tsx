// app/pages/masyarakat/Dashboard.tsx - Enhanced dashboard with complete functionality
import { motion } from "framer-motion";
import { Link } from "react-router";
import Navbar from "../../components/Navbar";
import { useApp } from "../../context/AppContext";
import { PointsDisplay } from "../../components/PointsDisplay";
import { MissionCard } from "../../components/MissionCard";
import { VideoCard } from "../../components/VideoCard";
import { NotificationDropdown } from "../../components/NotificationDropdown";
import { educationalContent } from "../../utils/dummyData";
import { IoTrophy, IoLeaf, IoCalendar, IoStatsChart, IoFlash, IoGift, IoTrendingUp, IoTime, IoCheckmarkCircle } from "react-icons/io5";
import { RiRecycleFill } from "react-icons/ri";

export default function DashboardMasyarakat() {
  const { 
    user, 
    missions, 
    notifications, 
    getUserRequests,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useApp();
  
  // Get user data
  const userRequests = getUserRequests(user.id);
  const activeMissions = missions.filter(m => !m.completed).slice(0, 3);
  const recentNotifications = notifications.slice(0, 3);
  const achievedBadges = user.badges.filter(b => b.achieved);
  const pendingRequests = userRequests.filter(r => r.status === "pending");
  const completedThisWeek = userRequests.filter(r => 
    r.status === "completed" && 
    new Date(r.verifiedAt || r.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );

  // Calculate progress to next level
  const pointsInCurrentLevel = user.points % 100;
  const progressToNextLevel = (pointsInCurrentLevel / 100) * 100;
  const pointsToNextLevel = 100 - pointsInCurrentLevel;

  // Get recent achievements
  const recentAchievements = achievedBadges
    .filter(b => b.date)
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
    .slice(0, 2);

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
        {/* Welcome Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-gradient-to-r from-green-500 via-blue-600 to-purple-600 rounded-xl p-6 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 text-6xl">♻️</div>
              <div className="absolute bottom-4 right-4 text-4xl">🌱</div>
              <div className="absolute top-1/2 left-1/4 text-3xl transform -translate-y-1/2">🌍</div>
            </div>
            
            <div className="relative">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                <div className="mb-6 lg:mb-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold">
                      Selamat Datang, {user.name}! 👋
                    </h1>
                    {user.level >= 2 && (
                      <span className="bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                        VIP
                      </span>
                    )}
                  </div>
                  <p className="text-green-100 mb-4">
                    Mari bersama-sama menjaga lingkungan dan dapatkan poin!
                  </p>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <div className="text-xl font-bold">{completedThisWeek.length}</div>
                      <div className="text-xs text-green-100">Setoran Minggu Ini</div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <div className="text-xl font-bold">{achievedBadges.length}</div>
                      <div className="text-xs text-green-100">Badge Diraih</div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <div className="text-xl font-bold">{user.statistics.totalWaste.toFixed(1)}kg</div>
                      <div className="text-xs text-green-100">Total Sampah</div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <div className="text-xl font-bold">{user.statistics.co2Saved.toFixed(1)}kg</div>
                      <div className="text-xs text-green-100">CO₂ Diselamatkan</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center lg:text-right">
                  <PointsDisplay points={user.points} size="lg" />
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between text-sm text-green-100">
                      <span>Level {user.level}</span>
                      <span>{pointsToNextLevel} poin lagi</span>
                    </div>
                    <div className="w-32 bg-white bg-opacity-30 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressToNextLevel}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="bg-white h-2 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Activity Summary Cards */}
            <motion.div variants={itemVariants}>
              <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Ringkasan Aktivitas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Sampah</p>
                      <p className="text-2xl font-bold text-green-600">
                        {user.statistics.totalWaste.toFixed(1)}kg
                      </p>
                      <p className="text-xs text-gray-500">
                        +{(user.statistics.totalWaste * 0.1).toFixed(1)}kg minggu ini
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <RiRecycleFill className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">CO₂ Diselamatkan</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {user.statistics.co2Saved.toFixed(1)}kg
                      </p>
                      <p className="text-xs text-gray-500">
                        Setara {user.statistics.treesEquivalent.toFixed(1)} pohon
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <IoLeaf className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Badge Diraih</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {achievedBadges.length}
                      </p>
                      <p className="text-xs text-gray-500">
                        dari {user.badges.length} total badge
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <IoTrophy className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Active Missions */}
            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">🎯 Misi Aktif</h2>
                <Link 
                  to="/masyarakat/gamifikasi"
                  className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
                >
                  Lihat Semua <IoFlash className="ml-1 w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {activeMissions.length > 0 ? (
                  activeMissions.map((mission, index) => (
                    <MissionCard key={mission.id} mission={mission} index={index} />
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 rounded-lg shadow-md text-center"
                  >
                    <motion.div 
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="text-6xl mb-4"
                    >
                      🎉
                    </motion.div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Semua Misi Selesai!
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Hebat! Anda telah menyelesaikan semua misi minggu ini.
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-800">
                        🕒 Misi baru akan tersedia setiap Senin pagi
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Educational Content */}
            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  📚 Konten Edukasi
                </h2>
                <Link 
                  to="/masyarakat/edukasi"
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Lihat Semua →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {educationalContent.slice(0, 4).map((content) => (
                  <VideoCard key={content.id} {...content} />
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={itemVariants}>
              <h2 className="text-xl font-bold text-gray-800 mb-4">⏱️ Aktivitas Terbaru</h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-4">
                  {userRequests.slice(0, 3).map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          request.status === "completed" ? "bg-green-100" : 
                          request.status === "pending" ? "bg-yellow-100" : "bg-blue-100"
                        }`}>
                          {request.status === "completed" ? "✅" : 
                           request.status === "pending" ? "⏳" : "🔄"}
                        </div>
                        <div>
                          <p className="font-medium capitalize">
                            {request.type === "pickup" ? "Penjemputan" : "Setoran"} {request.wasteType}
                          </p>
                          <p className="text-sm text-gray-600">
                            {request.estimatedWeight}kg • {new Date(request.createdAt).toLocaleDateString("id-ID")}
                          </p>
                        </div>
                      </div>
                      {request.status === "completed" && request.points && (
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">+{request.points} poin</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {userRequests.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <IoTime className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Belum ada aktivitas</p>
                      <p className="text-sm">Mulai dengan menjadwalkan setoran pertama Anda!</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Recent Achievements */}
            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">🏆 Pencapaian Terbaru</h3>
              <div className="space-y-3">
                {recentAchievements.length > 0 ? (
                  recentAchievements.map((badge) => (
                    <motion.div
                      key={badge.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
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
                      <div className="text-yellow-600">
                        <IoCheckmarkCircle className="w-5 h-5" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <IoTrophy className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Belum ada badge yang diraih</p>
                    <p className="text-xs">Selesaikan misi untuk mendapatkan badge!</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Pending Requests Alert */}
            {pendingRequests.length > 0 && (
              <motion.div
                variants={itemVariants}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
              >
                <div className="flex items-center mb-2">
                  <IoTime className="w-5 h-5 text-yellow-600 mr-2" />
                  <h4 className="font-medium text-yellow-800">Permintaan Pending</h4>
                </div>
                <p className="text-sm text-yellow-700 mb-3">
                  Anda memiliki {pendingRequests.length} permintaan yang menunggu konfirmasi
                </p>
                <Link
                  to="/masyarakat/gamifikasi"
                  className="block w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center font-medium group"
                >
                  <div className="flex items-center justify-center">
                    <IoGift className="w-4 h-4 mr-2 group-hover:animate-spin" />
                    Tukar Reward
                  </div>
                </Link>
            </motion.div>
          )}

            {/* Environmental Impact Widget */}
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-md p-6 border border-green-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <IoLeaf className="w-5 h-5 mr-2 text-green-600" />
                🌍 Dampak Lingkungan
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🌱</span>
                    <span className="text-sm text-gray-600">CO₂ Diselamatkan</span>
                  </div>
                  <span className="font-bold text-green-600">
                    {user.statistics.co2Saved.toFixed(1)} kg
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🌳</span>
                    <span className="text-sm text-gray-600">Setara Pohon</span>
                  </div>
                  <span className="font-bold text-green-600">
                    {user.statistics.treesEquivalent.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">💧</span>
                    <span className="text-sm text-gray-600">Air Hemat</span>
                  </div>
                  <span className="font-bold text-blue-600">
                    {(user.statistics.totalWaste * 2.5).toFixed(0)} L
                  </span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white bg-opacity-70 rounded-lg">
                <p className="text-xs text-gray-600 text-center">
                  💚 Kontribusi Anda membuat perbedaan untuk planet ini!
                </p>
              </div>
            </motion.div>

            {/* Leaderboard Preview */}
            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">👑 Top Kontributor</h3>
                <Link 
                  to="/masyarakat/gamifikasi"
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Lihat Semua →
                </Link>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Siti Aminah", points: 180, rank: 1, isUser: false },
                  { name: "Ahmad Rahman", points: 165, rank: 2, isUser: false },
                  { name: user.name, points: user.points, rank: 3, isUser: true }
                ].map((player, index) => (
                  <motion.div
                    key={player.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      player.isUser 
                        ? "bg-green-50 border border-green-200" 
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? "bg-yellow-500" :
                        index === 1 ? "bg-gray-400" :
                        "bg-orange-600"
                      }`}>
                        {index === 0 ? "🏆" : index === 1 ? "🥈" : "🥉"}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {player.name}
                          {player.isUser && " (Anda)"}
                        </p>
                        <p className="text-xs text-gray-500">Rank #{player.rank}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{player.points}</p>
                      <p className="text-xs text-gray-500">poin</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Motivational Widget */}
            <motion.div 
              variants={itemVariants}
              className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-md p-6 text-white"
            >
              <div className="text-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatDelay: 5 
                  }}
                  className="text-4xl mb-3"
                >
                  🎯
                </motion.div>
                <h3 className="font-bold mb-2">Target Minggu Ini</h3>
                <p className="text-sm text-purple-100 mb-3">
                  Kumpulkan 10kg sampah untuk naik level!
                </p>
                <div className="bg-white bg-opacity-20 rounded-full h-2 mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((user.statistics.totalWaste / 10) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 1 }}
                    className="bg-white h-2 rounded-full"
                  />
                </div>
                <p className="text-xs text-purple-100">
                  {user.statistics.totalWaste.toFixed(1)}/10 kg (
                  {Math.min(Math.round((user.statistics.totalWaste / 10) * 100), 100)}%)
                </p>
              </div>
            </motion.div>

            {/* Weather Widget */}
            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                ☀️ Cuaca Hari Ini
              </h3>
              <div className="text-center">
                <div className="text-4xl mb-2">🌤️</div>
                <p className="font-bold text-xl text-gray-800">28°C</p>
                <p className="text-sm text-gray-600">Cerah Berawan</p>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-800">
                    ✨ Cuaca bagus untuk menjemur sampah yang akan disetor!
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Weekly Challenge Banner */}
        <motion.div 
          variants={itemVariants}
          className="mt-8 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 rounded-xl p-6 text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2 mb-2">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                  className="text-2xl"
                >
                  🔥
                </motion.span>
                <h2 className="text-2xl font-bold">Tantangan Mingguan</h2>
              </div>
              <p className="text-orange-100 mb-2">
                Kumpulkan 15kg plastik dalam 7 hari dan menangkan voucher belanja!
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <IoTime className="w-4 h-4" />
                  <span>3 hari tersisa</span>
                </div>
                <div className="flex items-center space-x-1">
                  <IoTrendingUp className="w-4 h-4" />
                  <span>124 peserta</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-3">
                <p className="text-2xl font-bold">
                  {user.statistics.plasticWaste.toFixed(1)}/15kg
                </p>
                <p className="text-xs text-orange-100">Progress Anda</p>
              </div>
              <Link
                to="/masyarakat/jadwal"
                className="bg-white text-orange-500 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors inline-flex items-center"
              >
                <IoFlash className="w-4 h-4 mr-2" />
                Ikut Tantangan
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Tips of the Day */}
        <motion.div 
          variants={itemVariants}
          className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6"
        >
          <div className="flex items-start space-x-4">
            <div className="text-3xl">💡</div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-2">Tips Hari Ini</h3>
              <p className="text-gray-700 text-sm mb-3">
                Pisahkan sampah plastik berdasarkan jenisnya untuk mendapatkan poin maksimal. 
                Botol PET, kantong plastik, dan kemasan makanan memiliki nilai poin yang berbeda!
              </p>
              <Link 
                to="/masyarakat/edukasi"
                className="text-yellow-700 hover:text-yellow-800 text-sm font-medium"
              >
                Pelajari lebih lanjut →
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.main>
    </>
  );
}
