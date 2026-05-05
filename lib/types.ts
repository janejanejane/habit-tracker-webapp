/**
 * Core type definitions for the Habit Tracker web application.
 *
 * This file defines the primary data structures used throughout the application,
 * including user accounts, habits, habit completion logs, and user statistics.
 * These types ensure type safety and consistency across components, storage operations,
 * and API interactions.
 *
 * @fileoverview TypeScript interfaces for Habit Tracker data models
 * @author Habit Tracker Team
 * @version 1.0.0
 */

/**
 * Represents a user account in the Habit Tracker system.
 *
 * This interface defines the structure for user data, including authentication
 * details, profile information, and user preferences. It supports user management
 * features like account creation, login, and personalization.
 *
 * @interface User
 * @property {string} id - Unique identifier for the user
 * @property {string} email - User's email address (used for authentication)
 * @property {string} name - Display name of the user
 * @property {string} passwordHash - Hashed password for security
 * @property {Date} createdAt - Timestamp when the user account was created
 * @property {Date} updatedAt - Timestamp when the user account was last updated
 * @property {Object} [preferences] - Optional user preferences
 * @property {'light' | 'dark'} [preferences.theme] - UI theme preference
 * @property {boolean} [preferences.notifications] - Whether to enable notifications
 * @property {string} [preferences.timezone] - User's timezone
 *
 * @example
 * ```typescript
 * const newUser: User = {
 *   id: 'user123',
 *   email: 'john@example.com',
 *   name: 'John Doe',
 *   passwordHash: 'hashedpassword',
 *   createdAt: new Date(),
 *   updatedAt: new Date(),
 *   preferences: {
 *     theme: 'dark',
 *     notifications: true,
 *     timezone: 'America/New_York'
 *   }
 * };
 * ```
 */
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

/**
 * Represents a habit that a user wants to track.
 *
 * This interface defines the structure for habit data, including metadata like name,
 * description, visual properties, and tracking configuration. Habits can be daily
 * or weekly, with optional target days for completion goals.
 *
 * @interface Habit
 * @property {string} id - Unique identifier for the habit
 * @property {string} userId - ID of the user who owns this habit
 * @property {string} name - Display name of the habit
 * @property {string} [description] - Optional detailed description
 * @property {string} color - Hex color code for visual representation
 * @property {string} [icon] - Optional icon identifier (e.g., emoji or icon name)
 * @property {'daily' | 'weekly'} frequency - How often the habit should be performed
 * @property {number} [targetDays] - Optional target number of days for completion
 * @property {Date} createdAt - Timestamp when the habit was created
 * @property {Date} updatedAt - Timestamp when the habit was last updated
 * @property {boolean} isActive - Whether the habit is currently active for tracking
 *
 * @example
 * ```typescript
 * const readingHabit: Habit = {
 *   id: 'habit456',
 *   userId: 'user123',
 *   name: 'Read for 30 minutes',
 *   description: 'Daily reading to improve knowledge',
 *   color: '#4CAF50',
 *   icon: '📚',
 *   frequency: 'daily',
 *   targetDays: 30,
 *   createdAt: new Date(),
 *   updatedAt: new Date(),
 *   isActive: true
 * };
 * ```
 */
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

/**
 * Represents a single log entry for habit completion.
 *
 * This interface tracks when a user completes or attempts a habit on a specific date.
 * Each log entry is associated with a habit and user, and can include notes for
 * additional context about the completion.
 *
 * @interface HabitLog
 * @property {string} id - Unique identifier for the log entry
 * @property {string} habitId - ID of the habit this log belongs to
 * @property {string} userId - ID of the user who logged this entry
 * @property {Date} date - The date when the habit was performed or logged
 * @property {boolean} completed - Whether the habit was successfully completed
 * @property {string} [notes] - Optional notes about the completion or attempt
 * @property {Date} createdAt - Timestamp when this log entry was created
 *
 * @example
 * ```typescript
 * const logEntry: HabitLog = {
 *   id: 'log789',
 *   habitId: 'habit456',
 *   userId: 'user123',
 *   date: new Date('2024-01-15'),
 *   completed: true,
 *   notes: 'Read chapter 5 of the book',
 *   createdAt: new Date()
 * };
 * ```
 */
export interface HabitLog {
  id: string;
  habitId: string;
  userId: string;
  date: Date;
  completed: boolean;
  notes?: string;
  createdAt: Date;
}

/**
 * Represents statistics and progress metrics for a user's habit.
 *
 * This interface aggregates key performance indicators for a habit, including
 * current and longest streaks, total completions, and completion rate. These
 * stats help users track their progress and stay motivated.
 *
 * @interface UserStats
 * @property {string} habitId - ID of the habit these stats belong to
 * @property {number} currentStreak - Number of consecutive days/weeks completed
 * @property {number} longestStreak - Longest streak ever achieved for this habit
 * @property {number} totalCompleted - Total number of times the habit was completed
 * @property {number} completionRate - Percentage of successful completions (0-100)
 * @property {Date} [lastCompletedDate] - Date when the habit was last completed
 *
 * @example
 * ```typescript
 * const habitStats: UserStats = {
 *   habitId: 'habit456',
 *   currentStreak: 7,
 *   longestStreak: 14,
 *   totalCompleted: 45,
 *   completionRate: 85.5,
 *   lastCompletedDate: new Date('2024-01-15')
 * };
 * ```
 */
export interface UserStats {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  completionRate: number;
  lastCompletedDate?: Date;
}
