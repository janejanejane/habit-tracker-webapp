"use client";

import { useEffect, useState } from "react";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function DateSelector({
  selectedDate,
  onDateChange,
}: DateSelectorProps) {
  const [formattedDate, setFormattedDate] = useState("");
  const [isTodayState, setIsTodayState] = useState(false);
  const [mounted, setMounted] = useState(false);

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  useEffect(() => {
    setMounted(true);
  }, []);

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
