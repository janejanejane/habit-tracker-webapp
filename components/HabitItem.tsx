/**
 * @fileoverview HabitItem Component - Individual habit display and interaction component.
 *
 * This file exports the HabitItem component, which is responsible for rendering a single habit
 * in the habit list. It displays habit details, completion status, statistics, and provides
 * interaction buttons for toggling completion and deletion. The component integrates with local
 * storage for statistics calculation and supports visual feedback for completed habits.
 *
 * ## Purpose
 * - Display all relevant information for a single habit
 * - Allow users to toggle completion and delete habits
 * - Show statistics and streaks for each habit
 *
 * ## Main Export
 * - HabitItem (default): React component
 *
 * @author Habit Tracker Team
 * @version 1.0.0
 * @since 2026-05-07
 */

"use client";

import { Habit, HabitLog } from "@/lib/types";
import { useState } from "react";
import { calculateStats } from "@/lib/storage";
import ProgressBar from "./ProgressBar";
import StreakDisplay from "./StreakDisplay";

/**
 * Props for the HabitItem component.
 *
 * Defines the properties required to render and interact with a habit item,
 * including the habit data, today's completion status, and callback functions
 * for user interactions.
 *
 * @interface HabitItemProps
 * @property {Habit} habit - The habit object containing all habit details
 * @property {HabitLog} [todayLog] - Optional log entry for today's completion status
 * @property {(habitId: string, completed: boolean) => void} onToggle - Callback to toggle habit completion
 * @property {(habitId: string) => void} onDelete - Callback to delete the habit
 *
 * @example
 * ```typescript
 * const props: HabitItemProps = {
 *   habit: {
 *     id: 'habit123',
 *     name: 'Exercise',
 *     color: '#FF6B6B',
 *     // ... other habit properties
 *   },
 *   todayLog: {
 *     id: 'log456',
 *     habitId: 'habit123',
 *     completed: true,
 *     // ... other log properties
 *   },
 *   onToggle: (habitId, completed) => console.log('Toggled', habitId, completed),
 *   onDelete: (habitId) => console.log('Deleted', habitId)
 * };
 * ```
 */
interface HabitItemProps {
  habit: Habit;
  todayLog?: HabitLog;
  onToggle: (habitId: string, completed: boolean) => void;
  onDelete: (habitId: string) => void;
}

/**
 * HabitItem - React component for displaying an individual habit.
 *
 * This component renders a single habit item with its details, completion status,
 * statistics, and interactive buttons. It calculates and displays habit statistics
 * using the calculateStats function, shows visual indicators for completion,
 * and handles user interactions for toggling completion and deletion.
 *
 * @component
 * @param {HabitItemProps} props - The props for the component
 * @returns {JSX.Element} The rendered habit item component
 *
 * @example
 * ```tsx
 * <HabitItem
 *   habit={habit}
 *   todayLog={todayLog}
 *   onToggle={(habitId, completed) => handleToggle(habitId, completed)}
 *   onDelete={(habitId) => handleDelete(habitId)}
 * />
 * ```
 *
 * @sideEffects
 * - Calls calculateStats to fetch habit statistics from localStorage
 * - Updates local component state for delete confirmation
 * - Triggers parent callbacks for toggle and delete operations
 */
export default function HabitItem({
  habit,
  todayLog,
  onToggle,
  onDelete,
}: HabitItemProps) {
  const stats = calculateStats(habit.id);
  const isCompletedToday = todayLog?.completed ?? false;
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Handles toggling the completion status of the habit for today.
   *
   * This function calls the onToggle callback with the habit ID and the new
   * completion status (opposite of current). It allows users to mark habits
   * as completed or incomplete for the current day.
   *
   * @function handleToggle
   * @returns {void}
   *
   * @inputs
   * - Current completion status from todayLog
   * - Habit ID from props
   *
   * @outputs
   * - Calls onToggle callback with habitId and new completion status
   *
   * @sideEffects
   * - Triggers parent component's toggle handler
   * - May update habit logs in storage via parent callback
   *
   * @example
   * ```typescript
   * // When called, this will toggle the habit's completion status
   * handleToggle(); // Calls onToggle('habit123', true) if currently false
   * ```
   */
  const handleToggle = () => {
    onToggle(habit.id, !isCompletedToday);
  };

  /**
   * Handles the deletion of the habit with confirmation.
   *
   * This function implements a two-step deletion process: first click shows
   * a confirmation prompt, and a second click within 3 seconds actually
   * deletes the habit. This prevents accidental deletions.
   *
   * @function handleDelete
   * @returns {void}
   *
   * @inputs
   * - Current isDeleting state
   * - Habit ID from props
   *
   * @outputs
   * - Updates local isDeleting state
   * - Calls onDelete callback after confirmation
   *
   * @sideEffects
   * - Updates component state for confirmation UI
   * - Sets a 3-second timeout to reset confirmation state
   * - Triggers parent component's delete handler after confirmation
   * - May remove habit data from storage via parent callback
   *
   * @example
   * ```typescript
   * // First call shows confirmation
   * handleDelete(); // Sets isDeleting to true, shows "Confirm?"
   *
   * // Second call within 3 seconds deletes
   * handleDelete(); // Calls onDelete('habit123')
   * ```
   */
  const handleDelete = () => {
    if (isDeleting) {
      onDelete(habit.id);
    } else {
      setIsDeleting(true);
      setTimeout(() => setIsDeleting(false), 3000);
    }
  };

  return (
    <div
      className={`rounded-lg border-2 p-4 transition-all ${
        isCompletedToday
          ? "border-green-500 bg-green-50"
          : "border-habit-300 bg-white"
      }`}
      style={{
        borderLeftColor: habit.color,
        borderLeftWidth: "4px",
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {habit.icon && <span className="text-2xl">{habit.icon}</span>}
            <h3 className="text-lg font-semibold text-habit-900">
              {habit.name}
            </h3>
          </div>
          {habit.description && (
            <p className="mt-1 text-sm text-habit-600">{habit.description}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <StreakDisplay currentStreak={stats.currentStreak} />
            <div className="text-sm">
              <span className="font-semibold text-habit-900">
                {stats.totalCompleted}
              </span>
              <span className="text-habit-600"> completed</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleToggle}
            className={`rounded-full px-6 py-2 font-semibold transition-all ${
              isCompletedToday
                ? "bg-green-500 text-white hover:bg-green-600"
                : "border-2 border-habit-300 text-habit-700 hover:border-habit-400"
            }`}
          >
            {isCompletedToday ? "✓ Done" : "Log"}
          </button>
          <button
            onClick={handleDelete}
            className={`rounded px-3 py-1 text-xs font-medium transition-all ${
              isDeleting
                ? "bg-red-500 text-white"
                : "text-habit-600 hover:bg-habit-100"
            }`}
          >
            {isDeleting ? "Confirm?" : "Delete"}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-habit-600">
            {Math.round(stats.completionRate)}% completion
          </span>
        </div>
        <ProgressBar value={stats.completionRate} />
      </div>
    </div>
  );
}
