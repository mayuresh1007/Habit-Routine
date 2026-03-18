'use client';

import { Trophy, Bell, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/auth/user-menu';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import Image from 'next/image';
interface HeaderProps {
    onExport: () => void;
}

export function Header({ onExport }: HeaderProps) {
    return (
        <header className="flex items-center justify-between py-4 print:hidden border-b border-border/40 mb-6 pb-4">
            <div className="flex items-center gap-3">
                <div className="">
                    {/* <Trophy className="h-5 w-5 text-white" /> */}
                    <Image src="/logohorizontal.png" alt="Logo" width={200} height={200} />
                    {/* <Image src="/logoverticle.png" alt="Logo" width={100} height={200} /> */}

                </div>

            </div>
            <div className="flex items-center gap-2 sm:gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-text-muted hover:text-text-primary rounded-full cursor-pointer"
                    onClick={onExport}
                    title="Print Dashboard"
                >
                    <Printer className="h-5 w-5 " />
                </Button>
                <ThemeToggle />
                {/* <Button variant="ghost" size="icon" className="text-text-muted hover:text-text-primary rounded-full hidden sm:flex cursor-pointer">
                    <Bell className="h-5 w-5" />
                </Button> */}
                <div className="h-8 w-px bg-border/50 mx-1 hidden sm:block"></div>
                <UserMenu />
            </div>
        </header>
    );
}
