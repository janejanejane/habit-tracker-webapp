/**
 * @fileoverview StatCard Component - Displays a single statistic or metric.
 *
 * This file exports the StatCard component, which provides a consistent card-style display for showing
 * numerical metrics and statistics throughout the application. It's used for displaying habit counts,
 * completion rates, and other key metrics.
 *
 * ## Purpose
 * - Display a single metric or statistic in a card format
 * - Provide consistent UI for stats throughout the app
 *
 * ## Main Export
 * - StatCard (default): React component
 *
 * @author Habit Tracker Team
 * @version 1.0.0
 * @since 2026-05-07
 */

/**
 * Props for the StatCard component
 * @interface StatCardProps
 * @property {string} title - The label/title for the statistic
 * @property {string | number} value - The numeric value to display
 *
 * @example
 * ```typescript
 * <StatCard title="Active habits" value={5} />
 * <StatCard title="Completion rate" value="85%" />
 * ```
 */
interface StatCardProps {
  /**
   * The descriptive label for the statistic
   */
  title: string;
  /**
   * The value to display (number or formatted string)
   */
  value: string | number;
}

/**
 * StatCard - Component for displaying a single metric or statistic.
 *
 * This component renders a styled card containing a metric label and value.
 * It's used throughout the application to display habit statistics,
 * completion counts, and other key performance indicators.
 *
 * @component
 * @param {StatCardProps} props - The props for the component
 * @returns {JSX.Element} The rendered stat card
 *
 * @inputs
 * - title: String label for the statistic
 * - value: Numeric or string value to display
 *
 * @outputs
 * - Rendered metric card with title and large value display
 *
 * @example
 * ```tsx
 * <StatCard title="Active habits" value={5} />
 * // Displays:
 * // Active habits
 * // 5
 *
 * <StatCard title="Completed today" value={3} />
 * ```
 */
export default function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-habit-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-habit-500">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-habit-900">{value}</p>
    </div>
  );
}
