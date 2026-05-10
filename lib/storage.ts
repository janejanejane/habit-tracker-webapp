/**
 * Habit Tracker Storage Module
 *
 * This module provides a complete localStorage-based data persistence layer for the Habit Tracker application.
 * It handles CRUD operations for habits and habit completion logs, along with statistical calculations
 * for tracking user progress and streaks.
 *
 * @module storage
 * @description Local storage utilities for habit tracking data persistence and statistics
 *
 * @features
 * - Habit CRUD operations (Create, Read, Update, Delete)
 * - Habit completion logging with timestamps
 * - Streak calculation (current and longest)
 * - Completion rate statistics
 * - Browser localStorage integration with SSR safety
 * - Automatic ID generation and timestamp management
 *
 * @dependencies
 * - Requires browser environment for localStorage access
 * - Imports Habit and HabitLog types from './types'
 *
 * @limitations
 * - Data persists only in browser localStorage (no server sync)
 * - No data validation beyond TypeScript types
 * - Single user support (CURRENT_USER_ID hardcoded)
 *
 * @example
 * ```typescript
 * import { habitStorage, calculateStats } from './lib/storage';
 *
 * // Create a new habit
 * const habit = habitStorage.createHabit({
 *   userId: "user-123",
 *   name: "Morning Exercise",
 *   color: "#3B82F6",
 *   icon: "🏃",
 *   frequency: "daily",
 *   isActive: true
 * });
 *
 * // Log completion
 * habitStorage.logCompletion(habit.id, new Date(), true, "Great workout!");
 *
 * // Get statistics
 * const stats = calculateStats(habit.id);
 * console.log(`Current streak: ${stats.currentStreak} days`);
 * ```
 */

import { Habit, HabitLog } from './types';

/**
 * localStorage key for storing habits data
 * @constant {string}
 */
const HABITS_KEY = 'habits_db';

/**
 * localStorage key for storing habit completion logs
 * @constant {string}
 */
const LOGS_KEY = 'habit_logs_db';

/**
 * Default user ID for single-user local storage implementation
 * @constant {string}
 */
const CURRENT_USER_ID = 'default-user';

/**
 * Habit Storage API
 *
 * A comprehensive object providing CRUD operations for habits and habit logs,
 * with automatic localStorage persistence and ID generation.
 *
 * @namespace habitStorage
 * @property {Function} getAllHabits - Retrieve all habits from storage
 * @property {Function} getHabit - Get a specific habit by ID
 * @property {Function} createHabit - Create a new habit with auto-generated ID
 * @property {Function} updateHabit - Update an existing habit
 * @property {Function} deleteHabit - Delete a habit and its associated logs
 * @property {Function} getAllLogs - Retrieve all habit completion logs
 * @property {Function} getLogsByHabit - Get logs for a specific habit
 * @property {Function} getLogByDate - Find a log entry for a specific date
 * @property {Function} logCompletion - Record or update habit completion
 * @property {Function} updateLog - Update an existing log entry
 * @property {Function} deleteLog - Delete a log entry
 */
