import { motion } from "framer-motion";
import { IoCheckmarkCircle, IoTimeOutline } from "react-icons/io5";

interface Mission {
  id: number;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  points: number;
  completed: boolean;
  deadline: string;
  category: string;
}

interface MissionCardProps {
  mission: Mission;
  index: number;
}

export function MissionCard({ mission, index }: MissionCardProps) {
  const progress = (mission.current / mission.target) * 100;
  const isCompleted = mission.completed;

  const categoryColors = {
    plastik: "bg-blue-100 text-blue-800",
    kertas: "bg-yellow-100 text-yellow-800",
    organik: "bg-green-100 text-green-800",
    logam: "bg-gray-100 text-gray-800",
    kaca: "bg-purple-100 text-purple-800",
    komunitas: "bg-pink-100 text-pink-800"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
      className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
        isCompleted ? "border-green-500 bg-green-50" : "border-gray-300"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold ${isCompleted ? "text-green-800" : "text-gray-800"}`}>
              {mission.title}
            </h3>
            {isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <IoCheckmarkCircle className="text-green-500 text-xl" />
              </motion.div>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">{mission.description}</p>
          
          <div className="flex items-center gap-2 text-xs">
            <span className={`px-2 py-1 rounded-full ${categoryColors[mission.category as keyof typeof categoryColors] || categoryColors.organik}`}>
              {mission.category}
            </span>
            <span className="flex items-center gap-1 text-gray-500">
              <IoTimeOutline />
              {mission.deadline}
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm font-medium text-green-600">
            +{mission.points} poin
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress: {mission.current}/{mission.target} {mission.unit}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 1, delay: index * 0.1 }}
            className={`h-2 rounded-full ${
              isCompleted ? "bg-green-500" : progress > 70 ? "bg-yellow-500" : "bg-blue-500"
            }`}
          />
        </div>
      </div>
    </motion.div>
  );
}
