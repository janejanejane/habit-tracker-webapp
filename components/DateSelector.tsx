/**
 * @fileoverview DateSelector Component - Date picker with navigation controls for habit tracking.
 *
 * This file exports the DateSelector component, which provides a date selection interface with
 * previous/next day navigation and a "go to today" button. It handles hydration-safe rendering
 * to prevent server/client text mismatches by formatting dates only after the component mounts.
 *
 * ## Purpose
 * - Allow users to navigate between dates for habit tracking
 * - Provide a hydration-safe, locale-aware date display
 *
 * ## Main Export
 * - DateSelector (default): React component
 *
 * @author Habit Tracker Team
 * @version 1.0.0
 * @since 2026-05-07
 */

"use client";

import { useEffect, useState } from "react";

/**
 * Props for the DateSelector component
 * @interface DateSelectorProps
 * @property {Date} selectedDate - The currently selected date
 * @property {(date: Date) => void} onDateChange - Callback when date changes
 *
 * @example
 * ```typescript
 * const [date, setDate] = useState(new Date());
 * <DateSelector selectedDate={date} onDateChange={setDate} />
 * ```
 */
interface DateSelectorProps {
  /**
   * The currently selected date for habit tracking
   */
  selectedDate: Date;
  /**
   * Called when the user navigates to a different date
   * @param date - The new selected date
   */
  onDateChange: (date: Date) => void;
}

/**
 * DateSelector - Component providing date navigation with hydration-safe rendering.
 *
 * This component renders a date picker with arrow buttons for navigating to previous/next
 * days and a "Go to today" button that appears when not viewing today's date. It uses
 * client-side rendering for date formatting to prevent hydration mismatches between
 * server and client rendering.
 *
 * @component
 * @param {DateSelectorProps} props - The props for the component
 * @returns {JSX.Element} The rendered date selector
 *
 * @inputs
 * - selectedDate: Date object to display and navigate from
 * - onDateChange: Function called when date changes
 *
 * @outputs
 * - Rendered date selector with navigation buttons and formatted date
 *
 * @sideEffects
 * - Calls onDateChange when user navigates dates
 * - Formats date using navigator.language after mount
 * - Conditionally shows "Go to today" button based on current date
 *
 * @example
 * ```tsx
 * const [selectedDate, setSelectedDate] = useState(new Date());
 *
 * <DateSelector
 *   selectedDate={selectedDate}
 *   onDateChange={setSelectedDate}
 * />
 * ```
 */
export default function DateSelector({
  selectedDate,
  onDateChange,
}: DateSelectorProps) {
  /**
   * Formatted date string for display (e.g., "Monday, May 7, 2026")
   * @type {string}
   */
  const [formattedDate, setFormattedDate] = useState("");

  /**
   * Whether the selected date is today
   * @type {boolean}
   */
  const [isTodayState, setIsTodayState] = useState(false);

  /**
   * Whether the component has mounted on the client (prevents hydration mismatch)
   * @type {boolean}
   */
  const [mounted, setMounted] = useState(false);

  /**
   * goToPreviousDay - Navigates to the previous day.
   *
   * Creates a new Date object set to one day before the current selectedDate
   * and calls onDateChange with the new date.
   *
   * @function
   *
   * @inputs
   * - selectedDate: Current date from props
   * - onDateChange: Callback function from props
   *
   * @outputs
   * - Calls onDateChange with date decremented by 1 day
   *
   * @sideEffects
   * - Triggers date change callback
   * - Causes parent component to update selectedDate
   *
   * @example
   * ```typescript
   * // If selectedDate is May 7, 2026
   * goToPreviousDay(); // Calls onDateChange with May 6, 2026
   * ```
   */
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  /**
   * goToNextDay - Navigates to the next day.
   *
   * Creates a new Date object set to one day after the current selectedDate
   * and calls onDateChange with the new date.
   *
   * @function
   *
   * @inputs
   * - selectedDate: Current date from props
   * - onDateChange: Callback function from props
   *
   * @outputs
   * - Calls onDateChange with date incremented by 1 day
   *
   * @sideEffects
   * - Triggers date change callback
   * - Causes parent component to update selectedDate
   *
   * @example
   * ```typescript
   * // If selectedDate is May 7, 2026
   * goToNextDay(); // Calls onDateChange with May 8, 2026
   * ```
   */
  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  /**
   * goToToday - Navigates to today's date.
   *
   * Calls onDateChange with a new Date object representing the current date/time.
   *
   * @function
   *
   * @inputs
   * - onDateChange: Callback function from props
   *
   * @outputs
   * - Calls onDateChange with current date (new Date())
   *
   * @sideEffects
   * - Triggers date change callback
   * - Causes parent component to update selectedDate to today
   *
   * @example
   * ```typescript
   * // Navigates to current date regardless of selectedDate
   * goToToday(); // Calls onDateChange with new Date()
   * ```
   */
  const goToToday = () => {
    onDateChange(new Date());
  };

  /**
   * useEffect - Sets mounted state to true after component mounts.
   *
   * This effect runs once after the component mounts on the client side,
   * enabling client-side date formatting to prevent hydration mismatches.
   *
   * @sideEffects
   * - Sets mounted state to true
   * - Enables subsequent useEffect for date formatting
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * useEffect - Formats the selected date and checks if it's today.
   *
   * This effect runs when mounted state or selectedDate changes. It formats
   * the date using the browser's locale and determines if the selected date
   * is today. Only runs after component has mounted to prevent SSR/client
   * text mismatches.
   *
   * @inputs
   * - mounted: Whether component has mounted
   * - selectedDate: Date to format and check
   *
   * @outputs
   * - Updates formattedDate state with localized date string
   * - Updates isTodayState with boolean indicating if date is today
   *
   * @sideEffects
   * - Uses navigator.language for locale-aware formatting
   * - Compares selectedDate with current date for today check
   *
   * @example
   * ```typescript
   * // When selectedDate is May 7, 2026 and today is May 7, 2026:
   * // formattedDate = "Monday, May 7, 2026"
   * // isTodayState = true
   * ```
   */
  useEffect(() => {
    if (!mounted) {
      return;
    }

    const locale =
      typeof navigator !== "undefined" ? navigator.language : "en-US";
    setFormattedDate(
      selectedDate.toLocaleDateString(locale, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    );
    setIsTodayState(selectedDate.toDateString() === new Date().toDateString());
  }, [mounted, selectedDate]);

  return (
    <div className="flex items-center justify-between rounded-2xl border border-habit-200 bg-white px-4 py-3 shadow-sm">
      <button
        onClick={goToPreviousDay}
        className="rounded-full p-1 text-habit-600 hover:bg-habit-100 hover:text-habit-900 transition-colors"
        aria-label="Previous day"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div className="text-center">
        <div className="font-semibold text-habit-900" suppressHydrationWarning>
          {formattedDate || "Loading date..."}
        </div>
        {mounted && !isTodayState && (
          <button
            onClick={goToToday}
            className="mt-1 text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Go to today
          </button>
        )}
      </div>

      <button
        onClick={goToNextDay}
        className="rounded-full p-1 text-habit-600 hover:bg-habit-100 hover:text-habit-900 transition-colors"
        aria-label="Next day"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
