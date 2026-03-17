'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
    DialogDescription,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

interface RoutineFormProps {
    initialName?: string;
    initialTime?: number | null;
    onSubmit: (name: string, timeEstimate: number | null) => void;
    trigger?: React.ReactElement;
    title?: string;
}

export function RoutineForm({
    initialName = '',
    initialTime = null,
    onSubmit,
    trigger,
    title = 'Add Task',
}: RoutineFormProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(initialName);
    const [timeEstimate, setTimeEstimate] = useState(
        initialTime !== null ? String(initialTime) : ''
    );

    const handleSubmit = () => {
        if (!name.trim()) return;
        const time = timeEstimate ? parseInt(timeEstimate, 10) : null;
        onSubmit(name.trim(), time);
        setName('');
        setTimeEstimate('');
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    trigger || (
                        <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs">
                            <Plus className="h-3 w-3" />
                            Add
                        </Button>
                    )
                }
            />
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Add a task to your routine block.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">Task Name</label>
                        <Input
                            placeholder="e.g. Meditate for 10 minutes"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            id="routine-name-input"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Time Estimate (minutes, optional)
                        </label>
                        <Input
                            type="number"
                            placeholder="e.g. 10"
                            value={timeEstimate}
                            onChange={(e) => setTimeEstimate(e.target.value)}
                            min={1}
                            id="routine-time-input"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={!name.trim()} id="save-routine-button">
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
