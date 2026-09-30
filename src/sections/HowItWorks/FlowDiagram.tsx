import { Icone, type NomeIcone } from '@/components/icons/icons';
import type { Etapa } from '@/data/etapas';
import { HARDWARE, type IdComponente } from '@/data/hardware';
import { cn } from '@/lib/cn';

const ICONE_COMPONENTE: Record<IdComponente, NomeIcone> = {
  luminosidade: 'sensorLuz',
  presenca: 'sensorPresenca',
  microcontrolador: 'chip',
  driver: 'driver',
  luminaria: 'lampada',
};

const DECISAO: Record<Etapa['id'], string> = {
  dia: 'decisão: desligar',
  noite: 'decisão: economizar',
  movimento: 'decisão: luz total',
};

function leitura(id: IdComponente, etapa: Etapa): string {
  const potencia = `${Math.round(etapa.intensidade * 100)}%`;
  switch (id) {
    case 'luminosidade':
      return `ambiente: ${etapa.leituras.luminosidade}`;
    case 'presenca':
      return `presença: ${etapa.leituras.presenca}`;
    case 'microcontrolador':
      return DECISAO[etapa.id];
    case 'driver':
      return `comando: ${potencia}`;
    case 'luminaria':
      return `potência: ${potencia}`;
  }
}

interface FlowDiagramProps {
  etapa: Etapa;
  className?: string;
}

/**
 * Diagrama do fluxo de sinais: sensores → microcontrolador → driver → LED.
 * Os componentes ativos na etapa acendem e as conexões mostram o sinal fluindo.
 */
export function FlowDiagram({ etapa, className }: FlowDiagramProps) {
  const ativo = (id: IdComponente) => etapa.ativos.includes(id);

  return (
    <figure className={className}>
      <figcaption className="sr-only">
        Fluxo de sinais na etapa “{etapa.titulo}”: sensor de luminosidade e sensor de presença
        enviam leituras ao microcontrolador, que comanda o driver dimerizável, que alimenta a
        luminária LED com {Math.round(etapa.intensidade * 100)}% da potência.
      </figcaption>
      <ol className="grid grid-cols-2 gap-x-2 sm:gap-x-3" role="list">
        <li>
          <No id="luminosidade" etapa={etapa} ativo={ativo('luminosidade')} />
        </li>
        <li>
          <No id="presenca" etapa={etapa} ativo={ativo('presenca')} />
        </li>
        <li className="col-span-2">
          <ConectorJuncao esquerda={ativo('luminosidade')} direita={ativo('presenca')} />
          <No id="microcontrolador" etapa={etapa} ativo={ativo('microcontrolador')} />
        </li>
        <li className="col-span-2">
          <Conector ativo={ativo('driver')} />
          <No id="driver" etapa={etapa} ativo={ativo('driver')} />
        </li>
        <li className="col-span-2">
          <Conector ativo={ativo('luminaria')} />
          <No id="luminaria" etapa={etapa} ativo={ativo('luminaria')} brilho={etapa.intensidade} />
        </li>
      </ol>
    </figure>
  );
}

interface NoProps {
  id: IdComponente;
  etapa: Etapa;
  ativo: boolean;
  /** Intensidade do brilho (só para a luminária). */
  brilho?: number;
}

function No({ id, etapa, ativo, brilho }: NoProps) {
  const componente = HARDWARE[id];

  return (
    <div
      className={cn(
        'flex items-center gap-2.5 rounded-xl border p-2 transition-[border-color,background-color,box-shadow,opacity] duration-500 sm:gap-3 sm:p-3',
        ativo
          ? 'border-amarelo-luz/70 bg-amarelo-luz/10'
          : 'border-linha-noite bg-white/[0.02] opacity-70',
      )}
      style={
        brilho !== undefined && brilho > 0
          ? { boxShadow: `0 0 ${12 + brilho * 36}px rgb(255 200 61 / ${0.15 + brilho * 0.4})` }
          : undefined
      }
    >
      <span
        className={cn(
          'grid size-8 shrink-0 place-items-center rounded-lg transition-colors duration-500 sm:size-10',
          ativo ? 'bg-amarelo-luz text-azul-noite' : 'bg-white/5 text-nevoa',
        )}
      >
        <Icone nome={ICONE_COMPONENTE[id]} className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs leading-tight font-semibold text-white sm:text-sm">
          {componente.nome}
        </span>
        <span className="hidden truncate text-xs text-nevoa sm:block">{componente.modelo}</span>
        <span
          className={cn(
            'mt-0.5 block text-[0.6875rem] leading-tight font-medium sm:text-xs',
            ativo ? 'text-amarelo-luz' : 'text-nevoa',
          )}
        >
          {leitura(id, etapa)}
        </span>
      </span>
    </div>
  );
}

const ALTURA_CONECTOR = 22;

function Conector({ ativo }: { ativo: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="mx-auto block"
      width="4"
      height={ALTURA_CONECTOR}
      viewBox={`0 0 4 ${ALTURA_CONECTOR}`}
    >
      <line
        x1="2"
        y1="0"
        x2="2"
        y2={ALTURA_CONECTOR}
        strokeWidth="2.5"
        strokeDasharray="6 6"
        className={cn(ativo ? 'animate-fluxo stroke-amarelo-luz' : 'stroke-linha-noite')}
      />
    </svg>
  );
}

function ConectorJuncao({ esquerda, direita }: { esquerda: boolean; direita: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="block w-full"
      height={ALTURA_CONECTOR}
      viewBox={`0 0 100 ${ALTURA_CONECTOR}`}
      preserveAspectRatio="none"
    >
      {[
        { x: 25, ativo: esquerda },
        { x: 75, ativo: direita },
      ].map(({ x, ativo }) => (
        <line
          key={x}
          x1={x}
          y1="0"
          x2="50"
          y2={ALTURA_CONECTOR}
          strokeWidth="2.5"
          strokeDasharray="6 6"
          vectorEffect="non-scaling-stroke"
          className={cn(ativo ? 'animate-fluxo stroke-amarelo-luz' : 'stroke-linha-noite')}
        />
      ))}
    </svg>
  );
}
