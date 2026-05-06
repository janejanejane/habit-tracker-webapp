/**
 * HabitGrid Component - Layout container for displaying habits in a responsive grid.
 *
 * This component provides a consistent grid layout for rendering habit items.
 * It uses Tailwind CSS to create a responsive grid with consistent gap spacing.
 *
 * @fileoverview Responsive grid layout container for habits
 * @author Habit Tracker Team
 * @version 1.0.0
 */

import type { ReactNode } from "react";

/**
 * Props for the HabitGrid component
 * @interface HabitGridProps
 * @property {ReactNode} children - The habit items to render in the grid
 *
 * @example
 * ```tsx
 * <HabitGrid>
 *   <HabitItem habit={habit1} />
 *   <HabitItem habit={habit2} />
 * </HabitGrid>
 * ```
 */
interface HabitGridProps {
  children: ReactNode;
}

/**
 * HabitGrid - Container component for displaying habits in a responsive grid layout.
 *
 * This component provides a styled grid container that automatically adjusts spacing
 * and responsiveness based on screen size. It wraps habit items for a consistent
 * layout throughout the application.
 *
 * @component
 * @param {HabitGridProps} props - The props for the component
 * @returns {JSX.Element} The rendered grid container
 *
 * @example
 * ```tsx
 * <HabitGrid>
 *   {habits.map((habit) => (
 *     <HabitItem key={habit.id} habit={habit} />
 *   ))}
 * </HabitGrid>
 * ```
 */
export default function HabitGrid({ children }: HabitGridProps) {
  return <div className="grid gap-4">{children}</div>;
}
