/**
 * StreakDisplay Component - Visual indicator for habit streaks.
 *
 * This component displays the current streak for a habit with a flame emoji
 * icon that appears when the streak is greater than 0. It provides visual
 * motivation and encouragement for users to maintain their habits.
 *
 * @fileoverview Streak display component with flame emoji indicator
 * @author Habit Tracker Team
 * @version 1.0.0
 */

/**
 * Props for the StreakDisplay component
 * @interface StreakDisplayProps
 * @property {number} currentStreak - The current streak count (days/weeks)
 *
 * @example
 * ```typescript
 * <StreakDisplay currentStreak={5} /> // Shows flame emoji with 5
 * <StreakDisplay currentStreak={0} /> // Shows just 0 without flame
 * ```
 */
interface StreakDisplayProps {
  /**
   * The current streak count for the habit
   * Displays flame emoji (🔥) when > 0 for visual emphasis
   */
  currentStreak: number;
}

/**
 * StreakDisplay - Component for displaying habit streak with visual indicator.
 *
 * This component renders a badge-style display showing the current streak count.
 * When the streak is greater than 0, it includes a flame emoji (🔥) to visually
 * emphasize the achievement and motivate users to maintain their streak.
 *
 * @component
 * @param {StreakDisplayProps} props - The props for the component
 * @returns {JSX.Element} The rendered streak display badge
 *
 * @inputs
 * - currentStreak: Number of consecutive days/weeks completed
 *
 * @outputs
 * - Rendered badge showing streak count (and flame emoji if > 0)
 *
 * @example
 * ```tsx
 * // Display 7-day streak with flame
 * <StreakDisplay currentStreak={7} />
 * // Output: 🔥 7 day streak
 *
 * // Display 0 streak without flame
 * <StreakDisplay currentStreak={0} />
 * // Output: 0 day streak
 * ```
 */
export default function StreakDisplay({ currentStreak }: StreakDisplayProps) {
  return (
    <div className="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-700">
      <span className="text-lg">{currentStreak > 0 ? "🔥" : ""}</span>
      <span className="font-semibold">{currentStreak}</span>
      <span className="ml-1">day streak</span>
    </div>
  );
}
