"use client";

import { useState, useEffect } from "react";
import { Habit, HabitLog } from "@/lib/types";
import { habitStorage, calculateStats } from "@/lib/storage";
import HabitList from "./HabitList";
import CreateHabitForm from "./CreateHabitForm";
import { format } from "date-fns";

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    setHabits(habitStorage.getAllHabits());
    setLogs(habitStorage.getAllLogs());
    setLoading(false);
  }, []);

  const handleCreateHabit = (
    habitData: Omit<Habit, "id" | "createdAt" | "updatedAt">,
  ) => {
    const newHabit = habitStorage.createHabit(habitData);
    setHabits((prev) => [...prev, newHabit]);
    setIsCreating(false);
  };

  const handleToggleCompletion = (habitId: string, completed: boolean) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const updatedLog = habitStorage.logCompletion(habitId, today, completed);
    setLogs((prev) => {
      const existing = prev.find(
        (l) =>
          l.habitId === habitId &&
          new Date(l.date).toDateString() === today.toDateString(),
      );
      if (existing) {
        return prev.map((l) =>
          l.id === existing.id ? { ...l, completed } : l,
        );
      }
      return [...prev, updatedLog];
    });
  };

  const handleDeleteHabit = (habitId: string) => {
    habitStorage.deleteHabit(habitId);
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    setLogs((prev) => prev.filter((l) => l.habitId !== habitId));
  };

  if (loading) {
    return <div className="text-center text-habit-600">Loading...</div>;
  }

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const completedToday = logs.filter((log) => {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);
    return logDate.getTime() === todayDate.getTime() && log.completed;
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-habit-50 to-habit-100 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-habit-900">Habit Tracker</h1>
          <p className="mt-2 text-lg text-habit-600">
            {format(todayDate, "EEEE, MMMM d, yyyy")}
          </p>
          <div className="mt-4 rounded-lg bg-white p-4">
            <p className="text-sm text-habit-600">
              <span className="font-semibold text-habit-900">
                {completedToday}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-habit-900">
                {habits.length}
              </span>{" "}
              habits completed today
            </p>
          </div>
        </div>

        {/* Habits List */}
        <div className="mb-8">
          {habits.length > 0 ? (
            <HabitList
              habits={habits}
              logs={logs}
              onToggleCompletion={handleToggleCompletion}
              onDeleteHabit={handleDeleteHabit}
            />
          ) : (
            <div className="rounded-lg border-2 border-dashed border-habit-300 bg-habit-50 p-8 text-center">
              <p className="text-habit-600">
                No habits yet. Create one to get started!
              </p>
            </div>
          )}
        </div>

        {/* Create Form or Button */}
        <div className="sticky bottom-4">
          {isCreating ? (
            <CreateHabitForm
              onSubmit={handleCreateHabit}
              onCancel={() => setIsCreating(false)}
            />
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white hover:bg-blue-600 transition-all shadow-lg"
            >
              + New Habit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
