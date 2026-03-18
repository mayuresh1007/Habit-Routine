# State Management & Persistence

This document explains the state management strategy for the Habit Tracker & Routine Planner.

## Zustand Stores

The application uses two primary Zustand stores, both located in `src/store/`.

### 1. `HabitStore` (`habit-store.ts`)
**State Schema:**
- `habits: Habit[]`: Array of habit objects.
- `addHabit`, `updateHabit`, `deleteHabit`: CRUD actions.
- `toggleDay(id, date)`: Toggles completion for a specific date.
- `moveHabit(fromIndex, toIndex)`: Reorders habits in the array.
- `getStreak(id)`: Returns current consecutive days completed.
- `getTodayProgress()`: Returns `{ done, total }` for habits.

### 2. `RoutineStore` (`routine-store.ts`)
**State Schema:**
- `items: { morning: RoutineItem[], afternoon: RoutineItem[], evening: RoutineItem[] }`: Routine tasks by period.
- `completions: Record<string, string[]>`: Stores task IDs completed for each date (`{ "2026-03-17": ["id1", "id2"] }`).
- `addItem`, `updateItem`, `deleteItem`: CRUD by period.
- `toggleComplete(id, date)`: Toggles completion for a task on a specific date.
- `moveItem(period, fromIndex, toIndex)`: Reorders items within a specific period.
- `getTodayProgress()`: Returns `{ done, total }` for routines.

## Persistence Strategy

The application has migrated away from `localStorage` in favor of a robust MongoDB backend via Next.js API Routes.

1. **Initial Runtime**: Upon loading the dashboard, `fetchHabits` and `fetchRoutines` execute authenticated `GET` requests, populating the stores directly from MongoDB.
2. **Optimistic Execution**: When a user marks a habit complete, `set()` is immediately invoked to update the frontend, mimicking zero latency.
3. **Silent Background Sync**: A corresponding `api.patch()` or `api.post()` command is fired into the void. If it fails, the store catches the error and instantly rolls the state back.

## Drag-and-Drop Reordering Logic

Reordering is handled by the `@dnd-kit/sortable` library integrated directly with Mongoose's `bulkWrite`:
1. The component catches the `onDragEnd` event.
2. It identifies the `oldIndex` and `newIndex` of the dragged item and repositions it in the local array.
3. It invokes `reorderHabits` or `reorderRoutines` in the store.
4. The store performs an optimistic UI update.
5. A `PATCH` request (`/api/habits/reorder` or `/api/routines/reorder`) broadcasts the new array arrangement to the server.
6. The Next.js API validates the payload using **Zod**, then securely executes a mapped MongoDB `bulkWrite` containing `updateOne` operations. Each document's `sortOrder` index is updated.
7. The exact visual arrangement is permanently stored and seamlessly restored on the next login.
