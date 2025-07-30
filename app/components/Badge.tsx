import { motion } from "framer-motion";

interface BadgeProps {
  label: string;
  achieved?: boolean;
}

export default function Badge({ label, achieved = false }: BadgeProps) {
  return (
    <motion.span
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 350, damping: 15 }}
      whileHover={{ scale: 1.1 }}
      className={`inline-block px-3 py-1 mr-2 mb-2 rounded-full text-xs font-semibold
        ${achieved ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600 opacity-60"}
      `}
    >
      {label}
    </motion.span>
  );
}