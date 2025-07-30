import { motion } from "framer-motion";

interface CardStatProps {
  label: string;
  value: string | number;
  color?: string;
}

export default function CardStat({ label, value, color = "text-green-700" }: CardStatProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white p-4 rounded shadow text-center"
    >
      <div className="text-gray-500">{label}</div>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
    </motion.div>
  );
}