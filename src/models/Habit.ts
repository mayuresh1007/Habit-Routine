import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHabit extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    name: string;
    emoji: string;
    frequency: 'daily' | 'weekly';
    completions: Map<string, boolean>;
    createdAt: Date;
    updatedAt: Date;
}

const habitSchema = new Schema<IHabit>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Habit name is required'],
            maxlength: [100, 'Name must be at most 100 characters'],
            trim: true,
        },
        emoji: {
            type: String,
            required: [true, 'Emoji is required'],
        },
        frequency: {
            type: String,
            enum: {
                values: ['daily', 'weekly'],
                message: 'Frequency must be daily or weekly',
            },
            required: [true, 'Frequency is required'],
            default: 'daily',
        },
        completions: {
            type: Map,
            of: Boolean,
            default: () => new Map(),
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for faster user-scoped queries
habitSchema.index({ userId: 1, createdAt: -1 });

// Transform for JSON responses
habitSchema.set('toJSON', {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transform: (_doc: any, ret: any) => {
        ret.id = ret._id.toString();
        // Convert Map to plain object for frontend compatibility
        if (ret.completions instanceof Map) {
            ret.completions = Object.fromEntries(ret.completions);
        }
        delete ret.__v;
        return ret;
    },
});

const Habit: Model<IHabit> =
    mongoose.models.Habit || mongoose.model<IHabit>('Habit', habitSchema);

export default Habit;
