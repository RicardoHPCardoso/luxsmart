import { ButtonLink } from '@/components/ui/Button';
import { INDAIATUBA } from '@/data/indaiatuba';
import { SECOES } from '@/data/navegacao';
import { useScrollTo } from '@/hooks/useScrollTo';
import { HeroBackground } from './HeroBackground';

/**
 * Início: nome do projeto, uma frase e o atalho para os resultados.
 * No celular a rua animada fica abaixo do texto; no desktop vira o fundo.
 */
export function Hero() {
  const { aoClicarAncora } = useScrollTo();

  return (
    <section
      id={SECOES.inicio}
      className="tema-noite relative isolate overflow-hidden lg:flex lg:min-h-[min(88svh,52rem)] lg:items-center"
    >
      <div className="relative z-10 container-site pt-24 pb-8 lg:py-28">
        <div className="max-w-xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.9375rem] font-medium text-nevoa">
            <span
              className="size-2 rounded-full bg-amarelo-luz shadow-glow-sm"
              aria-hidden="true"
            />
            Projeto acadêmico · {INDAIATUBA.cidade}
          </p>
          <h1 className="text-hero font-bold">
            Lux<span className="text-amarelo-luz glow-texto">Smart</span>
          </h1>
          <p className="mt-4 text-lg text-nevoa sm:text-xl">
            Poste inteligente que acende quando alguém passa e economiza energia no resto da noite.
          </p>
          <ButtonLink
            href={`#${SECOES.resultados}`}
            onClick={aoClicarAncora}
            tamanho="lg"
            className="mt-7"
          >
            Ver os resultados
          </ButtonLink>
        </div>
      </div>

      <div className="relative aspect-[15/8] w-full lg:absolute lg:inset-0 lg:-z-10 lg:aspect-auto">
        <HeroBackground />
        {/* Véu para o texto ficar legível sobre a cena no desktop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(to_right,rgb(5_13_28/0.92)_30%,transparent_72%)] lg:block"
        />
      </div>
    </section>
  );
}
