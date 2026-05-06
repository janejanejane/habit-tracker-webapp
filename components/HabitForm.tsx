/**
 * HabitForm Component - Wrapper component for creating new habits.
 *
 * This component provides a styled container and layout for the CreateHabitForm.
 * It acts as a bridge between the HabitManager and the detailed form implementation,
 * providing consistent styling and a header for the habit creation interface.
 *
 * @fileoverview Habit creation form wrapper component
 * @author Habit Tracker Team
 * @version 1.0.0
 */

import CreateHabitForm from "./CreateHabitForm";
import { Habit } from "@/lib/types";

/**
 * Props for the HabitForm component
 * @interface HabitFormProps
 * @property {(habitData: Omit<Habit, "id" | "createdAt" | "updatedAt">) => void} onSubmit - Callback when form is submitted
 * @property {() => void} onCancel - Callback when form is cancelled
 *
 * @example
 * ```typescript
 * <HabitForm
 *   onSubmit={(data) => createHabit(data)}
 *   onCancel={() => closeForm()}
 * />
 * ```
 */
interface HabitFormProps {
  /**
   * Called when the user submits the form with valid habit data
   * @param habitData - The habit object without id and timestamps
   */
  onSubmit: (habitData: Omit<Habit, "id" | "createdAt" | "updatedAt">) => void;
  /**
   * Called when the user clicks the cancel button
   */
  onCancel: () => void;
}

/**
 * HabitForm - Wrapper component for the habit creation form.
 *
 * This component wraps the CreateHabitForm component within a styled
 * container, providing a consistent appearance with other UI elements.
 * It delegates form logic to CreateHabitForm while managing the outer layout.
 *
 * @component
 * @param {HabitFormProps} props - The props for the component
 * @returns {JSX.Element} The rendered form wrapper
 *
 * @inputs
 * - onSubmit: Function called on form submission
 * - onCancel: Function called on form cancellation
 *
 * @outputs
 * - Rendered form container with CreateHabitForm inside
 *
 * @example
 * ```tsx
 * <HabitForm
 *   onSubmit={(data) => {
 *     console.log("Creating habit:", data);
 *     handleCreateHabit(data);
 *   }}
 *   onCancel={() => setIsCreating(false)}
 * />
 * ```
 */
export default function HabitForm({ onSubmit, onCancel }: HabitFormProps) {
  return (
    <div className="rounded-3xl border border-habit-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-habit-900">
        Create new habit
      </h2>

      <CreateHabitForm onSubmit={onSubmit} onCancel={onCancel} />
    </div>
  );
}
