// app/utils/types.ts
export interface LeaderboardPlayer {
  id: string;
  name: string;
  points: number;
  level: number;
  badge: string;
  rank?: number;
  isUser?: boolean;
}

export interface Reward {
  id: number;
  name: string;
  points: number;
  description: string;
  icon: string;
  available: boolean;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  tip: string;
}

export interface EducationalContent {
  id: number;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  type: "video" | "article";
  url: string;
}

// Form constraints
export const FORM_CONSTRAINTS = {
  WEIGHT: {
    MIN: 0.1,
    MAX: 100
  },
  SERVICE_HOURS: {
    START: "07:00" as const,
    END: "17:00" as const
  },
  ADVANCE_BOOKING_HOURS: 24
} as const;

// Utility function for safe date parsing
export const safeDateParse = (dateString: string | Date | undefined): Date | null => {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    console.warn('Invalid date:', dateString);
    return null;
  }
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 500); // Limit length
};