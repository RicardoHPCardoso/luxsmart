import { useEffect, useState, type RefObject } from 'react';

/**
 * Fica `true` (e permanece) quando o elemento chega perto da viewport.
 * Usado para só baixar código pesado (gráficos, 3D) quando ele vai aparecer.
 *
 * @param margem distância antecipada, no formato de rootMargin (ex.: "600px")
 */
export function useNearViewport(ref: RefObject<Element | null>, margem = '600px'): boolean {
  // Sem IntersectionObserver (navegadores muito antigos/testes), carrega direto.
  const [perto, setPerto] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const el = ref.current;
    if (!el || perto) return;
    const observer = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          setPerto(true);
          observer.disconnect();
        }
      },
      { rootMargin: `${margem} 0px` },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, margem, perto]);

  return perto;
}
