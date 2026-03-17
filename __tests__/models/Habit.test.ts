import mongoose from 'mongoose';
import Habit from '@/models/Habit';

describe('Habit Model', () => {
    const userId = new mongoose.Types.ObjectId();

    it('should create a habit with defaults', async () => {
        const habit = await Habit.create({
            userId,
            name: 'Drink Water',
            emoji: '💧',
            frequency: 'daily',
        });

        expect(habit.name).toBe('Drink Water');
        expect(habit.emoji).toBe('💧');
        expect(habit.frequency).toBe('daily');
        expect(habit.completions.size).toBe(0);
        expect(habit.createdAt).toBeDefined();
    });

    it('should validate required fields', async () => {
        await expect(Habit.create({} as never)).rejects.toThrow();
        await expect(
            Habit.create({ userId, name: 'Test' } as never)
        ).rejects.toThrow();
    });

    it('should validate frequency enum', async () => {
        await expect(
            Habit.create({
                userId,
                name: 'Test',
                emoji: '💪',
                frequency: 'monthly', // invalid
            })
        ).rejects.toThrow();
    });

    it('should handle completions map operations', async () => {
        const habit = await Habit.create({
            userId,
            name: 'Read',
            emoji: '📚',
            frequency: 'daily',
        });

        // Set a completion
        habit.completions.set('2026-03-17', true);
        await habit.save();

        const found = await Habit.findById(habit._id);
        expect(found!.completions.get('2026-03-17')).toBe(true);

        // Remove a completion
        found!.completions.delete('2026-03-17');
        await found!.save();

        const updated = await Habit.findById(habit._id);
        expect(updated!.completions.get('2026-03-17')).toBeUndefined();
    });

    it('should include id alias in JSON output', async () => {
        const habit = await Habit.create({
            userId,
            name: 'Exercise',
            emoji: '🏃',
            frequency: 'daily',
        });

        const json = habit.toJSON();
        expect(json.id).toBe(habit._id.toString());
        expect(json.__v).toBeUndefined();
    });
});
