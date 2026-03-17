# Frontend Architecture Overview

This document outlines the architectural patterns and structure of the Habit Tracker & Routine Planner dashboard.

## System Architecture

The application is built as a **Single Page Application (SPA)** using **Next.js 15 (App Router)**. It follows a modular component-based architecture for the UI and a centralized store pattern for state management.

### Component Tree
- `RootLayout` (Layout & Providers)
  - `DashboardPage` (Main orchestrator)
    - `Header` (Title & Export controls)
    - `SummarySection` (Stats & Streaks cards)
    - `MainGrid` (Responsive layout)
      - `HabitSection` (Habit list & Grid)
      - `RoutineSection` (Morning/Afternoon/Evening blocks)
    - `PrintView` (Hidden, print-only layer)

## Data Flow

1. **User Interaction**: User clicks a checkbox or adds an item.
2. **Action Dispatch**: Components call actions on Zustand stores (`useHabitStore` or `useRoutineStore`).
3. **State Mutation**: Store updates its internal state and triggers a background save to `localStorage`.
4. **Re-render**: React detects state changes in the items/completions and re-renders the affected components.
5. **Persistence**: On page reload, Zustands's `persist` middleware automatically re-hydrates the state from `localStorage`.

## Folder Structure

```text
src/
├── app/               # Next.js App Router (pages & layouts)
├── components/        # UI components organized by feature
│   ├── dashboard/     # Summary and stat cards
│   ├── habits/        # Habit CRUD and grid components
│   ├── routines/      # Routine block and item components
│   ├── export/        # Print-optimized view
│   └── ui/            # shadcn/ui shared components
├── lib/               # Utility functions and custom hooks
├── store/             # Zustand state management
└── types/             # TypeScript interfaces and types
```

## Hydration Strategy

To prevent SSR (Server-Side Rendering) mismatches between server-rendered HTML and client-side `localStorage` data, the app uses a `useHydration` hook. Components that rely on persistent state wait for hydration before rendering data-dependent UI elements.
