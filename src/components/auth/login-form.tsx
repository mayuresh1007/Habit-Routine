'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function LoginForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError('Invalid email or password');
                setLoading(false);
            } else {
                router.push('/');
                router.refresh(); // Refresh layout to grab new session
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
                    Welcome back 👋
                </CardTitle>
                <CardDescription className="text-text-muted">
                    Enter your credentials to continue your winning streak
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-5 pb-8">
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
                            🔒 Password
                        </label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            className="focus-visible:ring-brand-success transition-all duration-200 border-border/50 bg-bg-app text-text-primary"
                        />
                    </div>
                    {error && (
                        <div className="text-sm text-destructive text-center">{error}</div>
                    )}
                    <div className="pt-2">
                        <Button className="w-full bg-brand-success hover:bg-brand-success/90 text-white font-semibold transition-all shadow-md active:scale-95 h-11 text-base" type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign In 🚀
                        </Button>
                    </div>
                </CardContent>
            </form>
        </Card>
    );
}
