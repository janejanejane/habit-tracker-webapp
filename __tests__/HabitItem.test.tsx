import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import HabitItem from "@/components/HabitItem";
import { Habit, HabitLog } from "@/lib/types";

// Mock calculateStats
jest.mock("@/lib/storage", () => ({
  calculateStats: jest.fn(() => ({
    habitId: "habit-1",
    currentStreak: 5,
    longestStreak: 10,
    totalCompleted: 25,
    completionRate: 80,
    lastCompletedDate: new Date(),
  })),
}));

describe("HabitItem Component", () => {
  const mockHabit: Habit = {
    id: "habit-1",
    userId: "user1",
    name: "Morning Exercise",
    description: "30 minute workout",
    color: "#3B82F6",
    icon: "🏃",
    frequency: "daily",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render habit name and description", () => {
      render(
        <HabitItem
          habit={mockHabit}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByText("Morning Exercise")).toBeInTheDocument();
      expect(screen.getByText("30 minute workout")).toBeInTheDocument();
    });

    it("should render habit icon", () => {
      render(
        <HabitItem
          habit={mockHabit}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByText("🏃")).toBeInTheDocument();
    });

    it("should display streak information", () => {
      render(
        <HabitItem
          habit={mockHabit}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByText(/day streak/)).toBeInTheDocument();
    });

    it("should display completion stats", () => {
      render(
        <HabitItem
          habit={mockHabit}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByText(/completed/)).toBeInTheDocument();
    });

    it("should display progress bar", () => {
      const { container } = render(
        <HabitItem
          habit={mockHabit}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByText(/80%/)).toBeInTheDocument();
      const progressDiv = container.querySelector("[style*='width']");
      expect(progressDiv).toBeInTheDocument();
    });

    it("should render flame icon when streak > 0", () => {
      render(
        <HabitItem
          habit={mockHabit}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByText("🔥")).toBeInTheDocument();
    });
  });

  describe("Completion Toggle", () => {
    it("should show 'Log' button when not completed today", () => {
      render(
        <HabitItem
          habit={mockHabit}
          todayLog={undefined}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />,
      );

      const logButton = screen.getByText("Log");
      expect(logButton).toBeInTheDocument();
    });

    it("should show '✓ Done' button when completed today", () => {
      const todayLog: HabitLog = {
        id: "log-1",
        habitId: "habit-1",
        userId: "user1",
        date: new Date(),
        completed: true,
        createdAt: new Date(),
      };

      render(
        <HabitItem
          habit={mockHabit}
          todayLog={todayLog}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />,
      );

      const doneButton = screen.getByText(/✓ Done/);
      expect(doneButton).toBeInTheDocument();
    });

    it("should call onToggle when Log button is clicked", () => {
      render(
        <HabitItem
          habit={mockHabit}
          todayLog={undefined}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />,
      );

      const logButton = screen.getByText("Log");
      fireEvent.click(logButton);

      expect(mockOnToggle).toHaveBeenCalledWith("habit-1", true);
    });

    it("should call onToggle with false when toggling off", () => {
      const todayLog: HabitLog = {
        id: "log-1",
        habitId: "habit-1",
        userId: "user1",
        date: new Date(),
        completed: true,
        createdAt: new Date(),
      };

      render(
        <HabitItem
          habit={mockHabit}
          todayLog={todayLog}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />,
      );

      const doneButton = screen.getByText(/✓ Done/);
      fireEvent.click(doneButton);

      expect(mockOnToggle).toHaveBeenCalledWith("habit-1", false);
    });
  });

  describe("Delete Functionality", () => {
    it("should show 'Delete' button initially", () => {
      render(
        <HabitItem
          habit={mockHabit}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />,
      );

      const deleteButton = screen.getByText("Delete");
      expect(deleteButton).toBeInTheDocument();
    });

    it("should change to 'Confirm?' on first click", async () => {
      render(
        <HabitItem
          habit={mockHabit}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />,
      );

      const deleteButton = screen.getByText("Delete");
      fireEvent.click(deleteButton);

      expect(screen.getByText("Confirm?")).toBeInTheDocument();
    });

    it("should call onDelete on second click", async () => {
      render(
        <HabitItem
          habit={mockHabit}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />,
      );

      const deleteButton = screen.getByText("Delete");
      fireEvent.click(deleteButton);

      await waitFor(() => {
        const confirmButton = screen.getByText("Confirm?");
        fireEvent.click(confirmButton);
      });

      expect(mockOnDelete).toHaveBeenCalledWith("habit-1");
    });

    it("should reset to Delete after 3 seconds without confirmation", async () => {
      jest.useFakeTimers();

      render(
        <HabitItem
          habit={mockHabit}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />,
      );

      const deleteButton = screen.getByText("Delete");
      fireEvent.click(deleteButton);

      expect(screen.getByText("Confirm?")).toBeInTheDocument();

      await act(async () => {
        jest.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(screen.getByText("Delete")).toBeInTheDocument();
      });

      jest.useRealTimers();
    });
  });

  describe("Styling", () => {
    it("should have green styling when completed today", () => {
      const todayLog: HabitLog = {
        id: "log-1",
        habitId: "habit-1",
        userId: "user1",
        date: new Date(),
        completed: true,
        createdAt: new Date(),
      };

      const { container } = render(
        <HabitItem
          habit={mockHabit}
          todayLog={todayLog}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />,
      );

      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv.className).toContain("bg-green-50");
      expect(mainDiv.className).toContain("border-green-500");
    });

    it("should use habit color for left border", () => {
      const { container } = render(
        <HabitItem
          habit={mockHabit}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />,
      );

      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv.style.borderLeftColor).toBe("#3B82F6");
    });
  });

  describe("No Description", () => {
    it("should not render description when not provided", () => {
      const habitNoDesc = { ...mockHabit, description: undefined };

      render(
        <HabitItem
          habit={habitNoDesc}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.queryByText("30 minute workout")).not.toBeInTheDocument();
    });
  });
});
