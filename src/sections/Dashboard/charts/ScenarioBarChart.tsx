import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { COR_CENARIO, TEMA_GRAFICO } from '@/lib/chartTheme';
import { CENARIOS, ROTULO_CENARIO, type Cenario, type ResultadoCenario } from '@/lib/energy';
import {
  escalaEnergia,
  formatarMoeda,
  formatarNumero,
  formatarPercentual,
  formatarUmaCasa,
} from '@/lib/format';
import { ChartCard, TabelaDados } from './ChartCard';
import { ChartTooltip } from './ChartTooltip';

const ROTULO_CURTO: Record<Cenario, string> = {
  convencional: 'Convencional',
  atual: 'Atual (LED)',
  luxsmart: 'LuxSmart',
};

/** Altura do gráfico (px) em telas largas e estreitas. */
const ALTURA = { normal: 300, compacta: 220 } as const;

interface ScenarioBarChartProps {
  cenarios: Record<Cenario, ResultadoCenario>;
  economiaPercentual: number;
  animar: boolean;
}

/** Barras horizontais: consumo anual de cada cenário. */
export function ScenarioBarChart({ cenarios, economiaPercentual, animar }: ScenarioBarChartProps) {
  // Em telas estreitas o rótulo curto (sem o "−45%") deixa espaço para as barras.
  const compacto = !useMediaQuery('(min-width: 40rem)');
  const escala = escalaEnergia(Math.max(...CENARIOS.map((c) => cenarios[c].consumoKwh)));
  const formatar = (v: number) => `${formatarUmaCasa(v)} ${escala.unidade}`;
  const dados = CENARIOS.map((c) => ({
    cenario: c,
    rotulo: ROTULO_CURTO[c],
    valor: cenarios[c].consumoKwh / escala.divisor,
    cor: COR_CENARIO[c],
  }));

  return (
    <ChartCard
      titulo="Consumo anual por cenário"
      descricao={`Energia gasta em um ano, em ${escala.unidade}. O LuxSmart reduz ${formatarPercentual(economiaPercentual)} em relação ao LED atual.`}
      tabela={
        <TabelaDados
          legenda="Consumo e custo anual por cenário"
          colunas={['Cenário', 'Consumo anual', 'Custo anual']}
          linhas={CENARIOS.map(
            (c) =>
              [
                ROTULO_CENARIO[c],
                formatar(cenarios[c].consumoKwh / escala.divisor),
                formatarMoeda(cenarios[c].custoReais),
              ] as const,
          )}
        />
      }
    >
      <ResponsiveContainer width="100%" height={compacto ? ALTURA.compacta : ALTURA.normal}>
        <BarChart
          data={dados}
          layout="vertical"
          margin={{ top: 4, right: compacto ? 68 : 112, bottom: 4, left: 0 }}
          barCategoryGap="24%"
        >
          <CartesianGrid horizontal={false} stroke={TEMA_GRAFICO.grade} />
          <XAxis
            type="number"
            tickFormatter={(v: number) => formatarNumero(v, 1)}
            tick={{ fill: TEMA_GRAFICO.eixo, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="rotulo"
            width={compacto ? 92 : 96}
            tick={{ fill: TEMA_GRAFICO.texto, fontSize: compacto ? 12 : 13 }}
            axisLine={{ stroke: TEMA_GRAFICO.grade }}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgb(255 255 255 / 0.04)' }}
            content={<ChartTooltip formatar={formatar} />}
          />
          <Bar
            dataKey="valor"
            name="Consumo anual"
            barSize={TEMA_GRAFICO.espessuraBarra}
            radius={[0, 4, 4, 0]}
            isAnimationActive={animar}
          >
            {dados.map((d) => (
              <Cell key={d.cenario} fill={d.cor} />
            ))}
            <LabelList
              dataKey="valor"
              content={(props) => {
                const x = Number(props.x ?? 0) + Number(props.width ?? 0) + 8;
                const y = Number(props.y ?? 0) + Number(props.height ?? 0) / 2;
                const ehLuxSmart = dados[Number(props.index)]?.cenario === 'luxsmart';
                return (
                  <text
                    x={x}
                    y={y}
                    dominantBaseline="central"
                    fill={TEMA_GRAFICO.texto}
                    fontSize={13}
                    fontWeight={ehLuxSmart ? 700 : 500}
                  >
                    {formatar(Number(props.value))}
                    {ehLuxSmart && !compacto && ` (−${formatarPercentual(economiaPercentual)})`}
                  </text>
                );
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
