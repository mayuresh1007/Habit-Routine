'use client';

import { useMemo } from 'react';
import { format, subDays } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, Pencil, Flame, GripVertical } from 'lucide-react';
import { Habit } from '@/types';
import { useHabitStore } from '@/store/habit-store';
import { HabitForm } from './habit-form';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface HabitItemProps {
    habit: Habit;
}

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

export function HabitItem({ habit }: HabitItemProps) {
    const toggleCompletion = useHabitStore((s) => s.toggleCompletion);
    const deleteHabit = useHabitStore((s) => s.deleteHabit);
    const updateHabit = useHabitStore((s) => s.updateHabit);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: habit.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : undefined,
    };

    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const last7Days = useMemo(
        () => Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [todayStr]
    );
    const streak = useMemo(() => calculateStreak(habit.completions), [habit.completions]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
        >
            <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground touch-none flex-shrink-0"
                aria-label="Drag to reorder"
            >
                <GripVertical className="h-4 w-4" />
            </button>

            <span className="text-xl flex-shrink-0">{habit.emoji}</span>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{habit.name}</span>
                </div>
                {streak > 0 && (
                    <div className="flex items-center gap-1 mt-0.5">
                        <Flame className="h-3 w-3 text-orange-500" />
                        <span className="text-xs text-muted-foreground">
                            {streak} day{streak !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-1.5">
                {last7Days.map((date) => {
                    const dateKey = format(date, 'yyyy-MM-dd');
                    const isCompleted = habit.completions[dateKey];
                    const isToday = dateKey === todayStr;

                    return (
                        <div key={dateKey} className="flex flex-col items-center gap-0.5">
                            <span className="text-[9px] text-muted-foreground hidden md:block">
                                {format(date, 'EEE').charAt(0)}
                            </span>
                            <Checkbox
                                checked={!!isCompleted}
                                onCheckedChange={() => toggleCompletion(habit.id, dateKey)}
                                className={`h-5 w-5 rounded ${isToday ? 'border-primary' : ''}`}
                            />
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <HabitForm
                    initialName={habit.name}
                    initialEmoji={habit.emoji}
                    initialFrequency={habit.frequency}
                    onSubmit={(name, emoji, frequency) =>
                        updateHabit(habit.id, { name, emoji, frequency })
                    }
                    trigger={
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Pencil className="h-3 w-3" />
                        </Button>
                    }
                    title="Edit Habit"
                />
                <AlertDialog>
                    <AlertDialogTrigger
                        render={
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive"
                            />
                        }
                    >
                        <Trash2 className="h-3 w-3" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4 text-destructive" />
                                <span className='text-destructive'>Delete Habit</span>
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete this habit? This action cannot be undone and will remove all completion history.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => deleteHabit(habit.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
