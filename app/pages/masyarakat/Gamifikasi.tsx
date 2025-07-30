// app/pages/masyarakat/Gamifikasi.tsx - Enhanced gamification page
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import Navbar from "../../components/Navbar";
import { PointsDisplay } from "../../components/PointsDisplay";
import { MissionCard } from "../../components/MissionCard";
import { Modal } from "../../components/Modal";
import { useApp, showToast, type Badge } from "../../context/AppContext";
import { leaderboard } from "../../utils/dummyData";
import { 
  IoTrophy, 
  IoMedal, 
  IoFlash, 
  IoStar, 
  IoGift, 
  IoCheckmarkCircle,
  IoLockClosed,
  IoInformationCircle,
  IoRibbon,
  IoFlame,
  IoRibbonOutline
} from "react-icons/io5";

export default function Gamifikasi() {
  const { user, missions, completeMission } = useApp();
  // Which tab is currently selected
  const [selectedTab, setSelectedTab] = useState("missions");
  // Currently selected badge for the detail modal
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  // Control visibility of the badge detail modal
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  // Control visibility of the reward confirmation modal
  const [showRewardModal, setShowRewardModal] = useState(false);

  // Split missions into completed vs active lists
  const completedMissions = missions.filter((m) => m.completed);
  const activeMissions = missions.filter((m) => !m.completed);
  // Explicitly type filtered badge arrays to avoid `never[]` inference errors
  const achievedBadges: Badge[] = user.badges.filter((b) => b.achieved);
  const unlockedBadges: Badge[] = user.badges.filter((b) => !b.achieved);

  // Determine the user's ranking within the leaderboard. Use explicit
  // parameter types to avoid implicit `any` in the callback.
  const userRank = leaderboard.findIndex((l: any) => l.name === user.name) + 1;

  // Define a shape for reward items. Having an explicit type avoids
  // TypeScript inferring an array of `never` when filtering or mapping.
  interface Reward {
    id: number;
    name: string;
    points: number;
    description: string;
    icon: string;
    available: boolean;
  }

  // Available rewards based on points
  const rewards: Reward[] = [
    { id: 1, name: "Voucher Belanja", points: 100, description: "Diskon 10% di minimarket", icon: "🛒", available: user.points >= 100 },
    { id: 2, name: "Tote Bag Eco", points: 200, description: "Tas ramah lingkungan", icon: "👜", available: user.points >= 200 },
    { id: 3, name: "Tumbler Premium", points: 300, description: "Bottle minum berkualitas", icon: "🥤", available: user.points >= 300 },
    { id: 4, name: "Voucher Grab", points: 500, description: "Kredit transportasi online", icon: "🚗", available: user.points >= 500 }
  ];

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

  const tabVariants = {
    inactive: { backgroundColor: "#f3f4f6", color: "#6b7280" },
    active: { backgroundColor: "#10b981", color: "#ffffff" }
  };

  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
    setShowBadgeModal(true);
  };

  const getLevelProgress = () => {
    const pointsInCurrentLevel = user.points % 100;
    return (pointsInCurrentLevel / 100) * 100;
  };

  const getNextLevelPoints = () => {
    return 100 - (user.points % 100);
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
        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 rounded-xl p-6 text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2">
                <h1 className="text-3xl font-bold mb-2">🎮 Gamifikasi & Reward</h1>
                <p className="text-blue-100 mb-4">
                  Kumpulkan poin, raih badge, dan tukar dengan reward menarik!
                </p>
                <div className="flex items-center space-x-4">
                  <PointsDisplay points={user.points} size="lg" />
                  <div className="text-center">
                    <p className="text-sm text-blue-100">Level</p>
                    <p className="text-2xl font-bold">{user.level}</p>
                  </div>
                  {userRank > 0 && (
                    <div className="text-center">
                      <p className="text-sm text-blue-100">Peringkat</p>
                      <p className="text-2xl font-bold">#{userRank}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Level Progress */}
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Progress Level {user.level + 1}</span>
                  <span className="text-sm">{getNextLevelPoints()} poin lagi</span>
                </div>
                <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getLevelProgress()}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-white h-3 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-lg">
            {[
              { id: "missions", label: "🎯 Misi", icon: IoFlash },
              { id: "badges", label: "🏆 Badge", icon: IoMedal },
              { id: "leaderboard", label: "👑 Leaderboard", icon: IoTrophy },
              { id: "rewards", label: "🎁 Reward", icon: IoGift }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                variants={tabVariants}
                animate={selectedTab === tab.id ? "active" : "inactive"}
                onClick={() => setSelectedTab(tab.id)}
                className="flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {selectedTab === "missions" && (
            <motion.div
              key="missions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Mission Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                  <IoCheckmarkCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{completedMissions.length}</p>
                  <p className="text-sm text-gray-600">Misi Selesai</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                  <IoFlash className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-600">{activeMissions.length}</p>
                  <p className="text-sm text-gray-600">Misi Aktif</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                  <IoStar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">
                    {missions.reduce((sum, m) => sum + (m.completed ? m.points : 0), 0)}
                  </p>
                  <p className="text-sm text-gray-600">Poin dari Misi</p>
                </div>
              </div>

              {/* Active Missions */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">🎯 Misi Aktif</h2>
                <div className="space-y-4">
                  {activeMissions.length > 0 ? (
                    activeMissions.map((mission, index) => (
                      <MissionCard key={mission.id} mission={mission} index={index} />
                    ))
                  ) : (
                    <div className="bg-white p-8 rounded-lg shadow-md text-center">
                      <div className="text-6xl mb-4">🎉</div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        Semua Misi Selesai!
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Hebat! Anda telah menyelesaikan semua misi minggu ini.
                      </p>
                      <p className="text-sm text-gray-500">
                        Misi baru akan tersedia setiap Senin pagi.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Completed Missions */}
              {completedMissions.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">✅ Misi Selesai</h2>
                  <div className="space-y-4">
                    {completedMissions.slice(0, 3).map((mission, index) => (
                      <MissionCard key={mission.id} mission={mission} index={index} />
                    ))}
                    {completedMissions.length > 3 && (
                      <div className="text-center">
                        <button className="text-green-600 hover:text-green-700 font-medium">
                          Lihat {completedMissions.length - 3} misi lainnya →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {selectedTab === "badges" && (
            <motion.div
              key="badges"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Badge Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Badge Diraih</p>
                      <p className="text-3xl font-bold text-green-600">{achievedBadges.length}</p>
                    </div>
                    <IoMedal className="w-12 h-12 text-green-500" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Badge</p>
                      <p className="text-3xl font-bold text-gray-600">{user.badges.length}</p>
                    </div>
                    {/* Use RibbonOutline instead of Ribbon to avoid invalid element issues */}
                    <IoRibbonOutline className="w-12 h-12 text-gray-500" />
                  </div>
                </div>
              </div>

              {/* Achieved Badges */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">🏆 Badge yang Diraih</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {achievedBadges.map((badge) => (
                    <motion.div
                      key={badge.id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                      }}
                      onClick={() => handleBadgeClick(badge)}
                      className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-4 text-center cursor-pointer"
                    >
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <h3 className="font-bold text-sm text-gray-800 mb-1">{badge.name}</h3>
                      {badge.date && (
                        <p className="text-xs text-gray-500">
                          {new Date(badge.date).toLocaleDateString("id-ID")}
                        </p>
                      )}
                      <div className="mt-2">
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          ✓ Diraih
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Locked Badges */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">🔒 Badge Belum Terbuka</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {unlockedBadges.map((badge) => (
                    <motion.div
                      key={badge.id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleBadgeClick(badge)}
                      className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 text-center cursor-pointer opacity-60"
                    >
                      <div className="text-4xl mb-2 grayscale">{badge.icon}</div>
                      <h3 className="font-bold text-sm text-gray-600 mb-1">{badge.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {badge.requirement}
                      </p>
                      <div className="mt-2">
                        <span className="bg-gray-400 text-white text-xs px-2 py-1 rounded-full flex items-center justify-center">
                          <IoLockClosed className="w-3 h-3 mr-1" />
                          Terkunci
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === "leaderboard" && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">👑 Leaderboard Mingguan</h2>
                  <p className="text-yellow-100">Top performer minggu ini</p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {leaderboard.map((player: any, index: number) => (
                      <motion.div
                        key={player.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                          player.name === user.name
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                            index === 0 ? "bg-yellow-500" :
                            index === 1 ? "bg-gray-400" :
                            index === 2 ? "bg-orange-600" :
                            "bg-gray-300"
                          }`}>
                            {index < 3 ? (
                              index === 0 ? "🏆" : index === 1 ? "🥈" : "🥉"
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">
                              {player.name}
                              {player.name === user.name && " (Anda)"}
                            </p>
                            <p className="text-sm text-gray-600">Level {player.level}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{player.badge}</span>
                            <div>
                              <p className="font-bold text-green-600">{player.points}</p>
                              <p className="text-sm text-gray-500">poin</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {userRank > 5 && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-center text-blue-800">
                        Peringkat Anda: #{userRank} dengan {user.points} poin
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === "rewards" && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Points Summary */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center">
                  <PointsDisplay points={user.points} size="lg" />
                  <p className="text-gray-600 mt-2">Poin Anda saat ini</p>
                </div>
              </div>

              {/* Available Rewards */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">🎁 Reward Tersedia</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rewards.map((reward) => (
                    <motion.div
                      key={reward.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ 
                        scale: reward.available ? 1.05 : 1.02,
                        boxShadow: reward.available ? "0 10px 25px rgba(0,0,0,0.1)" : "none"
                      }}
                      className={`rounded-lg shadow-md overflow-hidden ${
                        reward.available 
                          ? "bg-white border-2 border-green-500" 
                          : "bg-gray-50 border-2 border-gray-200"
                      }`}
                    >
                      <div className={`p-6 text-center ${
                        reward.available ? "" : "opacity-60"
                      }`}>
                        <div className="text-5xl mb-4">{reward.icon}</div>
                        <h3 className="font-bold text-lg mb-2">{reward.name}</h3>
                        <p className="text-gray-600 text-sm mb-4">{reward.description}</p>
                        <div className="flex items-center justify-center space-x-2 mb-4">
                          <IoStar className="text-yellow-500" />
                          <span className="font-bold text-lg">{reward.points} poin</span>
                        </div>
                        
                        {reward.available ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowRewardModal(true)}
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                          >
                            Tukar Sekarang
                          </motion.button>
                        ) : (
                          <div className="w-full bg-gray-300 text-gray-600 py-2 px-4 rounded-lg font-medium flex items-center justify-center">
                            <IoLockClosed className="w-4 h-4 mr-2" />
                            Butuh {reward.points - user.points} poin lagi
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Reward History */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Riwayat Reward</h3>
                <div className="text-center py-8 text-gray-500">
                  <IoGift className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Belum ada reward yang ditukar</p>
                  <p className="text-sm">Kumpulkan lebih banyak poin untuk menukar reward!</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badge Detail Modal */}
        <Modal
          isOpen={showBadgeModal}
          onClose={() => {
            setShowBadgeModal(false);
            setSelectedBadge(null);
          }}
          title="Detail Badge"
          size="md"
        >
          {selectedBadge && (
            <div className="p-6 text-center">
              <div className={`text-8xl mb-4 ${selectedBadge.achieved ? "" : "grayscale"}`}>
                {selectedBadge.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedBadge.name}</h2>
              
              {selectedBadge.achieved ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800 font-medium mb-2">🎉 Badge Diraih!</p>
                  {/* Display the date badge was achieved only if provided. If `date` is undefined, avoid passing undefined to Date constructor which causes a type error. */}
                  <p className="text-sm text-green-600">
                    Diraih pada {selectedBadge.date ? new Date(selectedBadge.date).toLocaleDateString("id-ID") : "-"}
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-center mb-2">
                    <IoLockClosed className="w-5 h-5 text-gray-500 mr-2" />
                    <p className="text-gray-700 font-medium">Badge Belum Terbuka</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Syarat: {selectedBadge.requirement}
                  </p>
                </div>
              )}
              
              <div className="text-sm text-gray-500">
                <IoInformationCircle className="inline w-4 h-4 mr-1" />
                Badge memberikan prestise dan menunjukkan pencapaian Anda
              </div>
            </div>
          )}
        </Modal>

        {/* Reward Exchange Modal */}
        <Modal
          isOpen={showRewardModal}
          onClose={() => setShowRewardModal(false)}
          title="Konfirmasi Penukaran"
          size="md"
        >
          <div className="p-6 text-center">
            <div className="text-6xl mb-4">🎁</div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Tukar Reward?
            </h2>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menukar poin dengan reward ini?
              Poin yang sudah ditukar tidak dapat dikembalikan.
            </p>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowRewardModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowRewardModal(false);
                  // Here you would implement the actual reward exchange logic
                  showToast.success("Reward berhasil ditukar! Cek email untuk detail pengambilan.");
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Ya, Tukar
              </button>
            </div>
          </div>
        </Modal>
      </motion.main>
    </>
  );
}