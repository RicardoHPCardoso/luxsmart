import { useReducedMotion } from 'framer-motion';
import { ReactLenis } from 'lenis/react';
import type { ReactNode } from 'react';

/**
 * Scroll suave (Lenis) para a página inteira.
 * Desativado quando o usuário prefere movimento reduzido.
 * Links internos usam `useScrollTo`, que também move o foco do teclado.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduzirMovimento = useReducedMotion();

  if (reduzirMovimento) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.12 }}>
      {children}
    </ReactLenis>
  );
}
