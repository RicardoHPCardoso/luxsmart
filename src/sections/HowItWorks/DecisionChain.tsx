import { Fragment } from 'react';
import { Icone } from '@/components/icons/icons';
import type { Etapa } from '@/data/etapas';
import { HARDWARE } from '@/data/hardware';

/**
 * Cadeia de decisão da etapa, ex.: "LDR detecta luz → ESP32 desliga os LEDs".
 * Relaciona cada estado do poste ao componente responsável.
 */
export function DecisionChain({ etapa }: { etapa: Etapa }) {
  return (
    <p className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm">
      {etapa.cadeia.map((passo, i) => (
        <Fragment key={`${passo.componente}-${i}`}>
          {i > 0 && (
            <>
              <Icone nome="seta" className="size-4 shrink-0 text-amarelo-luz" />
              <span className="sr-only">, então </span>
            </>
          )}
          <span className="rounded-full border border-amarelo-luz/50 bg-amarelo-luz/10 px-2.5 py-1 text-white">
            <strong className="font-semibold text-amarelo-luz">
              {HARDWARE[passo.componente].sigla}
            </strong>{' '}
            {passo.acao}
          </span>
        </Fragment>
      ))}
    </p>
  );
}
