import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';
import { Target } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground mb-4">
                        <Target className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold">VisionBoard</h1>
                    <p className="text-muted-foreground mt-2">
                        Track your habits and routines
                    </p>
                </div>

                <LoginForm />

                <p className="text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link
                        href="/register"
                        className="text-primary underline-offset-4 hover:underline font-medium"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
