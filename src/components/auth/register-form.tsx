'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function RegisterForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.error === 'VALIDATION_ERROR' && data.details) {
                    setError(data.details[0]?.message || 'Invalid input');
                } else {
                    setError(data.message || 'Registration failed');
                }
                setLoading(false);
                return;
            }

            // Auto login after registration
            const signInRes = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (signInRes?.error) {
                setError('Registration successful, but auto-login failed. Please sign in.');
                setLoading(false);
            } else {
                router.push('/');
                router.refresh();
            }
        } catch (err) {
            setError('An unexpected error occurred');
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto border-none shadow-xl shadow-brand-success/5 bg-bg-surface text-text-primary transition-colors duration-300">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold tracking-tight">
                    Create an account ✨
                </CardTitle>
                <CardDescription className="text-text-muted">
                    Enter your information to secure your first win
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-5 pb-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2" htmlFor="name">
                            👤 Name
                        </label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            required
                            autoComplete="name"
                            className="focus-visible:ring-brand-success transition-all duration-200 border-border/50 bg-bg-app text-text-primary"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2" htmlFor="email">
                            📧 Email
                        </label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            required
                            autoComplete="email"
                            className="focus-visible:ring-brand-success transition-all duration-200 border-border/50 bg-bg-app text-text-primary"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2" htmlFor="password">
                            🔑 Password
                        </label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="new-password"
                            className="focus-visible:ring-brand-success transition-all duration-200 border-border/50 bg-bg-app text-text-primary"
                        />
                        <p className="text-xs text-text-muted">
                            Must be at least 8 characters containing a number and an uppercase letter.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2" htmlFor="confirmPassword">
                            🛡️ Confirm Password
                        </label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            autoComplete="new-password"
                            className="focus-visible:ring-brand-success transition-all duration-200 border-border/50 bg-bg-app text-text-primary"
                        />
                    </div>
                    {error && (
                        <div className="text-sm text-destructive text-center">{error}</div>
                    )}
                    <div className="pt-2">
                        <Button className="w-full bg-brand-success hover:bg-brand-success/90 text-white font-semibold transition-all shadow-md active:scale-95 h-11 text-base" type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign Up 🚀
                        </Button>
                    </div>
                </CardContent>
            </form>
        </Card>
    );
}
