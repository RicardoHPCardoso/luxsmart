import type { StatusDado } from '@/data/tipos';
import { cn } from '@/lib/cn';

interface EstimateBadgeProps {
  /** Procedência do dado. Dados com `status: 'fonte'` não exibem selo. */
  status: StatusDado;
  tema?: 'noite' | 'dia';
  className?: string;
}

const ROTULO: Record<Exclude<StatusDado, 'fonte'>, string> = {
  estimativa: 'estimativa',
  hipotese: 'estimativa',
  placeholder: 'estimativa',
  verificar: 'a verificar',
};

const DESCRICAO: Record<Exclude<StatusDado, 'fonte'>, string> = {
  estimativa: 'valor calculado a partir de dados de referência',
  hipotese: 'baseado em hipótese do projeto',
  placeholder: 'valor provisório, a ser substituído',
  verificar: 'valor de referência a conferir na fonte oficial',
};

/**
 * Selo que sinaliza números que não são fatos medidos. O "Como calculamos?",
 * no rodapé, explica cada valor e a sua fonte.
 */
export function EstimateBadge({ status, tema = 'dia', className }: EstimateBadgeProps) {
  if (status === 'fonte') return null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 align-middle font-sans text-[0.8125rem] leading-5 font-semibold whitespace-nowrap',
        tema === 'noite'
          ? 'border-amarelo-luz/60 text-amarelo-luz'
          : 'border-amarelo-profundo/30 bg-amarelo-suave text-amarelo-profundo',
        className,
      )}
    >
      <span aria-hidden="true">≈</span>
      {ROTULO[status]}
      <span className="sr-only">: {DESCRICAO[status]}</span>
    </span>
  );
}
