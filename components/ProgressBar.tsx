/**
 * ProgressBar Component - Visual progress indicator for habit completion.
 *
 * This component displays a horizontal progress bar showing the completion
 * percentage of a habit. It uses smooth animations and clamps the value
 * between 0 and 100 to ensure valid visual representation.
 *
 * @fileoverview Visual progress indicator component
 * @author Habit Tracker Team
 * @version 1.0.0
 */

/**
 * Props for the ProgressBar component
 * @interface ProgressBarProps
 * @property {number} value - The completion percentage (0-100)
 *
 * @example
 * ```typescript
 * <ProgressBar value={75} /> // Shows 75% filled
 * <ProgressBar value={45.5} /> // Supports decimal values
 * ```
 */
interface ProgressBarProps {
  /**
   * The percentage value to display (0-100)
   * Values outside this range are automatically clamped
   */
  value: number;
}

/**
 * ProgressBar - Visual component for displaying completion progress.
 *
 * This component renders a horizontal progress bar that visually represents
 * a percentage value. It automatically clamps input values between 0 and 100
 * to ensure valid rendering. The bar uses a smooth transition animation for
 * visual feedback when the value changes.
 *
 * @component
 * @param {ProgressBarProps} props - The props for the component
 * @returns {JSX.Element} The rendered progress bar
 *
 * @inputs
 * - value: Completion percentage as a number
 *
 * @outputs
 * - Visual progress bar rendered to DOM
 *
 * @example
 * ```tsx
 * // Show 80% completion
 * <ProgressBar value={80} />
 *
 * // Value is automatically clamped to 0-100
 * <ProgressBar value={150} /> // Renders as 100%
 * <ProgressBar value={-10} /> // Renders as 0%
 * ```
 */
export default function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="mt-2 h-2 overflow-hidden rounded-full bg-habit-200">
      <div
        className="h-full bg-green-500 transition-all duration-300"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}
