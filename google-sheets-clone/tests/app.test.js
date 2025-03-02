import { sum, average, max, min, count } from '../js/mathFunctions.js';
import { trim, upper, lower, removeDuplicates, findAndReplace } from '../js/dataValidation.js';

describe('Mathematical Functions', () => {
    test('SUM function', () => {
        expect(sum([1, 2, 3, 4])).toBe(10);
        expect(sum([10, 20, 30])).toBe(60);
    });

    test('AVERAGE function', () => {
        expect(average([1, 2, 3, 4])).toBe(2.5);
        expect(average([10, 20, 30])).toBe(20);
    });

    test('MAX function', () => {
        expect(max([1, 2, 3, 4])).toBe(4);
        expect(max([10, 20, 30])).toBe(30);
    });

    test('MIN function', () => {
        expect(min([1, 2, 3, 4])).toBe(1);
        expect(min([10, 20, 30])).toBe(10);
    });

    test('COUNT function', () => {
        expect(count([1, 2, 3, 4])).toBe(4);
        expect(count([10, null, 20, undefined])).toBe(2);
    });
});

describe('Data Validation Functions', () => {
    test('TRIM function', () => {
        expect(trim('  Hello World  ')).toBe('Hello World');
    });

    test('UPPER function', () => {
        expect(upper('hello')).toBe('HELLO');
    });

    test('LOWER function', () => {
        expect(lower('HELLO')).toBe('hello');
    });

    test('REMOVE_DUPLICATES function', () => {
        expect(removeDuplicates([1, 2, 2, 3, 4, 4])).toEqual([1, 2, 3, 4]);
    });

    test('FIND_AND_REPLACE function', () => {
        expect(findAndReplace('Hello World', 'World', 'Everyone')).toBe('Hello Everyone');
    });
});