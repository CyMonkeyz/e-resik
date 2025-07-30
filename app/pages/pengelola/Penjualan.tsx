// app/pages/pengelola/Penjualan.tsx
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import { useApp, showToast } from "../../context/AppContext";
import Button from "../../components/Button";
import { Modal } from "../../components/Modal";
import { 
  IoAddCircle,
  IoCash,
  IoReceipt,
  IoArrowUp,
  IoArrowDown,
  IoStatsChart,
  IoCalendarOutline,
  IoScaleOutline,
  IoBusinessOutline
} from "react-icons/io5";

// Definisikan tipe data untuk transaksi penjualan jika belum ada di AppContext
type SalesTransaction = {
  id: number;
  date: string;
  category: string;
  weight: number;
  pricePerKg: number;
  totalAmount: number;
  buyer: string;
  status: "completed" | "pending";
};

export default function Penjualan() {
  const { salesTransactions, wasteStock } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof SalesTransaction; direction: string } | null>({ key: 'date', direction: 'descending' });
  
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    category: "",
    weight: "",
    pricePerKg: "",
    buyer: ""
  });

  // Calculate stats
  const totalRevenue = salesTransactions.reduce((sum, tx) => sum + tx.totalAmount, 0);
  const totalWeightSold = salesTransactions.reduce((sum, tx) => sum + tx.weight, 0);
  const avgPrice = totalRevenue / totalWeightSold || 0;

  // Memoized sorting for performance
  const sortedTransactions = useMemo(() => {
    let sortableItems = [...salesTransactions];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [salesTransactions, sortConfig]);

  const handleSort = (key: keyof SalesTransaction) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { category, weight, pricePerKg, buyer, date } = form;

    if (!category || !weight || !pricePerKg || !buyer || !date) {
      showToast.error("Semua field harus diisi.");
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

    // In a real app, you would call a function from your context to add the transaction
    console.log("New Sale:", {
      ...form,
      weight: parseFloat(weight),
      pricePerKg: parseFloat(pricePerKg),
      totalAmount: parseFloat(weight) * parseFloat(pricePerKg)
    });

    showToast.success("Transaksi penjualan berhasil dicatat!");
    setIsSubmitting(false);
    setIsModalOpen(false);
    // Reset form after submission
    setForm({ date: new Date().toISOString().split('T')[0], category: "", weight: "", pricePerKg: "", buyer: "" });
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
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manajemen Penjualan</h1>
            <p className="text-gray-600 mt-2">
              Catat dan pantau semua transaksi penjualan sampah.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} icon={<IoAddCircle />} className="mt-4 md:mt-0">
            Catat Penjualan Baru
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <IoCash className="text-3xl text-green-500 mb-2" />
            <p className="text-sm font-medium text-gray-500">Total Pendapatan</p>
            <p className="text-2xl font-bold text-gray-800">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <IoReceipt className="text-3xl text-blue-500 mb-2" />
            <p className="text-sm font-medium text-gray-500">Total Transaksi</p>
            <p className="text-2xl font-bold text-gray-800">{salesTransactions.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <IoStatsChart className="text-3xl text-purple-500 mb-2" />
            <p className="text-sm font-medium text-gray-500">Harga Jual Rata-rata</p>
            <p className="text-2xl font-bold text-gray-800">
              Rp {avgPrice.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} / kg
            </p>
          </div>
        </motion.div>

        {/* Sales History Table */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800">Riwayat Transaksi</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {/* Table Headers */}
                  <th onClick={() => handleSort('date')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Tanggal</th>
                  <th onClick={() => handleSort('category')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Kategori</th>
                  <th onClick={() => handleSort('weight')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Berat</th>
                  <th onClick={() => handleSort('pricePerKg')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Harga/kg</th>
                  <th onClick={() => handleSort('totalAmount')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Total</th>
                  <th onClick={() => handleSort('buyer')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Pembeli</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedTransactions.map((tx) => (
                  <motion.tr key={tx.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(tx.date).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.weight} kg</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {tx.pricePerKg.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">Rp {tx.totalAmount.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.buyer}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.main>

      {/* Add Sale Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Catat Transaksi Penjualan Baru">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tanggal Transaksi</label>
            <input type="date" value={form.date} onChange={e => handleInputChange('date', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-lg"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Kategori Sampah</label>
            <select value={form.category} onChange={e => handleInputChange('category', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-lg">
              <option value="">Pilih Kategori</option>
              {wasteStock.filter(s => s.status === 'ready_to_sell').map(s => (
                <option key={s.id} value={s.category}>{s.category} (Stok: {s.weight} kg)</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Berat (kg)</label>
              <input type="number" step="0.1" placeholder="cth: 150.5" value={form.weight} onChange={e => handleInputChange('weight', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-lg"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Harga per kg (Rp)</label>
              <input type="number" placeholder="cth: 2000" value={form.pricePerKg} onChange={e => handleInputChange('pricePerKg', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-lg"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Pembeli</label>
            <input type="text" placeholder="cth: PT Daur Ulang Mandiri" value={form.buyer} onChange={e => handleInputChange('buyer', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-lg"/>
          </div>
          <div className="pt-4">
            <Button type="submit" loading={isSubmitting} className="w-full">
              Simpan Transaksi
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
