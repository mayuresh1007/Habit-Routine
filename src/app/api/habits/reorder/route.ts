import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Habit from '@/models/Habit';
import { reorderHabitsSchema } from '@/lib/validations';

export async function PATCH(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'UNAUTHORIZED', message: 'Authentication required' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const result = reorderHabitsSchema.safeParse(body);

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

        const { habitIds } = result.data;

        // Perform bulk write to update sortOrder
        const bulkOps = habitIds.map((id, index) => ({
            updateOne: {
                filter: { _id: id, userId: session.user!.id },
                update: { $set: { sortOrder: index } },
            },
        }));

        if (bulkOps.length > 0) {
            await Habit.bulkWrite(bulkOps);
        }

        return NextResponse.json({ message: 'Habits reordered successfully' });
    } catch (error) {
        console.error('Reorder habits error:', error);
        return NextResponse.json(
            { error: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
