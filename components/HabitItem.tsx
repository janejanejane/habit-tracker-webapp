"use client";

import { Habit, HabitLog } from "@/lib/types";
import { format } from "date-fns";
import { useState } from "react";
import { calculateStats } from "@/lib/storage";

interface HabitItemProps {
  habit: Habit;
  todayLog?: HabitLog;
  onToggle: (habitId: string, completed: boolean) => void;
  onDelete: (habitId: string) => void;
}

export default function HabitItem({
  habit,
  todayLog,
  onToggle,
  onDelete,
}: HabitItemProps) {
  const stats = calculateStats(habit.id);
  const isCompletedToday = todayLog?.completed ?? false;
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = () => {
    onToggle(habit.id, !isCompletedToday);
  };

  const handleDelete = () => {
    if (isDeleting) {
      onDelete(habit.id);
    } else {
      setIsDeleting(true);
      setTimeout(() => setIsDeleting(false), 3000);
    }
  };

  return (
    <div
      className={`rounded-lg border-2 p-4 transition-all ${
        isCompletedToday
          ? "border-green-500 bg-green-50"
          : "border-habit-300 bg-white"
      }`}
      style={{
        borderLeftColor: habit.color,
        borderLeftWidth: "4px",
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {habit.icon && <span className="text-2xl">{habit.icon}</span>}
            <h3 className="text-lg font-semibold text-habit-900">
              {habit.name}
            </h3>
          </div>
          {habit.description && (
            <p className="mt-1 text-sm text-habit-600">{habit.description}</p>
          )}
          <div className="mt-3 flex items-center gap-4">
            <div
              className={`text-sm px-3 py-1 rounded-full transition-all ${
                stats.currentStreak > 0
                  ? "bg-orange-100 border border-orange-300"
                  : ""
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="text-lg">
                  {stats.currentStreak > 0 ? "🔥" : ""}
                </span>
                <span
                  className={`font-semibold ${
                    stats.currentStreak > 0
                      ? "text-orange-600"
                      : "text-habit-900"
                  }`}
                >
                  {stats.currentStreak}
                </span>
                <span
                  className={
                    stats.currentStreak > 0
                      ? "text-orange-600"
                      : "text-habit-600"
                  }
                >
                  {" "}
                  day streak
                </span>
              </div>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-habit-900">
                {stats.totalCompleted}
              </span>
              <span className="text-habit-600"> completed</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleToggle}
            className={`rounded-full px-6 py-2 font-semibold transition-all ${
              isCompletedToday
                ? "bg-green-500 text-white hover:bg-green-600"
                : "border-2 border-habit-300 text-habit-700 hover:border-habit-400"
            }`}
          >
            {isCompletedToday ? "✓ Done" : "Log"}
          </button>
          <button
            onClick={handleDelete}
            className={`rounded px-3 py-1 text-xs font-medium transition-all ${
              isDeleting
                ? "bg-red-500 text-white"
                : "text-habit-600 hover:bg-habit-100"
            }`}
          >
            {isDeleting ? "Confirm?" : "Delete"}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-habit-600">
            {Math.round(stats.completionRate)}% completion
          </span>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-habit-200">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
      </div>
    </div>
  );
}
