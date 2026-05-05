import { User, Habit, HabitLog, UserStats } from "@/lib/types";

describe("TypeScript Types", () => {
  describe("User Type", () => {
    it("should allow creating a valid User object", () => {
      const user: User = {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        passwordHash: "hashed_password",
        createdAt: new Date(),
        updatedAt: new Date(),
        preferences: {
          theme: "light",
          notifications: true,
          timezone: "UTC",
        },
      };

      expect(user.id).toBe("user-1");
      expect(user.email).toBe("test@example.com");
    });

    it("should make preferences optional", () => {
      const user: User = {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        passwordHash: "hashed_password",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(user.preferences).toBeUndefined();
    });
  });

  describe("Habit Type", () => {
    it("should create a valid daily Habit", () => {
      const habit: Habit = {
        id: "habit-1",
        userId: "user-1",
        name: "Morning Exercise",
        description: "30 minute workout",
        color: "#3B82F6",
        icon: "🏃",
        frequency: "daily",
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };

      expect(habit.frequency).toBe("daily");
      expect(habit.name).toBe("Morning Exercise");
    });

    it("should create a valid weekly Habit", () => {
      const habit: Habit = {
        id: "habit-1",
        userId: "user-1",
        name: "Meditation",
        color: "#8B5CF6",
        frequency: "weekly",
        targetDays: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };

      expect(habit.frequency).toBe("weekly");
      expect(habit.targetDays).toBe(3);
    });

    it("should make optional fields truly optional", () => {
      const habit: Habit = {
        id: "habit-1",
        userId: "user-1",
        name: "Read",
        color: "#EF4444",
        frequency: "daily",
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };

      expect(habit.description).toBeUndefined();
      expect(habit.icon).toBeUndefined();
      expect(habit.targetDays).toBeUndefined();
    });
  });

  describe("HabitLog Type", () => {
    it("should create a valid HabitLog", () => {
      const log: HabitLog = {
        id: "log-1",
        habitId: "habit-1",
        userId: "user-1",
        date: new Date(),
        completed: true,
        notes: "Felt great!",
        createdAt: new Date(),
      };

      expect(log.completed).toBe(true);
      expect(log.notes).toBe("Felt great!");
    });

    it("should make notes optional", () => {
      const log: HabitLog = {
        id: "log-1",
        habitId: "habit-1",
        userId: "user-1",
        date: new Date(),
        completed: false,
        createdAt: new Date(),
      };

      expect(log.notes).toBeUndefined();
    });
  });

  describe("UserStats Type", () => {
    it("should create valid UserStats", () => {
      const stats: UserStats = {
        habitId: "habit-1",
        currentStreak: 5,
        longestStreak: 10,
        totalCompleted: 25,
        completionRate: 80,
        lastCompletedDate: new Date(),
      };

      expect(stats.currentStreak).toBe(5);
      expect(stats.completionRate).toBe(80);
    });

    it("should make lastCompletedDate optional", () => {
      const stats: UserStats = {
        habitId: "habit-1",
        currentStreak: 0,
        longestStreak: 0,
        totalCompleted: 0,
        completionRate: 0,
      };

      expect(stats.lastCompletedDate).toBeUndefined();
    });
  });
});
