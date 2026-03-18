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

const EMOJI_OPTIONS = ['💪', '📚', '🧘', '🏃', '💧', '🍎', '😴', '✍️', '🎯', '💊', '🧹', '🎵', '🔍', '💰', '📸'];

interface HabitFormProps {
    initialName?: string;
    initialEmoji?: string;
    initialFrequency?: 'daily' | 'weekly';
    onSubmit: (name: string, emoji: string, frequency: 'daily' | 'weekly') => void;
    trigger?: React.ReactElement;
    title?: string;
}

export function HabitForm({
    initialName = '',
    initialEmoji = '💪',
    initialFrequency = 'daily',
    onSubmit,
    trigger,
    title = 'Add Habit',
}: HabitFormProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(initialName);
    const [emoji, setEmoji] = useState(initialEmoji);
    const [frequency, setFrequency] = useState<'daily' | 'weekly'>(initialFrequency);

    const handleSubmit = () => {
        if (!name.trim()) return;
        onSubmit(name.trim(), emoji, frequency);
        setName('');
        setEmoji('💪');
        setFrequency('daily');
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    trigger || (
                        <Button variant="outline" size="sm" className="gap-2" id="add-habit-button">
                            <Plus className="h-4 w-4" />
                            Add Habit
                        </Button>
                    )
                }
            />
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Create a new habit to track daily or weekly.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">Name</label>
                        <Input
                            placeholder="e.g. Drink 8 glasses of water"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            id="habit-name-input"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">Emoji</label>
                        <div className="flex flex-wrap gap-2">
                            {EMOJI_OPTIONS.map((e) => (
                                <button
                                    key={e}
                                    type="button"
                                    onClick={() => setEmoji(e)}
                                    className={`text-xl p-2 rounded-lg transition-colors ${emoji === e
                                        ? 'bg-primary/10 ring-2 ring-primary'
                                        : 'hover:bg-muted'
                                        }`}
                                >
                                    {e}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">Frequency</label>
                        <div className="flex gap-2">
                            {(['daily', 'weekly'] as const).map((f) => (
                                <Button
                                    key={f}
                                    type="button"
                                    variant={frequency === f ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFrequency(f)}
                                    className="capitalize"
                                >
                                    {f}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={!name.trim()} id="save-habit-button">
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
