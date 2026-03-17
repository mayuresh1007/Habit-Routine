'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHabitStore } from '@/store/habit-store';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export function HabitGrid() {
    const habits = useHabitStore((s) => s.habits);

    if (habits.length === 0) return null;

    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
        <Card className="border-border/50">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                    {format(today, 'MMMM yyyy')} Overview
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr>
                                <th className="text-left font-medium p-1 sticky left-0 bg-card min-w-[100px]">
                                    Habit
                                </th>
                                {daysInMonth.map((day) => (
                                    <th
                                        key={day.toISOString()}
                                        className={`p-1 text-center font-normal text-muted-foreground min-w-[24px] ${format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
                                                ? 'text-primary font-semibold'
                                                : ''
                                            }`}
                                    >
                                        {format(day, 'd')}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {habits.map((habit) => (
                                <tr key={habit.id}>
                                    <td className="p-1 sticky left-0 bg-card">
                                        <span className="truncate block max-w-[100px]">
                                            {habit.emoji} {habit.name}
                                        </span>
                                    </td>
                                    {daysInMonth.map((day) => {
                                        const dateKey = format(day, 'yyyy-MM-dd');
                                        const isCompleted = habit.completions[dateKey];
                                        const isPast = day <= today;

                                        return (
                                            <td key={dateKey} className="p-0.5 text-center">
                                                <div
                                                    className={`w-5 h-5 rounded-sm mx-auto ${isCompleted
                                                            ? 'bg-primary'
                                                            : isPast
                                                                ? 'bg-muted'
                                                                : 'bg-transparent border border-border/30'
                                                        }`}
                                                />
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
