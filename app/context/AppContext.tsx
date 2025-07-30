import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { 
  userData as initialUserData, 
  missions as initialMissions,
  notifications as initialNotifications,
  requests as initialRequests,
  addRequest as addRequestToData,
  updateRequestStatus as updateRequestInData,
  addNotification as addNotificationToData,
  markNotificationRead as markNotificationReadInData,
  kpiData,
  registeredUsers,
  wasteStock,
  salesTransactions,
  leaderboard
} from "../utils/dummyData";

// Types
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  points: number;
  level: number;
  badges: Array<{
    id: number;
    name: string;
    icon: string;
    achieved: boolean;
    date?: string;
    requirement?: string;
  }>;
  statistics: {
    totalWaste: number;
    plasticWaste: number;
    paperWaste: number;
    organicWaste: number;
    metalWaste: number;
    otherWaste: number;
    co2Saved: number;
    treesEquivalent: number;
  };
}

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

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "success" | "info" | "achievement";
  read: boolean;
  createdAt: string;
}

interface Request {
  id: number;
  userId: number;
  userName: string;
  userAddress: string;
  userPhone: string;
  type: "pickup" | "deposit";
  wasteType: string;
  estimatedWeight: number;
  actualWeight?: number;
  scheduledDate: string;
  scheduledTime: string;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  notes: string;
  createdAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  points: number;
  photos: string[];
}

// Context Type
interface AppContextType {
  // User data
  user: User;
  updateUserPoints: (points: number) => void;
  updateUserStats: (category: string, weight: number) => void;
  awardBadge: (badgeId: number) => void;
  
  // Missions
  missions: Mission[];
  updateMissionProgress: (missionId: number, progress: number) => void;
  completeMission: (missionId: number) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "read" | "createdAt">) => void;
  markNotificationAsRead: (id: number) => void;
  markAllNotificationsAsRead: () => void;
  unreadCount: number;
  
  // Requests
  requests: Request[];
  addRequest: (request: Omit<Request, "id" | "createdAt" | "status" | "points" | "photos">) => void;
  updateRequestStatus: (id: number, status: Request["status"], additionalData?: Partial<Request>) => void;
  getUserRequests: (userId: number) => Request[];
  
  // Admin/Pengelola data
  kpiData: typeof kpiData;
  registeredUsers: typeof registeredUsers;
  wasteStock: typeof wasteStock;
  salesTransactions: typeof salesTransactions;
  leaderboard: typeof leaderboard;
  
  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider Component
