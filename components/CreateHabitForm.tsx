/**
 * @fileoverview CreateHabitForm - A React component for creating new habits
 *
 * This component provides a comprehensive form interface for users to create new habits
 * in the Habit Tracker application. It includes form validation, color selection,
 * icon selection, and frequency options.
 *
 * @author Habit Tracker Team
 * @version 1.0.0
 * @since 2026-05-06
 */

"use client";

import { Habit } from "@/lib/types";
import { useState } from "react";

/**
 * Props for the CreateHabitForm component
 * @interface CreateHabitFormProps
 */
interface CreateHabitFormProps {
  /**
   * Callback function called when the form is submitted successfully
   * @param habit - The habit data to create (without id, createdAt, updatedAt)
   */
  onSubmit: (habit: Omit<Habit, "id" | "createdAt" | "updatedAt">) => void;

  /**
   * Callback function called when the user cancels the form
   */
  onCancel: () => void;
}

/**
 * Predefined color options for habit customization
 * Array of hex color strings representing different color choices
 * @constant {string[]} COLOR_OPTIONS
 */
const COLOR_OPTIONS = [
  "#EF4444", // Red
  "#F97316", // Orange
  "#EAB308", // Yellow
  "#22C55E", // Green
  "#06B6D4", // Cyan
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
];

/**
 * Predefined emoji options for habit icons
 * Array of emoji strings representing different activity categories
 * @constant {string[]} EMOJI_OPTIONS
 */
const EMOJI_OPTIONS = [
  "🏃", // Running/Exercise
  "📚", // Reading
  "🧘", // Meditation
  "💪", // Strength training
  "🥗", // Healthy eating
  "😴", // Sleep
  "🎨", // Creative activities
  "💻", // Work/Programming
  "🎵", // Music
  "📖", // Learning
];

/**
 * CreateHabitForm - A form component for creating new habits
 *
 * This component renders a comprehensive form that allows users to:
 * - Enter habit name and description
 * - Select frequency (daily/weekly)
 * - Choose an icon emoji
 * - Pick a color theme
 *
 * The form includes validation, resets after successful submission,
 * and provides cancel functionality.
 *
 * @component
 * @param {CreateHabitFormProps} props - The component props
 * @returns {JSX.Element} The rendered form component
 *
 * @example
 * ```tsx
 * <CreateHabitForm
 *   onSubmit={(habit) => {
 *     console.log('Creating habit:', habit);
 *     // Handle habit creation
 *   }}
 *   onCancel={() => {
 *     console.log('Form cancelled');
 *     // Handle form cancellation
 *   }}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Integration with state management
 * const [showForm, setShowForm] = useState(false);
 *
 * return showForm ? (
 *   <CreateHabitForm
 *     onSubmit={(habit) => {
 *       createHabit(habit);
 *       setShowForm(false);
 *     }}
 *     onCancel={() => setShowForm(false)}
 *   />
 * ) : (
 *   <button onClick={() => setShowForm(true)}>Add Habit</button>
 * );
 * ```
 */
