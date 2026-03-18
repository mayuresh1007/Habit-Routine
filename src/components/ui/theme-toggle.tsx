'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Prevent hydration mismatch by only rendering after mount
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-[104px] h-[36px] rounded-full bg-accent/50" />;
    }

    return (
        <div className="flex items-center bg-accent/50 rounded-full p-1 border border-border/50">
            <button
                onClick={() => setTheme('light')}
                className={cn(
                    'p-1.5 rounded-full transition-all duration-200 cursor-pointer',
                    theme === 'light' ? 'bg-bg-surface text-brand-streak shadow-sm' : 'text-text-muted hover:text-text-primary'
                )}
                aria-label="Light mode"
            >
                <Sun className="h-4 w-4" />
            </button>
            <button
                onClick={() => setTheme('dark')}
                className={cn(
                    'p-1.5 rounded-full transition-all duration-200 cursor-pointer',
                    theme === 'dark' ? 'bg-bg-surface text-brand-streak shadow-sm' : 'text-text-muted hover:text-text-primary'
                )}
                aria-label="Dark mode"
            >
                <Moon className="h-4 w-4" />
            </button>
            <button
                onClick={() => setTheme('system')}
                className={cn(
                    'p-1.5 rounded-full transition-all duration-200 cursor-pointer',
                    theme === 'system' ? 'bg-bg-surface text-brand-streak shadow-sm' : 'text-text-muted hover:text-text-primary'
                )}
                aria-label="System theme"
            >
                <Monitor className="h-4 w-4" />
            </button>
        </div>
    );
}
