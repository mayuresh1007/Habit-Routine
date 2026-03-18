import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';
import { Target } from 'lucide-react';
import Image from 'next/image';
export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-app text-text-primary p-4 transition-colors duration-300">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
                <div className="flex flex-col items-center text-center">
                    {/* <div className="h-16 w-16 rounded-2xl bg-brand-success flex items-center justify-center text-white mb-6 shadow-lg shadow-brand-success/20 transition-transform hover:scale-105 duration-300">
                        <Target className="h-8 w-8" />
                    </div> */}
                    {/* <h1 className="text-3xl font-bold tracking-tight">TinyWin 🎉</h1> */}
                    <Image src="/logohorizontal.png" alt="Logo" width={150} height={150} />
                    <p className="text-text-muted mt-2 text-lg">
                        Build habits that stick, win your day! 🚀
                    </p>
                </div>

                <LoginForm />

                <p className="text-center text-sm text-text-muted">
                    Don&apos;t have an account?{' '}
                    <Link
                        href="/register"
                        className="text-brand-success underline-offset-4 hover:underline font-medium transition-colors"
                    >
                        Sign up 🌟
                    </Link>
                </p>
            </div>
        </div>
    );
}
