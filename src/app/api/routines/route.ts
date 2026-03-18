import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import RoutineItem from '@/models/RoutineItem';
import { createRoutineSchema } from '@/lib/validations';

// GET /api/routines — List all routine items for the authenticated user
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

        const routines = await RoutineItem.find({ userId: session.user.id }).sort({
            period: 1,
            sortOrder: 1,
        });

        return NextResponse.json({ routines });
    } catch (error) {
        console.error('List routines error:', error);
        return NextResponse.json(
            { error: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}

// POST /api/routines — Create a new routine item
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
        const result = createRoutineSchema.safeParse(body);

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

        // Auto-calculate sort order: place at end of the period's list
        const lastItem = await RoutineItem.findOne({
            userId: session.user.id,
            period: result.data.period,
        }).sort({ sortOrder: -1 });

        const sortOrder = lastItem ? lastItem.sortOrder + 1 : 0;

        const routine = await RoutineItem.create({
            userId: session.user.id,
            sortOrder,
            ...result.data,
        });

        return NextResponse.json({ routine }, { status: 201 });
    } catch (error) {
        console.error('Create routine error:', error);
        return NextResponse.json(
            { error: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
