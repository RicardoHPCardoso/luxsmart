import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface ItemLegenda {
  rotulo: string;
  cor: string;
  /** Forma da amostra: barra/área (quadrado) ou linha. */
  forma?: 'quadrado' | 'linha';
}

interface ChartCardProps {
  titulo: string;
  descricao: ReactNode;
  legenda?: readonly ItemLegenda[];
  /** O gráfico (Recharts). */
  children: ReactNode;
  /** Tabela equivalente, exibida sob demanda. */
  tabela: ReactNode;
  className?: string;
}

/**
 * Moldura padrão dos gráficos: título, descrição, legenda, gráfico e a
 * tabela de dados equivalente (alternativa acessível ao gráfico).
 */
export function ChartCard({
  titulo,
  descricao,
  legenda,
  children,
  tabela,
  className,
}: ChartCardProps) {
  return (
    <figure
      className={cn(
        'tema-noite flex min-w-0 flex-col rounded-3xl border border-linha-noite p-5 sm:p-6',
        className,
      )}
    >
      <figcaption>
        <h3 className="font-sans text-lg font-semibold tracking-normal">{titulo}</h3>
        <p className="mt-1 text-sm text-nevoa">{descricao}</p>
      </figcaption>

      {legenda && (
        <ul role="list" className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-nevoa">
          {legenda.map((item) => (
            <li key={item.rotulo} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={cn(
                  'shrink-0',
                  item.forma === 'linha' ? 'h-0.5 w-4 rounded-full' : 'size-3 rounded-sm',
                )}
                style={{ backgroundColor: item.cor }}
              />
              {item.rotulo}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 min-w-0">{children}</div>

      <details className="group mt-4 text-sm">
        <summary className="inline-flex min-h-6 cursor-pointer items-center gap-1 font-semibold text-azul-brilho hover:text-white">
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-200 group-open:rotate-90"
          >
            ›
          </span>
          Ver dados em tabela
        </summary>
        <div className="mt-3 overflow-x-auto">{tabela}</div>
      </details>
    </figure>
  );
}

interface TabelaDadosProps {
  legenda: string;
  colunas: readonly string[];
  linhas: ReadonlyArray<readonly [string, ...string[]]>;
}

/** Tabela simples de dados (primeira coluna é o cabeçalho de linha). */
export function TabelaDados({ legenda, colunas, linhas }: TabelaDadosProps) {
  return (
    <table className="w-full border-collapse text-left tabular-nums">
      <caption className="sr-only">{legenda}</caption>
      <thead>
        <tr className="border-b border-linha-noite text-nevoa">
          {colunas.map((c) => (
            <th key={c} scope="col" className="py-2 pr-4 font-semibold">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {linhas.map(([cabecalho, ...valores]) => (
          <tr key={cabecalho} className="border-b border-linha-noite/60">
            <th scope="row" className="py-2 pr-4 font-medium">
              {cabecalho}
            </th>
            {valores.map((v, i) => (
              <td key={i} className="py-2 pr-4">
                {v}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
