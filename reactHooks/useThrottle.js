import { useCallback, useEffect, useRef } from "react";

export function useThrottle(callback, delay) {
  const timerRef = useRef(null);
  const callbackRef = useRef(callback);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    (...args) => {
      const now = Date.now();
      if (now - lastRan.current >= delay) {
        callbackRef.current(...args);
        lastRan.current = Date.now();
      } else {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
          callbackRef.current(...args);
          lastRan.current = Date.now();
        }, now - (delay - lastRan.current));
      }
    },
    [delay]
  );
}
