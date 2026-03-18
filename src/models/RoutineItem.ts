import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRoutineItem extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    period: 'morning' | 'afternoon' | 'evening';
    name: string;
    timeEstimate: number | null;
    sortOrder: number;
    completions: Map<string, boolean>;
    createdAt: Date;
    updatedAt: Date;
}

const routineItemSchema = new Schema<IRoutineItem>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            index: true,
        },
        period: {
            type: String,
            enum: {
                values: ['morning', 'afternoon', 'evening'],
                message: 'Period must be morning, afternoon, or evening',
            },
            required: [true, 'Period is required'],
        },
        name: {
            type: String,
            required: [true, 'Routine item name is required'],
            maxlength: [100, 'Name must be at most 100 characters'],
            trim: true,
        },
        timeEstimate: {
            type: Number,
            default: null,
            min: [0, 'Time estimate must be non-negative'],
        },
        sortOrder: {
            type: Number,
            required: true,
            default: 0,
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

// Compound index for sorting within a period
routineItemSchema.index({ userId: 1, period: 1, sortOrder: 1 });

// Transform for JSON responses
routineItemSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        if (ret.completions instanceof Map) {
            ret.completions = Object.fromEntries(ret.completions);
        }
        delete ret.__v;
        return ret;
    },
});

const RoutineItem: Model<IRoutineItem> =
    mongoose.models.RoutineItem ||
    mongoose.model<IRoutineItem>('RoutineItem', routineItemSchema);

export default RoutineItem;
