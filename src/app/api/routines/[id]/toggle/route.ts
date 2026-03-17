import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import RoutineItem from '@/models/RoutineItem';
import { toggleDateSchema } from '@/lib/validations';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// PATCH /api/routines/:id/toggle — Toggle a specific date's completion
export async function PATCH(req: NextRequest, { params }: RouteParams) {
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
        const result = toggleDateSchema.safeParse(body);

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

        const { date } = result.data;

        await dbConnect();

        const routine = await RoutineItem.findOne({
            _id: id,
            userId: session.user.id,
        });

        if (!routine) {
            return NextResponse.json(
                { error: 'NOT_FOUND', message: 'Routine item not found' },
                { status: 404 }
            );
        }

        // Toggle: if date exists in completions, remove it; otherwise add it
        if (routine.completions.get(date)) {
            routine.completions.delete(date);
        } else {
            routine.completions.set(date, true);
        }

        await routine.save();

        return NextResponse.json({ routine });
    } catch (error) {
        console.error('Toggle routine error:', error);
        return NextResponse.json(
            { error: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
