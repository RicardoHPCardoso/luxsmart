import { EmptyStreet } from '@/components/illustrations/EmptyStreet';
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
  formatarHoras,
  formatarMoedaCompacta,
  formatarPercentual,
} from '@/lib/format';
import { comparacaoPorFiltro } from '@/lib/indaiatubaScenarios';

const cidade = comparacaoPorFiltro(INDAIATUBA, 'cidade');
const noiteVaziaResidencial = 1 - INDAIATUBA.vias.residencial.movimento.valor;

export function Problem() {
  return (
    <Section id={SECOES.problema} tema="noite" className="bg-azul-profundo">
      <div className="container-site">
        <SectionHeading
          tema="noite"
          sobretitulo="O problema"
          titulo={
            <>
              Luz a 100% em ruas <span className="text-amarelo-luz">vazias</span>
            </>
          }
          descricao={
            <p>
              A iluminação pública funciona no modo “tudo ou nada”: acende ao anoitecer e fica na
              potência máxima até o amanhecer — inclusive às 3h da manhã, numa rua residencial onde
              ninguém está passando.
            </p>
          }
        />

        <ul role="list" className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal as="li" atraso={0}>
            <StatCard
              status={INDAIATUBA.pontosLed.status}
              valor={
                <AnimatedNumber
                  valor={INDAIATUBA.pontosLed.valor}
                  formatar={(n) => formatarCompacto(Math.round(n / 1000) * 1000)}
                />
              }
              rotulo="pontos de iluminação em LED em Indaiatuba"
              nota={
                <>
                  ≈ {formatarPercentual(INDAIATUBA.percentualLed.valor)} de uma rede estimada em{' '}
                  {formatarCompacto(INDAIATUBA.totalPontos.valor)} pontos{' '}
                  <EstimateBadge status={INDAIATUBA.totalPontos.status} tema="noite" />
                </>
              }
            />
          </Reveal>
          <Reveal as="li" atraso={0.1}>
            <StatCard
              status={INDAIATUBA.horasPorNoite.status}
              valor={
                <AnimatedNumber valor={INDAIATUBA.horasPorNoite.valor} formatar={formatarHoras} />
              }
              rotulo="acesos por noite, todos os dias do ano"
              nota="Referência usada no faturamento da iluminação pública."
            />
          </Reveal>
          <Reveal as="li" atraso={0.2}>
            <StatCard
              status="estimativa"
              valor={
                <AnimatedNumber
                  valor={cidade.cenarios.atual.consumoKwh}
                  formatar={formatarEnergia}
                />
              }
              rotulo="por ano com os LEDs sempre a 100%"
              nota={`≈ ${formatarMoedaCompacta(cidade.cenarios.atual.custoReais)} por ano na tarifa de referência.`}
            />
          </Reveal>
          <Reveal as="li" atraso={0.3}>
            <StatCard
              status={INDAIATUBA.vias.residencial.movimento.status}
              valor={
                <AnimatedNumber
                  valor={noiteVaziaResidencial}
                  formatar={(n) => formatarPercentual(n)}
                />
              }
              rotulo="da noite sem ninguém passando numa rua residencial"
              nota="Nesse tempo, a luz a 100% não serve a ninguém."
            />
          </Reveal>
        </ul>

        <Reveal className="mt-14">
          <figure className="relative">
            <EmptyStreet className="h-auto w-full" />
            <figcaption className="mt-5 sm:absolute sm:inset-x-0 sm:bottom-0 sm:mt-0 sm:rounded-b-3xl sm:bg-[linear-gradient(to_top,rgb(5_13_28/0.95),transparent)] sm:p-8 sm:pt-16">
              <p className="font-display text-2xl font-bold text-white lg:text-4xl">
                “Energia paga para iluminar{' '}
                <span className="text-amarelo-luz glow-texto">ninguém</span>.”
              </p>
              <p className="mt-2 max-w-xl text-sm text-nevoa sm:text-base">
                Ilustração: rua residencial de madrugada, sem carros nem pedestres, com todos os
                postes acesos na potência máxima.
              </p>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </Section>
  );
}
