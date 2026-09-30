import { useEffect, useState } from 'react';

/**
 * Fica `true` quando o navegador está ocioso depois do carregamento inicial
 * (ou após `limiteMs`, o que vier antes). Usado para baixar a cena 3D sem
 * disputar rede e CPU com o conteúdo principal (melhor LCP/INP).
 */
export function useIdle(limiteMs = 2000): boolean {
  const [ocioso, setOcioso] = useState(false);

  useEffect(() => {
    const marcar = () => setOcioso(true);
    // Safari ainda não tem requestIdleCallback: usa um temporizador.
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(marcar, { timeout: limiteMs });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(marcar, limiteMs);
    return () => clearTimeout(id);
  }, [limiteMs]);

  return ocioso;
}
