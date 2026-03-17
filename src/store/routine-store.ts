'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';
import { RoutineItem, RoutinePeriod } from '@/types';

interface RoutineState {
    items: Record<RoutinePeriod, RoutineItem[]>;
    completions: Record<string, string[]>; // "YYYY-MM-DD" → completed item IDs
    addItem: (period: RoutinePeriod, name: string, timeEstimate: number | null) => void;
    updateItem: (period: RoutinePeriod, id: string, name: string, timeEstimate: number | null) => void;
    deleteItem: (period: RoutinePeriod, id: string) => void;
    toggleComplete: (itemId: string, date: Date) => void;
    isCompleted: (itemId: string, date: Date) => boolean;
    getTodayProgress: () => { done: number; total: number };
    moveItem: (period: RoutinePeriod, fromIndex: number, toIndex: number) => void;
}

export const useRoutineStore = create<RoutineState>()(
    persist(
        (set, get) => ({
            items: {
                morning: [],
                afternoon: [],
                evening: [],
            },
            completions: {},

            addItem: (period, name, timeEstimate) => {
                const newItem: RoutineItem = {
                    id: crypto.randomUUID(),
                    name,
                    timeEstimate,
                    order: get().items[period].length,
                };
                set((state) => ({
                    items: {
                        ...state.items,
                        [period]: [...state.items[period], newItem],
                    },
                }));
            },

            updateItem: (period, id, name, timeEstimate) => {
                set((state) => ({
                    items: {
                        ...state.items,
                        [period]: state.items[period].map((item) =>
                            item.id === id ? { ...item, name, timeEstimate } : item
                        ),
                    },
                }));
            },

            deleteItem: (period, id) => {
                set((state) => ({
                    items: {
                        ...state.items,
                        [period]: state.items[period].filter((item) => item.id !== id),
                    },
                }));
            },

            toggleComplete: (itemId, date) => {
                const dateKey = format(date, 'yyyy-MM-dd');
                set((state) => {
                    const dayCompletions = state.completions[dateKey] || [];
                    const isCurrentlyComplete = dayCompletions.includes(itemId);
                    return {
                        completions: {
                            ...state.completions,
                            [dateKey]: isCurrentlyComplete
                                ? dayCompletions.filter((id) => id !== itemId)
                                : [...dayCompletions, itemId],
                        },
                    };
                });
            },

            isCompleted: (itemId, date) => {
                const dateKey = format(date, 'yyyy-MM-dd');
                const dayCompletions = get().completions[dateKey] || [];
                return dayCompletions.includes(itemId);
            },

            getTodayProgress: () => {
                const { items, completions } = get();
                const today = format(new Date(), 'yyyy-MM-dd');
                const allItems = [
                    ...items.morning,
                    ...items.afternoon,
                    ...items.evening,
                ];
                const total = allItems.length;
                const todayCompletions = completions[today] || [];
                const done = allItems.filter((item) =>
                    todayCompletions.includes(item.id)
                ).length;
                return { done, total };
            },

            moveItem: (period, fromIndex, toIndex) => {
                set((state) => {
                    const newItems = [...state.items[period]];
                    const [removed] = newItems.splice(fromIndex, 1);
                    newItems.splice(toIndex, 0, removed);
                    return {
                        items: {
                            ...state.items,
                            [period]: newItems.map((item, i) => ({ ...item, order: i })),
                        },
                    };
                });
            },
        }),
        {
            name: 'routine-store',
        }
    )
);
