import type { CSSProperties } from 'react';
import { Icone } from '@/components/icons/icons';
import { Toggletip } from '@/components/ui/Toggletip';
import type { Etapa } from '@/data/etapas';
import { HARDWARE, ROTULO_STATUS_COMPONENTE, type IdComponente } from '@/data/hardware';
import { cn } from '@/lib/cn';

const DECISAO: Record<Etapa['id'], string> = {
  dia: 'decisão: desligar',
  noite: 'decisão: economizar',
  movimento: 'decisão: luz total',
};

/** Leitura/saída de cada componente na etapa, mostrada dentro do nó. */
function leitura(id: IdComponente, etapa: Etapa): string {
  const percentual = `${Math.round(etapa.intensidade * 100)}%`;
  switch (id) {
    case 'ldr':
      return `luz: ${etapa.leituras.ldr}`;
    case 'presenca':
      return `presença: ${etapa.leituras.presenca}`;
    case 'esp32':
      return DECISAO[etapa.id];
    case 'pwm':
      return `saída: ${percentual}`;
    case 'leds':
      return etapa.intensidade === 0 ? 'apagados' : `brilho: ${percentual}`;
    case 'wifi':
      return 'fora do fluxo atual';
  }
}

interface FlowDiagramProps {
  etapa: Etapa;
  className?: string;
}

/**
 * Diagrama do fluxo de sinais do protótipo: LDR + PIR/HC-SR04 → ESP32 → PWM →
 * LEDs (postes). Componentes ativos acendem; os responsáveis pela decisão da
 * etapa ganham destaque. O Wi-Fi fica fora do fluxo, ligado por linha tracejada,
 * porque é uma evolução prevista — não uma função implementada.
 * Cada componente abre um cartão com a sua função (mouse, toque ou teclado).
 */
export function FlowDiagram({ etapa, className }: FlowDiagramProps) {
  const ativo = (id: IdComponente) => etapa.ativos.includes(id);
  const responsavel = (id: IdComponente) => etapa.cadeia.some((p) => p.componente === id);
  const propsNo = (id: IdComponente) => ({
    id,
    etapa,
    ativo: ativo(id),
    responsavel: responsavel(id),
  });

  return (
    <figure className={className}>
      <figcaption className="sr-only">
        Fluxo de sinais na etapa “{etapa.titulo}”: o LDR e o sensor de presença (PIR e/ou HC-SR04)
        enviam leituras ao ESP32, que ajusta o PWM e deixa os LEDs, que representam os postes da
        maquete, com {Math.round(etapa.intensidade * 100)}% de brilho. O Wi-Fi está previsto como
        evolução futura e não faz parte do fluxo atual.
      </figcaption>

      <ol className="grid grid-cols-2 gap-x-2 sm:gap-x-3" role="list">
        <li>
          <No {...propsNo('ldr')} />
        </li>
        <li>
          <No {...propsNo('presenca')} />
        </li>
        <li className="col-span-2">
          <ConectorJuncao esquerda={ativo('ldr')} direita={ativo('presenca')} />
          {/* Em telas ≥ 640 px o Wi-Fi aparece ao lado do ESP32, sem tirá-lo do centro. */}
          <div className="sm:grid sm:grid-cols-[1fr_minmax(0,1.5fr)_1fr] sm:items-center">
            <span aria-hidden="true" className="hidden sm:block" />
            <No {...propsNo('esp32')} />
            <div className="hidden items-center sm:flex">
              <LigacaoPrevista />
              <NoPrevisto id="wifi" etapa={etapa} />
            </div>
          </div>
        </li>
        <li className="col-span-2">
          <Conector ativo={ativo('pwm')} />
          <No {...propsNo('pwm')} />
        </li>
        <li className="col-span-2">
          <Conector ativo={ativo('leds')} />
          <No {...propsNo('leds')} brilho={etapa.intensidade} />
        </li>
      </ol>

      {/* Em telas estreitas, o Wi-Fi vem depois do fluxo, ainda marcado como previsto. */}
      <div className="mt-3 border-t border-dashed border-linha-noite pt-3 sm:hidden">
        <NoPrevisto id="wifi" etapa={etapa} />
      </div>
    </figure>
  );
}

interface NoProps {
  id: IdComponente;
  etapa: Etapa;
  ativo: boolean;
  /** Componente que decide a etapa (aparece na cadeia "LDR detecta luz → …"). */
  responsavel: boolean;
  /** Intensidade do brilho (só para os LEDs). */
  brilho?: number;
}

