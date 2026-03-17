'use client';

import { useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, Pencil, Clock, GripVertical } from 'lucide-react';
import { RoutineItem as RoutineItemType } from '@/types';
import { useRoutineStore } from '@/store/routine-store';
import { RoutineForm } from './routine-form';
import { format } from 'date-fns';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface RoutineItemProps {
    item: RoutineItemType;
}

export function RoutineItem({ item }: RoutineItemProps) {
    const toggleCompletion = useRoutineStore((s) => s.toggleCompletion);
    const deleteItem = useRoutineStore((s) => s.deleteItem);
    const updateItem = useRoutineStore((s) => s.updateItem);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : undefined,
    };

    const today = new Date();
    const todayKey = format(today, 'yyyy-MM-dd');

    // Check if the item is completed for today directly from the flat map
    const completed = useMemo(() => {
        return !!item.completions[todayKey];
    }, [item.completions, todayKey]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-2 py-2 group"
        >
            <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground touch-none flex-shrink-0"
                aria-label="Drag to reorder"
            >
                <GripVertical className="h-3.5 w-3.5" />
            </button>

            <Checkbox
                checked={completed}
                onCheckedChange={() => toggleCompletion(item.id, todayKey)}
                className="h-4 w-4"
            />

            <div className={`flex-1 min-w-0 ${completed ? 'line-through opacity-50' : ''}`}>
                <span className="text-sm">{item.name}</span>
                {item.timeEstimate && (
                    <span className="inline-flex items-center gap-0.5 ml-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {item.timeEstimate}m
                    </span>
                )}
            </div>

            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <RoutineForm
                    initialName={item.name}
                    initialTime={item.timeEstimate}
                    onSubmit={(name, time) => updateItem(item.id, { name, timeEstimate: time })}
                    trigger={
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Pencil className="h-3 w-3" />
                        </Button>
                    }
                    title="Edit Task"
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={() => deleteItem(item.id)}
                >
                    <Trash2 className="h-3 w-3" />
                </Button>
            </div>
        </div>
    );
}
