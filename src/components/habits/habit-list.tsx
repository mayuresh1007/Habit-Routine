'use client';

import { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHabitStore } from '@/store/habit-store';
import { HabitItem } from './habit-item';
import { HabitForm } from './habit-form';
import { ListChecks } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

export function HabitList() {
    const habits = useHabitStore((s) => s.habits);
    const addHabit = useHabitStore((s) => s.addHabit);
    const moveHabit = useHabitStore((s) => s.moveHabit);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;

            const oldIndex = habits.findIndex((h) => h.id === active.id);
            const newIndex = habits.findIndex((h) => h.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1) {
                moveHabit(oldIndex, newIndex);
            }
        },
        [habits, moveHabit]
    );

    return (
        <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <ListChecks className="h-4 w-4" />
                    Habits
                </CardTitle>
                <HabitForm onSubmit={addHabit} />
            </CardHeader>
            <CardContent>
                {habits.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground">
                            No habits yet. Add your first habit to get started!
                        </p>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis]}
                    >
                        <SortableContext
                            items={habits.map((h) => h.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-1">
                                {habits.map((habit) => (
                                    <HabitItem key={habit.id} habit={habit} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </CardContent>
        </Card>
    );
}
