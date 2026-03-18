'use client';

import { signOut, useSession } from 'next-auth/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Settings, LogOut, User as UserIcon } from 'lucide-react';

export function UserMenu() {
    const { data: session } = useSession();

    if (!session?.user) return null;

    const initial = session.user.name?.charAt(0).toUpperCase() || 'U';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none transition-colors ml-2 cursor-pointer">
                <div className="flex items-center gap-2 px-1 py-1 rounded-full border-2 border-brand/80 hover:bg-muted/50 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold">
                        {initial}
                    </div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-text-muted mr-1 h-4 w-4"
                    >
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-xl shadow-lg border-border/40 p-2">
                <DropdownMenuLabel className="font-normal px-2 py-3 pb-4">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold text-text-primary">My Account</p>
                        <p className="text-xs text-text-muted">
                            {session.user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                {/* <DropdownMenuSeparator className="border-border/40" /> */}
                {/* <div className="py-2">
                    <DropdownMenuItem className="cursor-pointer gap-3 px-3 py-2 text-text-muted hover:text-text-primary rounded-lg">
                        <UserIcon className="h-4 w-4" />
                        <span className="font-medium text-sm">Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer gap-3 px-3 py-2 text-text-muted hover:text-text-primary rounded-lg">
                        <Settings className="h-4 w-4" />
                        <span className="font-medium text-sm">Settings</span>
                    </DropdownMenuItem>
                </div> */}
                {/* <DropdownMenuSeparator className="border-border/40" /> */}
                <div className="py-1">
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer gap-3 px-3 py-2 rounded-lg mt-1"
                        onClick={() => signOut({ callbackUrl: '/login' })}
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="font-medium text-sm">Sign Out</span>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
