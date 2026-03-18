# Frontend Architecture Overview

This document outlines the architectural patterns and structure of the Habit Tracker & Routine Planner dashboard.

## System Architecture

The application is built as a **Full-Stack Next.js 15 (App Router)** application. It utilizes server-side API routes, **NextAuth** for secure session management, and a **MongoDB** database via **Mongoose** models. The frontend maintains a snappy user experience via Zustand stores equipped with optimistic UI updates.

### Component Tree
- `RootLayout` (NextAuth Session Provider, Custom Theme Providers)
  - `DashboardPage` (Main orchestrator, fetches initials on mount)
    - `Header` (Title, Profile Menu, Export & Theme controls)
    - `SummarySection` (Stats & Streaks cards)
    - `MainGrid` (Responsive layout)
      - `HabitSection` (Habit list & Grid connected to MongoDB DB)
      - `RoutineSection` (Morning/Afternoon/Evening blocks)
    - `PrintView` (Hidden, print-only layer)

## Data Flow

1. **User Interaction**: User performs an action (e.g., ticking a checkbox, dragging a habit to reorder).
2. **Optimistic UI Update**: The component dispatches an action to the Zustand store (`useHabitStore` or `useRoutineStore`), which immediately updates the UI state.
3. **Backend Synchronization**: The store fires an asynchronous request to the appropriate Next.js API route (`/api/habits`, `/api/routines`, etc.).
4. **Database Mutation**: The API route verifies the NextAuth session, validates the payload using Zod, and performs the necessary Mongoose operations (e.g., `bulkWrite` for reordering `sortOrder`, `updateOne` for completions).
5. **Error Reconciliation**: If the API call fails, the store catches the error and reverts the optimistic update, restoring the frontend to the actual backend state.

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

## Authentication Strategy

Security is handled natively via NextAuth.js configured with JWT session strategies. API routes strictly enforce session validation, ensuring users can only read, mutate, and reorder `Habit` and `RoutineItem` documents belonging to their unique MongoDB `userId`.
