import type { ReactNode } from 'react';
import type { StatusDado } from '@/data/tipos';
import { cn } from '@/lib/cn';
import { EstimateBadge } from './EstimateBadge';

interface StatCardProps {
  /** Número em destaque (normalmente um <AnimatedNumber>). */
  valor: ReactNode;
  rotulo: ReactNode;
  /** Procedência do número; sem ela, o card não mostra selo. */
  status?: StatusDado;
  tema?: 'noite' | 'dia';
  className?: string;
}

/** Card de indicador: número grande, rótulo curto e selo de procedência. */
export function StatCard({ valor, rotulo, status, tema = 'dia', className }: StatCardProps) {
  const noite = tema === 'noite';

  return (
    <div
      className={cn(
        'flex h-full flex-col rounded-2xl border p-5',
        noite ? 'border-linha-noite bg-white/[0.04]' : 'border-linha bg-white shadow-cartao',
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p
          className={cn(
            'font-display text-destaque font-bold tracking-tight',
            noite ? 'text-amarelo-luz' : 'text-azul-noite',
          )}
        >
          {valor}
        </p>
        {status && <EstimateBadge status={status} tema={tema} />}
      </div>
      <p className={cn('mt-2 text-base', noite ? 'text-nevoa' : 'text-tinta-suave')}>{rotulo}</p>
    </div>
  );
}
