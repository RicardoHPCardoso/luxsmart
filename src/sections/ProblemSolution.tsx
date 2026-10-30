import { Icone } from '@/components/icons/icons';
import { Section } from '@/components/layout/Section';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { StatCard } from '@/components/ui/StatCard';
import { BENEFICIOS } from '@/data/beneficios';
import { INDAIATUBA } from '@/data/indaiatuba';
import { SECOES } from '@/data/navegacao';
import { formatarCompacto, formatarPercentual } from '@/lib/format';
import { comparacaoPorFiltro } from '@/lib/indaiatubaScenarios';

const economiaCidade = comparacaoPorFiltro(INDAIATUBA, 'cidade').economiaPercentual;
const nivelBaixo = formatarPercentual(INDAIATUBA.dimerizacao.valor);

/** Arredonda para o milhar na contagem: "28 mil". */
const formatarMilhar = (n: number) => formatarCompacto(Math.round(n / 1000) * 1000);

/** O problema (postes a 100% em ruas vazias), 3 números e a solução em uma frase. */
export function ProblemSolution() {
  return (
    <Section id={SECOES.problema} tema="dia">
      <div className="container-site">
        <SectionHeading
          sobretitulo="O problema e a solução"
          titulo="Luz acesa para ninguém"
          descricao="Hoje os postes ficam a 100% a noite toda, mesmo quando a rua está vazia."
        />

        <ul role="list" className="mt-10 grid gap-4 sm:grid-cols-3">
          <Reveal as="li">
            <StatCard
              status={INDAIATUBA.pontosLed.status}
              valor={
                <AnimatedNumber valor={INDAIATUBA.pontosLed.valor} formatar={formatarMilhar} />
              }
              rotulo="pontos de luz em LED em Indaiatuba"
            />
          </Reveal>
          <Reveal as="li" atraso={0.08}>
            <StatCard
              status={INDAIATUBA.percentualLed.status}
              valor={
                <AnimatedNumber
                  valor={INDAIATUBA.percentualLed.valor}
                  formatar={formatarPercentual}
                />
              }
              rotulo="da iluminação da cidade já é LED"
            />
          </Reveal>
          <Reveal as="li" atraso={0.16}>
            <StatCard
              status="estimativa"
              valor={<AnimatedNumber valor={economiaCidade} formatar={formatarPercentual} />}
              rotulo="a menos de energia com o LuxSmart"
            />
          </Reveal>
        </ul>

        <Reveal className="mt-6 flex items-start gap-4 rounded-2xl border border-amarelo-luz bg-amarelo-suave p-5 shadow-glow-sm">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-amarelo-luz text-azul-noite">
            <Icone nome="led" />
          </span>
          <p className="text-lg">
            <strong>A solução:</strong> com sensores, o poste fica em {nivelBaixo} na rua vazia e
            acende a 100% quando alguém passa.
          </p>
        </Reveal>

        <ul role="list" aria-label="Benefícios" className="mt-6 flex flex-wrap gap-2">
          {BENEFICIOS.map((b) => (
            <li
              key={b.titulo}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-linha bg-white px-3.5 text-tinta"
            >
              <Icone nome={b.icone} className="size-5 shrink-0 text-azul-primario" />
              {b.titulo}
              {b.previsto && <span className="text-tinta-suave">(previsto)</span>}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
