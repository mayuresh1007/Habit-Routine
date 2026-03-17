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

Both stores use the `persist` middleware with the default `localStorage` storage. This ensures:
1. **Auto-save**: Every state mutation is automatically serialized and saved to browser storage.
2. **Rehydration**: On application load, the stores automatically read and restore their state from `localStorage`.

### Hydration Guard
To avoid **Hydration Mismatch Errors** (where the server-rendered HTML doesn't match the client-side `localStorage` data), we use a custom `useHydration` hook. 

**Example Usage:**
```tsx
const hydrated = useHydration();
if (!hydrated) return <LoadingPlaceholder />;
return <DataComponent />;
```

## Drag-and-Drop Reordering Logic

Reordering is handled by the `@dnd-kit/sortable` library. When a drag operation ends:
1. The component catches the `onDragEnd` event.
2. It calculates the `oldIndex` and `newIndex` of the dragged item.
3. It calls `moveHabit` or `moveItem` in the store.
4. The store uses `.splice()` to reorder the array immutably.
5. The UI re-renders with the new order, which is then persisted to `localStorage`.
