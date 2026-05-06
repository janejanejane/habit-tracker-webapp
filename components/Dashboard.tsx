/**
 * Dashboard Component - Main page layout for the Habit Tracker application.
 *
 * This component provides the overall page structure and layout for the habit
 * tracking dashboard. It includes the header, sidebar, and main content area
 * with habit management functionality. The dashboard follows the spec's
 * component hierarchy with Header, HabitGrid, and Sidebar components.
 *
 * @fileoverview Main dashboard layout component
 * @author Habit Tracker Team
 * @version 1.0.0
 */

"use client";

import HabitManager from "./HabitManager";
import Header from "./Header";
import Sidebar from "./Sidebar";
import DateSelector from "./DateSelector";
import { useState } from "react";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalHabits, setTotalHabits] = useState(0);
  const [completedToday, setCompletedToday] = useState(0);

  const handleStatsUpdate = (habits: number, completed: number) => {
    setTotalHabits(habits);
    setCompletedToday(completed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-habit-50 to-habit-100 px-4 py-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.6fr_0.8fr]">
        <main>
          <Header
            today={selectedDate}
            completedToday={completedToday}
            totalHabits={totalHabits}
          />

          <div className="mb-6">
            <DateSelector
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>

          <HabitManager
            selectedDate={selectedDate}
            onStatsUpdate={handleStatsUpdate}
          />
        </main>

        <Sidebar totalHabits={totalHabits} completedToday={completedToday} />
      </div>
    </div>
  );
}
