// app/pages/pengelola/Verifikasi.tsx
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar";
import { Modal } from "../../components/Modal";
import Button from "../../components/Button";
import { StatusBadge } from "../../components/StatusBadge";
import { useApp, showToast, type Request } from "../../context/AppContext";
import { 
  IoCheckmarkCircle, 
  IoCloseCircle, 
  IoScale, 
  IoDocumentText,
  IoPerson,
  IoCall,
  IoHome,
  IoTime,
  IoCalendar,
  IoFilter,
  IoSearch
} from "react-icons/io5";

export default function Verifikasi() {
  const { requests, updateRequestStatus } = useApp();
  
  // State for filtering and sorting
  const [filters, setFilters] = useState({ status: "pending", type: "all" });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Request; direction: string } | null>({ key: 'scheduledDate', direction: 'ascending' });

  // State for modal and verification form
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationData, setVerificationData] = useState({
    actualWeight: "",
    notes: "",
  });

  // Memoized filtering and sorting for performance
  const filteredAndSortedRequests = useMemo(() => {
    let filtered = requests.filter(req => {
      const statusMatch = filters.status === "all" || req.status === filters.status;
      const typeMatch = filters.type === "all" || req.type === filters.type;
      const searchMatch = searchTerm === "" || 
        req.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.wasteType.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && typeMatch && searchMatch;
    });

    if (sortConfig !== null) {
      const { key, direction } = sortConfig;
      filtered.sort((a, b) => {
        const aVal = (a as any)[key];
        const bVal = (b as any)[key];
        if (aVal < bVal) {
          return direction === 'ascending' ? -1 : 1;
        }
        if (aVal > bVal) {
          return direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [requests, filters, searchTerm, sortConfig]);

  // Handlers
  const handleFilterChange = (filterType: 'status' | 'type', value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleSort = (key: keyof Request) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const handleOpenModal = (request: Request) => {
    setSelectedRequest(request);
    setVerificationData({
      actualWeight: request.estimatedWeight.toString(),
      notes: ""
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleVerificationChange = (field: 'actualWeight' | 'notes', value: string) => {
    setVerificationData(prev => ({ ...prev, [field]: value }));
  };

  const handleVerificationSubmit = async (newStatus: "completed" | "cancelled") => {
    if (!selectedRequest) return;

    const weight = parseFloat(verificationData.actualWeight);
    if (newStatus === 'completed' && (isNaN(weight) || weight <= 0)) {
      showToast.error("Berat aktual harus angka positif.");
      return;
    }
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

    try {
      updateRequestStatus(selectedRequest.id, newStatus, {
        actualWeight: weight,
        notes: verificationData.notes,
        verifiedBy: "Admin E-Resik" // Should be dynamic in a real app
      });
      showToast.success(`Permintaan #${selectedRequest.id} berhasil diupdate.`);
      handleCloseModal();
    } catch (error) {
      showToast.error("Gagal memverifikasi permintaan.");
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="text-3xl font-bold text-gray-800">Verifikasi Setoran</h1>
          <p className="text-gray-600 mt-2">
            Kelola dan verifikasi permintaan setoran atau penjemputan dari masyarakat.
          </p>
        </motion.div>

        {/* Filter and Search Section */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select 
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Semua</option>
                <option value="pending">Menunggu</option>
                <option value="confirmed">Dikonfirmasi</option>
                <option value="in_progress">Diproses</option>
                <option value="completed">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Tipe Layanan</label>
              <select 
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Semua</option>
                <option value="pickup">Penjemputan</option>
                <option value="deposit">Setoran</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Cari</label>
              <div className="relative mt-1">
                <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Cari nama atau jenis sampah..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Requests Table */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {/* Table Headers */}
                  <th onClick={() => handleSort('userName')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Nama</th>
                  <th onClick={() => handleSort('type')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Tipe</th>
                  <th onClick={() => handleSort('wasteType')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Jenis Sampah</th>
                  <th onClick={() => handleSort('estimatedWeight')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Estimasi Berat</th>
                  <th onClick={() => handleSort('scheduledDate')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Jadwal</th>
                  <th onClick={() => handleSort('status')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredAndSortedRequests.map((request) => (
                    <motion.tr 
                      key={request.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.userName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{request.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{request.wasteType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.estimatedWeight} kg</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.scheduledDate).toLocaleDateString("id-ID")} {request.scheduledTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button size="sm" onClick={() => handleOpenModal(request)}>
                          Verifikasi
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {filteredAndSortedRequests.length === 0 && (
              <div className="text-center p-8 text-gray-500">
                Tidak ada permintaan yang cocok dengan filter.
              </div>
            )}
          </div>
        </motion.div>
      </motion.main>

      {/* Verification Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Detail & Verifikasi Permintaan" size="lg">
        {selectedRequest && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* User Info */}
              <div className="space-y-3">
                <div className="flex items-center"><IoPerson className="mr-2 text-gray-500" /><span>{selectedRequest.userName}</span></div>
                <div className="flex items-center"><IoHome className="mr-2 text-gray-500" /><span>{selectedRequest.userAddress}</span></div>
                <div className="flex items-center"><IoCall className="mr-2 text-gray-500" /><span>{selectedRequest.userPhone}</span></div>
              </div>
              {/* Request Info */}
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center"><IoCalendar className="mr-2 text-gray-500" /><span>{new Date(selectedRequest.scheduledDate).toLocaleDateString("id-ID")}</span></div>
                <div className="flex items-center"><IoTime className="mr-2 text-gray-500" /><span>{selectedRequest.scheduledTime}</span></div>
                <p className="text-sm text-gray-600"><strong>Catatan:</strong> {selectedRequest.notes || "-"}</p>
              </div>
            </div>
            
            <hr className="my-6"/>
            
            {/* Verification Form */}
            <h3 className="text-lg font-semibold mb-4">Formulir Verifikasi</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Berat Aktual (kg)</label>
                <div className="relative mt-1">
                  <IoScale className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="number"
                    step="0.1"
                    value={verificationData.actualWeight}
                    onChange={(e) => handleVerificationChange('actualWeight', e.target.value)}
                    className="w-full pl-10 p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Catatan Pengelola</label>
                <textarea 
                  rows={3}
                  value={verificationData.notes}
                  onChange={(e) => handleVerificationChange('notes', e.target.value)}
                  placeholder="Contoh: Berat aktual setelah ditimbang ulang"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button 
                variant="danger" 
                onClick={() => handleVerificationSubmit('cancelled')}
                loading={isSubmitting}
                icon={<IoCloseCircle />}
                className="flex-1"
              >
                Tolak Permintaan
              </Button>
              <Button 
                variant="success" 
                onClick={() => handleVerificationSubmit('completed')}
                loading={isSubmitting}
                icon={<IoCheckmarkCircle />}
                className="flex-1"
              >
                Setujui & Selesaikan
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