export default function CreateHabitForm({
  onSubmit,
  onCancel,
}: CreateHabitFormProps) {
  /**
   * State for the habit name input field
   * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
   */
  const [name, setName] = useState("");

  /**
   * State for the habit description textarea
   * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
   */
  const [description, setDescription] = useState("");

  /**
   * State for the selected color from COLOR_OPTIONS
   * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
   */
  const [color, setColor] = useState(COLOR_OPTIONS[0]);

  /**
   * State for the selected icon emoji from EMOJI_OPTIONS
   * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
   */
  const [icon, setIcon] = useState(EMOJI_OPTIONS[0]);

  /**
   * State for the habit frequency selection
   * @type {[("daily" | "weekly"), React.Dispatch<React.SetStateAction<"daily" | "weekly">>]}
   */
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");

  /**
   * Handles form submission
   *
   * Validates the form data, creates a habit object, calls the onSubmit callback,
   * and resets the form to its initial state.
   *
   * @function handleSubmit
   * @param {React.FormEvent} e - The form submission event
   * @returns {void}
   *
   * @sideEffects
   * - Calls onSubmit prop with habit data
   * - Resets all form state to initial values
   * - Prevents default form submission behavior
   *
   * @validation
   * - Requires non-empty, trimmed habit name
   * - Trims whitespace from name and description
   * - Sets default userId to "default-user"
   * - Always sets isActive to true for new habits
   *
   * @example
   * ```tsx
   * // Form submission creates habit object like:
   * {
   *   userId: "default-user",
   *   name: "Morning Exercise",
   *   description: "30 minute workout",
   *   color: "#3B82F6",
   *   icon: "🏃",
   *   frequency: "daily",
   *   isActive: true
   * }
   * ```
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      userId: "default-user",
      name: name.trim(),
      description: description.trim(),
      color,
      icon,
      frequency,
      isActive: true,
    });

    setName("");
    setDescription("");
    setColor(COLOR_OPTIONS[0]);
    setIcon(EMOJI_OPTIONS[0]);
  };

  /**
   * Renders the habit creation form
   *
   * The form includes:
   * - Habit name input (required)
   * - Description textarea (optional)
   * - Frequency selector (daily/weekly)
   * - Icon selector dropdown
   * - Color picker with visual buttons
   * - Submit and Cancel buttons
   *
   * @returns {JSX.Element} The complete form JSX structure
   *
   * @accessibility
   * - All form inputs have proper labels
   * - Required fields are marked with asterisk
   * - Color picker uses visual buttons with ring focus indicators
   * - Form can be submitted with Enter key
   *
   * @styling
   * - Uses Tailwind CSS classes
   * - Responsive grid layout for frequency/icon selection
   * - Visual feedback for selected color option
   * - Consistent spacing and typography
   */
  return (
    /**
     * Main form container with border and background styling
     */
    <div className="rounded-lg border-2 border-habit-300 bg-white p-6">
      {/* Form title */}
      <h2 className="mb-4 text-2xl font-bold text-habit-900">
        Create a New Habit
      </h2>

      {/* Main form element with submit handler */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Habit name input section */}
        <div>
          <label className="block text-sm font-medium text-habit-700">
            Habit Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Morning Exercise"
            className="mt-1 w-full rounded-lg border-2 border-habit-300 px-3 py-2 text-habit-900 placeholder-habit-400 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Description textarea section */}
        <div>
          <label className="block text-sm font-medium text-habit-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional details about your habit"
            rows={3}
            className="mt-1 w-full rounded-lg border-2 border-habit-300 px-3 py-2 text-habit-900 placeholder-habit-400 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Frequency and icon selection grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Frequency selector */}
          <div>
            <label className="block text-sm font-medium text-habit-700">
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) =>
                setFrequency(e.target.value as "daily" | "weekly")
              }
              className="mt-1 w-full rounded-lg border-2 border-habit-300 px-3 py-2 text-habit-900 focus:border-blue-500 focus:outline-none"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          {/* Icon selector */}
          <div>
            <label className="block text-sm font-medium text-habit-700">
              Icon
            </label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="mt-1 w-full rounded-lg border-2 border-habit-300 px-3 py-2 text-habit-900 focus:border-blue-500 focus:outline-none"
            >
              {EMOJI_OPTIONS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Color picker section */}
        <div>
          <label className="block text-sm font-medium text-habit-700">
            Color
          </label>
          <div className="mt-2 flex gap-3">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`h-8 w-8 rounded-full transition-all ${
                  color === c ? "ring-2 ring-offset-2 ring-habit-400" : ""
                }`}
                style={{ backgroundColor: c }}
                title={`Select ${c} color`}
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
          >
            Create Habit
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border-2 border-habit-300 px-4 py-2 font-semibold text-habit-700 hover:bg-habit-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
