import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EQUIPE, type Integrante } from '@/data/equipe';
import { SECOES } from '@/data/navegacao';
import { SITE } from '@/data/site';

export function Team() {
  return (
    <Section id={SECOES.equipe} tema="dia">
      <div className="container-site">
        <SectionHeading
          sobretitulo="Equipe"
          titulo="Quem está acendendo essa ideia"
          descricao={<p>Projeto desenvolvido por estudantes do {SITE.instituicao}.</p>}
        />

        <ul
          role="list"
          className="mt-14 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
        >
          {EQUIPE.map((pessoa, i) => (
            <Reveal as="li" key={`${pessoa.nome}-${i}`} atraso={i * 0.06} className="h-full">
              <CardIntegrante pessoa={pessoa} />
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? '';
  const ultima = partes.length > 1 ? (partes.at(-1)?.[0] ?? '') : '';
  return (primeira + ultima).toUpperCase();
}

function CardIntegrante({ pessoa }: { pessoa: Integrante }) {
  const base = import.meta.env.BASE_URL;

  return (
    <article className="group flex h-full flex-col items-center rounded-2xl border border-linha bg-white p-6 text-center shadow-cartao transition-[box-shadow,border-color] duration-300 hover:border-amarelo-luz hover:shadow-glow">
      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute -inset-1.5 rounded-full bg-[conic-gradient(from_180deg,#1E5EFF,#FFC83D,#1E5EFF)] opacity-70 transition-opacity duration-300 group-hover:opacity-100"
        />
        {pessoa.foto ? (
          <img
            src={`${base}${pessoa.foto}`}
            alt={`Foto de ${pessoa.nome}`}
            width={96}
            height={96}
            loading="lazy"
            decoding="async"
            className="relative size-24 rounded-full border-4 border-white object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="relative grid size-24 place-items-center rounded-full border-4 border-white bg-azul-noite font-display text-2xl font-bold text-amarelo-luz"
          >
            {iniciais(pessoa.nome)}
          </span>
        )}
      </div>
      <h3 className="mt-5 text-lg font-bold">{pessoa.nome}</h3>
      <p className="mt-1 text-sm text-tinta-suave">{pessoa.funcao}</p>
      {pessoa.link && (
        <a
          href={pessoa.link}
          target="_blank"
          rel="noreferrer"
          className="mt-auto pt-4 text-sm font-semibold text-azul-primario underline-offset-4 hover:underline"
        >
          Perfil de {pessoa.nome}
        </a>
      )}
    </article>
  );
}
