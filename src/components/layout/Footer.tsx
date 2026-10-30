import { Logo } from '@/components/brand/Logo';
import { NAVEGACAO } from '@/data/navegacao';
import { SITE } from '@/data/site';
import { useScrollTo } from '@/hooks/useScrollTo';
import { HowWeCalculate } from './HowWeCalculate';

/** Rodapé: "Como calculamos?" (fechado), links das seções e créditos. */
export function Footer() {
  const { aoClicarAncora } = useScrollTo();

  return (
    <footer className="tema-noite border-t border-linha-noite bg-azul-profundo">
      <div className="container-site grid gap-10 py-12">
        <HowWeCalculate />

        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
          <div className="max-w-md">
            <Logo />
            <p className="mt-3 text-nevoa">{SITE.descricao}</p>
            <p className="mt-4 text-nevoa">
              Projeto acadêmico · {SITE.curso} · {SITE.instituicao} · {SITE.cidade} · {SITE.ano}
            </p>
          </div>

          <nav aria-label="Rodapé">
            <ul className="grid grid-cols-2 gap-x-6">
              {NAVEGACAO.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={aoClicarAncora}
                    className="inline-flex min-h-11 min-w-11 items-center text-nevoa hover:text-amarelo-luz"
                  >
                    {item.rotulo}
                  </a>
                </li>
              ))}
              {SITE.repositorio && (
                <li className="col-span-2">
                  <a
                    href={SITE.repositorio}
                    className="inline-flex min-h-11 min-w-11 items-center text-nevoa hover:text-amarelo-luz"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Repositório no GitHub
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
