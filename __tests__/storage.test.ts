import { habitStorage, calculateStats } from "@/lib/storage";
import { Habit, HabitLog } from "@/lib/types";

describe("habitStorage - Habit Operations", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("createHabit", () => {
    it("should create a new habit with auto-generated id and timestamps", () => {
      const habitData = {
        userId: "user1",
        name: "Morning Exercise",
        description: "30 minute workout",
        color: "#3B82F6",
        icon: "🏃",
        frequency: "daily" as const,
        isActive: true,
      };

      const habit = habitStorage.createHabit(habitData);

      expect(habit.id).toBeDefined();
      expect(habit.id).toMatch(/^habit-/);
      expect(habit.name).toBe("Morning Exercise");
      expect(habit.createdAt).toBeInstanceOf(Date);
      expect(habit.updatedAt).toBeInstanceOf(Date);
    });

    it("should persist habit to localStorage", () => {
      const habit = habitStorage.createHabit({
        userId: "user1",
        name: "Test Habit",
        color: "#EF4444",
        icon: "📚",
        frequency: "daily",
        isActive: true,
      });

      const habits = habitStorage.getAllHabits();
      expect(habits).toHaveLength(1);
      expect(habits[0].id).toBe(habit.id);
    });
  });

  describe("getAllHabits", () => {
    it("should return empty array when no habits exist", () => {
      const habits = habitStorage.getAllHabits();
      expect(habits).toEqual([]);
    });

    it("should return all created habits", () => {
      habitStorage.createHabit({
        userId: "user1",
        name: "Habit 1",
        color: "#3B82F6",
        frequency: "daily",
        isActive: true,
      });
      habitStorage.createHabit({
        userId: "user1",
        name: "Habit 2",
        color: "#EF4444",
        frequency: "weekly",
        isActive: true,
      });

      const habits = habitStorage.getAllHabits();
      expect(habits).toHaveLength(2);
      expect(habits[0].name).toBe("Habit 1");
      expect(habits[1].name).toBe("Habit 2");
    });
  });

  describe("getHabit", () => {
    it("should return null for non-existent habit", () => {
      const habit = habitStorage.getHabit("non-existent");
      expect(habit).toBeNull();
    });

    it("should return habit by id", () => {
      const created = habitStorage.createHabit({
        userId: "user1",
        name: "Test",
        color: "#3B82F6",
        frequency: "daily",
        isActive: true,
      });

      const habit = habitStorage.getHabit(created.id);
      expect(habit).toEqual(created);
    });
  });

  describe("updateHabit", () => {
    it("should update habit properties", () => {
      const habit = habitStorage.createHabit({
        userId: "user1",
        name: "Original",
        color: "#3B82F6",
        frequency: "daily",
        isActive: true,
      });

      const updated = habitStorage.updateHabit(habit.id, {
        name: "Updated",
        color: "#EF4444",
      });

      expect(updated?.name).toBe("Updated");
      expect(updated?.color).toBe("#EF4444");
      expect(updated?.updatedAt.getTime()).toBeGreaterThan(habit.updatedAt.getTime());
    });

    it("should return null for non-existent habit", () => {
      const result = habitStorage.updateHabit("non-existent", { name: "New" });
      expect(result).toBeNull();
    });
  });

  describe("deleteHabit", () => {
    it("should remove habit from storage", () => {
      const habit = habitStorage.createHabit({
        userId: "user1",
        name: "To Delete",
        color: "#3B82F6",
        frequency: "daily",
        isActive: true,
      });

      habitStorage.deleteHabit(habit.id);
      const habits = habitStorage.getAllHabits();
      expect(habits).toHaveLength(0);
    });

    it("should remove associated logs when deleting habit", () => {
      const habit = habitStorage.createHabit({
        userId: "user1",
        name: "Test",
        color: "#3B82F6",
        frequency: "daily",
        isActive: true,
      });

      habitStorage.logCompletion(habit.id, new Date(), true);
      habitStorage.deleteHabit(habit.id);

      const logs = habitStorage.getAllLogs();
      expect(logs).toHaveLength(0);
    });
  });
});

