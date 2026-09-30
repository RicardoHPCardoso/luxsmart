import { useId } from 'react';
import { cn } from '@/lib/cn';

export interface OpcaoSegmentada<T extends string> {
  valor: T;
  rotulo: string;
}

interface SegmentedControlProps<T extends string> {
  legenda: string;
  opcoes: readonly OpcaoSegmentada<T>[];
  valor: T;
  aoAlterar: (valor: T) => void;
  /** Esconde a legenda visualmente (continua disponível para leitores de tela). */
  ocultarLegenda?: boolean;
  tema?: 'noite' | 'dia';
  className?: string;
}

/**
 * Grupo de opções exclusivas com aparência de "pílulas".
 * Usa rádios nativos: setas do teclado, foco e leitura por leitores de tela
 * funcionam sem JavaScript extra.
 */
export function SegmentedControl<T extends string>({
  legenda,
  opcoes,
  valor,
  aoAlterar,
  ocultarLegenda = false,
  tema = 'dia',
  className,
}: SegmentedControlProps<T>) {
  const nome = useId();
  const noite = tema === 'noite';

  return (
    <fieldset className={className}>
      <legend
        className={cn(
          'mb-2 text-sm font-semibold',
          ocultarLegenda && 'sr-only',
          noite ? 'text-nevoa' : 'text-tinta-suave',
        )}
      >
        {legenda}
      </legend>
      <div
        className={cn(
          'inline-flex flex-wrap gap-1 rounded-2xl border p-1',
          noite ? 'border-linha-noite bg-white/5' : 'border-linha bg-white shadow-cartao',
        )}
      >
        {opcoes.map((opcao) => (
          <label
            key={opcao.valor}
            className={cn(
              'relative flex min-h-10 cursor-pointer items-center rounded-xl px-4 text-sm font-semibold transition-colors duration-200',
              'has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--focus-ring)',
              'has-[:checked]:bg-amarelo-luz has-[:checked]:text-azul-noite has-[:checked]:shadow-glow-sm',
              noite ? 'text-nevoa hover:text-white' : 'text-tinta-suave hover:text-tinta',
            )}
          >
            <input
              type="radio"
              name={nome}
              value={opcao.valor}
              checked={valor === opcao.valor}
              onChange={() => aoAlterar(opcao.valor)}
              className="sr-only"
            />
            {opcao.rotulo}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
