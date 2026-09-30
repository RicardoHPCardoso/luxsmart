import { useEffect, useState } from 'react';

/**
 * Retorna o id da seção que ocupa a faixa central da viewport.
 * Usado para marcar o item ativo no menu (`aria-current`).
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [ativa, setAtiva] = useState<string | null>(null);

  useEffect(() => {
    const elementos = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) setAtiva(entrada.target.id);
        }
      },
      // Considera "ativa" a seção que cruza a linha central da tela.
      { rootMargin: '-45% 0px -54% 0px' },
    );

    elementos.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return ativa;
}
