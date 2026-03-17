'use client';

import { format } from 'date-fns';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
    onExport: () => void;
}

export function Header({ onExport }: HeaderProps) {
    const today = new Date();

    return (
        <header className="flex items-center justify-between py-6 print:hidden">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Habit Tracker
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    {format(today, 'EEEE, MMMM d, yyyy')}
                </p>
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="gap-2"
                id="export-button"
            >
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Export / Print</span>
            </Button>
        </header>
    );
}
