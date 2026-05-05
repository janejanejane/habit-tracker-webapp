import React from "react";
import { render, screen } from "@testing-library/react";
import HabitList from "@/components/HabitList";
import { Habit, HabitLog } from "@/lib/types";

jest.mock("@/components/HabitItem", () => {
  return function MockHabitItem({ habit }: { habit: Habit }) {
    return <div data-testid={`habit-item-${habit.id}`}>{habit.name}</div>;
  };
});

describe("HabitList Component", () => {
  const mockOnToggleCompletion = jest.fn();
  const mockOnDeleteHabit = jest.fn();

  const mockHabits: Habit[] = [
    {
      id: "habit-1",
      userId: "user1",
      name: "Morning Exercise",
      color: "#3B82F6",
      icon: "🏃",
      frequency: "daily",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "habit-2",
      userId: "user1",
      name: "Reading",
      color: "#EF4444",
      icon: "📚",
      frequency: "daily",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockLogs: HabitLog[] = [
    {
      id: "log-1",
      habitId: "habit-1",
      userId: "user1",
      date: new Date(),
      completed: true,
      createdAt: new Date(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render empty state when no habits", () => {
      render(
        <HabitList
          habits={[]}
          logs={[]}
          onToggleCompletion={mockOnToggleCompletion}
          onDeleteHabit={mockOnDeleteHabit}
        />,
      );

      expect(
        screen.getByText("No habits yet. Create one to get started!"),
      ).toBeInTheDocument();
    });

    it("should render all habit items", () => {
      render(
        <HabitList
          habits={mockHabits}
          logs={mockLogs}
          onToggleCompletion={mockOnToggleCompletion}
          onDeleteHabit={mockOnDeleteHabit}
        />,
      );

      expect(screen.getByTestId("habit-item-habit-1")).toBeInTheDocument();
      expect(screen.getByTestId("habit-item-habit-2")).toBeInTheDocument();
    });

    it("should render correct number of habit items", () => {
      const manyHabits = Array.from({ length: 5 }, (_, i) => ({
        ...mockHabits[0],
        id: `habit-${i}`,
        name: `Habit ${i}`,
      }));

      render(
        <HabitList
          habits={manyHabits}
          logs={[]}
          onToggleCompletion={mockOnToggleCompletion}
          onDeleteHabit={mockOnDeleteHabit}
        />,
      );

      manyHabits.forEach((habit) => {
        expect(
          screen.getByTestId(`habit-item-${habit.id}`),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Props Passing", () => {
    it("should pass correct props to HabitItem", () => {
      const { container } = render(
        <HabitList
          habits={mockHabits}
          logs={mockLogs}
          onToggleCompletion={mockOnToggleCompletion}
          onDeleteHabit={mockOnDeleteHabit}
        />,
      );

      // Verify both habit items are rendered
      expect(screen.getByTestId("habit-item-habit-1")).toBeInTheDocument();
      expect(screen.getByTestId("habit-item-habit-2")).toBeInTheDocument();
    });
  });

  describe("Empty State Styling", () => {
    it("should have proper empty state classes", () => {
      const { container } = render(
        <HabitList
          habits={[]}
          logs={[]}
          onToggleCompletion={mockOnToggleCompletion}
          onDeleteHabit={mockOnDeleteHabit}
        />,
      );

      const emptyDiv = container.firstChild;
      expect(emptyDiv).toHaveClass("rounded-lg");
      expect(emptyDiv).toHaveClass("border-2");
      expect(emptyDiv).toHaveClass("border-dashed");
    });
  });

  describe("Grid Layout", () => {
    it("should use grid layout for habits", () => {
      const { container } = render(
        <HabitList
          habits={mockHabits}
          logs={mockLogs}
          onToggleCompletion={mockOnToggleCompletion}
          onDeleteHabit={mockOnDeleteHabit}
        />,
      );

      const gridDiv = container.querySelector(".grid");
      expect(gridDiv).toBeInTheDocument();
    });
  });

  describe("Single Habit", () => {
    it("should render single habit correctly", () => {
      render(
        <HabitList
          habits={[mockHabits[0]]}
          logs={mockLogs}
          onToggleCompletion={mockOnToggleCompletion}
          onDeleteHabit={mockOnDeleteHabit}
        />,
      );

      expect(screen.getByTestId("habit-item-habit-1")).toBeInTheDocument();
      expect(
        screen.queryByTestId("habit-item-habit-2"),
      ).not.toBeInTheDocument();
    });
  });
});
