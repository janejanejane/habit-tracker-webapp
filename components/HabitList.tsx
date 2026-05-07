/**
 * @fileoverview HabitList Component - Container component for displaying a list of habits.
 *
 * This file exports the HabitList component, which is responsible for rendering a collection
 * of habit items in a responsive grid layout. It handles the display of multiple habits,
 * manages today's completion logs for each habit, and provides empty state messaging when
 * no habits exist. The component acts as a bridge between the habit data and individual
 * HabitItem components.
 *
 * ## Purpose
 * - Display a list of all habits for the user
 * - Manage and pass down today's completion logs
 * - Show empty state when no habits exist
 *
 * ## Main Export
 * - HabitList (default): React component
 *
 * @author Habit Tracker Team
 * @version 1.0.0
 * @since 2026-05-07
 */

"use client";

import { Habit, HabitLog } from "@/lib/types";
import HabitItem from "./HabitItem";

/**
 * Props for the HabitList component.
 *
 * Defines the properties required to render a list of habits, including
 * the habit data, completion logs, and callback functions for user interactions
 * that affect the entire list.
 *
 * @interface HabitListProps
 * @property {Habit[]} habits - Array of habit objects to display
 * @property {HabitLog[]} logs - Array of all habit log entries for finding today's completions
 * @property {(habitId: string, completed: boolean) => void} onToggleCompletion - Callback to toggle habit completion
 * @property {(habitId: string) => void} onDeleteHabit - Callback to delete a habit
 *
 * @example
 * ```typescript
 * const props: HabitListProps = {
 *   habits: [
 *     {
 *       id: 'habit1',
 *       name: 'Exercise',
 *       // ... other habit properties
 *     }
 *   ],
 *   logs: [
 *     {
 *       id: 'log1',
 *       habitId: 'habit1',
 *       completed: true,
 *       date: new Date(),
 *       // ... other log properties
 *     }
 *   ],
 *   onToggleCompletion: (habitId, completed) => handleToggle(habitId, completed),
 *   onDeleteHabit: (habitId) => handleDelete(habitId)
 * };
 * ```
 */
interface HabitListProps {
  habits: Habit[];
  logs: HabitLog[];
  onToggleCompletion: (habitId: string, completed: boolean) => void;
  onDeleteHabit: (habitId: string) => void;
}

/**
 * HabitList - React component for displaying a list of habits.
 *
 * This component renders a responsive grid of HabitItem components, each representing
 * a single habit. It handles the logic for finding today's completion log for each
 * habit and passes the appropriate data to child components. When no habits exist,
 * it displays an empty state message to guide users toward creating their first habit.
 *
 * @component
 * @param {HabitListProps} props - The props for the component
 * @returns {JSX.Element} The rendered habit list component
 *
 * @example
 * ```tsx
 * <HabitList
 *   habits={habits}
 *   logs={logs}
 *   onToggleCompletion={(habitId, completed) => handleToggle(habitId, completed)}
 *   onDeleteHabit={(habitId) => handleDelete(habitId)}
 * />
 * ```
 *
 * @sideEffects
 * - Renders HabitItem components which may trigger callbacks
 * - Performs date calculations to find today's logs
 * - No direct side effects on external state
 */
export default function HabitList({
  habits,
  logs,
  onToggleCompletion,
  onDeleteHabit,
}: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-habit-300 bg-habit-50 p-8 text-center">
        <p className="text-habit-600">
          No habits yet. Create one to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {habits.map((habit) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayLog = logs.find((log) => {
          const logDate = new Date(log.date);
          logDate.setHours(0, 0, 0, 0);
          return (
            log.habitId === habit.id && logDate.getTime() === today.getTime()
          );
        });

        return (
          <HabitItem
            key={habit.id}
            habit={habit}
            todayLog={todayLog}
            onToggle={onToggleCompletion}
            onDelete={onDeleteHabit}
          />
        );
      })}
    </div>
  );
}
