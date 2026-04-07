import { describe, it, expect, vi } from 'vitest';

vi.mock('robotjs', () => ({
  default: {
    moveMouse: vi.fn(),
    mouseClick: vi.fn(),
    dragMouse: vi.fn(),
    typeString: vi.fn(),
    keyToggle: vi.fn(),
    keyTap: vi.fn()
  }
}));

import { add } from './tools.js';

describe('Math utilities', () => {
    describe('add', () => {
        it('should add two positive numbers correctly', () => {
            expect(add(2, 3)).toBe(5);
            expect(add(10, 20)).toBe(30);
        });

        it('should add positive and negative numbers correctly', () => {
            expect(add(-1, 5)).toBe(4);
            expect(add(10, -3)).toBe(7);
            expect(add(-5, -5)).toBe(-10);
        });

        it('should handle zeroes correctly', () => {
            expect(add(0, 0)).toBe(0);
            expect(add(5, 0)).toBe(5);
            expect(add(0, -5)).toBe(-5);
        });
    });
});
