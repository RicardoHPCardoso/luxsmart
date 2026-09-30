import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { COR_CENARIO, TEMA_GRAFICO } from '@/lib/chartTheme';
import { escalaPotencia, formatarNumero, formatarPercentual } from '@/lib/format';
import type { PontoNoite } from '@/lib/nightProfile';
import { ChartCard, TabelaDados } from './ChartCard';
import { ChartTooltip } from './ChartTooltip';

interface NightAreaChartProps {
  dados: readonly PontoNoite[];
  dimerizacao: number;
  animar: boolean;
}

const ROTULO_ATUAL = 'Atual (LED a 100%)';
const ROTULO_LUXSMART = 'LuxSmart';

/** Áreas: potência hora a hora em uma noite típica, cenário atual × LuxSmart. */
export function NightAreaChart({ dados, dimerizacao, animar }: NightAreaChartProps) {
  const escala = escalaPotencia(Math.max(...dados.map((p) => p.atualKw)));
  const formatar = (v: number) => `${formatarNumero(v, 2)} ${escala.unidade}`;
  const serie = dados.map((p) => ({
    hora: p.hora,
    atual: p.atualKw / escala.divisor,
    luxsmart: p.luxsmartKw / escala.divisor,
  }));
  const nivelEconomico = (serie[0]?.atual ?? 0) * dimerizacao;
  // O último ponto (6h) só fecha o degrau do gráfico; a tabela mostra as 12 horas.
  const horas = serie.slice(0, -1);

  return (
    <ChartCard
      titulo="Potência ao longo de uma noite típica"
      descricao={`Das 18h às 6h, em ${escala.unidade}. Com LuxSmart a potência acompanha o movimento: alta no começo da noite, mínima de madrugada.`}
      legenda={[
        { rotulo: ROTULO_ATUAL, cor: COR_CENARIO.atual },
        { rotulo: ROTULO_LUXSMART, cor: COR_CENARIO.luxsmart },
      ]}
      tabela={
        <TabelaDados
          legenda={`Potência por hora da noite, em ${escala.unidade}`}
          colunas={['Hora', ROTULO_ATUAL, ROTULO_LUXSMART]}
          linhas={horas.map(
            (p) => [p.hora, formatarNumero(p.atual, 2), formatarNumero(p.luxsmart, 2)] as const,
          )}
        />
      }
    >
      <ResponsiveContainer width="100%" height={TEMA_GRAFICO.alturaGrafico}>
        <AreaChart data={serie} margin={{ top: 16, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke={TEMA_GRAFICO.grade} />
          <XAxis
            dataKey="hora"
            tick={{ fill: TEMA_GRAFICO.eixo, fontSize: 12 }}
            axisLine={{ stroke: TEMA_GRAFICO.grade }}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={10}
          />
          <YAxis
            width={44}
            tickCount={4}
            allowDecimals={false}
            tickFormatter={(v: number) => formatarNumero(v, 1)}
            tick={{ fill: TEMA_GRAFICO.eixo, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ stroke: TEMA_GRAFICO.cursor, strokeWidth: 1 }}
            content={<ChartTooltip formatar={formatar} prefixoRotulo="Às" />}
          />
          {/* Linha de referência: é um limiar, por isso tracejada. */}
          <ReferenceLine
            y={nivelEconomico}
            stroke={TEMA_GRAFICO.eixo}
            strokeDasharray="4 4"
            label={{
              value: `modo econômico (${formatarPercentual(dimerizacao)})`,
              fill: TEMA_GRAFICO.eixo,
              fontSize: 11,
              position: 'insideBottomLeft',
            }}
          />
          <Area
            type="linear"
            dataKey="atual"
            name={ROTULO_ATUAL}
            stroke={COR_CENARIO.atual}
            fill={COR_CENARIO.atual}
            fillOpacity={TEMA_GRAFICO.opacidadeArea}
            strokeWidth={2}
            activeDot={{ r: 5, stroke: TEMA_GRAFICO.superficie, strokeWidth: 2 }}
            isAnimationActive={animar}
          />
          <Area
            type="stepAfter"
            dataKey="luxsmart"
            name={ROTULO_LUXSMART}
            stroke={COR_CENARIO.luxsmart}
            fill={COR_CENARIO.luxsmart}
            fillOpacity={TEMA_GRAFICO.opacidadeArea}
            strokeWidth={2}
            activeDot={{ r: 5, stroke: TEMA_GRAFICO.superficie, strokeWidth: 2 }}
            isAnimationActive={animar}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
