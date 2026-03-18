# Technology Stack & Dependencies

The Habit Tracker & Routine Planner dashboard uses a modern, performant, and type-safe frontend stack.

## Core Framework
- **Next.js 15 (App Router)**: Orchestrates server components, client API routes, and optimized routing.
- **TypeScript**: Provides full type safety for habit and routine data structures.
- **Turbopack**: Used for fast development builds and optimized production output.
- **NextAuth.js (v5)**: Manages secure, JWT-based user authentication and API route protection.

## UI & Styling
- **shadcn/ui**: Built on **Base UI** (formerly Radix UI) for accessible primitives.
- **Tailwind CSS v4**: Modern utility-first CSS for responsive, performant styling.
- **Lucide React**: Clean, consistent icon set for UI elements.
- **Geist (Sans & Mono)**: Premium typography from Vercel for a minimalistic aesthetic.

## State & Data
- **MongoDB & Mongoose**: NoSQL database and ODM for robust, persistent storage of users, habits, and routines (including sort orders).
- **Zustand**: Lightweight, flexible client-side state management handling optimistic UI updates.
- **Zod**: TypeScript-first schema declaration and validation library, used extensively in Next.js API route payloads.
- **date-fns**: Comprehensive date manipulation and formatting for progress tracking.

## Interactive Features
- **@dnd-kit**: Powerful drag-and-drop toolkit for reordering list items.
  - `@dnd-kit/core`: Main engine for drag events.
  - `@dnd-kit/sortable`: Logic for sliding items and maintaining order.
  - `@dnd-kit/modifiers`: Used for `restrictToVerticalAxis` constraint.

## Export & Printing
- **react-to-print**: Handles the complexity of printing a specific React component (`PrintView`).
- **Media Queries**: Custom print styles in `globals.css` hide UI chrome and optimize the layout for A4 paper.

## Dependencies Summary
Based on `package.json`:
- `mongoose`: Version ^8.x
- `next-auth`: Version ^5.0.0-beta
- `zod`: Version ^3.x
- `zustand`: Version ^5.0.0
- `date-fns`: Version ^4.1.0
- `react-to-print`: Version ^3.0.0
- `@dnd-kit/*`: Version ^6.0.0
- `lucide-react`: Version ^0.475.0
