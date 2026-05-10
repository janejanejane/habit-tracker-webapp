# Habit Tracker

A modern web application to track daily habits, build streaks, and achieve your goals. Built with Next.js 16, React 19, Tailwind CSS, and TypeScript. Features a robust storage layer with comprehensive CRUD operations, statistics calculations, and 53 passing unit tests. All components and library files are fully documented with comprehensive JSDoc comments.

## Features

- ✅ Create, edit, and delete habits
- ✅ Daily/weekly habit tracking
- ✅ Completion toggle for quick logging
- ✅ Streak tracking (current & longest)
- ✅ Completion rate visualization
- ✅ Color-coded habits with icons
- ✅ Local storage persistence with robust CRUD operations
- ✅ Responsive design
- ✅ Real-time statistics (streaks, completion rates, progress tracking)
- ✅ **Robust storage layer with date serialization and ID generation**
- ✅ **Comprehensive JSDoc documentation for all components and libraries**
- ✅ **53 passing unit tests with full storage coverage**
- ✅ Type-safe with TypeScript strict mode

## Tech Stack

- **Framework**: Next.js 16.2.4 (App Router with Turbopack)
- **React**: React 19 (Latest with hooks)
- **Styling**: Tailwind CSS 3.4.1
- **Language**: TypeScript 5.6.0 (strict mode)
- **Storage**: Browser LocalStorage with CRUD pattern
- **Date Handling**: date-fns (locale-aware formatting)
- **Testing**: Jest 29.7.0 + React Testing Library 16.0.0
- **Documentation**: JSDoc with comprehensive comments

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

## Documentation

All React components and core library files are fully documented with JSDoc comments. You can find:

- Top-level summaries and file purposes at the top of each file in `/components` and `/lib`
- JSDoc for every function, prop, and component
- Inputs, outputs, side effects, and usage examples in the code

**See the source code for up-to-date documentation and usage examples.**

- **Current Streak**: Days/weeks completed consecutively
- **Total Completed**: Total number of completions
- **Completion Rate**: Visual progress bar

### Deleting Habits

1. Click the "Delete" button on a habit
2. Click "Confirm?" within 3 seconds to confirm deletion
3. The habit and all associated logs will be removed

## Project Structure

````
habit-tracker-webapp/
├── lib/                       # Core business logic
│   ├── types.ts               # TypeScript interfaces (User, Habit, HabitLog, UserStats)
│   └── storage.ts             # Complete data persistence layer with CRUD operations
├── app/                       # Next.js App Router directory
│   ├── page.tsx              # Home page (renders Dashboard)
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/                # UI components (13 total, all JSDoc documented)
│   ├── Dashboard.tsx         # Main page layout with state management
│   ├── HabitManager.tsx      # Core habit logic & CRUD operations
│   ├── HabitList.tsx         # Container for habit items
│   ├── HabitItem.tsx         # Individual habit card with actions
│   ├── HabitForm.tsx         # Form wrapper
│   ├── CreateHabitForm.tsx   # Form input with validation
│   ├── Header.tsx            # Dashboard header with date/stats
│   ├── Sidebar.tsx           # Quick stats panel
│   ├── DateSelector.tsx      # Date picker with navigation
│   ├── HabitGrid.tsx         # Responsive grid container
│   ├── ProgressBar.tsx       # Completion percentage visual
│   ├── StreakDisplay.tsx     # Streak badge with emoji
│   └── StatCard.tsx          # Metric display card
All models are defined in `lib/types.ts` with full JSDoc documentation.

### Habit

