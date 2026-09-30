import type { ReactNode } from 'react';
import type { StatusDado } from '@/data/tipos';
import { cn } from '@/lib/cn';
import { EstimateBadge } from './EstimateBadge';

interface StatCardProps {
  /** Número em destaque (normalmente um <AnimatedNumber>). */
  valor: ReactNode;
  rotulo: ReactNode;
  status: StatusDado;
  /** Linha complementar (fonte, contexto). */
  nota?: ReactNode;
  tema?: 'noite' | 'dia';
  className?: string;
}

/** Card de indicador: número grande, rótulo e selo de procedência. */
export function StatCard({
  valor,
  rotulo,
  status,
  nota,
  tema = 'noite',
  className,
}: StatCardProps) {
  const noite = tema === 'noite';

  return (
    <div
      className={cn(
        'flex h-full flex-col rounded-2xl border p-6',
        noite ? 'border-linha-noite bg-white/[0.03]' : 'border-linha bg-white shadow-cartao',
        className,
      )}
    >
      {/* Linha do selo com altura fixa: mantém os números alinhados entre cards. */}
      <div className="flex min-h-5 items-center">
        <EstimateBadge status={status} tema={tema} />
      </div>
      <p
        className={cn(
          'mt-2 font-display text-4xl font-bold tracking-tight',
          noite ? 'text-amarelo-luz' : 'text-azul-noite',
        )}
      >
        {valor}
      </p>
      <p className={cn('mt-3 font-medium', noite ? 'text-white' : 'text-tinta')}>{rotulo}</p>
      {nota && (
        <p className={cn('mt-auto pt-3 text-sm', noite ? 'text-nevoa' : 'text-tinta-suave')}>
          {nota}
        </p>
      )}
    </div>
  );
}
