import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Habit from '@/models/Habit';
import { updateHabitSchema } from '@/lib/validations';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// PUT /api/habits/:id — Update a habit
export async function PUT(req: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'UNAUTHORIZED', message: 'Authentication required' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await req.json();
        const result = updateHabitSchema.safeParse(body);

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

        const habit = await Habit.findOneAndUpdate(
            { _id: id, userId: session.user.id },
            { $set: result.data },
            { new: true, runValidators: true }
        );

        if (!habit) {
            return NextResponse.json(
                { error: 'NOT_FOUND', message: 'Habit not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ habit });
    } catch (error) {
        console.error('Update habit error:', error);
        return NextResponse.json(
            { error: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}

// DELETE /api/habits/:id — Delete a habit
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'UNAUTHORIZED', message: 'Authentication required' },
                { status: 401 }
            );
        }

        const { id } = await params;

        await dbConnect();

        const habit = await Habit.findOneAndDelete({
            _id: id,
            userId: session.user.id,
        });

        if (!habit) {
            return NextResponse.json(
                { error: 'NOT_FOUND', message: 'Habit not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete habit error:', error);
        return NextResponse.json(
            { error: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