```typescript
interface Habit {
  id: string;                                    // Auto-generated: habit-${timestamp}-${randomString}
  userId: string;                                // Current user ID
  name: string;                                  // Habit name (required)
  description?: string;                          // Optional description
  color: string;                                 // Tailwind color (habit-red, habit-blue, etc.)
  icon?: string;                                 // Emoji icon
  frequency: 'daily' | 'weekly';                 // Tracking frequency
  targetDays?: number;                           // Target days per week
  createdAt: Date;                               // Creation timestamp
  updatedAt: Date;                               // Last update timestamp
  isActive: boolean;                             // Active status
}
````

### HabitLog

```typescript
interface HabitLog {
  id: string; // Auto-generated: log-${timestamp}-${randomString}
  habitId: string; // Reference to Habit
  userId: string; // Current user ID
  date: Date; // Log date
  completed: boolean; // Completion status
  notes?: string; // Optional notes
  createdAt: Date; // Creation timestamp
}
```

### UserStats

````typescript
interface UserStats {
  habitId: string;                               // Reference to Habit
  currentStreak: number;                         // Consecutive days completed
  longestStreak: number;                         // All-time longest streak
  totalCompleted: number;                        // Total completions
  completionRate: number;                        // Percentage 0-100
  lastCompletedDate?: Date;                      // Most recent completion

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
````

### UserStats

````typescript
{
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  completionRate: number;  // 0-100
  lastCompletedDate?: Date;
}
```Storage API Reference

All storage functions are defined in `lib/storage.ts` with complete JSDoc documentation.

### Habit Operations

```typescript
habitStorage.createHabit(data: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>)
// Creates new habit with auto-generated ID. Returns: Habit

habitStorage.getAllHabits(): Habit[]
// Returns array of all habits from localStorage

habitStorage.updateHabit(id: string, updates: Partial<Habit>): Habit
// Updates habit properties. Returns: Updated Habit

habitStorage.deleteHabit(id: string): void
// Removes habit and all associated logs
````

### Log Operations

```typescript
habitStorage.logCompletion(habitId: string, date: Date, completed: boolean): void
// Creates or updates completion log for a date

habitStorage.getAllLogs(): HabitLog[]
// Returns array of all logs from localStorage
```

### Statistics

````typescript
calculateStats(habitId: string): UserStats
// Calculates comprehensive stats for a habit:
// - currentStreak: consecutive days completed ending today
// - longestStreak: all-time longest streak
// - totalCompleted: total completions ever
// -Available Scripts

```bash
# Development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests (Jest + React Testing Library)
npm test

# Run tests in watch mode
npm test -- --watch

# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix
````

### Phase 2: Backend & Authentication

- [ ] User authentication (NextAuth.js)
- [ ] Backend database (PostgreSQL + Prisma)
- [ ] API routes for CRUD operations
- [ ] Multi-device sync

### Phase 3: Advanced Features

- [ ] Habit reminders & notifications (email/push)
- [ ] Advanced analytics dashboard
- [ ] Habit templates & suggestions
- [ ] Social sharing & leaderboards
- [ ] Habit insights & recommendations

### Phase 4: UI/UX Enhancements

- [ ] Dark mode support
- [ ] Customizable themes
- [ ] Export data (CSV/PDF)
- [ ] Mobile-optimized UI

### Phase 5: Expansion

- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] API for third-party integrationsbit objects
- `habit_logs_db` - Array of all HabitLog objects

**Storage Pattern**: The app uses a CRUD pattern with localStorage:

- **Create**: `habitStorage.createHabit()` generates ID via `Date.now()`
- **Read**: `habitStorage.getAllHabits()`, `habitStorage.getAllLogs()`
- **Update**: `habitStorage.updateHabit()`, `habitStorage.logCompletion()`
- **Delete**: `habitStorage.deleteHabit()`

### Important Notes

- LocalStorage is limited to ~5-10MB per domain
- Data persists across browser sessions
- Clearing browser data will remove all habits
- **For production**: Migrate to a backend database (PostgreSQL + Prisma recommended)
  npm test # Run all tests
  npm test -- --coverage # Run with coverage report
  npm test -- --watch # Watch mode for development

```

### Build & Performance

- **Build Tool**: Turbopack (faster than Webpack)
- **Bundle Size**: Optimized with tree-shaking and code splitting
- **Performance**: Streaming SSR with React 19
- **Hydration**: Fixed hydration mismatches with useEffect patterns lib/storage.ts (storage layer)
```

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
