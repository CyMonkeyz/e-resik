import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";

const jadwalDummy = [
  { id: 1, nama: "Budi", jenis: "Plastik", berat: 2, tanggal: "2025-08-01", status: "Menunggu" },
  { id: 2, nama: "Tika", jenis: "Organik", berat: 3, tanggal: "2025-08-01", status: "Selesai" },
  { id: 3, nama: "Dian", jenis: "Kertas", berat: 1, tanggal: "2025-08-02", status: "Dijemput" },
];

export default function JadwalPenjemputan() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">Jadwal Penjemputan</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Nama</th>
                <th className="px-4 py-2 text-left">Jenis</th>
                <th className="px-4 py-2 text-left">Berat (kg)</th>
                <th className="px-4 py-2 text-left">Tanggal</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {jadwalDummy.map(jadwal => (
                <motion.tr
                  key={jadwal.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: jadwal.id * 0.1 }}
                  className="border-b"
                >
                  <td className="px-4 py-2">{jadwal.nama}</td>
                  <td className="px-4 py-2">{jadwal.jenis}</td>
                  <td className="px-4 py-2">{jadwal.berat}</td>
                  <td className="px-4 py-2">{jadwal.tanggal}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold
                      ${jadwal.status === "Selesai" ? "bg-green-200 text-green-800"
                        : jadwal.status === "Dijemput" ? "bg-yellow-200 text-yellow-800"
                        : "bg-gray-200 text-gray-800"}
                    `}>{jadwal.status}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}