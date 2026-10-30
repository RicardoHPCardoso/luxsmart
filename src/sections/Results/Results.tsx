import { Section } from '@/components/layout/Section';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { EstimateBadge } from '@/components/ui/EstimateBadge';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { StatCard } from '@/components/ui/StatCard';
import { INDAIATUBA } from '@/data/indaiatuba';
import { SECOES } from '@/data/navegacao';
import {
  formatarCompacto,
  formatarEnergia,
  formatarMoedaCompacta,
  formatarNumero,
  formatarPercentual,
} from '@/lib/format';
import { comparacaoPorFiltro } from '@/lib/indaiatubaScenarios';
import { ScenarioBars } from './ScenarioBars';

const cidade = comparacaoPorFiltro(INDAIATUBA, 'cidade');
const formatarToneladas = (t: number) => `${formatarNumero(t)} t`;

const KPIS = [
  {
    rotulo: 'de energia economizada por ano',
    valor: cidade.economiaKwh,
    formatar: formatarEnergia,
  },
  {
    rotulo: 'a menos na conta de luz por ano',
    valor: cidade.economiaReais,
    formatar: formatarMoedaCompacta,
  },
  {
    rotulo: 'menos consumo que o LED atual',
    valor: cidade.economiaPercentual,
    formatar: formatarPercentual,
  },
  { rotulo: 'de CO₂ evitado por ano', valor: cidade.co2EvitadoT, formatar: formatarToneladas },
] as const;

/** Resultados para Indaiatuba: 4 indicadores e o comparativo dos 3 cenários. */
export function Results() {
  return (
    <Section id={SECOES.resultados} tema="branco">
      <div className="container-site">
        <SectionHeading
          sobretitulo="Resultados · Indaiatuba"
          titulo="Quanto a cidade economiza"
          descricao={`Projeção para os ${formatarCompacto(cidade.pontos)} pontos em LED da cidade, por ano.`}
        />

        <p className="mt-6 flex flex-wrap items-center gap-2 text-tinta-suave">
          <EstimateBadge status="estimativa" />
          Valores calculados com dados de referência.
        </p>

        <ul role="list" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {KPIS.map((kpi, i) => (
            <Reveal as="li" key={kpi.rotulo} atraso={i * 0.06}>
              <StatCard
                valor={<AnimatedNumber valor={kpi.valor} formatar={kpi.formatar} />}
                rotulo={kpi.rotulo}
              />
            </Reveal>
          ))}
        </ul>

        <ScenarioBars cenarios={cidade.cenarios} economiaPercentual={cidade.economiaPercentual} />
      </div>
    </Section>
  );
}
