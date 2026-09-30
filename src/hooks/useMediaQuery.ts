import { useCallback, useSyncExternalStore } from 'react';

/**
 * Observa uma media query CSS. Retorna `false` fora do navegador.
 *
 * @example const ponteiroFino = useMediaQuery('(pointer: fine)');
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (notificar: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', notificar);
      return () => mql.removeEventListener('change', notificar);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
