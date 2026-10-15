import { useEffect, useState } from 'react';
import { getLocalDateString, msUntilNextLocalMidnight } from './dateUtils';

// Ensures the timer fires after the day has actually changed.
const MIDNIGHT_BUFFER_MS = 1000;

/**
 * Provides the current local date and re-renders the consumer when the day changes.
 * @returns {string} Local date as `YYYY-MM-DD`.
 */
export function useToday() {
  const [today, setToday] = useState(() => getLocalDateString());

  useEffect(() => {
    let timerId;

    const refresh = () => setToday(getLocalDateString());

    const scheduleNextRefresh = () => {
      timerId = setTimeout(() => {
        refresh();
        scheduleNextRefresh();
      }, msUntilNextLocalMidnight() + MIDNIGHT_BUFFER_MS);
    };

    // Background tabs throttle timers, so re-check when the user returns.
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refresh();
      }
    };

    scheduleNextRefresh();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(timerId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return today;
}
