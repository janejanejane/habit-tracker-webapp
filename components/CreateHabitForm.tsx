"use client";

import { Habit } from "@/lib/types";
import { useState } from "react";

interface CreateHabitFormProps {
  onSubmit: (habit: Omit<Habit, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

const COLOR_OPTIONS = [
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#06B6D4",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
];

const EMOJI_OPTIONS = [
  "🏃",
  "📚",
  "🧘",
  "💪",
  "🥗",
  "😴",
  "🎨",
  "💻",
  "🎵",
  "📖",
];

export default function CreateHabitForm({
  onSubmit,
  onCancel,
}: CreateHabitFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [icon, setIcon] = useState(EMOJI_OPTIONS[0]);
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      userId: "default-user",
      name: name.trim(),
      description: description.trim(),
      color,
      icon,
      frequency,
      isActive: true,
    });

    setName("");
    setDescription("");
    setColor(COLOR_OPTIONS[0]);
    setIcon(EMOJI_OPTIONS[0]);
  };

  return (
    <div className="rounded-lg border-2 border-habit-300 bg-white p-6">
      <h2 className="mb-4 text-2xl font-bold text-habit-900">
        Create a New Habit
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-habit-700">
            Habit Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Morning Exercise"
            className="mt-1 w-full rounded-lg border-2 border-habit-300 px-3 py-2 text-habit-900 placeholder-habit-400 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-habit-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional details about your habit"
            rows={3}
            className="mt-1 w-full rounded-lg border-2 border-habit-300 px-3 py-2 text-habit-900 placeholder-habit-400 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-habit-700">
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) =>
                setFrequency(e.target.value as "daily" | "weekly")
              }
              className="mt-1 w-full rounded-lg border-2 border-habit-300 px-3 py-2 text-habit-900 focus:border-blue-500 focus:outline-none"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-habit-700">
              Icon
            </label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="mt-1 w-full rounded-lg border-2 border-habit-300 px-3 py-2 text-habit-900 focus:border-blue-500 focus:outline-none"
            >
              {EMOJI_OPTIONS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-habit-700">
            Color
          </label>
          <div className="mt-2 flex gap-3">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`h-8 w-8 rounded-full transition-all ${
                  color === c ? "ring-2 ring-offset-2 ring-habit-400" : ""
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
          >
            Create Habit
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border-2 border-habit-300 px-4 py-2 font-semibold text-habit-700 hover:bg-habit-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
