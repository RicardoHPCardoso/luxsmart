import { useEffect, useState } from 'react';

/** Retorna o valor só depois que ele parar de mudar por `atrasoMs`. */
export function useDebouncedValue<T>(valor: T, atrasoMs: number): T {
  const [atrasado, setAtrasado] = useState(valor);

  useEffect(() => {
    const id = window.setTimeout(() => setAtrasado(valor), atrasoMs);
    return () => window.clearTimeout(id);
  }, [valor, atrasoMs]);

  return atrasado;
}
