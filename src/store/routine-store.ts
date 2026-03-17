import { create } from 'zustand';
import api from '@/lib/api-client';
import { RoutineItem } from '@/types';

interface RoutineState {
    items: RoutineItem[];
    isLoading: boolean;
    error: string | null;
    fetchRoutines: () => Promise<void>;
    addItem: (item: Omit<RoutineItem, 'id' | 'createdAt' | 'updatedAt' | 'completions' | 'userId' | 'sortOrder'>) => Promise<void>;
    toggleCompletion: (id: string, date: string) => Promise<void>;
    updateItem: (id: string, updates: Partial<RoutineItem>) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
    reorderItems: (period: 'morning' | 'afternoon' | 'evening', items: RoutineItem[]) => Promise<void>;
}

export const useRoutineStore = create<RoutineState>((set, get) => ({
    items: [],
    isLoading: false,
    error: null,

    fetchRoutines: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await api.get<{ routines: RoutineItem[] }>('/routines');
            set({ items: data.routines, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch routines', isLoading: false });
        }
    },

    addItem: async (item) => {
        try {
            const data = await api.post<{ routine: RoutineItem }>('/routines', item);
            set((state) => ({ items: [...state.items, data.routine] }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to add routine item' });
        }
    },

    toggleCompletion: async (id, date) => {
        // Optimistic update
        const previousItems = get().items;
        set((state) => ({
            items: state.items.map((item) => {
                if (item.id === id) {
                    const completions = { ...item.completions };
                    if (completions[date]) {
                        delete completions[date];
                    } else {
                        completions[date] = true;
                    }
                    return { ...item, completions };
                }
                return item;
            }),
        }));

        try {
            await api.patch(`/routines/${id}/toggle`, { date });
        } catch (error: any) {
            // Revert on error
            set({ items: previousItems, error: error.message || 'Failed to toggle routine date' });
        }
    },

    updateItem: async (id, updates) => {
        // Optimistic update
        const previousItems = get().items;
        set((state) => ({
            items: state.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
        }));

        try {
            await api.put(`/routines/${id}`, updates);
        } catch (error: any) {
            // Revert on error
            set({ items: previousItems, error: error.message || 'Failed to update routine item' });
        }
    },

    deleteItem: async (id) => {
        // Optimistic update
        const previousItems = get().items;
        set((state) => ({
            items: state.items.filter((item) => item.id !== id),
        }));

        try {
            await api.delete(`/routines/${id}`);
        } catch (error: any) {
            // Revert on error
            set({ items: previousItems, error: error.message || 'Failed to delete routine item' });
        }
    },

    reorderItems: async (period, items) => {
        // Optimistic update
        const previousItems = get().items;

        // Replace items for this period with new items
        set((state) => {
            const otherItems = state.items.filter(item => item.period !== period);
            // Ensure new items have updated sortOrder properties locally
            const updatedPeriodItems = items.map((item, index) => ({ ...item, sortOrder: index }));
            return { items: [...otherItems, ...updatedPeriodItems] };
        });

        try {
            const itemIds = items.map(item => item.id);
            const data = await api.patch<{ routines: RoutineItem[] }>('/routines/reorder', { period, itemIds });

            // Final sync with backend returned data for this period
            set((state) => {
                const otherItems = state.items.filter(item => item.period !== period);
                return { items: [...otherItems, ...data.routines] };
            });
        } catch (error: any) {
            // Revert on error
            set({ items: previousItems, error: error.message || 'Failed to reorder routines' });
        }
    },
}));
