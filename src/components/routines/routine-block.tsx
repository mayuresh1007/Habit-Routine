'use client';

import { useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useRoutineStore } from '@/store/routine-store';
import { RoutineItem } from './routine-item';
import { RoutineForm } from './routine-form';
import { RoutinePeriod } from '@/types';
import { Sun, Cloud, Moon, Clock } from 'lucide-react';
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

const PERIOD_CONFIG: Record<
    RoutinePeriod,
    { label: string; icon: React.ReactNode; color: string }
> = {
    morning: {
        label: 'Morning',
        icon: <Sun className="h-4 w-4" />,
        color: 'text-amber-500',
    },
    afternoon: {
        label: 'Afternoon',
        icon: <Cloud className="h-4 w-4" />,
        color: 'text-blue-500',
    },
    evening: {
        label: 'Evening',
        icon: <Moon className="h-4 w-4" />,
        color: 'text-indigo-500',
    },
};

export function RoutineBlock() {
    const items = useRoutineStore((s) => s.items);
    const addItem = useRoutineStore((s) => s.addItem);
    const reorderItems = useRoutineStore((s) => s.reorderItems);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const periods: RoutinePeriod[] = ['morning', 'afternoon', 'evening'];

    const getPeriodItems = useCallback((period: RoutinePeriod) => {
        return items
            .filter((item) => item.period === period)
            .sort((a, b) => a.sortOrder - b.sortOrder);
    }, [items]);

    const handleDragEnd = useCallback(
        (period: RoutinePeriod) => (event: DragEndEvent) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;

            const periodItems = getPeriodItems(period);
            const oldIndex = periodItems.findIndex((item) => item.id === active.id);
            const newIndex = periodItems.findIndex((item) => item.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newItems = Array.from(periodItems);
                const [movedItem] = newItems.splice(oldIndex, 1);
                newItems.splice(newIndex, 0, movedItem);
                reorderItems(period, newItems);
            }
        },
        [getPeriodItems, reorderItems]
    );

    return (
        <Card className="border-border/50">
            <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Daily Routines
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {periods.map((period, index) => {
                        const config = PERIOD_CONFIG[period];
                        const periodItems = getPeriodItems(period);

                        return (
                            <div key={period}>
                                {index > 0 && <Separator className="mb-4" />}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                                    <div className={`flex items-center gap-2 ${config.color}`}>
                                        {config.icon}
                                        <h3 className="text-sm font-semibold">{config.label}</h3>
                                    </div>
                                    <div className="w-full sm:w-auto flex justify-end">
                                        <RoutineForm
                                            onSubmit={(name, time) => addItem({ period, name, timeEstimate: time })}
                                        />
                                    </div>
                                </div>

                                {periodItems.length === 0 ? (
                                    <p className="text-xs text-muted-foreground py-2 pl-6">
                                        No tasks yet
                                    </p>
                                ) : (
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleDragEnd(period)}
                                        modifiers={[restrictToVerticalAxis]}
                                    >
                                        <SortableContext
                                            items={periodItems.map((item) => item.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <div className="pl-1">
                                                {periodItems.map((item) => (
                                                    <RoutineItem
                                                        key={item.id}
                                                        item={item}
                                                    />
                                                ))}
                                            </div>
                                        </SortableContext>
                                    </DndContext>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
