# Component Breakdown

This document provides a detailed breakdown of the key components in the Habit Tracker & Routine Planner.

## Dashboard Components (`src/components/dashboard/`)
- **`Header.tsx`**: Contains the App title, current date (`LLLL d, yyyy`), and the "Export / Print" button.
- **`TodaySummary.tsx`**: A card displaying a circular progress bar (percentage) and a breakdown of habits and routines completed today.
- **`StreakDisplay.tsx`**: Shows the total number of active streaks and a "Best Streak" trophy card highlight.

## Habit Components (`src/components/habits/`)
- **`HabitList.tsx`**: The container for the habits section. Manages the **DndContext** and **SortableContext** for reordering.
- **`HabitItem.tsx`**: A single habit row. Features:
  - Drag handle (Grip icon)
  - 💧 Emoji and name
  - Rolling 7-day checkbox view
  - Actions: Edit (opening `HabitForm`) and Delete (via `AlertDialog` confirmation).
- **`HabitForm.tsx`**: A dialog-based form for creating or editing habits. Uses **Base UI Dialog** for the modal.
- **`HabitGrid.tsx`**: A monthly table view showing completions for every day of the current month.

## Routine Components (`src/components/routines/`)
- **`RoutineBlock.tsx`**: The orchestrator for the morning, afternoon, and evening sections. Each section has its own **DndContext** for independent reordering within the block.
- **`RoutineItem.tsx`**: A single routine task. Features:
  - Drag handle
  - Checkbox for completion
  - Task name and optional time estimate icon (Clock)
  - Actions: Edit (opening `RoutineForm`) and Delete (via `AlertDialog` confirmation).
- **`RoutineForm.tsx`**: A dialog-based form for routine tasks with a "Time Estimate" input field.

## Export Components (`src/components/export/`)
- **`PrintView.tsx`**: A component that is hidden from the screen (`className="hidden"`) but visible in the print media query. It renders a clean, non-interactive version of the dashboard optimized for A4 paper.

## UI Primitives (`src/components/ui/`)
Standard shadcn/ui components:
- `Badge.tsx`, `Button.tsx`, `Card.tsx`, `Checkbox.tsx`, `Dialog.tsx`, `Input.tsx`, `Progress.tsx`, `Separator.tsx`, `DropdownMenu.tsx`.
