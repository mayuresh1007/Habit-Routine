'use client';

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useHabitStore } from '@/store/habit-store';
import { useHydration } from '@/lib/use-hydration';
import { Flame, Trophy } from 'lucide-react';
import { format } from 'date-fns';

function calculateStreak(completions: Record<string, boolean>): number {
    let streak = 0;
    const current = new Date();

    while (true) {
        const dateKey = format(current, 'yyyy-MM-dd');
        if (completions[dateKey]) {
            streak++;
            current.setDate(current.getDate() - 1);
        } else {
            break;
        }
    }
    return streak;
}

export function StreakDisplay() {
    const hydrated = useHydration();
    const habits = useHabitStore((s) => s.habits);

    const { activeStreaks, bestStreak } = useMemo(() => {
        if (!hydrated || habits.length === 0) {
            return { activeStreaks: 0, bestStreak: null };
        }

        const streaks = habits.map((h) => ({
            name: h.name,
            emoji: h.emoji,
            streak: calculateStreak(h.completions),
        }));

        const best = streaks.reduce(
            (max, s) => (s.streak > max.streak ? s : max),
            streaks[0]
        );

        return {
            activeStreaks: streaks.filter((s) => s.streak > 0).length,
            bestStreak: best && best.streak > 0 ? best : null,
        };
    }, [hydrated, habits]);

    if (!hydrated || habits.length === 0) return null;

    return (
        <Card className="border-border/50">
            <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                        <Flame className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">Active Streaks</p>
                        <p className="text-2xl font-bold">{activeStreaks}</p>
                    </div>
                </div>

                {bestStreak && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                        <Trophy className="h-4 w-4 text-amber-500" />
                        <span className="text-sm">
                            Best: {bestStreak.emoji} {bestStreak.name}
                        </span>
                        <span className="ml-auto text-sm font-bold">
                            {bestStreak.streak} day{bestStreak.streak !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
