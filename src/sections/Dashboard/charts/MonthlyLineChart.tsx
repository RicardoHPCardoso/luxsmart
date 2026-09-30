import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { COR_CENARIO, TEMA_GRAFICO } from '@/lib/chartTheme';
import { CENARIOS, ROTULO_CENARIO, type Cenario, type PontoMensal } from '@/lib/energy';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { escalaEnergia, formatarNumero, formatarUmaCasa } from '@/lib/format';
import { ChartCard, TabelaDados } from './ChartCard';
import { ChartTooltip } from './ChartTooltip';

const ROTULO_CURTO: Record<Cenario, string> = {
  convencional: 'Convencional',
  atual: 'Atual',
  luxsmart: 'LuxSmart',
};

interface MonthlyLineChartProps {
  dados: readonly PontoMensal[];
  animar: boolean;
  className?: string;
}

/** Linhas: consumo acumulado mês a mês nos três cenários, com rótulo no fim de cada linha. */
export function MonthlyLineChart({ dados, animar, className }: MonthlyLineChartProps) {
  const escala = escalaEnergia(dados.at(-1)?.convencional ?? 0);
  const formatar = (v: number) => `${formatarUmaCasa(v)} ${escala.unidade}`;
  // Em telas estreitas os rótulos no fim das linhas roubariam a área do gráfico:
  // ficam só a legenda, o tooltip e a tabela.
  const rotulosDiretos = useMediaQuery('(min-width: 40rem)');
  const serie = dados.map((p) => ({
    mes: p.mes,
    convencional: p.convencional / escala.divisor,
    atual: p.atual / escala.divisor,
    luxsmart: p.luxsmart / escala.divisor,
  }));
  const ultimo = serie.length - 1;

  return (
    <ChartCard
      className={className}
      titulo="Consumo acumulado ao longo do ano"
      descricao={`Quanto cada cenário soma mês a mês, em ${escala.unidade}. A distância entre as linhas é a energia economizada.`}
      legenda={CENARIOS.map((c) => ({
        rotulo: ROTULO_CENARIO[c],
        cor: COR_CENARIO[c],
        forma: 'linha',
      }))}
      tabela={
        <TabelaDados
          legenda={`Consumo acumulado por mês, em ${escala.unidade}`}
          colunas={['Mês', ...CENARIOS.map((c) => ROTULO_CENARIO[c])]}
          linhas={serie.map(
            (p) => [p.mes, ...CENARIOS.map((c) => formatarNumero(p[c], 2))] as const,
          )}
        />
      }
    >
      <ResponsiveContainer width="100%" height={TEMA_GRAFICO.alturaGrafico}>
        <LineChart
          data={serie}
          margin={{ top: 12, right: rotulosDiretos ? 156 : 12, bottom: 0, left: 0 }}
        >
          <CartesianGrid vertical={false} stroke={TEMA_GRAFICO.grade} />
          <XAxis
            dataKey="mes"
            tick={{ fill: TEMA_GRAFICO.eixo, fontSize: 12 }}
            axisLine={{ stroke: TEMA_GRAFICO.grade }}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={8}
          />
          <YAxis
            width={44}
            tickFormatter={(v: number) => formatarNumero(v)}
            tick={{ fill: TEMA_GRAFICO.eixo, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ stroke: TEMA_GRAFICO.cursor, strokeWidth: 1 }}
            content={<ChartTooltip formatar={formatar} prefixoRotulo="Acumulado até" />}
          />
          {CENARIOS.map((c) => (
            <Line
              key={c}
              type="monotone"
              dataKey={c}
              name={ROTULO_CENARIO[c]}
              stroke={COR_CENARIO[c]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, stroke: TEMA_GRAFICO.superficie, strokeWidth: 2 }}
              isAnimationActive={animar}
              label={(props: {
                x?: number | string;
                y?: number | string;
                index?: number;
                value?: unknown;
              }) =>
                rotulosDiretos && props.index === ultimo ? (
                  <text
                    key={c}
                    x={Number(props.x) + 10}
                    y={Number(props.y)}
                    dominantBaseline="central"
                    fontSize={12}
                    fill={TEMA_GRAFICO.texto}
                    fontWeight={c === 'luxsmart' ? 700 : 500}
                  >
                    {ROTULO_CURTO[c]} · {formatar(Number(props.value))}
                  </text>
                ) : (
                  <g key={`${c}-${props.index}`} />
                )
              }
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
