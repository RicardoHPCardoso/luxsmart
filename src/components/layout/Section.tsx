import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import type { IdSecao } from '@/data/navegacao';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  id: IdSecao;
  tema?: 'noite' | 'dia' | 'branco';
}

const TEMAS = {
  noite: 'tema-noite',
  dia: 'tema-dia',
  branco: 'tema-dia bg-white',
} as const;

/** Wrapper de seção: aplica tema (noite/dia) e espaçamento vertical padrão. */
export function Section({ id, tema = 'dia', className, children, ...props }: SectionProps) {
  return (
    <section id={id} className={cn('relative py-16 sm:py-20', TEMAS[tema], className)} {...props}>
      {children}
    </section>
  );
}
