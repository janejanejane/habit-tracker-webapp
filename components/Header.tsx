/**
 * Header Component - Top navigation and date display for the Habit Tracker.
 *
 * This component renders the main header section of the dashboard, displaying
 * the application title, current date, and a summary of today's habit
 * completion statistics.
 *
 * @fileoverview Dashboard header with date and completion summary
 * @author Habit Tracker Team
 * @version 1.0.0
 */

import { format } from "date-fns";

/**
 * Props for the Header component
 * @interface HeaderProps
 * @property {Date} today - The date to display in the header
 * @property {number} completedToday - Number of habits completed today
 * @property {number} totalHabits - Total number of active habits
 *
 * @example
 * ```typescript
 * const props: HeaderProps = {
 *   today: new Date(),
 *   completedToday: 3,
 *   totalHabits: 5
 * };
 * ```
 */
interface HeaderProps {
  /**
   * The date to display (formatted using date-fns)
   */
  today: Date;
  /**
   * Number of habits completed on the selected date
   */
  completedToday: number;
  /**
   * Total number of active habits for the user
   */
  totalHabits: number;
}

/**
 * Header - Component displaying dashboard header with date and completion summary.
 *
 * This component renders the main header section containing the application
 * title, formatted date, and a summary card showing the number of habits
 * completed today versus the total number of active habits.
 *
 * @component
 * @param {HeaderProps} props - The props for the component
 * @returns {JSX.Element} The rendered header component
 *
 * @inputs
 * - today: Date object to display
 * - completedToday: Count of completed habits
 * - totalHabits: Total active habits count
 *
 * @outputs
 * - Rendered header with date and completion summary
 *
 * @example
 * ```tsx
 * <Header
 *   today={new Date()}
 *   completedToday={3}
 *   totalHabits={5}
 * />
 * ```
 */
export default function Header({
  today,
  completedToday,
  totalHabits,
}: HeaderProps) {
  return (
    <header className="mb-8 rounded-3xl bg-white p-6 shadow-sm shadow-habit-100">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-habit-500">
            Habit Tracker
          </p>
          <h1 className="mt-2 text-4xl font-bold text-habit-900">
            Your habits dashboard
          </h1>
          <p className="mt-1 text-sm text-habit-600">
            {format(today, "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <div className="rounded-3xl bg-habit-50 px-4 py-3 text-sm text-habit-700 shadow-inner">
          <p className="font-semibold text-habit-900">
            {totalHabits === 0
              ? "No habits"
              : `${completedToday} / ${totalHabits}`}
          </p>
          <p className="text-habit-600">habits completed today</p>
        </div>
      </div>
    </header>
  );
}