describe("habitStorage - Log Operations", () => {
  let habit: Habit;

  beforeEach(() => {
    localStorage.clear();
    habit = habitStorage.createHabit({
      userId: "user1",
      name: "Test Habit",
      color: "#3B82F6",
      frequency: "daily",
      isActive: true,
    });
  });

  describe("logCompletion", () => {
    it("should create a new log entry", () => {
      const date = new Date();
      const log = habitStorage.logCompletion(habit.id, date, true);

      expect(log.id).toBeDefined();
      expect(log.habitId).toBe(habit.id);
      expect(log.completed).toBe(true);
      expect(log.date).toEqual(date);
    });

    it("should update existing log for same date", () => {
      const date = new Date();
      const log1 = habitStorage.logCompletion(habit.id, date, true);
      const log2 = habitStorage.logCompletion(habit.id, date, false);

      expect(log2.id).toBe(log1.id);
      expect(log2.completed).toBe(false);
    });

    it("should persist logs to localStorage", () => {
      habitStorage.logCompletion(habit.id, new Date(), true);
      const logs = habitStorage.getAllLogs();
      expect(logs).toHaveLength(1);
    });
  });

  describe("getLogsByHabit", () => {
    it("should return empty array for habit with no logs", () => {
      const logs = habitStorage.getLogsByHabit(habit.id);
      expect(logs).toEqual([]);
    });

    it("should return all logs for a habit", () => {
      habitStorage.logCompletion(habit.id, new Date(), true);
      habitStorage.logCompletion(habit.id, new Date(Date.now() - 86400000), true);

      const logs = habitStorage.getLogsByHabit(habit.id);
      expect(logs).toHaveLength(2);
      expect(logs.every((l) => l.habitId === habit.id)).toBe(true);
    });
  });

  describe("deleteLog", () => {
    it("should remove log from storage", () => {
      const log = habitStorage.logCompletion(habit.id, new Date(), true);
      habitStorage.deleteLog(log.id);

      const logs = habitStorage.getAllLogs();
      expect(logs).toHaveLength(0);
    });
  });
});

describe("calculateStats", () => {
  let habit: Habit;

  beforeEach(() => {
    localStorage.clear();
    habit = habitStorage.createHabit({
      userId: "user1",
      name: "Test Habit",
      color: "#3B82F6",
      frequency: "daily",
      isActive: true,
    });
  });

  it("should return zero stats for habit with no logs", () => {
    const stats = calculateStats(habit.id);

    expect(stats.currentStreak).toBe(0);
    expect(stats.longestStreak).toBe(0);
    expect(stats.totalCompleted).toBe(0);
    expect(stats.completionRate).toBe(0);
  });

  it("should calculate completion rate correctly", () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 3 completed, 2 missed
    habitStorage.logCompletion(habit.id, new Date(today), true);
    habitStorage.logCompletion(habit.id, new Date(today.getTime() - 86400000), true);
    habitStorage.logCompletion(habit.id, new Date(today.getTime() - 2 * 86400000), true);
    habitStorage.logCompletion(habit.id, new Date(today.getTime() - 3 * 86400000), false);
    habitStorage.logCompletion(habit.id, new Date(today.getTime() - 4 * 86400000), false);

    const stats = calculateStats(habit.id);

    expect(stats.totalCompleted).toBe(3);
    expect(stats.completionRate).toBe(60);
  });

  it("should calculate current streak correctly", () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create 3-day streak ending today
    habitStorage.logCompletion(habit.id, new Date(today), true);
    habitStorage.logCompletion(habit.id, new Date(today.getTime() - 86400000), true);
    habitStorage.logCompletion(habit.id, new Date(today.getTime() - 2 * 86400000), true);
    habitStorage.logCompletion(habit.id, new Date(today.getTime() - 3 * 86400000), false);

    const stats = calculateStats(habit.id);
    expect(stats.currentStreak).toBe(3);
  });

  it("should calculate longest streak correctly", () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create 5-day streak in the past, 2-day current streak
    habitStorage.logCompletion(habit.id, new Date(today), true);
    habitStorage.logCompletion(habit.id, new Date(today.getTime() - 86400000), true);
    habitStorage.logCompletion(habit.id, new Date(today.getTime() - 2 * 86400000), false);
    habitStorage.logCompletion(habit.id, new Date(today.getTime() - 3 * 86400000), true);
    habitStorage.logCompletion(habit.id, new Date(today.getTime() - 4 * 86400000), true);
    habitStorage.logCompletion(habit.id, new Date(today.getTime() - 5 * 86400000), true);
    habitStorage.logCompletion(habit.id, new Date(today.getTime() - 6 * 86400000), true);
    habitStorage.logCompletion(habit.id, new Date(today.getTime() - 7 * 86400000), true);

    const stats = calculateStats(habit.id);
    expect(stats.longestStreak).toBe(5);
    expect(stats.currentStreak).toBe(2);
  });
});
