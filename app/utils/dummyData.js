// app/utils/dummyData.js - Complete dummy data for e-Resik prototype

// User data for masyarakat
export const userData = {
  id: 1,
  name: "Wildan Lucu",
  email: "budi@email.com",
  phone: "08123456789",
  address: "Jl. Merdeka No. 123, Jakarta",
  points: 120,
  level: 2,
  badges: [
    { id: 1, name: "Pemilah Sampah Pemula", icon: "🗂️", achieved: true, date: "2025-01-15" },
    { id: 2, name: "Setoran Rutin", icon: "📅", achieved: true, date: "2025-01-20" },
    { id: 3, name: "Pahlawan Daur Ulang", icon: "♻️", achieved: false, requirement: "Kumpulkan 50kg sampah" },
    { id: 4, name: "Eco Warrior", icon: "🌱", achieved: false, requirement: "Selesaikan 20 misi" },
    { id: 5, name: "Community Leader", icon: "👑", achieved: false, requirement: "Ajak 10 warga baru" }
  ],
  statistics: {
    totalWaste: 45.5, // kg
    plasticWaste: 18.2,
    paperWaste: 12.3,
    organicWaste: 10.5,
    metalWaste: 2.8,
    otherWaste: 1.7,
    co2Saved: 23.4, // kg CO2
    treesEquivalent: 1.2
  }
};

// Weekly missions for masyarakat
export const missions = [
  { 
    id: 1, 
    title: "Kumpulkan 5 kg plastik", 
    description: "Kumpulkan botol plastik, kemasan makanan, dan plastik lainnya",
    target: 5,
    current: 5,
    unit: "kg",
    points: 50,
    completed: true,
    deadline: "2025-08-07",
    category: "plastik"
  },
  { 
    id: 2, 
    title: "Daur ulang 10 botol kaca", 
    description: "Kumpulkan botol kaca bekas minuman atau makanan",
    target: 10,
    current: 6,
    unit: "botol",
    points: 30,
    completed: false,
    deadline: "2025-08-07",
    category: "kaca"
  },
  { 
    id: 3, 
    title: "Setor sampah organik 3kg", 
    description: "Kumpulkan sisa makanan, daun, dan sampah organik lainnya",
    target: 3,
    current: 1.5,
    unit: "kg",
    points: 40,
    completed: false,
    deadline: "2025-08-07",
    category: "organik"
  },
  { 
    id: 4, 
    title: "Ajak 2 tetangga bergabung", 
    description: "Undang tetangga untuk ikut program e-Resik",
    target: 2,
    current: 0,
    unit: "orang",
    points: 100,
    completed: false,
    deadline: "2025-08-07",
    category: "komunitas"
  }
];

// Educational content
const educationalContent = [
  {
    id: "1",
    title: "Cara Memilah Sampah Plastik",
    description: "Pelajari cara memilah sampah plastik yang benar",
    thumbnail: "/images/education/plastic-sorting.jpg",
    duration: "5 menit",
    category: "Dasar"
  },
  {
    id: "2", 
    title: "Manfaat Daur Ulang untuk Lingkungan",
    description: "Memahami dampak positif daur ulang",
    thumbnail: "/images/education/recycling-benefits.jpg",
    duration: "8 menit",
    category: "Lingkungan"
  },
  {
    id: "3",
    title: "Kreasi dari Barang Bekas",
    description: "Tutorial membuat kerajinan dari sampah",
    thumbnail: "/images/education/diy-crafts.jpg", 
    duration: "12 menit",
    category: "Kreativitas"
  },
  {
    id: "4",
    title: "Kompos dari Sampah Organik",
    description: "Cara membuat kompos di rumah",
    thumbnail: "/images/education/composting.jpg",
    duration: "15 menit", 
    category: "Organik"
  }
];


