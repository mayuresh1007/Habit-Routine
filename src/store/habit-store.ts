import { create } from 'zustand';
import api from '@/lib/api-client';
import { Habit } from '@/types';

interface HabitState {
    habits: Habit[];
    isLoading: boolean;
    error: string | null;
    fetchHabits: () => Promise<void>;
    addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'completions' | 'userId'>) => Promise<void>;
    toggleCompletion: (id: string, date: string) => Promise<void>;
    updateHabit: (id: string, habit: Partial<Habit>) => Promise<void>;
    deleteHabit: (id: string) => Promise<void>;
    reorderHabits: (habits: Habit[]) => void;
}

export const useHabitStore = create<HabitState>((set, get) => ({
    habits: [],
    isLoading: false,
    error: null,

    fetchHabits: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await api.get<{ habits: Habit[] }>('/habits');
            set({ habits: data.habits, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch habits', isLoading: false });
        }
    },

    addHabit: async (habit) => {
        try {
            const data = await api.post<{ habit: Habit }>('/habits', habit);
            set((state) => ({ habits: [...state.habits, data.habit] }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to add habit' });
        }
    },

    toggleCompletion: async (id, date) => {
        // Optimistic update
        const previousHabits = get().habits;
        set((state) => ({
            habits: state.habits.map((h) => {
                if (h.id === id) {
                    const completions = { ...h.completions };
                    if (completions[date]) {
                        delete completions[date];
                    } else {
                        completions[date] = true;
                    }
                    return { ...h, completions };
                }
                return h;
            }),
        }));

        try {
            await api.patch(`/habits/${id}/toggle`, { date });
        } catch (error: any) {
            // Revert on error
            set({ habits: previousHabits, error: error.message || 'Failed to toggle date' });
        }
    },

    updateHabit: async (id, updates) => {
        // Optimistic update
        const previousHabits = get().habits;
        set((state) => ({
            habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        }));

        try {
            await api.put(`/habits/${id}`, updates);
        } catch (error: any) {
            // Revert on error
            set({ habits: previousHabits, error: error.message || 'Failed to update habit' });
        }
    },

    deleteHabit: async (id) => {
        // Optimistic update
        const previousHabits = get().habits;
        set((state) => ({
            habits: state.habits.filter((h) => h.id !== id),
        }));

        try {
            await api.delete(`/habits/${id}`);
        } catch (error: any) {
            // Revert on error
            set({ habits: previousHabits, error: error.message || 'Failed to delete habit' });
        }
    },

    reorderHabits: (habits) => {
        // Frontend-only reorder for now until backend supports habit reordering
        set({ habits });
    },
}));
