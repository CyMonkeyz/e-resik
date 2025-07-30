// app/context/AppContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { 
  userData as initialUserData, 
  missions as initialMissions,
  notifications as initialNotifications,
  requests as initialRequests,
  kpiData,
  registeredUsers,
  wasteStock,
  salesTransactions,
  leaderboard
} from "../utils/dummyData";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- TYPES ---
export interface Badge {
  id: number; name: string; icon: string; achieved: boolean; date?: string; requirement?: string;
}
export interface User {
  id: number; name: string; email: string; phone: string; address: string; points: number; level: number; badges: Badge[];
  statistics: { totalWaste: number; plasticWaste: number; paperWaste: number; organicWaste: number; metalWaste: number; otherWaste: number; co2Saved: number; treesEquivalent: number; };
}
export interface Mission {
  id: number; title: string; description: string; target: number; current: number; unit: string; points: number; completed: boolean; deadline: string; category: string;
}
export interface Request {
  id: number; userId: number; userName: string; userAddress: string; userPhone: string; type: "pickup" | "deposit"; wasteType: string; estimatedWeight: number; actualWeight: number | null; scheduledDate: string; scheduledTime: string; status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"; notes: string; createdAt: string; verifiedAt: string | null; verifiedBy: string | null; points: number; photos: string[];
}
export interface WasteStock {
  id: number; category: string; weight: number; unit: string; pricePerKg: number; totalValue: number; lastUpdated: string; status: "ready_to_sell" | "processing" | "processed";
}
export interface SalesTransaction {
  id: number; date: string; category: string; weight: number; pricePerKg: number; totalAmount: number; buyer: string; status: "completed" | "pending";
}


interface AppContextType {
  user: User;
  missions: Mission[];
  notifications: Notification[];
  requests: Request[];
  kpiData: typeof kpiData;
  wasteStock: WasteStock[];
  salesTransactions: SalesTransaction[];
  leaderboard: typeof leaderboard;
  unreadCount: number;
  addRequest: (requestData: any) => void;
  updateRequestStatus: (id: number, status: Request["status"], additionalData?: Partial<Request>) => void;
  getUserRequests: (userId: number) => Request[];
  completeMission: (missionId: number) => void;
  markNotificationAsRead: (id: number) => void;
  markAllNotificationsAsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- PROVIDER ---
export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(initialUserData);
  const [missions, setMissions] = useState<Mission[]>(initialMissions);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [requests, setRequests] = useState<Request[]>(initialRequests);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, "id" | "read" | "createdAt">) => {
    const newNotification: Notification = { ...notification, id: Date.now(), read: false, createdAt: new Date().toISOString() };
    setNotifications(prev => [newNotification, ...prev]);
  };
  
  const updateUserPoints = (points: number) => {
    setUser(prev => ({...prev, points: prev.points + points}));
  };

  const completeMission = (missionId: number) => {
    setMissions(prev => prev.map(m => {
        if (m.id === missionId && !m.completed) {
            updateUserPoints(m.points);
            addNotification({
                title: "Misi Selesai!",
                message: `Anda menyelesaikan "${m.title}" & dapat ${m.points} poin!`,
                type: "achievement"
            });
            return { ...m, completed: true, current: m.target };
        }
        return m;
    }));
  };
  
  const addRequest = (requestData: any) => {
    const newRequest: Request = { ...requestData, id: Date.now(), createdAt: new Date().toISOString(), status: "pending", points: 0, photos: [] };
    setRequests(prev => [newRequest, ...prev]);
    addNotification({ title: "Permintaan Terkirim", message: `Permintaan ${requestData.type} sampah ${requestData.wasteType} berhasil dikirim.`, type: "info" });
  };
  
  const updateRequestStatus = (id: number, status: Request["status"], additionalData: Partial<Request> = {}) => {
    setRequests(prev => prev.map(req => {
        if (req.id === id) {
            const updated = { ...req, status, ...additionalData, verifiedAt: new Date().toISOString() };
            if (status === 'completed' && req.status !== 'completed') {
                const weight = updated.actualWeight || updated.estimatedWeight;
                const points = weight * 10; // Simple point calculation
                updateUserPoints(points);
                addNotification({ title: "Setoran Dikonfirmasi!", message: `Setoran ${weight}kg ${updated.wasteType} dikonfirmasi. +${points} poin!`, type: "success" });
                updated.points = points;
            }
            return updated;
        }
        return req;
    }));
  };

  const getUserRequests = (userId: number) => requests.filter(r => r.userId === userId);
  const markNotificationAsRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllNotificationsAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const contextValue: AppContextType = {
    user, missions, notifications, requests, kpiData, wasteStock, salesTransactions, leaderboard, unreadCount,
    addRequest, updateRequestStatus, getUserRequests, completeMission, markNotificationAsRead, markAllNotificationsAsRead
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
    </AppContext.Provider>
  );
}

// --- HOOK & UTILS ---
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error("useApp must be used within an AppProvider");
  return context;
}

export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast.info(message),
  warning: (message: string) => toast.warning(message),
};

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "success" | "achievement" | "warning" | "error";
  read: boolean;
  createdAt: string;
}
