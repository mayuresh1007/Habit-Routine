'use client';

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useHabitStore } from '@/store/habit-store';
import { useRoutineStore } from '@/store/routine-store';
import { useHydration } from '@/lib/use-hydration';
import { CheckCircle2, Target, Flame } from 'lucide-react';
import { format } from 'date-fns';

export function TodaySummary() {
    const hydrated = useHydration();
    const habits = useHabitStore((s) => s.habits);
    const routineItems = useRoutineStore((s) => s.items);

    const { habitProgress, routineProgress, percentage } = useMemo(() => {
        if (!hydrated) return { habitProgress: { done: 0, total: 0 }, routineProgress: { done: 0, total: 0 }, percentage: 0 };

        const today = format(new Date(), 'yyyy-MM-dd');
        const habitTotal = habits.length;
        const habitDone = habits.filter((h) => h.completions[today]).length;

        const routineTotal = routineItems.length;
        const routineDone = routineItems.filter((item) => item.completions && item.completions[today]).length;

        const totalDone = habitDone + routineDone;
        const totalItems = habitTotal + routineTotal;
        const pct = totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0;

        return {
            habitProgress: { done: habitDone, total: habitTotal },
            routineProgress: { done: routineDone, total: routineTotal },
            percentage: pct,
        };
    }, [hydrated, habits, routineItems]);

    if (!hydrated) {
        return (
            <Card className="border-border/50">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-brand/10">
                            <Target className="h-5 w-5 text-brand" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Today&apos;s Progress</p>
                            <p className="text-2xl font-bold">0%</p>
                        </div>
                    </div>
                    <Progress value={0} className="h-2 mb-4" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-border/50">
            <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Target className="h-5 w-5 text-brand-color" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">Today&apos;s Progress</p>
                        <p className="text-2xl font-bold">{percentage}%</p>
                    </div>
                </div>

                <Progress value={percentage} className="h-2 mb-4" />

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">Habits</p>
                            <p className="text-sm font-semibold">
                                {habitProgress.done}/{habitProgress.total}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">Routines</p>
                            <p className="text-sm font-semibold">
                                {routineProgress.done}/{routineProgress.total}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
