# Habit Tracker

A modern web application to track daily habits, build streaks, and achieve your goals. Built with Next.js 14, Tailwind CSS, and TypeScript.

## Features

- ✅ Create, edit, and delete habits
- ✅ Daily/weekly habit tracking
- ✅ Completion toggle for quick logging
- ✅ Streak tracking (current & longest)
- ✅ Completion rate visualization
- ✅ Color-coded habits with icons
- ✅ Local storage persistence
- ✅ Responsive design
- ✅ Real-time statistics

## Tech Stack

- **Framework**: Next.js 16
- **React**: React 19
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Storage**: Browser LocalStorage
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd habit-tracker-webapp
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating a Habit

1. Click the "+ New Habit" button
2. Enter a habit name (required)
3. Add an optional description
4. Choose frequency (daily/weekly)
5. Select an icon emoji and color
6. Click "Create Habit"

### Tracking Habits

1. Click the "Log" button on a habit card to mark it complete for today
2. Once completed, it will turn green with a "✓ Done" button
3. Click again to uncheck

### Viewing Statistics

Each habit card shows:

- **Current Streak**: Days/weeks completed consecutively
- **Total Completed**: Total number of completions
- **Completion Rate**: Visual progress bar

### Deleting Habits

1. Click the "Delete" button on a habit
2. Click "Confirm?" within 3 seconds to confirm deletion
3. The habit and all associated logs will be removed

## Project Structure

```
habit-tracker-webapp/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/             # Reusable components
│   ├── HabitTracker.tsx   # Main app component
│   ├── HabitList.tsx      # Habit list container
│   ├── HabitItem.tsx      # Individual habit card
│   └── CreateHabitForm.tsx # Create habit form
├── lib/                    # Utilities & types
│   ├── types.ts           # TypeScript interfaces
│   ├── storage.ts         # LocalStorage operations
│   └── hooks/             # Custom React hooks (future)
└── public/                 # Static assets
```

## Data Models

### Habit

```typescript
{
  id: string;
  userId: string;
  name: string;
  description?: string;
  color: string;           // Hex color
  icon?: string;           // Emoji
  frequency: 'daily' | 'weekly';
  targetDays?: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
```

### HabitLog

```typescript
{
  id: string;
  habitId: string;
  userId: string;
  date: Date;
  completed: boolean;
  notes?: string;
  createdAt: Date;
}
```

### UserStats

```typescript
{
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  completionRate: number;  // 0-100
  lastCompletedDate?: Date;
}
```

## API Reference (Internal Storage)

### Habit Operations

- `habitStorage.getAllHabits()` - Get all habits
- `habitStorage.getHabit(id)` - Get single habit
- `habitStorage.createHabit(data)` - Create new habit
- `habitStorage.updateHabit(id, updates)` - Update habit
- `habitStorage.deleteHabit(id)` - Delete habit

### Log Operations

- `habitStorage.getAllLogs()` - Get all logs
- `habitStorage.getLogsByHabit(habitId)` - Get logs for specific habit
- `habitStorage.logCompletion(habitId, date, completed)` - Log completion
- `habitStorage.updateLog(id, updates)` - Update log
- `habitStorage.deleteLog(id)` - Delete log

### Statistics

- `calculateStats(habitId)` - Calculate habit statistics

## Future Enhancements

- [ ] User authentication
- [ ] Backend database (PostgreSQL + Prisma)
- [ ] Habit reminders & notifications
- [ ] Advanced analytics dashboard
- [ ] Habit templates
- [ ] Social sharing
- [ ] Dark mode
- [ ] Export data (CSV/PDF)
- [ ] Mobile app (React Native)

## Development

### Building for Production

```bash
npm run build
npm start
```

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## LocalStorage

Data is stored in browser localStorage with the following keys:

- `habits_db` - All habits
- `habit_logs_db` - All habit logs

**Note**: LocalStorage is limited to ~5-10MB. For production, migrate to a backend database.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions, please open an issue on GitHub.