// Pickup/deposit requests (shared between masyarakat and pengelola)
export let requests = [
  {
    id: 1,
    userId: 1,
    userName: "Wildan Lucu",
    userAddress: "Jl. Merdeka No. 123",
    userPhone: "08123456789",
    type: "pickup", // "pickup" or "deposit"
    wasteType: "plastik",
    estimatedWeight: 3,
    actualWeight: null,
    scheduledDate: "2025-08-01",
    scheduledTime: "08:00",
    status: "pending", // "pending", "confirmed", "in_progress", "completed", "cancelled"
    notes: "Botol plastik dan kemasan makanan",
    createdAt: "2025-07-30T10:30:00Z",
    verifiedAt: null,
    verifiedBy: null,
    points: 0,
    photos: []
  },
  {
    id: 2,
    userId: 2,
    userName: "Amdadur Ganteng",
    userAddress: "Jl. Sudirman No. 456",
    userPhone: "08234567890",
    type: "pickup",
    wasteType: "organik",
    estimatedWeight: 5,
    actualWeight: 4.5,
    scheduledDate: "2025-08-01",
    scheduledTime: "10:00",
    status: "completed",
    notes: "Sisa sayuran dan buah-buahan",
    createdAt: "2025-07-29T14:20:00Z",
    verifiedAt: "2025-08-01T10:30:00Z",
    verifiedBy: "Pengelola A",
    points: 45,
    photos: ["/api/placeholder/200/150"]
  },
  {
    id: 3,
    userId: 3,
    userName: "Rohman Menggemaskan",
    userAddress: "Jl. Gatot Subroto No. 789",
    userPhone: "08345678901",
    type: "deposit",
    wasteType: "kertas",
    estimatedWeight: 2,
    actualWeight: 1.8,
    scheduledDate: "2025-08-02",
    scheduledTime: "14:00",
    status: "in_progress",
    notes: "Kertas koran dan kardus bekas",
    createdAt: "2025-07-30T09:15:00Z",
    verifiedAt: null,
    verifiedBy: null,
    points: 0,
    photos: []
  }
];

// Leaderboard data
export const leaderboard = [
  { id: 1, name: "Amdadur Ganteng", points: 180, level: 3, badge: "♻️" },
  { id: 2, name: "Rohman Menggemaskan", points: 165, level: 2, badge: "🌱" },
  { id: 3, name: "Wildan Lucu", points: 120, level: 2, badge: "📅" },
  { id: 4, name: "Dewi Lestari", points: 95, level: 1, badge: "🗂️" },
  { id: 5, name: "Eko Prasetyo", points: 78, level: 1, badge: "🗂️" }
];

// Notifications for masyarakat
export let notifications = [
  {
    id: 1,
    title: "Setoran Berhasil Dikonfirmasi!",
    message: "Setoran 4.5kg sampah organik Anda telah dikonfirmasi. +45 poin!",
    type: "success",
    read: false,
    createdAt: "2025-08-01T10:30:00Z"
  },
  {
    id: 2,
    title: "Misi Mingguan Selesai!",
    message: "Selamat! Anda telah menyelesaikan misi 'Kumpulkan 5kg plastik'. +50 poin!",
    type: "achievement",
    read: false,
    createdAt: "2025-07-31T16:20:00Z"
  },
  {
    id: 3,
    title: "Penjemputan Dijadwalkan",
    message: "Penjemputan sampah Anda dijadwalkan besok jam 08:00. Harap disiapkan.",
    type: "info",
    read: true,
    createdAt: "2025-07-30T18:45:00Z"
  }
];

// KPI data for pengelola dashboard
export const kpiData = {
  totalWasteCollected: 1250, // kg this month
  monthlyTarget: 1500, // kg
  activeUsers: 45,
  newUsersThisWeek: 8,
  completedPickups: 156,
  totalPickups: 164,
  revenue: 2500000, // IDR from waste sales
  wasteByCategory: {
    plastik: 450, // kg
    kertas: 320,
    organik: 280,
    logam: 120,
    kaca: 80
  },
  monthlyTrend: [
    { month: "Jan", waste: 980, revenue: 1950000 },
    { month: "Feb", waste: 1120, revenue: 2240000 },
    { month: "Mar", waste: 1050, revenue: 2100000 },
    { month: "Apr", waste: 1280, revenue: 2560000 },
    { month: "May", waste: 1180, revenue: 2360000 },
    { month: "Jun", waste: 1320, revenue: 2640000 },
    { month: "Jul", waste: 1250, revenue: 2500000 }
  ]
};

// Registered users data for pengelola
export const registeredUsers = [
  {
    id: 1,
    name: "Wildan Lucu",
    email: "budi@email.com",
    phone: "08123456789",
    address: "Jl. Merdeka No. 123",
    registeredAt: "2025-01-15",
    totalWaste: 45.5,
    totalPoints: 120,
    level: 2,
    status: "active",
    lastActivity: "2025-07-30"
  },
  {
    id: 2,
    name: "Amdadur Ganteng",
    email: "siti@email.com",
    phone: "08234567890",
    address: "Jl. Sudirman No. 456",
    registeredAt: "2025-01-10",
    totalWaste: 62.3,
    totalPoints: 180,
    level: 3,
    status: "active",
    lastActivity: "2025-08-01"
  },
  {
    id: 3,
    name: "Rohman Menggemaskan",
    email: "ahmad@email.com",
    phone: "08345678901",
    address: "Jl. Gatot Subroto No. 789",
    registeredAt: "2025-01-20",
    totalWaste: 58.1,
    totalPoints: 165,
    level: 2,
    status: "active",
    lastActivity: "2025-08-02"
  }
];

