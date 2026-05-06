/**
 * HabitManager Component - Core habit management functionality.
 *
 * This component handles all habit-related state management, CRUD operations,
 * and rendering of habit lists and creation forms. It focuses on the business
 * logic of habit tracking while delegating layout concerns to parent components
 * like Dashboard.
 *
 * @fileoverview Habit management component with state and operations
 * @author Habit Tracker Team
 * @version 1.0.0
 */

"use client";

import { useState, useEffect } from "react";
import { Habit, HabitLog } from "@/lib/types";
import { habitStorage } from "@/lib/storage";
import HabitList from "./HabitList";
import HabitForm from "./HabitForm";
import HabitGrid from "./HabitGrid";
import StatCard from "./StatCard";

interface HabitManagerProps {
  selectedDate: Date;
  onStatsUpdate?: (totalHabits: number, completedToday: number) => void;
}

/**
 * HabitManager - Component for managing habit state and operations.
 *
 * This component manages the core habit tracking functionality including
 * state management, data persistence, and user interactions. It renders
 * the habit list, creation form, and statistics without handling overall
 * page layout.
 *
 * @component
 * @param {HabitManagerProps} props - The props for the component
 * @returns {JSX.Element} The rendered habit management interface
 *
 * @example
 * ```tsx
 * <HabitManager selectedDate={new Date()} onStatsUpdate={handleStats} />
 * ```
 *
 * @sideEffects
 * - Loads and saves data to localStorage
 * - Manages habit-related application state
 */
export default function HabitManager({ selectedDate, onStatsUpdate }: HabitManagerProps) {
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

  // Update parent with stats whenever habits or logs change
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
   */
  const handleDeleteHabit = (habitId: string) => {
    habitStorage.deleteHabit(habitId);
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    setLogs((prev) => prev.filter((l) => l.habitId !== habitId));
  };

  if (loading) {
    return <div className="text-center text-habit-600">Loading habits...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard title="Active habits" value={habits.length} />
        <StatCard title="Completed today" value={
          logs.filter((log) => {
            const logDate = new Date(log.date);
            logDate.setHours(0, 0, 0, 0);
            const todayDate = new Date(selectedDate);
            todayDate.setHours(0, 0, 0, 0);
            return logDate.getTime() === todayDate.getTime() && log.completed;
          }).length
        } />
      </div>

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

      <div className="sticky bottom-4">
        {isCreating ? (
          <HabitForm onSubmit={handleCreateHabit} onCancel={() => setIsCreating(false)} />
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