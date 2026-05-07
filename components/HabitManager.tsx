/**
 * @fileoverview HabitManager Component - Core habit management and CRUD operations for habits.
 *
 * This file exports the HabitManager React component, which is responsible for all business logic
 * related to habit tracking. It manages state for habits and logs, handles CRUD operations,
 * and renders the habit list, creation form, and statistics. Layout is delegated to parent components.
 *
 * ## Purpose
 * - Centralizes all habit-related state and operations
 * - Provides the main interface for creating, updating, deleting, and listing habits
 * - Not concerned with overall page layout (handled by Dashboard)
 *
 * ## Main Export
 * - HabitManager (default): React component
 *
 * @author Habit Tracker Team
 * @version 1.0.0
 * @since 2026-05-07
 */

"use client";

import { useState, useEffect } from "react";
import { Habit, HabitLog } from "@/lib/types";
import { habitStorage } from "@/lib/storage";
import HabitList from "./HabitList";
import HabitForm from "./HabitForm";
import HabitGrid from "./HabitGrid";
import StatCard from "./StatCard";

/**
 * Props for the HabitManager component
 * @interface HabitManagerProps
 * @property {Date} selectedDate - The currently selected date for tracking
 * @property {(totalHabits: number, completedToday: number) => void} [onStatsUpdate] - Optional callback for stats updates
 */
interface HabitManagerProps {
  /**
   * The currently selected date for tracking habits
   */
  selectedDate: Date;
  /**
   * Optional callback to receive updates on total habits and completed count for today
   */
  onStatsUpdate?: (totalHabits: number, completedToday: number) => void;
}

/**
 * HabitManager - Main component for managing habit state and CRUD operations.
 *
 * This component manages the core habit tracking functionality including:
 * - State management for habits and logs
 * - Data persistence to localStorage
 * - User interactions for creating, toggling, and deleting habits
 * - Rendering the habit list, creation form, and statistics
 *
 * @component
 * @param {HabitManagerProps} props - The props for the component
 * @returns {JSX.Element} The rendered habit management interface
 *
 * @inputs
 * - selectedDate: Date to track completions for
 * - onStatsUpdate: Optional callback for stats updates
 *
 * @outputs
 * - Renders habit statistics, list, and creation form
 * - Calls onStatsUpdate with updated stats
 *
 * @sideEffects
 * - Loads and saves data to localStorage
 * - Manages habit-related application state
 *
 * @example
 * ```tsx
 * <HabitManager selectedDate={new Date()} onStatsUpdate={handleStats} />
 * ```
 */
export default function HabitManager({
  selectedDate,
  onStatsUpdate,
}: HabitManagerProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * Loads all habits and logs from localStorage on mount.
   *
   * @sideEffects
   * - Sets habits and logs state from persistent storage
   */
  useEffect(() => {
    setHabits(habitStorage.getAllHabits());
    setLogs(habitStorage.getAllLogs());
    setLoading(false);
  }, []);

  /**
   * Updates parent with statistics whenever habits or logs change.
   *
   * @sideEffects
   * - Calls onStatsUpdate with total habits and completed count for today
   */
  useEffect(() => {
    if (onStatsUpdate) {
      const todayDate = new Date(selectedDate);
      todayDate.setHours(0, 0, 0, 0);

      const completedToday = logs.filter((log) => {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === todayDate.getTime() && log.completed;
      }).length;

      onStatsUpdate(habits.length, completedToday);
    }
  }, [habits, logs, selectedDate, onStatsUpdate]);

  /**
   * Handles the creation of a new habit.
   *
   * @function handleCreateHabit
   * @param {Omit<Habit, "id" | "createdAt" | "updatedAt">} habitData - Data for the new habit
   * @returns {void}
   * @sideEffects
   * - Persists new habit to storage
   * - Updates local state
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
   * @function handleToggleCompletion
   * @param {string} habitId - The ID of the habit to toggle
   * @param {boolean} completed - The new completion status
   * @returns {void}
   * @sideEffects
   * - Updates log in storage and local state
   */
  const handleToggleCompletion = (habitId: string, completed: boolean) => {
    const today = new Date(selectedDate);
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
   * @function handleDeleteHabit
   * @param {string} habitId - The ID of the habit to delete
   * @returns {void}
   * @sideEffects
   * - Removes habit and logs from storage and local state
   */
  const handleDeleteHabit = (habitId: string) => {
    habitStorage.deleteHabit(habitId);
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    setLogs((prev) => prev.filter((l) => l.habitId !== habitId));
  };

  // Show loading state while fetching habits/logs
  if (loading) {
    return <div className="text-center text-habit-600">Loading habits...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Statistics cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard title="Active habits" value={habits.length} />
        <StatCard
          title="Completed today"
          value={
            logs.filter((log) => {
              const logDate = new Date(log.date);
              logDate.setHours(0, 0, 0, 0);
              const todayDate = new Date(selectedDate);
              todayDate.setHours(0, 0, 0, 0);
              return logDate.getTime() === todayDate.getTime() && log.completed;
            }).length
          }
        />
      </div>

      {/* Habit list or empty state */}
      <section>
        {habits.length > 0 ? (
          <HabitGrid>
            <HabitList
              habits={habits}
              logs={logs}
              onToggleCompletion={handleToggleCompletion}
              onDeleteHabit={handleDeleteHabit}
            />
          </HabitGrid>
        ) : (
          <div className="rounded-3xl border border-dashed border-habit-300 bg-white/80 p-8 text-center shadow-sm">
            <p className="text-habit-600">
              No habits yet. Create one to get started!
            </p>
          </div>
        )}
      </section>

      {/* Habit creation form or button */}
      <div className="sticky bottom-4">
        {isCreating ? (
          <HabitForm
            onSubmit={handleCreateHabit}
            onCancel={() => setIsCreating(false)}
          />
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full rounded-3xl bg-blue-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-blue-600"
          >
            + New Habit
          </button>
        )}
      </div>
    </div>
  );
}
