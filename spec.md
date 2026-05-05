# Habit Tracker - Project Specification

## Project Overview

A Next.js web application for tracking daily habits with visual progress indicators, streaks, and goal management. Built with Next.js 14+, Tailwind CSS, and TypeScript.

---

## Data Structure

### User Model

```typescript
interface User {
  id: string; // UUID
  email: string; // Unique email
  name: string; // User display name
  passwordHash: string; // Hashed password
  createdAt: Date; // Account creation timestamp
  updatedAt: Date; // Last profile update
  preferences?: {
    theme?: "light" | "dark";
    notifications?: boolean;
    timezone?: string;
  };
}
```

### Habit Model

```typescript
interface Habit {
  id: string; // UUID
  userId: string; // Reference to user
  name: string; // e.g., "Morning Exercise"
  description?: string; // Optional details
  color: string; // Hex color for UI (e.g., "#3B82F6")
  icon?: string; // Emoji or icon name
  frequency: "daily" | "weekly"; // Tracking frequency
  targetDays?: number; // For weekly habits (e.g., 3 days/week)
  createdAt: Date; // Habit creation timestamp
  updatedAt: Date; // Last modified timestamp
  isActive: boolean; // Soft delete flag
}

interface HabitLog {
  id: string; // UUID
  habitId: string; // Reference to Habit
  userId: string; // Reference to user
  date: Date; // Log date (YYYY-MM-DD)
  completed: boolean; // Completion status
  notes?: string; // Optional user notes
  createdAt: Date; // Log creation timestamp
}

interface UserStats {
  habitId: string;
  currentStreak: number; // Days/weeks completed consecutively
  longestStreak: number; // All-time best streak
  totalCompleted: number; // Total completions
  completionRate: number; // Percentage (0-100)
  lastCompletedDate?: Date; // Most recent completion
}
```

---

## Component Hierarchy

```
App Layout
├── Dashboard (Main Page)
│   ├── Header
│   │   ├── UserMenu
│   │   └── DateSelector
│   ├── HabitGrid
│   │   └── HabitCard (Repeating)
│   │       ├── HabitHeader
│   │       ├── ProgressBar
│   │       ├── StreakDisplay
│   │       ├── CompletionToggle
│   │       └── HabitActions (Menu)
│   └── Sidebar
│       ├── NavigationMenu
│       └── QuickStats
├── HabitDetail (Modal/Page)
│   ├── HabitForm
│   │   ├── InputField
│   │   ├── ColorPicker
│   │   ├── IconSelector
│   │   └── FormActions
│   ├── LogHistory
│   │   └── LogEntry (Repeating)
│   └── Statistics
│       ├── StreakCard
│       ├── CompletionChart
│       └── MetricsCard
├── CreateHabit (Modal/Page)
│   └── HabitForm
├── Settings
│   ├── ProfileSection
│   ├── PreferencesSection
│   └── DataManagement
└── Navigation
    ├── Header
    └── SideNav (optional)
```

---

## Key Components Breakdown

### Page Components

| Component     | Path                       | Purpose                                    |
| ------------- | -------------------------- | ------------------------------------------ |
| `Dashboard`   | `app/page.tsx`             | Main habit overview and daily tracking     |
| `HabitDetail` | `app/habits/[id]/page.tsx` | Detailed view of single habit with history |
| `CreateHabit` | `app/habits/new/page.tsx`  | Form to create new habit                   |
| `Settings`    | `app/settings/page.tsx`    | User settings and preferences              |

### Reusable Components

| Component         | Path                             | Purpose                                   |
| ----------------- | -------------------------------- | ----------------------------------------- |
| `HabitCard`       | `components/HabitCard.tsx`       | Display habit with completion toggle      |
| `HabitForm`       | `components/HabitForm.tsx`       | Create/edit habit details                 |
| `HabitGrid`       | `components/HabitGrid.tsx`       | Grid layout of habit cards                |
| `ProgressBar`     | `components/ProgressBar.tsx`     | Visual progress indicator                 |
| `StreakDisplay`   | `components/StreakDisplay.tsx`   | Show current/longest streaks              |
| `DateSelector`    | `components/DateSelector.tsx`    | Date picker for viewing history           |
| `ColorPicker`     | `components/ColorPicker.tsx`     | Select habit color                        |
| `IconSelector`    | `components/IconSelector.tsx`    | Select habit icon/emoji                   |
| `CompletionChart` | `components/CompletionChart.tsx` | Visual stats chart (Chart.js or Recharts) |
| `StatCard`        | `components/StatCard.tsx`        | Metric display card                       |
| `Header`          | `components/Header.tsx`          | Top navigation bar                        |
| `Sidebar`         | `components/Sidebar.tsx`         | Left navigation (optional)                |

---

## Data Flow

```
User Action → Component Event → API Route → Database
                                    ↓
                            Response → Context/State Update → Re-render
```

### API Routes

```
POST   /api/habits              → Create habit
GET    /api/habits              → Fetch all user habits
PATCH  /api/habits/[id]         → Update habit
DELETE /api/habits/[id]         → Delete habit

POST   /api/habits/[id]/log     → Log habit completion
GET    /api/habits/[id]/logs    → Fetch habit logs
DELETE /api/habits/[id]/logs/[logId] → Delete log

GET    /api/stats/[habitId]     → Get habit statistics
```

---

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: React Context API or Zustand
- **Database**: PostgreSQL (or your preference)
- **ORM**: Prisma
- **Charts**: Recharts or Chart.js
- **UI Components**: Shadcn/ui (optional)
- **Date Handling**: date-fns or Day.js

---

## Features (MVP)

- ✅ Create, read, update, delete habits
- ✅ Daily/weekly habit tracking
- ✅ Completion toggle with date history
- ✅ Visual streak tracking
- ✅ Color-coded habits
- ✅ Completion rate statistics
- ✅ Responsive design
- ✅ User authentication (basic)

---

## Future Enhancements

- Habit reminders (notifications)
- Social sharing of streaks
- Habit recommendations
- Advanced analytics dashboard
- Mobile app (React Native)
- Dark mode
- Export habit logs (CSV/PDF)