// Waste stock data for pengelola
export const wasteStock = [
  {
    id: 1,
    category: "Plastik",
    weight: 245.5,
    unit: "kg",
    pricePerKg: 2000,
    totalValue: 491000,
    lastUpdated: "2025-08-02",
    status: "ready_to_sell"
  },
  {
    id: 2,
    category: "Kertas",
    weight: 180.2,
    unit: "kg",
    pricePerKg: 1500,
    totalValue: 270300,
    lastUpdated: "2025-08-02",
    status: "processing"
  },
  {
    id: 3,
    category: "Logam",
    weight: 45.8,
    unit: "kg",
    pricePerKg: 8000,
    totalValue: 366400,
    lastUpdated: "2025-08-01",
    status: "ready_to_sell"
  },
  {
    id: 4,
    category: "Organik",
    weight: 0,
    unit: "kg",
    pricePerKg: 500,
    totalValue: 0,
    lastUpdated: "2025-08-02",
    status: "processed" // Already processed into compost
  }
];

// Sales transactions for pengelola
export const salesTransactions = [
  {
    id: 1,
    date: "2025-07-28",
    category: "Plastik",
    weight: 150,
    pricePerKg: 2000,
    totalAmount: 300000,
    buyer: "PT Daur Ulang Mandiri",
    status: "completed"
  },
  {
    id: 2,
    date: "2025-07-25",
    category: "Logam",
    weight: 25,
    pricePerKg: 8000,
    totalAmount: 200000,
    buyer: "CV Logam Jaya",
    status: "completed"
  },
  {
    id: 3,
    date: "2025-07-20",
    category: "Kertas",
    weight: 200,
    pricePerKg: 1500,
    totalAmount: 300000,
    buyer: "Paper Recycling Co",
    status: "completed"
  }
];

// Helper functions for manipulating data
export const addRequest = (newRequest) => {
  const id = Math.max(...requests.map(r => r.id)) + 1;
  const request = {
    ...newRequest,
    id,
    createdAt: new Date().toISOString(),
    status: "pending",
    actualWeight: null,
    verifiedAt: null,
    verifiedBy: null,
    points: 0,
    photos: []
  };
  requests.push(request);
  return request;
};

export const updateRequestStatus = (requestId, status, additionalData = {}) => {
  const index = requests.findIndex(r => r.id === requestId);
  if (index !== -1) {
    requests[index] = {
      ...requests[index],
      status,
      ...additionalData,
      verifiedAt: status === "completed" ? new Date().toISOString() : requests[index].verifiedAt
    };
    return requests[index];
  }
  return null;
};

export const addNotification = (notification) => {
  const id = Math.max(...notifications.map(n => n.id)) + 1;
  const newNotif = {
    ...notification,
    id,
    read: false,
    createdAt: new Date().toISOString()
  };
  notifications.unshift(newNotif);
  return newNotif;
};

export const markNotificationRead = (notificationId) => {
  const index = notifications.findIndex(n => n.id === notificationId);
  if (index !== -1) {
    notifications[index].read = true;
  }
};

// Waste categories configuration
export const wasteCategories = [
  {
    id: "plastik",
    name: "Plastik",
    icon: "🥤",
    color: "bg-blue-500",
    description: "Botol plastik, kemasan makanan, kantong plastik",
    pointsPerKg: 10
  },
  {
    id: "kertas",
    name: "Kertas",
    icon: "📄",
    color: "bg-yellow-500",
    description: "Koran, kardus, kertas tulis bekas",
    pointsPerKg: 8
  },
  {
    id: "organik",
    name: "Organik",
    icon: "🥬",
    color: "bg-green-500",
    description: "Sisa makanan, daun, sampah dapur",
    pointsPerKg: 5
  },
  {
    id: "logam",
    name: "Logam",
    icon: "🔩",
    color: "bg-gray-500",
    description: "Kaleng, aluminium, besi bekas",
    pointsPerKg: 15
  },
  {
    id: "kaca",
    name: "Kaca",
    icon: "🍾",
    color: "bg-purple-500",
    description: "Botol kaca, pecahan kaca",
    pointsPerKg: 12
  }
];