export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    timezone?: string;
  };
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  frequency: 'daily' | 'weekly';
  targetDays?: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface HabitLog {
  id: string;
  habitId: string;
  userId: string;
  date: Date;
  completed: boolean;
  notes?: string;
  createdAt: Date;
}

export interface UserStats {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  completionRate: number;
  lastCompletedDate?: Date;
}
