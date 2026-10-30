import { Icone } from '@/components/icons/icons';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ETAPAS, type Etapa } from '@/data/etapas';
import { SECOES } from '@/data/navegacao';
import { cn } from '@/lib/cn';
import { ComponentFlow } from './ComponentFlow';

/** Os 3 modos do poste em cards e, abaixo, a linha de componentes do protótipo. */
export function HowItWorks() {
  return (
    <Section id={SECOES.comoFunciona} tema="noite">
      <div className="container-site">
        <SectionHeading
          tema="noite"
          sobretitulo="Como funciona"
          titulo="Três modos automáticos"
          descricao="Sensores avisam o ESP32 se é dia e se tem alguém por perto."
        />

        <ol role="list" className="mt-10 grid gap-4 md:grid-cols-3">
          {ETAPAS.map((etapa, i) => (
            <Reveal as="li" key={etapa.id} atraso={i * 0.08}>
              <CardModo etapa={etapa} />
            </Reveal>
          ))}
        </ol>

        <ComponentFlow />
      </div>
    </Section>
  );
}

/** Card de um modo: o ícone "acende" conforme a intensidade da luz naquele modo. */
function CardModo({ etapa }: { etapa: Etapa }) {
  const aceso = etapa.intensidade > 0;
  const brilho = aceso
    ? {
        boxShadow: `0 0 ${10 + etapa.intensidade * 30}px rgb(255 200 61 / ${0.25 + etapa.intensidade * 0.5})`,
      }
    : undefined;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-linha-noite bg-white/[0.04] p-5">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'grid size-12 shrink-0 place-items-center rounded-full',
            aceso ? 'bg-amarelo-luz text-azul-noite' : 'bg-white/10 text-nevoa',
          )}
          style={brilho}
        >
          <Icone nome={etapa.icone} />
        </span>
        <div>
          <h3 className="text-xl font-bold">{etapa.titulo}</h3>
          <p className="font-semibold text-amarelo-luz">{etapa.resumo}</p>
        </div>
      </div>
      <p className="mt-3 text-nevoa">{etapa.descricao}</p>
    </article>
  );
}