export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(initialUserData);
  const [missions, setMissions] = useState<Mission[]>(initialMissions);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate unread notifications count
  const unreadCount = notifications.filter(n => !n.read).length;

  // User functions
  const updateUserPoints = (newPoints: number) => {
    setUser(prev => {
      const updatedPoints = prev.points + newPoints;
      const newLevel = Math.floor(updatedPoints / 100) + 1; // Level up every 100 points
      
      return {
        ...prev,
        points: updatedPoints,
        level: Math.max(newLevel, prev.level)
      };
    });
  };

  const updateUserStats = (category: string, weight: number) => {
    setUser(prev => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        totalWaste: prev.statistics.totalWaste + weight,
        [`${category}Waste`]: prev.statistics[`${category}Waste` as keyof typeof prev.statistics] + weight,
        co2Saved: prev.statistics.co2Saved + (weight * 0.5), // Rough calculation
        treesEquivalent: prev.statistics.treesEquivalent + (weight * 0.02)
      }
    }));
  };

  const awardBadge = (badgeId: number) => {
    setUser(prev => ({
      ...prev,
      badges: prev.badges.map(badge => 
        badge.id === badgeId 
          ? { ...badge, achieved: true, date: new Date().toISOString() }
          : badge
      )
    }));
  };

  // Mission functions
  const updateMissionProgress = (missionId: number, progress: number) => {
    setMissions(prev => prev.map(mission => 
      mission.id === missionId
        ? { ...mission, current: Math.min(progress, mission.target) }
        : mission
    ));
  };

  const completeMission = (missionId: number) => {
    setMissions(prev => prev.map(mission => {
      if (mission.id === missionId && !mission.completed) {
        // Award points for completing mission
        updateUserPoints(mission.points);
        
        // Add completion notification
        addNotification({
          title: "Misi Selesai! 🎉",
          message: `Selamat! Anda telah menyelesaikan "${mission.title}" dan mendapat ${mission.points} poin!`,
          type: "achievement"
        });
        
        return { ...mission, completed: true, current: mission.target };
      }
      return mission;
    }));
  };

  // Notification functions
  const addNotification = (notification: Omit<Notification, "id" | "read" | "createdAt">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(), // Simple ID generation
      read: false,
      createdAt: new Date().toISOString()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  // Request functions
  const addRequest = (requestData: Omit<Request, "id" | "createdAt" | "status" | "points" | "photos">) => {
    const newRequest: Request = {
      ...requestData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: "pending",
      points: 0,
      photos: []
    };
    
    setRequests(prev => [newRequest, ...prev]);
    
    // Add notification for successful request submission
    addNotification({
      title: "Permintaan Berhasil Dikirim",
      message: `Permintaan ${requestData.type === "pickup" ? "penjemputan" : "setoran"} sampah ${requestData.wasteType} telah dikirim. Menunggu konfirmasi pengelola.`,
      type: "info"
    });
    
    return newRequest;
  };

  const updateRequestStatus = (id: number, status: Request["status"], additionalData: Partial<Request> = {}) => {
    setRequests(prev => prev.map(request => {
      if (request.id === id) {
        const updatedRequest = {
          ...request,
          status,
          ...additionalData,
          verifiedAt: status === "completed" ? new Date().toISOString() : request.verifiedAt
        };

        // Award points and update stats when request is completed
        if (status === "completed" && request.status !== "completed") {
          const weight = additionalData.actualWeight || request.estimatedWeight;
          const pointsPerKg = getPointsPerKg(request.wasteType);
          const earnedPoints = Math.round(weight * pointsPerKg);
          
          // Update user points and stats
          updateUserPoints(earnedPoints);
          updateUserStats(request.wasteType, weight);
          
          // Add completion notification
          addNotification({
            title: "Setoran Dikonfirmasi! ✅",
            message: `Setoran ${weight}kg ${request.wasteType} Anda telah dikonfirmasi. Anda mendapat ${earnedPoints} poin!`,
            type: "success"
          });

          // Check for mission progress
          checkMissionProgress(request.wasteType, weight);
          
          updatedRequest.points = earnedPoints;
        }
        
        return updatedRequest;
      }
      return request;
    }));
  };

  const getUserRequests = (userId: number) => {
    return requests.filter(request => request.userId === userId);
  };

  // Helper function to get points per kg for waste type
  const getPointsPerKg = (wasteType: string): number => {
    const pointsMap: { [key: string]: number } = {
      plastik: 10,
      kertas: 8,
      organik: 5,
      logam: 15,
      kaca: 12
    };
    return pointsMap[wasteType] || 5;
  };

  // Check and update mission progress
  const checkMissionProgress = (wasteType: string, weight: number) => {
    missions.forEach(mission => {
      if (mission.category === wasteType && !mission.completed) {
        const newProgress = mission.current + weight;
        updateMissionProgress(mission.id, newProgress);
        
        if (newProgress >= mission.target) {
          completeMission(mission.id);
        }
      }
    });
  };

  // Auto-check for badge achievements
  useEffect(() => {
    const checkBadgeAchievements = () => {
      // Check for points-based badges
      if (user.points >= 100 && !user.badges.find(b => b.id === 3)?.achieved) {
        awardBadge(3); // Pahlawan Daur Ulang
      }
      
      // Check for mission completion badges
      const completedMissions = missions.filter(m => m.completed).length;
      if (completedMissions >= 5 && !user.badges.find(b => b.id === 4)?.achieved) {
        awardBadge(4); // Eco Warrior
      }
    };

    checkBadgeAchievements();
  }, [user.points, missions]);

  const contextValue: AppContextType = {
    user,
    updateUserPoints,
    updateUserStats,
    awardBadge,
    missions,
    updateMissionProgress,
    completeMission,
    notifications,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadCount,
    requests,
    addRequest,
    updateRequestStatus,
    getUserRequests,
    kpiData,
    registeredUsers,
    wasteStock,
    salesTransactions,
    leaderboard,
    isLoading,
    setIsLoading
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

// Toast notification context (using react-toastify)
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

// Utility functions for toast notifications
export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast.info(message),
  warning: (message: string) => toast.warning(message)
};
