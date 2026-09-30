import type { ReactNode } from 'react';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { EstimateBadge } from '@/components/ui/EstimateBadge';
import { INDAIATUBA } from '@/data/indaiatuba';
import type { ComparacaoCenarios } from '@/lib/energy';
import {
  formatarAnos,
  formatarEnergia,
  formatarMoeda,
  formatarMoedaCompacta,
  formatarNumero,
  formatarPercentual,
} from '@/lib/format';
import { cn } from '@/lib/cn';

interface KpiTilesProps {
  comparacao: ComparacaoCenarios;
}

/** Indicadores do dashboard. Todos derivam de estimativas, por isso levam o selo. */
export function KpiTiles({ comparacao }: KpiTilesProps) {
  const { cenarios } = comparacao;

  return (
    <ul role="list" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6">
      <Tile
        destaque
        className="col-span-2"
        rotulo="Redução do consumo"
        valor={
          <AnimatedNumber valor={comparacao.economiaPercentual} formatar={formatarPercentual} />
        }
        nota={
          <>
            De {formatarEnergia(cenarios.atual.consumoKwh)} para{' '}
            {formatarEnergia(cenarios.luxsmart.consumoKwh)} por ano, em relação ao LED atual.
          </>
        }
      />
      <Tile
        rotulo="Energia economizada"
        valor={<AnimatedNumber valor={comparacao.economiaKwh} formatar={formatarEnergia} />}
        nota="por ano"
      />
      <Tile
        rotulo="Economia na conta"
        valor={<AnimatedNumber valor={comparacao.economiaReais} formatar={formatarMoedaCompacta} />}
        nota={`por ano, com tarifa de ${formatarMoeda(INDAIATUBA.tarifa.valor, { centavos: true })}/kWh`}
      />
      <Tile
        rotulo="CO₂ evitado"
        valor={
          <AnimatedNumber
            valor={comparacao.co2EvitadoT}
            formatar={(t) => `${formatarNumero(t)} t`}
          />
        }
        nota="toneladas por ano"
      />
      <Tile
        rotulo="Retorno do investimento"
        valor={<AnimatedNumber valor={comparacao.paybackAnos} formatar={formatarAnos} />}
        nota={`kit de ${formatarMoeda(INDAIATUBA.custoKit.valor)} por poste`}
      />
    </ul>
  );
}

interface TileProps {
  rotulo: string;
  valor: ReactNode;
  nota: ReactNode;
  destaque?: boolean;
  className?: string;
}

function Tile({ rotulo, valor, nota, destaque = false, className }: TileProps) {
  return (
    <li
      className={cn(
        'flex flex-col rounded-2xl border p-4 sm:p-5',
        destaque
          ? 'border-amarelo-luz bg-amarelo-luz text-azul-noite shadow-glow'
          : 'border-linha bg-white shadow-cartao',
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={cn('text-sm font-medium', destaque ? 'text-azul-noite' : 'text-tinta-suave')}>
          {rotulo}
        </p>
        {!destaque && <EstimateBadge status="estimativa" />}
      </div>
      <p
        className={cn(
          'mt-2 font-sans font-semibold tracking-tight',
          destaque ? 'text-6xl' : 'text-2xl sm:text-3xl',
        )}
      >
        {valor}
      </p>
      <p className={cn('mt-auto pt-2 text-sm', destaque ? 'text-azul-noite' : 'text-tinta-suave')}>
        {nota}
        {destaque && (
          <span className="mt-2 block">
            <span className="inline-flex items-center gap-1 rounded-full border border-azul-noite/30 px-2 py-0.5 text-[0.6875rem] font-semibold tracking-wide uppercase">
              <span aria-hidden="true">≈</span> estimativa
            </span>
          </span>
        )}
      </p>
    </li>
  );
}
