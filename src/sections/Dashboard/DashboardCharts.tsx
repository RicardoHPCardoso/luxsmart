import { useReducedMotion } from 'framer-motion';
import type { ComparacaoCenarios, PontoMensal } from '@/lib/energy';
import type { PontoNoite } from '@/lib/nightProfile';
import { MonthlyLineChart } from './charts/MonthlyLineChart';
import { NightAreaChart } from './charts/NightAreaChart';
import { ScenarioBarChart } from './charts/ScenarioBarChart';

export interface DashboardChartsProps {
  comparacao: ComparacaoCenarios;
  mensal: readonly PontoMensal[];
  noite: readonly PontoNoite[];
  dimerizacao: number;
}

/**
 * Gráficos do dashboard. Carregado sob demanda (React.lazy) para que o
 * Recharts não pese no carregamento inicial da página.
 */
export default function DashboardCharts({
  comparacao,
  mensal,
  noite,
  dimerizacao,
}: DashboardChartsProps) {
  const animar = !useReducedMotion();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ScenarioBarChart
        cenarios={comparacao.cenarios}
        economiaPercentual={comparacao.economiaPercentual}
        animar={animar}
      />
      <NightAreaChart dados={noite} dimerizacao={dimerizacao} animar={animar} />
      <MonthlyLineChart dados={mensal} animar={animar} className="lg:col-span-2" />
    </div>
  );
}
