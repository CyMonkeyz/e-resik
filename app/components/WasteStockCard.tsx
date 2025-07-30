interface WasteStock {
  id: number;
  category: string;
  weight: number;
  unit: string;
  pricePerKg: number;
  totalValue: number;
  lastUpdated: string;
  status: "ready_to_sell" | "processing" | "processed";
}

interface WasteStockCardProps {
  stock: WasteStock;
}

export function WasteStockCard({ stock }: WasteStockCardProps) {
  const statusConfig = {
    ready_to_sell: { label: "Siap Jual", color: "bg-green-100 text-green-800" },
    processing: { label: "Diproses", color: "bg-yellow-100 text-yellow-800" },
    processed: { label: "Sudah Diproses", color: "bg-gray-100 text-gray-800" }
  };

  const categoryIcons = {
    Plastik: "🥤",
    Kertas: "📄",
    Organik: "🥬",
    Logam: "🔩",
    Kaca: "🍾"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-md p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">
            {categoryIcons[stock.category as keyof typeof categoryIcons] || "📦"}
          </span>
          <h3 className="font-semibold">{stock.category}</h3>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${statusConfig[stock.status].color}`}>
          {statusConfig[stock.status].label}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Berat:</span>
          <span className="font-medium">{stock.weight} {stock.unit}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Harga/kg:</span>
          <span className="font-medium">Rp {stock.pricePerKg.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between border-t pt-2">
          <span className="text-gray-600">Total Nilai:</span>
          <span className="font-bold text-green-600">
            Rp {stock.totalValue.toLocaleString("id-ID")}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          Update terakhir: {new Date(stock.lastUpdated).toLocaleDateString("id-ID")}
        </div>
      </div>
    </motion.div>
  );
}