import { useEffect, useRef } from 'react';

/**
 * Como useEffect pero con debounce — la primera ejecución es inmediata,
 * las siguientes esperan `delay` ms antes de ejecutarse.
 * Si una nueva ejecución se dispara antes de que pase el delay, cancela la anterior.
 */
export function useDebouncedEffect(fn: () => void, deps: unknown[], delay: number) {
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      fn();
      return;
    }
    const timer = setTimeout(fn, delay);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
