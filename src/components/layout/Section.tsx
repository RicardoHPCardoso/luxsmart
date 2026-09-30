import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import type { IdSecao } from '@/data/navegacao';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  id: IdSecao;
  tema?: 'noite' | 'dia' | 'branco';
  /** Remove o espaçamento vertical padrão (para seções com layout próprio). */
  semPadding?: boolean;
}

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
        !semPadding && 'py-20 sm:py-28',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
