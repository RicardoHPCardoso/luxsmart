import { motion } from 'framer-motion';
import { Icone } from '@/components/icons/icons';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EQUIPE, type AreaEquipe, type Integrante } from '@/data/equipe';
import { SECOES } from '@/data/navegacao';
import { SITE } from '@/data/site';
import { cn } from '@/lib/cn';
import { iniciais } from '@/lib/initials';

/** Faixa central da tela em que o card "acende" (mesma ideia dos benefícios). */
const FAIXA_PRESENCA = '-30% 0px -30% 0px';

type CorAvatar = 'azul' | 'amarelo';

export function Team() {
  return (
    <Section id={SECOES.equipe} tema="dia" transicao="da-noite">
      <div className="container-site">
        <SectionHeading
          sobretitulo="Equipe"
          titulo="Quem está acendendo essa ideia"
          descricao={
            <p>
              Projeto desenvolvido por estudantes de {SITE.curso} ({SITE.instituicao}), organizados
              por área de atuação.
            </p>
          }
        />

        {/* Desktop: grade de 6 colunas com cards de 2; se a última linha tiver só 2 cards, ela fica centralizada. */}
        <ul role="list" className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-6">
          {EQUIPE.map((area, i) => (
            <Reveal
              as="li"
              key={area.id}
              atraso={(i % 3) * 0.08}
              className={cn(
                'h-full lg:col-span-2',
                // Tablet (2 colunas): um card sobrando na última linha fica centralizado.
                EQUIPE.length % 2 === 1 &&
                  i === EQUIPE.length - 1 &&
                  'md:col-span-2 md:mx-auto md:w-[calc(50%-0.625rem)] lg:mx-0 lg:w-auto',
                EQUIPE.length % 3 === 2 && i === EQUIPE.length - 2 && 'lg:col-start-2',
              )}
            >
              <CardArea area={area} indiceArea={i} />
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function CardArea({ area, indiceArea }: { area: AreaEquipe; indiceArea: number }) {
  return (
    <motion.article
      className="group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-linha bg-white p-6 shadow-cartao transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-1 hover:border-amarelo-luz hover:shadow-glow"
      initial="apagado"
      whileInView="aceso"
      viewport={{ margin: FAIXA_PRESENCA }}
    >
      <motion.span
        aria-hidden="true"
        className="absolute -top-16 -right-16 -z-10 size-48 rounded-full bg-[radial-gradient(circle,rgb(255_200_61/0.3),transparent_70%)]"
        variants={{ apagado: { opacity: 0 }, aceso: { opacity: 1 } }}
        transition={{ duration: 0.6 }}
      />

      <div className="flex items-start gap-4">
        <motion.span
          className="grid size-12 shrink-0 place-items-center rounded-xl text-azul-noite"
          variants={{
            apagado: { backgroundColor: '#DCE8FF', boxShadow: '0 0 0 rgb(255 200 61 / 0)' },
            aceso: { backgroundColor: '#FFC83D', boxShadow: '0 0 18px rgb(255 200 61 / 0.55)' },
          }}
          transition={{ duration: 0.5 }}
        >
          <Icone nome={area.icone} />
        </motion.span>
        <div>
          <h3 className="text-xl font-bold">{area.titulo}</h3>
          <p className="mt-1 text-sm text-tinta-suave">{area.descricao}</p>
        </div>
      </div>

      <ul role="list" className="mt-6 grid gap-4 border-t border-linha pt-5">
        {area.integrantes.map((pessoa, j) => (
          <li key={pessoa.nome} className="flex items-center gap-4">
            <Avatar pessoa={pessoa} cor={(indiceArea + j) % 2 === 0 ? 'azul' : 'amarelo'} />
            <div className="min-w-0">
              <p className="font-semibold">{pessoa.nome}</p>
              <LinksPerfil pessoa={pessoa} />
            </div>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

/** Avatar com foto (se houver) ou iniciais do nome completo, nas cores do projeto. */
function Avatar({ pessoa, cor }: { pessoa: Integrante; cor: CorAvatar }) {
  const texto = iniciais(pessoa.nome);

  return (
    <span className="relative shrink-0">
      <span
        aria-hidden="true"
        className="absolute -inset-1 rounded-full bg-[conic-gradient(from_180deg,#1E5EFF,#FFC83D,#1E5EFF)] opacity-70 transition-opacity duration-300 group-hover:opacity-100"
      />
      {pessoa.foto ? (
        <img
          src={`${import.meta.env.BASE_URL}${pessoa.foto}`}
          // Decorativa: o nome completo está logo ao lado.
          alt=""
          width={56}
          height={56}
          loading="lazy"
          decoding="async"
          className="relative size-14 rounded-full border-[3px] border-white object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className={cn(
            'relative grid size-14 place-items-center rounded-full border-[3px] border-white font-display font-bold tracking-tight',
            texto.length >= 4 ? 'text-sm' : texto.length === 3 ? 'text-base' : 'text-lg',
            cor === 'azul' ? 'bg-azul-noite text-amarelo-luz' : 'bg-amarelo-luz text-azul-noite',
          )}
        >
          {texto}
        </span>
      )}
    </span>
  );
}

function LinksPerfil({ pessoa }: { pessoa: Integrante }) {
  const links = [
    { rotulo: 'GitHub', url: pessoa.github },
    { rotulo: 'LinkedIn', url: pessoa.linkedin },
  ].filter((link): link is { rotulo: string; url: string } => Boolean(link.url));

  if (links.length === 0) return null;

  return (
    <p className="mt-0.5 flex flex-wrap gap-x-3 text-sm">
      {links.map((link) => (
        <a
          key={link.rotulo}
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-6 items-center font-semibold text-azul-primario underline-offset-4 hover:underline"
        >
          {link.rotulo}
          <span className="sr-only"> de {pessoa.nome} (abre em nova aba)</span>
        </a>
      ))}
    </p>
  );
}
