export interface Habit {
  id: string;
  name: string;
  emoji: string;
  frequency: 'daily' | 'weekly';
  createdAt: string;
  completions: Record<string, boolean>; // date string "YYYY-MM-DD" → boolean
}

export interface RoutineItem {
  id: string;
  name: string;
  timeEstimate: number | null; // minutes
  order: number;
}

export interface RoutineBlock {
  id: string;
  period: 'morning' | 'afternoon' | 'evening';
  items: RoutineItem[];
  completions: Record<string, string[]>; // date string → array of completed item IDs
}

export type RoutinePeriod = 'morning' | 'afternoon' | 'evening';