function No({ id, etapa, ativo, responsavel, brilho }: NoProps) {
  const componente = HARDWARE[id];
  const estilo: CSSProperties | undefined =
    brilho !== undefined && brilho > 0
      ? { boxShadow: `0 0 ${12 + brilho * 36}px rgb(255 200 61 / ${0.15 + brilho * 0.4})` }
      : undefined;

  return (
    <Toggletip
      conteudo={<CartaoComponente id={id} />}
      style={estilo}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-xl border p-2 transition-[border-color,background-color,box-shadow,opacity] duration-500 hover:border-amarelo-luz sm:gap-3 sm:p-3',
        ativo
          ? 'border-amarelo-luz/70 bg-amarelo-luz/10'
          : 'border-linha-noite bg-white/[0.02] opacity-70',
        responsavel && 'ring-2 ring-amarelo-luz ring-offset-2 ring-offset-azul-noite',
      )}
    >
      <span
        className={cn(
          'grid size-8 shrink-0 place-items-center rounded-lg transition-colors duration-500 sm:size-10',
          ativo ? 'bg-amarelo-luz text-azul-noite' : 'bg-white/5 text-nevoa',
        )}
      >
        <Icone nome={componente.icone} className="size-5 sm:size-6" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs leading-tight font-semibold text-white sm:text-sm">
          {componente.sigla}
        </span>
        <span
          className={cn(
            'mt-0.5 block text-[0.6875rem] leading-tight font-medium sm:text-xs',
            ativo ? 'text-amarelo-luz' : 'text-nevoa',
          )}
        >
          {leitura(id, etapa)}
        </span>
      </span>
    </Toggletip>
  );
}

/** Componente previsto (Wi-Fi): borda tracejada e selo de evolução futura. */
function NoPrevisto({ id, etapa }: { id: IdComponente; etapa: Etapa }) {
  const componente = HARDWARE[id];

  return (
    <Toggletip
      conteudo={<CartaoComponente id={id} />}
      className="flex w-full flex-col items-start gap-1.5 rounded-xl border-2 border-dashed border-azul-brilho/50 bg-transparent p-2 hover:border-azul-brilho sm:p-2.5"
    >
      <span className="flex items-center gap-2">
        <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-white/5 text-azul-brilho">
          <Icone nome={componente.icone} className="size-5" />
        </span>
        <span className="text-xs leading-tight font-semibold text-white sm:text-sm">
          {componente.sigla}
        </span>
      </span>
      <SeloPrevisto />
      <span className="sr-only">: {leitura(id, etapa)}</span>
    </Toggletip>
  );
}

/** Selo do Wi-Fi. Cantos pouco arredondados para quebrar bem em duas linhas na coluna estreita. */
function SeloPrevisto() {
  return (
    <span className="rounded-md border border-azul-brilho/60 px-1.5 py-0.5 text-[0.6875rem] leading-snug font-semibold text-balance text-azul-brilho">
      {ROTULO_STATUS_COMPONENTE.previsto}
    </span>
  );
}

/** Conteúdo do cartão: nome completo, função e situação do componente. */
function CartaoComponente({ id }: { id: IdComponente }) {
  const componente = HARDWARE[id];
  const previsto = componente.status === 'previsto';

  return (
    <>
      <span className="flex items-center gap-2 font-semibold text-white">
        <Icone nome={componente.icone} className="size-5 shrink-0 text-amarelo-luz" />
        {componente.nome}
      </span>
      <span className="mt-2 block text-nevoa">
        <span className="font-semibold text-white">Função: </span>
        {componente.funcao}
      </span>
      <span
        className={cn(
          'mt-3 inline-block rounded-full border px-2 py-0.5 text-[0.6875rem] font-semibold tracking-wide uppercase',
          previsto
            ? 'border-azul-brilho/60 text-azul-brilho'
            : 'border-amarelo-luz/60 text-amarelo-luz',
        )}
      >
        {ROTULO_STATUS_COMPONENTE[componente.status]}
      </span>
    </>
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
        className={cn(
          ativo
            ? 'animate-fluxo stroke-amarelo-luz motion-reduce:animate-none'
            : 'stroke-linha-noite',
        )}
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
          className={cn(
            ativo
              ? 'animate-fluxo stroke-amarelo-luz motion-reduce:animate-none'
              : 'stroke-linha-noite',
          )}
        />
      ))}
    </svg>
  );
}

/** Linha tracejada e estática até o Wi-Fi: ligação prevista, sem sinal fluindo. */
function LigacaoPrevista() {
  return (
    <svg aria-hidden="true" className="mx-1 block w-6 shrink-0" height="4" viewBox="0 0 24 4">
      <line
        x1="0"
        y1="2"
        x2="24"
        y2="2"
        strokeWidth="2"
        strokeDasharray="4 4"
        className="stroke-azul-brilho/60"
      />
    </svg>
  );
}
