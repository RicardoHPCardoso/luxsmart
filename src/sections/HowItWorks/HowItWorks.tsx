import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'framer-motion';
import { useLenis } from 'lenis/react';
import { useRef, useState } from 'react';
import { Icone } from '@/components/icons/icons';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ETAPAS, type Etapa } from '@/data/etapas';
import { PROTOTIPO } from '@/data/hardware';
import { SECOES } from '@/data/navegacao';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';
import { DecisionChain } from './DecisionChain';
import { FlowDiagram } from './FlowDiagram';
import { LampPanel } from './LampPanel';

/**
 * A versão fixa (sticky) precisa de altura para caber poste + diagrama.
 * Em telas pequenas usamos a versão empilhada, mais legível.
 */
const MIDIA_MODO_FIXO = '(min-width: 48rem) and (min-height: 43rem)';

export function HowItWorks() {
  const reduzirMovimento = useReducedMotion();
  const telaComporta = useMediaQuery(MIDIA_MODO_FIXO);
  const modoFixo = telaComporta && !reduzirMovimento;

  return (
    <Section id={SECOES.comoFunciona} tema="noite" className="pb-0 sm:pb-0">
      <div className="container-site">
        <SectionHeading
          tema="noite"
          sobretitulo="Como funciona"
          titulo="Três estados, uma decisão a cada instante"
          descricao={
            <p>
              O LDR indica se é dia ou noite e o sensor de presença (PIR e/ou HC-SR04) percebe quem
              se aproxima. O ESP32 decide o modo e ajusta o brilho dos LEDs por PWM.{' '}
              {modoFixo && 'Role a página para ver o poste mudar de estado.'}
            </p>
          }
        />
        <AvisoMaquete />
      </div>
      {modoFixo ? <EtapasComRolagem /> : <EtapasEstaticas />}
    </Section>
  );
}

/** Deixa claro que a demonstração física é uma maquete em escala. */
function AvisoMaquete() {
  return (
    <Reveal className="mt-8 flex max-w-3xl items-start gap-4 rounded-2xl border border-azul-brilho/30 bg-white/[0.04] p-5">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-amarelo-luz text-azul-noite">
        <Icone nome="maquete" />
      </span>
      <div>
        <p className="font-semibold text-white">{PROTOTIPO.titulo}</p>
        <p className="mt-1 text-sm text-nevoa">{PROTOTIPO.descricao}</p>
        <p className="mt-2 text-sm text-azul-brilho">
          Passe o mouse ou toque em cada componente do diagrama para ver a função.
        </p>
      </div>
    </Reveal>
  );
}

/** Versão scroll-driven: a seção fica fixa enquanto o poste passa pelos 3 estados. */
function EtapasComRolagem() {
  const trilho = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [indice, setIndice] = useState(0);
  const { scrollYProgress } = useScroll({ target: trilho, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (progresso) => {
    setIndice(Math.min(ETAPAS.length - 1, Math.floor(progresso * ETAPAS.length)));
  });

  const etapa = ETAPAS[indice] ?? ETAPAS[0]!;

  /** Rola até o meio do trecho correspondente à etapa escolhida. */
  const irParaEtapa = (i: number) => {
    const el = trilho.current;
    if (!el) return;
    const topo = el.getBoundingClientRect().top + window.scrollY;
    const percurso = el.offsetHeight - window.innerHeight;
    const destino = topo + percurso * ((i + 0.5) / ETAPAS.length);
    if (lenis) lenis.scrollTo(destino);
    else window.scrollTo({ top: destino, behavior: 'smooth' });
  };

  return (
    <div ref={trilho} className="relative mt-8" style={{ height: `${ETAPAS.length * 100}dvh` }}>
      <div className="sticky top-16 flex h-[calc(100dvh-4rem)] items-center py-4">
        <div className="container-site grid w-full items-center gap-4 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          <LampPanel etapa={etapa} className="h-[26dvh] min-h-44 lg:h-[min(70dvh,560px)]" />

          <div className="flex flex-col gap-4 lg:gap-6">
            <SeletorEtapas indiceAtivo={indice} aoSelecionar={irParaEtapa} />
            <DescricaoEtapa etapa={etapa} />
            <FlowDiagram etapa={etapa} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface SeletorEtapasProps {
  indiceAtivo: number;
  aoSelecionar: (indice: number) => void;
}

function SeletorEtapas({ indiceAtivo, aoSelecionar }: SeletorEtapasProps) {
  return (
    <ol className="grid grid-cols-3 gap-2" role="list" aria-label="Estados do poste">
      {ETAPAS.map((etapa, i) => {
        const ativa = i === indiceAtivo;
        return (
          <li key={etapa.id}>
            <button
              type="button"
              onClick={() => aoSelecionar(i)}
              aria-current={ativa ? 'step' : undefined}
              className={cn(
                'flex min-h-11 w-full flex-col items-start rounded-xl border px-3 py-2 text-left transition-colors duration-300',
                ativa
                  ? 'border-amarelo-luz bg-amarelo-luz text-azul-noite'
                  : 'border-linha-noite text-nevoa hover:border-azul-brilho hover:text-white',
              )}
            >
              <span className="text-xs font-semibold">{i + 1}</span>
              <span className="text-xs leading-tight font-semibold sm:text-sm">{etapa.titulo}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function DescricaoEtapa({ etapa }: { etapa: Etapa }) {
  return (
    <div aria-live="polite" className="min-h-[7.5rem] sm:min-h-32">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={etapa.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <h3 className="text-lg font-bold text-white sm:text-2xl">
            {etapa.titulo} <span className="text-amarelo-luz">· {etapa.resumo}</span>
          </h3>
          <p className="mt-1 text-sm text-nevoa sm:text-base">{etapa.descricao}</p>
          <div className="mt-2">
            <DecisionChain etapa={etapa} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** Versão empilhada (telas pequenas ou movimento reduzido): as três etapas em sequência. */
function EtapasEstaticas() {
  return (
    <div className="container-site py-14 sm:py-20">
      <ol className="grid gap-14" role="list">
        {ETAPAS.map((etapa, i) => (
          <Reveal
            as="li"
            key={etapa.id}
            className="grid items-center gap-6 md:grid-cols-[0.9fr_1.1fr] md:gap-10"
          >
            <LampPanel etapa={etapa} className="h-64 md:h-80" />
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-bold sm:text-2xl">
                {i + 1}. {etapa.titulo} <span className="text-amarelo-luz">· {etapa.resumo}</span>
              </h3>
              <p className="text-nevoa">{etapa.descricao}</p>
              <DecisionChain etapa={etapa} />
              <FlowDiagram etapa={etapa} />
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
