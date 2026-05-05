# Testing Guide

This project uses **Jest** and **React Testing Library** for unit and component testing.

## Setup

Testing dependencies are already configured in `package.json`:

- `jest` - Test runner
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Jest matchers for DOM assertions
- `jest-environment-jsdom` - DOM environment for tests
- `@types/jest` - TypeScript types for Jest

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (rerun on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Test Structure

Tests are organized in the `__tests__` directory, mirroring the source structure:

```
__tests__/
├── storage.test.ts          # LocalStorage & stats calculations
├── HabitItem.test.tsx       # HabitItem component tests
├── HabitList.test.tsx       # HabitList component tests
└── types.test.ts            # TypeScript type validation
```

## Test Coverage

Current test coverage includes:

### Storage Utility (`storage.test.ts`)

- **Habit Operations**: create, read, update, delete
- **Log Operations**: create, retrieve, update, delete
- **Statistics**: streak calculation, completion rate, total completed

### HabitItem Component (`HabitItem.test.tsx`)

- **Rendering**: habit name, description, icon, stats, progress bar, streak icon
- **Completion Toggle**: Log/Done button states and callbacks
- **Delete Functionality**: delete confirmation flow
- **Styling**: green styling when completed, custom colors

### HabitList Component (`HabitList.test.tsx`)

- **Rendering**: empty state, list of habits
- **Props Passing**: correct data passed to child components
- **Layout**: grid structure

### Types (`types.test.ts`)

- **User Type**: required and optional fields
- **Habit Type**: daily/weekly variants, optional fields
- **HabitLog Type**: completion logging
- **UserStats Type**: streak and completion statistics

## Key Testing Patterns

### LocalStorage Mocking

```typescript
// Automatically mocked in jest.setup.js
beforeEach(() => {
  localStorage.clear(); // Reset between tests
});
```

### Component Mocking

```typescript
jest.mock("@/components/HabitItem", () => {
  return function MockHabitItem() { ... };
});
```

### Async Testing

```typescript
await waitFor(() => {
  expect(screen.getByText("text")).toBeInTheDocument();
});
```

### Timer Management

```typescript
jest.useFakeTimers();
jest.advanceTimersByTime(3000);
jest.useRealTimers();
```

## Best Practices

1. **Clear Test Names**: Use descriptive names that explain what is being tested
2. **Arrange-Act-Assert**: Structure tests with setup, action, and verification
3. **Isolated Tests**: Each test should be independent; use `beforeEach` for setup
4. **Mock External Dependencies**: Mock localStorage, child components, and API calls
5. **Test User Behavior**: Focus on what users see and do, not implementation details
6. **Keep Tests Simple**: One assertion per test when possible

## Example Test

```typescript
it("should create a new habit with auto-generated id", () => {
  const habitData = {
    userId: "user1",
    name: "Exercise",
    color: "#3B82F6",
    frequency: "daily",
    isActive: true,
  };

  const habit = habitStorage.createHabit(habitData);

  expect(habit.id).toBeDefined();
  expect(habit.name).toBe("Exercise");
  expect(habit.createdAt).toBeInstanceOf(Date);
});
```

## Debugging Tests

### Run Single Test File

```bash
npm test storage.test
```

### Run Specific Test

```bash
npm test -- --testNamePattern="should create a new habit"
```

### Verbose Output

```bash
npm test -- --verbose
```

### Debug in Chrome DevTools

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Common Assertions

```typescript
// Presence
expect(element).toBeInTheDocument();
expect(screen.getByText("text")).toBeInTheDocument();

// Content
expect(element).toHaveTextContent("text");
expect(input).toHaveValue("value");

// Classes & Styles
expect(element).toHaveClass("className");
expect(element.style.color).toBe("red");

// Callbacks
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith("arg");

// Arrays
expect(array).toHaveLength(3);
expect(array).toContain("item");
```

## Extending Test Coverage

When adding new features:

1. Write a test for the new functionality
2. Run `npm run test:coverage` to see coverage gaps
3. Aim for >80% coverage on critical paths
4. Update existing tests if behavior changes

## Continuous Integration

These tests can be integrated into CI/CD pipelines:

```bash
# Example GitHub Actions
npm run test -- --coverage --watchAll=false
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library Docs](https://testing-library.com/react)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
