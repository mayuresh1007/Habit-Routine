'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';
import { Habit } from '@/types';

interface HabitState {
    habits: Habit[];
    addHabit: (name: string, emoji: string, frequency: 'daily' | 'weekly') => void;
    updateHabit: (id: string, name: string, emoji: string, frequency: 'daily' | 'weekly') => void;
    deleteHabit: (id: string) => void;
    toggleDay: (id: string, date: Date) => void;
    moveHabit: (fromIndex: number, toIndex: number) => void;
    getStreak: (id: string) => number;
    getTodayProgress: () => { done: number; total: number };
}

export const useHabitStore = create<HabitState>()(
    persist(
        (set, get) => ({
            habits: [],

            addHabit: (name, emoji, frequency) => {
                const newHabit: Habit = {
                    id: crypto.randomUUID(),
                    name,
                    emoji,
                    frequency,
                    createdAt: new Date().toISOString(),
                    completions: {},
                };
                set((state) => ({ habits: [...state.habits, newHabit] }));
            },

            updateHabit: (id, name, emoji, frequency) => {
                set((state) => ({
                    habits: state.habits.map((h) =>
                        h.id === id ? { ...h, name, emoji, frequency } : h
                    ),
                }));
            },

            deleteHabit: (id) => {
                set((state) => ({
                    habits: state.habits.filter((h) => h.id !== id),
                }));
            },

            toggleDay: (id, date) => {
                const dateKey = format(date, 'yyyy-MM-dd');
                set((state) => ({
                    habits: state.habits.map((h) => {
                        if (h.id !== id) return h;
                        const newCompletions = { ...h.completions };
                        if (newCompletions[dateKey]) {
                            delete newCompletions[dateKey];
                        } else {
                            newCompletions[dateKey] = true;
                        }
                        return { ...h, completions: newCompletions };
                    }),
                }));
            },

            moveHabit: (fromIndex, toIndex) => {
                set((state) => {
                    const newHabits = [...state.habits];
                    const [removed] = newHabits.splice(fromIndex, 1);
                    newHabits.splice(toIndex, 0, removed);
                    return { habits: newHabits };
                });
            },

            getStreak: (id) => {
                const habit = get().habits.find((h) => h.id === id);
                if (!habit) return 0;

                let streak = 0;
                const today = new Date();
                const current = new Date(today);

                while (true) {
                    const dateKey = format(current, 'yyyy-MM-dd');
                    if (habit.completions[dateKey]) {
                        streak++;
                        current.setDate(current.getDate() - 1);
                    } else {
                        break;
                    }
                }
                return streak;
            },

            getTodayProgress: () => {
                const { habits } = get();
                const today = format(new Date(), 'yyyy-MM-dd');
                const total = habits.length;
                const done = habits.filter((h) => h.completions[today]).length;
                return { done, total };
            },
        }),
        {
            name: 'habit-store',
        }
    )
);
