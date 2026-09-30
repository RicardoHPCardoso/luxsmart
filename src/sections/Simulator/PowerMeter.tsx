import type { ConsumoInstantaneo } from '@/lib/simulation';
import { COR_CENARIO } from '@/lib/chartTheme';
import { formatarNumero, formatarPercentual } from '@/lib/format';

interface PowerMeterProps {
  consumo: ConsumoInstantaneo;
  totalPostes: number;
}

/**
 * Medidor do consumo instantâneo da rua comparado a "todos os postes a 100%".
 * Atualizado a cada quadro, por isso usa só transform (sem animar layout).
 */
export function PowerMeter({ consumo, totalPostes }: PowerMeterProps) {
  const economia = 1 - consumo.fracao;

  return (
    <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr_1fr]">
      <div className="rounded-2xl border border-linha bg-white p-5 shadow-cartao">
        <p className="text-sm font-medium text-tinta-suave">Consumo agora</p>
        <p className="mt-1 text-3xl font-semibold tabular-nums">
          {formatarNumero(consumo.atualW)} W
          <span className="text-base font-normal text-tinta-suave">
            {' '}
            de {formatarNumero(consumo.todos100W)} W
          </span>
        </p>
        <div
          className="relative mt-3 h-3 overflow-hidden rounded-full bg-azul-claro"
          role="meter"
          aria-label="Consumo atual em relação a todos os postes a 100%"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(consumo.fracao * 100)}
          aria-valuetext={`${formatarPercentual(consumo.fracao)} do consumo com todos os postes a 100%`}
        >
          <div
            className="h-full origin-left rounded-full"
            style={{ backgroundColor: COR_CENARIO.atual, transform: `scaleX(${consumo.fracao})` }}
          />
        </div>
        <p className="mt-2 text-sm text-tinta-suave">
          {formatarPercentual(consumo.fracao)} do consumo com todos os postes a 100%
        </p>
      </div>

      <div className="rounded-2xl border border-amarelo-luz bg-amarelo-luz p-5 text-azul-noite shadow-glow">
        <p className="text-sm font-medium">Economia instantânea</p>
        <p className="mt-1 text-4xl font-semibold tabular-nums">{formatarPercentual(economia)}</p>
        <p className="mt-2 text-sm">em relação à rua toda acesa a 100%</p>
      </div>

      <div className="rounded-2xl border border-linha bg-white p-5 shadow-cartao">
        <p className="text-sm font-medium text-tinta-suave">Postes a 100%</p>
        <p className="mt-1 text-4xl font-semibold tabular-nums">
          {consumo.acesosTotal}
          <span className="text-base font-normal text-tinta-suave"> de {totalPostes}</span>
        </p>
        <p className="mt-2 text-sm text-tinta-suave">
          {totalPostes - consumo.acesosTotal} em modo econômico ou transição
        </p>
      </div>
    </div>
  );
}
