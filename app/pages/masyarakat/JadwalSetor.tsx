// app/pages/masyarakat/JadwalSetor.tsx - Enhanced jadwal setor with better UX
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import Navbar from "../../components/Navbar";
import Button from "../../components/Button";
import { Modal } from "../../components/Modal";
import { StatusBadge } from "../../components/StatusBadge";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useApp, showToast, type Request } from "../../context/AppContext";
import { wasteCategories } from "../../utils/dummyData";
import { IoCalendar, IoScale, IoInformationCircle, IoTrash, IoAdd, IoTime, IoLocation, IoCall, IoCheckmarkCircle } from "react-icons/io5";

export default function JadwalSetor() {
  const { user, addRequest, getUserRequests } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [form, setForm] = useState({
    type: "pickup" as "pickup" | "deposit",
    wasteType: "",
    estimatedWeight: "",
    scheduledDate: "",
    scheduledTime: "",
    notes: ""
  });

  const userRequests = getUserRequests(user.id);
  const pendingRequests = userRequests.filter(r => r.status === "pending");
  const recentRequests = userRequests.slice(0, 5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.wasteType || !form.estimatedWeight || !form.scheduledDate || !form.scheduledTime) {
      showToast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    const weight = parseFloat(form.estimatedWeight);
    if (weight <= 0 || weight > 100) {
      showToast.error("Berat sampah harus antara 0.1 - 100 kg");
      return;
    }

    // Check if scheduled date is not in the past
    const scheduledDateTime = new Date(`${form.scheduledDate}T${form.scheduledTime}`);
    const now = new Date();
    if (scheduledDateTime < now) {
      showToast.error("Tanggal dan waktu tidak boleh di masa lalu");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      addRequest({
        userId: user.id,
        userName: user.name,
        userAddress: user.address,
        userPhone: user.phone,
        type: form.type,
        wasteType: form.wasteType,
        estimatedWeight: weight,
        scheduledDate: form.scheduledDate,
        scheduledTime: form.scheduledTime,
        notes: form.notes
      });

      showToast.success(
        `Permintaan ${form.type === "pickup" ? "penjemputan" : "setoran"} berhasil dikirim!`
      );

      // Reset form
      setForm({
        type: "pickup",
        wasteType: "",
        estimatedWeight: "",
        scheduledDate: "",
        scheduledTime: "",
        notes: ""
      });
      
    } catch (error) {
      showToast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMinTime = () => {
    const now = new Date();
    const selectedDate = new Date(form.scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate.getTime() === today.getTime()) {
      // If today, minimum time is current time + 2 hours
      now.setHours(now.getHours() + 2);
      return now.toTimeString().slice(0, 5);
    }
    return "07:00"; // Default minimum time for future dates
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
        className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                📅 Jadwal Setor Sampah
              </h1>
              <p className="text-gray-600">
                Jadwalkan penjemputan atau atur waktu setoran sampah Anda
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-green-100 px-4 py-2 rounded-lg">
                <p className="text-sm text-green-700">Permintaan Tertunda</p>
                <p className="text-2xl font-bold text-green-800">{pendingRequests.length}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            {/* Request Form */}
            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Buat Permintaan Baru</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Jenis Layanan <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        form.type === "pickup"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                      onClick={() => handleInputChange("type", "pickup")}
                    >
                      <div className="flex items-center space-x-3">
                        <IoLocation className="text-green-600 text-xl" />
                        <div>
                          <h3 className="font-medium">Penjemputan</h3>
                          <p className="text-sm text-gray-600">Kami jemput di rumah Anda</p>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        form.type === "deposit"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                      onClick={() => handleInputChange("type", "deposit")}
                    >
                      <div className="flex items-center space-x-3">
                        <IoAdd className="text-green-600 text-xl" />
                        <div>
                          <h3 className="font-medium">Antar Sendiri</h3>
                          <p className="text-sm text-gray-600">Antar ke titik pengumpulan</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Waste Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Jenis Sampah <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {wasteCategories.map((category: any) => (
                      <motion.div
                        key={category.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          form.wasteType === category.id
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                        onClick={() => handleInputChange("wasteType", category.id)}
                      >
                        <div className="text-center">
                          <span className="text-2xl mb-2 block">{category.icon}</span>
                          <h3 className="font-medium text-sm">{category.name}</h3>
                          <p className="text-xs text-green-600">+{category.pointsPerKg} poin/kg</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Weight */}
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                    Perkiraan Berat (kg) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <IoScale className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      id="weight"
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="100"
                      placeholder="Contoh: 2.5"
                      value={form.estimatedWeight}
                      onChange={(e) => handleInputChange("estimatedWeight", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimal 0.1 kg, maksimal 100 kg</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Date */}
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <IoCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        id="date"
                        type="date"
                        min={getMinDate()}
                        value={form.scheduledDate}
                        onChange={(e) => handleInputChange("scheduledDate", e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Time */}
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                      Waktu <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <IoTime className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        id="time"
                        type="time"
                        min={form.scheduledDate ? getMinTime() : "07:00"}
                        max="17:00"
                        value={form.scheduledTime}
                        onChange={(e) => handleInputChange("scheduledTime", e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Layanan tersedia 07:00 - 17:00</p>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan Tambahan
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    placeholder="Contoh: Sampah sudah dipilah dan dibersihkan"
                    value={form.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <IoInformationCircle className="mr-2" />
                    <span>Permintaan akan diproses dalam 1x24 jam</span>
                  </div>
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    icon={isSubmitting ? null : <IoCheckmarkCircle />}
                    size="lg"
                  >
                    {isSubmitting ? "Mengirim..." : "Kirim Permintaan"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Right Column - Info & Recent Requests */}
          <div className="space-y-6">
            {/* Quick Info */}
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-green-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
              <h3 className="text-lg font-bold mb-4">📋 Info Penting</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <span className="text-green-200">•</span>
                  <span>Pastikan sampah sudah dipilah dengan benar</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-200">•</span>
                  <span>Bersihkan sampah dari sisa makanan</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-200">•</span>
                  <span>Siapkan sampah di tempat yang mudah dijangkau</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-200">•</span>
                  <span>Pastikan ada yang menunggu saat penjemputan</span>
                </div>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📞 Kontak Darurat</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <IoCall className="text-green-600" />
                  <div>
                    <p className="font-medium">Call Center</p>
                    <p className="text-sm text-gray-600">0800-1-RESIK</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <IoCall className="text-blue-600" />
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-sm text-gray-600">+62 811-2345-6789</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  Hubungi kami jika ada masalah dengan penjemputan atau butuh bantuan
                </p>
              </div>
            </motion.div>

            {/* Recent Requests */}
            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">📋 Permintaan Terbaru</h3>
                <Link 
                  to="/masyarakat/riwayat"
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Lihat Semua →
                </Link>
              </div>
              <div className="space-y-3">
                {recentRequests.length > 0 ? (
                  recentRequests.map((request) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowModal(true);
                      }}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm capitalize">
                          {request.type === "pickup" ? "🚚" : "📦"} {request.wasteType}
                        </p>
                        <p className="text-xs text-gray-600">
                          {request.estimatedWeight}kg • {new Date(request.scheduledDate).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                      <StatusBadge status={request.status} size="sm" />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <IoTrash className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Belum ada permintaan</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Request Detail Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedRequest(null);
          }}
          title="Detail Permintaan"
          size="md"
        >
          {selectedRequest && (
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {selectedRequest.type === "pickup" ? "🚚 Penjemputan" : "📦 Setoran"} 
                    <span className="capitalize ml-2">{selectedRequest.wasteType}</span>
                  </h3>
                  <StatusBadge status={selectedRequest.status} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Berat</p>
                    <p className="font-medium">{selectedRequest.estimatedWeight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tanggal</p>
                    <p className="font-medium">
                      {new Date(selectedRequest.scheduledDate).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Waktu</p>
                    <p className="font-medium">{selectedRequest.scheduledTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Dibuat</p>
                    <p className="font-medium">
                      {new Date(selectedRequest.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
                
                {selectedRequest.notes && (
                  <div>
                    <p className="text-sm text-gray-600">Catatan</p>
                    <p className="font-medium">{selectedRequest.notes}</p>
                  </div>
                )}
                
                {selectedRequest.status === "completed" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">✅ Selesai!</p>
                    <p className="text-sm text-green-600">
                      Anda mendapat {selectedRequest.points} poin dari setoran ini
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>
      </motion.main>
    </>
  );
}