export const habitStorage = {
  // Habits
  /**
   * Retrieves all habits from localStorage
   *
   * @function getAllHabits
   * @returns {Habit[]} Array of all stored habits, empty array if none exist or in SSR
   *
   * @sideEffects
   * - Reads from browser localStorage
   * - Returns empty array if window is undefined (SSR safety)
   *
   * @example
   * ```typescript
   * const habits = habitStorage.getAllHabits();
   * console.log(`Found ${habits.length} habits`);
   * ```
   */
  getAllHabits: (): Habit[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(HABITS_KEY);
    if (!data) return [];

    const habits = JSON.parse(data);
    return habits.map((habit: any) => ({
      ...habit,
      createdAt: new Date(habit.createdAt),
      updatedAt: new Date(habit.updatedAt),
    }));
  },

  /**
   * Retrieves a specific habit by its ID
   *
   * @function getHabit
   * @param {string} id - The unique identifier of the habit
   * @returns {Habit | null} The habit object if found, null otherwise
   *
   * @sideEffects
   * - Reads from localStorage via getAllHabits()
   *
   * @example
   * ```typescript
   * const habit = habitStorage.getHabit("habit-123");
   * if (habit) {
   *   console.log(`Found habit: ${habit.name}`);
   * }
   * ```
   */
  getHabit: (id: string): Habit | null => {
    const habits = habitStorage.getAllHabits();
    return habits.find((h) => h.id === id) || null;
  },

  /**
   * Creates a new habit with auto-generated ID and timestamps
   *
   * @function createHabit
   * @param {Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>} habit - Habit data without system fields
   * @returns {Habit} The complete habit object with generated ID and timestamps
   *
   * @sideEffects
   * - Generates unique ID using timestamp: `habit-${Date.now()}`
   * - Sets createdAt and updatedAt to current date
   * - Persists to localStorage
   *
   * @example
   * ```typescript
   * const newHabit = habitStorage.createHabit({
   *   userId: "user-123",
   *   name: "Read for 30 minutes",
   *   description: "Daily reading habit",
   *   color: "#10B981",
   *   icon: "📚",
   *   frequency: "daily",
   *   isActive: true
   * });
   * console.log(`Created habit with ID: ${newHabit.id}`);
   * ```
   */
  createHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>): Habit => {
    const newHabit: Habit = {
      ...habit,
      id: `habit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const habits = habitStorage.getAllHabits();
    habits.push(newHabit);
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    return newHabit;
  },

  /**
   * Updates an existing habit with partial data
   *
   * @function updateHabit
   * @param {string} id - The ID of the habit to update
   * @param {Partial<Habit>} updates - Partial habit data to apply
   * @returns {Habit | null} The updated habit object, or null if habit not found
   *
   * @sideEffects
   * - Automatically updates the updatedAt timestamp
   * - Persists changes to localStorage
   *
   * @example
   * ```typescript
   * const updated = habitStorage.updateHabit("habit-123", {
   *   name: "Updated Habit Name",
   *   isActive: false
   * });
   * if (updated) {
   *   console.log(`Updated at: ${updated.updatedAt}`);
   * }
   * ```
   */
  updateHabit: (id: string, updates: Partial<Habit>): Habit | null => {
    const habits = habitStorage.getAllHabits();
    const index = habits.findIndex((h) => h.id === id);
    if (index === -1) return null;
    habits[index] = { ...habits[index], ...updates, updatedAt: new Date() };
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    return habits[index];
  },

  /**
   * Deletes a habit and all its associated completion logs
   *
   * @function deleteHabit
   * @param {string} id - The ID of the habit to delete
   * @returns {boolean} Always returns true (successful deletion)
   *
   * @sideEffects
   * - Removes habit from localStorage
   * - Cascading delete: removes all habit logs with matching habitId
   * - Persists changes to both HABITS_KEY and LOGS_KEY
   *
   * @example
   * ```typescript
   * habitStorage.deleteHabit("habit-123");
   * console.log("Habit and all its logs deleted");
   * ```
   */
  deleteHabit: (id: string): boolean => {
    const habits = habitStorage.getAllHabits().filter((h) => h.id !== id);
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    // Also remove associated logs
    const logs = habitStorage.getAllLogs().filter((l) => l.habitId !== id);
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    return true;
  },

  // Logs
  /**
   * Retrieves all habit completion logs from localStorage
   *
   * @function getAllLogs
   * @returns {HabitLog[]} Array of all stored habit logs, empty array if none exist or in SSR
   *
   * @sideEffects
   * - Reads from browser localStorage
   * - Returns empty array if window is undefined (SSR safety)
   *
   * @example
   * ```typescript
   * const allLogs = habitStorage.getAllLogs();
   * console.log(`Total completion logs: ${allLogs.length}`);
   * ```
   */
  getAllLogs: (): HabitLog[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(LOGS_KEY);
    if (!data) return [];
    
    const logs = JSON.parse(data);
    return logs.map((log: any) => ({
      ...log,
      date: new Date(log.date),
      createdAt: new Date(log.createdAt),
    }));
  },

  /**
   * Retrieves all completion logs for a specific habit
   *
   * @function getLogsByHabit
   * @param {string} habitId - The ID of the habit to get logs for
   * @returns {HabitLog[]} Array of log entries for the specified habit
   *
   * @sideEffects
   * - Reads from localStorage via getAllLogs()
   *
   * @example
   * ```typescript
   * const habitLogs = habitStorage.getLogsByHabit("habit-123");
   * const completedDays = habitLogs.filter(log => log.completed).length;
   * console.log(`Habit completed ${completedDays} times`);
   * ```
   */
  getLogsByHabit: (habitId: string): HabitLog[] => {
    return habitStorage.getAllLogs().filter((log) => log.habitId === habitId);
  },

  /**
   * Finds a specific log entry for a habit on a given date
   *
   * @function getLogByDate
   * @param {string} habitId - The ID of the habit
   * @param {Date} date - The date to search for (time portion ignored)
   * @returns {HabitLog | null} The log entry if found, null otherwise
   *
   * @sideEffects
   * - Compares dates by YYYY-MM-DD format (ignores time)
   * - Reads from localStorage via getLogsByHabit()
   *
   * @example
   * ```typescript
   * const today = new Date();
   * const todaysLog = habitStorage.getLogByDate("habit-123", today);
   * if (todaysLog?.completed) {
   *   console.log("Habit completed today!");
   * }
   * ```
   */
  getLogByDate: (habitId: string, date: Date): HabitLog | null => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    const logs = habitStorage.getLogsByHabit(habitId);
    return logs.find(log => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === targetDate.getTime();
    }) || null;
  },

  /**
   * Records or updates a habit completion for a specific date
   *
   * @function logCompletion
   * @param {string} habitId - The ID of the habit being logged
   * @param {Date} date - The date of the completion attempt
   * @param {boolean} completed - Whether the habit was completed
   * @param {string} [notes] - Optional notes about the completion
   * @returns {HabitLog} The created or updated log entry
   *
   * @sideEffects
   * - If log exists for date: updates existing log
   * - If no log exists: creates new log with auto-generated ID
   * - Persists changes to localStorage
   * - Uses CURRENT_USER_ID for new logs
   *
   * @example
   * ```typescript
   * // Mark habit as completed today
   * const log = habitStorage.logCompletion(
   *   "habit-123",
   *   new Date(),
   *   true,
   *   "Great progress today!"
   * );
   * console.log(`Logged completion: ${log.id}`);
   *
   * // Mark as incomplete (useful for corrections)
   * habitStorage.logCompletion("habit-123", new Date(), false);
   * ```
   */
  logCompletion: (habitId: string, date: Date, completed: boolean, notes?: string): HabitLog => {
    const existingLog = habitStorage.getLogByDate(habitId, date);
    if (existingLog) {
      return habitStorage.updateLog(existingLog.id, { completed, notes }) || existingLog;
    }

    const newLog: HabitLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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

  /**
   * Updates an existing habit completion log
   *
   * @function updateLog
   * @param {string} id - The ID of the log entry to update
   * @param {Partial<HabitLog>} updates - Partial log data to apply
   * @returns {HabitLog | null} The updated log entry, or null if log not found
   *
   * @sideEffects
   * - Persists changes to localStorage
   * - Merges updates with existing log data
   *
   * @example
   * ```typescript
   * const updatedLog = habitStorage.updateLog("log-123", {
   *   completed: true,
   *   notes: "Updated completion notes"
   * });
   * if (updatedLog) {
   *   console.log("Log updated successfully");
   * }
   * ```
   */
  updateLog: (id: string, updates: Partial<HabitLog>): HabitLog | null => {
    const logs = habitStorage.getAllLogs();
    const index = logs.findIndex((l) => l.id === id);
    if (index === -1) return null;
    logs[index] = { ...logs[index], ...updates };
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    return logs[index];
  },

  /**
   * Deletes a specific habit completion log
   *
   * @function deleteLog
   * @param {string} id - The ID of the log entry to delete
   * @returns {boolean} Always returns true (successful deletion)
   *
   * @sideEffects
   * - Removes log entry from localStorage
   * - Persists changes to LOGS_KEY
   *
   * @example
   * ```typescript
   * habitStorage.deleteLog("log-123");
   * console.log("Log entry deleted");
   * ```
   */
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
