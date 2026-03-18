import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import RoutineItem from '@/models/RoutineItem';
import { reorderRoutineSchema } from '@/lib/validations';

import mongoose from 'mongoose';

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
        const result = reorderRoutineSchema.safeParse(body);

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

        const { period, itemIds } = result.data;

        await dbConnect();

        // Verify all items belong to the user and period
        const items = await RoutineItem.find({
            _id: { $in: itemIds },
            userId: session.user.id,
            period,
        });

        if (items.length !== itemIds.length) {
            return NextResponse.json(
                {
                    error: 'VALIDATION_ERROR',
                    message:
                        'Some items were not found or do not belong to the specified period',
                },
                { status: 400 }
            );
        }

        // Update sort orders in bulk based on the new order
        const bulkOps = itemIds.map((id, index) => ({
            updateOne: {
                filter: { 
                    _id: new mongoose.Types.ObjectId(id), 
                    userId: new mongoose.Types.ObjectId(session.user!.id) 
                },
                update: { $set: { sortOrder: index } },
            },
        }));

        await RoutineItem.bulkWrite(bulkOps);

        // Fetch updated items
        const updatedRoutines = await RoutineItem.find({
            userId: session.user!.id,
            period,
        }).sort({ sortOrder: 1 });

        return NextResponse.json({ routines: updatedRoutines });
    } catch (error) {
        console.error('Reorder routines error:', error);
        return NextResponse.json(
            { error: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
