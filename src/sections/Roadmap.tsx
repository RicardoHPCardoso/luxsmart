import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SECOES } from '@/data/navegacao';
import {
  ROADMAP,
  ROTULO_STATUS_ROADMAP,
  type EtapaRoadmap,
  type StatusEtapaRoadmap,
} from '@/data/roadmap';
import { cn } from '@/lib/cn';

const ESTILO_STATUS: Record<StatusEtapaRoadmap, string> = {
  concluido: 'border-azul-brilho/50 text-azul-brilho',
  'em-andamento': 'border-amarelo-luz bg-amarelo-luz text-azul-noite',
  planejado: 'border-linha-noite text-nevoa',
};

/**
 * Linha do tempo cuja linha "acende" conforme o usuário rola, iluminando
 * cada etapa ao passar por ela.
 */
export function Roadmap() {
  const lista = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: lista, offset: ['start 75%', 'end 55%'] });
  const progresso = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <Section id={SECOES.roadmap} tema="noite" transicao="do-dia">
      <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <SectionHeading
          tema="noite"
          sobretitulo="Roadmap"
          titulo="Do protótipo à rua"
          descricao={
            <p>
              O projeto avança em etapas, cada uma validando a anterior. A meta é chegar a um piloto
              real em uma rua de Indaiatuba.
            </p>
          }
          className="lg:sticky lg:top-28 lg:self-start"
        />

        <ol ref={lista} role="list" className="relative grid gap-8 pl-10 sm:pl-14">
          {/* Trilho e luz de progresso */}
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[0.9375rem] w-0.5 rounded-full bg-linha-noite sm:left-[1.4375rem]"
          />
          <motion.span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[0.9375rem] w-0.5 origin-top rounded-full bg-amarelo-luz shadow-glow-sm sm:left-[1.4375rem]"
            style={{ scaleY: progresso }}
          />

          {ROADMAP.map((etapa, i) => (
            <ItemRoadmap
              key={etapa.titulo}
              etapa={etapa}
              progresso={progresso}
              limiar={ROADMAP.length === 1 ? 0 : i / (ROADMAP.length - 1)}
            />
          ))}
        </ol>
      </div>
    </Section>
  );
}

interface ItemRoadmapProps {
  etapa: EtapaRoadmap;
  progresso: MotionValue<number>;
  /** Fração do progresso em que a linha alcança esta etapa. */
  limiar: number;
}

function ItemRoadmap({ etapa, progresso, limiar }: ItemRoadmapProps) {
  const brilho = useTransform(progresso, [Math.max(0, limiar - 0.08), limiar], [0, 1]);
  const opacidade = useTransform(brilho, [0, 1], [0.75, 1]);

  return (
    <li className="relative">
      <span
        aria-hidden="true"
        className="absolute top-1 -left-10 grid size-8 place-items-center rounded-full border-2 border-linha-noite bg-azul-noite sm:-left-14 sm:size-12"
      >
        <motion.span
          className="size-3 rounded-full bg-amarelo-luz shadow-glow sm:size-4"
          style={{ opacity: brilho, scale: brilho }}
        />
      </span>

      <motion.article
        style={{ opacity: opacidade }}
        className="rounded-2xl border border-linha-noite bg-white/[0.03] p-6"
      >
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-xl font-bold">{etapa.titulo}</h3>
          <span
            className={cn(
              'rounded-full border px-2.5 py-0.5 text-xs font-semibold',
              ESTILO_STATUS[etapa.status],
            )}
          >
            {ROTULO_STATUS_ROADMAP[etapa.status]}
          </span>
        </div>
        <p className="mt-1 text-sm font-medium text-azul-brilho">{etapa.periodo}</p>
        <p className="mt-3 text-nevoa">{etapa.descricao}</p>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label={`Entregas da etapa ${etapa.titulo}`}>
          {etapa.entregas.map((entrega) => (
            <li key={entrega} className="rounded-lg bg-white/5 px-3 py-1 text-sm text-white">
              {entrega}
            </li>
          ))}
        </ul>
      </motion.article>
    </li>
  );
}
