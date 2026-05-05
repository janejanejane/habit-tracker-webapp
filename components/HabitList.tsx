"use client";

import { Habit, HabitLog } from "@/lib/types";
import HabitItem from "./HabitItem";

interface HabitListProps {
  habits: Habit[];
  logs: HabitLog[];
  onToggleCompletion: (habitId: string, completed: boolean) => void;
  onDeleteHabit: (habitId: string) => void;
}

export default function HabitList({
  habits,
  logs,
  onToggleCompletion,
  onDeleteHabit,
}: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-habit-300 bg-habit-50 p-8 text-center">
        <p className="text-habit-600">
          No habits yet. Create one to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {habits.map((habit) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayLog = logs.find((log) => {
          const logDate = new Date(log.date);
          logDate.setHours(0, 0, 0, 0);
          return (
            log.habitId === habit.id && logDate.getTime() === today.getTime()
          );
        });

        return (
          <HabitItem
            key={habit.id}
            habit={habit}
            todayLog={todayLog}
            onToggle={onToggleCompletion}
            onDelete={onDeleteHabit}
          />
        );
      })}
    </div>
  );
}
