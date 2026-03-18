import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { registerSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate input
        const result = registerSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                {
                    error: 'VALIDATION_ERROR',
                    message: 'Invalid input',
                    details: result.error.issues,
                },
                { status: 400 }
            );
        }

        const { name, email, password } = result.data;

        await dbConnect();

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                {
                    error: 'CONFLICT',
                    message: 'An account with this email already exists',
                },
                { status: 409 }
            );
        }

        // Create user (password is hashed by the pre-save hook)
        const user = await User.create({
            name,
            email,
            passwordHash: password,
        });

        return NextResponse.json(
            {
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            {
                error: 'INTERNAL_ERROR',
                message: 'An unexpected error occurred',
            },
            { status: 500 }
        );
    }
}
