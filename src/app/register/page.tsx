import Link from 'next/link';
import { RegisterForm } from '@/components/auth/register-form';
import { Target } from 'lucide-react';

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-app text-text-primary p-4 transition-colors duration-300">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
                <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-2xl bg-brand-streak flex items-center justify-center text-white mb-6 shadow-lg shadow-brand-streak/20 transition-transform hover:scale-105 duration-300">
                        <Target className="h-8 w-8" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">TinyWin 🏆</h1>
                    <p className="text-text-muted mt-2 text-lg">
                        Start your winning streak today! 🌱
                    </p>
                </div>

                <RegisterForm />

                <p className="text-center text-sm text-text-muted">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="text-brand-success underline-offset-4 hover:underline font-medium transition-colors"
                    >
                        Sign in 🔑
                    </Link>
                </p>
            </div>
        </div>
    );
}
