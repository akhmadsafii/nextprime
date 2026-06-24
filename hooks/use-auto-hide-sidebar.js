'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useAutoHideSidebar({ disabled = false, delay = 8000 } = {}) {
  const [hidden, setHidden] = useState(false);
  const timerRef = useRef(null);

  const pause = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const schedule = useCallback(() => {
    pause();
    if (!disabled) {
      timerRef.current = window.setTimeout(() => setHidden(true), delay);
    }
  }, [delay, disabled, pause]);

  const show = useCallback(() => {
    pause();
    setHidden(false);
  }, [pause]);

  const hide = useCallback(() => {
    pause();
    setHidden(true);
  }, [pause]);

  useEffect(() => {
    schedule();
    return pause;
  }, [pause, schedule]);

  return { hidden, hide, show, pause, schedule };
}
