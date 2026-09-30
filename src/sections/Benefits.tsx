import { motion } from 'framer-motion';
import { Icone } from '@/components/icons/icons';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BENEFICIOS, type Beneficio } from '@/data/beneficios';
import { SECOES } from '@/data/navegacao';

/**
 * Faixa central da tela em que um card é considerado "presente". Como o
 * poste, o ícone acende quando o card chega e volta a apagar quando sai.
 */
const FAIXA_PRESENCA = '-30% 0px -30% 0px';

export function Benefits() {
  return (
    <Section id={SECOES.beneficios} tema="branco" transicao="da-noite">
      <div className="container-site">
        <SectionHeading
          sobretitulo="Benefícios"
          titulo="Mais do que uma conta de luz menor"
          descricao={
            <p>
              A mesma ideia — luz só quando alguém precisa — traz ganhos para a cidade, para quem
              mora nela e para o meio ambiente.
            </p>
          }
        />

        <ul role="list" className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFICIOS.map((beneficio, i) => (
            <Reveal as="li" key={beneficio.titulo} atraso={(i % 3) * 0.08} className="h-full">
              <CardBeneficio beneficio={beneficio} />
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function CardBeneficio({ beneficio }: { beneficio: Beneficio }) {
  return (
    <motion.article
      className="group relative isolate h-full overflow-hidden rounded-2xl border border-linha bg-off-white p-7 transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-1 hover:border-amarelo-luz hover:shadow-glow"
      initial="apagado"
      whileInView="aceso"
      viewport={{ margin: FAIXA_PRESENCA }}
    >
      {/* Brilho de fundo que acompanha a "presença" do card */}
      <motion.span
        aria-hidden="true"
        className="absolute -top-16 -right-16 -z-10 size-48 rounded-full bg-[radial-gradient(circle,rgb(255_200_61/0.35),transparent_70%)]"
        variants={{ apagado: { opacity: 0 }, aceso: { opacity: 1 } }}
        transition={{ duration: 0.6 }}
      />
      <motion.span
        className="grid size-12 place-items-center rounded-xl text-azul-noite"
        variants={{
          apagado: { backgroundColor: '#DCE8FF', boxShadow: '0 0 0 rgb(255 200 61 / 0)' },
          aceso: { backgroundColor: '#FFC83D', boxShadow: '0 0 18px rgb(255 200 61 / 0.55)' },
        }}
        transition={{ duration: 0.5 }}
      >
        <Icone nome={beneficio.icone} />
      </motion.span>
      <h3 className="mt-5 text-xl font-bold">{beneficio.titulo}</h3>
      <p className="mt-2 text-tinta-suave">{beneficio.descricao}</p>
    </motion.article>
  );
}
