
export enum AppSection {
  DASHBOARD = 'DASHBOARD',
  MESSAGES = 'MESSAGES',
  UTILITIES = 'UTILITIES',
  RECYCLING = 'RECYCLING',
  PROFILE = 'PROFILE'
}

export interface UserProfile {
  name: string;
  address: string;
  postalCode: string;
  city: string;
}

export interface Message {
  id: string;
  sender: string;
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface ConsumptionData {
  date: string;
  value: number;
}

export interface WasteSchedule {
  type: string;
  nextDate: string;
  status: 'upcoming' | 'today' | 'done';
}

export interface UtilityStatus {
  electricity: {
    currentUsage: number;
    dailyData: ConsumptionData[];
    provider: string;
  };
  water: {
    currentUsage: number;
    dailyData: ConsumptionData[];
    provider: string;
  };
  waste: WasteSchedule[];
}
