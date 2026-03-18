import { z } from 'zod';

// ─── Auth Schemas ───────────────────────────────────────────────

export const registerSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be at most 50 characters')
        .trim(),
    email: z
        .string()
        .email('Invalid email address')
        .toLowerCase()
        .trim(),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address').toLowerCase().trim(),
    password: z.string().min(1, 'Password is required'),
});

// ─── Habit Schemas ──────────────────────────────────────────────

export const createHabitSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .max(100, 'Name must be at most 100 characters')
        .trim(),
    emoji: z.string().min(1, 'Emoji is required'),
    frequency: z.enum(['daily', 'weekly'], {
        message: 'Frequency must be daily or weekly',
    }),
});

export const updateHabitSchema = createHabitSchema;

export const reorderHabitsSchema = z.object({
    habitIds: z.array(z.string()).min(1, 'At least one habit ID is required'),
});

export const toggleDateSchema = z.object({
    date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

// ─── Routine Schemas ────────────────────────────────────────────

export const createRoutineSchema = z.object({
    period: z.enum(['morning', 'afternoon', 'evening'], {
        message: 'Period must be morning, afternoon, or evening',
    }),
    name: z
        .string()
        .min(1, 'Name is required')
        .max(100, 'Name must be at most 100 characters')
        .trim(),
    timeEstimate: z.number().positive('Time estimate must be positive').nullable(),
});

export const updateRoutineSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .max(100, 'Name must be at most 100 characters')
        .trim(),
    timeEstimate: z.number().positive('Time estimate must be positive').nullable(),
});

export const reorderRoutineSchema = z.object({
    period: z.enum(['morning', 'afternoon', 'evening'], {
        message: 'Period must be morning, afternoon, or evening',
    }),
    itemIds: z.array(z.string()).min(1, 'At least one item ID is required'),
});

// ─── Type Exports ───────────────────────────────────────────────

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;
export type ReorderHabitsInput = z.infer<typeof reorderHabitsSchema>;
export type ToggleDateInput = z.infer<typeof toggleDateSchema>;
export type CreateRoutineInput = z.infer<typeof createRoutineSchema>;
export type UpdateRoutineInput = z.infer<typeof updateRoutineSchema>;
export type ReorderRoutineInput = z.infer<typeof reorderRoutineSchema>;
