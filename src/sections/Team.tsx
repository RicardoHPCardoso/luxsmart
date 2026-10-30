import { Icone } from '@/components/icons/icons';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EQUIPE, type AreaEquipe, type Integrante } from '@/data/equipe';
import { SECOES } from '@/data/navegacao';
import { SITE } from '@/data/site';
import { cn } from '@/lib/cn';
import { iniciais } from '@/lib/initials';

type CorAvatar = 'azul' | 'amarelo';

/** Equipe compacta: um card por área, com avatar de iniciais, nome e função. */
export function Team() {
  return (
    <Section id={SECOES.equipe} tema="dia">
      <div className="container-site">
        <SectionHeading
          sobretitulo="Equipe"
          titulo="Quem fez o LuxSmart"
          descricao={`Estudantes de ${SITE.curso} (${SITE.instituicao}), por área de atuação.`}
        />

        {/* Desktop: grade de 6 colunas com cards de 2; se a última linha tiver só 2 cards, ela fica centralizada. */}
        <ul role="list" className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {EQUIPE.map((area, i) => (
            <Reveal
              as="li"
              key={area.id}
              atraso={(i % 3) * 0.06}
              className={cn(
                'h-full lg:col-span-2',
                // Tablet (2 colunas): um card sobrando na última linha fica centralizado.
                EQUIPE.length % 2 === 1 &&
                  i === EQUIPE.length - 1 &&
                  'md:col-span-2 md:mx-auto md:w-[calc(50%-0.5rem)] lg:mx-0 lg:w-auto',
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
    <article className="group flex h-full flex-col rounded-2xl border border-linha bg-white p-5 shadow-cartao transition-[border-color,box-shadow] duration-300 hover:border-amarelo-luz hover:shadow-glow">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-azul-claro text-azul-noite transition-colors duration-300 group-hover:bg-amarelo-luz">
          <Icone nome={area.icone} />
        </span>
        <div>
          <h3 className="text-xl font-bold">{area.titulo}</h3>
          <p className="text-tinta-suave">{area.descricao}</p>
        </div>
      </div>

      <ul role="list" className="mt-4 grid gap-3 border-t border-linha pt-4">
        {area.integrantes.map((pessoa, j) => (
          <li key={pessoa.nome} className="flex items-center gap-3">
            <Avatar pessoa={pessoa} cor={(indiceArea + j) % 2 === 0 ? 'azul' : 'amarelo'} />
            <div className="min-w-0">
              <p className="font-semibold">{pessoa.nome}</p>
              <LinksPerfil pessoa={pessoa} />
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

/** Avatar com foto (se houver) ou iniciais do nome completo, nas cores do projeto. */
function Avatar({ pessoa, cor }: { pessoa: Integrante; cor: CorAvatar }) {
  const texto = iniciais(pessoa.nome);

  if (pessoa.foto) {
    return (
      <img
        src={`${import.meta.env.BASE_URL}${pessoa.foto}`}
        // Decorativa: o nome completo está logo ao lado.
        alt=""
        width={48}
        height={48}
        loading="lazy"
        decoding="async"
        className="size-12 shrink-0 rounded-full object-cover ring-2 ring-amarelo-luz"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid size-12 shrink-0 place-items-center rounded-full font-display font-bold tracking-tight ring-2',
        texto.length >= 4 ? 'text-sm' : 'text-base',
        cor === 'azul'
          ? 'bg-azul-noite text-amarelo-luz ring-amarelo-luz/60'
          : 'bg-amarelo-luz text-azul-noite ring-azul-primario/40',
      )}
    >
      {texto}
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
    <p className="flex flex-wrap gap-x-3">
      {links.map((link) => (
        <a
          key={link.rotulo}
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center font-semibold text-azul-primario underline-offset-4 hover:underline"
        >
          {link.rotulo}
          <span className="sr-only"> de {pessoa.nome} (abre em nova aba)</span>
        </a>
      ))}
    </p>
  );
}
