import { Habit, HabitLog } from './types';

const HABITS_KEY = 'habits_db';
const LOGS_KEY = 'habit_logs_db';
const CURRENT_USER_ID = 'default-user';

export const habitStorage = {
  // Habits
  getAllHabits: (): Habit[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(HABITS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getHabit: (id: string): Habit | null => {
    const habits = habitStorage.getAllHabits();
    return habits.find((h) => h.id === id) || null;
  },

  createHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>): Habit => {
    const newHabit: Habit = {
      ...habit,
      id: `habit-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const habits = habitStorage.getAllHabits();
    habits.push(newHabit);
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    return newHabit;
  },

  updateHabit: (id: string, updates: Partial<Habit>): Habit | null => {
    const habits = habitStorage.getAllHabits();
    const index = habits.findIndex((h) => h.id === id);
    if (index === -1) return null;
    habits[index] = { ...habits[index], ...updates, updatedAt: new Date() };
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    return habits[index];
  },

  deleteHabit: (id: string): boolean => {
    const habits = habitStorage.getAllHabits().filter((h) => h.id !== id);
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    // Also remove associated logs
    const logs = habitStorage.getAllLogs().filter((l) => l.habitId !== id);
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    return true;
  },

  // Logs
  getAllLogs: (): HabitLog[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getLogsByHabit: (habitId: string): HabitLog[] => {
    return habitStorage.getAllLogs().filter((log) => log.habitId === habitId);
  },

  getLogByDate: (habitId: string, date: Date): HabitLog | null => {
    const dateStr = date.toISOString().split('T')[0];
    const logs = habitStorage.getLogsByHabit(habitId);
    return logs.find((log) => log.date.toString().split('T')[0] === dateStr) || null;
  },

  logCompletion: (habitId: string, date: Date, completed: boolean, notes?: string): HabitLog => {
    const existingLog = habitStorage.getLogByDate(habitId, date);
    if (existingLog) {
      return habitStorage.updateLog(existingLog.id, { completed, notes }) || existingLog;
    }

    const newLog: HabitLog = {
      id: `log-${Date.now()}`,
      habitId,
      userId: CURRENT_USER_ID,
      date,
      completed,
      notes,
      createdAt: new Date(),
    };
    const logs = habitStorage.getAllLogs();
    logs.push(newLog);
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    return newLog;
  },

  updateLog: (id: string, updates: Partial<HabitLog>): HabitLog | null => {
    const logs = habitStorage.getAllLogs();
    const index = logs.findIndex((l) => l.id === id);
    if (index === -1) return null;
    logs[index] = { ...logs[index], ...updates };
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    return logs[index];
  },

  deleteLog: (id: string): boolean => {
    const logs = habitStorage.getAllLogs().filter((l) => l.id !== id);
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    return true;
  },
};

export const calculateStats = (habitId: string) => {
  const logs = habitStorage.getLogsByHabit(habitId);
  const completedLogs = logs.filter((l) => l.completed);

  const totalCompleted = completedLogs.length;
  const completionRate = logs.length > 0 ? (totalCompleted / logs.length) * 100 : 0;

  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (const log of sortedLogs) {
    if (log.completed) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  // Current streak (from today backwards)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let checkDate = new Date(today);
  for (let i = 0; i < 365; i++) {
    const log = logs.find((l) => {
      const logDate = new Date(l.date);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === checkDate.getTime();
    });

    if (log?.completed) {
      currentStreak++;
    } else {
      break;
    }
    checkDate.setDate(checkDate.getDate() - 1);
  }

  const lastCompletedDate = completedLogs.length > 0 
    ? new Date(completedLogs[completedLogs.length - 1].date) 
    : undefined;

  return {
    habitId,
    currentStreak,
    longestStreak,
    totalCompleted,
    completionRate,
    lastCompletedDate,
  };
};
