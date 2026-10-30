import { useReducedMotion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { useCallback, type MouseEvent } from 'react';

/**
 * Rola suavemente até uma seção e move o foco para ela, preservando a
 * navegação por teclado (o foco segue o conteúdo, como num link âncora nativo).
 * O espaço do cabeçalho fixo vem do `scroll-padding-top` do <html> (index.css),
 * que o Lenis e o scrollIntoView nativo já respeitam.
 */
export function useScrollTo() {
  const lenis = useLenis();
  const reduzirMovimento = useReducedMotion();

  const rolarPara = useCallback(
    (id: string) => {
      const alvo = document.getElementById(id);
      if (!alvo) return;

      if (lenis) {
        lenis.scrollTo(alvo, { immediate: Boolean(reduzirMovimento) });
      } else {
        alvo.scrollIntoView({ behavior: reduzirMovimento ? 'auto' : 'smooth', block: 'start' });
      }

      if (!alvo.hasAttribute('tabindex')) alvo.setAttribute('tabindex', '-1');
      alvo.focus({ preventScroll: true });
      history.replaceState(null, '', `#${id}`);
    },
    [lenis, reduzirMovimento],
  );

  /** Handler para `<a href="#id">`: mantém ctrl/cmd+clique funcionando normalmente. */
  const aoClicarAncora = useCallback(
    (evento: MouseEvent<HTMLAnchorElement>) => {
      if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.button !== 0) return;
      const id = evento.currentTarget.hash.slice(1);
      if (!id) return;
      evento.preventDefault();
      rolarPara(id);
    },
    [rolarPara],
  );

  return { rolarPara, aoClicarAncora };
}
