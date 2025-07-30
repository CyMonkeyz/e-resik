import CountUp from "react-countup";
import { motion } from "framer-motion";

interface PointsDisplayProps {
  points: number;
  previousPoints?: number;
  showAnimation?: boolean;
  size?: "sm" | "md" | "lg";
}

export function PointsDisplay({ points, previousPoints = 0, showAnimation = true, size = "md" }: PointsDisplayProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl"
  };

  return (
    <motion.div
      initial={showAnimation ? { scale: 0.8, opacity: 0 } : {}}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="flex items-center gap-2"
    >
      <span className="text-yellow-500">⭐</span>
      <span className={`font-bold text-green-700 ${sizeClasses[size]}`}>
        {showAnimation ? (
          <CountUp start={previousPoints} end={points} duration={1} />
        ) : (
          points
        )}
      </span>
      <span className="text-sm text-gray-500">poin</span>
    </motion.div>
  );
}