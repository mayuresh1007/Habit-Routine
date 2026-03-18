export interface Habit {
  id: string;
  userId: string;
  name: string;
  emoji: string;
  frequency: 'daily' | 'weekly';
  completions: Record<string, boolean>; // date string "YYYY-MM-DD" → boolean
  createdAt: string;
  updatedAt?: string;
}

export type RoutinePeriod = 'morning' | 'afternoon' | 'evening';

export interface RoutineItem {
  id: string;
  userId: string;
  period: RoutinePeriod;
  name: string;
  timeEstimate: number | null; // minutes
  sortOrder: number;
  completions: Record<string, boolean>; // date string "YYYY-MM-DD" → boolean
  createdAt: string;
  updatedAt?: string;
}
