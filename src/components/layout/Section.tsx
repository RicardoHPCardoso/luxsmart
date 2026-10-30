import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import type { IdSecao } from '@/data/navegacao';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  id: IdSecao;
  tema?: 'noite' | 'dia' | 'branco';
  /** Remove o espaçamento vertical padrão (para seções com layout próprio). */
  semPadding?: boolean;
  /**
   * Degradê suave no topo quando a seção anterior tem o tema oposto:
   * "da-noite" = amanhecer (seção clara depois de uma escura),
   * "do-dia" = anoitecer (seção escura depois de uma clara).
   */
  transicao?: 'da-noite' | 'do-dia';
}

const TRANSICOES = {
  'da-noite': 'from-azul-noite/25',
  'do-dia': 'from-off-white/10',
} as const;

const TEMAS = {
  noite: 'tema-noite',
  dia: 'tema-dia',
  branco: 'tema-dia bg-white',
} as const;

/** Wrapper de seção: aplica tema (noite/dia) e espaçamento vertical padrão. */
export function Section({
  id,
  tema = 'dia',
  semPadding = false,
  transicao,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative scroll-mt-20',
        TEMAS[tema],
        !semPadding && 'py-16 sm:py-20',
        className,
      )}
      {...props}
    >
      {transicao && (
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b to-transparent',
            TRANSICOES[transicao],
          )}
        />
      )}
      {children}
    </section>
  );
}
