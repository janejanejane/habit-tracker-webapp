/**
 * @fileoverview Sidebar Component - Secondary navigation and quick stats panel.
 *
 * This file exports the Sidebar component, which displays quick statistics and additional information
 * in a sidebar format. It shows the number of active habits, completion summary for today, and provides
 * guidance for habit maintenance.
 *
 * ## Purpose
 * - Display quick stats and guidance for the user
 * - Provide a secondary navigation/info panel
 *
 * ## Main Export
 * - Sidebar (default): React component
 *
 * @author Habit Tracker Team
 * @version 1.0.0
 * @since 2026-05-07
 */

/**
 * Props for the Sidebar component
 * @interface SidebarProps
 * @property {number} totalHabits - Total number of active habits
 * @property {number} completedToday - Number of habits completed today
 *
 * @example
 * ```typescript
 * <Sidebar totalHabits={5} completedToday={3} />
 * ```
 */
interface SidebarProps {
  /**
   * Total count of active habits for the user
   */
  totalHabits: number;
  /**
   * Count of habits completed on the current day
   */
  completedToday: number;
}

/**
 * Sidebar - Component displaying quick stats and navigation panel.
 *
 * This component renders a sidebar containing quick statistics about
 * the user's habits, including the total count of active habits and
 * today's completion status. It also provides guidance for maintaining habits.
 *
 * @component
 * @param {SidebarProps} props - The props for the component
 * @returns {JSX.Element} The rendered sidebar panel
 *
 * @inputs
 * - totalHabits: Count of all active habits
 * - completedToday: Count of habits completed today
 *
 * @outputs
 * - Rendered sidebar with statistics and guidance
 *
 * @example
 * ```tsx
 * <Sidebar totalHabits={5} completedToday={3} />
 * // Displays:
 * // Quick stats
 * // 5 active habits
 * // 3 completed today
 * //
 * // Needs attention
 * // Review habits with low completion rates
 * ```
 */
export default function Sidebar({ totalHabits, completedToday }: SidebarProps) {
  return (
    <aside className="space-y-4 rounded-3xl border border-habit-200 bg-white p-6 shadow-sm">
      <div className="text-sm font-semibold text-habit-900">Quick stats</div>
      <div className="rounded-3xl bg-habit-50 p-4 text-sm text-habit-700">
        <p>{totalHabits} active habits</p>
        <p className="mt-2">{completedToday} completed today</p>
      </div>

      <div className="rounded-3xl bg-habit-50 p-4 text-sm text-habit-700">
        <p className="font-semibold text-habit-900">Needs attention</p>
        <p className="mt-2">Review habits with low completion rates</p>
      </div>
    </aside>
  );
}
