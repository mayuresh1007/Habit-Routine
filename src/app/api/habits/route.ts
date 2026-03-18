import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Habit from '@/models/Habit';
import { createHabitSchema } from '@/lib/validations';

// GET /api/habits — List all habits for the authenticated user
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'UNAUTHORIZED', message: 'Authentication required' },
                { status: 401 }
            );
        }

        await dbConnect();

        const habits = await Habit.find({ userId: session.user.id }).sort({
            createdAt: -1,
        });

        return NextResponse.json({ habits });
    } catch (error) {
        console.error('List habits error:', error);
        return NextResponse.json(
            { error: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}

// POST /api/habits — Create a new habit
export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'UNAUTHORIZED', message: 'Authentication required' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const result = createHabitSchema.safeParse(body);

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

        await dbConnect();

        const habit = await Habit.create({
            userId: session.user.id,
            ...result.data,
        });

        return NextResponse.json({ habit }, { status: 201 });
    } catch (error) {
        console.error('Create habit error:', error);
        return NextResponse.json(
            { error: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
