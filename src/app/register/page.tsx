import Link from 'next/link';
import { RegisterForm } from '@/components/auth/register-form';
import { Target } from 'lucide-react';

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground mb-4">
                        <Target className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold">VisionBoard</h1>
                    <p className="text-muted-foreground mt-2">
                        Join to sync your habits across devices
                    </p>
                </div>

                <RegisterForm />

                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="text-primary underline-offset-4 hover:underline font-medium"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
