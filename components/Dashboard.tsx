/**
 * @fileoverview Dashboard Component - Main page layout for the Habit Tracker application.
 *
 * This file exports the Dashboard component, which provides the overall page structure and layout
 * for the habit tracking dashboard. It includes the header, sidebar, and main content area with
 * habit management functionality. The dashboard follows the spec's component hierarchy with Header,
 * HabitGrid, and Sidebar components.
 *
 * ## Purpose
 * - Orchestrates the main UI structure for the app
 * - Manages selected date and statistics state
 * - Renders header, date selector, habit manager, and sidebar
 *
 * ## Main Export
 * - Dashboard (default): React component
 *
 * @author Habit Tracker Team
 * @version 1.0.0
 * @since 2026-05-07
 */

"use client";

import HabitManager from "./HabitManager";
import Header from "./Header";
import Sidebar from "./Sidebar";
import DateSelector from "./DateSelector";
import { useState } from "react";

/**
 * Dashboard - Main page layout component orchestrating the overall UI structure.
 *
 * This component renders the main dashboard page with a responsive grid layout
 * containing the header, date selector, habit manager, and sidebar. It manages
 * the selected date state and receives statistics updates from the HabitManager
 * to display in the header and sidebar.
 *
 * @component
 * @returns {JSX.Element} The rendered dashboard layout
 *
 * @inputs
 * - None (manages internal state)
 *
 * @outputs
 * - Rendered dashboard with header, date selector, habit manager, and sidebar
 *
 * @sideEffects
 * - Manages selectedDate state for date navigation
 * - Updates totalHabits and completedToday stats from HabitManager
 *
 * @example
 * ```tsx
 * // Used as the main page component in app/page.tsx
 * export default function HomePage() {
 *   return <Dashboard />;
 * }
 * ```
 */
export default function Dashboard() {
  /**
   * Currently selected date for habit tracking
   * @type {Date}
   */
  const [selectedDate, setSelectedDate] = useState(new Date());

  /**
   * Total number of active habits
   * @type {number}
   */
  const [totalHabits, setTotalHabits] = useState(0);

  /**
   * Number of habits completed on the selected date
   * @type {number}
   */
  const [completedToday, setCompletedToday] = useState(0);

  /**
   * handleStatsUpdate - Updates dashboard statistics from HabitManager.
   *
   * This function receives statistics updates from the HabitManager component
   * and updates the local state for display in the header and sidebar.
   *
   * @function
   * @param {number} habits - Total number of active habits
   * @param {number} completed - Number of habits completed today
   *
   * @inputs
   * - habits: Count of all active habits
   * - completed: Count of habits completed on selected date
   *
   * @outputs
   * - Updates totalHabits and completedToday state
   *
   * @sideEffects
   * - Triggers re-render of Header and Sidebar with new stats
   *
   * @example
   * ```typescript
   * // Called by HabitManager when habits or completions change
   * handleStatsUpdate(5, 3); // 5 total habits, 3 completed today
   * ```
   */
  const handleStatsUpdate = (habits: number, completed: number) => {
    setTotalHabits(habits);
    setCompletedToday(completed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-habit-50 to-habit-100 px-4 py-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.6fr_0.8fr]">
        <main>
          <Header
            today={selectedDate}
            completedToday={completedToday}
            totalHabits={totalHabits}
          />

          <div className="mb-6">
            <DateSelector
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>

          <HabitManager
            selectedDate={selectedDate}
            onStatsUpdate={handleStatsUpdate}
          />
        </main>

        <Sidebar totalHabits={totalHabits} completedToday={completedToday} />
      </div>
    </div>
  );
}
