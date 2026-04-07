import { describe, it, expect } from 'vitest';
import { divide } from './tools.js';

describe('Math Tools', () => {
    describe('divide', () => {
        it('should divide two numbers correctly', () => {
            expect(divide(10, 2)).toBe(5);
            expect(divide(-10, 2)).toBe(-5);
            expect(divide(10, -2)).toBe(-5);
            expect(divide(-10, -2)).toBe(5);
        });

        it('should throw an error when dividing by zero', () => {
            expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
        });
    });
});
