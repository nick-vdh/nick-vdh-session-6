import {
  getLocalDateString,
  isOverdue,
  msUntilNextLocalMidnight
} from '../dateUtils';

describe('dateUtils', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getLocalDateString', () => {
    it('should format a date as local YYYY-MM-DD', () => {
      expect(getLocalDateString(new Date(2025, 11, 25, 13, 45))).toBe('2025-12-25');
    });

    it('should zero-pad month and day', () => {
      expect(getLocalDateString(new Date(2025, 0, 5))).toBe('2025-01-05');
    });

    it('should use the local date just before midnight', () => {
      expect(getLocalDateString(new Date(2025, 5, 15, 23, 59, 59))).toBe('2025-06-15');
    });

    it('should default to the current time', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2025, 2, 9, 8, 0));

      expect(getLocalDateString()).toBe('2025-03-09');
    });
  });

  describe('isOverdue', () => {
    const today = '2025-06-15';

    it('should be overdue when incomplete and due before today', () => {
      expect(isOverdue({ completed: 0, dueDate: '2025-06-14' }, today)).toBe(true);
    });

    it('should not be overdue when due today', () => {
      expect(isOverdue({ completed: 0, dueDate: '2025-06-15' }, today)).toBe(false);
    });

    it('should not be overdue when due in the future', () => {
      expect(isOverdue({ completed: 0, dueDate: '2025-06-16' }, today)).toBe(false);
    });

    it('should compare across month and year boundaries', () => {
      expect(isOverdue({ completed: 0, dueDate: '2024-12-31' }, '2025-01-01')).toBe(true);
    });

    it.each([null, undefined, '', '   '])('should not be overdue when dueDate is %p', (dueDate) => {
      expect(isOverdue({ completed: 0, dueDate }, today)).toBe(false);
    });

    it.each(['not-a-date', '2025-02-30', '2025-13-01', '2025-6-1', '20250601', 20250601])(
      'should not be overdue when dueDate is invalid (%p)',
      (dueDate) => {
        expect(isOverdue({ completed: 0, dueDate }, today)).toBe(false);
      }
    );

    it('should not be overdue when completed, even with a past due date', () => {
      expect(isOverdue({ completed: 1, dueDate: '2025-06-01' }, today)).toBe(false);
    });

    it('should use the first 10 characters of an ISO timestamp due date', () => {
      expect(isOverdue({ completed: 0, dueDate: '2025-06-14T00:00:00Z' }, today)).toBe(true);
      expect(isOverdue({ completed: 0, dueDate: '2025-06-15T23:59:59Z' }, today)).toBe(false);
    });

    it('should not throw for a missing todo or today value', () => {
      expect(() => isOverdue(undefined, today)).not.toThrow();
      expect(isOverdue(undefined, today)).toBe(false);
      expect(isOverdue({ completed: 0, dueDate: '2025-06-01' }, undefined)).toBe(false);
    });
  });

  describe('msUntilNextLocalMidnight', () => {
    it('should return the exact time left near midnight', () => {
      expect(msUntilNextLocalMidnight(new Date(2025, 5, 15, 23, 59, 30))).toBe(30 * 1000);
    });

    it('should be greater than zero exactly at midnight', () => {
      const midnight = new Date(2025, 5, 15, 0, 0, 0, 0);

      expect(msUntilNextLocalMidnight(midnight)).toBeGreaterThan(0);
    });

    it('should roll over month and year ends', () => {
      expect(msUntilNextLocalMidnight(new Date(2025, 11, 31, 23, 0, 0))).toBe(60 * 60 * 1000);
    });

    it('should default to the current time', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2025, 5, 15, 23, 59, 0));

      expect(msUntilNextLocalMidnight()).toBe(60 * 1000);
    });
  });
});
