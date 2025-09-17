import { useState, useEffect, useCallback } from 'react';

type ColorMode = 'system' | 'light' | 'dark';

export function useColorScheme() {
  const [mode, setModeState] = useState<ColorMode>(() => {
    try {
      const v = typeof window !== 'undefined' ? window.localStorage.getItem('app-color-scheme') : null;
      return (v as ColorMode) || 'system';
    } catch (e) {
      return 'system';
    }
  });

  const [systemMode, setSystemMode] = useState<'light' | 'dark'>(() => {
    try {
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
    } catch (e) {}
    return 'light';
  });

  useEffect(() => {
    const mql = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    if (!mql) return;
    const handler = (ev: MediaQueryListEvent) => setSystemMode(ev.matches ? 'dark' : 'light');
    try {
      // older browsers
      mql.addEventListener ? mql.addEventListener('change', handler) : mql.addListener(handler as any);
    } catch (e) {}
    return () => {
      try {
        mql.removeEventListener ? mql.removeEventListener('change', handler) : mql.removeListener(handler as any);
      } catch (e) {}
    };
  }, []);

  const setMode = useCallback((next: ColorMode) => {
    setModeState(next);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('app-color-scheme', next);
      }
    } catch (e) {}
  }, []);

  return { mode, systemMode, setMode } as const;
}

export default useColorScheme;
