/**
 * HabitTracker Component - Main application component for the Habit Tracker.
 *
 * This file contains the HabitTracker component, which serves as the root component
 * of the Habit Tracker application. It manages the global state for habits and logs,
 * handles data persistence through localStorage, and orchestrates the user interface
 * including habit listing, creation, completion tracking, and deletion. The component
 * provides a complete habit tracking experience with real-time statistics and
 * responsive design.
 *
 * @fileoverview Main React component for the Habit Tracker application
 * @author Habit Tracker Team
 * @version 1.0.0
 */

"use client";

import { useState, useEffect } from "react";
import { Habit, HabitLog } from "@/lib/types";
import { habitStorage, calculateStats } from "@/lib/storage";
import HabitList from "./HabitList";
import CreateHabitForm from "./CreateHabitForm";
import { format } from "date-fns";

/**
 * HabitTracker - Main React component for the habit tracking application.
 *
 * This component serves as the central hub of the application, managing all
 * habit-related state and user interactions. It loads data from localStorage
 * on initialization, provides handlers for creating, updating, and deleting
 * habits, and renders the complete user interface including statistics,
 * habit lists, and creation forms.
 *
 * @component
 * @returns {JSX.Element} The rendered habit tracker application
 *
 * @example
 * ```tsx
 * // This component is typically used as the main app component
 * function App() {
 *   return <HabitTracker />;
 * }
 * ```
 *
 * @sideEffects
 * - Loads and saves data to localStorage
 * - Manages global application state
 * - Triggers re-renders of child components
 * - Performs date calculations for statistics
 */
export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    setHabits(habitStorage.getAllHabits());
    setLogs(habitStorage.getAllLogs());
    setLoading(false);
  }, []);

  /**
   * Handles the creation of a new habit.
   *
   * This function creates a new habit using the storage layer, updates the
   * local state to include the new habit, and closes the creation form.
   * The habit data provided excludes auto-generated fields like id and timestamps.
   *
   * @function handleCreateHabit
   * @param {Omit<Habit, "id" | "createdAt" | "updatedAt">} habitData - The habit data to create
   * @returns {void}
   *
   * @inputs
   * - habitData: Partial habit object without id, createdAt, updatedAt
   * - Current habits state
   *
   * @outputs
   * - Updates habits state with new habit
   * - Sets isCreating to false
   *
   * @sideEffects
   * - Persists new habit to localStorage via habitStorage.createHabit
   * - Updates component state
   * - Closes creation form
   *
   * @example
   * ```typescript
   * const newHabitData = {
   *   name: 'Exercise',
   *   description: 'Daily workout',
   *   color: '#FF6B6B',
   *   frequency: 'daily'
   * };
   * handleCreateHabit(newHabitData); // Creates habit and updates state
   * ```
   */
  const handleCreateHabit = (
    habitData: Omit<Habit, "id" | "createdAt" | "updatedAt">,
  ) => {
    const newHabit = habitStorage.createHabit(habitData);
    setHabits((prev) => [...prev, newHabit]);
    setIsCreating(false);
  };

  /**
   * Handles toggling the completion status of a habit for today.
   *
   * This function logs or updates a habit completion for the current day.
   * It either creates a new log entry or updates an existing one, then
   * updates the local logs state accordingly.
   *
   * @function handleToggleCompletion
   * @param {string} habitId - The ID of the habit to toggle
   * @param {boolean} completed - The new completion status
   * @returns {void}
   *
   * @inputs
   * - habitId: ID of the habit being toggled
   * - completed: New completion status (true/false)
   * - Current logs state
   *
   * @outputs
   * - Updates logs state with new or modified log entry
   *
   * @sideEffects
   * - Persists completion log to localStorage via habitStorage.logCompletion
   * - Updates component state
   * - May create new log entry or modify existing one
   *
   * @example
   * ```typescript
   * handleToggleCompletion('habit123', true); // Marks habit as completed today
   * handleToggleCompletion('habit123', false); // Marks habit as incomplete today
   * ```
   */
  const handleToggleCompletion = (habitId: string, completed: boolean) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const updatedLog = habitStorage.logCompletion(habitId, today, completed);
    setLogs((prev) => {
      const existing = prev.find(
        (l) =>
          l.habitId === habitId &&
          new Date(l.date).toDateString() === today.toDateString(),
      );
      if (existing) {
        return prev.map((l) =>
          l.id === existing.id ? { ...l, completed } : l,
        );
      }
      return [...prev, updatedLog];
    });
  };

  /**
   * Handles the deletion of a habit.
   *
   * This function removes a habit from storage and updates the local state
   * to reflect the deletion, including removing all associated log entries.
   *
   * @function handleDeleteHabit
   * @param {string} habitId - The ID of the habit to delete
   * @returns {void}
   *
   * @inputs
   * - habitId: ID of the habit to be deleted
   * - Current habits and logs state
   *
   * @outputs
   * - Updates habits state (removes deleted habit)
   * - Updates logs state (removes associated logs)
   *
   * @sideEffects
   * - Permanently deletes habit from localStorage via habitStorage.deleteHabit
   * - Removes all log entries for the habit from localStorage
   * - Updates component state
   *
   * @example
   * ```typescript
   * handleDeleteHabit('habit123'); // Deletes habit and all its logs
   * ```
   */
  const handleDeleteHabit = (habitId: string) => {
    habitStorage.deleteHabit(habitId);
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    setLogs((prev) => prev.filter((l) => l.habitId !== habitId));
  };

  if (loading) {
    return <div className="text-center text-habit-600">Loading...</div>;
  }

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const completedToday = logs.filter((log) => {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);
    return logDate.getTime() === todayDate.getTime() && log.completed;
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-habit-50 to-habit-100 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-habit-900">Habit Tracker</h1>
          <p className="mt-2 text-lg text-habit-600">
            {format(todayDate, "EEEE, MMMM d, yyyy")}
          </p>
          <div className="mt-4 rounded-lg bg-white p-4">
            <p className="text-sm text-habit-600">
              <span className="font-semibold text-habit-900">
                {completedToday}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-habit-900">
                {habits.length}
              </span>{" "}
              habits completed today
            </p>
          </div>
        </div>

        {/* Habits List */}
        <div className="mb-8">
          {habits.length > 0 ? (
            <HabitList
              habits={habits}
              logs={logs}
              onToggleCompletion={handleToggleCompletion}
              onDeleteHabit={handleDeleteHabit}
            />
          ) : (
            <div className="rounded-lg border-2 border-dashed border-habit-300 bg-habit-50 p-8 text-center">
              <p className="text-habit-600">
                No habits yet. Create one to get started!
              </p>
            </div>
          )}
        </div>

        {/* Create Form or Button */}
        <div className="sticky bottom-4">
          {isCreating ? (
            <CreateHabitForm
              onSubmit={handleCreateHabit}
              onCancel={() => setIsCreating(false)}
            />
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white hover:bg-blue-600 transition-all shadow-lg"
            >
              + New Habit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
