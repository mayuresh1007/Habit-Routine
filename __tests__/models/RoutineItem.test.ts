import mongoose from 'mongoose';
import RoutineItem from '@/models/RoutineItem';

describe('RoutineItem Model', () => {
    const userId = new mongoose.Types.ObjectId();

    it('should create a routine item with defaults', async () => {
        const item = await RoutineItem.create({
            userId,
            period: 'morning',
            name: 'Meditate',
            timeEstimate: 15,
            sortOrder: 0,
        });

        expect(item.name).toBe('Meditate');
        expect(item.period).toBe('morning');
        expect(item.timeEstimate).toBe(15);
        expect(item.sortOrder).toBe(0);
        expect(item.completions.size).toBe(0);
    });

    it('should validate period enum', async () => {
        await expect(
            RoutineItem.create({
                userId,
                period: 'midnight', // invalid
                name: 'Test',
                sortOrder: 0,
            })
        ).rejects.toThrow();
    });

    it('should allow null timeEstimate', async () => {
        const item = await RoutineItem.create({
            userId,
            period: 'evening',
            name: 'Read book',
            timeEstimate: null,
            sortOrder: 0,
        });

        expect(item.timeEstimate).toBeNull();
    });

    it('should handle completions map operations', async () => {
        const item = await RoutineItem.create({
            userId,
            period: 'afternoon',
            name: 'Walk the dog',
            sortOrder: 0,
        });

        item.completions.set('2026-03-17', true);
        await item.save();

        const found = await RoutineItem.findById(item._id);
        expect(found!.completions.get('2026-03-17')).toBe(true);
    });

    it('should include id alias in JSON output', async () => {
        const item = await RoutineItem.create({
            userId,
            period: 'morning',
            name: 'Stretch',
            sortOrder: 0,
        });

        const json = item.toJSON();
        expect(json.id).toBe(item._id.toString());
        expect(json.__v).toBeUndefined();
    });
});
