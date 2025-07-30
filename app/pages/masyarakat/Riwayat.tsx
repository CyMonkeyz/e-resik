// app/pages/masyarakat/Riwayat.tsx - Complete history page
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar";
import { StatusBadge } from "../../components/StatusBadge";
import { Modal } from "../../components/Modal";
import { useApp, type Request } from "../../context/AppContext";
import { 
  IoCalendar, 
  IoFilter, 
  IoSearch, 
  IoDownload, 
  IoEye,
  IoCheckmarkCircle,
  IoTime,
  IoClose,
  IoRefresh
} from "react-icons/io5";

export default function Riwayat() {
  const { user, getUserRequests } = useApp();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const userRequests = getUserRequests(user.id);

  // Filter and search logic
  const filteredRequests = userRequests.filter(request => {
    // Filter by status
    if (selectedFilter !== "all" && request.status !== selectedFilter) {
      return false;
    }

    // Search by waste type or notes
    if (searchTerm && !request.wasteType.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !request.notes.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Filter by date range
    if (dateRange.start && new Date(request.createdAt) < new Date(dateRange.start)) {
      return false;
    }
    if (dateRange.end && new Date(request.createdAt) > new Date(dateRange.end)) {
      return false;
    }

    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Statistics
  const stats = {
    total: userRequests.length,
    completed: userRequests.filter(r => r.status === "completed").length,
    pending: userRequests.filter(r => r.status === "pending").length,
    cancelled: userRequests.filter(r => r.status === "cancelled").length,
    totalWeight: userRequests
      .filter(r => r.status === "completed")
      .reduce((sum, r) => sum + (r.actualWeight || r.estimatedWeight), 0),
    totalPoints: userRequests
      .filter(r => r.status === "completed")
      .reduce((sum, r) => sum + r.points, 0)
  };

  const filters = [
    { id: "all", label: "Semua", count: stats.total },
    { id: "completed", label: "Selesai", count: stats.completed },
    { id: "pending", label: "Menunggu", count: stats.pending },
    { id: "in_progress", label: "Diproses", count: userRequests.filter(r => r.status === "in_progress").length },
    { id: "cancelled", label: "Dibatalkan", count: stats.cancelled }
  ];

  const handleViewDetail = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return "✅";
      case "pending": return "⏳";
      case "in_progress": return "🔄";
      case "cancelled": return "❌";
      default: return "📋";
    }
  };

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
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">📋 Riwayat Setoran</h1>
                <p className="text-blue-100">
                  Pantau semua aktivitas setoran sampah Anda
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 md:mt-0">
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.completed}</p>
                  <p className="text-xs text-blue-100">Selesai</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.totalWeight.toFixed(1)}kg</p>
                  <p className="text-xs text-blue-100">Total Berat</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Permintaan</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-600">Berhasil</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalWeight.toFixed(1)}kg</div>
              <div className="text-sm text-gray-600">Total Berat</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.totalPoints}</div>
              <div className="text-sm text-gray-600">Total Poin</div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <IoFilter className="w-5 h-5 mr-2" />
                Filter & Pencarian
              </h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari
                </label>
                <div className="relative">
                  <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari jenis sampah..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="space-y-2">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                        selectedFilter === filter.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <span className="text-sm">{filter.label}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedFilter === filter.id
                          ? "bg-white bg-opacity-20"
                          : "bg-gray-200"
                      }`}>
                        {filter.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rentang Tanggal
                </label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Reset Filters */}
              <button
                onClick={() => {
                  setSelectedFilter("all");
                  setSearchTerm("");
                  setDateRange({ start: "", end: "" });
                }}
                className="w-full p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center"
              >
                <IoRefresh className="w-4 h-4 mr-2" />
                Reset Filter
              </button>

              {/* Export Button */}
              <button className="w-full mt-4 p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center">
                <IoDownload className="w-4 h-4 mr-2" />
                Export Data
              </button>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800">
                    Daftar Setoran ({filteredRequests.length})
                  </h2>
                  <div className="text-sm text-gray-500">
                    Menampilkan {filteredRequests.length} dari {userRequests.length} data
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jenis
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Berat
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Poin
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <AnimatePresence>
                      {filteredRequests.length > 0 ? (
                        filteredRequests.map((request, index) => (
                          <motion.tr
                            key={request.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div>
                                <div className="font-medium">
                                  {new Date(request.createdAt).toLocaleDateString("id-ID")}
                                </div>
                                <div className="text-gray-500 text-xs">
                                  {new Date(request.createdAt).toLocaleTimeString("id-ID", {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center">
                                <span className="mr-2">
                                  {request.type === "pickup" ? "🚚" : "📦"}
                                </span>
                                <div>
                                  <div className="font-medium capitalize">{request.wasteType}</div>
                                  <div className="text-gray-500 text-xs">
                                    {request.type === "pickup" ? "Penjemputan" : "Setoran"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div>
                                <div className="font-mono">
                                  {request.actualWeight || request.estimatedWeight} kg
                                </div>
                                {request.actualWeight && request.actualWeight !== request.estimatedWeight && (
                                  <div className="text-xs text-gray-500">
                                    Est: {request.estimatedWeight} kg
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={request.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {request.status === "completed" ? (
                                <span className="font-bold text-green-600">
                                  +{request.points}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                onClick={() => handleViewDetail(request)}
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                              >
                                <IoEye className="w-4 h-4 mr-1" />
                                Detail
                              </button>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center">
                            <div className="text-gray-500">
                              <IoCalendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                              <p className="text-lg font-medium mb-2">Tidak ada data</p>
                              <p className="text-sm">
                                {searchTerm || selectedFilter !== "all" || dateRange.start || dateRange.end
                                  ? "Tidak ada data yang sesuai dengan filter"
                                  : "Belum ada setoran yang dilakukan"
                                }
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredRequests.length > 10 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Menampilkan 1-{Math.min(10, filteredRequests.length)} dari {filteredRequests.length} hasil
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                        Sebelumnya
                      </button>
                      <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                        Selanjutnya
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Detail Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedRequest(null);
          }}
          title="Detail Setoran"
          size="lg"
        >
          {selectedRequest && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      {getStatusIcon(selectedRequest.status)}
                      <span className="ml-2">Informasi Umum</span>
                    </h3>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">ID Permintaan</p>
                        <p className="font-mono text-sm">#REQ-{selectedRequest.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <StatusBadge status={selectedRequest.status} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Jenis Layanan</p>
                        <p className="font-medium capitalize">
                          {selectedRequest.type === "pickup" ? "🚚 Penjemputan" : "📦 Antar Sendiri"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Kategori Sampah</p>
                        <p className="font-medium capitalize">{selectedRequest.wasteType}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-3">Detail Berat</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Perkiraan:</span>
                        <span className="font-mono">{selectedRequest.estimatedWeight} kg</span>
                      </div>
                      {selectedRequest.actualWeight && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Aktual:</span>
                          <span className="font-mono font-bold">
                            {selectedRequest.actualWeight} kg
                          </span>
                        </div>
                      )}
                      {selectedRequest.status === "completed" && (
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-gray-600">Poin Earned:</span>
                          <span className="font-bold text-green-600">
                            +{selectedRequest.points} poin
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timeline & Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <IoTime className="w-5 h-5 mr-2 text-blue-600" />
                      Timeline
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <IoCalendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Permintaan Dibuat</p>
                        <p className="text-sm text-gray-600">
                          {new Date(selectedRequest.createdAt).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>

                    {selectedRequest.scheduledDate && (
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <IoTime className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Dijadwalkan</p>
                          <p className="text-sm text-gray-600">
                            {new Date(selectedRequest.scheduledDate).toLocaleDateString("id-ID")} 
                            {selectedRequest.scheduledTime && ` pada ${selectedRequest.scheduledTime}`}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedRequest.status === "completed" && selectedRequest.verifiedAt && (
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <IoCheckmarkCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-green-800">Selesai Diverifikasi</p>
                          <p className="text-sm text-gray-600">
                            {new Date(selectedRequest.verifiedAt).toLocaleString("id-ID")}
                          </p>
                          {selectedRequest.verifiedBy && (
                            <p className="text-xs text-gray-500">
                              Oleh: {selectedRequest.verifiedBy}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedRequest.status === "cancelled" && (
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <IoClose className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-red-800">Dibatalkan</p>
                          <p className="text-sm text-gray-600">
                            Permintaan dibatalkan
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {selectedRequest.notes && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">Catatan</h4>
                      <p className="text-sm text-gray-700">{selectedRequest.notes}</p>
                    </div>
                  )}

                  {/* Photos */}
                  {selectedRequest.photos && selectedRequest.photos.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-3">Foto Verifikasi</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedRequest.photos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`Verifikasi ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">Informasi Kontak</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-blue-600">Nama:</span> {selectedRequest.userName}</p>
                      <p><span className="text-blue-600">Alamat:</span> {selectedRequest.userAddress}</p>
                      <p><span className="text-blue-600">Telepon:</span> {selectedRequest.userPhone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                {selectedRequest.status === "pending" && (
                  <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                    Batalkan Permintaan
                  </button>
                )}
                <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                  Cetak Detail
                </button>
                <button 
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedRequest(null);
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </Modal>
      </motion.main>
    </>
  );
}