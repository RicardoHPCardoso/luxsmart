import { lazy, Suspense, useMemo, useRef, useState } from 'react';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import {
  HORA_INICIO_NOITE,
  INDAIATUBA,
  ROTULO_VIA,
  TIPOS_VIA,
  type FiltroVia,
} from '@/data/indaiatuba';
import { SECOES } from '@/data/navegacao';
import { useNearViewport } from '@/hooks/useNearViewport';
import { consumoMensalAcumulado } from '@/lib/energy';
import { formatarNumero } from '@/lib/format';
import { comparacaoPorFiltro, gruposPorFiltro } from '@/lib/indaiatubaScenarios';
import { perfilPotenciaNoite } from '@/lib/nightProfile';
import { KpiTiles } from './KpiTiles';

const DashboardCharts = lazy(() => import('./DashboardCharts'));

const OPCOES_FILTRO = [
  { valor: 'cidade', rotulo: 'Cidade toda' },
  ...TIPOS_VIA.map((via) => ({ valor: via, rotulo: ROTULO_VIA[via] })),
] as const satisfies ReadonlyArray<{ valor: FiltroVia; rotulo: string }>;

export function Dashboard() {
  const [filtro, setFiltro] = useState<FiltroVia>('cidade');
  const areaGraficos = useRef<HTMLDivElement>(null);
  const carregarGraficos = useNearViewport(areaGraficos);

  const { comparacao, mensal, noite } = useMemo(() => {
    const comparacao = comparacaoPorFiltro(INDAIATUBA, filtro);
    return {
      comparacao,
      mensal: consumoMensalAcumulado(comparacao.cenarios),
      noite: perfilPotenciaNoite(
        gruposPorFiltro(INDAIATUBA, filtro),
        INDAIATUBA.dimerizacao.valor,
        INDAIATUBA.perfilMovimentoNoturno.valor,
        HORA_INICIO_NOITE,
      ),
    };
  }, [filtro]);

  return (
    <Section id={SECOES.resultados} tema="dia">
      <div className="container-site">
        <SectionHeading
          sobretitulo="Dashboard · Indaiatuba"
          titulo="Quanto a cidade deixaria de gastar"
          descricao={
            <p>
              Comparação entre três cenários para os pontos de iluminação em LED de Indaiatuba: o
              antigo vapor de sódio (referência histórica), o LED atual aceso a 100% a noite toda e
              o LED com LuxSmart. Filtre por tipo de via.
            </p>
          }
        />

        <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
          <SegmentedControl
            legenda="Tipo de via"
            opcoes={OPCOES_FILTRO}
            valor={filtro}
            aoAlterar={setFiltro}
          />
          <p className="text-sm text-tinta-suave" aria-live="polite">
            <strong className="text-tinta">{formatarNumero(comparacao.pontos)}</strong> pontos em
            LED considerados
          </p>
        </div>

        <div className="mt-6">
          <KpiTiles comparacao={comparacao} />
        </div>

        <div ref={areaGraficos} className="mt-4">
          <Suspense fallback={<EsqueletoGraficos />}>
            {carregarGraficos ? (
              <DashboardCharts
                comparacao={comparacao}
                mensal={mensal}
                noite={noite}
                dimerizacao={INDAIATUBA.dimerizacao.valor}
              />
            ) : (
              <EsqueletoGraficos />
            )}
          </Suspense>
        </div>
      </div>
    </Section>
  );
}

/** Reserva o espaço dos gráficos enquanto carregam (evita salto de layout). */
function EsqueletoGraficos() {
  return (
    <div className="grid gap-4 lg:grid-cols-2" aria-hidden="true">
      <div className="h-[25rem] rounded-3xl bg-azul-noite/90" />
      <div className="h-[25rem] rounded-3xl bg-azul-noite/90" />
      <div className="h-[29rem] rounded-3xl bg-azul-noite/90 lg:col-span-2" />
    </div>
  );
}
