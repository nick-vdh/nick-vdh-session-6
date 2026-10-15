import { renderHook, act } from '@testing-library/react';
import { useToday } from '../useToday';

describe('useToday', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2025, 5, 15, 23, 59, 30));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should return the current local date', () => {
    const { result } = renderHook(() => useToday());

    expect(result.current).toBe('2025-06-15');
  });

  it('should update after the local day rolls over', () => {
    const { result } = renderHook(() => useToday());

    act(() => {
      jest.advanceTimersByTime(31 * 1000);
    });

    expect(result.current).toBe('2025-06-16');
  });

  it('should keep updating on following days', () => {
    const { result } = renderHook(() => useToday());

    act(() => {
      jest.advanceTimersByTime(31 * 1000 + 24 * 60 * 60 * 1000);
    });

    expect(result.current).toBe('2025-06-17');
  });

  it('should re-check the date when the document becomes visible', () => {
    const { result } = renderHook(() => useToday());

    // Move the clock without firing timers, as when a background tab is throttled.
    jest.setSystemTime(new Date(2025, 5, 18, 9, 0, 0));
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(result.current).toBe('2025-06-18');
  });

  it('should not update on visibilitychange while the document is hidden', () => {
    jest.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    const { result } = renderHook(() => useToday());

    jest.setSystemTime(new Date(2025, 5, 18, 9, 0, 0));
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(result.current).toBe('2025-06-15');
  });

  it('should clear the timer and listener on unmount', () => {
    const removeSpy = jest.spyOn(document, 'removeEventListener');
    const { unmount } = renderHook(() => useToday());

    expect(jest.getTimerCount()).toBe(1);
    unmount();

    expect(jest.getTimerCount()).toBe(0);
    expect(removeSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
  });
});
