'use client';

import { forwardRef } from 'react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { useHabitStore } from '@/store/habit-store';
import { useRoutineStore } from '@/store/routine-store';
import { RoutinePeriod } from '@/types';

const PERIOD_LABELS: Record<RoutinePeriod, string> = {
    morning: '🌅 Morning',
    afternoon: '☀️ Afternoon',
    evening: '🌙 Evening',
};

export const PrintView = forwardRef<HTMLDivElement>((_, ref) => {
    const habits = useHabitStore((s) => s.habits);
    const routineItems = useRoutineStore((s) => s.items);

    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
        <div
            ref={ref}
            className="hidden print:block p-8 bg-white text-black text-sm"
            style={{ fontFamily: 'system-ui, sans-serif' }}
        >
            <div className="text-center mb-8">
                <h1
                    className="text-2xl font-bold"
                    style={{ color: 'var(--brand-color)' }}
                >
                    Habit Tracker & Routine Planner
                </h1>
                <p className="text-gray-500 mt-1">{format(today, 'MMMM yyyy')}</p>
                <h3
                    className="mt-1 font-medium"
                    style={{ color: 'var(--brand-streak)' }}
                >
                    The world’s judgment is constant, but growth begins with your own.
                </h3>
            </div>

            {/* Habit Grid */}
            {habits.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-3 border-b pb-1">
                        Habits Tracker
                    </h2>
                    <table className="w-full border-collapse text-xs">
                        <thead>
                            <tr>
                                <th className="text-left p-1 border border-gray-300 bg-gray-50 min-w-[120px]">
                                    Habit
                                </th>
                                {daysInMonth.map((day) => (
                                    <th
                                        key={day.toISOString()}
                                        className="p-1 text-center border border-gray-300 bg-gray-50 min-w-[20px]"
                                    >
                                        {format(day, 'd')}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {habits.map((habit) => (
                                <tr key={habit.id}>
                                    <td className="p-1 border border-gray-300 font-medium">
                                        {habit.emoji} {habit.name}
                                    </td>
                                    {daysInMonth.map((day) => {
                                        const dateKey = format(day, 'yyyy-MM-dd');
                                        const isCompleted = habit.completions[dateKey];
                                        return (
                                            <td
                                                key={dateKey}
                                                className="p-0.5 text-center border border-gray-300"
                                            >
                                                {isCompleted ? '✓' : ''}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Routine Checklist */}
            <div>
                <h2 className="text-lg font-semibold mb-3 border-b pb-1">
                    Daily Routine Checklist
                </h2>
                {(['morning', 'afternoon', 'evening'] as RoutinePeriod[]).map(
                    (period) => {
                        const items = routineItems.filter(item => item.period === period).sort((a, b) => a.sortOrder - b.sortOrder);
                        if (items.length === 0) return null;

                        return (
                            <div key={period} className="mb-4">
                                <h3 className="font-medium mb-2">{PERIOD_LABELS[period]}</h3>
                                <div className="space-y-1">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-2 pl-4">
                                            <div className="w-4 h-4 border border-gray-400 rounded-sm flex-shrink-0" />
                                            <span>{item.name}</span>
                                            {item.timeEstimate && (
                                                <span className="text-gray-400 text-xs">
                                                    ({item.timeEstimate} min)
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    }
                )}
            </div>

            <div className="mt-8 pt-4 border-t text-center text-xs text-gray-400">
                Generated on {format(today, 'MMMM d, yyyy')} • Habit Tracker Dashboard
            </div>
        </div>
    );
});

PrintView.displayName = 'PrintView';
