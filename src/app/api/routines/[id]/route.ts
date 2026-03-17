import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import RoutineItem from '@/models/RoutineItem';
import { updateRoutineSchema } from '@/lib/validations';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// PUT /api/routines/:id — Update a routine item
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
        const result = updateRoutineSchema.safeParse(body);

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

        const routine = await RoutineItem.findOneAndUpdate(
            { _id: id, userId: session.user.id },
            { $set: result.data },
            { new: true, runValidators: true }
        );

        if (!routine) {
            return NextResponse.json(
                { error: 'NOT_FOUND', message: 'Routine item not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ routine });
    } catch (error) {
        console.error('Update routine error:', error);
        return NextResponse.json(
            { error: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}

// DELETE /api/routines/:id — Delete a routine item and re-index sort orders
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

        const routine = await RoutineItem.findOneAndDelete({
            _id: id,
            userId: session.user.id,
        });

        if (!routine) {
            return NextResponse.json(
                { error: 'NOT_FOUND', message: 'Routine item not found' },
                { status: 404 }
            );
        }

        // Re-index sort orders for remaining items in the same period
        const remainingItems = await RoutineItem.find({
            userId: session.user.id,
            period: routine.period,
        }).sort({ sortOrder: 1 });

        const bulkOps = remainingItems.map((item, index) => ({
            updateOne: {
                filter: { _id: item._id },
                update: { $set: { sortOrder: index } },
            },
        }));

        if (bulkOps.length > 0) {
            await RoutineItem.bulkWrite(bulkOps);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete routine error:', error);
        return NextResponse.json(
            { error: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
